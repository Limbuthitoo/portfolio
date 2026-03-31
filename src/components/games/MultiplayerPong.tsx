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
const POLL_MS = 100;

type Phase = "lobby" | "waiting" | "countdown" | "playing" | "finished";

interface BallState {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

export default function MultiplayerPong() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const pollRef = useRef<ReturnType<typeof setInterval>>(undefined);
  const keysRef = useRef<Set<string>>(new Set());
  const touchRef = useRef<number | null>(null);

  const roomIdRef = useRef("");
  const playerIdRef = useRef("");
  const isHostRef = useRef(false);

  // Game state refs (for animation loop)
  const playerYRef = useRef(CANVAS_H / 2);
  const opponentYRef = useRef(CANVAS_H / 2);
  const ballRef = useRef<BallState>({ x: CANVAS_W / 2, y: CANVAS_H / 2, vx: 0, vy: 0 });
  const scoresRef = useRef<[number, number]>([0, 0]);
  const scoredPauseRef = useRef(false);

  // React state (for UI)
  const [phase, setPhase] = useState<Phase>("lobby");
  const [roomId, setRoomId] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [opponentName, setOpponentName] = useState("");
  const [myName, setMyName] = useState("");
  const [scores, setScores] = useState<[number, number]>([0, 0]);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(3);
  const [winner, setWinner] = useState<"you" | "opponent" | "">("");
  const [isHost, setIsHost] = useState(false);

  // ── Create room ──
  const createRoom = useCallback(async () => {
    const name = playerName.trim();
    if (!name) return setError("Enter your name");
    setError("");
    try {
      const res = await fetch("/api/games/pong/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      const data = await res.json();
      if (data.error) return setError(data.error);
      roomIdRef.current = data.roomId;
      playerIdRef.current = data.playerId;
      isHostRef.current = true;
      setIsHost(true);
      setRoomId(data.roomId);
      setMyName(name);
      setPhase("waiting");
      startPolling();
    } catch {
      setError("Failed to create room");
    }
  }, [playerName]);

  // ── Join room ──
  const joinRoom = useCallback(async () => {
    const name = playerName.trim();
    const code = joinCode.trim().toUpperCase();
    if (!name) return setError("Enter your name");
    if (!code) return setError("Enter room code");
    setError("");
    try {
      const res = await fetch(`/api/games/pong/rooms/${code}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      const data = await res.json();
      if (data.error) return setError(data.error);
      roomIdRef.current = code;
      playerIdRef.current = data.playerId;
      isHostRef.current = false;
      setIsHost(false);
      setRoomId(code);
      setMyName(name);
      setPhase("countdown");
      startPolling();
    } catch {
      setError("Failed to join room");
    }
  }, [playerName, joinCode]);

  // ── Polling ──
  const startPolling = useCallback(() => {
    if (pollRef.current) clearInterval(pollRef.current);
    pollRef.current = setInterval(async () => {
      try {
        const body: Record<string, unknown> = {
          playerId: playerIdRef.current,
          paddleY: playerYRef.current / CANVAS_H,
        };

        // Host sends ball state and scores
        if (isHostRef.current) {
          body.ball = ballRef.current;
          body.scores = scoresRef.current;
        }

        const res = await fetch(`/api/games/pong/rooms/${roomIdRef.current}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        const data = await res.json();
        if (data.error) return;

        // Update opponent paddle
        if (data.opponent) {
          setOpponentName(data.opponent.name);
          opponentYRef.current = data.opponent.paddleY * CANVAS_H;
        }

        // Guest receives ball state from server
        if (!isHostRef.current && data.ball) {
          // Convert normalized ball to canvas coords
          ballRef.current = data.ball;
        }

        // Update scores from server
        if (data.scores) {
          scoresRef.current = data.scores;
          setScores([...data.scores] as [number, number]);
        }

        // State transitions
        if (data.roomState === "countdown" || data.roomState === "playing") {
          if (data.roomState === "countdown" && data.countdownStart) {
            const elapsed = Date.now() - data.countdownStart;
            const remaining = Math.max(0, Math.ceil((3500 - elapsed) / 1000));
            setCountdown(remaining);
          }
          setPhase((prev) => {
            if (prev === "waiting" || prev === "lobby") return "countdown";
            if (data.roomState === "playing" && prev === "countdown") return "playing";
            return prev;
          });
        }

        if (data.roomState === "finished") {
          setPhase("finished");
          setWinner(data.winner || "");
          if (pollRef.current) clearInterval(pollRef.current);
        }
      } catch {
        // ignore polling errors
      }
    }, POLL_MS);
  }, []);

