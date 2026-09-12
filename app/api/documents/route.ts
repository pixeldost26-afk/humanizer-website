import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/session";
import { saveDocumentSchema } from "@/lib/validation/schemas";
import { countWords, countCharacters } from "@/lib/utils";
import prisma from "@/lib/db/client";

export async function GET(req: NextRequest) {
  const { user, response: authResponse } = await requireAuth();
  if (authResponse || !user) {
    return authResponse || NextResponse.json({ success: false, error: "Authentication required." }, { status: 401 });
  }

  try {
    if (user.id === "guest-user") {
      return NextResponse.json({ success: true, data: [], error: null });
    }

    const { searchParams } = new URL(req.url);
    const tool = searchParams.get("tool");
    const search = searchParams.get("search");

    const where: any = { userId: user.id };
    if (tool && tool !== "ALL") {
      where.toolType = tool;
    }
    if (search && search.trim()) {
      where.OR = [
        { title: { contains: search } },
        { content: { contains: search } },
      ];
    }

    const documents = await prisma.document.findMany({
      where,
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json({ success: true, data: documents, error: null });
  } catch (error) {
    console.error("Error fetching documents:", error);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve documents." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const { user, response: authResponse } = await requireAuth();
  if (authResponse || !user) {
    return authResponse || NextResponse.json({ success: false, error: "Authentication required." }, { status: 401 });
  }

  const contentType = req.headers.get("content-type") || "";

  // 1. Handle File Upload
  if (contentType.includes("multipart/form-data")) {
    try {
      const formData = await req.formData();
      const file = formData.get("file") as File | null;

      if (!file) {
        return NextResponse.json(
          { success: false, error: "No file was uploaded." },
          { status: 400 }
        );
      }

      // Validate size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        return NextResponse.json(
          { success: false, error: "File exceeds maximum size limit of 5MB." },
          { status: 400 }
        );
      }

      const fileName = file.name;
      const extension = fileName.split(".").pop()?.toLowerCase();

      if (!["txt", "md", "json", "docx", "pdf"].includes(extension || "")) {
        return NextResponse.json(
          {
            success: false,
            error: "Unsupported file format. Please upload TXT, MD, DOCX, or PDF files.",
          },
          { status: 400 }
        );
      }

      // Extract and sanitize text
      let extractedText = "";
      if (extension === "txt" || extension === "md" || extension === "json") {
        extractedText = await file.text();
      } else {
        const buffer = await file.arrayBuffer();
        const decoder = new TextDecoder("utf-8", { fatal: false });
        const raw = decoder.decode(buffer);
        extractedText = raw.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, " ").trim();
        if (extractedText.length > 30000) {
          extractedText = extractedText.slice(0, 30000);
        }
      }

      return NextResponse.json({
        success: true,
        data: {
          fileName,
          fileSize: file.size,
          extractedText,
          wordCount: countWords(extractedText),
          charCount: countCharacters(extractedText),
        },
        error: null,
      });
    } catch (uploadErr) {
      console.error("Document upload parse error:", uploadErr);
      return NextResponse.json(
        { success: false, error: "Failed to parse document content." },
        { status: 500 }
      );
    }
  }

  // 2. Handle JSON Save Document
  try {
    const body = await req.json();
    const parsed = saveDocumentSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.errors[0]?.message },
        { status: 400 }
      );
    }

    const { title, content, toolType, tags } = parsed.data;
    const wordCount = countWords(content);
    const charCount = countCharacters(content);

    if (user.id === "guest-user") {
      return NextResponse.json({
        success: true,
        data: {
          id: `guest-doc-${Date.now()}`,
          userId: "guest-user",
          title,
          content,
          toolType,
          wordCount,
          charCount,
          tags: tags || null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        error: null,
      });
    }

    const doc = await prisma.document.create({
      data: {
        userId: user.id,
        title,
        content,
        toolType,
        wordCount,
        charCount,
        tags: tags || null,
      },
    });

    return NextResponse.json({ success: true, data: doc, error: null });
  } catch (error) {
    console.error("Error creating document:", error);
    return NextResponse.json(
      { success: false, error: "Failed to save document." },
      { status: 500 }
    );
  }
}
