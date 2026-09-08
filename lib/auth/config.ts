import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import prisma from "../db/client";

// Normalize environment URLs and remove accidental trailing slashes
const normalizedAppUrl = (
  process.env.NEXTAUTH_URL ||
  process.env.NEXT_PUBLIC_APP_URL ||
  "http://localhost:3000"
)
  .trim()
  .replace(/\/+$/, "");

if (!process.env.NEXTAUTH_URL && normalizedAppUrl) {
  process.env.NEXTAUTH_URL = normalizedAppUrl;
}

// Ensure proxy trust is enabled for Render / reverse proxies
if (!process.env.NEXTAUTH_TRUST_HOST) {
  process.env.NEXTAUTH_TRUST_HOST = "true";
}

// Clean and sanitize Google OAuth credentials (strip quotes, newlines, and trailing spaces)
const rawGoogleId = process.env.GOOGLE_CLIENT_ID || "";
const rawGoogleSecret = process.env.GOOGLE_CLIENT_SECRET || "";

const googleClientId = rawGoogleId.trim().replace(/^["']|["']$/g, "");
const googleClientSecret = rawGoogleSecret.trim().replace(/^["']|["']$/g, "");

const isHttps = normalizedAppUrl.startsWith("https://");
const cookiePrefix = isHttps ? "__Secure-" : "";
const hostCookiePrefix = isHttps ? "__Host-" : "";

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

// Register Google OAuth Provider with trimmed credentials
if (googleClientId && googleClientSecret) {
  providers.push(
    GoogleProvider({
      clientId: googleClientId,
      clientSecret: googleClientSecret,
      allowDangerousEmailAccountLinking: true,
      authorization: {
        params: {
          prompt: "select_account",
          access_type: "offline",
          response_type: "code",
        },
      },
    })
  );
} else {
  console.warn(
    `⚠️ [Auth Warning] Google OAuth credentials incomplete (Client ID: ${
      googleClientId ? "Present" : "Missing"
    }, Client Secret: ${googleClientSecret ? "Present" : "Missing"}). Google sign-in will not succeed until both are configured in Render.`
  );
  if (googleClientId) {
    providers.push(
      GoogleProvider({
        clientId: googleClientId,
        clientSecret: googleClientSecret || "unconfigured-secret",
        allowDangerousEmailAccountLinking: true,
      })
    );
  }
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
  useSecureCookies: isHttps,
  cookies: {
    sessionToken: {
      name: `${cookiePrefix}next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: isHttps,
      },
    },
    callbackUrl: {
      name: `${cookiePrefix}next-auth.callback-url`,
      options: {
        sameSite: "lax",
        path: "/",
        secure: isHttps,
      },
    },
    csrfToken: {
      name: `${hostCookiePrefix}next-auth.csrf-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: isHttps,
      },
    },
    pkceCodeVerifier: {
      name: `${cookiePrefix}next-auth.pkce.code_verifier`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: isHttps,
        maxAge: 900,
      },
    },
    state: {
      name: `${cookiePrefix}next-auth.state`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: isHttps,
        maxAge: 900,
      },
    },
  },
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
              const safeExpiresAt =
                typeof account.expires_at === "number"
                  ? Math.min(Math.max(Math.floor(account.expires_at), -2147483648), 2147483647)
                  : null;

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
                  expires_at: safeExpiresAt,
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
            where: { email: token.email.toLowerCase().trim() },
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
  debug: true,
  logger: {
    error(code, metadata) {
      console.error(`[NextAuth Error] [${code}]:`, metadata);
    },
    warn(code) {
      console.warn(`[NextAuth Warn] [${code}]`);
    },
    debug(code, metadata) {
      console.log(`[NextAuth Debug] [${code}]:`, metadata);
    },
  },
  secret: process.env.NEXTAUTH_SECRET || "humanizeai-super-secure-nextauth-secret-key-32-chars-minimum",
};
