import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/session";
import prisma from "@/lib/db/client";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { user, response: authResponse } = await requireAuth();
  if (authResponse || !user) {
    return authResponse || NextResponse.json({ success: false, error: "Authentication required." }, { status: 401 });
  }

  try {
    const doc = await prisma.document.findFirst({
      where: { id: params.id, userId: user.id },
    });

    if (!doc) {
      return NextResponse.json(
        { success: false, error: "Document not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: doc, error: null });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: "Failed to retrieve document." },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { user, response: authResponse } = await requireAuth();
  if (authResponse || !user) {
    return authResponse || NextResponse.json({ success: false, error: "Authentication required." }, { status: 401 });
  }

  try {
    const body = await req.json();
    const updated = await prisma.document.updateMany({
      where: { id: params.id, userId: user.id },
      data: {
        ...(body.title ? { title: body.title } : {}),
        ...(body.content ? { content: body.content } : {}),
        ...(typeof body.isFavorite === "boolean" ? { isFavorite: body.isFavorite } : {}),
      },
    });

    if (updated.count === 0) {
      return NextResponse.json(
        { success: false, error: "Document not found or unauthorized." },
        { status: 404 }
      );
    }

    const doc = await prisma.document.findUnique({ where: { id: params.id } });
    return NextResponse.json({ success: true, data: doc, error: null });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: "Failed to update document." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { user, response: authResponse } = await requireAuth();
  if (authResponse || !user) {
    return authResponse || NextResponse.json({ success: false, error: "Authentication required." }, { status: 401 });
  }

  try {
    const deleted = await prisma.document.deleteMany({
      where: { id: params.id, userId: user.id },
    });

    if (deleted.count === 0) {
      return NextResponse.json(
        { success: false, error: "Document not found or already deleted." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: { deletedId: params.id }, error: null });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: "Failed to delete document." },
      { status: 500 }
    );
  }
}
