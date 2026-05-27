import React, { useState, useEffect, useRef, useMemo } from 'react';
import * as d3 from 'd3';

// ════════════════════════════════════════════════════════════
// PALETTE — Phase 1 final과 동일
// ════════════════════════════════════════════════════════════
const C = {
  bg: 'var(--cg-bg)',
  paper: 'var(--cg-paper)',
  ink: 'var(--cg-ink)',
  inkSoft: 'var(--cg-ink-soft)',
  inkFaint: 'var(--cg-ink-faint)',
  rule: 'var(--cg-rule)',
  ruleSoft: 'var(--cg-rule-soft)',
  red: 'var(--cg-red)',
  navy: 'var(--cg-navy)',
  olive: 'var(--cg-olive)',
  mustard: 'var(--cg-mustard)',
  teal: 'var(--cg-teal)',
  rose: 'var(--cg-rose)',
  focus: 'var(--cg-focus)',
  focusBg: 'var(--cg-focus-bg)',
};

// CSS variables 글로벌 주입 (한 번만)
const injectChartGalleryVars = () => {
  if (typeof document === 'undefined') return;
  if (document.getElementById('cg-vars')) return;
  const style = document.createElement('style');
  style.id = 'cg-vars';
  style.textContent = `
    [data-cg-root] {
      --cg-bg: #F5F1E8;
      --cg-paper: #FBF8F1;
      --cg-ink: #1A1715;
      --cg-ink-soft: #5C5550;
      --cg-ink-faint: #7A7268;
      --cg-rule: #D9D2C6;
      --cg-rule-soft: #E8E1D3;
      --cg-red: #B83D24;
      --cg-navy: #1F3450;
      --cg-olive: #5C6A1F;
      --cg-mustard: #9A6E0F;
      --cg-teal: #2D6A6D;
      --cg-rose: #9E3D6E;
      --cg-focus: #3E5F8A;
      --cg-focus-bg: rgba(62,95,138,0.10);
    }
    [data-theme="dark"] [data-cg-root] {
        --cg-bg: #1A1612;
        --cg-paper: #221F1B;
        --cg-ink: #F5F1E8;
        --cg-ink-soft: #A89F92;
        --cg-ink-faint: #827A6F;
        --cg-rule: #3D3833;
        --cg-rule-soft: #2A2620;
        --cg-red: #D9583E;
        --cg-navy: #6F8AAF;
        --cg-olive: #A3B257;
        --cg-mustard: #D6A35A;
        --cg-teal: #6FA8AB;
        --cg-rose: #C26793;
        --cg-focus: #7F9EC5;
        --cg-focus-bg: rgba(127,158,197,0.12);
    }
    [data-cg-root] button {
      font-family: inherit;
      font-size: 12px;
      font-weight: 500;
      line-height: 1;
      letter-spacing: 0.04em;
      padding: 0.625rem 1rem;
      border: 1px solid var(--cg-rule);
      background: var(--cg-paper);
      color: var(--cg-ink);
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.375rem;
      box-shadow: 0 1px 0 var(--cg-rule-soft);
      white-space: nowrap;
      transition: background 0.12s ease, color 0.12s ease, border-color 0.12s ease, box-shadow 0.12s ease, transform 0.06s ease;
    }
    [data-cg-root] button:hover:not(:disabled) {
      background: var(--cg-rule-soft);
      border-color: var(--cg-ink-faint);
      box-shadow: 0 2px 0 var(--cg-rule);
    }
    [data-cg-root] button:active:not(:disabled) {
      transform: translateY(1px);
      box-shadow: none;
    }
    [data-cg-root] button:disabled {
      opacity: 0.4;
      cursor: not-allowed;
      box-shadow: none;
    }
    /* 차트 박스: role="application" 래퍼에 bg+border+inner padding을 두고
       내부 SVG/canvas의 자체 프레임은 제거 (이중 테두리 방지) */
    [data-cg-root] [role="application"] {
      background: var(--cg-paper);
      border: 1px solid var(--cg-rule);
      padding: 15px 10px 10px;
    }
    [data-cg-root] [role="application"] > svg,
    [data-cg-root] [role="application"] > div > svg {
      background: transparent !important;
      border: 0 !important;
    }
    [data-cg-root] [role="application"] > div[style*="grab"],
    [data-cg-root] [role="application"] canvas {
      background: transparent !important;
      border: 0 !important;
    }
    /* 범례 + 상태 캡션: 12px */
    [data-cg-root] [aria-live],
    [data-cg-root] [role="application"] ~ div {
      font-size: 12px;
    }
    [data-cg-root] .flex { display: flex; }
    [data-cg-root] .flex-wrap { flex-wrap: wrap; }
    [data-cg-root] .flex-1 { flex: 1; }
    [data-cg-root] .items-center { align-items: center; }
    [data-cg-root] .items-baseline { align-items: baseline; }
    [data-cg-root] .items-start { align-items: flex-start; }
    [data-cg-root] .justify-between { justify-content: space-between; }
    [data-cg-root] .justify-center { justify-content: center; }
    [data-cg-root] .gap-1 { gap: 4px; }
    [data-cg-root] .gap-1\.5 { gap: 6px; }
    [data-cg-root] .gap-2 { gap: 8px; }
    [data-cg-root] .gap-3 { gap: 12px; }
    [data-cg-root] .gap-4 { gap: 16px; }
    [data-cg-root] .grid { display: grid; }
    [data-cg-root] .grid-cols-1 { grid-template-columns: 1fr; }
    [data-cg-root] .grid-cols-2 { grid-template-columns: 1fr 1fr; }
    [data-cg-root] .grid-cols-3 { grid-template-columns: repeat(3, 1fr); }
    [data-cg-root] .grid-cols-4 { grid-template-columns: repeat(4, 1fr); }
    [data-cg-root] .mt-1 { margin-top: 4px; }
    [data-cg-root] .mt-1\.5 { margin-top: 6px; }
    [data-cg-root] .mt-2 { margin-top: 8px; }
    [data-cg-root] .mt-3 { margin-top: 12px; }
    [data-cg-root] .mt-4 { margin-top: 16px; }
    [data-cg-root] .mb-1 { margin-bottom: 4px; }
    [data-cg-root] .mb-1\.5 { margin-bottom: 6px; }
    [data-cg-root] .mb-2 { margin-bottom: 8px; }
    [data-cg-root] .mb-3 { margin-bottom: 12px; }
    [data-cg-root] .mb-4 { margin-bottom: 16px; }
    [data-cg-root] .ml-2 { margin-left: 8px; }
    [data-cg-root] .ml-auto { margin-left: auto; }
    [data-cg-root] .pt-4 { padding-top: 16px; }
    [data-cg-root] .p-3 { padding: 12px; }
    [data-cg-root] .px-2 { padding-left: 8px; padding-right: 8px; }
    [data-cg-root] .px-3 { padding-left: 12px; padding-right: 12px; }
    [data-cg-root] .py-0\.5 { padding-top: 2px; padding-bottom: 2px; }
    [data-cg-root] .py-1 { padding-top: 4px; padding-bottom: 4px; }
    [data-cg-root] .py-1\.5 { padding-top: 6px; padding-bottom: 6px; }
    [data-cg-root] .py-2 { padding-top: 8px; padding-bottom: 8px; }
    [data-cg-root] .w-full { width: 100%; }
    [data-cg-root] .relative { position: relative; }
    [data-cg-root] .absolute { position: absolute; }
    [data-cg-root] .leading-relaxed { line-height: 1.625; }
    [data-cg-root] .leading-tight { line-height: 1.25; }
    [data-cg-root] .tracking-wide { letter-spacing: 0.025em; }
    [data-cg-root] .tracking-widest { letter-spacing: 0.1em; }
    [data-cg-root] .uppercase { text-transform: uppercase; }
    [data-cg-root] .text-left { text-align: left; }
    [data-cg-root] .text-right { text-align: right; }
    [data-cg-root] .text-center { text-align: center; }
    [data-cg-root] .tabular-nums { font-variant-numeric: tabular-nums; }
    [data-cg-root] .cursor-pointer { cursor: pointer; }
    [data-cg-root] .max-h-32 { max-height: 128px; }
    [data-cg-root] .max-h-40 { max-height: 160px; }
    [data-cg-root] .overflow-y-auto { overflow-y: auto; }
    [data-cg-root] .list-none { list-style: none; padding-left: 0; }
    [data-cg-root] .space-y-1 > * + * { margin-top: 4px; }
    [data-cg-root] [class~="text-[9px]"] { font-size: 9px; }
    [data-cg-root] [class~="text-[10px]"] { font-size: 10px; }
    [data-cg-root] [class~="text-[11px]"] { font-size: 11px; }
    [data-cg-root] [class~="text-[12px]"] { font-size: 12px; }
    [data-cg-root] .text-xs { font-size: 12px; }
    [data-cg-root] :not(button).font-mono { font-family: 'Courier New', Courier, monospace; }
`;
  document.head.appendChild(style);
};

