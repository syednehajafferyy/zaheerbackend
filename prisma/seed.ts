import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
const db = new PrismaClient();
async function main() {
  const { ADMIN_NAME = "Administrator", ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD || ADMIN_PASSWORD.length < 12)
    throw new Error("Set ADMIN_EMAIL and ADMIN_PASSWORD (12+ characters) before seeding.");
  await db.admin.upsert({
    where: { email: ADMIN_EMAIL.toLowerCase() }, update: {},
    create: { name: ADMIN_NAME, email: ADMIN_EMAIL.toLowerCase(), password: await bcrypt.hash(ADMIN_PASSWORD, 12) },
  });
  console.log("Admin ready:", ADMIN_EMAIL);
}
main().finally(() => db.$disconnect());