  // Cleanup polling
  useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  // ── Reset ball (host only) ──
  const resetBall = useCallback((direction: number) => {
    const angle = (Math.random() * Math.PI) / 4 - Math.PI / 8;
    ballRef.current = {
      x: CANVAS_W / 2,
      y: CANVAS_H / 2,
      vx: direction * BALL_SPEED * Math.cos(angle),
      vy: BALL_SPEED * Math.sin(angle),
    };
  }, []);

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

      const keys = keysRef.current;
      const isPlaying = phase === "playing";

      // Move player paddle
      if (isPlaying) {
        if (keys.has("arrowup") || keys.has("w")) {
          playerYRef.current = Math.max(PADDLE_H / 2, playerYRef.current - PADDLE_SPEED * dt);
        }
        if (keys.has("arrowdown") || keys.has("s")) {
          playerYRef.current = Math.min(CANVAS_H - PADDLE_H / 2, playerYRef.current + PADDLE_SPEED * dt);
        }
        if (touchRef.current !== null) {
          const targetY = Math.max(PADDLE_H / 2, Math.min(CANVAS_H - PADDLE_H / 2, touchRef.current));
          const diff = targetY - playerYRef.current;
          playerYRef.current += Math.sign(diff) * Math.min(Math.abs(diff), PADDLE_SPEED * 1.5 * dt);
        }
      }

