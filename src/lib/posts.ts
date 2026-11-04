import { getCollection, type CollectionEntry } from "astro:content";

/** draft 글은 프로덕션 빌드에서만 숨긴다. astro dev에서는 그대로 보인다. */
export const isVisible = ({ data }: CollectionEntry<"posts">): boolean =>
	import.meta.env.DEV || !data.draft;

/** 글 목록이 필요한 모든 페이지의 단일 진입점. */
export const getVisiblePosts = () => getCollection("posts", isVisible);

/** SVG는 링크 미리보기에서 지원되지 않는 곳이 많아 빌드 때 PNG로 변환한다. */
export const hasSvgCover = ({ data }: CollectionEntry<"posts">): boolean =>
	data.thumbnail?.format === "svg";

/** 커버가 없으면 undefined를 돌려 BaseHead의 기본 이미지를 쓰게 한다. */
export const ogImagePath = (post: CollectionEntry<"posts">): string | undefined =>
	hasSvgCover(post) ? `/og/${post.id}.png` : post.data.thumbnail?.src;
