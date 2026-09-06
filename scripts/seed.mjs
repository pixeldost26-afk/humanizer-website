import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding HumanizeAI database...");

  const adminPasswordHash = await bcrypt.hash("AdminPass123!", 10);
  const userPasswordHash = await bcrypt.hash("UserPass123!", 10);

  // 1. Create or upsert Admin
  const admin = await prisma.user.upsert({
    where: { email: "admin@humanizeai.com" },
    update: {
      role: "ADMIN",
      passwordHash: adminPasswordHash,
    },
    create: {
      name: "Admin User",
      email: "admin@humanizeai.com",
      role: "ADMIN",
      passwordHash: adminPasswordHash,
      creditBalance: {
        create: {
          monthlyCredits: 250000,
          usedCredits: 1450,
          bonusCredits: 10000,
        },
      },
      subscription: {
        create: {
          planId: "BUSINESS",
          status: "ACTIVE",
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
      },
    },
  });
  console.log("✅ Admin user ready:", admin.email);

  // 2. Create or upsert Regular Pro User
  const user = await prisma.user.upsert({
    where: { email: "user@humanizeai.com" },
    update: {
      passwordHash: userPasswordHash,
    },
    create: {
      name: "Alex Johnson",
      email: "user@humanizeai.com",
      role: "USER",
      passwordHash: userPasswordHash,
      creditBalance: {
        create: {
          monthlyCredits: 50000,
          usedCredits: 3820,
          bonusCredits: 500,
        },
      },
      subscription: {
        create: {
          planId: "PRO",
          status: "ACTIVE",
          currentPeriodEnd: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
        },
      },
    },
  });
  console.log("✅ Demo user ready:", user.email);

  // 3. Seed Sample Documents & Generations for Alex Johnson
  const sampleDocs = [
    {
      title: "Quarterly Marketing Strategy Memo",
      content:
        "In today's fast-moving market, our primary goal is building authentic customer connections. Rather than relying on generic outreach, we are focusing on genuine educational content and active community discussions.",
      toolType: "HUMANIZER",
      wordCount: 32,
      charCount: 228,
      tags: "marketing, strategy",
    },
    {
      title: "AI Detection Scan: Research Abstract",
      content:
        "Furthermore, the empirical observations substantiate the theoretical framework. The intricate tapestry of multifaceted variables demonstrates a pivotal correlation across all parameters.",
      toolType: "DETECTOR",
      wordCount: 22,
      charCount: 184,
      tags: "research, analysis",
    },
    {
      title: "Product Launch Email Draft",
      content:
        "Subject: We just released HumanizeAI 2.0!\n\nHey everyone, we've spent the past six months rebuilding our writing assistant from the ground up. Try it today and see how natural your drafts become.",
      toolType: "WRITER",
      wordCount: 36,
      charCount: 215,
      tags: "email, launch",
    },
  ];

  for (const doc of sampleDocs) {
    const createdDoc = await prisma.document.create({
      data: {
        userId: user.id,
        ...doc,
      },
    });

    await prisma.generation.create({
      data: {
        userId: user.id,
        documentId: createdDoc.id,
        tool: doc.toolType,
        inputSnippet: doc.content.slice(0, 100),
        outputText: doc.content,
        wordCount: doc.wordCount,
        creditsCharged: 5,
      },
    });
  }

  // 4. Seed tool requests for analytics
  const tools = ["HUMANIZER", "DETECTOR", "WRITER", "PARAPHRASER", "GRAMMAR", "SUMMARIZER", "TONE"];
  for (let i = 0; i < 20; i++) {
    const randomTool = tools[Math.floor(Math.random() * tools.length)];
    const words = Math.floor(50 + Math.random() * 450);
    await prisma.toolRequest.create({
      data: {
        userId: i % 2 === 0 ? user.id : admin.id,
        tool: randomTool,
        wordsProcessed: words,
        inputTokens: Math.round(words * 1.3),
        outputTokens: Math.round(words * 1.2),
        durationMs: Math.floor(400 + Math.random() * 1200),
        status: "SUCCESS",
      },
    });
  }

  // 5. Seed daily usage records
  for (let d = 0; d < 7; d++) {
    const date = new Date(Date.now() - d * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
    await prisma.usage.upsert({
      where: {
        userId_date: {
          userId: user.id,
          date,
        },
      },
      update: {},
      create: {
        userId: user.id,
        date,
        wordsTotal: Math.floor(400 + Math.random() * 800),
        checksCount: Math.floor(3 + Math.random() * 8),
      },
    });
  }

  console.log("🎉 Database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