      // Host runs ball physics
      if (isPlaying && isHostRef.current && !scoredPauseRef.current) {
        const b = ballRef.current;
        b.x += b.vx * dt;
        b.y += b.vy * dt;

        // Top/bottom bounce
        if (b.y <= BALL_SIZE / 2) { b.y = BALL_SIZE / 2; b.vy = Math.abs(b.vy); }
        if (b.y >= CANVAS_H - BALL_SIZE / 2) { b.y = CANVAS_H - BALL_SIZE / 2; b.vy = -Math.abs(b.vy); }

        // Left paddle (host) collision
        const hostY = playerYRef.current;
        if (
          b.x - BALL_SIZE / 2 <= PADDLE_MARGIN + PADDLE_W &&
          b.x - BALL_SIZE / 2 >= PADDLE_MARGIN &&
          b.y >= hostY - PADDLE_H / 2 && b.y <= hostY + PADDLE_H / 2
        ) {
          b.x = PADDLE_MARGIN + PADDLE_W + BALL_SIZE / 2;
          const relY = (b.y - hostY) / (PADDLE_H / 2);
          const angle = relY * (Math.PI / 4);
          const speed = Math.sqrt(b.vx * b.vx + b.vy * b.vy) * 1.05;
          b.vx = Math.abs(Math.cos(angle) * speed);
          b.vy = Math.sin(angle) * speed;
        }

        // Right paddle (guest) collision
        const guestY = opponentYRef.current;
        if (
          b.x + BALL_SIZE / 2 >= CANVAS_W - PADDLE_MARGIN - PADDLE_W &&
          b.x + BALL_SIZE / 2 <= CANVAS_W - PADDLE_MARGIN &&
          b.y >= guestY - PADDLE_H / 2 && b.y <= guestY + PADDLE_H / 2
        ) {
          b.x = CANVAS_W - PADDLE_MARGIN - PADDLE_W - BALL_SIZE / 2;
          const relY = (b.y - guestY) / (PADDLE_H / 2);
          const angle = relY * (Math.PI / 4);
          const speed = Math.sqrt(b.vx * b.vx + b.vy * b.vy) * 1.05;
          b.vx = -Math.abs(Math.cos(angle) * speed);
          b.vy = Math.sin(angle) * speed;
        }

        // Score
        if (b.x < 0) {
          scoresRef.current = [scoresRef.current[0], scoresRef.current[1] + 1];
          setScores([...scoresRef.current] as [number, number]);
          if (scoresRef.current[1] >= WIN_SCORE) {
            setPhase("finished");
          } else {
            scoredPauseRef.current = true;
            setTimeout(() => { scoredPauseRef.current = false; resetBall(1); }, 800);
          }
        }
        if (b.x > CANVAS_W) {
          scoresRef.current = [scoresRef.current[0] + 1, scoresRef.current[1]];
          setScores([...scoresRef.current] as [number, number]);
          if (scoresRef.current[0] >= WIN_SCORE) {
            setPhase("finished");
          } else {
            scoredPauseRef.current = true;
            setTimeout(() => { scoredPauseRef.current = false; resetBall(-1); }, 800);
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
      ctx.fillText(String(scoresRef.current[0]), CANVAS_W / 2 - 80, 75);
      ctx.fillText(String(scoresRef.current[1]), CANVAS_W / 2 + 80, 75);

      // Paddles
      const drawPaddle = (x: number, y: number, color: string) => {
        ctx.shadowColor = color;
        ctx.shadowBlur = 12;
        ctx.fillStyle = color;
        ctx.fillRect(x, y - PADDLE_H / 2, PADDLE_W, PADDLE_H);
        ctx.shadowBlur = 0;
      };

      // Host is always left paddle, guest is always right
      if (isHostRef.current) {
        drawPaddle(PADDLE_MARGIN, playerYRef.current, "#00ff88");
        drawPaddle(CANVAS_W - PADDLE_MARGIN - PADDLE_W, opponentYRef.current, "#ff4466");
      } else {
        drawPaddle(PADDLE_MARGIN, opponentYRef.current, "#ff4466");
        drawPaddle(CANVAS_W - PADDLE_MARGIN - PADDLE_W, playerYRef.current, "#00ff88");
      }

      // Ball
      if (isPlaying || phase === "countdown") {
        const b = ballRef.current;
        ctx.shadowColor = "#ffffff";
        ctx.shadowBlur = 15;
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(b.x, b.y, BALL_SIZE / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // Border
      ctx.strokeStyle = "rgba(255,255,255,0.1)";
      ctx.lineWidth = 1;
      ctx.strokeRect(0, 0, CANVAS_W, CANVAS_H);

      // Countdown text
      if (phase === "countdown") {
        ctx.fillStyle = "rgba(0,0,0,0.5)";
        ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 72px monospace";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(countdown > 0 ? String(countdown) : "GO!", CANVAS_W / 2, CANVAS_H / 2);
        ctx.textBaseline = "alphabetic";
      }

      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animRef.current);
  }, [phase, countdown, resetBall]);

  // ── Keyboard ──
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => keysRef.current.add(e.key.toLowerCase());
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
  const handleTouchEnd = useCallback(() => { touchRef.current = null; }, []);

  // ── Lobby UI ──
  if (phase === "lobby") {
    return (
      <div className="flex flex-col items-center gap-6 py-4">
        <div className="w-full max-w-sm space-y-4">
          <input
            type="text"
            placeholder="Your name"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            maxLength={20}
            className="w-full px-4 py-3 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-[var(--fg)] placeholder:text-[var(--fg-3)] focus:outline-none focus:border-[var(--violet)]/50 font-mono"
          />

          <button
            onClick={createRoom}
            className="w-full px-4 py-3 rounded-lg bg-[var(--violet)]/10 border border-[var(--violet)]/30 text-[var(--violet)] font-mono text-sm hover:bg-[var(--violet)]/20 transition-colors"
          >
            CREATE ROOM
          </button>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-[var(--border)]" />
            <span className="text-[var(--fg-3)] text-xs font-mono">OR</span>
            <div className="flex-1 h-px bg-[var(--border)]" />
          </div>

          <input
            type="text"
            placeholder="Room code"
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
            maxLength={6}
            className="w-full px-4 py-3 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-[var(--fg)] placeholder:text-[var(--fg-3)] focus:outline-none focus:border-[var(--violet)]/50 font-mono text-center tracking-[0.3em] uppercase"
          />

          <button
            onClick={joinRoom}
            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-[var(--border)] text-[var(--fg)] font-mono text-sm hover:bg-white/10 transition-colors"
          >
            JOIN ROOM
          </button>

          {error && <p className="text-red-400 text-sm text-center font-mono">{error}</p>}
        </div>
      </div>
    );
  }

  // ── Waiting UI ──
  if (phase === "waiting") {
    return (
      <div className="flex flex-col items-center gap-6 py-8">
        <h2 className="text-xl font-bold text-[var(--fg)] font-mono">Waiting for opponent...</h2>
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl px-8 py-6 text-center">
          <p className="text-[var(--fg-3)] text-xs uppercase tracking-wider mb-2">Room Code</p>
          <p className="text-4xl font-bold text-[var(--violet)] font-mono tracking-[0.3em]">{roomId}</p>
        </div>
        <p className="text-[var(--fg-3)] text-sm">Share this code with your friend</p>
        <div className="flex gap-2">
          <button
            onClick={() => navigator.clipboard?.writeText(roomId)}
            className="px-4 py-2 rounded-lg bg-white/5 border border-[var(--border)] text-[var(--fg-2)] text-sm hover:bg-white/10 transition-colors font-mono"
          >
            Copy Code
          </button>
        </div>
      </div>
    );
  }

  // ── Game canvas (countdown, playing, finished) ──
  return (
    <div className="flex flex-col items-center gap-4">
      {/* Player names and scores */}
      <div className="flex items-center justify-between w-full" style={{ maxWidth: CANVAS_W }}>
        <div className="flex items-center gap-3">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: isHost ? "#00ff88" : "#ff4466" }}
          />
          <span className="text-[var(--fg)] font-mono text-sm">{myName || "You"}</span>
          <span className="text-[var(--fg)] font-mono text-lg font-bold">{isHost ? scores[0] : scores[1]}</span>
        </div>
        <span className="text-[var(--fg-3)] font-mono text-xs">First to {WIN_SCORE}</span>
        <div className="flex items-center gap-3">
          <span className="text-[var(--fg)] font-mono text-lg font-bold">{isHost ? scores[1] : scores[0]}</span>
          <span className="text-[var(--fg)] font-mono text-sm">{opponentName || "Opponent"}</span>
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: isHost ? "#ff4466" : "#00ff88" }}
          />
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

        {/* Finished overlay */}
        {phase === "finished" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 rounded-lg">
            <h2
              className={`text-3xl font-bold mb-2 font-mono ${
                winner === "you" ? "text-[#00ff88]" : "text-[#ff4466]"
              }`}
            >
              {winner === "you" ? "YOU WIN!" : "YOU LOSE"}
            </h2>
            <p className="text-[#888] text-lg font-mono mb-6">
              {scores[0]} — {scores[1]}
            </p>
            <button
              onClick={() => {
                setPhase("lobby");
                setRoomId("");
                setScores([0, 0]);
                setWinner("");
                setOpponentName("");
                setError("");
                playerYRef.current = CANVAS_H / 2;
                opponentYRef.current = CANVAS_H / 2;
                ballRef.current = { x: CANVAS_W / 2, y: CANVAS_H / 2, vx: 0, vy: 0 };
                scoresRef.current = [0, 0];
              }}
              className="px-6 py-3 rounded-lg bg-white/10 border border-white/20 text-white font-mono text-sm hover:bg-white/20 transition-colors"
            >
              BACK TO LOBBY
            </button>
          </div>
        )}
      </div>

      {phase === "playing" && (
        <p className="text-[var(--fg-3)] text-xs">
          <span className="hidden sm:inline">↑↓ or W/S to move paddle</span>
          <span className="sm:hidden">Touch & drag to move your paddle</span>
        </p>
      )}
    </div>
  );
}
