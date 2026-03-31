"use client";

import { useRef, useEffect, useState, useCallback } from "react";

// ── Constants ──
const CANVAS_W = 800;
const CANVAS_H = 500;
const PADDLE_W = 12;
const PADDLE_H = 80;
const BALL_SIZE = 10;
const PADDLE_MARGIN = 20;
const WIN_SCORE = 7;
const BALL_SPEED = 5;
const PADDLE_SPEED = 6;

type Difficulty = "easy" | "medium" | "hard";

const AI_CONFIG: Record<Difficulty, { speed: number; reaction: number; errorRange: number }> = {
  easy: { speed: 3, reaction: 0.6, errorRange: 40 },
  medium: { speed: 4.5, reaction: 0.8, errorRange: 15 },
  hard: { speed: 6, reaction: 0.95, errorRange: 5 },
};

interface GameState {
  playerY: number;
  aiY: number;
  ballX: number;
  ballY: number;
  ballVX: number;
  ballVY: number;
  playerScore: number;
  aiScore: number;
  phase: "menu" | "playing" | "paused" | "scored" | "finished";
  difficulty: Difficulty;
}

export default function RetroPong() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<GameState>({
    playerY: CANVAS_H / 2,
    aiY: CANVAS_H / 2,
    ballX: CANVAS_W / 2,
    ballY: CANVAS_H / 2,
    ballVX: 0,
    ballVY: 0,
    playerScore: 0,
    aiScore: 0,
    phase: "menu",
    difficulty: "medium",
  });
  const keysRef = useRef<Set<string>>(new Set());
  const animRef = useRef<number>(0);
  const touchRef = useRef<number | null>(null);
  const [, forceRender] = useState(0);
  const [phase, setPhase] = useState<GameState["phase"]>("menu");
  const [scores, setScores] = useState([0, 0]);
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");

  const resetBall = useCallback((direction: number) => {
    const s = stateRef.current;
    s.ballX = CANVAS_W / 2;
    s.ballY = CANVAS_H / 2;
    const angle = (Math.random() * Math.PI) / 4 - Math.PI / 8;
    s.ballVX = direction * BALL_SPEED * Math.cos(angle);
    s.ballVY = BALL_SPEED * Math.sin(angle);
  }, []);

  const startGame = useCallback((diff: Difficulty) => {
    const s = stateRef.current;
    s.playerY = CANVAS_H / 2;
    s.aiY = CANVAS_H / 2;
    s.playerScore = 0;
    s.aiScore = 0;
    s.difficulty = diff;
    s.phase = "playing";
    setDifficulty(diff);
    setPhase("playing");
    setScores([0, 0]);
    resetBall(Math.random() > 0.5 ? 1 : -1);
  }, [resetBall]);

  // ── Game loop ──
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let lastTime = 0;

    const loop = (time: number) => {
      const dt = lastTime ? Math.min((time - lastTime) / 16.667, 2) : 1;
      lastTime = time;

      const s = stateRef.current;

      if (s.phase === "playing") {
        // Player paddle
        const keys = keysRef.current;
        if (keys.has("ArrowUp") || keys.has("w")) {
          s.playerY = Math.max(PADDLE_H / 2, s.playerY - PADDLE_SPEED * dt);
        }
        if (keys.has("ArrowDown") || keys.has("s")) {
          s.playerY = Math.min(CANVAS_H - PADDLE_H / 2, s.playerY + PADDLE_SPEED * dt);
        }

        // Touch control
        if (touchRef.current !== null) {
          const targetY = Math.max(PADDLE_H / 2, Math.min(CANVAS_H - PADDLE_H / 2, touchRef.current));
          const diff = targetY - s.playerY;
          s.playerY += Math.sign(diff) * Math.min(Math.abs(diff), PADDLE_SPEED * 1.5 * dt);
        }

        // AI paddle
        const ai = AI_CONFIG[s.difficulty];
        if (Math.random() < ai.reaction) {
          const targetY = s.ballY + (Math.random() - 0.5) * ai.errorRange;
          const diff = targetY - s.aiY;
          s.aiY += Math.sign(diff) * Math.min(Math.abs(diff), ai.speed * dt);
        }
        s.aiY = Math.max(PADDLE_H / 2, Math.min(CANVAS_H - PADDLE_H / 2, s.aiY));

        // Ball movement
        s.ballX += s.ballVX * dt;
        s.ballY += s.ballVY * dt;

        // Top/bottom bounce
        if (s.ballY <= BALL_SIZE / 2) {
          s.ballY = BALL_SIZE / 2;
          s.ballVY = Math.abs(s.ballVY);
        }
        if (s.ballY >= CANVAS_H - BALL_SIZE / 2) {
          s.ballY = CANVAS_H - BALL_SIZE / 2;
          s.ballVY = -Math.abs(s.ballVY);
        }

        // Player paddle collision (left)
        if (
          s.ballX - BALL_SIZE / 2 <= PADDLE_MARGIN + PADDLE_W &&
          s.ballX - BALL_SIZE / 2 >= PADDLE_MARGIN &&
          s.ballY >= s.playerY - PADDLE_H / 2 &&
          s.ballY <= s.playerY + PADDLE_H / 2
        ) {
          s.ballX = PADDLE_MARGIN + PADDLE_W + BALL_SIZE / 2;
          const relY = (s.ballY - s.playerY) / (PADDLE_H / 2);
          const angle = relY * (Math.PI / 4);
          const speed = Math.sqrt(s.ballVX * s.ballVX + s.ballVY * s.ballVY) * 1.05;
          s.ballVX = Math.abs(Math.cos(angle) * speed);
          s.ballVY = Math.sin(angle) * speed;
        }

        // AI paddle collision (right)
        if (
          s.ballX + BALL_SIZE / 2 >= CANVAS_W - PADDLE_MARGIN - PADDLE_W &&
          s.ballX + BALL_SIZE / 2 <= CANVAS_W - PADDLE_MARGIN &&
          s.ballY >= s.aiY - PADDLE_H / 2 &&
          s.ballY <= s.aiY + PADDLE_H / 2
        ) {
          s.ballX = CANVAS_W - PADDLE_MARGIN - PADDLE_W - BALL_SIZE / 2;
          const relY = (s.ballY - s.aiY) / (PADDLE_H / 2);
          const angle = relY * (Math.PI / 4);
          const speed = Math.sqrt(s.ballVX * s.ballVX + s.ballVY * s.ballVY) * 1.05;
          s.ballVX = -Math.abs(Math.cos(angle) * speed);
          s.ballVY = Math.sin(angle) * speed;
        }

        // Score
        if (s.ballX < 0) {
          s.aiScore++;
          setScores([s.playerScore, s.aiScore]);
          if (s.aiScore >= WIN_SCORE) {
            s.phase = "finished";
            setPhase("finished");
          } else {
            s.phase = "scored";
            setPhase("scored");
            setTimeout(() => {
              s.phase = "playing";
              setPhase("playing");
              resetBall(1);
            }, 800);
          }
        }
        if (s.ballX > CANVAS_W) {
          s.playerScore++;
          setScores([s.playerScore, s.aiScore]);
          if (s.playerScore >= WIN_SCORE) {
            s.phase = "finished";
            setPhase("finished");
          } else {
            s.phase = "scored";
            setPhase("scored");
            setTimeout(() => {
              s.phase = "playing";
              setPhase("playing");
              resetBall(-1);
            }, 800);
          }
        }
      }

      // ── Draw ──
      ctx.fillStyle = "#0a0a0a";
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

      // Center line
      ctx.setLineDash([8, 8]);
      ctx.strokeStyle = "rgba(255,255,255,0.15)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(CANVAS_W / 2, 0);
      ctx.lineTo(CANVAS_W / 2, CANVAS_H);
      ctx.stroke();
      ctx.setLineDash([]);

      // Scores
      ctx.fillStyle = "rgba(255,255,255,0.2)";
      ctx.font = "bold 64px monospace";
      ctx.textAlign = "center";
      ctx.fillText(String(s.playerScore), CANVAS_W / 2 - 80, 75);
      ctx.fillText(String(s.aiScore), CANVAS_W / 2 + 80, 75);

      // Paddles (neon glow)
      const drawPaddle = (x: number, y: number, color: string) => {
        ctx.shadowColor = color;
        ctx.shadowBlur = 12;
        ctx.fillStyle = color;
        ctx.fillRect(x, y - PADDLE_H / 2, PADDLE_W, PADDLE_H);
        ctx.shadowBlur = 0;
      };
      drawPaddle(PADDLE_MARGIN, s.playerY, "#00ff88");
      drawPaddle(CANVAS_W - PADDLE_MARGIN - PADDLE_W, s.aiY, "#ff4466");

      // Ball
      if (s.phase === "playing" || s.phase === "paused") {
        ctx.shadowColor = "#ffffff";
        ctx.shadowBlur = 15;
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(s.ballX, s.ballY, BALL_SIZE / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // Border
      ctx.strokeStyle = "rgba(255,255,255,0.1)";
      ctx.lineWidth = 1;
      ctx.strokeRect(0, 0, CANVAS_W, CANVAS_H);

      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animRef.current);
  }, [resetBall]);

  // ── Keyboard ──
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      keysRef.current.add(e.key.toLowerCase());
      if (e.key === "Escape" && stateRef.current.phase === "playing") {
        stateRef.current.phase = "paused";
        setPhase("paused");
      } else if (e.key === "Escape" && stateRef.current.phase === "paused") {
        stateRef.current.phase = "playing";
        setPhase("playing");
      }
    };
    const onKeyUp = (e: KeyboardEvent) => keysRef.current.delete(e.key.toLowerCase());
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  // ── Touch ──
  const handleTouch = useCallback((e: React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleY = CANVAS_H / rect.height;
    touchRef.current = (e.touches[0].clientY - rect.top) * scaleY;
  }, []);

  const handleTouchEnd = useCallback(() => {
    touchRef.current = null;
  }, []);

  const playerWon = stateRef.current.playerScore >= WIN_SCORE;

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Mobile scores */}
      <div className="flex sm:hidden items-center justify-center gap-6 w-full">
        <div className="text-center">
          <div className="text-xs text-[#00ff88] uppercase tracking-wider mb-1">You</div>
          <div className="text-2xl font-bold font-mono text-[var(--fg)]">{scores[0]}</div>
        </div>
        <div className="text-[var(--fg-3)] text-sm">vs</div>
        <div className="text-center">
          <div className="text-xs text-[#ff4466] uppercase tracking-wider mb-1">CPU</div>
          <div className="text-2xl font-bold font-mono text-[var(--fg)]">{scores[1]}</div>
        </div>
      </div>

      <div className="relative w-full" style={{ maxWidth: CANVAS_W }}>
        <canvas
          ref={canvasRef}
          width={CANVAS_W}
          height={CANVAS_H}
          className="w-full rounded-lg border border-[var(--border)]"
          style={{ aspectRatio: `${CANVAS_W}/${CANVAS_H}`, touchAction: "none" }}
          onTouchStart={handleTouch}
          onTouchMove={handleTouch}
          onTouchEnd={handleTouchEnd}
        />

        {/* Menu overlay */}
        {phase === "menu" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 rounded-lg">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2 font-mono">RETRO PONG</h2>
            <p className="text-[#888] text-sm mb-8">First to {WIN_SCORE} wins</p>
            <div className="flex flex-col gap-3 w-48">
              {(["easy", "medium", "hard"] as Difficulty[]).map((d) => (
                <button
                  key={d}
                  onClick={() => startGame(d)}
                  className={`px-6 py-3 rounded-lg font-mono text-sm uppercase tracking-wider transition-all ${
                    d === "easy"
                      ? "bg-green-600/20 border border-green-500/40 text-green-400 hover:bg-green-600/30"
                      : d === "medium"
                      ? "bg-yellow-600/20 border border-yellow-500/40 text-yellow-400 hover:bg-yellow-600/30"
                      : "bg-red-600/20 border border-red-500/40 text-red-400 hover:bg-red-600/30"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
            <p className="text-[#555] text-xs mt-6">↑↓ or W/S to move • Touch on mobile</p>
          </div>
        )}

        {/* Paused overlay */}
        {phase === "paused" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 rounded-lg">
            <h2 className="text-2xl font-bold text-white mb-4 font-mono">PAUSED</h2>
            <button
              onClick={() => {
                stateRef.current.phase = "playing";
                setPhase("playing");
              }}
              className="px-6 py-3 rounded-lg bg-white/10 border border-white/20 text-white font-mono text-sm hover:bg-white/20 transition-colors"
            >
              RESUME
            </button>
            <p className="text-[#555] text-xs mt-4">Press ESC to resume</p>
          </div>
        )}

        {/* Finished overlay */}
        {phase === "finished" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 rounded-lg">
            <h2
              className={`text-3xl font-bold mb-2 font-mono ${playerWon ? "text-[#00ff88]" : "text-[#ff4466]"}`}
            >
              {playerWon ? "YOU WIN!" : "CPU WINS"}
            </h2>
            <p className="text-[#888] text-lg font-mono mb-6">
              {scores[0]} — {scores[1]}
            </p>
            <button
              onClick={() => {
                stateRef.current.phase = "menu";
                setPhase("menu");
                setScores([0, 0]);
                forceRender((v) => v + 1);
              }}
              className="px-6 py-3 rounded-lg bg-white/10 border border-white/20 text-white font-mono text-sm hover:bg-white/20 transition-colors"
            >
              PLAY AGAIN
            </button>
          </div>
        )}
      </div>

      {/* Controls hint */}
      {phase === "playing" && (
        <p className="hidden sm:block text-[var(--fg-3)] text-xs">
          ↑↓ or W/S to move paddle • ESC to pause
        </p>
      )}

      {/* Mobile touch zone hint */}
      {phase === "playing" && (
        <p className="sm:hidden text-[var(--fg-3)] text-xs">Touch & drag to move your paddle</p>
      )}
    </div>
  );
}
