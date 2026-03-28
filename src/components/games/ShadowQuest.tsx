"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import Link from "next/link";

/* ═══════════════════════════════════════════
   SHADOW QUEST — A Dungeon Platformer
   Original game with sword combat, traps & 5 levels
   ═══════════════════════════════════════════ */

const W = 800, H = 500;
const GRAVITY = 0.55;
const JUMP = -11.5;
const SPEED = 3;
const COMBAT_SPEED = 1.8;
const ATK_DUR = 18;
const ATK_CD = 28;
const GUARD_CD = 70;

const keys: Record<string, boolean> = {};

// ── Types ──
interface Rect { x: number; y: number; w: number; h: number }
interface Player {
  x: number; y: number; w: number; h: number;
  vx: number; vy: number;
  hp: number; maxHp: number;
  facing: 1 | -1;
  grounded: boolean;
  sword: boolean;
  atkTimer: number; cd: number;
  blocking: boolean;
  hurtTimer: number;
  invincible: number;
  dead: boolean;
}
interface Guard {
  x: number; y: number; w: number; h: number;
  hp: number; maxHp: number;
  facing: 1 | -1;
  state: "patrol" | "chase" | "attack" | "hurt" | "dead";
  vx: number;
  pMin: number; pMax: number;
  alertR: number; atkR: number;
  atkTimer: number; cd: number;
  hurtTimer: number;
}
interface Platform extends Rect { loose?: boolean; falling?: boolean; fallVy?: number }
interface Spike extends Rect {}
interface Potion { x: number; y: number; collected: boolean }
interface Exit extends Rect {}
interface Particle { x: number; y: number; vx: number; vy: number; life: number; color: string; size: number }
interface Level {
  name: string; sub: string;
  platforms: Platform[]; guards: Guard[]; spikes: Spike[];
  potions: Potion[]; exit: Exit;
  start: { x: number; y: number };
  theme: { bg: string; bg2: string; plat: string; top: string };
}

function mkGuard(x: number, y: number, hp: number, pMin: number, pMax: number, alert = 180): Guard {
  return { x, y, w: 24, h: 40, hp, maxHp: hp, facing: -1, state: "patrol", vx: 1.2,
    pMin, pMax, alertR: alert, atkR: 38, atkTimer: 0, cd: 0, hurtTimer: 0 };
}

