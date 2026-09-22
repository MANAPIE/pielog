import { getCollection, type CollectionEntry } from "astro:content";

/** draft 글은 프로덕션 빌드에서만 숨긴다. astro dev에서는 그대로 보인다. */
export const isVisible = ({ data }: CollectionEntry<"posts">): boolean =>
	import.meta.env.DEV || !data.draft;

/** 글 목록이 필요한 모든 페이지의 단일 진입점. */
export const getVisiblePosts = () => getCollection("posts", isVisible);
