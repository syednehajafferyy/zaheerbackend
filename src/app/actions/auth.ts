"use server";
import { redirect } from "next/navigation";
import { login, logout } from "@/lib/auth";
export async function signIn(_: { error?: string }, fd: FormData) {
  const ok = await login(String(fd.get("email") ?? ""), String(fd.get("password") ?? ""));
  if (!ok) return { error: "Email or password is incorrect." };
  redirect("/admin/dashboard");
}
export async function signOut() { logout(); redirect("/admin/login"); }