const SERIES = [C.red, C.navy, C.olive, C.mustard, C.teal, C.rose];
const SHAPES = ['●', '■', '▲', '◆', '★', '✚'];

const srOnly = {
  position: 'absolute', width: 1, height: 1, padding: 0, margin: -1,
  overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap', border: 0,
};
const focusable = {
  onFocus: (e) => {
    e.currentTarget.style.outline = `1.5px solid ${C.focus}`;
    e.currentTarget.style.outlineOffset = '2px';
  },
  onBlur: (e) => { e.currentTarget.style.outline = 'none'; },
};
const useReducedMotion = () => {
  const [r, setR] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setR(mq.matches);
    const h = () => setR(mq.matches);
    mq.addEventListener?.('change', h);
    return () => mq.removeEventListener?.('change', h);
  }, []);
  return r;
};

const usageBadge = {
  display: 'inline-block',
  padding: '2px 8px',
  border: `1px solid ${C.rule}`,
  borderRadius: '999px',
  fontSize: '11px',
  fontWeight: 600,
  color: C.ink,
  background: C.paper,
  letterSpacing: 0,
  flexShrink: 0,
};
const usageRow = (badge, text) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
    <span style={usageBadge}>{badge}</span>
    <span>{text}</span>
  </div>
);
const Usage = ({ mouse, keyboard }) => (
  <div style={{ fontSize: '12px', color: C.inkSoft, marginBottom: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
    {mouse && usageRow('마우스', mouse)}
    {keyboard && usageRow('키보드', keyboard)}
  </div>
);

// ════════════════════════════════════════════════════════════
// DATA
// ════════════════════════════════════════════════════════════

// Network — 부서 협업 그래프
const networkData = {
  nodes: [
    { id: 'design', name: '디자인팀', group: 0 },
    { id: 'product', name: '프로덕트', group: 0 },
    { id: 'eng-fe', name: '프론트엔드', group: 1 },
    { id: 'eng-be', name: '백엔드', group: 1 },
    { id: 'eng-ml', name: 'ML팀', group: 1 },
    { id: 'data', name: '데이터팀', group: 1 },
    { id: 'qa', name: 'QA', group: 2 },
    { id: 'ops', name: '운영', group: 2 },
    { id: 'mkt', name: '마케팅', group: 3 },
    { id: 'sales', name: '세일즈', group: 3 },
    { id: 'support', name: '고객지원', group: 3 },
    { id: 'hr', name: 'HR', group: 4 },
    { id: 'finance', name: '재무', group: 4 },
  ],
  links: [
    { source: 'design', target: 'product', v: 8 },
    { source: 'design', target: 'eng-fe', v: 6 },
    { source: 'product', target: 'eng-fe', v: 7 },
    { source: 'product', target: 'eng-be', v: 5 },
    { source: 'product', target: 'data', v: 4 },
    { source: 'eng-fe', target: 'eng-be', v: 9 },
    { source: 'eng-be', target: 'eng-ml', v: 5 },
    { source: 'eng-be', target: 'data', v: 6 },
    { source: 'eng-ml', target: 'data', v: 7 },
    { source: 'qa', target: 'eng-fe', v: 4 },
    { source: 'qa', target: 'eng-be', v: 4 },
    { source: 'qa', target: 'product', v: 3 },
    { source: 'ops', target: 'eng-be', v: 5 },
    { source: 'ops', target: 'support', v: 4 },
    { source: 'mkt', target: 'product', v: 4 },
    { source: 'mkt', target: 'sales', v: 6 },
    { source: 'sales', target: 'support', v: 5 },
    { source: 'support', target: 'product', v: 3 },
    { source: 'hr', target: 'finance', v: 4 },
    { source: 'hr', target: 'ops', v: 2 },
    { source: 'finance', target: 'ops', v: 3 },
  ],
};
const GROUP_LABELS = ['디자인·프로덕트', '엔지니어링·데이터', '품질·운영', '비즈니스', '경영지원'];

// Hierarchy — Treemap, Sunburst, Bundling 공용
const hierarchyData = {
  name: '전체',
  children: [
    {
      name: '전자', children: [
        { name: '노트북', value: 58 },
        { name: '스마트폰', value: 47 },
        { name: '태블릿', value: 23 },
        { name: '액세서리', value: 17 },
      ],
    },
    {
      name: '의류', children: [
        { name: '아우터', value: 38 },
        { name: '상의', value: 28 },
        { name: '하의', value: 21 },
        { name: '신발', value: 11 },
      ],
    },
    {
      name: '식품', children: [
        { name: '신선', value: 32 },
        { name: '가공', value: 24 },
        { name: '음료', value: 20 },
      ],
    },
    {
      name: '도서', children: [
        { name: '문학', value: 18 },
        { name: '실용서', value: 14 },
        { name: '아동', value: 10 },
      ],
    },
  ],
};

// Sankey — 유저 여정
const sankeyData = {
  nodes: [
    { id: 'google', name: '구글', col: 0 },
    { id: 'naver', name: '네이버', col: 0 },
    { id: 'direct', name: '직접', col: 0 },
    { id: 'home', name: '홈', col: 1 },
    { id: 'search', name: '검색', col: 1 },
    { id: 'product', name: '상품', col: 2 },
    { id: 'cart', name: '장바구니', col: 3 },
    { id: 'buy', name: '구매', col: 4 },
    { id: 'exit', name: '이탈', col: 4 },
  ],
  links: [
    { s: 'google', t: 'home', v: 45 },
    { s: 'google', t: 'search', v: 25 },
    { s: 'naver', t: 'home', v: 30 },
    { s: 'naver', t: 'search', v: 18 },
    { s: 'direct', t: 'home', v: 22 },
    { s: 'home', t: 'product', v: 60 },
    { s: 'home', t: 'exit', v: 37 },
    { s: 'search', t: 'product', v: 35 },
    { s: 'search', t: 'exit', v: 8 },
    { s: 'product', t: 'cart', v: 48 },
    { s: 'product', t: 'exit', v: 47 },
    { s: 'cart', t: 'buy', v: 28 },
    { s: 'cart', t: 'exit', v: 20 },
  ],
};

// Chord — 도시 간 이동 매트릭스 (단위: 천 명)
const chordLabels = ['서울', '부산', '인천', '대구', '광주'];
const chordMatrix = [
  [0, 21, 18, 14, 11],
  [19, 0, 9, 12, 6],
  [16, 8, 0, 7, 5],
  [13, 11, 8, 0, 4],
  [10, 6, 5, 4, 0],
];

// ════════════════════════════════════════════════════════════
// #18 — Force-directed Network
// ════════════════════════════════════════════════════════════
const D18 = () => {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const [hoverId, setHoverId] = useState(null);
  const [focusIdx, setFocusIdx] = useState(0);
  const [query, setQuery] = useState('');
  const [tableOpen, setTableOpen] = useState(false);

  const W = 520, H = 400;

  // 노드 알파벳 순 정렬 (키보드 탐색용)
  const sortedNodes = useMemo(
    () => [...networkData.nodes].sort((a, b) => a.name.localeCompare(b.name, 'ko')),
    []
  );

  // 시뮬레이션 (한 번만)
  const positioned = useMemo(() => {
    const nodes = networkData.nodes.map((n) => ({ ...n }));
    const links = networkData.links.map((l) => ({ ...l }));
    const sim = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links).id((d) => d.id).distance(60).strength(0.5))
      .force('charge', d3.forceManyBody().strength(-260))
      .force('center', d3.forceCenter(W / 2, H / 2))
      .force('collide', d3.forceCollide(28))
      .stop();
    // headless tick
    for (let i = 0; i < 300; i++) sim.tick();
    return { nodes, links };
  }, []);

  const nodeMap = useMemo(() => {
    const m = new Map();
    positioned.nodes.forEach((n) => m.set(n.id, n));
    return m;
  }, [positioned]);

  // 검색 매칭 (이름 부분 일치)
  const matchedIds = useMemo(() => {
    if (!query.trim()) return null;
    return new Set(networkData.nodes
      .filter((n) => n.name.includes(query.trim()))
      .map((n) => n.id));
  }, [query]);

  const focusedNode = sortedNodes[focusIdx];
  const activeId = hoverId || focusedNode?.id;

  // 활성 노드의 이웃
  const neighbors = useMemo(() => {
    if (!activeId) return new Set();
    const n = new Set();
    networkData.links.forEach((l) => {
      const s = typeof l.source === 'object' ? l.source.id : l.source;
      const t = typeof l.target === 'object' ? l.target.id : l.target;
      if (s === activeId) n.add(t);
      if (t === activeId) n.add(s);
    });
    return n;
  }, [activeId]);

  const onKey = (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault(); setFocusIdx((i) => (i + 1) % sortedNodes.length);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault(); setFocusIdx((i) => (i - 1 + sortedNodes.length) % sortedNodes.length);
    } else if (e.key === 'Home') { e.preventDefault(); setFocusIdx(0); }
    else if (e.key === 'End') { e.preventDefault(); setFocusIdx(sortedNodes.length - 1); }
  };

  return (
    <div>
      <Usage mouse="노드 호버로 연결 강조 · 검색창 입력"
        keyboard="Tab → ←→ Home/End로 노드 순환" />

      {/* 검색 */}
      <div className="flex items-center gap-2 mb-2">
        <input type="search" value={query} onChange={(e) => setQuery(e.target.value)}
          placeholder="🔍 부서명 검색"
          className="flex-1 font-mono text-[12px] px-3 py-2"
          style={{ border: `1px solid ${C.rule}`, background: 'transparent', color: C.ink }}
          {...focusable} />
        {matchedIds && (
          <span aria-live="polite" style={{ color: matchedIds.size ? C.ink : C.red }}>
            {matchedIds.size}개 일치
          </span>
        )}
      </div>

      <div role="application"
        aria-label={`부서 협업 네트워크. 총 ${networkData.nodes.length}개 부서, ${networkData.links.length}개 연결.`}
        aria-describedby="d18-status"
        tabIndex={0} onKeyDown={onKey}
        style={{ position: 'relative' }} {...focusable}>
        <svg ref={ref} viewBox={`0 0 ${W} ${H}`}
          style={{ width: '100%', height: H, background: C.paper, border: `1px solid ${C.rule}` }}>
          {/* links */}
          {positioned.links.map((l, i) => {
            const s = typeof l.source === 'object' ? l.source : nodeMap.get(l.source);
            const t = typeof l.target === 'object' ? l.target : nodeMap.get(l.target);
            const sId = s.id, tId = t.id;
            const isActive = activeId && (sId === activeId || tId === activeId);
            const isDimmed = activeId && !isActive;
            return (
              <line key={i} x1={s.x} y1={s.y} x2={t.x} y2={t.y}
                stroke={isActive ? C.red : C.inkSoft}
                strokeWidth={isActive ? 2 : 1}
                strokeOpacity={isDimmed ? 0.08 : isActive ? 0.7 : 0.25} />
            );
          })}
          {/* nodes */}
          {positioned.nodes.map((n) => {
            const isActive = n.id === activeId;
            const isNeighbor = neighbors.has(n.id);
            const isMatched = matchedIds && matchedIds.has(n.id);
            const isDimmed = activeId && !isActive && !isNeighbor;
            const isFocused = sortedNodes[focusIdx]?.id === n.id;
            return (
              <g key={n.id}
                onMouseEnter={() => setHoverId(n.id)}
                onMouseLeave={() => setHoverId(null)}
                style={{ cursor: 'pointer' }}>
                {isFocused && !hoverId && (
                  <circle cx={n.x} cy={n.y} r={20}
                    fill="none" stroke={C.focus} strokeWidth={2} strokeDasharray="3 2" />
                )}
                {isMatched && (
                  <circle cx={n.x} cy={n.y} r={18}
                    fill="none" stroke={C.mustard} strokeWidth={3} />
                )}
                <circle cx={n.x} cy={n.y}
                  r={isActive ? 13 : isNeighbor ? 11 : 9}
                  fill={SERIES[n.group]}
                  fillOpacity={isDimmed ? 0.2 : 1}
                  stroke={C.paper} strokeWidth={1.5} />
                {/* 모양 글리프 (그룹별 이중코딩) */}
                <text x={n.x} y={n.y} textAnchor="middle" dy="0.35em"
                  fontSize={isActive ? 11 : 9} fill={C.paper}
                  fontWeight="700" pointerEvents="none" aria-hidden="true">
                  {SHAPES[n.group]}
                </text>
                <text x={n.x} y={n.y + (isActive ? 26 : 22)}
                  textAnchor="middle" fontSize="10"
                  fontFamily={'"Courier New", Courier, monospace'}
                  fill={isDimmed ? C.inkFaint : C.ink}
                  fontWeight={isActive ? 700 : 400}
                  pointerEvents="none">
                  {n.name}
                </text>
              </g>
            );
          })}
        </svg>

        {/* 활성 노드 정보 카드 */}
        {activeId && (
          <div className="absolute px-3 py-2 pointer-events-none"
            style={{
              background: C.ink, color: C.paper, fontSize: '12px', padding: '8px 12px', borderRadius: '4px', top: 8, right: 8,
              maxWidth: 200,
            }}>
            <div style={{ fontWeight: 700, marginBottom: 2 }}>
              {nodeMap.get(activeId)?.name}
            </div>
            <div style={{ opacity: 0.6, fontSize: 9, marginBottom: 4 }}>
              {GROUP_LABELS[nodeMap.get(activeId)?.group]}
            </div>
            <div style={{ opacity: 0.85 }}>
              연결 {neighbors.size}개
            </div>
            <div style={{ opacity: 0.7, fontSize: 10, marginTop: 2 }}>
              {[...neighbors].map((id) => nodeMap.get(id)?.name).join(', ')}
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-3 mt-3 mb-3 items-start">
        <div>
          <div className="flex flex-wrap gap-2 ml-auto" aria-label="그룹 범례">
            {GROUP_LABELS.map((g, i) => (
              <span key={g} className="flex items-center gap-1" style={{ color: C.inkSoft }}>
                <span style={{ color: SERIES[i] }} aria-hidden="true">{SHAPES[i]}</span>{g}
              </span>
            ))}
          </div>
          <div id="d18-status" className="mt-2" aria-live="polite"
            style={{ color: C.inkSoft }}>
            {activeId
              ? `${nodeMap.get(activeId)?.name} — 연결 ${neighbors.size}개: ${[...neighbors].map((id) => nodeMap.get(id)?.name).join(', ')}`
              : `${sortedNodes.length}개 부서, ${networkData.links.length}개 연결. Tab 진입 후 ←→로 탐색.`}
          </div>
        </div>
        <div className="ml-auto">
          <button onClick={() => setTableOpen((v) => !v)} aria-expanded={tableOpen}
            aria-controls="d18-table"
            {...focusable}>
            {tableOpen ? '데이터 표 닫기' : `총 ${networkData.nodes.length}개 부서`}
          </button>
        </div>
      </div>
      {tableOpen && (
        <div id="d18-table">
          <table>
            <caption style={srOnly}>부서별 연결</caption>
            <thead>
              <tr>
                {['부서', '그룹', '연결 수', '연결 대상'].map((h) => <th key={h} scope="col">{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {networkData.nodes.map((n) => {
                const conn = networkData.links.filter((l) => {
                  const s = typeof l.source === 'object' ? l.source.id : l.source;
                  const t = typeof l.target === 'object' ? l.target.id : l.target;
                  return s === n.id || t === n.id;
                });
                const others = conn.map((l) => {
                  const s = typeof l.source === 'object' ? l.source.id : l.source;
                  const t = typeof l.target === 'object' ? l.target.id : l.target;
                  return nodeMap.get(s === n.id ? t : s)?.name;
                }).join(', ');
                return (
                  <tr key={n.id}>
                    <td>{n.name}</td>
                    <td>{GROUP_LABELS[n.group]}</td>
                    <td>{conn.length}</td>
                    <td>{others}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {reduced && (
        <div className="mt-2" style={{ color: C.inkFaint }}>
          ⚠ reduced-motion 감지 → 시뮬레이션을 미리 수렴시킨 정적 레이아웃 사용
        </div>
      )}
    </div>
  );
};

// ════════════════════════════════════════════════════════════
// #19 — Treemap (squarified) + 트리뷰 패턴
// ════════════════════════════════════════════════════════════
const D19 = () => {
  const [path, setPath] = useState([]);
  const [focusIdx, setFocusIdx] = useState(0);
  const [treeOpen, setTreeOpen] = useState(false);

  const W = 520, H = 360;

  // 현재 레벨 데이터 (안전한 path 탐색)
  const currentRoot = useMemo(() => {
    let node = hierarchyData;
    for (const p of path) {
      const next = node.children?.find((c) => c.name === p);
      if (!next) return node;
      node = next;
    }
    return node;
  }, [path]);

  const items = currentRoot.children || [];
  const total = items.reduce((s, d) => s + (d.value || d3.sum(d.children || [], (c) => c.value)), 0);

  // d3.treemap — 현재 레벨을 평탄화해서 한 단계만 그림 (드릴다운으로 다음 단계 진입)
  const root = useMemo(() => {
    const flat = {
      name: currentRoot.name,
      children: items.map((it) => ({
        name: it.name,
        value: it.value || d3.sum(it.children || [], (c) => c.value),
        hasChildren: !!it.children,
      })),
    };
    const hier = d3.hierarchy(flat)
      .sum((d) => d.value || 0)
      .sort((a, b) => b.value - a.value);
    d3.treemap().size([W, H]).paddingInner(2).round(true)(hier);
    return hier;
  }, [currentRoot, items]);

  const leaves = root.leaves();

  useEffect(() => { setFocusIdx(0); }, [path.length]);

  // 키보드 탐색
  useEffect(() => {
    const onK = (e) => {
      if (e.key === 'Escape' && path.length > 0) {
        e.preventDefault(); setPath((p) => p.slice(0, -1));
      }
    };
    window.addEventListener('keydown', onK);
    return () => window.removeEventListener('keydown', onK);
  }, [path]);

  const navList = path.length === 0
    ? hierarchyData.children.map((c) => c.name)
    : items.map((c) => c.name);

  const onKey = (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault(); setFocusIdx((i) => Math.min(navList.length - 1, i + 1));
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault(); setFocusIdx((i) => Math.max(0, i - 1));
    } else if ((e.key === 'Enter' || e.key === ' ') && path.length === 0) {
      e.preventDefault(); setPath([navList[focusIdx]]);
    } else if (e.key === 'Backspace' && path.length > 0) {
      e.preventDefault(); setPath((p) => p.slice(0, -1));
    }
  };

  const colorFor = (name) => {
    const idx = hierarchyData.children.findIndex((c) => c.name === name || c.children?.some((cc) => cc.name === name));
    return SERIES[idx >= 0 ? idx : 0];
  };
  const parentColor = path.length > 0 ? colorFor(path[path.length - 1]) : null;

  return (
    <div>
      <Usage mouse="블록 클릭 → 진입 · 전체 클릭 → 복귀"
        keyboard="Tab → ←→↑↓ Enter, Esc/Backspace 복귀" />

      {/* breadcrumb */}
      <nav aria-label="계층 경로" className="flex items-center gap-1 mb-2 flex-wrap" style={{ fontSize: 12, minHeight: 18, lineHeight: '18px' }}>
        <button onClick={() => setPath([])}
          aria-current={path.length === 0 ? 'page' : undefined}
          style={{
            color: path.length === 0 ? C.ink : C.focus,
            textDecoration: path.length === 0 ? 'none' : 'underline',
            background: 'none', border: 'none', padding: 0,
            cursor: path.length === 0 ? 'default' : 'pointer',
            fontSize: 12,
          }} {...focusable}>전체</button>
        {path.map((p, i) => (
          <React.Fragment key={p}>
            <span style={{ color: C.inkFaint }}>/</span>
            <button onClick={() => setPath(path.slice(0, i + 1))}
              aria-current={i === path.length - 1 ? 'page' : undefined}
              style={{
                color: i === path.length - 1 ? C.ink : C.focus,
                textDecoration: i === path.length - 1 ? 'none' : 'underline',
                background: 'none', border: 'none', padding: 0,
                cursor: i === path.length - 1 ? 'default' : 'pointer',
                fontSize: 12,
              }} {...focusable}>{p}</button>
          </React.Fragment>
        ))}
        {path.length > 0 && (
          <span className="ml-auto" style={{ color: C.inkFaint }}>
            ESC ← 돌아가기
          </span>
        )}
      </nav>

      <div role="application"
        aria-label={`트리맵, ${path.length === 0 ? '카테고리' : path.join('/') + ' 하위'} ${items.length}개 항목`}
        tabIndex={0} onKeyDown={onKey} {...focusable}>
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: H, background: C.paper, border: `1px solid ${C.rule}` }}>
          {leaves.map((leaf, i) => {
            const w = leaf.x1 - leaf.x0;
            const h = leaf.y1 - leaf.y0;
            const isClickable = leaf.data.hasChildren && path.length === 0;
            // 최상위에서는 카테고리 색, 하위에서는 부모 색의 변형
            const baseColor = path.length === 0
              ? SERIES[hierarchyData.children.findIndex((c) => c.name === leaf.data.name) % SERIES.length]
              : parentColor;
            const focusedName = navList[focusIdx];
            const ownName = path.length === 0 ? leaf.data.name : leaf.data.name;
            const isFocused = ownName === focusedName;

            return (
              <g key={i}
                onClick={() => isClickable && setPath([leaf.data.name])}
                style={{ cursor: isClickable ? 'pointer' : 'default' }}>
                <rect x={leaf.x0} y={leaf.y0} width={w} height={h}
                  fill={baseColor}
                  fillOpacity={path.length === 0 ? 0.9 : 0.4 + 0.6 * (i / leaves.length)}
                  stroke={C.paper} strokeWidth={2} />
                {isFocused && (
                  <rect x={leaf.x0 + 2} y={leaf.y0 + 2}
                    width={w - 4} height={h - 4}
                    fill="none" stroke={C.focus} strokeWidth={3} />
                )}
                {/* 라벨 — 충분히 크면 표시 */}
                {w > 50 && h > 28 && (
                  <>
                    <text x={leaf.x0 + 6} y={leaf.y0 + 16}
                      fontSize="13" fontFamily={'"Courier New", Courier, monospace'}
                      fill={C.paper} fontWeight={isFocused ? 700 : 500}>
                      {leaf.data.name}
                    </text>
                    <text x={leaf.x0 + 6} y={leaf.y0 + 32}
                      fontSize="12" fontFamily={'"Courier New", Courier, monospace'}
                      fill={C.paper} fillOpacity={0.85}>
                      {leaf.value}
                    </text>
                  </>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* 트리뷰 — 데이터 표 토글과 동일한 레이아웃 패턴 */}
      <div className="flex gap-3 mt-3 mb-3 items-start">
        <div>
          <div aria-live="polite" style={{ color: C.inkFaint }}>
            {hierarchyData.children.length}개 카테고리 · 전체 계층
          </div>
          <div className="mt-2 items-start">
            <div aria-live="polite" style={{ color: C.inkFaint }}>
              합 {total} · {navList.length}개 항목 · 포커스: {navList[focusIdx]}
            </div>
          </div>
        </div>
        <button onClick={() => setTreeOpen((v) => !v)} aria-expanded={treeOpen}
          aria-controls="d19-tree"
          className="ml-auto"
          {...focusable}>
          {treeOpen ? '트리뷰 닫기' : '트리뷰로 보기'}
        </button>
      </div>
      {treeOpen && (
        <div id="d19-tree" style={{ fontSize: 14, lineHeight: 1.7, marginTop: 8 }}>
          <ul role="tree" aria-label="매출 계층" className="list-none"
            style={{ color: C.ink }}>
            {hierarchyData.children.map((cat) => {
              const catTotal = d3.sum(cat.children, (c) => c.value);
              return (
                <li key={cat.name} role="treeitem" aria-expanded="true" style={{ marginBottom: 6 }}>
                  <div className="flex items-center gap-2" style={{ fontWeight: 600 }}>
                    <span style={{ color: colorFor(cat.name) }} aria-hidden="true">▼</span>
                    {cat.name}
                    <span style={{ color: C.inkSoft, fontWeight: 400 }}>({catTotal})</span>
                  </div>
                  <ul role="group" className="list-none" style={{ paddingLeft: 24 }}>
                    {cat.children.map((it) => (
                      <li key={it.name} role="treeitem">
                        · {it.name} <span style={{ color: C.inkSoft }}>{it.value}</span>
                      </li>
                    ))}
                  </ul>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

// ════════════════════════════════════════════════════════════
// #20 — Sunburst (zoomable)
// ════════════════════════════════════════════════════════════
const D20 = () => {
  const [focusName, setFocusName] = useState('전체');
  const [focusIdx, setFocusIdx] = useState(0);
  const [tableOpen, setTableOpen] = useState(false);
  const reduced = useReducedMotion();

  const W = 420, H = 420;
  const radius = 180;

  // d3.partition으로 사용
  const root = useMemo(() => {
    const r = d3.hierarchy(hierarchyData)
      .sum((d) => d.children ? 0 : (d.value || 0))
      .sort((a, b) => b.value - a.value);
    d3.partition().size([2 * Math.PI, radius])(r);
    return r;
  }, []);

  // 현재 줌 중심
  const focusNode = useMemo(() => {
    let found = null;
    root.each((d) => { if (d.data.name === focusName) found = d; });
    return found || root;
  }, [focusName, root]);

  // 시각화에 보일 노드 (focus의 후손 중 깊이 2 이내)
  const visible = useMemo(() => {
    const arr = [];
    focusNode.each((d) => {
      if (d.depth >= focusNode.depth && d.depth <= focusNode.depth + 2) {
        arr.push(d);
      }
    });
    return arr;
  }, [focusNode]);

  // 활성 노드의 자식들 — 키보드 탐색 대상
  const focusableChildren = focusNode.children || [];
  useEffect(() => { setFocusIdx(0); }, [focusName]);

  const onKey = (e) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      setFocusIdx((i) => Math.min(focusableChildren.length - 1, i + 1));
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      setFocusIdx((i) => Math.max(0, i - 1));
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const target = focusableChildren[focusIdx];
      if (target && target.children) setFocusName(target.data.name);
    } else if (e.key === 'Backspace' || e.key === 'Escape') {
      e.preventDefault();
      if (focusNode.parent) setFocusName(focusNode.parent.data.name);
    }
  };

  const focusedChild = focusableChildren[focusIdx];

  // arc 생성
  const arc = (d) => {
    const x0 = ((d.x0 - focusNode.x0) / (focusNode.x1 - focusNode.x0)) * 2 * Math.PI;
    const x1 = ((d.x1 - focusNode.x0) / (focusNode.x1 - focusNode.x0)) * 2 * Math.PI;
    const y0 = (d.depth - focusNode.depth) * 70;
    const y1 = y0 + 65;
    if (y0 < 0) return '';
    return d3.arc()
      .startAngle(x0).endAngle(x1)
      .innerRadius(y0).outerRadius(y1)
      .padAngle(0.005).padRadius(50)();
  };

  return (
    <div>
      <Usage mouse="섹터 클릭 → 줌, 중앙 클릭 → 복귀"
        keyboard="Tab → ←→ Enter, Esc/Backspace 복귀" />

      {/* breadcrumb */}
      <nav aria-label="줌 경로" className="flex items-center gap-1 mb-2" style={{ fontSize: 12, minHeight: 18, lineHeight: '18px' }}>
        {(() => {
          const chain = [];
          let node = focusNode;
          while (node) { chain.unshift(node); node = node.parent; }
          return chain.map((n, i) => (
            <React.Fragment key={n.data.name}>
              {i > 0 && <span style={{ color: C.inkFaint }}>/</span>}
              <button onClick={() => setFocusName(n.data.name)}
                aria-current={i === chain.length - 1 ? 'page' : undefined}
                className="font-mono text-[11px]"
                style={{
                  color: i === chain.length - 1 ? C.ink : C.focus,
                  textDecoration: i === chain.length - 1 ? 'none' : 'underline',
                  background: 'none', border: 'none', padding: 0,
                  cursor: i === chain.length - 1 ? 'default' : 'pointer',
                }} {...focusable}>{n.data.name}</button>
            </React.Fragment>
          ));
        })()}
      </nav>

      <div role="application" aria-label="선버스트 차트, 매출 계층"
        tabIndex={0} onKeyDown={onKey}
        style={{ display: 'flex', justifyContent: 'center' }} {...focusable}>
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: H, background: C.paper, border: `1px solid ${C.rule}` }}>
          <g transform={`translate(${W / 2},${H / 2})`}>
            {visible.map((d, i) => {
              if (d === focusNode) {
                // 중앙 원
                return (
                  <g key="center" style={{ cursor: focusNode.parent ? 'pointer' : 'default' }}
                    onClick={() => focusNode.parent && setFocusName(focusNode.parent.data.name)}>
                    <circle r={45} fill={C.paper} stroke={C.ink} strokeWidth={1} />
                    <text textAnchor="middle" dy="-0.2em"
                      fontSize="11" fontFamily={'"Courier New", Courier, monospace'}
                      fill={C.ink} fontWeight="600">{focusNode.data.name}</text>
                    <text textAnchor="middle" dy="1.2em"
                      fontSize="10" fontFamily={'"Courier New", Courier, monospace'}
                      fill={C.inkSoft}>{focusNode.value}</text>
                    {focusNode.parent && (
                      <text textAnchor="middle" dy="2.6em"
                        fontSize="8" fontFamily={'"Courier New", Courier, monospace'}
                        fill={C.inkFaint}>← 클릭</text>
                    )}
                  </g>
                );
              }
              const arcPath = arc(d);
              if (!arcPath) return null;
              const topIdx = (() => {
                let node = d;
                while (node.parent && node.depth > 1) node = node.parent;
                const idx = hierarchyData.children.findIndex((c) => c.name === node.data.name);
                return idx >= 0 ? idx : 0;
              })();
              const isFocused = focusedChild === d;
              const isChild = d.depth === focusNode.depth + 1;
              return (
                <g key={i}
                  onClick={() => d.children && setFocusName(d.data.name)}
                  style={{ cursor: d.children ? 'pointer' : 'default' }}>
                  <path d={arcPath}
                    fill={SERIES[topIdx]}
                    fillOpacity={isChild ? 0.9 : 0.55}
                    stroke={C.paper} strokeWidth={1} />
                  {isFocused && (
                    <path d={arcPath} fill="none" stroke={C.focus} strokeWidth={3} />
                  )}
                  {/* 라벨 — 호가 충분히 크면 */}
                  {(() => {
                    const x0 = ((d.x0 - focusNode.x0) / (focusNode.x1 - focusNode.x0)) * 2 * Math.PI;
                    const x1 = ((d.x1 - focusNode.x0) / (focusNode.x1 - focusNode.x0)) * 2 * Math.PI;
                    const angle = (x0 + x1) / 2 - Math.PI / 2;
                    const r = (d.depth - focusNode.depth) * 70 + 32;
                    const arcSize = x1 - x0;
                    if (arcSize < 0.15) return null;
                    return (
                      <text
                        x={Math.cos(angle) * r}
                        y={Math.sin(angle) * r}
                        textAnchor="middle" dy="0.35em"
                        fontSize={arcSize > 0.4 ? 11 : 9}
                        fontFamily={'"Courier New", Courier, monospace'}
                        fill={C.paper}
                        fontWeight={isFocused ? 700 : 500}
                        pointerEvents="none">
                        {d.data.name}
                      </text>
                    );
                  })()}
                </g>
              );
            })}
          </g>
        </svg>
      </div>

      <div className="flex gap-3 mt-3 mb-3 items-start">
        <div aria-live="polite" style={{ color: C.inkFaint }}>
          {focusNode.data.name} 중심 — 직속 자식 {focusableChildren.length}개
          {focusedChild && ` · 포커스: ${focusedChild.data.name} (${focusedChild.value})`}
        </div>
        <button onClick={() => setTableOpen((v) => !v)} aria-expanded={tableOpen}
          aria-controls="d20-table"
          className="ml-auto"
          {...focusable}>
          {tableOpen ? '데이터 표 닫기' : '평탄화된 계층 데이터'}
        </button>
      </div>
      {tableOpen && (
        <div id="d20-table">
          <table>
            <caption style={srOnly}>계층 표</caption>
            <thead>
              <tr>{['카테고리', '항목', '값'].map((h) => <th key={h} scope="col">{h}</th>)}</tr>
            </thead>
            <tbody>
              {hierarchyData.children.flatMap((cat) =>
                cat.children.map((it, i) => (
                  <tr key={`${cat.name}-${it.name}`}>
                    <td>{i === 0 ? cat.name : ''}</td>
                    <td>{it.name}</td>
                    <td>{it.value}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// ════════════════════════════════════════════════════════════
// #21 — Sankey (간소 직접 구현)
// ════════════════════════════════════════════════════════════
const D21 = () => {
  const [activeNode, setActiveNode] = useState(null);
  const [focusIdx, setFocusIdx] = useState(0);
  const [tableOpen, setTableOpen] = useState(false);

  const W = 560, H = 360;
  const m = { t: 20, r: 48, b: 20, l: 20 };
  const innerW = W - m.l - m.r;
  const innerH = H - m.t - m.b;

  // 노드를 col별로 그룹
  const layout = useMemo(() => {
    const cols = d3.group(sankeyData.nodes, (d) => d.col);
    const maxCol = d3.max(sankeyData.nodes, (d) => d.col);
    const colWidth = innerW / (maxCol + 1);
    const nodes = sankeyData.nodes.map((n) => ({ ...n }));
    const nodeById = new Map(nodes.map((n) => [n.id, n]));

    // 각 col에서 노드 총 흐름량 계산
    cols.forEach((colNodes, col) => {
      colNodes.forEach((n) => {
        const incoming = d3.sum(sankeyData.links.filter((l) => l.t === n.id), (l) => l.v);
        const outgoing = d3.sum(sankeyData.links.filter((l) => l.s === n.id), (l) => l.v);
        nodeById.get(n.id).flow = Math.max(incoming, outgoing);
      });
    });

    // 각 col의 총 flow로 스케일 결정
    const colSums = new Map();
    cols.forEach((colNodes, col) => {
      colSums.set(col, d3.sum(colNodes, (n) => nodeById.get(n.id).flow));
    });
    const maxColSum = d3.max([...colSums.values()]);
    const scale = (innerH - 20) / maxColSum;
    const padding = 8;

    // 각 col 내에서 노드 y 배치
    cols.forEach((colNodes, col) => {
      let y = 0;
      colNodes.forEach((n, i) => {
        const node = nodeById.get(n.id);
        node.x = m.l + col * colWidth + 20;
        node.y = m.t + y;
        node.w = 14;
        node.h = node.flow * scale;
        y += node.h + padding;
      });
    });

    // links — source 출력 누적 / target 입력 누적
    const linkInOff = new Map();
    const linkOutOff = new Map();
    const links = sankeyData.links.map((l) => {
      const s = nodeById.get(l.s);
      const t = nodeById.get(l.t);
      const linkH = l.v * scale;
      const sOff = linkOutOff.get(l.s) || 0;
      const tOff = linkInOff.get(l.t) || 0;
      linkOutOff.set(l.s, sOff + linkH);
      linkInOff.set(l.t, tOff + linkH);
      const x1 = s.x + s.w, y1 = s.y + sOff;
      const x2 = t.x, y2 = t.y + tOff;
      return { ...l, x1, y1, x2, y2, h: linkH, s, t };
    });

    return { nodes, links };
  }, []);

  const activeLinks = useMemo(() => {
    if (!activeNode) return new Set();
    return new Set(
      layout.links
        .filter((l) => l.s.id === activeNode || l.t.id === activeNode)
        .map((_, i) => i)
    );
  }, [activeNode, layout]);

  // 컬럼 순서대로 노드 정렬 (키보드 탐색)
  const allNodes = useMemo(() =>
    [...layout.nodes].sort((a, b) => a.col - b.col || a.y - b.y),
    [layout]
  );

  const onKey = (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault(); setFocusIdx((i) => (i + 1) % allNodes.length);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault(); setFocusIdx((i) => (i - 1 + allNodes.length) % allNodes.length);
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setActiveNode((cur) => cur === allNodes[focusIdx].id ? null : allNodes[focusIdx].id);
    } else if (e.key === 'Escape') {
      e.preventDefault(); setActiveNode(null);
    }
  };

  const focused = allNodes[focusIdx];
  const activeData = activeNode || focused?.id;
  const inflow = activeData
    ? sankeyData.links.filter((l) => l.t === activeData).reduce((s, l) => s + l.v, 0) : 0;
  const outflow = activeData
    ? sankeyData.links.filter((l) => l.s === activeData).reduce((s, l) => s + l.v, 0) : 0;

  return (
    <div>
      <Usage mouse="노드 호버로 경로 강조 · 클릭 고정"
        keyboard="Tab → ←→ Enter/Space, Esc 해제" />

      <div role="application"
        aria-label="유저 여정 sankey, 9개 단계, 13개 경로"
        tabIndex={0} onKeyDown={onKey} {...focusable}>
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: H, background: C.paper, border: `1px solid ${C.rule}` }}>
          {/* links */}
          {layout.links.map((l, i) => {
            const isActive = activeData && (l.s.id === activeData || l.t.id === activeData);
            const isDim = activeData && !isActive;
            const path = `M${l.x1},${l.y1 + l.h / 2}` +
              ` C${(l.x1 + l.x2) / 2},${l.y1 + l.h / 2} ${(l.x1 + l.x2) / 2},${l.y2 + l.h / 2} ${l.x2},${l.y2 + l.h / 2}`;
            const isExit = l.t.id === 'exit';
            return (
              <path key={i} d={path}
                fill="none"
                stroke={isExit ? C.inkFaint : isActive ? C.red : C.olive}
                strokeOpacity={isDim ? 0.05 : isActive ? 0.6 : 0.3}
                strokeWidth={Math.max(1, l.h)} />
            );
          })}

          {/* nodes */}
          {layout.nodes.map((n, i) => {
            const isActive = activeData === n.id;
            const isFocused = focused?.id === n.id;
            const isExit = n.id === 'exit';
            return (
              <g key={n.id}
                onMouseEnter={() => setActiveNode(n.id)}
                onMouseLeave={() => setActiveNode(null)}
                style={{ cursor: 'pointer' }}>
                {isFocused && !activeNode && (
                  <rect x={n.x - 4} y={n.y - 4} width={n.w + 8} height={n.h + 8}
                    fill="none" stroke={C.focus} strokeWidth={2} strokeDasharray="3 2" />
                )}
                <rect x={n.x} y={n.y} width={n.w} height={n.h}
                  fill={isExit ? C.inkFaint : isActive ? C.red : C.navy}
                  fillOpacity={1} />
                <text x={n.x + n.w + 6} y={n.y + n.h / 2}
                  dy="0.35em" fontSize="11"
                  fontFamily={'"Courier New", Courier, monospace'}
                  fill={C.ink}
                  fontWeight={isActive || isFocused ? 700 : 500}>
                  {n.name} <tspan style={{ fontSize: 9, fill: C.inkSoft }}>{n.flow}</tspan>
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="flex gap-3 mt-3 mb-3 items-start">
        <div aria-live="polite" style={{ color: C.inkSoft }}>
          {activeData
            ? `${layout.nodes.find((n) => n.id === activeData)?.name} — 유입 ${inflow}, 유출 ${outflow}`
            : `전체 9개 단계 · ←→로 노드 탐색, Enter로 경로 고정`}
        </div>
        <button onClick={() => setTableOpen((v) => !v)} aria-expanded={tableOpen}
          aria-controls="d21-table"
          className="ml-auto"
          {...focusable}>
          {tableOpen ? '데이터 표 닫기' : `총 ${sankeyData.links.length}개 흐름`}
        </button>
      </div>
      {tableOpen && (
        <div id="d21-table">
          <table>
            <caption style={srOnly}>흐름 표</caption>
            <thead>
              <tr>{['출발', '도착', '인원'].map((h) => <th key={h} scope="col">{h}</th>)}</tr>
            </thead>
            <tbody>
              {sankeyData.links.map((l, i) => (
                <tr key={i}>
                  <td>{sankeyData.nodes.find((n) => n.id === l.s).name}</td>
                  <td>{sankeyData.nodes.find((n) => n.id === l.t).name}</td>
                  <td>{l.v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// ════════════════════════════════════════════════════════════
// #22 — Chord diagram
// ════════════════════════════════════════════════════════════
const D22 = () => {
  const [active, setActive] = useState(null);
  const [focusIdx, setFocusIdx] = useState(0);
  const [tableOpen, setTableOpen] = useState(false);

  const W = 480, H = 480;
  const radius = 180;
  const innerRadius = radius - 20;

  const chord = useMemo(() => {
    return d3.chord().padAngle(0.04).sortSubgroups(d3.descending)(chordMatrix);
  }, []);

  const arcGen = d3.arc().innerRadius(innerRadius).outerRadius(radius);
  const ribbon = d3.ribbon().radius(innerRadius);

  const onKey = (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault(); setFocusIdx((i) => (i + 1) % chordLabels.length);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault(); setFocusIdx((i) => (i - 1 + chordLabels.length) % chordLabels.length);
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setActive((cur) => cur === focusIdx ? null : focusIdx);
    } else if (e.key === 'Escape') {
      e.preventDefault(); setActive(null);
    }
  };

  const activeIdx = active !== null ? active : focusIdx;

  return (
    <div>
      <Usage mouse="외곽 호버로 관련 흐름 강조"
        keyboard="Tab → ←→ Enter/Space, Esc 해제" />

      <div role="application"
        aria-label="도시 간 이동 흐름, 5개 도시"
        tabIndex={0} onKeyDown={onKey}
        style={{ display: 'flex', justifyContent: 'center' }} {...focusable}>
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: H, background: C.paper, border: `1px solid ${C.rule}` }}>
          <g transform={`translate(${W / 2},${H / 2})`}>
            {/* ribbons */}
            {chord.map((c, i) => {
              const isActive = c.source.index === activeIdx || c.target.index === activeIdx;
              const isDim = active !== null && !isActive;
              return (
                <path key={i} d={ribbon(c)}
                  fill={SERIES[c.source.index]}
                  fillOpacity={isDim ? 0.06 : isActive ? 0.75 : 0.4}
                  stroke={C.paper} strokeWidth={0.5} />
              );
            })}
            {/* groups (outer arcs) */}
            {chord.groups.map((g, i) => {
              const isFocused = focusIdx === i;
              const isActiveG = activeIdx === i;
              return (
                <g key={i}
                  onMouseEnter={() => setActive(i)}
                  onMouseLeave={() => setActive(null)}
                  style={{ cursor: 'pointer' }}>
                  <path d={arcGen(g)}
                    fill={SERIES[i]}
                    stroke={isFocused ? C.focus : C.paper}
                    strokeWidth={isFocused ? 3 : 1.5} />
                  {/* 라벨 */}
                  {(() => {
                    const angle = (g.startAngle + g.endAngle) / 2 - Math.PI / 2;
                    const r = radius + 18;
                    const x = Math.cos(angle) * r;
                    const y = Math.sin(angle) * r;
                    return (
                      <g transform={`translate(${x},${y})`}>
                        <text textAnchor="middle" dy="0.35em"
                          fontSize="12" fontFamily={'"Courier New", Courier, monospace'}
                          fill={C.ink}
                          fontWeight={isActiveG ? 700 : 500}>
                          {chordLabels[i]}
                        </text>
                        <text textAnchor="middle" dy="1.6em"
                          fontSize="9" fontFamily={'"Courier New", Courier, monospace'}
                          fill={C.inkSoft}>
                          {d3.sum(chordMatrix[i]) + d3.sum(chordMatrix, (row) => row[i])}
                        </text>
                      </g>
                    );
                  })()}
                </g>
              );
            })}
          </g>
        </svg>
      </div>

      <div className="flex gap-3 mt-3 mb-3 items-start">
        <div aria-live="polite" style={{ color: C.inkSoft }}>
          {activeIdx !== null && (
            <>
              <strong style={{ color: C.ink }}>{chordLabels[activeIdx]}</strong>
              {' — '}
              출발 {d3.sum(chordMatrix[activeIdx])}천 명,{' '}
              도착 {d3.sum(chordMatrix, (row) => row[activeIdx])}천 명
            </>
          )}
        </div>
        <button onClick={() => setTableOpen((v) => !v)} aria-expanded={tableOpen}
          aria-controls="d22-table"
          className="ml-auto"
          {...focusable}>
          {tableOpen ? '데이터 표 닫기' : '5×5 매트릭스 (단위: 천 명)'}
        </button>
      </div>
      {tableOpen && (
        <div id="d22-table">
          <table>
            <caption style={srOnly}>도시 간 이동 매트릭스</caption>
            <thead>
              <tr>{['출발 \\ 도착', ...chordLabels].map((h) => <th key={h} scope="col">{h}</th>)}</tr>
            </thead>
            <tbody>
              {chordMatrix.map((row, i) => (
                <tr key={i}>
                  <td>{chordLabels[i]}</td>
                  {row.map((v, j) => <td key={j}>{v}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// ════════════════════════════════════════════════════════════
// #23 — Hierarchical Edge Bundling
// ════════════════════════════════════════════════════════════
const D23 = () => {
  const [activeId, setActiveId] = useState(null);
  const [hoverId, setHoverId] = useState(null);
  const [focusIdx, setFocusIdx] = useState(0);
  const [tableOpen, setTableOpen] = useState(false);

  const W = 480, H = 480;
  const radius = 210;
  const innerRadius = radius - 80;

  // 트리: 코드베이스 모듈 의존성 (가상)
  const bundleData = useMemo(() => ({
    name: 'app',
    children: [
      {
        name: 'ui', children: [
          { name: 'Button', imports: ['utils.format', 'icons.Icon'] },
          { name: 'Card', imports: ['ui.Button', 'utils.cn'] },
          { name: 'Modal', imports: ['ui.Button', 'hooks.useEsc'] },
          { name: 'Input', imports: ['utils.validate', 'utils.cn'] },
        ],
      },
      {
        name: 'hooks', children: [
          { name: 'useAuth', imports: ['api.user', 'utils.storage'] },
          { name: 'useEsc', imports: [] },
          { name: 'useFetch', imports: ['api.client'] },
        ],
      },
      {
        name: 'api', children: [
          { name: 'client', imports: ['utils.storage'] },
          { name: 'user', imports: ['api.client'] },
          { name: 'orders', imports: ['api.client', 'api.user'] },
        ],
      },
      {
        name: 'utils', children: [
          { name: 'format', imports: [] },
          { name: 'cn', imports: [] },
          { name: 'storage', imports: [] },
          { name: 'validate', imports: ['utils.format'] },
        ],
      },
      {
        name: 'icons', children: [
          { name: 'Icon', imports: [] },
        ],
      },
    ],
  }), []);

  // d3 cluster layout
  const root = useMemo(() => {
    const r = d3.hierarchy(bundleData);
    d3.cluster().size([2 * Math.PI, innerRadius])(r);
    return r;
  }, []);

  // 리프 노드에 '카테고리.이름' 형태의 ID 부여
  const leaves = useMemo(() => {
    const arr = root.leaves();
    arr.forEach((n) => {
      n._id = `${n.parent.data.name}.${n.data.name}`;
    });
    return arr;
  }, [root]);

  // id → node
  const leafMap = useMemo(() => {
    const m = new Map();
    leaves.forEach((l) => m.set(l._id, l));
    return m;
  }, [leaves]);

  // 링크 데이터: source(현재 leaf)가 imports 안의 target leaves에 연결
  const links = useMemo(() => {
    const arr = [];
    leaves.forEach((leaf) => {
      const imports = leaf.data.imports || [];
      imports.forEach((imp) => {
        const target = leafMap.get(imp);
        if (target) arr.push({ source: leaf, target });
      });
    });
    return arr;
  }, [leaves, leafMap]);

  // 그룹별 색 (최상위 부모)
  const groupColor = (leaf) => {
    const top = leaf.ancestors().find((a) => a.depth === 1);
    const idx = bundleData.children.findIndex((c) => c.name === top?.data.name);
    return SERIES[idx >= 0 ? idx : 0];
  };

  // 활성 노드와 관련된 링크
  const activeNode = leaves.find((l) => l._id === (hoverId || activeId));
  const focusedNode = leaves[focusIdx];
  const targetNode = activeNode || focusedNode;

  const incoming = new Set();
  const outgoing = new Set();
  if (targetNode) {
    links.forEach((l) => {
      if (l.source._id === targetNode._id) outgoing.add(l.target._id);
      if (l.target._id === targetNode._id) incoming.add(l.source._id);
    });
  }

  // 곡선 path — bundle line
  const line = d3.lineRadial()
    .curve(d3.curveBundle.beta(0.85))
    .radius((d) => d.y)
    .angle((d) => d.x);
  const pathFor = (s, t) => line(s.path(t));

  const onKey = (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault(); setFocusIdx((i) => (i + 1) % leaves.length);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault(); setFocusIdx((i) => (i - 1 + leaves.length) % leaves.length);
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setActiveId((cur) => cur === focusedNode._id ? null : focusedNode._id);
    } else if (e.key === 'Escape') {
      e.preventDefault(); setActiveId(null);
    }
  };

  return (
    <div>
      <Usage mouse="모듈 호버로 의존성 강조"
        keyboard="Tab → ←→ Enter, Esc 해제" />

      <div role="application"
        aria-label="모듈 의존성 그래프, 계층적 엣지 번들링"
        tabIndex={0} onKeyDown={onKey}
        style={{ display: 'flex', justifyContent: 'center' }} {...focusable}>
        <svg viewBox={`-${W / 2} -${H / 2} ${W} ${H}`}
          style={{ width: '100%', height: H, background: C.paper, border: `1px solid ${C.rule}` }}>
          {/* links */}
          {links.map((l, i) => {
            const isIn = targetNode && l.target._id === targetNode._id;
            const isOut = targetNode && l.source._id === targetNode._id;
            const isActive = isIn || isOut;
            const isDim = targetNode && !isActive;
            return (
              <path key={i} d={pathFor(l.source, l.target)}
                fill="none"
                stroke={isOut ? C.red : isIn ? C.navy : C.inkSoft}
                strokeOpacity={isDim ? 0.03 : isActive ? 0.8 : 0.18}
                strokeWidth={isOut ? 2.5 : isIn ? 1.5 : 1} />
            );
          })}
          {/* leaf labels */}
          {leaves.map((l, i) => {
            const angle = (l.x * 180) / Math.PI - 90;
            const flip = l.x >= Math.PI;
            const isFocused = focusIdx === i;
            const isActiveTarget = targetNode?._id === l._id;
            const isIn = incoming.has(l._id);
            const isOut = outgoing.has(l._id);
            const isRelated = isIn || isOut || isActiveTarget;
            const isDim = targetNode && !isRelated;
            return (
              <g key={l._id}
                transform={`rotate(${angle}) translate(${l.y},0)`}
                onMouseEnter={() => setHoverId(l._id)}
                onMouseLeave={() => setHoverId(null)}
                style={{ cursor: 'pointer' }}>
                {isFocused && !hoverId && (
                  <circle r={7} fill="none" stroke={C.focus} strokeWidth={2} strokeDasharray="2 2" />
                )}
                <circle r={isActiveTarget ? 5 : 3}
                  fill={groupColor(l)}
                  fillOpacity={isDim ? 0.2 : 1} />
                <text
                  dy="0.32em"
                  x={flip ? -8 : 8}
                  textAnchor={flip ? 'end' : 'start'}
                  transform={flip ? 'rotate(180)' : ''}
                  fontSize={isActiveTarget ? 11 : 9}
                  fontFamily={'"Courier New", Courier, monospace'}
                  fill={isOut ? C.red : isIn ? C.navy : isDim ? C.inkFaint : C.ink}
                  fontWeight={isRelated ? 700 : 400}>
                  {l.data.name}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="flex gap-3 mt-3 mb-3 items-start">
        <div>
          <div style={{ color: C.inkSoft }}>
            <span className="flex items-center gap-2">
              <svg width="28" height="10" aria-hidden="true">
                <line x1="0" y1="5" x2="28" y2="5" stroke={C.red} strokeWidth="3" />
              </svg>
              <span style={{ color: C.ink, fontWeight: 600 }}>가 의존함</span>
              <span style={{ color: C.inkFaint }}>· outgoing · 굵은 빨강</span>
            </span>
            <span className="flex items-center gap-2">
              <svg width="28" height="10" aria-hidden="true">
                <line x1="0" y1="5" x2="28" y2="5" stroke={C.navy} strokeWidth="2" />
              </svg>
              <span style={{ color: C.ink, fontWeight: 600 }}>이 의존됨</span>
              <span style={{ color: C.inkFaint }}>· incoming · 가는 남색</span>
            </span>
          </div>
          <div className="mt-2" aria-live="polite" style={{ color: C.inkSoft }}>
            {targetNode && (
              <>
                <strong style={{ color: C.ink }}>{targetNode._id}</strong> —{' '}
                의존함 {outgoing.size}개{outgoing.size > 0 && `: ${[...outgoing].join(', ')}`} ·{' '}
                의존됨 {incoming.size}개{incoming.size > 0 && `: ${[...incoming].join(', ')}`}
              </>
            )}
          </div>
        </div>

        <div className="ml-auto">
          <button onClick={() => setTableOpen((v) => !v)} aria-expanded={tableOpen}
            aria-controls="d23-table"
            className="ml-auto"
            {...focusable}>
            {tableOpen ? '데이터 표 닫기' : `총 ${leaves.length}개 모듈`}
          </button>
        </div>
      </div>
      {tableOpen && (
        <div id="d23-table">
          <table>
            <caption style={srOnly}>의존성 표</caption>
            <thead>
              <tr>{['모듈', '의존함 (imports)', '의존됨 (used by)'].map((h) => <th key={h} scope="col">{h}</th>)}</tr>
            </thead>
            <tbody>
              {leaves.map((l) => {
                const out = links.filter((lk) => lk.source._id === l._id).map((lk) => lk.target._id);
                const inc = links.filter((lk) => lk.target._id === l._id).map((lk) => lk.source._id);
                return (
                  <tr key={l._id}>
                    <td>{l._id}</td>
                    <td>{out.join(', ') || '—'}</td>
                    <td>{inc.join(', ') || '—'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// ════════════════════════════════════════════════════════════
// META — 각 데모의 인터랙션·접근성 고려사항
// ════════════════════════════════════════════════════════════
const META = {
  18: {
    title: 'Force-directed Network',
    method: 'd3 force · 정적 레이아웃 · 노드 + 이웃 강조',
    interactions: [
      '노드 호버 시 자신·이웃·연결선만 강조, 나머지 dim',
      '활성 노드 카드에 그룹·연결 수·이웃 이름까지 표시',
      '검색창으로 노드 이름 부분 매칭, 매칭 노드에 골드 링',
      '그룹별 색 + 모양 글리프(●■▲◆★) 이중코딩',
      '시뮬레이션을 미리 수렴시킨 정적 좌표 사용 (떨림 없음)',
    ],
    a11y: [
      '노드를 알파벳 순서로 정렬해 키보드 ←→ 탐색 가능',
      '시뮬레이션 모션은 단발성 — reduce-motion 자동 부합',
      '활성 노드의 이웃을 aria-live로 음성 안내',
      '검색 결과 개수를 aria-live로 알림',
      '데이터 표에 부서별 모든 연결 대상 명시',
      '그룹은 색·모양 + 텍스트 범례로 삼중 식별',
    ],
  },
  19: {
    title: 'Treemap · 트리뷰 병행',
    method: 'd3.treemap · squarified · breadcrumb · 트리뷰 fallback',
    interactions: [
      '최상위 블록 클릭으로 하위 카테고리 진입',
      'breadcrumb의 각 단계가 클릭 가능 (직접 점프)',
      '면적이 곧 값, 색은 부모 카테고리 표현',
      '블록 내 라벨은 충분한 크기일 때만 표시',
    ],
    a11y: [
      '면적 클릭 외에 ←→↑↓ + Enter로 탐색',
      'Esc/Backspace로 상위 복귀',
      'breadcrumb에 aria-current="page"',
      '트리뷰(role="tree") fallback — 전체 계층을 펼친 상태로 노출',
      '면적이 작아 라벨 숨겨진 항목도 트리뷰에서는 모두 보임',
      'aria-live로 합계 + 항목 수 + 포커스 항목 안내',
    ],
  },
  20: {
    title: 'Sunburst · zoomable',
    method: 'd3.partition · 줌 중심 변경 · breadcrumb',
    interactions: [
      '섹터 클릭으로 그 섹터를 중심으로 줌인',
      '중앙 원 클릭으로 한 단계 줌아웃',
      '줌 중심은 항상 중앙 원에 부모 라벨 표시',
      '호가 작으면 라벨 자동 숨김',
    ],
    a11y: [
      '←→로 같은 깊이의 자식 순회, Enter로 줌인',
      'Esc/Backspace로 줌아웃',
      'breadcrumb 각 단계 클릭으로 즉시 점프',
      '중앙 원에 "← 클릭" 텍스트로 줌아웃 어포던스',
      'aria-live로 현재 중심 + 자식 수 + 포커스 안내',
      '데이터 표로 전체 계층을 평탄화해 제공',
    ],
  },
  21: {
    title: 'Sankey · 유저 여정',
    method: '직접 구현 · cubic Bezier 링크 · column 배치',
    interactions: [
      '노드 호버 시 자신을 지나는 모든 경로 강조, 나머지 dim',
      'Enter/클릭으로 경로 강조 고정',
      '이탈 노드는 회색으로 명시 (긍정 vs 부정 경로)',
      '링크 두께가 곧 인원 수 (시각적으로 즉각 파악)',
    ],
    a11y: [
      '컬럼 순서로 노드 정렬 → 키보드 ←→로 자연스럽게 순회',
      '활성 노드 시 유입/유출 인원을 별도로 명시',
      '폭이 작은 링크도 데이터 표에서 정확한 값 확인',
      'aria-live로 경로 합계를 음성 안내',
      '범례·색·텍스트로 이탈 경로 별도 표시',
    ],
  },
  22: {
    title: 'Chord diagram · 도시 이동',
    method: 'd3.chord · ribbon · 매트릭스 fallback',
    interactions: [
      '외곽 호버 시 해당 도시 관련 ribbon만 부각',
      '클릭으로 강조 고정',
      'ribbon 두께가 곧 이동량',
      '외곽 호 길이가 도시별 전체 활동량을 표현',
    ],
    a11y: [
      '←→로 도시 순환, Enter로 토글',
      '활성 도시의 출발·도착 합계 별도 안내',
      'chord의 본질은 매트릭스 — 데이터 표가 가장 정확',
      '도시별 색은 명도가 충분히 차이 나도록 조정',
      'aria-live로 활성 도시와 합계를 자연어로 안내',
    ],
  },
  23: {
    title: 'Edge bundling · 의존성',
    method: 'd3.curveBundle.beta · 방향성 색 구분',
    interactions: [
      '리프 노드 호버 시 자신의 import / used-by 모두 강조',
      'outgoing(의존함)은 빨강, incoming(의존됨)은 남색',
      '관련 없는 곡선과 라벨은 dim',
      '계층 구조가 곡선 묶음으로 자연스럽게 표현',
    ],
    a11y: [
      '리프 노드를 순회하는 키보드 탐색',
      '색만이 아닌 별도 라벨(범례)로 방향 명시',
      '활성 노드의 outgoing/incoming 목록을 텍스트로도 제공',
      'aria-live로 의존 관계를 완전한 문장으로 안내',
      '데이터 표에 모든 의존성 양방향 표기',
    ],
  },
};

// ════════════════════════════════════════════════════════════
// CARD with collapsible 고려사항
// ════════════════════════════════════════════════════════════
function ExpandedCard({ num, cat, openAll, children }) {
  const meta = META[num];
  return (
    <div data-cg-root>
      <h3 id={`chart-${num.toString().padStart(2, '0')}`}>#{num.toString().padStart(2, '0')} {cat} - {meta.title}</h3>
      <p>{meta.method}</p>
      {children}
      <details className="mt-3" {...(openAll ? { open: true } : {})}>
        <summary>인터랙션 · 접근성 고려사항</summary>
        <h5>인터랙션</h5>
        <ul>{meta.interactions.map((it, i) => <li key={i}>{it}</li>)}</ul>
        <h5>접근성</h5>
        <ul>{meta.a11y.map((it, i) => <li key={i}>{it}</li>)}</ul>
      </details>
    </div>
  );
}

const DEMOS = [
  { num: 18, cat: 'NETWORK', cmp: <D18 /> },
  { num: 19, cat: 'HIERARCHY', cmp: <D19 /> },
  { num: 20, cat: 'HIERARCHY', cmp: <D20 /> },
  { num: 21, cat: 'FLOW', cmp: <D21 /> },
  { num: 22, cat: 'FLOW', cmp: <D22 /> },
  { num: 23, cat: 'NETWORK', cmp: <D23 /> },
];

export default function Phase2() {
  const [openAll, setOpenAll] = useState(false);

  useEffect(() => {
    injectChartGalleryVars();
  }, []);

  return (
    <div style={{

      fontFamily: 'inherit', color: C.ink,
    }} className="">

      <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
        {DEMOS.map(({ num, cat, cmp }) => (
          <ExpandedCard key={num} num={num} cat={cat} openAll={openAll}>
            {cmp}
          </ExpandedCard>
        ))}
      </div>

    </div>
  );
}