// ── Levels ──
function getLevels(): Level[] {
  const G = H - 40; // ground Y
  return [
    { // Level 1 — The Dungeon
      name: "The Dungeon", sub: "Learn to move",
      start: { x: 60, y: G - 40 },
      theme: { bg: "#08081a", bg2: "#12122a", plat: "#3a3a55", top: "#5a5a75" },
      platforms: [
        { x: 0, y: G, w: 280, h: 40 },
        { x: 340, y: G, w: 460, h: 40 },
        { x: 180, y: G - 90, w: 110, h: 16 },
        { x: 400, y: G - 160, w: 120, h: 16 },
        { x: 640, y: G - 100, w: 140, h: 16 },
      ],
      guards: [],
      spikes: [{ x: 290, y: G - 16, w: 40, h: 16 }],
      potions: [{ x: 440, y: G - 190, collected: false }],
      exit: { x: 740, y: G - 148, w: 28, h: 48 },
    },
    { // Level 2 — Guard Post
      name: "Guard Post", sub: "Draw your sword",
      start: { x: 50, y: G - 40 },
      theme: { bg: "#0a0a1c", bg2: "#161630", plat: "#3e3450", top: "#5e5470" },
      platforms: [
        { x: 0, y: G, w: 220, h: 40 },
        { x: 280, y: G, w: 260, h: 40 },
        { x: 600, y: G, w: 200, h: 40 },
        { x: 140, y: G - 110, w: 100, h: 16 },
        { x: 350, y: G - 140, w: 120, h: 16 },
        { x: 580, y: G - 110, w: 100, h: 16 },
      ],
      guards: [mkGuard(380, G - 40, 2, 290, 520)],
      spikes: [{ x: 228, y: G - 16, w: 44, h: 16 }, { x: 548, y: G - 16, w: 44, h: 16 }],
      potions: [{ x: 170, y: G - 140, collected: false }, { x: 620, y: G - 140, collected: false }],
      exit: { x: 740, y: G - 48, w: 28, h: 48 },
    },
    { // Level 3 — Trap Gallery
      name: "Trap Gallery", sub: "Watch your step",
      start: { x: 50, y: G - 40 },
      theme: { bg: "#0c0810", bg2: "#1a1226", plat: "#44344a", top: "#64546a" },
      platforms: [
        { x: 0, y: G, w: 150, h: 40 },
        { x: 200, y: G, w: 100, h: 40 },
        { x: 360, y: G, w: 80, h: 16, loose: true },
        { x: 480, y: G, w: 120, h: 40 },
        { x: 660, y: G, w: 140, h: 40 },
        { x: 120, y: G - 120, w: 80, h: 16 },
        { x: 260, y: G - 180, w: 100, h: 16 },
        { x: 440, y: G - 130, w: 80, h: 16, loose: true },
        { x: 580, y: G - 180, w: 100, h: 16 },
        { x: 700, y: G - 260, w: 100, h: 16 },
      ],
      guards: [mkGuard(500, G - 40, 2, 480, 590, 150)],
      spikes: [
        { x: 155, y: G - 16, w: 40, h: 16 },
        { x: 306, y: G - 16, w: 48, h: 16 },
        { x: 608, y: G - 16, w: 44, h: 16 },
      ],
      potions: [{ x: 290, y: G - 210, collected: false }, { x: 730, y: G - 290, collected: false }],
      exit: { x: 740, y: G - 308, w: 28, h: 48 },
    },
    { // Level 4 — The Palace
      name: "The Palace", sub: "Two guards await",
      start: { x: 50, y: G - 40 },
      theme: { bg: "#0a0612", bg2: "#1e162e", plat: "#4a3a5a", top: "#6a5a7a" },
      platforms: [
        { x: 0, y: G, w: 160, h: 40 },
        { x: 220, y: G, w: 140, h: 40 },
        { x: 420, y: G, w: 120, h: 40 },
        { x: 600, y: G, w: 200, h: 40 },
        { x: 100, y: G - 120, w: 100, h: 16 },
        { x: 260, y: G - 180, w: 100, h: 16 },
        { x: 420, y: G - 250, w: 110, h: 16 },
        { x: 580, y: G - 150, w: 90, h: 16 },
        { x: 620, y: G - 300, w: 120, h: 16 },
        { x: 200, y: G - 320, w: 80, h: 16, loose: true },
        { x: 400, y: G - 370, w: 100, h: 16 },
      ],
      guards: [
        mkGuard(260, G - 40, 3, 220, 350, 160),
        mkGuard(640, G - 40, 2, 600, 780, 140),
      ],
      spikes: [
        { x: 165, y: G - 16, w: 48, h: 16 },
        { x: 368, y: G - 16, w: 44, h: 16 },
        { x: 548, y: G - 16, w: 44, h: 16 },
      ],
      potions: [
        { x: 130, y: G - 150, collected: false },
        { x: 450, y: G - 280, collected: false },
        { x: 660, y: G - 330, collected: false },
      ],
      exit: { x: 430, y: G - 418, w: 28, h: 48 },
    },
    { // Level 5 — Tower Ascent
      name: "Tower Ascent", sub: "The final climb",
      start: { x: 50, y: G - 40 },
      theme: { bg: "#06060e", bg2: "#101024", plat: "#2e2e4e", top: "#4e4e6e" },
      platforms: [
        { x: 0, y: G, w: 120, h: 40 },
        { x: 180, y: G - 70, w: 80, h: 16 },
        { x: 320, y: G, w: 100, h: 40 },
        { x: 300, y: G - 140, w: 80, h: 16, loose: true },
        { x: 480, y: G - 90, w: 80, h: 16 },
        { x: 160, y: G - 210, w: 90, h: 16 },
        { x: 380, y: G - 240, w: 80, h: 16 },
        { x: 540, y: G - 180, w: 100, h: 16 },
        { x: 600, y: G - 300, w: 100, h: 16 },
        { x: 400, y: G - 350, w: 80, h: 16, loose: true },
        { x: 200, y: G - 380, w: 90, h: 16 },
        { x: 500, y: G - 410, w: 120, h: 16 },
        { x: 660, y: G - 40, w: 140, h: 40 },
      ],
      guards: [
        mkGuard(340, G - 40, 3, 320, 410, 120),
        mkGuard(620, G - 40, 3, 660, 780, 140),
        mkGuard(550, G - 220, 2, 540, 630, 120),
      ],
      spikes: [
        { x: 125, y: G - 16, w: 50, h: 16 },
        { x: 430, y: G - 16, w: 44, h: 16 },
        { x: 550, y: G - 16, w: 44, h: 16 },
      ],
      potions: [
        { x: 190, y: G - 240, collected: false },
        { x: 550, y: G - 440, collected: false },
        { x: 630, y: G - 330, collected: false },
      ],
      exit: { x: 540, y: G - 458, w: 28, h: 48 },
    },
  ];
}

// ── Collision ──
function hit(a: Rect, b: Rect) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

// ── Drawing ──
function drawBg(ctx: CanvasRenderingContext2D, t: Level["theme"], f: number) {
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, t.bg); g.addColorStop(1, t.bg2);
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  // Wall texture
  ctx.strokeStyle = "rgba(255,255,255,0.015)"; ctx.lineWidth = 1;
  for (let x = 0; x < W; x += 48) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
  for (let y = 0; y < H; y += 36) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
  // Torch glows
  for (const tx of [120, 400, 680]) {
    const fl = Math.sin(f * 0.12 + tx) * 4;
    const gr = ctx.createRadialGradient(tx, 40 + fl, 0, tx, 40 + fl, 70);
    gr.addColorStop(0, "rgba(255,150,40,0.07)"); gr.addColorStop(1, "transparent");
    ctx.fillStyle = gr; ctx.fillRect(tx - 70, 0, 140, 110);
    // Torch bracket
    ctx.fillStyle = "rgba(180,120,40,0.3)";
    ctx.fillRect(tx - 2, 30, 4, 20);
    ctx.fillStyle = "rgba(255,200,50,0.5)";
    ctx.fillRect(tx - 3, 25 + fl * 0.3, 6, 6);
  }
}

