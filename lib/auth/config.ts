import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "../db/client";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
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
          console.warn("Database lookup failed during auth, testing demo fallback credentials:", dbErr);
        }

        // 2. Demo fallback credentials (works even before database seeding)
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

        if (
          normalizedEmail === "user@humanizeai.com" &&
          credentials.password === "UserPass123!"
        ) {
          return {
            id: "user-default-id",
            name: "Alex Johnson",
            email: "user@humanizeai.com",
            role: "USER",
          };
        }

        throw new Error("Invalid email or password. Please try again.");
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role || "USER";
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
