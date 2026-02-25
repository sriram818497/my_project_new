import bcrypt from "bcrypt";
import { prisma } from "../config/prisma";

const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase() || "admin@proteccio.com";
const adminName = process.env.ADMIN_NAME?.trim() || "System Administrator";
const adminPassword = process.env.ADMIN_PASSWORD?.trim() || "admin123";

const run = async () => {
  const existing = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (existing) {
    console.log(`Admin already exists: ${adminEmail}`);
    return;
  }

  const passwordHash = await bcrypt.hash(adminPassword, 12);

  await prisma.user.create({
    data: {
      email: adminEmail,
      name: adminName,
      role: "admin",
      passwordHash,
      isActive: true,
    },
  });

  console.log(`Admin created: ${adminEmail}`);
};

run()
  .catch((error) => {
    console.error("Failed to seed admin:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