function drawPlat(ctx: CanvasRenderingContext2D, p: Platform, t: Level["theme"]) {
  if (p.falling && p.fallVy && p.fallVy > 5) return; // fallen off screen
  ctx.fillStyle = p.loose ? "#5a4a3a" : t.plat;
  ctx.fillRect(p.x, p.y, p.w, p.h);
  ctx.fillStyle = p.loose ? "#7a6a5a" : t.top;
  ctx.fillRect(p.x, p.y, p.w, 3);
  if (p.h >= 30) {
    ctx.strokeStyle = "rgba(0,0,0,0.15)"; ctx.lineWidth = 1;
    for (let bx = p.x + 40; bx < p.x + p.w; bx += 40) { ctx.beginPath(); ctx.moveTo(bx, p.y); ctx.lineTo(bx, p.y + p.h); ctx.stroke(); }
    if (p.h > 20) { ctx.beginPath(); ctx.moveTo(p.x, p.y + 20); ctx.lineTo(p.x + p.w, p.y + 20); ctx.stroke(); }
  }
  // Edge highlights
  ctx.fillStyle = "rgba(255,255,255,0.06)";
  ctx.fillRect(p.x, p.y, 2, p.h);
  ctx.fillStyle = "rgba(0,0,0,0.1)";
  ctx.fillRect(p.x + p.w - 2, p.y, 2, p.h);
}

function drawSpike(ctx: CanvasRenderingContext2D, s: Spike) {
  const n = Math.floor(s.w / 10);
  for (let i = 0; i < n; i++) {
    const sx = s.x + i * (s.w / n);
    ctx.fillStyle = "#9a9aaa";
    ctx.beginPath();
    ctx.moveTo(sx, s.y + s.h);
    ctx.lineTo(sx + s.w / n / 2, s.y);
    ctx.lineTo(sx + s.w / n, s.y + s.h);
    ctx.fill();
    ctx.fillStyle = "#b0b0c0";
    ctx.beginPath();
    ctx.moveTo(sx + s.w / n / 2, s.y);
    ctx.lineTo(sx + s.w / n / 2 + 2, s.y + s.h * 0.6);
    ctx.lineTo(sx + s.w / n / 2 - 1, s.y + s.h * 0.6);
    ctx.fill();
  }
}

function drawPotion(ctx: CanvasRenderingContext2D, p: Potion, f: number) {
  if (p.collected) return;
  const bob = Math.sin(f * 0.06 + p.x * 0.1) * 3;
  const y = p.y + bob;
  // Bottle
  ctx.fillStyle = "#2a6a2a"; ctx.fillRect(p.x + 3, y + 6, 10, 10);
  ctx.fillStyle = "#3aba3a"; ctx.fillRect(p.x + 4, y + 7, 8, 8);
  // Neck
  ctx.fillStyle = "#2a6a2a"; ctx.fillRect(p.x + 5, y + 2, 6, 5);
  // Cork
  ctx.fillStyle = "#8a6a3a"; ctx.fillRect(p.x + 6, y, 4, 3);
  // Glow
  ctx.fillStyle = `rgba(60,200,60,${0.15 + Math.sin(f * 0.08) * 0.1})`;
  ctx.beginPath(); ctx.arc(p.x + 8, y + 11, 8, 0, Math.PI * 2); ctx.fill();
}

function drawExit(ctx: CanvasRenderingContext2D, e: Exit, f: number) {
  const glow = 0.4 + Math.sin(f * 0.05) * 0.2;
  // Archway
  ctx.fillStyle = "#2a2a4a";
  ctx.fillRect(e.x - 4, e.y, e.w + 8, e.h);
  ctx.beginPath(); ctx.arc(e.x + e.w / 2, e.y, e.w / 2 + 4, Math.PI, 0); ctx.fill();
  // Portal light
  ctx.fillStyle = `rgba(0,220,255,${glow})`;
  ctx.fillRect(e.x + 2, e.y + 4, e.w - 4, e.h - 4);
  // Inner glow
  ctx.fillStyle = `rgba(140,200,255,${glow * 0.6})`;
  ctx.fillRect(e.x + 6, e.y + 8, e.w - 12, e.h - 12);
  // Arrow
  ctx.fillStyle = "#fff"; ctx.font = "bold 14px monospace"; ctx.textAlign = "center";
  ctx.fillText("↑", e.x + e.w / 2, e.y + e.h / 2 + 5);
  // Glow effect
  ctx.save();
  ctx.shadowColor = "rgba(0,200,255,0.5)"; ctx.shadowBlur = 15;
  ctx.fillStyle = "transparent"; ctx.fillRect(e.x, e.y, e.w, e.h);
  ctx.restore();
}

