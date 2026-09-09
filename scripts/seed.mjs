import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 ManaHumanizeAI Database Seeder initializing...");

  const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase().trim();
  const adminPassword = process.env.ADMIN_PASSWORD;

  // 1. Provision Admin only if environment variables are explicitly supplied
  if (adminEmail && adminPassword) {
    if (adminPassword.length < 8) {
      console.warn("⚠️ ADMIN_PASSWORD must be at least 8 characters long. Skipping admin creation.");
    } else {
      const adminPasswordHash = await bcrypt.hash(adminPassword, 10);
      const admin = await prisma.user.upsert({
        where: { email: adminEmail },
        update: {
          role: "ADMIN",
          passwordHash: adminPasswordHash,
        },
        create: {
          name: process.env.ADMIN_NAME || "Administrator",
          email: adminEmail,
          role: "ADMIN",
          passwordHash: adminPasswordHash,
          creditBalance: {
            create: {
              monthlyCredits: 250000,
              usedCredits: 0,
              bonusCredits: 10000,
            },
          },
          subscription: {
            create: {
              planId: "BUSINESS",
              status: "ACTIVE",
              currentPeriodEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
            },
          },
        },
      });
      console.log(`✅ Secure Administrator account provisioned: ${admin.email}`);
    }
  } else {
    console.log(
      "ℹ️ No ADMIN_EMAIL / ADMIN_PASSWORD provided in environment. Skipping automatic admin provisioning."
    );
  }

  // 2. Telemetry initial baseline (only if table is completely empty)
  const existingRequestCount = await prisma.toolRequest.count();
  if (existingRequestCount === 0) {
    const tools = ["HUMANIZER", "DETECTOR", "WRITER", "PARAPHRASER", "GRAMMAR", "SUMMARIZER", "TONE"];
    for (let i = 0; i < 15; i++) {
      const randomTool = tools[Math.floor(Math.random() * tools.length)];
      const words = Math.floor(60 + Math.random() * 350);
      await prisma.toolRequest.create({
        data: {
          tool: randomTool,
          wordsProcessed: words,
          inputTokens: Math.round(words * 1.3),
          outputTokens: Math.round(words * 1.2),
          durationMs: Math.floor(400 + Math.random() * 900),
          status: "SUCCESS",
        },
      });
    }
    console.log("✅ Initial system telemetry baseline initialized.");
  }

  console.log("🎉 Database seeding check completed successfully.");
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
