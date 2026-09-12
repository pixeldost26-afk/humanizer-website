import { getServerSession } from "next-auth/next";
import { authOptions } from "./config";
import { NextResponse } from "next/server";

export const GUEST_USER = {
  id: "guest-user",
  name: "Guest",
  email: "guest@manahumanize.com",
  role: "USER" as const,
};

export async function getCurrentUser() {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user) {
      return session.user as
        | { id: string; name?: string; email: string; role: "USER" | "ADMIN"; image?: string }
        | undefined;
    }
  } catch {
    // ignore session retrieval error
  }
  return GUEST_USER;
}

export async function requireAuth() {
  const user = (await getCurrentUser()) || GUEST_USER;
  return { user, response: null };
}

export async function requireAdmin() {
  const { user, response } = await requireAuth();
  if (response || !user) {
    return { user: null, response };
  }

  if (user.role !== "ADMIN") {
    return {
      user: null,
      response: NextResponse.json(
        { success: false, error: "Forbidden. Admin privileges required." },
        { status: 403 }
      ),
    };
  }

  return { user, response: null };
}

