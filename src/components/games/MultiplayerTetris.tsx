"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";

// ── Constants ──
const COLS = 10;
const ROWS = 20;
const EMPTY = 0;

const LEVELS = [
  { threshold: 0, speed: 800 },
  { threshold: 500, speed: 700 },
  { threshold: 1200, speed: 600 },
  { threshold: 2500, speed: 500 },
  { threshold: 4000, speed: 400 },
  { threshold: 6000, speed: 320 },
  { threshold: 9000, speed: 250 },
  { threshold: 13000, speed: 190 },
  { threshold: 18000, speed: 140 },
  { threshold: 25000, speed: 100 },
];

const LINE_POINTS = [0, 100, 300, 500, 800];
const GARBAGE_LINES = [0, 0, 1, 2, 4]; // garbage sent per lines cleared

const SHAPES: { shape: number[][]; color: string }[] = [
  { shape: [[1,1,1,1]], color: "#06b6d4" },
  { shape: [[2,0],[2,0],[2,2]], color: "#f97316" },
  { shape: [[0,3],[0,3],[3,3]], color: "#3b82f6" },
  { shape: [[4,4],[4,4]], color: "#eab308" },
  { shape: [[0,5,5],[5,5,0]], color: "#22c55e" },
  { shape: [[6,6,0],[0,6,6]], color: "#ef4444" },
  { shape: [[0,7,0],[7,7,7]], color: "#a855f7" },
];

const COLORS: Record<number, string> = {
  0: "transparent", 1: "#06b6d4", 2: "#f97316", 3: "#3b82f6",
  4: "#eab308", 5: "#22c55e", 6: "#ef4444", 7: "#a855f7", 8: "#6b7280",
};

type Board = number[][];

function emptyBoard(): Board {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(EMPTY));
}
function randomPiece() {
  const idx = Math.floor(Math.random() * SHAPES.length);
  return { shape: SHAPES[idx].shape.map((r) => [...r]), id: idx };
}
function rotate(matrix: number[][]): number[][] {
  const rows = matrix.length, cols = matrix[0].length;
  const result: number[][] = Array.from({ length: cols }, () => Array(rows).fill(0));
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) result[c][rows - 1 - r] = matrix[r][c];
  return result;
}
function collides(board: Board, shape: number[][], row: number, col: number): boolean {
  for (let r = 0; r < shape.length; r++)
    for (let c = 0; c < shape[r].length; c++)
      if (shape[r][c]) {
        const nr = row + r, nc = col + c;
        if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS) return true;
        if (board[nr][nc]) return true;
      }
  return false;
}
function merge(board: Board, shape: number[][], row: number, col: number): Board {
  const b = board.map((r) => [...r]);
  for (let r = 0; r < shape.length; r++)
    for (let c = 0; c < shape[r].length; c++)
      if (shape[r][c]) b[row + r][col + c] = shape[r][c];
  return b;
}
function clearLines(board: Board): { board: Board; cleared: number } {
  const kept = board.filter((row) => row.some((c) => c === EMPTY));
  const cleared = ROWS - kept.length;
  const empty = Array.from({ length: cleared }, () => Array(COLS).fill(EMPTY));
  return { board: [...empty, ...kept], cleared };
}
function getLevel(score: number): number {
  for (let i = LEVELS.length - 1; i >= 0; i--) if (score >= LEVELS[i].threshold) return i + 1;
  return 1;
}
function getSpeed(score: number): number {
  for (let i = LEVELS.length - 1; i >= 0; i--) if (score >= LEVELS[i].threshold) return LEVELS[i].speed;
  return LEVELS[0].speed;
}
function getGhostRow(board: Board, shape: number[][], row: number, col: number): number {
  let gr = row;
  while (!collides(board, shape, gr + 1, col)) gr++;
  return gr;
}
function addGarbage(board: Board, count: number): Board {
  if (count <= 0) return board;
  const rows: number[][] = [];
  for (let i = 0; i < count; i++) {
    const row = Array(COLS).fill(8);
    row[Math.floor(Math.random() * COLS)] = 0;
    rows.push(row);
  }
  return [...board.slice(count), ...rows];
}

