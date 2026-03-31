import { NextRequest, NextResponse } from "next/server";
import { createRoom } from "@/lib/pong-rooms";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const name = String(body.name || "").trim().slice(0, 20);
  if (!name) return NextResponse.json({ error: "Name required" }, { status: 400 });

  const result = createRoom(name);
  return NextResponse.json(result);
}
