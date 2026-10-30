"use server";
import { z } from "zod";
import { db } from "@/lib/db";
const schema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(150),
  phone: z.string().trim().regex(/^[+0-9\s-]{7,20}$/, "Enter a valid phone number"),
  subject: z.string().trim().min(3).max(150),
  message: z.string().trim().min(10).max(2000),
});
export type ContactState = { ok: boolean; message: string; errors?: Record<string, string[]> };
const recent = new Map<string, number>(); // best-effort throttle per instance
export async function submitInquiry(_: ContactState, fd: FormData): Promise<ContactState> {
  if (fd.get("website")) return { ok: true, message: "Thank you. We will be in touch." }; // honeypot
  const started = Number(fd.get("t"));
  if (!started || Date.now() - started < 3000) return { ok: false, message: "Please take a moment to complete the form." };
  const raw: Record<string, FormDataEntryValue> = {};
  fd.forEach((v, k) => { raw[k] = v; });
  const parsed = schema.safeParse(raw);
  if (!parsed.success) return { ok: false, message: "Please correct the highlighted fields.", errors: parsed.error.flatten().fieldErrors };
  const key = parsed.data.email;
  if (Date.now() - (recent.get(key) ?? 0) < 30000) return { ok: false, message: "Please wait before sending another inquiry." };
  recent.set(key, Date.now());
  try { await db.inquiry.create({ data: parsed.data }); }
  catch { return { ok: false, message: "We could not save your inquiry. Please call or WhatsApp us instead." }; }
  return { ok: true, message: "Thank you. Your inquiry has been received." };
}
