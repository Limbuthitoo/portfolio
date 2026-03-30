import { NextRequest, NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

const REDIS_KEY = 'portfolio:tetris:highscores';

interface HighScore {
  name: string;
  score: number;
  level: number;
  date: string;
}

function getRedis(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (url && token) return new Redis({ url, token });
  return null;
}

// In-memory fallback for local dev
let localScores: HighScore[] = [];

async function getScores(): Promise<HighScore[]> {
  const r = getRedis();
  if (r) {
    const data = await r.get<HighScore[]>(REDIS_KEY);
    return data || [];
  }
  return localScores;
}

async function saveScores(scores: HighScore[]): Promise<void> {
  const r = getRedis();
  if (r) {
    await r.set(REDIS_KEY, scores);
  } else {
    localScores = scores;
  }
}

export async function GET() {
  const scores = await getScores();
  return NextResponse.json(scores.slice(0, 3));
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const name = String(body.name || '').trim().slice(0, 20);
  const score = Number(body.score);
  const level = Number(body.level) || 1;

  if (!name || !score || score <= 0) {
    return NextResponse.json({ error: 'Invalid name or score' }, { status: 400 });
  }

  const scores = await getScores();
  const entry: HighScore = { name, score, level, date: new Date().toISOString() };

  scores.push(entry);
  scores.sort((a, b) => b.score - a.score);
  const top3 = scores.slice(0, 3);

  await saveScores(top3);
  return NextResponse.json(top3);
}