// ── Mini board renderer ──
function MiniBoard({ board, cellSize = 8, label, score, lines, level, gameOver, isOpponent }: {
  board: number[][]; cellSize?: number; label: string; score: number; lines: number; level: number; gameOver: boolean; isOpponent?: boolean;
}) {
  const w = COLS * cellSize, h = ROWS * cellSize;
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="text-[10px] font-mono text-white/40 uppercase tracking-widest">{label}</div>
      <div className="rounded-lg border border-white/[0.08] bg-[#0a0a0a] overflow-hidden relative" style={{ width: w + 2, height: h + 2, padding: 1 }}>
        {/* Grid */}
        <div className="absolute inset-0 pointer-events-none" style={{ opacity: 0.03 }}>
          {Array.from({ length: ROWS }).map((_, r) => (
            <div key={r} className="absolute w-full border-b border-white" style={{ top: r * cellSize }} />
          ))}
          {Array.from({ length: COLS }).map((_, c) => (
            <div key={c} className="absolute h-full border-r border-white" style={{ left: c * cellSize }} />
          ))}
        </div>
        {/* Cells */}
        {(board.length ? board : emptyBoard()).map((row, ri) =>
          row.map((cell, ci) => {
            if (!cell) return null;
            return (
              <div key={`${ri}-${ci}`} className="absolute" style={{
                left: ci * cellSize + 1, top: ri * cellSize + 1,
                width: cellSize - 1, height: cellSize - 1,
                background: COLORS[cell] || COLORS[8],
                borderRadius: 1,
              }} />
            );
          })
        )}
        {/* Game over overlay */}
        {gameOver && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-red-400 text-xs font-bold">{isOpponent ? "K.O." : "DEAD"}</span>
          </div>
        )}
      </div>
      <div className="flex gap-3 text-[9px] font-mono">
        <div><span className="text-white/30">Score </span><span className="text-white">{score.toLocaleString()}</span></div>
        <div><span className="text-white/30">Lv </span><span className="text-[#a855f7]">{level}</span></div>
        <div><span className="text-white/30">Lines </span><span className="text-[#06b6d4]">{lines}</span></div>
      </div>
    </div>
  );
}

// ── Phase types ──
type Phase = "lobby" | "waiting" | "countdown" | "playing" | "finished";

