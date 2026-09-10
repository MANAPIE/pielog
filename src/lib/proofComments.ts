export interface ProofComment {
  id: string;
  quote: string;
  heading: string;
  note: string;
  createdAt: number;
}

export type ProofCommentInput = Pick<ProofComment, "quote" | "heading" | "note">;

export type ProofStore = Record<string, ProofComment[]>;

export const STORAGE_KEY = "pielog:proof:v1";
export const TTL_MS = 7 * 24 * 60 * 60 * 1000;
export const QUOTE_MAX_LENGTH = 600;

function isComment(value: unknown): value is ProofComment {
  if (typeof value !== "object" || value === null) return false;
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.id === "string" &&
    typeof candidate.quote === "string" &&
    typeof candidate.heading === "string" &&
    typeof candidate.note === "string" &&
    typeof candidate.createdAt === "number" &&
    Number.isFinite(candidate.createdAt)
  );
}

function parseStore(raw: unknown): ProofStore {
  if (typeof raw !== "object" || raw === null || Array.isArray(raw)) return {};
  const store: ProofStore = {};
  for (const [slug, comments] of Object.entries(raw)) {
    if (!Array.isArray(comments)) continue;
    const valid = comments.filter(isComment);
    if (valid.length > 0) store[slug] = valid;
  }
  return store;
}

export function pruneStore(store: ProofStore, now: number = Date.now()): ProofStore {
  const pruned: ProofStore = {};
  for (const [slug, comments] of Object.entries(store)) {
    const alive = comments.filter((comment) => now - comment.createdAt < TTL_MS);
    if (alive.length > 0) pruned[slug] = alive;
  }
  return pruned;
}

export function loadStore(now: number = Date.now()): ProofStore {
  let raw: string | null;
  try {
    raw = localStorage.getItem(STORAGE_KEY);
  } catch (error) {
    console.warn("[proof] localStorage를 읽을 수 없어 빈 상태로 시작합니다", error);
    return {};
  }
  if (raw === null) return {};
  try {
    return pruneStore(parseStore(JSON.parse(raw)), now);
  } catch (error) {
    console.warn("[proof] 저장된 코멘트를 해석할 수 없어 무시합니다", error);
    return {};
  }
}

export function saveStore(store: ProofStore): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
    return true;
  } catch (error) {
    console.warn("[proof] localStorage에 저장하지 못했습니다", error);
    return false;
  }
}

export function normalizeQuote(text: string): string {
  const collapsed = text.replace(/\s+/g, " ").trim();
  return collapsed.length > QUOTE_MAX_LENGTH
    ? `${collapsed.slice(0, QUOTE_MAX_LENGTH - 1)}…`
    : collapsed;
}

function newId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function replacePost(store: ProofStore, slug: string, comments: ProofComment[]): ProofStore {
  const { [slug]: _dropped, ...rest } = store;
  return comments.length > 0 ? { ...rest, [slug]: comments } : rest;
}

export function addComment(
  store: ProofStore,
  slug: string,
  input: ProofCommentInput,
  now: number = Date.now(),
): ProofStore {
  const comment: ProofComment = {
    id: newId(),
    quote: input.quote,
    heading: input.heading,
    note: input.note,
    createdAt: now,
  };
  return { ...store, [slug]: [...(store[slug] ?? []), comment] };
}

export function removeComment(store: ProofStore, slug: string, id: string): ProofStore {
  const remaining = (store[slug] ?? []).filter((comment) => comment.id !== id);
  return replacePost(store, slug, remaining);
}

export function clearPost(store: ProofStore, slug: string): ProofStore {
  return replacePost(store, slug, []);
}

function formatEntry(comment: ProofComment, number: number): string {
  const lines: string[] = [];
  if (comment.heading) {
    lines.push(`${number}. [${comment.heading}]`);
  } else if (comment.quote) {
    lines.push(`${number}.`);
  } else {
    lines.push(`${number}. (인용 없음)`);
  }
  if (comment.quote) lines.push(`   > ${comment.quote}`);
  const note = comment.note || "(코멘트 없음)";
  lines.push(`   → ${note.split("\n").join("\n     ")}`);
  return lines.join("\n");
}

export function formatPost(slug: string, comments: ProofComment[]): string {
  const header = [
    `# 교정 코멘트: ${slug}`,
    `경로: src/content/posts/${slug}/`,
    `${comments.length}건`,
  ].join("\n");
  const entries = comments.map((comment, index) => formatEntry(comment, index + 1));
  return [header, ...entries].join("\n\n");
}

export function formatAll(store: ProofStore): string {
  return Object.entries(store)
    .map(([slug, comments]) => formatPost(slug, comments))
    .join("\n\n---\n\n");
}
