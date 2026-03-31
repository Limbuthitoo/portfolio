"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";

// ── Board / Game constants ──
const COLS = 10;
const ROWS = 20;
const EMPTY = 0;

// Levels: each level has a points threshold and drop speed (ms)
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

// Points per lines cleared
const LINE_POINTS = [0, 100, 300, 500, 800];

// Tetromino shapes  (id 1-7 used as cell color index)
const SHAPES: { shape: number[][]; color: string }[] = [
  { shape: [[1,1,1,1]], color: "#06b6d4" },             // I - cyan
  { shape: [[2,0],[2,0],[2,2]], color: "#f97316" },      // J - orange
  { shape: [[0,3],[0,3],[3,3]], color: "#3b82f6" },      // L - blue
  { shape: [[4,4],[4,4]], color: "#eab308" },             // O - yellow
  { shape: [[0,5,5],[5,5,0]], color: "#22c55e" },        // S - green
  { shape: [[6,6,0],[0,6,6]], color: "#ef4444" },        // Z - red
  { shape: [[0,7,0],[7,7,7]], color: "#a855f7" },        // T - purple
];

const COLORS: Record<number, string> = {
  0: "transparent",
  1: "#06b6d4",
  2: "#f97316",
  3: "#3b82f6",
  4: "#eab308",
  5: "#22c55e",
  6: "#ef4444",
  7: "#a855f7",
};

interface HighScore {
  name: string;
  score: number;
  level: number;
  date: string;
}

type Board = number[][];

function emptyBoard(): Board {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(EMPTY));
}

function randomPiece() {
  const idx = Math.floor(Math.random() * SHAPES.length);
  return { shape: SHAPES[idx].shape.map((r) => [...r]), id: idx };
}

function rotate(matrix: number[][]): number[][] {
  const rows = matrix.length;
  const cols = matrix[0].length;
  const result: number[][] = Array.from({ length: cols }, () => Array(rows).fill(0));
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++)
      result[c][rows - 1 - r] = matrix[r][c];
  return result;
}

function collides(board: Board, shape: number[][], row: number, col: number): boolean {
  for (let r = 0; r < shape.length; r++)
    for (let c = 0; c < shape[r].length; c++)
      if (shape[r][c]) {
        const nr = row + r;
        const nc = col + c;
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
  let lvl = 1;
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (score >= LEVELS[i].threshold) { lvl = i + 1; break; }
  }
  return lvl;
}

function getSpeed(score: number): number {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (score >= LEVELS[i].threshold) return LEVELS[i].speed;
  }
  return LEVELS[0].speed;
}

// ── Ghost piece (preview of drop position) ──
function getGhostRow(board: Board, shape: number[][], row: number, col: number): number {
  let gr = row;
  while (!collides(board, shape, gr + 1, col)) gr++;
  return gr;
}

