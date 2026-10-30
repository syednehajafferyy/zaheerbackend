"use client";
import { useFormState } from "react-dom";
import { signIn } from "@/app/actions/auth";
export default function Login() {
  const [s, action] = useFormState(signIn, {} as { error?: string });
  return (<main className="min-h-screen grid place-items-center px-6">
    <form action={action} className="w-full max-w-sm grid gap-4">
      <h1 className="font-display text-2xl">Admin sign in</h1>
      <input name="email" type="email" required placeholder="Email" className="border border-sand px-3 py-2" />
      <input name="password" type="password" required placeholder="Password" className="border border-sand px-3 py-2" />
      {s.error && <p role="alert" className="text-red-800">{s.error}</p>}
      <button className="bg-forest text-paper py-3">Sign in</button></form></main>);
}
