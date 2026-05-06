const PARTICLES =
    /(?:에서|에게|부터|까지|으로|이라|라고|이나|든지|조차|마저|처럼|만큼|에게서|로부터|은|는|이|가|을|를|의|에|로|와|과|도|만|나|께)$/;

export function stripParticles(text: string): string {
    return text
        .split(/\s+/)
        .map((word) => {
            const stripped = word.replace(PARTICLES, "");
            return stripped.length > 0 ? stripped : word;
        })
        .join(" ");
}

export function buildSearchIndex(text: string): string {
    const words = text.split(/\s+/).filter(Boolean);
    const stripped = words.map((w) => w.replace(PARTICLES, "")).filter(Boolean);
    const unique = [...new Set([...words, ...stripped])];
    return unique.join(" ");
}

export function stripMarkdown(text: string): string {
    return text
        .replace(/```[\s\S]*?```/g, " ")
        .replace(/`[^`\n]*`/g, " ")
        .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
        .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
        .replace(/<[^>]+>/g, " ")
        .replace(/^#{1,6}\s+/gm, "")
        .replace(/[*_~]+/g, "")
        .replace(/^\s*[-*+]\s+/gm, "")
        .replace(/^\s*\d+\.\s+/gm, "")
        .replace(/^\s*>\s*/gm, "")
        .replace(/^---+$/gm, "")
        .replace(/\s+/g, " ")
        .trim();
}
