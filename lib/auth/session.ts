import { getServerSession } from "next-auth/next";
import { authOptions } from "./config";
import { NextResponse } from "next/server";

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  return session?.user as
    | { id: string; name?: string; email: string; role: "USER" | "ADMIN"; image?: string }
    | undefined;
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    return {
      user: null,
      response: NextResponse.json(
        { success: false, error: "Authentication required. Please sign in." },
        { status: 401 }
      ),
    };
  }
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