function drawChar(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number,
  facing: 1 | -1, isPlayer: boolean, f: number, moving: boolean,
  atkTimer: number, blocking: boolean, sword: boolean, hurtTimer: number) {
  ctx.save();
  if (facing === -1) { ctx.translate(x + w / 2, 0); ctx.scale(-1, 1); ctx.translate(-(x + w / 2), 0); }

  // Flash when hurt
  if (hurtTimer > 0 && f % 4 < 2) { ctx.globalAlpha = 0.5; }

  // Legs
  const la = moving ? Math.sin(f * 0.28) * 4 : 0;
  ctx.fillStyle = isPlayer ? "#2a2a3e" : "#2a1818";
  ctx.fillRect(x + 3, y + 28, 6, 12 + la);
  ctx.fillRect(x + w - 9, y + 28, 6, 12 - la);

  // Body
  ctx.fillStyle = isPlayer ? "#4a6fa5" : "#8b2020";
  ctx.fillRect(x + 2, y + 14, w - 4, 16);
  // Belt
  ctx.fillStyle = isPlayer ? "#3a5080" : "#601818";
  ctx.fillRect(x + 2, y + 26, w - 4, 3);

  // Head
  ctx.fillStyle = "#d4a76a";
  ctx.beginPath(); ctx.arc(x + w / 2, y + 10, 7, 0, Math.PI * 2); ctx.fill();

  // Headgear
  if (isPlayer) {
    // Hood/turban
    ctx.fillStyle = "#e0e0f0";
    ctx.beginPath(); ctx.arc(x + w / 2, y + 8, 8, Math.PI, 0); ctx.fill();
    ctx.fillRect(x + 4, y + 4, w - 8, 5);
    // Tail
    ctx.fillStyle = "#d0d0e0";
    ctx.fillRect(x + w - 6, y + 5, 4, 10);
  } else {
    // Helmet
    ctx.fillStyle = "#4a0a0a";
    ctx.beginPath(); ctx.moveTo(x + 4, y + 10); ctx.lineTo(x + w / 2, y - 3); ctx.lineTo(x + w - 4, y + 10); ctx.fill();
    ctx.fillRect(x + 4, y + 3, w - 8, 7);
    // Visor
    ctx.fillStyle = "#2a0606";
    ctx.fillRect(x + w / 2 + 2, y + 7, 6, 3);
  }

  // Eye
  ctx.fillStyle = "#1a1a2e";
  ctx.fillRect(x + w / 2 + 3, y + 9, 2, 2);

  // Sword & combat
  if (sword || !isPlayer) {
    if (atkTimer > 0) {
      const angle = (1 - atkTimer / ATK_DUR) * Math.PI * 0.6 - 0.4;
      ctx.save();
      ctx.translate(x + w - 2, y + 18);
      ctx.rotate(angle);
      ctx.fillStyle = isPlayer ? "#c8c8d8" : "#808090";
      ctx.fillRect(0, -2, 24, 3);
      ctx.fillStyle = "#d4a030";
      ctx.fillRect(-3, -3, 5, 5);
      ctx.restore();
    } else if (blocking && isPlayer) {
      ctx.fillStyle = "#707080";
      ctx.fillRect(x + w - 2, y + 10, 4, 18);
      ctx.fillStyle = "#505060";
      ctx.fillRect(x + w + 1, y + 8, 3, 22);
    } else {
      ctx.fillStyle = isPlayer ? "#c8c8d8" : "#808090";
      ctx.fillRect(x + w - 2, y + 20, 16, 2);
      ctx.fillStyle = "#d4a030";
      ctx.fillRect(x + w - 4, y + 18, 4, 6);
    }
  }

  ctx.globalAlpha = 1;
  ctx.restore();
}

function drawHUD(ctx: CanvasRenderingContext2D, hp: number, maxHp: number, lives: number, lvl: number, name: string, score: number) {
  ctx.fillStyle = "rgba(0,0,0,0.55)"; ctx.fillRect(0, 0, W, 34);
  // HP
  ctx.fillStyle = "#aaa"; ctx.font = "bold 11px monospace"; ctx.textAlign = "left";
  ctx.fillText("HP", 10, 22);
  for (let i = 0; i < maxHp; i++) {
    ctx.fillStyle = i < hp ? "#ef4444" : "rgba(255,255,255,0.15)";
    ctx.fillRect(32 + i * 22, 13, 18, 10);
  }
  // Lives
  ctx.fillStyle = "#ef4444"; ctx.font = "bold 13px monospace";
  ctx.fillText(`♥×${lives}`, 140, 22);
  // Level
  ctx.fillStyle = "#8B5CF6"; ctx.textAlign = "center"; ctx.font = "bold 12px monospace";
  ctx.fillText(`${lvl + 1}: ${name}`, W / 2, 22);
  // Score
  ctx.fillStyle = "#FBBF24"; ctx.textAlign = "right";
  ctx.fillText(`★ ${score}`, W - 12, 22);
  // Controls hint
  ctx.fillStyle = "rgba(255,255,255,0.25)"; ctx.font = "10px monospace";
  ctx.fillText("S:sword Z:atk X:block", W - 12, 10);
}

