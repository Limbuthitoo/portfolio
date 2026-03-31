// ── In-memory multiplayer Tetris room management ──
// Rooms auto-expire after 30 minutes

export interface PlayerState {
  name: string;
  board: number[][];
  score: number;
  lines: number;
  level: number;
  garbageQueue: number;
  gameOver: boolean;
  lastSeen: number;
}

export interface Room {
  id: string;
  state: "waiting" | "countdown" | "playing" | "finished";
  createdAt: number;
  countdownStart?: number;
  players: Record<string, PlayerState>;
  playerOrder: string[];
  winner?: string;
}

const rooms = new Map<string, Room>();

// Cleanup rooms older than 30 min
if (typeof globalThis !== "undefined") {
  const cleanup = () => {
    const now = Date.now();
    for (const [id, room] of rooms) {
      if (now - room.createdAt > 30 * 60 * 1000) rooms.delete(id);
    }
  };
  if (typeof setInterval !== "undefined") setInterval(cleanup, 60_000);
}

function generateId(length: number): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let id = "";
  for (let i = 0; i < length; i++) {
    id += chars[Math.floor(Math.random() * chars.length)];
  }
  return id;
}

export function createRoom(playerName: string): { roomId: string; playerId: string } {
  const roomId = generateId(6);
  const playerId = generateId(16);

  rooms.set(roomId, {
    id: roomId,
    state: "waiting",
    createdAt: Date.now(),
    players: {
      [playerId]: {
        name: playerName.slice(0, 20),
        board: [],
        score: 0,
        lines: 0,
        level: 1,
        garbageQueue: 0,
        gameOver: false,
        lastSeen: Date.now(),
      },
    },
    playerOrder: [playerId],
  });

  return { roomId, playerId };
}

export function joinRoom(roomId: string, playerName: string): { playerId: string } | { error: string } {
  const room = rooms.get(roomId);
  if (!room) return { error: "Room not found" };
  if (room.state !== "waiting") return { error: "Game already in progress" };
  if (room.playerOrder.length >= 2) return { error: "Room is full" };

  const playerId = generateId(16);
  room.playerOrder.push(playerId);
  room.players[playerId] = {
    name: playerName.slice(0, 20),
    board: [],
    score: 0,
    lines: 0,
    level: 1,
    garbageQueue: 0,
    gameOver: false,
    lastSeen: Date.now(),
  };

  room.state = "countdown";
  room.countdownStart = Date.now();

  setTimeout(() => {
    if (room.state === "countdown") room.state = "playing";
  }, 3500);

  return { playerId };
}

export function getRoomInfo(roomId: string) {
  const room = rooms.get(roomId);
  if (!room) return null;

  return {
    id: room.id,
    state: room.state,
    playerCount: room.playerOrder.length,
    players: room.playerOrder.map((pid) => ({
      name: room.players[pid]?.name || "",
      score: room.players[pid]?.score || 0,
    })),
    countdownStart: room.countdownStart,
    winner: room.winner,
  };
}

export function syncState(
  roomId: string,
  playerId: string,
  update: {
    board: number[][];
    score: number;
    lines: number;
    level: number;
    garbageSent: number;
    gameOver: boolean;
  }
) {
  const room = rooms.get(roomId);
  if (!room) return { error: "Room not found" };

  const player = room.players[playerId];
  if (!player) return { error: "Player not found" };

  // Update player state
  player.board = update.board;
  player.score = update.score;
  player.lines = update.lines;
  player.level = update.level;
  player.lastSeen = Date.now();

  // Handle game over
  if (update.gameOver && !player.gameOver) {
    player.gameOver = true;
    const oppId = room.playerOrder.find((id) => id !== playerId);
    if (oppId) {
      room.winner = oppId;
      room.state = "finished";
    }
  }

  // Send garbage to opponent
  if (update.garbageSent > 0) {
    const oppId = room.playerOrder.find((id) => id !== playerId);
    if (oppId && room.players[oppId]) {
      room.players[oppId].garbageQueue += update.garbageSent;
    }
  }

  // Get opponent state
  const oppId = room.playerOrder.find((id) => id !== playerId);
  let opponent: { name: string; board: number[][]; score: number; lines: number; level: number; gameOver: boolean } | null = null;
  if (oppId && room.players[oppId]) {
    const o = room.players[oppId];
    opponent = { name: o.name, board: o.board, score: o.score, lines: o.lines, level: o.level, gameOver: o.gameOver };
  }

  // Drain garbage queue
  const pendingGarbage = player.garbageQueue;
  player.garbageQueue = 0;

  // Disconnect detection: 10s no sync = auto-lose
  if (room.state === "playing" && oppId && room.players[oppId]) {
    const opp = room.players[oppId];
    if (Date.now() - opp.lastSeen > 10_000 && !opp.gameOver) {
      opp.gameOver = true;
      room.winner = playerId;
      room.state = "finished";
    }
  }

  return {
    opponent,
    pendingGarbage,
    roomState: room.state,
    countdownStart: room.countdownStart,
    winner: room.winner === playerId ? "you" : room.winner ? "opponent" : undefined,
  };
}
