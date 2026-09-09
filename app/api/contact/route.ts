import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, subject, message, honeypot } = body;

    // Anti-spam honeypot detection
    if (honeypot) {
      // Silently discard bot submission
      return NextResponse.json({ success: true, message: "Message sent successfully." });
    }

    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: "Please enter your full name (at least 2 characters)." },
        { status: 400 }
      );
    }

    const normalizedEmail = String(email || "").toLowerCase().trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    if (!subject || typeof subject !== "string" || subject.trim().length < 3) {
      return NextResponse.json(
        { success: false, error: "Please enter a subject (at least 3 characters)." },
        { status: 400 }
      );
    }

    if (!message || typeof message !== "string" || message.trim().length < 10) {
      return NextResponse.json(
        { success: false, error: "Please enter a message of at least 10 characters." },
        { status: 400 }
      );
    }

    // Sanitize message content length
    const cleanMessage = message.trim().slice(0, 5000);
    const cleanSubject = subject.trim().slice(0, 200);
    const cleanName = name.trim().slice(0, 100);

    console.log(`[Contact Form Submission] From: ${cleanName} <${normalizedEmail}> | Subject: "${cleanSubject}"`);

    return NextResponse.json({
      success: true,
      message: "Thank you for contacting ManaHumanizeAI. Your inquiry has been received. Our team will review it and get back to you shortly.",
    });
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to send message. Please try again or email us directly." },
      { status: 500 }
    );
  }
}