// ── Main Component ──
export default function ShadowQuest() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [screen, setScreen] = useState<"menu" | "play" | "levelDone" | "dead" | "win">("menu");
  const [lvlIdx, setLvlIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);

  const gRef = useRef<{
    player: Player; level: Level; particles: Particle[];
    frame: number; score: number; lives: number; lvlIdx: number;
    state: string; shakeTimer: number;
  } | null>(null);

  const initLevel = useCallback((idx: number, s?: { score: number; lives: number }) => {
    const levels = getLevels();
    const lvl: Level = JSON.parse(JSON.stringify(levels[idx]));
    gRef.current = {
      player: {
        x: lvl.start.x, y: lvl.start.y, w: 24, h: 40,
        vx: 0, vy: 0, hp: 4, maxHp: 4,
        facing: 1, grounded: false,
        sword: false, atkTimer: 0, cd: 0,
        blocking: false, hurtTimer: 0, invincible: 0, dead: false,
      },
      level: lvl, particles: [], frame: 0,
      score: s?.score ?? 0, lives: s?.lives ?? 3,
      lvlIdx: idx, state: "play", shakeTimer: 0,
    };
  }, []);

  const startGame = useCallback(() => {
    setLvlIdx(0); setScore(0); setLives(3);
    initLevel(0); setScreen("play");
  }, [initLevel]);

  const nextLevel = useCallback(() => {
    const g = gRef.current; if (!g) return;
    const next = g.lvlIdx + 1;
    if (next >= getLevels().length) { setScreen("win"); return; }
    setLvlIdx(next); initLevel(next, { score: g.score, lives: g.lives });
    setScore(g.score); setLives(g.lives); setScreen("play");
  }, [initLevel]);

  // Keys
  useEffect(() => {
    const dn = (e: KeyboardEvent) => { keys[e.key.toLowerCase()] = true; if (["arrowup","arrowdown","arrowleft","arrowright"," "].includes(e.key.toLowerCase())) e.preventDefault(); };
    const up = (e: KeyboardEvent) => { keys[e.key.toLowerCase()] = false; };
    window.addEventListener("keydown", dn); window.addEventListener("keyup", up);
    return () => { window.removeEventListener("keydown", dn); window.removeEventListener("keyup", up); };
  }, []);

  // Game loop
  useEffect(() => {
    if (screen !== "play") return;
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    let anim: number;

    const loop = () => {
      const g = gRef.current;
      if (!g || g.state !== "play") { anim = requestAnimationFrame(loop); return; }
      g.frame++;
      const p = g.player;
      const lvl = g.level;
      if (g.shakeTimer > 0) g.shakeTimer--;

      // ── Input ──
      const spd = p.sword ? COMBAT_SPEED : SPEED;
      if (keys["arrowleft"] || keys["a"]) { p.vx = -spd; p.facing = -1; }
      else if (keys["arrowright"] || keys["d"]) { p.vx = spd; p.facing = 1; }
      else { p.vx *= 0.65; if (Math.abs(p.vx) < 0.3) p.vx = 0; }

      if ((keys["arrowup"] || keys["w"] || keys[" "]) && p.grounded) { p.vy = JUMP; p.grounded = false; }

      // Toggle sword
      if (keys["s"] && g.frame % 15 === 0) { p.sword = !p.sword; p.blocking = false; }
      // Attack
      if (keys["z"] && p.sword && p.atkTimer === 0 && p.cd === 0) { p.atkTimer = ATK_DUR; p.cd = ATK_CD; }
      // Block
      p.blocking = !!(keys["x"] && p.sword && p.atkTimer === 0);

      if (p.atkTimer > 0) p.atkTimer--;
      if (p.cd > 0) p.cd--;
      if (p.hurtTimer > 0) p.hurtTimer--;
      if (p.invincible > 0) p.invincible--;

      // ── Loose floors ──
      for (const pl of lvl.platforms) {
        if (pl.loose && pl.falling) {
          pl.fallVy = (pl.fallVy || 0) + 0.3;
          pl.y += pl.fallVy;
        }
      }

      // ── Physics ──
      p.vy += GRAVITY;
      p.x += p.vx; p.y += p.vy;
      p.grounded = false;

      // Platform collision
      for (const pl of lvl.platforms) {
        if (pl.falling && pl.fallVy && pl.fallVy > 3) continue;
        if (hit(p, pl)) {
          if (p.vy > 0 && p.y + p.h - p.vy <= pl.y + 6) {
            p.y = pl.y - p.h; p.vy = 0; p.grounded = true;
            if (pl.loose && !pl.falling) {
              pl.falling = true; pl.fallVy = 0;
            }
          } else if (p.vy < 0 && p.y - p.vy >= pl.y + pl.h - 4) {
            p.y = pl.y + pl.h; p.vy = 0;
          } else {
            if (p.vx > 0) p.x = pl.x - p.w; else if (p.vx < 0) p.x = pl.x + pl.w;
            p.vx = 0;
          }
        }
      }

      // Boundaries
      if (p.x < 0) p.x = 0; if (p.x + p.w > W) p.x = W - p.w;
      // Fall death
      if (p.y > H + 60) { die(g); anim = requestAnimationFrame(loop); return; }

      // ── Spikes ──
      if (p.invincible <= 0) {
        for (const sp of lvl.spikes) {
          if (hit(p, sp)) { hurtPlayer(g, 1); break; }
        }
      }

      // ── Potions ──
      for (const pot of lvl.potions) {
        if (!pot.collected && hit(p, { x: pot.x, y: pot.y, w: 16, h: 16 })) {
          pot.collected = true;
          p.hp = Math.min(p.hp + 1, p.maxHp);
          g.score += 5; setScore(g.score);
          spawnParticles(g, pot.x + 8, pot.y + 8, 6, "#3aba3a");
        }
      }

      // ── Guard AI & Combat ──
      for (const gu of lvl.guards) {
        if (gu.state === "dead") continue;
        if (gu.hurtTimer > 0) { gu.hurtTimer--; if (gu.hurtTimer === 0 && gu.hp > 0) gu.state = "patrol"; continue; }
        if (gu.cd > 0) gu.cd--;

        const dx = p.x - gu.x;
        const dist = Math.abs(dx);

        // Guard platform collision
        let guGrounded = false;
        for (const pl of lvl.platforms) {
          if (pl.falling && pl.fallVy && pl.fallVy > 3) continue;
          if (hit(gu, pl) && gu.y + gu.h <= pl.y + 8) {
            gu.y = pl.y - gu.h; guGrounded = true;
          }
        }
        if (!guGrounded) { gu.y += 3; } // simple gravity for guards

        if (dist < gu.alertR && Math.abs(p.y - gu.y) < 60) {
          // Chase / Attack
          gu.facing = dx > 0 ? 1 : -1;
          if (dist < gu.atkR) {
            // Attack
            if (gu.cd === 0) {
              gu.atkTimer = ATK_DUR;
              gu.cd = GUARD_CD + Math.floor(Math.random() * 30);
              gu.state = "attack";
            }
            if (gu.atkTimer > 0) {
              gu.atkTimer--;
              // Hit check (damage window: frames 12-6)
              if (gu.atkTimer < 12 && gu.atkTimer > 6 && p.invincible <= 0) {
                const atkBox: Rect = { x: gu.x + (gu.facing === 1 ? gu.w : -28), y: gu.y + 8, w: 28, h: 24 };
                if (hit(p, atkBox)) {
                  if (p.blocking && p.facing !== gu.facing) {
                    // Blocked!
                    spawnParticles(g, p.x + p.w / 2, p.y + 18, 4, "#aaa");
                    gu.x -= gu.facing * 15; // push guard back
                  } else {
                    hurtPlayer(g, 1);
                  }
                }
              }
            } else {
              gu.state = "chase";
            }
          } else {
            // Move toward player
            gu.state = "chase";
            gu.x += gu.facing * gu.vx * 1.3;
          }
        } else {
          // Patrol
          gu.state = "patrol";
          gu.x += gu.vx;
          if (gu.x <= gu.pMin || gu.x + gu.w >= gu.pMax) gu.vx *= -1;
          gu.facing = gu.vx > 0 ? 1 : -1;
        }

        // Player attack hits guard
        if (p.atkTimer > 0 && p.atkTimer < 12 && p.atkTimer > 6) {
          const pAtkBox: Rect = { x: p.x + (p.facing === 1 ? p.w : -26), y: p.y + 8, w: 26, h: 24 };
          if (hit(pAtkBox, gu) && gu.hurtTimer === 0) {
            gu.hp--;
            gu.hurtTimer = 20;
            gu.state = "hurt";
            gu.x += p.facing * 20;
            g.shakeTimer = 6;
            spawnParticles(g, gu.x + 12, gu.y + 15, 8, "#ef4444");
            if (gu.hp <= 0) {
              gu.state = "dead";
              g.score += 50; setScore(g.score);
              spawnParticles(g, gu.x + 12, gu.y + 20, 12, "#8b2020");
            }
          }
        }
      }

      // ── Exit ──
      if (hit(p, lvl.exit)) {
        g.state = "done";
        g.score += 100; setScore(g.score);
        setScreen("levelDone");
      }

      // ── Particles ──
      g.particles = g.particles.filter(pt => {
        pt.x += pt.vx; pt.y += pt.vy; pt.vy += 0.12; pt.life--;
        return pt.life > 0;
      });

      // ═══ DRAW ═══
      ctx.save();
      if (g.shakeTimer > 0) {
        ctx.translate(Math.random() * 6 - 3, Math.random() * 4 - 2);
      }

      drawBg(ctx, lvl.theme, g.frame);
      for (const pl of lvl.platforms) drawPlat(ctx, pl, lvl.theme);
      for (const sp of lvl.spikes) drawSpike(ctx, sp);
      for (const pot of lvl.potions) drawPotion(ctx, pot, g.frame);
      drawExit(ctx, lvl.exit, g.frame);

      // Guards
      for (const gu of lvl.guards) {
        if (gu.state === "dead") continue;
        drawChar(ctx, gu.x, gu.y, gu.w, gu.h, gu.facing, false, g.frame,
          gu.state === "patrol" || gu.state === "chase", gu.atkTimer, false, true, gu.hurtTimer);
        // Guard HP bar
        if (gu.hp < gu.maxHp) {
          ctx.fillStyle = "rgba(0,0,0,0.5)"; ctx.fillRect(gu.x - 4, gu.y - 10, gu.w + 8, 4);
          ctx.fillStyle = "#ef4444"; ctx.fillRect(gu.x - 4, gu.y - 10, (gu.w + 8) * gu.hp / gu.maxHp, 4);
        }
      }

      // Player (blink when invincible)
      if (p.invincible <= 0 || g.frame % 6 < 3) {
        drawChar(ctx, p.x, p.y, p.w, p.h, p.facing, true, g.frame,
          Math.abs(p.vx) > 0.5 && p.grounded, p.atkTimer, p.blocking, p.sword, p.hurtTimer);
      }

      // Particles
      for (const pt of g.particles) {
        ctx.globalAlpha = pt.life / 25;
        ctx.fillStyle = pt.color;
        ctx.fillRect(pt.x, pt.y, pt.size, pt.size);
      }
      ctx.globalAlpha = 1;

      drawHUD(ctx, p.hp, p.maxHp, g.lives, g.lvlIdx, lvl.name, g.score);
      ctx.restore();

      anim = requestAnimationFrame(loop);
    };

    function hurtPlayer(g: NonNullable<typeof gRef.current>, dmg: number) {
      g.player.hp -= dmg;
      g.player.invincible = 60;
      g.player.hurtTimer = 15;
      g.shakeTimer = 8;
      spawnParticles(g, g.player.x + 12, g.player.y + 20, 6, "#ef4444");
      if (g.player.hp <= 0) die(g);
    }

    function die(g: NonNullable<typeof gRef.current>) {
      g.lives--;
      setLives(g.lives);
      if (g.lives <= 0) { g.state = "dead"; setScreen("dead"); return; }
      // Respawn
      g.player.x = g.level.start.x; g.player.y = g.level.start.y;
      g.player.vx = 0; g.player.vy = 0;
      g.player.hp = g.player.maxHp;
      g.player.invincible = 90; g.player.sword = false;
      g.player.atkTimer = 0; g.player.cd = 0;
      g.player.blocking = false; g.player.grounded = false;
    }

    function spawnParticles(g: NonNullable<typeof gRef.current>, x: number, y: number, n: number, color: string) {
      for (let i = 0; i < n; i++) {
        g.particles.push({
          x, y, vx: (Math.random() - 0.5) * 5, vy: (Math.random() - 1) * 4,
          life: 20 + Math.random() * 10, color, size: 2 + Math.random() * 2,
        });
      }
    }

    anim = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(anim);
  }, [screen]);

  // ── Overlays ──
  const overlay = () => {
    if (screen === "menu") return (
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#06060e]/95 z-10 rounded-xl">
        <h1 className="text-4xl font-extrabold mb-1 bg-clip-text text-transparent"
          style={{ backgroundImage: "linear-gradient(135deg, #8B5CF6, #06B6D4)" }}>Shadow Quest</h1>
        <p className="text-sm text-[var(--fg-3)] mb-1">A Dungeon Platformer</p>
        <p className="text-xs text-[var(--fg-3)] mb-6">5 Levels • Sword Combat • Traps & Potions</p>
        <button onClick={startGame}
          className="px-8 py-3 rounded-xl bg-[var(--violet)] text-white font-semibold text-sm hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] transition-all mb-6">
          Start Game
        </button>
        <div className="text-[11px] text-[var(--fg-3)] space-y-1.5 text-center bg-white/5 rounded-xl px-6 py-4 border border-white/10">
          <p className="text-[var(--fg-2)] font-semibold mb-2">Controls</p>
          <p><span className="text-[var(--fg-2)]">← →</span> or <span className="text-[var(--fg-2)]">A D</span> — Move</p>
          <p><span className="text-[var(--fg-2)]">↑ / Space / W</span> — Jump</p>
          <p><span className="text-[var(--fg-2)]">S</span> — Draw / Sheathe Sword</p>
          <p><span className="text-[var(--fg-2)]">Z</span> — Attack (sword drawn)</p>
          <p><span className="text-[var(--fg-2)]">X</span> — Block (sword drawn)</p>
          <p className="pt-1 text-[var(--fg-3)]">Avoid <span className="text-[#9a9aaa]">▲ spikes</span> • Collect <span className="text-[#3aba3a]">potions</span> • Defeat <span className="text-[#ef4444]">guards</span></p>
        </div>
      </div>
    );
    if (screen === "levelDone") return (
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#06060e]/90 z-10 rounded-xl">
        <div className="text-4xl mb-3">⚔️</div>
        <h2 className="text-2xl font-bold text-[var(--fg)] mb-2">Level Complete!</h2>
        <p className="text-[var(--fg-2)] text-sm mb-1">Score: <span className="text-[var(--violet)] font-bold">{score}</span></p>
        <p className="text-[var(--fg-3)] text-xs mb-6">+100 completion bonus</p>
        <button onClick={nextLevel}
          className="px-8 py-3 rounded-xl bg-[var(--violet)] text-white font-semibold text-sm hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] transition-all">
          {lvlIdx < 4 ? "Next Level →" : "See Results"}
        </button>
      </div>
    );
    if (screen === "dead") return (
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#06060e]/90 z-10 rounded-xl">
        <div className="text-4xl mb-3">💀</div>
        <h2 className="text-2xl font-bold text-[#ef4444] mb-2">Game Over</h2>
        <p className="text-[var(--fg-2)] text-sm mb-6">Score: <span className="text-[var(--violet)] font-bold">{score}</span></p>
        <button onClick={startGame}
          className="px-8 py-3 rounded-xl bg-[var(--violet)] text-white font-semibold text-sm hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] transition-all">
          Try Again
        </button>
      </div>
    );
    if (screen === "win") return (
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#06060e]/90 z-10 rounded-xl">
        <div className="text-4xl mb-3">🏆</div>
        <h2 className="text-2xl font-bold text-[var(--fg)] mb-2">Victory!</h2>
        <p className="text-[var(--fg-2)] text-sm mb-1">All 5 dungeons conquered!</p>
        <p className="text-lg font-bold text-[var(--amber)] mb-6">Score: {score}</p>
        <div className="flex gap-3">
          <button onClick={startGame}
            className="px-6 py-2.5 rounded-xl bg-[var(--violet)] text-white font-semibold text-sm hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] transition-all">
            Play Again
          </button>
          <Link href="/games"
            className="px-6 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-sm font-medium text-[var(--fg)] hover:border-[var(--border-hover)] transition-colors">
            Back
          </Link>
        </div>
      </div>
    );
    return null;
  };

  return (
    <div className="min-h-screen px-4 py-8 sm:py-12">
      <div className="max-w-[850px] mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Link href="/games" className="text-sm text-[var(--fg-3)] hover:text-[var(--fg)] transition-colors flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            Games
          </Link>
          <h1 className="text-xl sm:text-2xl font-bold text-[var(--fg)]">Shadow Quest</h1>
          <div className="w-16" />
        </div>
        <div className="relative rounded-xl overflow-hidden border border-[var(--border)] shadow-2xl" style={{ aspectRatio: `${W}/${H}` }}>
          <canvas ref={canvasRef} width={W} height={H} className="w-full h-full block" />
          {overlay()}
        </div>
        {/* Mobile controls */}
        <div className="grid grid-cols-5 gap-2 mt-4 sm:hidden">
          <button onTouchStart={() => { keys["arrowleft"] = true; }} onTouchEnd={() => { keys["arrowleft"] = false; }}
            className="h-14 rounded-xl bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center text-xl text-[var(--fg-2)] active:bg-white/10">←</button>
          <button onTouchStart={() => { keys["arrowright"] = true; }} onTouchEnd={() => { keys["arrowright"] = false; }}
            className="h-14 rounded-xl bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center text-xl text-[var(--fg-2)] active:bg-white/10">→</button>
          <button onTouchStart={() => { keys[" "] = true; }} onTouchEnd={() => { keys[" "] = false; }}
            className="h-14 rounded-xl bg-[var(--cyan)]/15 border border-[var(--cyan)]/25 flex items-center justify-center text-sm text-[var(--cyan)] active:bg-[var(--cyan)]/30">Jump</button>
          <button onTouchStart={() => { keys["z"] = true; }} onTouchEnd={() => { keys["z"] = false; }}
            className="h-14 rounded-xl bg-[var(--rose)]/15 border border-[var(--rose)]/25 flex items-center justify-center text-sm text-[var(--rose)] active:bg-[var(--rose)]/30">Atk</button>
          <button onTouchStart={() => { keys["x"] = true; }} onTouchEnd={() => { keys["x"] = false; }}
            className="h-14 rounded-xl bg-[var(--violet)]/15 border border-[var(--violet)]/25 flex items-center justify-center text-sm text-[var(--violet)] active:bg-[var(--violet)]/30">Blk</button>
        </div>
        <div className="flex justify-center gap-2 mt-2 sm:hidden">
          <button onTouchStart={() => { keys["s"] = true; setTimeout(() => { keys["s"] = false; }, 100); }}
            className="h-10 px-4 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-xs text-[var(--fg-2)] active:bg-white/10">⚔ Sword</button>
        </div>
      </div>
    </div>
  );
}
