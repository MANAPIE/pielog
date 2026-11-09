import { join } from "node:path";
import { Resvg } from "@resvg/resvg-js";

const OG_WIDTH = 1200;
const FONT_DIR = join(process.cwd(), "src/assets/og-fonts");

/** 커버의 다크 모드 블록을 중괄호 짝을 세어 제거한다. PNG는 라이트 값으로 고정한다. */
function stripDarkMedia(svg: string): string {
	const match = /@media\s*\(prefers-color-scheme:\s*dark\)\s*\{/.exec(svg);
	if (!match) return svg;
	let depth = 1;
	let end = match.index + match[0].length;
	while (depth > 0 && end < svg.length) {
		if (svg[end] === "{") depth++;
		if (svg[end] === "}") depth--;
		end++;
	}
	return svg.slice(0, match.index) + svg.slice(end);
}

/**
 * resvg가 읽지 못하는 CSS를 풀어 쓴다. var()는 값으로 치환하고, font 축약형은 개별 속성으로 나눈다.
 * 풀지 못한 표현이 남으면 색이나 글자 크기가 조용히 틀어지므로 빌드를 멈춘다.
 */
export function flattenCoverSvg(svg: string): string {
	const base = stripDarkMedia(svg);
	const variables = new Map<string, string>();
	for (const [, name, value] of base.matchAll(/(--[\w-]+)\s*:\s*([^;}]+)/g)) {
		variables.set(name, value.trim());
	}
	const flattened = base
		.replace(/var\(\s*(--[\w-]+)\s*\)/g, (whole, name) => variables.get(name) ?? whole)
		.replace(
			/\bfont:\s*(\d+)\s+([\d.]+px)\s+([^;}]+)/g,
			"font-weight: $1; font-size: $2; font-family: $3",
		);
	const unresolved = /var\([^)]*\)|\bfont:[^;}]*/.exec(flattened);
	if (unresolved) throw new Error(`변환할 수 없는 CSS: ${unresolved[0]}`);
	return flattened;
}

/**
 * 커버 SVG를 PNG로 렌더링한다. 시스템 폰트를 막고 번들 폰트만 쓰므로
 * 로컬(macOS)과 Vercel(Linux)의 결과가 같다.
 */
export function renderCoverPng(svg: string): Uint8Array {
	// resvg는 WebP를 오류 없이 건너뛰어 물체가 빠진 PNG를 만든다.
	if (svg.includes("data:image/webp")) {
		throw new Error("WebP를 넣은 커버는 PNG로 변환할 수 없습니다. frontmatter에 ogImage를 지정하세요.");
	}
	const resvg = new Resvg(flattenCoverSvg(svg), {
		fitTo: { mode: "width", value: OG_WIDTH },
		font: {
			fontFiles: [
				join(FONT_DIR, "Pretendard-Bold.otf"),
				join(FONT_DIR, "JetBrainsMono-ExtraBold.ttf"),
			],
			loadSystemFonts: false,
			defaultFontFamily: "Pretendard",
			sansSerifFamily: "Pretendard",
			serifFamily: "Pretendard",
			monospaceFamily: "JetBrains Mono",
		},
	});
	return resvg.render().asPng();
}
