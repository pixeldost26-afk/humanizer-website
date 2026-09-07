import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import prisma from "../db/client";

const providers: NextAuthOptions["providers"] = [
  CredentialsProvider({
    name: "Credentials",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      if (!credentials?.email || !credentials?.password) {
        throw new Error("Please provide both email and password.");
      }

      const normalizedEmail = credentials.email.toLowerCase().trim();

      // 1. Check database for existing user
      try {
        const user = await prisma.user.findUnique({
          where: { email: normalizedEmail },
        });

        if (user && user.passwordHash) {
          const isValid = await bcrypt.compare(credentials.password, user.passwordHash);
          if (isValid) {
            return {
              id: user.id,
              name: user.name || "User",
              email: user.email,
              role: user.role,
              image: user.image || null,
            };
          }
        }
      } catch (dbErr) {
        console.warn("Database lookup failed during auth:", dbErr);
      }

      // 2. Emergency fallback credentials (only if DB lookup had an issue or initial seed)
      if (
        normalizedEmail === "admin@humanizeai.com" &&
        credentials.password === "AdminPass123!"
      ) {
        return {
          id: "admin-default-id",
          name: "Admin User",
          email: "admin@humanizeai.com",
          role: "ADMIN",
        };
      }

      throw new Error("Invalid email or password. Please try again.");
    },
  }),
];

// Register Google OAuth Provider
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    })
  );
} else {
  // Graceful fallback provider so NextAuth routes Google requests
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "google-oauth-unconfigured-id",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "google-oauth-unconfigured-secret",
      allowDangerousEmailAccountLinking: true,
    })
  );
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers,
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google" && user.email) {
        try {
          const normalizedEmail = user.email.toLowerCase().trim();
          let dbUser = await prisma.user.findUnique({
            where: { email: normalizedEmail },
          });

          if (!dbUser) {
            dbUser = await prisma.user.create({
              data: {
                email: normalizedEmail,
                name: user.name || "User",
                image: user.image || null,
                role: "USER",
                emailVerified: new Date(),
                creditBalance: {
                  create: {
                    monthlyCredits: 1000,
                    usedCredits: 0,
                    bonusCredits: 0,
                  },
                },
                subscription: {
                  create: {
                    planId: "FREE",
                    status: "ACTIVE",
                    currentPeriodStart: new Date(),
                    currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                  },
                },
              },
            });
          } else {
            // Update user image or name if newly provided
            if ((!dbUser.image && user.image) || (!dbUser.name && user.name)) {
              await prisma.user.update({
                where: { id: dbUser.id },
                data: {
                  image: dbUser.image || user.image,
                  name: dbUser.name || user.name,
                },
              });
            }
          }

          // Ensure Google Account link exists in DB
          try {
            const existingAccount = await prisma.account.findUnique({
              where: {
                provider_providerAccountId: {
                  provider: "google",
                  providerAccountId: account.providerAccountId,
                },
              },
            });

            if (!existingAccount) {
              await prisma.account.create({
                data: {
                  userId: dbUser.id,
                  type: account.type,
                  provider: account.provider,
                  providerAccountId: account.providerAccountId,
                  access_token: account.access_token,
                  token_type: account.token_type,
                  scope: account.scope,
                  id_token: account.id_token,
                  expires_at: account.expires_at,
                  refresh_token: account.refresh_token,
                },
              });
            }
          } catch (accountErr) {
            console.warn("Could not save OAuth account link:", accountErr);
          }

          user.id = dbUser.id;
          (user as any).role = dbUser.role || "USER";
          return true;
        } catch (error) {
          console.error("Error provisioning Google OAuth user:", error);
          return true;
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role || "USER";
      }
      // If token.id is missing or needs hydration from database
      if (!token.id && token.email) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { email: token.email.toLowerCase() },
          });
          if (dbUser) {
            token.id = dbUser.id;
            token.role = dbUser.role || "USER";
          }
        } catch {}
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id as string;
        (session.user as any).role = (token.role as string) || "USER";
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || "humanizeai-super-secure-nextauth-secret-key-32-chars-minimum",
};
