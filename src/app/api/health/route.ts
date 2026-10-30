import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "Zaheer Seed Corporation Backend API",
    time: new Date().toISOString()
  });
}