export default function MultiplayerTetris() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roomParam = searchParams.get("room");

  // ── Lobby state ──
  const [phase, setPhase] = useState<Phase>("lobby");
  const [playerName, setPlayerName] = useState("");
  const [roomId, setRoomId] = useState(roomParam || "");
  const [playerId, setPlayerId] = useState("");
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(3);
  const [opponentName, setOpponentName] = useState("");

  // ── Game state (local player) ──
  const [board, setBoard] = useState<Board>(emptyBoard);
  const [piece, setPiece] = useState(randomPiece);
  const [nextPiece, setNextPiece] = useState(randomPiece);
  const [pos, setPos] = useState({ r: 0, c: Math.floor(COLS / 2) - 1 });
  const [score, setScore] = useState(0);
  const [lines, setLines] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  // ── Opponent state (from server) ──
  const [oppBoard, setOppBoard] = useState<number[][]>([]);
  const [oppScore, setOppScore] = useState(0);
  const [oppLines, setOppLines] = useState(0);
  const [oppLevel, setOppLevel] = useState(1);
  const [oppGameOver, setOppGameOver] = useState(false);
  const [winner, setWinner] = useState<"you" | "opponent" | null>(null);

  // ── Refs for animation frame access ──
  const boardRef = useRef(board); boardRef.current = board;
  const pieceRef = useRef(piece); pieceRef.current = piece;
  const posRef = useRef(pos); posRef.current = pos;
  const scoreRef = useRef(score); scoreRef.current = score;
  const gameOverRef = useRef(gameOver); gameOverRef.current = gameOver;
  const playerIdRef = useRef(playerId); playerIdRef.current = playerId;
  const roomIdRef = useRef(roomId); roomIdRef.current = roomId;
  const phaseRef = useRef(phase); phaseRef.current = phase;

  // Garbage tracking
  const garbageToSend = useRef(0);
  const linesRef = useRef(lines); linesRef.current = lines;

  // Touch controls
  const touchStart = useRef<{ x: number; y: number; time: number } | null>(null);

  // ── Create room ──
  const handleCreate = async () => {
    const name = playerName.trim();
    if (!name) return;
    setError("");
    const res = await fetch("/api/games/tetris/rooms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    const data = await res.json();
    if (data.error) { setError(data.error); return; }
    setRoomId(data.roomId);
    setPlayerId(data.playerId);
    setPhase("waiting");
  };

  // ── Join room ──
  const handleJoin = async () => {
    const name = playerName.trim();
    const rid = roomId.trim().toUpperCase();
    if (!name || !rid) return;
    setError("");
    const res = await fetch(`/api/games/tetris/rooms/${encodeURIComponent(rid)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    const data = await res.json();
    if (data.error) { setError(data.error); return; }
    setRoomId(rid);
    setPlayerId(data.playerId);
    setPhase("countdown");
    setCountdown(3);
  };

  // ── Poll for opponent joining (waiting phase) ──
  useEffect(() => {
    if (phase !== "waiting") return;
    const interval = setInterval(async () => {
      const res = await fetch(`/api/games/tetris/rooms/${encodeURIComponent(roomId)}`);
      const data = await res.json();
      if (data.playerCount >= 2) {
        setOpponentName(data.players.find((_: { name: string }, i: number) => i === 1)?.name || "Opponent");
        setPhase("countdown");
        setCountdown(3);
      }
    }, 500);
    return () => clearInterval(interval);
  }, [phase, roomId]);

  // ── Countdown timer ──
  useEffect(() => {
    if (phase !== "countdown") return;
    if (countdown <= 0) {
      startGame();
      setPhase("playing");
      return;
    }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, countdown]);

  // ── Start game ──
  const startGame = useCallback(() => {
    const b = emptyBoard();
    const p = randomPiece();
    const np = randomPiece();
    setBoard(b);
    setPiece(p);
    setNextPiece(np);
    setPos({ r: 0, c: Math.floor(COLS / 2) - Math.floor(p.shape[0].length / 2) });
    setScore(0);
    setLines(0);
    setGameOver(false);
    garbageToSend.current = 0;
  }, []);

  // ── Spawn / lock / move ──
  const spawnPiece = useCallback(() => {
    const np = pieceRef.current; // will be set to nextPiece before call
    const startCol = Math.floor(COLS / 2) - Math.floor(np.shape[0].length / 2);
    if (collides(boardRef.current, np.shape, 0, startCol)) {
      setGameOver(true);
      return;
    }
    setPiece(np);
    setNextPiece(randomPiece());
    setPos({ r: 0, c: startCol });
  }, []);

  const lockPiece = useCallback(() => {
    const merged = merge(boardRef.current, pieceRef.current.shape, posRef.current.r, posRef.current.c);
    const { board: newBoard, cleared } = clearLines(merged);
    const pts = LINE_POINTS[cleared] || 0;
    const bonus = cleared > 0 ? (getLevel(scoreRef.current) - 1) * 20 * cleared : 0;
    setBoard(newBoard);
    setScore((s) => s + pts + bonus);
    setLines((l) => l + cleared);

    // Calculate garbage to send
    if (cleared > 0) {
      garbageToSend.current += GARBAGE_LINES[cleared] || 0;
    }

    // Spawn next
    const np = nextPiece;
    const startCol = Math.floor(COLS / 2) - Math.floor(np.shape[0].length / 2);
    if (collides(newBoard, np.shape, 0, startCol)) {
      setGameOver(true);
      return;
    }
    setPiece(np);
    setNextPiece(randomPiece());
    setPos({ r: 0, c: startCol });
  }, [nextPiece]);

  const moveDown = useCallback(() => {
    if (gameOverRef.current) return;
    const { r, c } = posRef.current;
    if (!collides(boardRef.current, pieceRef.current.shape, r + 1, c)) {
      setPos({ r: r + 1, c });
    } else {
      lockPiece();
    }
  }, [lockPiece]);

  const moveLeft = useCallback(() => {
    if (gameOverRef.current) return;
    const { r, c } = posRef.current;
    if (!collides(boardRef.current, pieceRef.current.shape, r, c - 1)) setPos({ r, c: c - 1 });
  }, []);

  const moveRight = useCallback(() => {
    if (gameOverRef.current) return;
    const { r, c } = posRef.current;
    if (!collides(boardRef.current, pieceRef.current.shape, r, c + 1)) setPos({ r, c: c + 1 });
  }, []);

  const rotatePiece = useCallback(() => {
    if (gameOverRef.current) return;
    const rotated = rotate(pieceRef.current.shape);
    const { r, c } = posRef.current;
    for (const offset of [0, -1, 1, -2, 2]) {
      if (!collides(boardRef.current, rotated, r, c + offset)) {
        setPiece({ ...pieceRef.current, shape: rotated });
        setPos({ r, c: c + offset });
        return;
      }
    }
  }, []);

  const hardDrop = useCallback(() => {
    if (gameOverRef.current) return;
    const { r, c } = posRef.current;
    const ghostR = getGhostRow(boardRef.current, pieceRef.current.shape, r, c);
    setScore((s) => s + (ghostR - r) * 2);
    setPos({ r: ghostR, c });
    setTimeout(() => lockPiece(), 0);
  }, [lockPiece]);

  // ── Keyboard controls ──
  useEffect(() => {
    if (phase !== "playing") return;
    const handler = (e: KeyboardEvent) => {
      if (gameOverRef.current) return;
      switch (e.key) {
        case "ArrowLeft": case "a": e.preventDefault(); moveLeft(); break;
        case "ArrowRight": case "d": e.preventDefault(); moveRight(); break;
        case "ArrowDown": case "s": e.preventDefault(); moveDown(); break;
        case "ArrowUp": case "w": e.preventDefault(); rotatePiece(); break;
        case " ": e.preventDefault(); hardDrop(); break;
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [phase, moveLeft, moveRight, moveDown, rotatePiece, hardDrop]);

  // ── Auto-drop ──
  useEffect(() => {
    if (phase !== "playing" || gameOver) return;
    const speed = getSpeed(score);
    const id = setInterval(moveDown, speed);
    return () => clearInterval(id);
  }, [phase, gameOver, score, moveDown]);

  // ── Sync with server (150ms polling) ──
  useEffect(() => {
    if (phase !== "playing" && phase !== "finished") return;
    if (!playerId || !roomId) return;

    const interval = setInterval(async () => {
      const garbage = garbageToSend.current;
      garbageToSend.current = 0;

      try {
        const res = await fetch(`/api/games/tetris/rooms/${encodeURIComponent(roomIdRef.current)}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            playerId: playerIdRef.current,
            board: boardRef.current,
            score: scoreRef.current,
            lines: linesRef.current,
            level: getLevel(scoreRef.current),
            garbageSent: garbage,
            gameOver: gameOverRef.current,
          }),
        });
        const data = await res.json();
        if (data.error) return;

        // Update opponent state
        if (data.opponent) {
          setOppBoard(data.opponent.board || []);
          setOppScore(data.opponent.score || 0);
          setOppLines(data.opponent.lines || 0);
          setOppLevel(data.opponent.level || 1);
          setOppGameOver(data.opponent.gameOver || false);
          if (!opponentName && data.opponent.name) setOpponentName(data.opponent.name);
        }

        // Apply incoming garbage
        if (data.pendingGarbage > 0 && !gameOverRef.current) {
          setBoard((b) => addGarbage(b, data.pendingGarbage));
        }

        // Check for game end
        if (data.roomState === "finished" && data.winner) {
          setWinner(data.winner as "you" | "opponent");
          if (phaseRef.current !== "finished") setPhase("finished");
        }
      } catch {
        // Network error, skip this sync
      }
    }, 150);

    return () => clearInterval(interval);
  }, [phase, playerId, roomId, opponentName]);

  // ── Build display board with ghost + active piece ──
  const display = board.map((r) => [...r]);
  if (phase === "playing" && !gameOver) {
    const ghostR = getGhostRow(board, piece.shape, pos.r, pos.c);
    for (let r = 0; r < piece.shape.length; r++)
      for (let c = 0; c < piece.shape[r].length; c++)
        if (piece.shape[r][c] && ghostR + r >= 0 && ghostR + r < ROWS)
          if (!display[ghostR + r][pos.c + c])
            display[ghostR + r][pos.c + c] = -piece.shape[r][c];
    for (let r = 0; r < piece.shape.length; r++)
      for (let c = 0; c < piece.shape[r].length; c++)
        if (piece.shape[r][c] && pos.r + r >= 0 && pos.r + r < ROWS)
          display[pos.r + r][pos.c + c] = piece.shape[r][c];
  }

  const level = getLevel(score);
  const inviteLink = typeof window !== "undefined" ? `${window.location.origin}/games/tetris/multiplayer?room=${roomId}` : "";
  const [copied, setCopied] = useState(false);

  const copyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const CELL = 24; // desktop cell size
  const MINI = 10; // opponent mini cell size

  // ── Mobile cell size ──
  const [mobileCell, setMobileCell] = useState(14);
  useEffect(() => {
    const calc = () => {
      if (window.innerWidth < 640) {
        setMobileCell(Math.min(Math.floor((window.innerWidth - 24) / COLS), 14));
      }
    };
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, []);

  // ── LOBBY ──
  if (phase === "lobby") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <h2 className="text-2xl font-bold text-white mb-1">Multiplayer Tetris</h2>
        <p className="text-white/30 text-sm font-mono mb-8">Battle a friend — clear lines, send garbage!</p>

        <div className="w-full max-w-xs space-y-4">
          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Your name"
            maxLength={20}
            autoFocus
            className="w-full bg-white/[0.06] border border-white/[0.1] text-white text-sm px-4 py-3 rounded-xl outline-none focus:border-[#a855f7]/50 text-center"
          />

          {error && <div className="text-red-400 text-xs text-center font-mono">{error}</div>}

          <button
            onClick={handleCreate}
            disabled={!playerName.trim()}
            className="w-full px-4 py-3 rounded-xl bg-[#a855f7] hover:bg-[#9333ea] disabled:opacity-40 text-white text-sm font-medium transition-colors"
          >
            Create Room
          </button>

          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-white/20 text-xs font-mono">OR JOIN</span>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value.toUpperCase())}
              placeholder="Room code"
              maxLength={6}
              className="flex-1 bg-white/[0.06] border border-white/[0.1] text-white text-sm px-4 py-3 rounded-xl outline-none focus:border-[#06b6d4]/50 text-center font-mono tracking-widest uppercase"
            />
            <button
              onClick={handleJoin}
              disabled={!playerName.trim() || !roomId.trim()}
              className="px-5 py-3 rounded-xl bg-[#06b6d4] hover:bg-[#0891b2] disabled:opacity-40 text-white text-sm font-medium transition-colors"
            >
              Join
            </button>
          </div>
        </div>

        <button
          onClick={() => router.push("/games/tetris")}
          className="mt-8 text-white/30 hover:text-white/60 text-xs font-mono transition-colors"
        >
          ← Solo mode
        </button>
      </div>
    );
  }

  // ── WAITING ──
  if (phase === "waiting") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <div className="animate-pulse mb-4">
          <div className="w-16 h-16 rounded-2xl bg-[#a855f7]/20 flex items-center justify-center">
            <svg className="w-8 h-8 text-[#a855f7]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0" />
            </svg>
          </div>
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Waiting for opponent…</h2>

        <div className="bg-white/[0.06] border border-white/[0.1] rounded-xl px-6 py-4 mb-4 text-center">
          <div className="text-[9px] font-mono text-white/30 uppercase tracking-widest mb-1">Room Code</div>
          <div className="text-3xl font-bold text-[#a855f7] font-mono tracking-[0.3em]">{roomId}</div>
        </div>

        <button
          onClick={copyLink}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-white/60 text-sm transition-colors mb-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m9.86-2.03a4.5 4.5 0 0 0-1.242-7.244l-4.5-4.5a4.5 4.5 0 0 0-6.364 6.364l1.757 1.757" />
          </svg>
          {copied ? "Copied!" : "Copy invite link"}
        </button>

        <p className="text-white/20 text-xs font-mono">Share the code or link with a friend</p>

        <button
          onClick={() => { setPhase("lobby"); setRoomId(""); setPlayerId(""); }}
          className="mt-6 text-white/30 hover:text-white/60 text-xs font-mono transition-colors"
        >
          ← Back
        </button>
      </div>
    );
  }

  // ── COUNTDOWN ──
  if (phase === "countdown") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <div className="text-white/30 text-sm font-mono mb-4">
          {playerName} vs {opponentName || "Opponent"}
        </div>
        <div className="text-8xl font-bold text-[#a855f7] font-mono animate-pulse">
          {countdown > 0 ? countdown : "GO!"}
        </div>
      </div>
    );
  }

  // ── PLAYING + FINISHED ──
  return (
    <>
      {/* ── Mobile layout ── */}
      <div className="fixed inset-0 z-[100] bg-[#060606] sm:hidden overflow-hidden flex flex-col">
        {/* Top bar */}
        <div className="flex items-center justify-between px-3 py-1">
          <div className="flex items-center gap-3">
            <div><div className="text-[7px] font-mono text-white/30 uppercase">Score</div><div className="text-xs font-bold text-white font-mono">{score.toLocaleString()}</div></div>
            <div><div className="text-[7px] font-mono text-white/30 uppercase">Lv</div><div className="text-xs font-bold text-[#a855f7] font-mono">{level}</div></div>
          </div>
          <div className="flex items-center gap-2">
            {/* Mini next piece */}
            <div className="flex flex-col items-center">
              <div className="text-[6px] font-mono text-white/20 uppercase">Next</div>
              <div>{nextPiece.shape.map((row, ri) => (
                <div key={ri} className="flex">{row.map((cell, ci) => (
                  <div key={ci} style={{ width: 7, height: 7, margin: 0.5, borderRadius: 1, background: cell ? COLORS[cell] : "transparent" }} />
                ))}</div>
              ))}</div>
            </div>
            <button onClick={() => router.push("/games")} className="w-7 h-7 rounded-lg bg-white/[0.06] flex items-center justify-center text-white/50 active:bg-white/[0.12]">✕</button>
          </div>
        </div>

        {/* Boards area */}
        <div className="flex-1 flex items-start justify-center gap-2 px-2">
          {/* Player board */}
          <div
            className="rounded-lg border border-white/[0.08] bg-[#0a0a0a] overflow-hidden relative"
            style={{ width: COLS * mobileCell + 2, height: ROWS * mobileCell + 2, padding: 1 }}
            onTouchStart={(e) => { const t = e.touches[0]; touchStart.current = { x: t.clientX, y: t.clientY, time: Date.now() }; }}
            onTouchEnd={(e) => {
              if (!touchStart.current || gameOver) return;
              const t = e.changedTouches[0]; const dx = t.clientX - touchStart.current.x; const dy = t.clientY - touchStart.current.y; const dt = Date.now() - touchStart.current.time;
              touchStart.current = null;
              if (dt < 200 && Math.abs(dx) < 20 && Math.abs(dy) < 20) { rotatePiece(); return; }
              if (Math.abs(dx) > Math.abs(dy)) { if (dx > 30) moveRight(); else if (dx < -30) moveLeft(); }
              else { if (dy > 50) hardDrop(); else if (dy > 20) moveDown(); }
            }}
          >
            {display.map((row, ri) => row.map((cell, ci) => {
              const isGhost = cell < 0; const colorId = Math.abs(cell);
              if (!colorId) return null;
              return <div key={`${ri}-${ci}`} className="absolute rounded-[1px]" style={{
                left: ci * mobileCell + 1, top: ri * mobileCell + 1, width: mobileCell - 2, height: mobileCell - 2,
                background: isGhost ? `${COLORS[colorId]}15` : COLORS[colorId],
                border: isGhost ? `1px solid ${COLORS[colorId]}30` : "none",
              }} />;
            }))}
          </div>

          {/* Opponent mini board */}
          <div className="flex flex-col items-center gap-1">
            <div className="text-[7px] font-mono text-white/30 uppercase">{opponentName || "Opponent"}</div>
            <div className="rounded border border-white/[0.06] bg-[#0a0a0a] overflow-hidden relative"
              style={{ width: COLS * 5 + 2, height: ROWS * 5 + 2, padding: 1 }}>
              {(oppBoard.length ? oppBoard : emptyBoard()).map((row, ri) => row.map((cell, ci) => {
                if (!cell) return null;
                return <div key={`o${ri}-${ci}`} className="absolute" style={{
                  left: ci * 5 + 1, top: ri * 5 + 1, width: 4, height: 4,
                  background: COLORS[cell] || COLORS[8],
                }} />;
              }))}
              {oppGameOver && <div className="absolute inset-0 bg-black/60 flex items-center justify-center"><span className="text-red-400 text-[6px] font-bold">K.O.</span></div>}
            </div>
            <div className="text-[8px] font-mono text-white/40">{oppScore.toLocaleString()}</div>
          </div>
        </div>

        {/* Mobile controls */}
        <div className="flex justify-center gap-2 px-3 py-2">
          <button onClick={moveLeft} className="w-10 h-10 rounded-xl bg-white/[0.06] active:bg-white/[0.15] text-white/60 text-lg flex items-center justify-center">←</button>
          <button onClick={moveDown} className="w-10 h-10 rounded-xl bg-white/[0.06] active:bg-white/[0.15] text-white/60 text-lg flex items-center justify-center">↓</button>
          <button onClick={rotatePiece} className="w-10 h-10 rounded-xl bg-white/[0.06] active:bg-white/[0.15] text-white/60 text-lg flex items-center justify-center">↻</button>
          <button onClick={moveRight} className="w-10 h-10 rounded-xl bg-white/[0.06] active:bg-white/[0.15] text-white/60 text-lg flex items-center justify-center">→</button>
          <button onClick={hardDrop} className="w-10 h-10 rounded-xl bg-[#a855f7]/20 active:bg-[#a855f7]/40 text-[#a855f7] text-lg flex items-center justify-center">⤓</button>
        </div>

        {/* Finished overlay (mobile) */}
        {phase === "finished" && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center z-20 p-4">
            <div className={`text-2xl font-bold mb-2 ${winner === "you" ? "text-green-400" : "text-red-400"}`}>
              {winner === "you" ? "YOU WIN!" : "YOU LOSE"}
            </div>
            <div className="text-white/50 text-sm font-mono mb-1">Score: <span className="text-white font-bold">{score.toLocaleString()}</span></div>
            <div className="text-white/30 text-xs font-mono mb-4">Level {level} · {lines} lines</div>
            <div className="flex gap-3">
              <button onClick={() => { setPhase("lobby"); setWinner(null); }} className="px-5 py-2 rounded-lg bg-[#a855f7] text-white text-sm font-medium">New Game</button>
              <button onClick={() => router.push("/games/tetris")} className="px-5 py-2 rounded-lg bg-white/10 text-white text-sm">Solo</button>
            </div>
          </div>
        )}
      </div>

      {/* ── Desktop layout ── */}
      <div className="hidden sm:flex flex-col items-center gap-6 w-full max-w-5xl mx-auto">
        {/* VS header */}
        <div className="flex items-center gap-6 text-sm font-mono">
          <span className="text-[#06b6d4] font-medium">{playerName}</span>
          <span className="text-white/20">VS</span>
          <span className="text-[#ef4444] font-medium">{opponentName || "Opponent"}</span>
        </div>

        <div className="flex items-start gap-8">
          {/* Left: Player info */}
          <div className="flex flex-col gap-4 w-[140px]">
            <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-4">
              <div className="text-[9px] font-mono text-white/30 uppercase tracking-[0.2em] mb-3">Next</div>
              <div className="flex items-center justify-center h-16">
                <div>{nextPiece.shape.map((row, ri) => (
                  <div key={ri} className="flex">{row.map((cell, ci) => (
                    <div key={ci} className="rounded-[3px]" style={{ width: 16, height: 16, margin: 1, background: cell ? COLORS[cell] : "transparent", boxShadow: cell ? `0 0 4px ${COLORS[cell]}60` : "none" }} />
                  ))}</div>
                ))}</div>
              </div>
            </div>
            <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-4 space-y-3">
              <div><div className="text-[9px] font-mono text-white/30 uppercase tracking-[0.2em]">Score</div><div className="text-xl font-bold text-white font-mono">{score.toLocaleString()}</div></div>
              <div><div className="text-[9px] font-mono text-white/30 uppercase tracking-[0.2em]">Level</div><div className="text-lg font-bold text-[#a855f7] font-mono">{level}</div></div>
              <div><div className="text-[9px] font-mono text-white/30 uppercase tracking-[0.2em]">Lines</div><div className="text-lg font-bold text-[#06b6d4] font-mono">{lines}</div></div>
            </div>
            <div className="hidden lg:block rounded-xl bg-white/[0.03] border border-white/[0.06] p-4">
              <div className="text-[9px] font-mono text-white/30 uppercase tracking-[0.2em] mb-2">Controls</div>
              <div className="space-y-1 text-[11px] font-mono text-white/40">
                <div>← → &nbsp;Move</div>
                <div>↑ &nbsp;&nbsp;&nbsp;&nbsp;Rotate</div>
                <div>↓ &nbsp;&nbsp;&nbsp;&nbsp;Soft drop</div>
                <div>Space Hard drop</div>
              </div>
            </div>
          </div>

          {/* Center: Player board */}
          <div className="relative">
            <div className="text-[9px] font-mono text-[#06b6d4]/50 uppercase tracking-widest text-center mb-2">You</div>
            <div className="rounded-xl border border-[#06b6d4]/20 bg-[#0a0a0a] overflow-hidden relative" style={{ width: COLS * CELL + 2, height: ROWS * CELL + 2, padding: 1 }}>
              {/* Grid */}
              <div className="absolute inset-0 pointer-events-none" style={{ opacity: 0.04 }}>
                {Array.from({ length: ROWS }).map((_, r) => <div key={r} className="absolute w-full border-b border-white" style={{ top: r * CELL }} />)}
                {Array.from({ length: COLS }).map((_, c) => <div key={c} className="absolute h-full border-r border-white" style={{ left: c * CELL }} />)}
              </div>
              {/* Cells */}
              {display.map((row, ri) => row.map((cell, ci) => {
                const isGhost = cell < 0; const colorId = Math.abs(cell);
                if (!colorId) return null;
                return <div key={`${ri}-${ci}`} className="absolute rounded-[3px]" style={{
                  left: ci * CELL + 1, top: ri * CELL + 1, width: CELL - 2, height: CELL - 2,
                  background: isGhost ? `${COLORS[colorId]}15` : COLORS[colorId],
                  border: isGhost ? `1px solid ${COLORS[colorId]}30` : "none",
                  boxShadow: isGhost ? "none" : `0 0 6px ${COLORS[colorId]}40, inset 0 1px 0 rgba(255,255,255,0.15)`,
                }} />;
              }))}
            </div>
          </div>

          {/* Right: Opponent board */}
          <div>
            <MiniBoard
              board={oppBoard}
              cellSize={MINI}
              label={opponentName || "Opponent"}
              score={oppScore}
              lines={oppLines}
              level={oppLevel}
              gameOver={oppGameOver}
              isOpponent
            />
          </div>
        </div>

        {/* Finished overlay (desktop) */}
        {phase === "finished" && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center z-[100]">
            <div className={`text-4xl font-bold mb-3 ${winner === "you" ? "text-green-400" : "text-red-400"}`}>
              {winner === "you" ? "YOU WIN!" : "YOU LOSE"}
            </div>
            <div className="text-white/50 text-sm font-mono mb-1">
              Your score: <span className="text-white font-bold">{score.toLocaleString()}</span>
            </div>
            <div className="text-white/30 text-xs font-mono mb-1">
              Opponent: <span className="text-white/50">{oppScore.toLocaleString()}</span>
            </div>
            <div className="text-white/20 text-xs font-mono mb-6">
              Level {level} · {lines} lines
            </div>
            <div className="flex gap-3">
              <button onClick={() => { setPhase("lobby"); setWinner(null); setOppBoard([]); setOppScore(0); setOppLines(0); setOppLevel(1); setOppGameOver(false); }}
                className="px-6 py-2.5 rounded-lg bg-[#a855f7] hover:bg-[#9333ea] text-white text-sm font-medium transition-colors">
                New Game
              </button>
              <button onClick={() => router.push("/games/tetris")}
                className="px-5 py-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm transition-colors">
                Solo Mode
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
