import type { CollectionEntry } from "astro:content";

type Post = CollectionEntry<"posts">;

const tokenize = (s: string): string[] =>
	s.toLowerCase().split(/[-_/]+/).filter(Boolean);

const jaccard = (a: string[], b: string[]): number => {
	if (a.length === 0 || b.length === 0) return 0;
	const setA = new Set(a);
	const setB = new Set(b);
	let inter = 0;
	setA.forEach((t) => setB.has(t) && inter++);
	return inter / new Set([...a, ...b]).size;
};

export function findSimilarPosts(
	requestedPath: string,
	posts: Post[],
	limit: number,
): Post[] {
	const requestedTokens = tokenize(requestedPath);
	const scored = posts.map((post) => ({
		post,
		score: jaccard(requestedTokens, tokenize(post.id)),
		date: post.data.date.getTime(),
	}));

	const matches = scored
		.filter((s) => s.score > 0)
		.sort((a, b) => b.score - a.score || b.date - a.date)
		.slice(0, limit)
		.map((s) => s.post);

	if (matches.length >= limit) return matches;

	const matchedIds = new Set(matches.map((p) => p.id));
	const fillers = posts.filter((p) => !matchedIds.has(p.id));
	for (let i = fillers.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[fillers[i], fillers[j]] = [fillers[j], fillers[i]];
	}
	return [...matches, ...fillers].slice(0, limit);
}
