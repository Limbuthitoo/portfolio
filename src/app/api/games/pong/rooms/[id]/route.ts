import { NextRequest, NextResponse } from "next/server";
import { joinRoom, getRoomInfo, syncState } from "@/lib/pong-rooms";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const info = getRoomInfo(id);
  if (!info) return NextResponse.json({ error: "Room not found" }, { status: 404 });
  return NextResponse.json(info);
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const name = String(body.name || "").trim().slice(0, 20);
  if (!name) return NextResponse.json({ error: "Name required" }, { status: 400 });

  const result = joinRoom(id, name);
  if ("error" in result) return NextResponse.json(result, { status: 400 });
  return NextResponse.json(result);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const playerId = String(body.playerId || "");
  if (!playerId) return NextResponse.json({ error: "Player ID required" }, { status: 400 });

  const result = syncState(id, playerId, {
    paddleY: Number(body.paddleY) ?? 0.5,
    ball: body.ball || undefined,
    scores: body.scores || undefined,
  });

  if ("error" in result) return NextResponse.json(result, { status: 404 });
  return NextResponse.json(result);
}
