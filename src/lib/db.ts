import fs from 'fs';
import path from 'path';
import { Redis } from '@upstash/redis';
import { Project, Experience, SiteConfig } from '@/types';
import { projects as seedProjects } from '@/data/projects';
import { experiences as seedExperiences } from '@/data/experience';
import { siteConfig as seedConfig } from '@/data/siteConfig';

const BUNDLED_DIR = path.join(process.cwd(), 'content');
const WRITABLE_DIR = process.env.VERCEL ? '/tmp/content' : BUNDLED_DIR;

// Redis client — only created when env vars are set (Vercel production)
let redis: Redis | null = null;
function getRedis(): Redis | null {
  if (redis) return redis;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (url && token) {
    redis = new Redis({ url, token });
  }
  return redis;
}

function useRedis(): boolean {
  return !!getRedis();
}

function ensureDir() {
  if (!fs.existsSync(WRITABLE_DIR)) fs.mkdirSync(WRITABLE_DIR, { recursive: true });
}

function isNonEmptyString(val: unknown): val is string {
  return typeof val === 'string' && val.trim().length > 0;
}

function isStringArray(val: unknown): val is string[] {
  return Array.isArray(val) && val.every((v) => typeof v === 'string');
}

export function validateProject(data: unknown): data is Project {
  if (!data || typeof data !== 'object') return false;
  const p = data as Record<string, unknown>;
  return (
    isNonEmptyString(p.slug) &&
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(p.slug) &&
    isNonEmptyString(p.title) &&
    isNonEmptyString(p.category) &&
    (p.type === 'uiux' || p.type === 'frontend' || p.type === 'other') &&
    typeof p.description === 'string' &&
    typeof p.longDescription === 'string' &&
    typeof p.problem === 'string' &&
    typeof p.solution === 'string' &&
    typeof p.impact === 'string' &&
    typeof p.thumbnail === 'string' &&
    isStringArray(p.images) &&
    isStringArray(p.technologies) &&
    typeof p.role === 'string' &&
    typeof p.year === 'string' &&
    (p.liveUrl === undefined || typeof p.liveUrl === 'string') &&
    typeof p.featured === 'boolean'
  );
}

export function validateExperience(data: unknown): data is Experience {
  if (!data || typeof data !== 'object') return false;
  const e = data as Record<string, unknown>;
  return (
    isNonEmptyString(e.id) &&
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(e.id) &&
    isNonEmptyString(e.role) &&
    isNonEmptyString(e.company) &&
    typeof e.period === 'string' &&
    typeof e.description === 'string' &&
    isStringArray(e.highlights)
  );
}

export function validateSiteConfig(data: unknown): data is SiteConfig {
  if (!data || typeof data !== 'object') return false;
  const c = data as Record<string, unknown>;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const baseValid =
    isNonEmptyString(c.name) &&
    typeof c.title === 'string' &&
    typeof c.role === 'string' &&
    typeof c.description === 'string' &&
    typeof c.email === 'string' &&
    emailRegex.test(c.email) &&
    typeof c.social === 'object' && c.social !== null &&
    typeof c.availability === 'string' &&
    typeof c.location === 'string';
  if (!baseValid) return false;
  // Optional array fields
  if (c.roles !== undefined && !isStringArray(c.roles)) return false;
  if (c.techStack !== undefined && !isStringArray(c.techStack)) return false;
  if (c.highlights !== undefined && (!Array.isArray(c.highlights) || !c.highlights.every((h: unknown) => h && typeof h === 'object' && typeof (h as Record<string, unknown>).value === 'string' && typeof (h as Record<string, unknown>).label === 'string'))) return false;
  if (c.skills !== undefined && (!Array.isArray(c.skills) || !c.skills.every((s: unknown) => s && typeof s === 'object' && typeof (s as Record<string, unknown>).label === 'string' && isStringArray((s as Record<string, unknown>).skills)))) return false;
  if (c.capabilities !== undefined && (!Array.isArray(c.capabilities) || !c.capabilities.every((cap: unknown) => cap && typeof cap === 'object' && typeof (cap as Record<string, unknown>).category === 'string' && isStringArray((cap as Record<string, unknown>).skills)))) return false;
  return true;
}

// Redis key names
const REDIS_KEY = {
  projects: 'portfolio:projects',
  experience: 'portfolio:experience',
  config: 'portfolio:config',
  auth: 'portfolio:auth',
};

// --- File-based helpers (local dev fallback) ---

function readJSONFile<T>(file: string, fallback: T): T {
  try {
    const writablePath = path.join(WRITABLE_DIR, file);
    if (fs.existsSync(writablePath)) {
      return JSON.parse(fs.readFileSync(writablePath, 'utf-8'));
    }
    const bundledPath = path.join(BUNDLED_DIR, file);
    if (fs.existsSync(bundledPath)) {
      return JSON.parse(fs.readFileSync(bundledPath, 'utf-8'));
    }
  } catch {
    // Fall through on parse errors
  }
  return fallback;
}

function writeJSONFile(file: string, data: unknown) {
  ensureDir();
  fs.writeFileSync(path.join(WRITABLE_DIR, file), JSON.stringify(data, null, 2));
}

// --- Redis helpers ---

async function redisGet<T>(key: string, fallback: T): Promise<T> {
  const r = getRedis()!;
  const data = await r.get<T>(key);
  return data ?? fallback;
}