export default function UltraTetris() {
  const [board, setBoard] = useState<Board>(emptyBoard);
  const [piece, setPiece] = useState(randomPiece);
  const [nextPiece, setNextPiece] = useState(randomPiece);
  const [pos, setPos] = useState({ r: 0, c: Math.floor(COLS / 2) - 1 });
  const [score, setScore] = useState(0);
  const [lines, setLines] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [started, setStarted] = useState(false);
  const [paused, setPaused] = useState(false);
  const [highScores, setHighScores] = useState<HighScore[]>([]);
  const [showNameInput, setShowNameInput] = useState(false);
  const [playerName, setPlayerName] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const boardRef = useRef<Board>(board);
  const pieceRef = useRef(piece);
  const posRef = useRef(pos);
  const scoreRef = useRef(score);
  const gameOverRef = useRef(gameOver);
  const pausedRef = useRef(paused);

  boardRef.current = board;
  pieceRef.current = piece;
  posRef.current = pos;
  scoreRef.current = score;
  gameOverRef.current = gameOver;
  pausedRef.current = paused;

  // Fetch high scores
  useEffect(() => {
    fetch("/api/games/tetris").then((r) => r.json()).then(setHighScores).catch(() => {});
  }, []);

  const spawnPiece = useCallback(() => {
    const np = nextPiece;
    const startCol = Math.floor(COLS / 2) - Math.floor(np.shape[0].length / 2);
    if (collides(boardRef.current, np.shape, 0, startCol)) {
      setGameOver(true);
      setShowNameInput(true);
      return;
    }
    setPiece(np);
    setNextPiece(randomPiece());
    setPos({ r: 0, c: startCol });
  }, [nextPiece]);

  const lockPiece = useCallback(() => {
    const merged = merge(boardRef.current, pieceRef.current.shape, posRef.current.r, posRef.current.c);
    const { board: newBoard, cleared } = clearLines(merged);
    const pts = LINE_POINTS[cleared] || 0;
    const bonus = cleared > 0 ? (getLevel(scoreRef.current) - 1) * 20 * cleared : 0;
    setBoard(newBoard);
    setScore((s) => s + pts + bonus);
    setLines((l) => l + cleared);
    // spawnPiece will run via useEffect on nextPiece change
    setTimeout(() => spawnPiece(), 0);
  }, [spawnPiece]);

  const moveDown = useCallback(() => {
    if (gameOverRef.current || pausedRef.current) return;
    const { r, c } = posRef.current;
    if (!collides(boardRef.current, pieceRef.current.shape, r + 1, c)) {
      setPos({ r: r + 1, c });
    } else {
      lockPiece();
    }
  }, [lockPiece]);

  const moveLeft = useCallback(() => {
    if (gameOverRef.current || pausedRef.current) return;
    const { r, c } = posRef.current;
    if (!collides(boardRef.current, pieceRef.current.shape, r, c - 1)) {
      setPos({ r, c: c - 1 });
    }
  }, []);

  const moveRight = useCallback(() => {
    if (gameOverRef.current || pausedRef.current) return;
    const { r, c } = posRef.current;
    if (!collides(boardRef.current, pieceRef.current.shape, r, c + 1)) {
      setPos({ r, c: c + 1 });
    }
  }, []);

  const rotatePiece = useCallback(() => {
    if (gameOverRef.current || pausedRef.current) return;
    const rotated = rotate(pieceRef.current.shape);
    const { r, c } = posRef.current;
    // Wall kick: try 0, -1, +1, -2, +2
    for (const offset of [0, -1, 1, -2, 2]) {
      if (!collides(boardRef.current, rotated, r, c + offset)) {
        setPiece({ ...pieceRef.current, shape: rotated });
        setPos({ r, c: c + offset });
        return;
      }
    }
  }, []);

  const hardDrop = useCallback(() => {
    if (gameOverRef.current || pausedRef.current) return;
    const { r, c } = posRef.current;
    const ghostR = getGhostRow(boardRef.current, pieceRef.current.shape, r, c);
    const dropDist = ghostR - r;
    setScore((s) => s + dropDist * 2);
    setPos({ r: ghostR, c });
    setTimeout(() => lockPiece(), 0);
  }, [lockPiece]);

  // Keyboard controls
  useEffect(() => {
    if (!started) return;
    const handler = (e: KeyboardEvent) => {
      if (gameOverRef.current) return;
      switch (e.key) {
        case "ArrowLeft": case "a": e.preventDefault(); moveLeft(); break;
        case "ArrowRight": case "d": e.preventDefault(); moveRight(); break;
        case "ArrowDown": case "s": e.preventDefault(); moveDown(); break;
        case "ArrowUp": case "w": e.preventDefault(); rotatePiece(); break;
        case " ": e.preventDefault(); hardDrop(); break;
        case "p": case "P": e.preventDefault(); setPaused((p) => !p); break;
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [started, moveLeft, moveRight, moveDown, rotatePiece, hardDrop]);

  // Auto-drop
  useEffect(() => {
    if (!started || gameOver || paused) return;
    const speed = getSpeed(score);
    const id = setInterval(moveDown, speed);
    return () => clearInterval(id);
  }, [started, gameOver, paused, score, moveDown]);

  const startGame = () => {
    const b = emptyBoard();
    const p = randomPiece();
    const np = randomPiece();
    const startCol = Math.floor(COLS / 2) - Math.floor(p.shape[0].length / 2);
    setBoard(b);
    setPiece(p);
    setNextPiece(np);
    setPos({ r: 0, c: startCol });
    setScore(0);
    setLines(0);
    setGameOver(false);
    setStarted(true);
    setPaused(false);
    setShowNameInput(false);
    setSubmitted(false);
    setPlayerName("");
  };

  const submitScore = async () => {
    if (!playerName.trim() || submitted) return;
    const res = await fetch("/api/games/tetris", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: playerName.trim(), score, level: getLevel(score) }),
    });
    if (res.ok) {
      const data = await res.json();
      setHighScores(data);
      setSubmitted(true);
      setShowNameInput(false);
    }
  };

  // Render board with current piece and ghost
  const display = board.map((r) => [...r]);
  if (started && !gameOver) {
    // Ghost
    const ghostR = getGhostRow(board, piece.shape, pos.r, pos.c);
    for (let r = 0; r < piece.shape.length; r++)
      for (let c = 0; c < piece.shape[r].length; c++)
        if (piece.shape[r][c] && ghostR + r >= 0 && ghostR + r < ROWS)
          if (!display[ghostR + r][pos.c + c])
            display[ghostR + r][pos.c + c] = -piece.shape[r][c]; // negative = ghost

    // Active piece
    for (let r = 0; r < piece.shape.length; r++)
      for (let c = 0; c < piece.shape[r].length; c++)
        if (piece.shape[r][c] && pos.r + r >= 0 && pos.r + r < ROWS)
          display[pos.r + r][pos.c + c] = piece.shape[r][c];
  }

  const level = getLevel(score);

  // Touch controls
  const touchStart = useRef<{ x: number; y: number; time: number } | null>(null);
  const router = useRouter();

  // Dynamic cell size: fill available space on mobile
  const [cellSize, setCellSize] = useState(28);
  useEffect(() => {
    const calc = () => {
      const isMobile = window.innerWidth < 640;
      if (isMobile) {
        // Top bar (~44px) + controls (~56px) + dock (~56px) + safe areas (~32px) = ~188px
        const availH = window.innerHeight - 196;
        const availW = window.innerWidth - 16;
        const byH = Math.floor(availH / ROWS);
        const byW = Math.floor(availW / COLS);
        setCellSize(Math.max(12, Math.min(byH, byW)));
      } else {
        setCellSize(28);
      }
    };
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, []);

  const boardW = COLS * cellSize;
  const boardH = ROWS * cellSize;

  return (
    <>
      {/* ── Mobile: fullscreen overlay ── */}
      <div className="fixed inset-0 z-[100] bg-[#060606] flex flex-col sm:hidden">
        {/* Top bar */}
        <div className="shrink-0 flex items-center justify-between px-4 py-2">
          <div className="flex items-center gap-4">
            <div>
              <div className="text-[8px] font-mono text-white/30 uppercase tracking-widest">Score</div>
              <div className="text-sm font-bold text-white font-mono">{score.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-[8px] font-mono text-white/30 uppercase tracking-widest">Level</div>
              <div className="text-sm font-bold text-[#a855f7] font-mono">{level}</div>
            </div>
            <div>
              <div className="text-[8px] font-mono text-white/30 uppercase tracking-widest">Lines</div>
              <div className="text-sm font-bold text-[#06b6d4] font-mono">{lines}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Next piece mini */}
            <div className="flex flex-col items-center">
              <div className="text-[7px] font-mono text-white/20 uppercase mb-0.5">Next</div>
              <div>
                {nextPiece.shape.map((row, ri) => (
                  <div key={ri} className="flex">
                    {row.map((cell, ci) => (
                      <div key={ci} style={{ width: 10, height: 10, margin: 0.5, borderRadius: 2, background: cell ? COLORS[cell] : "transparent" }} />
                    ))}
                  </div>
                ))}
              </div>
            </div>
            {/* Close button */}
            <button
              onClick={() => router.push("/games")}
              className="w-8 h-8 rounded-lg bg-white/[0.06] flex items-center justify-center text-white/50 active:bg-white/[0.12] ml-2"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Board */}
        <div className="flex-1 flex items-center justify-center px-2">
          <div
            className="rounded-xl border border-white/[0.08] bg-[#0a0a0a] overflow-hidden relative"
            style={{ width: boardW + 2, height: boardH + 2, padding: 1 }}
            onTouchStart={(e) => {
              const t = e.touches[0];
              touchStart.current = { x: t.clientX, y: t.clientY, time: Date.now() };
            }}
            onTouchEnd={(e) => {
              if (!touchStart.current || gameOver || paused) return;
              const t = e.changedTouches[0];
              const dx = t.clientX - touchStart.current.x;
              const dy = t.clientY - touchStart.current.y;
              const dt = Date.now() - touchStart.current.time;
              touchStart.current = null;
              if (dt < 200 && Math.abs(dx) < 20 && Math.abs(dy) < 20) { rotatePiece(); return; }
              if (Math.abs(dx) > Math.abs(dy)) {
                if (dx > 30) moveRight(); else if (dx < -30) moveLeft();
              } else {
                if (dy > 50) hardDrop(); else if (dy > 20) moveDown();
              }
            }}
          >
            {/* Grid */}
            <div className="absolute inset-0 pointer-events-none" style={{ opacity: 0.04 }}>
              {Array.from({ length: ROWS }).map((_, r) => (
                <div key={r} className="absolute w-full border-b border-white" style={{ top: r * cellSize }} />
              ))}
              {Array.from({ length: COLS }).map((_, c) => (
                <div key={c} className="absolute h-full border-r border-white" style={{ left: c * cellSize }} />
              ))}
            </div>
            {/* Cells */}
            {display.map((row, ri) =>
              row.map((cell, ci) => {
                const isGhost = cell < 0;
                const colorId = Math.abs(cell);
                if (!colorId) return null;
                return (
                  <div key={`${ri}-${ci}`} className="absolute rounded-[2px]" style={{
                    left: ci * cellSize + 1, top: ri * cellSize + 1,
                    width: cellSize - 2, height: cellSize - 2,
                    background: isGhost ? `${COLORS[colorId]}15` : COLORS[colorId],
                    border: isGhost ? `1px solid ${COLORS[colorId]}30` : "none",
                    boxShadow: isGhost ? "none" : `0 0 6px ${COLORS[colorId]}40, inset 0 1px 0 rgba(255,255,255,0.15)`,
                  }} />
                );
              })
            )}
            {/* Overlays */}
            {!started && (
              <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center z-10">
                <h2 className="text-xl font-bold text-white mb-1">ULTRA TETRIS</h2>
                <p className="text-[10px] text-white/30 font-mono mb-4">Stack blocks. Clear lines.</p>
                <button onClick={startGame} className="px-5 py-2 rounded-lg bg-[#a855f7] hover:bg-[#9333ea] text-white text-sm font-medium">Start Game</button>
              </div>
            )}
            {paused && !gameOver && (
              <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center z-10">
                <div className="text-lg font-bold text-white mb-3">PAUSED</div>
                <button onClick={() => setPaused(false)} className="px-4 py-2 rounded-lg bg-white/10 text-white text-sm">Resume</button>
              </div>
            )}
            {gameOver && (
              <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center z-10 p-4">
                <div className="text-lg font-bold text-red-400 mb-1">GAME OVER</div>
                <div className="text-white/50 text-xs font-mono mb-1">Score: <span className="text-white font-bold">{score.toLocaleString()}</span></div>
                <div className="text-white/30 text-[10px] font-mono mb-3">Level {level} · {lines} lines</div>
                {showNameInput && !submitted && (
                  <div className="flex flex-col items-center gap-2 mb-3 w-full max-w-[180px]">
                    <input type="text" value={playerName} onChange={(e) => setPlayerName(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") submitScore(); }} placeholder="Your name" maxLength={20} autoFocus className="w-full bg-white/[0.06] border border-white/[0.1] text-white text-sm px-3 py-2 rounded-lg outline-none focus:border-[#a855f7]/50 text-center" />
                    <button onClick={submitScore} disabled={!playerName.trim()} className="w-full px-4 py-1.5 rounded-lg bg-[#a855f7] disabled:opacity-40 text-white text-sm font-medium">Save Score</button>
                  </div>
                )}
                {submitted && <div className="text-green-400 text-xs font-mono mb-2">Score saved!</div>}
                <button onClick={startGame} className="px-4 py-1.5 rounded-lg bg-white/10 text-white text-sm">Play Again</button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile controls */}
        <div className="shrink-0 flex justify-center gap-3 px-4 py-1.5 pb-[max(0.375rem,env(safe-area-inset-bottom))]">
          <button onClick={moveLeft} className="w-11 h-11 rounded-xl bg-white/[0.06] active:bg-white/[0.15] text-white/60 text-lg flex items-center justify-center">←</button>
          <button onClick={moveDown} className="w-11 h-11 rounded-xl bg-white/[0.06] active:bg-white/[0.15] text-white/60 text-lg flex items-center justify-center">↓</button>
          <button onClick={rotatePiece} className="w-11 h-11 rounded-xl bg-white/[0.06] active:bg-white/[0.15] text-white/60 text-lg flex items-center justify-center">↻</button>
          <button onClick={moveRight} className="w-11 h-11 rounded-xl bg-white/[0.06] active:bg-white/[0.15] text-white/60 text-lg flex items-center justify-center">→</button>
          <button onClick={hardDrop} className="w-11 h-11 rounded-xl bg-[#a855f7]/20 active:bg-[#a855f7]/40 text-[#a855f7] text-lg flex items-center justify-center">⤓</button>
        </div>
      </div>

      {/* ── Desktop layout ── */}
      <div className="hidden sm:flex flex-row items-start justify-center gap-6 w-full max-w-4xl mx-auto">
      {/* Left panel: Next + Score */}
      <div className="flex flex-col gap-4">
        {/* Next piece */}
        <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-4">
          <div className="text-[9px] font-mono text-white/30 uppercase tracking-[0.2em] mb-3">Next</div>
          <div className="flex items-center justify-center h-16">
            {nextPiece.shape.map((row, ri) => (
              <div key={ri} className="flex flex-col">
                {/* render transposed for visual */}
              </div>
            ))}
            <div>
              {nextPiece.shape.map((row, ri) => (
                <div key={ri} className="flex">
                  {row.map((cell, ci) => (
                    <div
                      key={ci}
                      className="rounded-[3px]"
                      style={{
                        width: 18,
                        height: 18,
                        margin: 1,
                        background: cell ? COLORS[cell] : "transparent",
                        boxShadow: cell ? `0 0 6px ${COLORS[cell]}60` : "none",
                      }}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-4 space-y-3">
          <div>
            <div className="text-[9px] font-mono text-white/30 uppercase tracking-[0.2em]">Score</div>
            <div className="text-xl font-bold text-white font-mono">{score.toLocaleString()}</div>
          </div>
          <div>
            <div className="text-[9px] font-mono text-white/30 uppercase tracking-[0.2em]">Level</div>
            <div className="text-lg font-bold text-[#a855f7] font-mono">{level}</div>
          </div>
          <div>
            <div className="text-[9px] font-mono text-white/30 uppercase tracking-[0.2em]">Lines</div>
            <div className="text-lg font-bold text-[#06b6d4] font-mono">{lines}</div>
          </div>
        </div>

        {/* Controls hint */}
        <div className="hidden lg:block rounded-xl bg-white/[0.03] border border-white/[0.06] p-4">
          <div className="text-[9px] font-mono text-white/30 uppercase tracking-[0.2em] mb-2">Controls</div>
          <div className="space-y-1 text-[11px] font-mono text-white/40">
            <div>← → &nbsp;Move</div>
            <div>↑ &nbsp;&nbsp;&nbsp;&nbsp;Rotate</div>
            <div>↓ &nbsp;&nbsp;&nbsp;&nbsp;Soft drop</div>
            <div>Space Hard drop</div>
            <div>P &nbsp;&nbsp;&nbsp;&nbsp;Pause</div>
          </div>
        </div>
      </div>

      {/* Game board */}
      <div className="relative">
        <div
          className="rounded-xl border border-white/[0.08] bg-[#0a0a0a] overflow-hidden relative"
          style={{ width: COLS * 28 + 2, height: ROWS * 28 + 2, padding: 1 }}
        >
          {/* Grid lines */}
          <div className="absolute inset-0 pointer-events-none" style={{ opacity: 0.04 }}>
            {Array.from({ length: ROWS }).map((_, r) => (
              <div key={r} className="absolute w-full border-b border-white" style={{ top: r * 28 }} />
            ))}
            {Array.from({ length: COLS }).map((_, c) => (
              <div key={c} className="absolute h-full border-r border-white" style={{ left: c * 28 }} />
            ))}
          </div>

          {/* Cells */}
          {display.map((row, ri) =>
            row.map((cell, ci) => {
              const isGhost = cell < 0;
              const colorId = Math.abs(cell);
              if (!colorId) return null;
              return (
                <div
                  key={`${ri}-${ci}`}
                  className="absolute rounded-[3px]"
                  style={{
                    left: ci * 28 + 1,
                    top: ri * 28 + 1,
                    width: 28 - 2,
                    height: 28 - 2,
                    background: isGhost ? `${COLORS[colorId]}15` : COLORS[colorId],
                    border: isGhost ? `1px solid ${COLORS[colorId]}30` : "none",
                    boxShadow: isGhost ? "none" : `0 0 8px ${COLORS[colorId]}40, inset 0 1px 0 rgba(255,255,255,0.15)`,
                  }}
                />
              );
            })
          )}

          {/* Start screen overlay */}
          {!started && (
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center z-10">
              <h2 className="text-2xl font-bold text-white mb-1 tracking-tight">ULTRA TETRIS</h2>
              <p className="text-[11px] text-white/30 font-mono mb-6">Stack blocks. Clear lines. Beat the score.</p>
              <button
                onClick={startGame}
                className="px-6 py-2.5 rounded-lg bg-[#a855f7] hover:bg-[#9333ea] text-white text-sm font-medium transition-colors"
              >
                Start Game
              </button>
            </div>
          )}

          {/* Pause overlay */}
          {paused && !gameOver && (
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center z-10">
              <div className="text-xl font-bold text-white mb-4">PAUSED</div>
              <button
                onClick={() => setPaused(false)}
                className="px-5 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm transition-colors"
              >
                Resume
              </button>
            </div>
          )}

          {/* Game over overlay */}
          {gameOver && (
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center z-10 p-4">
              <div className="text-xl font-bold text-red-400 mb-1">GAME OVER</div>
              <div className="text-white/50 text-sm font-mono mb-1">
                Score: <span className="text-white font-bold">{score.toLocaleString()}</span>
              </div>
              <div className="text-white/30 text-xs font-mono mb-4">
                Level {level} &middot; {lines} lines
              </div>

              {showNameInput && !submitted && (
                <div className="flex flex-col items-center gap-2 mb-4 w-full max-w-[200px]">
                  <input
                    type="text"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") submitScore(); }}
                    placeholder="Your name"
                    maxLength={20}
                    autoFocus
                    className="w-full bg-white/[0.06] border border-white/[0.1] text-white text-sm px-3 py-2 rounded-lg outline-none focus:border-[#a855f7]/50 text-center"
                  />
                  <button
                    onClick={submitScore}
                    disabled={!playerName.trim()}
                    className="w-full px-4 py-2 rounded-lg bg-[#a855f7] hover:bg-[#9333ea] disabled:opacity-40 text-white text-sm font-medium transition-colors"
                  >
                    Save Score
                  </button>
                </div>
              )}

              {submitted && (
                <div className="text-green-400 text-xs font-mono mb-3">Score saved!</div>
              )}

              <button
                onClick={startGame}
                className="px-5 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm transition-colors"
              >
                Play Again
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Right panel: High Scores */}
      <div>
        <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-4 lg:min-w-[180px]">
          <div className="text-[9px] font-mono text-white/30 uppercase tracking-[0.2em] mb-3">🏆 High Scores</div>
          {highScores.length === 0 ? (
            <div className="text-white/20 text-xs font-mono py-4 text-center">No scores yet</div>
          ) : (
            <div className="space-y-2">
              {highScores.map((hs, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-lg leading-none">
                    {i === 0 ? "🥇" : i === 1 ? "🥈" : "🥉"}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-white text-sm font-medium truncate">{hs.name}</div>
                    <div className="text-white/30 text-[10px] font-mono">
                      {hs.score.toLocaleString()} · Lv{hs.level}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  );
}
