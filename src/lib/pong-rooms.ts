// ── In-memory multiplayer Pong room management ──
// Rooms auto-expire after 30 minutes

export interface PongPlayer {
  name: string;
  paddleY: number; // 0-1 normalized
  score: number;
  lastSeen: number;
}

export interface PongRoom {
  id: string;
  state: "waiting" | "countdown" | "playing" | "finished";
  createdAt: number;
  countdownStart?: number;
  players: Record<string, PongPlayer>;
  playerOrder: string[]; // [host, guest]
  ball: { x: number; y: number; vx: number; vy: number };
  winner?: string;
  winScore: number;
}

const rooms = new Map<string, PongRoom>();

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
        paddleY: 0.5,
        score: 0,
        lastSeen: Date.now(),
      },
    },
    playerOrder: [playerId],
    ball: { x: 0.5, y: 0.5, vx: 0, vy: 0 },
    winScore: 7,
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
    paddleY: 0.5,
    score: 0,
    lastSeen: Date.now(),
  };

  room.state = "countdown";
  room.countdownStart = Date.now();

  setTimeout(() => {
    if (room.state === "countdown") {
      room.state = "playing";
      // Initial ball direction: random
      const angle = (Math.random() * Math.PI) / 3 - Math.PI / 6;
      const dir = Math.random() > 0.5 ? 1 : -1;
      room.ball = { x: 0.5, y: 0.5, vx: dir * 0.006, vy: Math.sin(angle) * 0.006 };
    }
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
    paddleY: number;
    ball?: { x: number; y: number; vx: number; vy: number };
    scores?: [number, number];
  }
) {
  const room = rooms.get(roomId);
  if (!room) return { error: "Room not found" };

  const player = room.players[playerId];
  if (!player) return { error: "Player not found" };

  player.paddleY = update.paddleY;
  player.lastSeen = Date.now();

  const isHost = room.playerOrder[0] === playerId;

  // Host sends authoritative ball state and scores
  if (isHost && update.ball) {
    room.ball = update.ball;
  }
  if (isHost && update.scores) {
    room.players[room.playerOrder[0]].score = update.scores[0];
    room.players[room.playerOrder[1]].score = update.scores[1];

    // Check win
    if (update.scores[0] >= room.winScore && room.state === "playing") {
      room.state = "finished";
      room.winner = room.playerOrder[0];
    } else if (update.scores[1] >= room.winScore && room.state === "playing") {
      room.state = "finished";
      room.winner = room.playerOrder[1];
    }
  }

  // Get opponent
  const oppId = room.playerOrder.find((id) => id !== playerId);
  let opponent: { name: string; paddleY: number; score: number } | null = null;
  if (oppId && room.players[oppId]) {
    const o = room.players[oppId];
    opponent = { name: o.name, paddleY: o.paddleY, score: o.score };
  }

  // Disconnect detection: 10s no sync = auto-win for the other
  if (room.state === "playing" && oppId && room.players[oppId]) {
    if (Date.now() - room.players[oppId].lastSeen > 10_000) {
      room.state = "finished";
      room.winner = playerId;
    }
  }

  return {
    isHost,
    opponent,
    ball: room.ball,
    scores: room.playerOrder.map((pid) => room.players[pid]?.score || 0) as [number, number],
    roomState: room.state,
    countdownStart: room.countdownStart,
    winner: room.winner === playerId ? "you" : room.winner ? "opponent" : undefined,
  };
}