async function redisSet(key: string, data: unknown): Promise<void> {
  const r = getRedis()!;
  await r.set(key, data);
}

// --- Projects ---
export async function getProjects(): Promise<Project[]> {
  let projects: Project[];
  if (useRedis()) {
    projects = await redisGet<Project[]>(REDIS_KEY.projects, []);
    // If Redis is empty, seed from file
    if (projects.length === 0) {
      projects = readJSONFile<Project[]>('projects.json', []);
      if (projects.length === 0) projects = seedProjects;
      await redisSet(REDIS_KEY.projects, projects);
    }
  } else {
    projects = readJSONFile<Project[]>('projects.json', []);
  }
  return projects.map((p) => ({ ...p, type: p.type || 'frontend' }));
}

export async function getProjectBySlug(slug: string): Promise<Project | undefined> {
  const all = await getProjects();
  return all.find((p) => p.slug === slug);
}

export async function saveProject(project: Project) {
  const all = await getProjects();
  const idx = all.findIndex((p) => p.slug === project.slug);
  if (idx >= 0) all[idx] = project;
  else all.push(project);
  if (useRedis()) {
    await redisSet(REDIS_KEY.projects, all);
  } else {
    writeJSONFile('projects.json', all);
  }
}

export async function deleteProject(slug: string) {
  const filtered = (await getProjects()).filter((p) => p.slug !== slug);
  if (useRedis()) {
    await redisSet(REDIS_KEY.projects, filtered);
  } else {
    writeJSONFile('projects.json', filtered);
  }
}

// --- Experiences ---
export async function getExperiences(): Promise<Experience[]> {
  if (useRedis()) {
    let data = await redisGet<Experience[]>(REDIS_KEY.experience, []);
    if (data.length === 0) {
      data = readJSONFile<Experience[]>('experience.json', []);
      if (data.length === 0) data = seedExperiences;
      await redisSet(REDIS_KEY.experience, data);
    }
    return data;
  }
  return readJSONFile('experience.json', []);
}

export async function getExperienceById(id: string): Promise<Experience | undefined> {
  const all = await getExperiences();
  return all.find((e) => e.id === id);
}

export async function saveExperience(exp: Experience) {
  const all = await getExperiences();
  const idx = all.findIndex((e) => e.id === exp.id);
  if (idx >= 0) all[idx] = exp;
  else all.push(exp);
  if (useRedis()) {
    await redisSet(REDIS_KEY.experience, all);
  } else {
    writeJSONFile('experience.json', all);
  }
}

export async function deleteExperience(id: string) {
  const filtered = (await getExperiences()).filter((e) => e.id !== id);
  if (useRedis()) {
    await redisSet(REDIS_KEY.experience, filtered);
  } else {
    writeJSONFile('experience.json', filtered);
  }
}

// --- Config ---
export async function getSiteConfig(): Promise<SiteConfig> {
  if (useRedis()) {
    let data = await redisGet<SiteConfig | null>(REDIS_KEY.config, null);
    if (!data) {
      data = readJSONFile<SiteConfig>('config.json', seedConfig);
      await redisSet(REDIS_KEY.config, data);
    }
    return data;
  }
  return readJSONFile('config.json', seedConfig);
}

export async function saveSiteConfig(config: SiteConfig) {
  if (useRedis()) {
    await redisSet(REDIS_KEY.config, config);
  } else {
    writeJSONFile('config.json', config);
  }
}

// --- Password ---
export async function getStoredPasswordHash(): Promise<string | null> {
  if (useRedis()) {
    const data = await redisGet<{ hash: string }>(REDIS_KEY.auth, { hash: '' });
    return data.hash || null;
  }
  const data = readJSONFile<{ hash: string }>('auth.json', { hash: '' });
  return data.hash || null;
}

export async function savePasswordHash(hash: string) {
  if (useRedis()) {
    await redisSet(REDIS_KEY.auth, { hash });
  } else {
    writeJSONFile('auth.json', { hash });
  }
}

// --- Seed ---
let seeded = false;
export async function seedIfEmpty() {
  if (seeded) return;
  seeded = true;

  if (useRedis()) {
    // Seed Redis from bundled files if keys don't exist
    const [projects, experience, config] = await Promise.all([
      redisGet<Project[] | null>(REDIS_KEY.projects, null),
      redisGet<Experience[] | null>(REDIS_KEY.experience, null),
      redisGet<SiteConfig | null>(REDIS_KEY.config, null),
    ]);
    const writes: Promise<void>[] = [];
    if (!projects) writes.push(redisSet(REDIS_KEY.projects, readJSONFile('projects.json', seedProjects)));
    if (!experience) writes.push(redisSet(REDIS_KEY.experience, readJSONFile('experience.json', seedExperiences)));
    if (!config) writes.push(redisSet(REDIS_KEY.config, readJSONFile('config.json', seedConfig)));
    if (writes.length) await Promise.all(writes);
  } else {
    ensureDir();
    const hasFile = (f: string) =>
      fs.existsSync(path.join(WRITABLE_DIR, f)) || fs.existsSync(path.join(BUNDLED_DIR, f));
    if (!hasFile('projects.json')) writeJSONFile('projects.json', seedProjects);
    if (!hasFile('experience.json')) writeJSONFile('experience.json', seedExperiences);
    if (!hasFile('config.json')) writeJSONFile('config.json', seedConfig);
  }
}
