import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import * as d3 from 'd3';
import * as THREE from 'three';

// ════════════════════════════════════════════════════════════
// PALETTE (Phase 1-2 동일)
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

// Three.js / Canvas2D / SVG는 var(--...) 문자열을 파싱하지 못한다 — raw hex 필요.
// 블로그 테마([data-theme])를 따라가며 매 토글 시 재계산.
const RAW_LIGHT = {
  bg: '#F5F1E8', paper: '#FBF8F1', ink: '#1A1715',
  inkSoft: '#5C5550', inkFaint: '#7A7268',
  rule: '#D9D2C6', ruleSoft: '#E8E1D3',
  red: '#B83D24', navy: '#1F3450', olive: '#5C6A1F',
  mustard: '#9A6E0F', teal: '#2D6A6D', rose: '#9E3D6E',
  focus: '#3E5F8A',
};
const RAW_DARK = {
  bg: '#1A1612', paper: '#221F1B', ink: '#F5F1E8',
  inkSoft: '#A89F92', inkFaint: '#827A6F',
  rule: '#3D3833', ruleSoft: '#2A2620',
  red: '#D9583E', navy: '#6F8AAF', olive: '#A3B257',
  mustard: '#D6A35A', teal: '#6FA8AB', rose: '#C26793',
  focus: '#7F9EC5',
};
const useRawPalette = () => {
  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    const root = document.documentElement;
    const read = () => setIsDark(root.dataset.theme === 'dark');
    read();
    const obs = new MutationObserver(read);
    obs.observe(root, { attributes: true, attributeFilter: ['data-theme'] });
    return () => obs.disconnect();
  }, []);
  return isDark ? RAW_DARK : RAW_LIGHT;
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

// 한국 시도 tile grid (col, row) + 인구밀도 (명/km², 2024 근사)
const koreaTiles = [
  { name: '서울', col: 1, row: 1, value: 16158 },
  { name: '경기', col: 2, row: 1, value: 1349 },
  { name: '인천', col: 0, row: 1, value: 2826 },
  { name: '강원', col: 3, row: 0, value: 90 },
  { name: '충북', col: 3, row: 1, value: 215 },
  { name: '충남', col: 2, row: 2, value: 268 },
  { name: '대전', col: 3, row: 2, value: 2683 },
  { name: '세종', col: 2.5, row: 1.5, value: 919 },
  { name: '경북', col: 4, row: 1, value: 138 },
  { name: '대구', col: 4, row: 2, value: 2701 },
  { name: '울산', col: 5, row: 2, value: 1080 },
  { name: '부산', col: 4, row: 3, value: 4391 },
  { name: '경남', col: 3, row: 3, value: 305 },
  { name: '전북', col: 2, row: 3, value: 217 },
  { name: '광주', col: 1, row: 3, value: 2870 },
  { name: '전남', col: 1, row: 4, value: 144 },
  { name: '제주', col: 0, row: 5, value: 349 },
];

// 도시 간 이동 흐름 (천 명 단위, 가상)
const koreaFlows = [
  { from: '서울', to: '부산', value: 420 },
  { from: '서울', to: '대전', value: 380 },
  { from: '서울', to: '대구', value: 260 },
  { from: '서울', to: '광주', value: 180 },
  { from: '서울', to: '제주', value: 220 },
  { from: '부산', to: '서울', value: 410 },
  { from: '부산', to: '대구', value: 240 },
  { from: '대전', to: '서울', value: 370 },
  { from: '대구', to: '부산', value: 230 },
  { from: '대구', to: '서울', value: 250 },
  { from: '광주', to: '서울', value: 170 },
  { from: '제주', to: '서울', value: 200 },
];

// 3D scatter 클러스터 데이터
const scatter3D = (() => {
  const arr = [];
  const clusters = [
    { center: [3, 3, 3], color: 0, label: '클러스터 A' },
    { center: [-3, -2, 1], color: 1, label: '클러스터 B' },
    { center: [0, 1, -3], color: 2, label: '클러스터 C' },
  ];
  clusters.forEach((cl, ci) => {
    for (let i = 0; i < 80; i++) {
      arr.push({
        x: cl.center[0] + (Math.random() - 0.5) * 3,
        y: cl.center[1] + (Math.random() - 0.5) * 3,
        z: cl.center[2] + (Math.random() - 0.5) * 3,
        cluster: ci,
        label: cl.label,
        id: ci * 100 + i,
      });
    }
  });
  return arr;
})();

// 대량 포인트 데이터 (5만 개, 6개 클러스터 가우시안)
const heavyPoints = (() => {
  const arr = [];
  const centers = [
    { x: 0.2, y: 0.3 }, { x: 0.7, y: 0.2 },
    { x: 0.5, y: 0.5 }, { x: 0.8, y: 0.7 },
    { x: 0.2, y: 0.8 }, { x: 0.4, y: 0.85 },
  ];
  const clamp = (v) => Math.max(0, Math.min(0.9999, v));
  for (let i = 0; i < 50000; i++) {
    const c = centers[i % centers.length];
    // Box-Muller
    const u1 = Math.random(), u2 = Math.random();
    const z1 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    const z2 = Math.sqrt(-2 * Math.log(u1)) * Math.sin(2 * Math.PI * u2);
    arr.push({
      x: clamp(c.x + z1 * 0.06),
      y: clamp(c.y + z2 * 0.06),
      g: i % centers.length,
    });
  }
  return arr;
})();

// 세계 도시 (lat, lng, 인구 백만)
const worldCities = [
  { name: 'Tokyo', lat: 35.68, lng: 139.65, pop: 37 },
  { name: 'Delhi', lat: 28.61, lng: 77.21, pop: 32 },
  { name: 'Shanghai', lat: 31.23, lng: 121.47, pop: 28 },
  { name: 'Seoul', lat: 37.57, lng: 126.98, pop: 25 },
  { name: 'Dhaka', lat: 23.81, lng: 90.41, pop: 23 },
  { name: 'São Paulo', lat: -23.55, lng: -46.63, pop: 22 },
  { name: 'Mexico City', lat: 19.43, lng: -99.13, pop: 22 },
  { name: 'Cairo', lat: 30.04, lng: 31.24, pop: 21 },
  { name: 'Mumbai', lat: 19.07, lng: 72.88, pop: 20 },
  { name: 'Beijing', lat: 39.90, lng: 116.41, pop: 20 },
  { name: 'Osaka', lat: 34.67, lng: 135.50, pop: 19 },
  { name: 'New York', lat: 40.71, lng: -74.01, pop: 18 },
  { name: 'Karachi', lat: 24.86, lng: 67.01, pop: 16 },
  { name: 'Istanbul', lat: 41.01, lng: 28.98, pop: 16 },
  { name: 'Lagos', lat: 6.45, lng: 3.39, pop: 16 },
  { name: 'Buenos Aires', lat: -34.61, lng: -58.39, pop: 15 },
  { name: 'London', lat: 51.51, lng: -0.13, pop: 14 },
  { name: 'Moscow', lat: 55.76, lng: 37.62, pop: 12 },
  { name: 'Paris', lat: 48.85, lng: 2.35, pop: 11 },
  { name: 'Sydney', lat: -33.87, lng: 151.21, pop: 5 },
];

// ════════════════════════════════════════════════════════════
// #24 — Choropleth (Tile Grid Map · 한국 시도)
// ════════════════════════════════════════════════════════════
const D24 = () => {
  const [focusIdx, setFocusIdx] = useState(0);
  const [hover, setHover] = useState(null);
  const [isDark, setIsDark] = useState(false);
  const [tableOpen, setTableOpen] = useState(false);
  // 첫 단계(< 100) 셀이 차트 배경 C.bg와 같은 cream이라 구분이 안 됨 — 흰색으로 분리.
  // (다크모드에서는 흰색이 너무 튀므로 더 짙은 색으로 대비 확보.)
  useEffect(() => {
    const root = document.documentElement;
    const read = () => setIsDark(root.dataset.theme === 'dark');
    read();
    const obs = new MutationObserver(read);
    obs.observe(root, { attributes: true, attributeFilter: ['data-theme'] });
    return () => obs.disconnect();
  }, []);
  const emptyTile = isDark ? '#0E0C0A' : '#FFFFFF';
  const values = koreaTiles.map((d) => d.value);
  const max = d3.max(values);
  const colorScale = d3.scaleSequentialLog([10, max], (t) => {
    // 진한 navy → red로 (5단계 step)
    const palette = [emptyTile, '#E6D6C2', C.mustard, C.red, C.navy];
    const i = Math.min(palette.length - 1, Math.floor(t * palette.length));
    return palette[i];
  });

  // 5단계로 양자화한 클래스 (패턴 이중코딩용)
  const bins = [100, 500, 1500, 5000];
  const binOf = (v) => {
    if (v < bins[0]) return 0;
    if (v < bins[1]) return 1;
    if (v < bins[2]) return 2;
    if (v < bins[3]) return 3;
    return 4;
  };
  const binColors = [emptyTile, '#E8D4B8', C.mustard, C.red, C.navy];
  const binLabels = ['< 100', '100–500', '500–1500', '1500–5000', '5000+'];

  // tile size
  const size = 68;
  const gap = 6;
  const maxCol = d3.max(koreaTiles, (d) => d.col);
  const maxRow = d3.max(koreaTiles, (d) => d.row);
  const W = (maxCol + 1) * (size + gap) + gap;
  const H = (maxRow + 1) * (size + gap) + gap;

  // 정렬 (인구밀도 내림차순) — 키보드 탐색 순서
  const sortedTiles = useMemo(
    () => [...koreaTiles].sort((a, b) => b.value - a.value),
    []
  );

  const onKey = (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault(); setFocusIdx((i) => (i + 1) % sortedTiles.length);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault(); setFocusIdx((i) => (i - 1 + sortedTiles.length) % sortedTiles.length);
    } else if (e.key === 'Home') { e.preventDefault(); setFocusIdx(0); }
    else if (e.key === 'End') { e.preventDefault(); setFocusIdx(sortedTiles.length - 1); }
  };

  const focused = sortedTiles[focusIdx];
  const active = hover || focused;

  return (
    <div>
      <Usage mouse="타일 호버" keyboard="Tab → ←→↑↓ Home/End (밀도 순)" />
      <div role="application"
        aria-label="대한민국 시도별 인구밀도 타일 그리드 맵, 17개 시도"
        aria-describedby="d24-status"
        tabIndex={0} onKeyDown={onKey} {...focusable}>
        <svg viewBox={`0 0 ${W} ${H}`}
          style={{ width: '100%', maxWidth: 520, height: 'auto', display: 'block', margin: '0 auto' }}>
          <defs>
            {/* 패턴 이중코딩 */}
            <pattern id="p1" patternUnits="userSpaceOnUse" width="6" height="6">
              <circle cx="3" cy="3" r="0.7" fill={C.inkSoft} fillOpacity="0.5" />
            </pattern>
            <pattern id="p2" patternUnits="userSpaceOnUse" width="6" height="6">
              <circle cx="3" cy="3" r="1.1" fill={C.ink} fillOpacity="0.6" />
            </pattern>
            <pattern id="p3" patternUnits="userSpaceOnUse" width="6" height="6">
              <circle cx="3" cy="3" r="1.4" fill={C.paper} fillOpacity="0.7" />
            </pattern>
            <pattern id="p4" patternUnits="userSpaceOnUse" width="6" height="6">
              <circle cx="3" cy="3" r="1.7" fill={C.paper} fillOpacity="0.9" />
            </pattern>
          </defs>
          {koreaTiles.map((t) => {
            const x = gap + t.col * (size + gap);
            const y = gap + t.row * (size + gap);
            const bin = binOf(t.value);
            const isFocused = focused?.name === t.name && !hover;
            const isHovered = hover?.name === t.name;
            const w = t.name === '세종' ? size * 0.6 : size;
            const h = t.name === '세종' ? size * 0.6 : size;
            return (
              <g key={t.name}
                onMouseEnter={() => setHover(t)}
                onMouseLeave={() => setHover(null)}
                style={{ cursor: 'pointer' }}>
                <rect x={x} y={y} width={w} height={h}
                  fill={binColors[bin]}
                  stroke={isFocused || isHovered ? C.ink : C.paper}
                  strokeWidth={isFocused || isHovered ? 2.5 : 1.5} />
                {/* 패턴 오버레이 (bin 1+에만) */}
                {bin > 0 && (
                  <rect x={x} y={y} width={w} height={h}
                    fill={`url(#p${bin})`}
                    stroke="none" pointerEvents="none" />
                )}
                {isFocused && (
                  <rect x={x - 3} y={y - 3} width={w + 6} height={h + 6}
                    fill="none" stroke={C.focus} strokeWidth={2.5} />
                )}
                <text x={x + w / 2} y={y + h / 2 - 4}
                  textAnchor="middle" fontSize={t.name === '세종' ? 9 : 12}
                  fontFamily="inherit"
                  fill={C.ink}
                  stroke={C.paper}
                  strokeWidth={3.5}
                  style={{ paintOrder: 'stroke' }}
                  fontWeight="600"
                  pointerEvents="none">{t.name}</text>
                <text x={x + w / 2} y={y + h / 2 + 12}
                  textAnchor="middle" fontSize={t.name === '세종' ? 8 : 10}
                  fontFamily={'"Courier New", Courier, monospace'}
                  fill={C.inkSoft}
                  stroke={C.paper}
                  strokeWidth={3}
                  style={{ paintOrder: 'stroke' }}
                  pointerEvents="none">{t.value.toLocaleString()}</text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="flex gap-3 mt-3 mb-3 items-start">
        <div>
          <div className="flex flex-wrap gap-3" style={{ color: C.inkSoft }}>
            {binLabels.map((lbl, i) => (
              <span key={lbl} className="flex items-center gap-1.5">
                <svg width="18" height="18" aria-hidden="true">
                  <rect width="18" height="18" fill={binColors[i]} stroke={C.rule} />
                  {i > 0 && <rect width="18" height="18" fill={`url(#p${i})`} />}
                </svg>
                &nbsp;{lbl}
              </span>
            ))}
          </div>
          <div id="d24-status" aria-live="polite" className="mt-2" style={{ color: C.ink }}>
            {active && (
              <>
                <strong>{active.name}</strong> — 인구밀도 {active.value.toLocaleString()} 명/km²
                <span style={{ color: C.inkFaint }}> · 5단계 중 {binOf(active.value) + 1}단계 ({binLabels[binOf(active.value)]})</span>
              </>
            )}
          </div>
        </div>
        <div className="ml-auto">
          <button onClick={() => setTableOpen((v) => !v)} aria-expanded={tableOpen}
            aria-controls="d24-table"
            {...focusable}>
            {tableOpen ? '데이터 표 닫기' : '총 17개 시도'}
          </button>
        </div>
      </div>
      {tableOpen && (
        <div id="d24-table">
          <table>
            <caption style={srOnly}>시도별 인구밀도</caption>
            <thead>
              <tr>{['순위', '시도', '인구밀도(명/km²)', '구간'].map((h) => <th key={h} scope="col">{h}</th>)}</tr>
            </thead>
            <tbody>
              {sortedTiles.map((t, i) => (
                <tr key={t.name}>
                  <td>{i + 1}</td>
                  <td>{t.name}</td>
                  <td>{t.value.toLocaleString()}</td>
                  <td>{binLabels[binOf(t.value)]}</td>
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
// #25 — Flow Map (도시 간 이동)
// ════════════════════════════════════════════════════════════
const D25 = () => {
  const [activeCity, setActiveCity] = useState(null); // pin (클릭/Enter로 고정)
  const [hoverCity, setHoverCity] = useState(null);   // 일시적 hover
  const [focusIdx, setFocusIdx] = useState(0);
  const [tableOpen, setTableOpen] = useState(false);

  const size = 64, gap = 8;
  const maxCol = d3.max(koreaTiles, (d) => d.col);
  const maxRow = d3.max(koreaTiles, (d) => d.row);
  const W = (maxCol + 1) * (size + gap) + gap;
  const H = (maxRow + 1) * (size + gap) + gap;

  const tileCenter = (t) => ({
    x: gap + t.col * (size + gap) + size / 2,
    y: gap + t.row * (size + gap) + size / 2,
  });

  // 흐름 도시들만 (서울/부산/대전/대구/광주/제주)
  const flowCities = useMemo(() => {
    const names = new Set();
    koreaFlows.forEach((f) => { names.add(f.from); names.add(f.to); });
    return koreaTiles.filter((t) => names.has(t.name));
  }, []);

  const sortedFlowCities = useMemo(
    () => [...flowCities].sort((a, b) => a.name.localeCompare(b.name, 'ko')),
    [flowCities]
  );

  const maxFlow = d3.max(koreaFlows, (d) => d.value);

  const onKey = (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault(); setFocusIdx((i) => (i + 1) % sortedFlowCities.length);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault(); setFocusIdx((i) => (i - 1 + sortedFlowCities.length) % sortedFlowCities.length);
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setActiveCity((cur) => cur === sortedFlowCities[focusIdx].name ? null : sortedFlowCities[focusIdx].name);
    } else if (e.key === 'Escape') {
      e.preventDefault(); setActiveCity(null);
    }
  };

  const targetCity = hoverCity || activeCity || sortedFlowCities[focusIdx]?.name;
  const inFlows = koreaFlows.filter((f) => f.to === targetCity);
  const outFlows = koreaFlows.filter((f) => f.from === targetCity);
  const inTotal = d3.sum(inFlows, (f) => f.value);
  const outTotal = d3.sum(outFlows, (f) => f.value);

  return (
    <div>
      <Usage mouse="도시 호버/클릭" keyboard="Tab → ←→ Enter/Space, Esc 해제" />
      <div role="application"
        aria-label="대한민국 도시 간 이동 흐름 지도"
        tabIndex={0} onKeyDown={onKey} {...focusable}>
        <svg viewBox={`0 0 ${W} ${H}`}
          style={{ width: '100%', maxWidth: 520, height: 'auto', display: 'block', margin: '0 auto' }}>
          <defs>
            <marker id="arrowR" viewBox="0 0 10 10" refX="9" refY="5"
              markerWidth="6" markerHeight="6" orient="auto">
              <path d="M 0 0 L 10 5 L 0 10 z" fill={C.red} />
            </marker>
            <marker id="arrowN" viewBox="0 0 10 10" refX="9" refY="5"
              markerWidth="6" markerHeight="6" orient="auto">
              <path d="M 0 0 L 10 5 L 0 10 z" fill={C.navy} />
            </marker>
          </defs>

          {/* 배경 타일 */}
          {koreaTiles.map((t) => {
            const x = gap + t.col * (size + gap);
            const y = gap + t.row * (size + gap);
            const w = t.name === '세종' ? size * 0.6 : size;
            const h = t.name === '세종' ? size * 0.6 : size;
            const isCity = flowCities.some((c) => c.name === t.name);
            return (
              <g key={t.name}
                onMouseEnter={isCity ? () => setHoverCity(t.name) : undefined}
                onMouseLeave={isCity ? () => setHoverCity(null) : undefined}
                onClick={isCity ? () => setActiveCity((c) => c === t.name ? null : t.name) : undefined}
                style={{ cursor: isCity ? 'pointer' : 'default' }}>
                <rect x={x} y={y} width={w} height={h}
                  fill={isCity ? C.paper : C.ruleSoft}
                  stroke={C.rule} strokeWidth={1} />
                <text x={x + w / 2} y={y + h / 2} textAnchor="middle" dy="0.32em"
                  fontSize={t.name === '세종' ? 9 : 11} fontFamily="inherit"
                  fill={isCity ? C.ink : C.inkFaint}
                  pointerEvents="none">{t.name}</text>
              </g>
            );
          })}

          {/* 흐름 화살표 */}
          {koreaFlows.map((f, i) => {
            const from = koreaTiles.find((t) => t.name === f.from);
            const to = koreaTiles.find((t) => t.name === f.to);
            const p1 = tileCenter(from);
            const p2 = tileCenter(to);
            // 살짝 곡선
            const dx = p2.x - p1.x;
            const dy = p2.y - p1.y;
            const len = Math.sqrt(dx * dx + dy * dy);
            const perp = { x: -dy / len * 20, y: dx / len * 20 };
            const mid = { x: (p1.x + p2.x) / 2 + perp.x, y: (p1.y + p2.y) / 2 + perp.y };
            const path = `M ${p1.x} ${p1.y} Q ${mid.x} ${mid.y} ${p2.x} ${p2.y}`;
            const isOut = targetCity && f.from === targetCity;
            const isIn = targetCity && f.to === targetCity;
            const isActive = isOut || isIn;
            const isDim = targetCity && !isActive;
            const w = (f.value / maxFlow) * 6 + 1;
            return (
              <path key={i} d={path}
                fill="none"
                stroke={isOut ? C.red : isIn ? C.navy : C.inkFaint}
                strokeOpacity={isDim ? 0.05 : isActive ? 0.85 : 0.35}
                strokeWidth={isActive ? w + 1 : w}
                markerEnd={isOut ? 'url(#arrowR)' : isIn ? 'url(#arrowN)' : undefined} />
            );
          })}

          {/* 도시 포커스 강조 */}
          {flowCities.map((c) => {
            const x = gap + c.col * (size + gap);
            const y = gap + c.row * (size + gap);
            const isF = c.name === sortedFlowCities[focusIdx]?.name && !activeCity;
            const isA = c.name === targetCity;
            if (!isF && !isA) return null;
            return (
              <rect key={c.name}
                x={x - 3} y={y - 3} width={size + 6} height={size + 6}
                fill="none" stroke={isF ? C.focus : C.ink}
                strokeWidth={2.5}
                strokeDasharray={isF ? '3 2' : undefined} />
            );
          })}
        </svg>
      </div>

      {/* 범례 */}
      <div className="flex gap-3 mt-3 mb-3 items-start">
        <div>
          <div className="flex flex-wrap gap-4" style={{ color: C.inkSoft }}>
            <span className="flex items-center gap-1.5">
              <svg width="24" height="10" aria-hidden="true">
                <line x1="0" y1="5" x2="20" y2="5" stroke={C.red} strokeWidth="2.5" />
                <path d="M 18 1 L 24 5 L 18 9 Z" fill={C.red} />
              </svg>
              <span style={{ color: C.ink, fontWeight: 600 }}>&nbsp;나가는 흐름</span>
              <span style={{ color: C.inkFaint }}>· outgoing</span>
            </span>
            <span className="flex items-center gap-1.5">
              <svg width="24" height="10" aria-hidden="true">
                <line x1="0" y1="5" x2="20" y2="5" stroke={C.navy} strokeWidth="2.5" />
                <path d="M 18 1 L 24 5 L 18 9 Z" fill={C.navy} />
              </svg>
              <span style={{ color: C.ink, fontWeight: 600 }}>&nbsp;들어오는 흐름</span>
              <span style={{ color: C.inkFaint }}>· incoming</span>
            </span>
          </div>
          <div aria-live="polite" className="mt-2" style={{ color: C.ink }}>
            {targetCity && (
              <>
                <strong>{targetCity}</strong>
                {' — '}
                나감 {outTotal.toLocaleString()}천 명 ({outFlows.length}개 경로),
                들어옴 {inTotal.toLocaleString()}천 명 ({inFlows.length}개 경로)
              </>
            )}
          </div>
        </div>
        <div className="ml-auto">
          <button onClick={() => setTableOpen((v) => !v)} aria-expanded={tableOpen}
            aria-controls="d25-table"
            {...focusable}>
            {tableOpen ? '데이터 표 닫기' : `${koreaFlows.length}개 경로`}
          </button>
        </div>
      </div>
      {tableOpen && (
        <div id="d25-table">
          <table>
            <caption style={srOnly}>도시 간 이동 흐름</caption>
            <thead>
              <tr>{['출발', '도착', '인원 (천 명)'].map((h) => <th key={h} scope="col">{h}</th>)}</tr>
            </thead>
            <tbody>
              {koreaFlows.map((f, i) => (
                <tr key={i}>
                  <td>{f.from}</td>
                  <td>{f.to}</td>
                  <td>{f.value.toLocaleString()}</td>
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
// #26 — 3D Scatter (Three.js · 키보드 카메라 + 2D 토글)
// ════════════════════════════════════════════════════════════
const D26 = () => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const [yaw, setYaw] = useState(0.5);
  const [pitch, setPitch] = useState(0.4);
  const [zoom, setZoom] = useState(1);
  const [mode, setMode] = useState('3d'); // 3d | xy | xz | yz
  const [hoveredCluster, setHoveredCluster] = useState(null);
  const [autoRotate, setAutoRotate] = useState(false);
  const [tableOpen, setTableOpen] = useState(false);
  const reduced = useReducedMotion();
  const raw = useRawPalette();
  const rawSeries = useMemo(
    () => [raw.red, raw.navy, raw.olive, raw.mustard, raw.teal, raw.rose],
    [raw]
  );

  // Three.js scene 초기화 (3D 모드일 때 + 테마 변경 시 재구성)
  useEffect(() => {
    if (mode !== '3d' || !mountRef.current) return;

    const W = mountRef.current.clientWidth;
    const H = 360;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(raw.paper);

    const camera = new THREE.PerspectiveCamera(50, W / H, 0.1, 100);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.innerHTML = '';
    mountRef.current.appendChild(renderer.domElement);
    renderer.domElement.setAttribute('aria-hidden', 'true');
    // 터치 스크롤 방지 + 드래그 회전 활성
    renderer.domElement.style.touchAction = 'none';

    // 축
    const axes = new THREE.Group();
    const axisLen = 6;
    [['x', raw.red], ['y', raw.olive], ['z', raw.navy]].forEach(([axis, color], i) => {
      const dir = [0, 0, 0]; dir[i] = axisLen;
      const geom = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(dir[0], dir[1], dir[2]),
      ]);
      const mat = new THREE.LineBasicMaterial({ color });
      axes.add(new THREE.Line(geom, mat));
    });
    scene.add(axes);

    // 격자
    const grid = new THREE.GridHelper(12, 12, raw.rule, raw.ruleSoft);
    grid.rotation.x = Math.PI / 2;
    scene.add(grid);

    // 점들
    const pointsByCluster = [0, 1, 2].map(() => []);
    scatter3D.forEach((p) => pointsByCluster[p.cluster].push(p));
    pointsByCluster.forEach((pts, ci) => {
      const positions = new Float32Array(pts.length * 3);
      pts.forEach((p, i) => {
        positions[i * 3] = p.x;
        positions[i * 3 + 1] = p.y;
        positions[i * 3 + 2] = p.z;
      });
      const geom = new THREE.BufferGeometry();
      geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      const mat = new THREE.PointsMaterial({
        color: rawSeries[ci],
        size: 0.18,
        sizeAttenuation: true,
      });
      const points = new THREE.Points(geom, mat);
      points.userData.cluster = ci;
      scene.add(points);
    });

    sceneRef.current = { scene, camera, renderer };

    // 컨테이너 너비 변경 시 카메라 종횡비와 renderer를 다시 맞춤
    const ro = new ResizeObserver(() => {
      if (!mountRef.current) return;
      const nw = mountRef.current.clientWidth;
      renderer.setSize(nw, H);
      camera.aspect = nw / H;
      camera.updateProjectionMatrix();
      renderer.render(scene, camera);
    });
    ro.observe(mountRef.current);

    return () => {
      ro.disconnect();
      renderer.dispose();
    };
  }, [mode, raw, rawSeries]);

  // 카메라 업데이트
  useEffect(() => {
    if (!sceneRef.current) return;
    const { camera, renderer, scene } = sceneRef.current;
    const r = 12 / zoom;
    camera.position.x = r * Math.cos(pitch) * Math.sin(yaw);
    camera.position.y = r * Math.sin(pitch);
    camera.position.z = r * Math.cos(pitch) * Math.cos(yaw);
    camera.lookAt(0, 0, 0);
    renderer.render(scene, camera);
  }, [yaw, pitch, zoom, mode]);

  // 자동 회전
  useEffect(() => {
    if (!autoRotate || mode !== '3d' || reduced) return;
    const id = setInterval(() => setYaw((y) => y + 0.01), 30);
    return () => clearInterval(id);
  }, [autoRotate, mode, reduced]);

  // 포인터(마우스 + 터치) 드래그 회전. window 레벨 move/up을 쓰는 이유는
  // 1) 캔버스 밖으로 포인터가 나가도 드래그가 유지되고, 2) 씬이 테마 토글로
  // 재생성되면 캔버스가 바뀌어 캔버스 단위 리스너가 오래된 노드에 묶이는 문제를 회피.
  useEffect(() => {
    if (mode !== '3d' || !mountRef.current) return;
    const el = mountRef.current.querySelector('canvas');
    if (!el) return;
    let dragging = false, lastX = 0, lastY = 0;
    const pd = (e) => {
      dragging = true;
      lastX = e.clientX; lastY = e.clientY;
    };
    const pm = (e) => {
      if (!dragging) return;
      setYaw((y) => y - (e.clientX - lastX) * 0.01);
      setPitch((p) => Math.max(-1.5, Math.min(1.5, p + (e.clientY - lastY) * 0.01)));
      lastX = e.clientX; lastY = e.clientY;
    };
    const pu = () => { dragging = false; };
    el.addEventListener('pointerdown', pd);
    window.addEventListener('pointermove', pm);
    window.addEventListener('pointerup', pu);
    window.addEventListener('pointercancel', pu);
    return () => {
      el.removeEventListener('pointerdown', pd);
      window.removeEventListener('pointermove', pm);
      window.removeEventListener('pointerup', pu);
      window.removeEventListener('pointercancel', pu);
    };
  }, [mode, raw]);

  // 키보드 카메라 (M키는 어느 모드에서나 동작)
  const onKey = (e) => {
    if (e.key === 'm' || e.key === 'M') {
      e.preventDefault();
      const modes = ['3d', 'xy', 'xz', 'yz'];
      const cur = modes.indexOf(mode);
      setMode(modes[(cur + 1) % modes.length]);
      return;
    }
    if (mode !== '3d') return;
    if (e.key === 'ArrowLeft') { e.preventDefault(); setYaw((y) => y - 0.1); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); setYaw((y) => y + 0.1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setPitch((p) => Math.min(1.5, p + 0.1)); }
    else if (e.key === 'ArrowDown') { e.preventDefault(); setPitch((p) => Math.max(-1.5, p - 0.1)); }
    else if (e.key === '+' || e.key === '=') { e.preventDefault(); setZoom((z) => Math.min(3, z + 0.2)); }
    else if (e.key === '-' || e.key === '_') { e.preventDefault(); setZoom((z) => Math.max(0.3, z - 0.2)); }
  };

  // 2D projection 렌더링
  const Proj = ({ axis }) => {
    const [a, b, labels] = axis === 'xy' ? ['x', 'y', ['X', 'Y']]
      : axis === 'xz' ? ['x', 'z', ['X', 'Z']]
        : ['y', 'z', ['Y', 'Z']];
    const W = 360, H = 320, m = 30;
    const xs = scatter3D.map((p) => p[a]);
    const ys = scatter3D.map((p) => p[b]);
    const xScale = d3.scaleLinear().domain([d3.min(xs) - 1, d3.max(xs) + 1]).range([m, W - m]);
    const yScale = d3.scaleLinear().domain([d3.min(ys) - 1, d3.max(ys) + 1]).range([H - m, m]);
    return (
      <svg viewBox={`0 0 ${W} ${H}`}
        style={{ width: '100%', height: H, background: C.paper }} role="img"
        aria-label={`${labels[0]}축과 ${labels[1]}축으로 본 2D 투영`}>
        {/* 축 */}
        <line x1={m} x2={W - m} y1={H - m} y2={H - m} stroke={C.inkFaint} />
        <line x1={m} x2={m} y1={m} y2={H - m} stroke={C.inkFaint} />
        <text x={W - m} y={H - m + 14} textAnchor="end" fontSize="10"
          fontFamily={'"Courier New", Courier, monospace'} fill={C.inkSoft}>{labels[0]} →</text>
        <text x={m - 4} y={m} textAnchor="end" fontSize="10"
          fontFamily={'"Courier New", Courier, monospace'} fill={C.inkSoft}>↑ {labels[1]}</text>
        {/* 점 */}
        {scatter3D.map((p) => (
          <circle key={p.id} cx={xScale(p[a])} cy={yScale(p[b])} r={2.5}
            fill={SERIES[p.cluster]} fillOpacity={0.7} />
        ))}
      </svg>
    );
  };

  return (
    <div>
      <Usage mouse="드래그로 회전 · 모드 토글"
        keyboard="Tab → ←→↑↓ 회전, +/- 줌, M으로 모드 변경" />

      {/* 모드 토글 */}
      <div role="group" aria-label="표시 모드" className="flex gap-1 flex-wrap mb-3">
        {[
          { v: '3d', l: '3D' },
          { v: 'xy', l: 'XY 투영' },
          { v: 'xz', l: 'XZ 투영' },
          { v: 'yz', l: 'YZ 투영' },
        ].map(({ v, l }) => (
          <button key={v}
            onClick={() => setMode(v)}
            aria-pressed={mode === v}
            className="font-mono text-[10px] tracking-widest px-2 py-1"
            style={{
              background: mode === v ? C.ink : 'transparent',
              color: mode === v ? C.paper : C.inkSoft,
              border: `1px solid ${mode === v ? C.ink : C.rule}`,
            }} {...focusable}>
            {l.toUpperCase()}
          </button>
        ))}
      </div>

      {/* 3D or 2D */}
      <div role="application"
        aria-label={mode === '3d' ? '3D 점 구름. 마우스 드래그 또는 키보드로 회전. M키로 모드 전환.' : `${mode.toUpperCase()} 2D 투영. M키로 다음 모드.`}
        tabIndex={0} onKeyDown={onKey} {...focusable}>
        {mode === '3d'
          ? <div ref={mountRef} style={{ width: '100%', height: 360, cursor: 'grab', background: C.paper, border: `1px solid ${C.rule}` }} />
          : <Proj axis={mode} />}
      </div>

      <div className="flex gap-3 mt-3 items-start">
        {/* 범례 */}
        <div className="flex flex-wrap gap-3" style={{ color: C.inkSoft }}>
          {['클러스터 A', '클러스터 B', '클러스터 C'].map((l, i) => (
            <span key={l} className="flex items-center gap-1.5">
              <svg width="10" height="10" aria-hidden="true">
                <circle cx="5" cy="5" r="4" fill={SERIES[i]} />
              </svg>
              {l} ({scatter3D.filter((p) => p.cluster === i).length}개)
            </span>
          ))}
        </div>

        {/* 3D 컨트롤 */}
        {mode === '3d' && (
          <div className="flex flex-wrap ml-auto gap-3" style={{ justifyContent: 'end' }} role="group" aria-label="카메라 컨트롤">
            {[
              { l: '◀', fn: () => setYaw((y) => y - 0.2), title: '왼쪽 회전' },
              { l: '▶', fn: () => setYaw((y) => y + 0.2), title: '오른쪽 회전' },
              { l: '▲', fn: () => setPitch((p) => Math.min(1.5, p + 0.2)), title: '위로 회전' },
              { l: '▼', fn: () => setPitch((p) => Math.max(-1.5, p - 0.2)), title: '아래로 회전' },
              { l: '＋', fn: () => setZoom((z) => Math.min(3, z + 0.3)), title: '확대' },
              { l: '－', fn: () => setZoom((z) => Math.max(0.3, z - 0.3)), title: '축소' },
              { l: '⟲', fn: () => { setYaw(0.5); setPitch(0.4); setZoom(1); }, title: '초기화' },
            ].map(({ l, fn, title }) => (
              <button key={title} onClick={fn} aria-label={title}
                className="font-mono text-[11px] w-8 h-8"
                style={{ border: `1px solid ${C.rule}`, color: C.ink, background: 'transparent' }}
                {...focusable}>{l}</button>
            ))}
            {reduced && (
              <span style={{ color: C.inkFaint }}>
                ⚠ reduced-motion → 자동회전 비활성
              </span>
            )}
            <button onClick={() => setAutoRotate((v) => !v)}
              aria-pressed={autoRotate}
              disabled={reduced}
              style={{
                background: autoRotate ? C.red : 'transparent',
                color: autoRotate ? C.paper : reduced ? C.inkFaint : C.ink,
                border: `1px solid ${C.rule}`,
                opacity: reduced ? 0.4 : 1,
              }} {...focusable}>
              {autoRotate ? '■ STOP' : '▶ AUTO'}
            </button>
            <button onClick={() => setTableOpen((v) => !v)} aria-expanded={tableOpen}
              aria-controls="d26-table"
              {...focusable}>
              {tableOpen ? '데이터 표 닫기' : `총 ${scatter3D.length}개 점 (처음 30개)`}
            </button>
          </div>
        )}
      </div>
      {tableOpen && (
        <div id="d26-table">
          <table>
            <caption style={srOnly}>3D 점 데이터</caption>
            <thead>
              <tr>{['ID', '클러스터', 'X', 'Y', 'Z'].map((h) => <th key={h} scope="col">{h}</th>)}</tr>
            </thead>
            <tbody>
              {scatter3D.slice(0, 30).map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.label}</td>
                  <td>{p.x.toFixed(2)}</td>
                  <td>{p.y.toFixed(2)}</td>
                  <td>{p.z.toFixed(2)}</td>
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
// #27 — 대량 포인트 (Canvas 2D · 5만 개 · pan + zoom)
// ════════════════════════════════════════════════════════════
const D27 = () => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [view, setView] = useState({ scale: 1, dx: 0, dy: 0 });
  const viewRef = useRef(view);
  useEffect(() => { viewRef.current = view; }, [view]);

  const [gridFocus, setGridFocus] = useState({ col: 4, row: 4 });
  const [tableOpen, setTableOpen] = useState(false);
  const [hover, setHover] = useState(null);
  const raw = useRawPalette();
  const rawSeries = useMemo(
    () => [raw.red, raw.navy, raw.olive, raw.mustard, raw.teal, raw.rose],
    [raw]
  );

  // 컨테이너 너비에 맞춰 canvas 내부 해상도도 갱신해야 가로 찌그러짐이 없다.
  const [W, setW] = useState(480);
  const wRef = useRef(W);
  useEffect(() => { wRef.current = W; }, [W]);
  useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver((entries) => {
      const cw = Math.round(entries[0].contentRect.width);
      if (cw > 0) setW(cw);
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  const H = 360;
  const GRID = 10;

  // 렌더링
  useEffect(() => {
    const cv = canvasRef.current;
    const dpr = window.devicePixelRatio || 1;
    cv.width = W * dpr; cv.height = H * dpr;
    cv.style.width = '100%'; cv.style.height = `${H}px`;
    const ctx = cv.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = raw.paper;
    ctx.fillRect(0, 0, W, H);

    // 점 + 격자 + 활성 셀 — 모두 같이 변환됨 (pan/zoom 일관성)
    ctx.save();
    ctx.translate(view.dx, view.dy);
    ctx.scale(view.scale, view.scale);

    // 점
    ctx.globalAlpha = 0.55;
    const pSize = Math.max(0.6, 1 / view.scale);
    heavyPoints.forEach((p) => {
      ctx.fillStyle = rawSeries[p.g];
      ctx.fillRect(p.x * W, p.y * H, pSize, pSize);
    });
    ctx.globalAlpha = 1;

    // 격자
    ctx.strokeStyle = raw.rule;
    ctx.lineWidth = 0.8 / view.scale;
    ctx.globalAlpha = 0.55;
    ctx.beginPath();
    for (let i = 0; i <= GRID; i++) {
      const x = (i / GRID) * W;
      const y = (i / GRID) * H;
      ctx.moveTo(x, 0); ctx.lineTo(x, H);
      ctx.moveTo(0, y); ctx.lineTo(W, y);
    }
    ctx.stroke();
    ctx.globalAlpha = 1;

    // 활성 셀
    const active = hover || gridFocus;
    const cw = W / GRID;
    const ch = H / GRID;
    ctx.strokeStyle = hover ? raw.ink : raw.focus;
    ctx.lineWidth = 2.5 / view.scale;
    ctx.strokeRect(active.col * cw, active.row * ch, cw, ch);

    ctx.restore();
  }, [view, hover, gridFocus, raw, rawSeries, W]);

  // 포인터(마우스 + 터치) pan + 휠 줌 + 호버
  useEffect(() => {
    const cv = canvasRef.current;
    cv.style.touchAction = 'none';
    let lx = 0, ly = 0, pid = null;

    const pd = (e) => {
      pid = e.pointerId;
      lx = e.clientX; ly = e.clientY;
      cv.style.cursor = 'grabbing';
      cv.setPointerCapture?.(pid);
    };
    const pm = (e) => {
      if (pid != null && e.pointerId === pid) {
        const ddx = e.clientX - lx;
        const ddy = e.clientY - ly;
        setView((v) => ({ ...v, dx: v.dx + ddx, dy: v.dy + ddy }));
        lx = e.clientX; ly = e.clientY;
      } else if (e.pointerType === 'mouse') {
        const rect = cv.getBoundingClientRect();
        if (e.clientX < rect.left || e.clientX > rect.right ||
          e.clientY < rect.top || e.clientY > rect.bottom) return;
        const curW = wRef.current;
        const cssX = (e.clientX - rect.left) * (curW / rect.width);
        const cssY = (e.clientY - rect.top) * (H / rect.height);
        const v = viewRef.current;
        const dataX = (cssX - v.dx) / v.scale;
        const dataY = (cssY - v.dy) / v.scale;
        const col = Math.floor((dataX / curW) * GRID);
        const row = Math.floor((dataY / H) * GRID);
        if (col >= 0 && col < GRID && row >= 0 && row < GRID) {
          setHover({ col, row });
        } else {
          setHover(null);
        }
      }
    };
    const pu = (e) => {
      if (pid != null) cv.releasePointerCapture?.(pid);
      pid = null;
      cv.style.cursor = 'grab';
    };
    const ml = () => setHover(null);

    // 휠 줌 — 마우스 위치 기준으로 줌인/아웃
    const wh = (e) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      const rect = cv.getBoundingClientRect();
      const curW = wRef.current;
      const cssX = (e.clientX - rect.left) * (curW / rect.width);
      const cssY = (e.clientY - rect.top) * (H / rect.height);
      setView((v) => {
        const newScale = Math.max(0.4, Math.min(8, v.scale * delta));
        const factor = newScale / v.scale;
        // 마우스 위치를 중심으로 줌
        return {
          scale: newScale,
          dx: cssX - (cssX - v.dx) * factor,
          dy: cssY - (cssY - v.dy) * factor,
        };
      });
    };

    cv.style.cursor = 'grab';
    cv.addEventListener('pointerdown', pd);
    cv.addEventListener('pointermove', pm);
    cv.addEventListener('pointerup', pu);
    cv.addEventListener('pointercancel', pu);
    cv.addEventListener('pointerleave', ml);
    cv.addEventListener('wheel', wh, { passive: false });
    return () => {
      cv.removeEventListener('pointerdown', pd);
      cv.removeEventListener('pointermove', pm);
      cv.removeEventListener('pointerup', pu);
      cv.removeEventListener('pointercancel', pu);
      cv.removeEventListener('pointerleave', ml);
      cv.removeEventListener('wheel', wh);
    };
  }, []);

  // 셀별 집계 (10x10 = 100 셀)
  const cellStats = useMemo(() => {
    const stats = Array.from({ length: GRID * GRID }, () => ({ count: 0, byGroup: {} }));
    heavyPoints.forEach((p) => {
      const col = Math.max(0, Math.min(GRID - 1, Math.floor(p.x * GRID)));
      const row = Math.max(0, Math.min(GRID - 1, Math.floor(p.y * GRID)));
      const idx = row * GRID + col;
      stats[idx].count++;
      stats[idx].byGroup[p.g] = (stats[idx].byGroup[p.g] || 0) + 1;
    });
    return stats;
  }, []);

  const onKey = (e) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault(); setGridFocus((f) => ({ ...f, col: Math.min(GRID - 1, f.col + 1) }));
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault(); setGridFocus((f) => ({ ...f, col: Math.max(0, f.col - 1) }));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault(); setGridFocus((f) => ({ ...f, row: Math.max(0, f.row - 1) }));
    } else if (e.key === 'ArrowDown') {
      e.preventDefault(); setGridFocus((f) => ({ ...f, row: Math.min(GRID - 1, f.row + 1) }));
    } else if (e.key === '+' || e.key === '=') {
      e.preventDefault();
      setView((v) => ({ ...v, scale: Math.min(8, v.scale * 1.25) }));
    } else if (e.key === '-' || e.key === '_') {
      e.preventDefault();
      setView((v) => ({ ...v, scale: Math.max(0.4, v.scale * 0.8) }));
    } else if (e.key === '0') {
      e.preventDefault();
      setView({ scale: 1, dx: 0, dy: 0 });
    }
  };

  const activeCell = hover || gridFocus;
  const activeStats = cellStats[activeCell.row * GRID + activeCell.col];
  const topGroup = activeStats && Object.entries(activeStats.byGroup)
    .sort((a, b) => b[1] - a[1])[0];

  return (
    <div>
      <Usage mouse="드래그 pan · 휠 줌 · 셀 호버"
        keyboard="Tab → ←→↑↓ 셀 탐색, +/- 줌, 0 리셋" />

      <div ref={containerRef} role="application"
        aria-label="대량 포인트 시각화, 5만 개 점을 10x10 격자로 분할"
        tabIndex={0} onKeyDown={onKey}
        style={{ position: 'relative' }} {...focusable}>
        <canvas ref={canvasRef}
          style={{ display: 'block', border: `1px solid ${C.rule}` }}
          aria-hidden="true" />
      </div>

      <div className="flex gap-3 mt-3 mb-3 items-start">
        <div>
          <div aria-live="polite" style={{ color: C.ink }}>
            셀 ({activeCell.col}, {activeCell.row}) — 점 <strong>{activeStats?.count.toLocaleString() || 0}</strong>개
            {topGroup && (
              <span style={{ color: C.inkSoft }}>
                {' · 주 그룹 '}<span style={{ color: SERIES[+topGroup[0]] }}>그룹 {+topGroup[0] + 1}</span>
                {' '}({topGroup[1].toLocaleString()}개)
              </span>
            )}
          </div>
          <div className="mt-2" style={{ color: C.inkFaint }}>
            ×{view.scale.toFixed(2)} · 점 {heavyPoints.length.toLocaleString()}개
          </div>
        </div>
        <div className="ml-auto flex flex-wrap items-center gap-3" style={{ justifyContent: 'end' }} role="group" aria-label="뷰 컨트롤">
          {[
            { l: '＋', fn: () => setView((v) => ({ ...v, scale: Math.min(8, v.scale * 1.25) })), title: '확대' },
            { l: '－', fn: () => setView((v) => ({ ...v, scale: Math.max(0.4, v.scale * 0.8) })), title: '축소' },
            { l: '◀', fn: () => setView((v) => ({ ...v, dx: v.dx + 40 })), title: '왼쪽 pan' },
            { l: '▶', fn: () => setView((v) => ({ ...v, dx: v.dx - 40 })), title: '오른쪽 pan' },
            { l: '▲', fn: () => setView((v) => ({ ...v, dy: v.dy + 40 })), title: '위쪽 pan' },
            { l: '▼', fn: () => setView((v) => ({ ...v, dy: v.dy - 40 })), title: '아래쪽 pan' },
            { l: '⟲', fn: () => setView({ scale: 1, dx: 0, dy: 0 }), title: '리셋' },
          ].map(({ l, fn, title }) => (
            <button key={title} onClick={fn} aria-label={title}
              className="font-mono text-[11px] w-8 h-8"
              style={{ border: `1px solid ${C.rule}`, color: C.ink, background: 'transparent' }}
              {...focusable}>{l}</button>
          ))}
          <button onClick={() => setTableOpen((v) => !v)} aria-expanded={tableOpen}
            aria-controls="d27-table"
            {...focusable}>
            {tableOpen ? '데이터 표 닫기' : `총 ${heavyPoints.length.toLocaleString()}개 점 (상위 20개 셀)`}
          </button>
        </div>
      </div>
      {tableOpen && (
        <div id="d27-table">
          <table>
            <caption style={srOnly}>셀별 점 분포</caption>
            <thead>
              <tr>{['셀 (col, row)', '점 수', '주 그룹'].map((h) => <th key={h} scope="col">{h}</th>)}</tr>
            </thead>
            <tbody>
              {cellStats
                .map((s, i) => ({ s, col: i % GRID, row: Math.floor(i / GRID) }))
                .filter(({ s }) => s.count > 0)
                .sort((a, b) => b.s.count - a.s.count)
                .slice(0, 20)
                .map(({ s, col, row }) => {
                  const top = Object.entries(s.byGroup).sort((a, b) => b[1] - a[1])[0];
                  return (
                    <tr key={`${col}-${row}`}>
                      <td>({col}, {row})</td>
                      <td>{s.count.toLocaleString()}</td>
                      <td>그룹 {+top[0] + 1} ({top[1]}개)</td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      )}
    </div >
  );
};

// ════════════════════════════════════════════════════════════
// #28 — Globe (정사영, d3.geoOrthographic)
// ════════════════════════════════════════════════════════════
const D28 = () => {
  const [rotation, setRotation] = useState([100, -20]);
  const [activeIdx, setActiveIdx] = useState(null);
  const [mode, setMode] = useState('globe'); // globe | flat
  const [query, setQuery] = useState('');
  const [autoRotate, setAutoRotate] = useState(false);
  const [tableOpen, setTableOpen] = useState(false);
  const reduced = useReducedMotion();
  const svgRef = useRef(null);
  const dragRef = useRef({ active: false, x: 0, y: 0 });
  const raw = useRawPalette();

  const W = 420, H = 420;
  const radius = 180;

  const projection = useMemo(() => {
    if (mode === 'globe') {
      // clipAngle 없이 모든 점을 투영 — 뒷면 마커는 별도로 감지해서 옅게 표시
      return d3.geoOrthographic()
        .scale(radius)
        .translate([W / 2, H / 2])
        .rotate([-rotation[0], rotation[1]]);
    }
    return d3.geoEquirectangular()
      .scale(W / (2 * Math.PI))
      .translate([W / 2, H / 2]);
  }, [rotation, mode]);

  // 위도/경도 그리드
  const graticule = useMemo(() => d3.geoGraticule().step([30, 30])(), []);
  const path = useMemo(() => d3.geoPath().projection(projection), [projection]);

  // 그리드/지구본 경계는 여전히 앞면만 — 별도 path (clipAngle 적용)
  const frontPath = useMemo(() => {
    if (mode !== 'globe') return path;
    const clipped = d3.geoOrthographic()
      .scale(radius)
      .translate([W / 2, H / 2])
      .rotate([-rotation[0], rotation[1]])
      .clipAngle(90);
    return d3.geoPath().projection(clipped);
  }, [rotation, mode, path]);

  // 뒷면 도시 감지 — 회전 중심에서 geo distance가 π/2 초과면 뒷면
  const isBackside = (c) => {
    if (mode !== 'globe') return false;
    const center = [rotation[0], -rotation[1]];
    return d3.geoDistance([c.lng, c.lat], center) > Math.PI / 2;
  };

  // 도시 매칭
  const matched = useMemo(() => {
    if (!query.trim()) return null;
    return new Set(worldCities
      .filter((c) => c.name.toLowerCase().includes(query.trim().toLowerCase()))
      .map((c) => c.name));
  }, [query]);

  // 자동 회전
  useEffect(() => {
    if (!autoRotate || mode !== 'globe' || reduced) return;
    const id = setInterval(() => setRotation((r) => [r[0] + 1, r[1]]), 50);
    return () => clearInterval(id);
  }, [autoRotate, mode, reduced]);

  // 포인터(마우스/터치) 드래그 회전
  useEffect(() => {
    const onMove = (e) => {
      if (!dragRef.current.active || e.pointerId !== dragRef.current.pid) return;
      const { x, y } = dragRef.current;
      setRotation((r) => [
        r[0] + (e.clientX - x) * 0.5,
        Math.max(-89, Math.min(89, r[1] - (e.clientY - y) * 0.5)),
      ]);
      dragRef.current.x = e.clientX;
      dragRef.current.y = e.clientY;
    };
    const onUp = (e) => {
      if (e.pointerId === dragRef.current.pid) dragRef.current.active = false;
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
    };
  }, []);

  const onSvgPointerDown = (e) => {
    if (mode !== 'globe') return;
    dragRef.current = { active: true, pid: e.pointerId, x: e.clientX, y: e.clientY };
  };

  // 사용 가능한(보이는) 도시
  const visibleCities = worldCities.map((c) => {
    const projected = projection([c.lng, c.lat]);
    return { ...c, projected, visible: !!projected };
  });

  // 키보드
  const onKey = (e) => {
    if (mode === 'globe') {
      if (e.key === 'ArrowLeft') { e.preventDefault(); setRotation((r) => [r[0] - 10, r[1]]); return; }
      if (e.key === 'ArrowRight') { e.preventDefault(); setRotation((r) => [r[0] + 10, r[1]]); return; }
      if (e.key === 'ArrowUp') { e.preventDefault(); setRotation((r) => [r[0], Math.min(89, r[1] + 10)]); return; }
      if (e.key === 'ArrowDown') { e.preventDefault(); setRotation((r) => [r[0], Math.max(-89, r[1] - 10)]); return; }
    }
    if (e.key === 'Enter' && activeIdx != null) {
      e.preventDefault();
      // 활성 도시 중심으로 회전
      const c = worldCities[activeIdx];
      setRotation([c.lng, -c.lat]);
    }
  };

  return (
    <div>
      <Usage mouse="드래그로 회전 · 도시 호버 · 검색 입력"
        keyboard="Tab → ←→↑↓로 회전, 검색창 입력" />

      {/* 모드 + 검색 */}
      <div className="flex items-center gap-2 mb-2 flex-wrap">
        <div role="group" aria-label="표시 모드" className="flex gap-1">
          {[{ v: 'globe', l: '구체' }, { v: 'flat', l: '평면' }].map(({ v, l }) => (
            <button key={v}
              onClick={() => setMode(v)}
              aria-pressed={mode === v}
              style={{
                background: mode === v ? C.ink : 'transparent',
                color: mode === v ? C.paper : C.inkSoft,
                border: `1px solid ${mode === v ? C.ink : C.rule}`,
              }} {...focusable}>
              {l.toUpperCase()}
            </button>
          ))}
        </div>
        <input type="search" value={query} onChange={(e) => setQuery(e.target.value)}
          placeholder="🔍 도시 검색 (예: Seoul)"
          className="flex-1 font-mono text-[12px] px-3 py-2"
          style={{ border: `1px solid ${C.rule}`, background: 'transparent', color: C.ink, minWidth: 140 }}
          {...focusable} />
      </div>

      <div role="application"
        aria-label={`세계 도시 ${mode === 'globe' ? '구체 지도' : '평면 지도'}, 20개 주요 도시`}
        tabIndex={0} onKeyDown={onKey}
        style={{ display: 'flex', justifyContent: 'center' }} {...focusable}>
        <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`}
          onPointerDown={onSvgPointerDown}
          style={{
            width: '100%', maxWidth: W, height: 'auto', margin: '0 auto',
            touchAction: 'none',
            cursor: mode === 'globe' ? 'grab' : 'default'
          }}>
          {/* sphere — raw hex 사용. var()는 일부 환경에서 SVG fill 속성에 해석되지
              않아 sphere가 미페인트 상태가 되고, mousedown이 빈 영역에서 발화하지 못해
              드래그가 시작되지 않는 문제가 있었다. */}
          {mode === 'globe' && (
            <circle cx={W / 2} cy={H / 2} r={radius}
              fill={raw.paper} stroke={C.rule} strokeWidth={1.5} />
          )}
          {/* graticule — 앞면만 (globe 모드에서) */}
          <path d={frontPath(graticule)} fill="none" stroke={C.rule} strokeWidth={0.5} />
          {/* equator — 앞면만 */}
          <path d={frontPath({ type: 'LineString', coordinates: [[-180, 0], [-90, 0], [0, 0], [90, 0], [180, 0]] })}
            fill="none" stroke={C.inkFaint} strokeWidth={1} strokeDasharray="2 2" />

          {/* cities — 뒷면은 낮은 투명도로 표시 */}
          {visibleCities.map((c, i) => {
            if (!c.projected) return null;
            const [px, py] = c.projected;
            const isFocused = activeIdx === i;
            const isMatched = matched && matched.has(c.name);
            const back = isBackside(c);
            const r = isFocused ? 8 : Math.sqrt(c.pop) * 0.8;
            // 뒷면은 0.18, 앞면 비포커스는 0.65, 포커스는 1
            const opacity = isFocused ? 1 : back ? 0.18 : 0.65;
            return (
              <g key={c.name}
                onMouseEnter={() => setActiveIdx(i)}
                onMouseLeave={() => setActiveIdx(null)}
                style={{ cursor: 'pointer' }}>
                {isMatched && !back && (
                  <circle cx={px} cy={py} r={r + 4}
                    fill="none" stroke={C.mustard} strokeWidth={2} />
                )}
                {isFocused && (
                  <circle cx={px} cy={py} r={r + 6}
                    fill="none" stroke={C.focus} strokeWidth={2} strokeDasharray="2 2" />
                )}
                <circle cx={px} cy={py} r={r}
                  fill={C.red} fillOpacity={opacity}
                  stroke={C.paper} strokeWidth={1}
                  strokeOpacity={back ? 0.3 : 1} />
                {(isFocused || (c.pop >= 25 && !back)) && (
                  <text x={px + r + 4} y={py + 3}
                    fontSize={isFocused ? 11 : 9}
                    fontFamily={'"Courier New", Courier, monospace'}
                    fill={C.ink} fontWeight={isFocused ? 700 : 500}>
                    {c.name}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      <div className="flex gap-3 mt-3 mb-3 items-start">
        <div>
          <div aria-live="polite" style={{ color: C.ink }}>
            {activeIdx != null ? (
              <>
                <strong>{worldCities[activeIdx].name}</strong>
                {' — '}
                인구 {worldCities[activeIdx].pop}M ·{' '}
                위도 {worldCities[activeIdx].lat.toFixed(2)}° ·{' '}
                경도 {worldCities[activeIdx].lng.toFixed(2)}°
              </>
            ) : matched ? `${matched.size}개 도시 일치` : `총 ${worldCities.length}개 도시 · 아래 칩으로 탐색 가능`}
          </div>
          <div className="mt-2 tabular-nums" style={{ color: C.inkFaint }}>
            경도 {rotation[0].toFixed(0)}° · 위도 {rotation[1].toFixed(0)}°
          </div>
        </div>
        {/* 회전 컨트롤 */}
        {mode === 'globe' && (
          <div className="flex items-center gap-3 ml-auto flex-wrap" style={{ justifyContent: 'end' }} role="group" aria-label="회전 컨트롤">
            {[
              { l: '◀', fn: () => setRotation((r) => [r[0] - 20, r[1]]), title: '서쪽' },
              { l: '▶', fn: () => setRotation((r) => [r[0] + 20, r[1]]), title: '동쪽' },
              { l: '▲', fn: () => setRotation((r) => [r[0], Math.min(89, r[1] + 15)]), title: '북쪽' },
              { l: '▼', fn: () => setRotation((r) => [r[0], Math.max(-89, r[1] - 15)]), title: '남쪽' },
              { l: '⟲', fn: () => setRotation([100, -20]), title: '초기 위치' },
            ].map(({ l, fn, title }) => (
              <button key={title} onClick={fn} aria-label={title}
                className="font-mono text-[11px] w-8 h-8"
                style={{ border: `1px solid ${C.rule}`, color: C.ink, background: 'transparent' }}
                {...focusable}>{l}</button>
            ))}
            <button onClick={() => setAutoRotate((v) => !v)}
              aria-pressed={autoRotate} disabled={reduced}
              className="font-mono text-[10px] tracking-widest px-2 h-8"
              style={{
                background: autoRotate ? C.red : 'transparent',
                color: autoRotate ? C.paper : reduced ? C.inkFaint : C.ink,
                border: `1px solid ${C.rule}`,
                opacity: reduced ? 0.4 : 1,
              }} {...focusable}>
              {autoRotate ? '■ STOP' : '▶ SPIN'}
            </button>
            <button onClick={() => setTableOpen((v) => !v)} aria-expanded={tableOpen}
              aria-controls="d28-table"
              {...focusable}>
              {tableOpen ? '데이터 표 닫기' : `총 ${worldCities.length}개 도시`}
            </button>
          </div>
        )}
      </div>

      {/* 도시 칩 — 마우스/키보드 양쪽으로 도시 접근 */}
      <div className="mt-2" role="group" aria-label="도시 선택, 인구 내림차순">
        <div className="mb-2" style={{ color: C.inkSoft }}>
          도시 칩 — 클릭/Enter로 해당 도시를 중심으로 회전
        </div>
        <div className="flex flex-wrap gap-3">
          {[...worldCities]
            .map((c, originalIdx) => ({ c, originalIdx }))
            .sort((a, b) => b.c.pop - a.c.pop)
            .map(({ c, originalIdx }) => {
              const isActive = activeIdx === originalIdx;
              const isMatched = matched && matched.has(c.name);
              return (
                <button key={c.name}
                  onClick={() => {
                    setActiveIdx(originalIdx);
                    setRotation([c.lng, -c.lat]);
                  }}
                  onMouseEnter={() => setActiveIdx(originalIdx)}
                  aria-pressed={isActive}
                  aria-label={`${c.name}, 인구 ${c.pop}백만, 위도 ${c.lat.toFixed(0)}도, 경도 ${c.lng.toFixed(0)}도`}
                  style={{
                    background: isActive ? C.ink : isMatched ? C.mustard : 'transparent',
                    color: isActive ? C.paper : isMatched ? C.paper : C.inkSoft,
                    border: `1px solid ${isActive ? C.ink : isMatched ? C.mustard : C.rule}`,
                  }}
                  {...focusable}>
                  {c.name}
                  <span style={{ opacity: 0.7, fontSize: 9 }}>{c.pop}M</span>
                </button>
              );
            })}
        </div>
      </div>

      {tableOpen && (
        <div id="d28-table">
          <table>
            <caption style={srOnly}>세계 주요 도시</caption>
            <thead>
              <tr>{['순위', '도시', '인구(M)', '위도', '경도'].map((h) => <th key={h} scope="col">{h}</th>)}</tr>
            </thead>
            <tbody>
              {[...worldCities].sort((a, b) => b.pop - a.pop).map((c, i) => (
                <tr key={c.name}>
                  <td>{i + 1}</td>
                  <td>{c.name}</td>
                  <td>{c.pop}</td>
                  <td>{c.lat.toFixed(2)}</td>
                  <td>{c.lng.toFixed(2)}</td>
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
// META — 각 데모의 인터랙션·접근성 고려사항
// ════════════════════════════════════════════════════════════
const META = {
  24: {
    title: 'Choropleth · Tile Grid',
    method: '한국 시도를 격자로 추상화 · 5단계 양자화',
    interactions: [
      '실제 지리적 위치를 격자에 추상화 — 면적 차이로 인한 시각 왜곡 제거',
      '5단계로 양자화한 색 + 점 패턴 밀도 이중코딩',
      '서울·경기처럼 작은 지역도 다른 지역과 같은 크기로 노출',
      '각 타일에 시도명 + 인구밀도 값을 동시 표기',
      '세종특별자치시는 작은 타일로 시각적으로도 구분',
    ],
    a11y: [
      '인구밀도 내림차순으로 키보드 ←→ 탐색 (의미 있는 순서)',
      'WCAG 1.4.1 — 색·패턴·텍스트 삼중 코딩',
      '5단계 구간으로 양자화 → 색 차이를 거의 무한히 다양화하지 않음',
      'aria-live로 "X단계" 표현 추가 → 색 못 봐도 등급 파악',
      '데이터 표가 순위와 구간을 모두 명시',
      '진한 색 배경에는 흰 텍스트로 자동 전환 (가독성)',
    ],
  },
  25: {
    title: 'Flow Map · 도시 간 이동',
    method: 'tile grid 위 곡선 화살표 · 화살표 색·두께 이중코딩',
    interactions: [
      'tile grid 위에 곡선 화살표로 흐름 표시',
      '도시 호버 시 in/out 흐름만 강조, 나머지 dim',
      '화살표 폭이 인원 수 (즉시 비교)',
      'outgoing(빨강)/incoming(남색)을 화살표 마커로 방향 명시',
    ],
    a11y: [
      '도시명 가나다순 키보드 탐색',
      'WCAG 2.5.7 — 호버 외 클릭/Enter로도 토글 가능',
      '범례에 색·화살표 모두 SVG로 표시 (폰트 의존 없음)',
      'in/out 흐름의 합계를 자연어로 안내',
      '흐름 표는 출발-도착-인원의 완전한 정보 제공',
    ],
  },
  26: {
    title: '3D Scatter · Three.js',
    method: 'WebGL · 마우스/키보드 카메라 · 2D 투영 토글',
    interactions: [
      '마우스 드래그로 카메라 yaw·pitch 회전',
      '+/- 키와 버튼으로 줌',
      'AUTO 버튼으로 자동 회전 (탐색 동영상 같은 효과)',
      'X축 빨강, Y축 올리브, Z축 남색으로 축 색 일관성',
      '3개 클러스터를 색으로 그룹핑',
    ],
    a11y: [
      'WCAG 2.1.1 — 모든 카메라 동작이 키보드만으로 가능',
      '←→↑↓ 회전, +/- 줌, ⟲로 초기화',
      'XY/XZ/YZ 2D 투영 토글 — 3D 인지가 어려운 사용자 대안',
      'prefers-reduced-motion 시 자동 회전 비활성 + 알림',
      'canvas는 aria-hidden — SR이 빈 캔버스 읽지 않도록',
      '대안으로 데이터 표 제공 (좌표·클러스터 라벨)',
    ],
  },
  27: {
    title: '대량 포인트 · Canvas 2D',
    method: '5만 점 Canvas 직접 렌더링 · 10×10 셀 집계',
    interactions: [
      'SVG로는 어려운 5만 점을 Canvas 2D로 빠르게 렌더링',
      '드래그로 pan, 셀 호버로 통계 즉시 표시',
      '10×10 격자가 가시적 분포를 보여줌',
      '각 셀의 주 그룹과 점 수를 라이브로 안내',
    ],
    a11y: [
      'WCAG — 5만 개를 모두 SR에 읽힐 수 없음, 격자 집계로 요약',
      'canvas는 aria-hidden, 컨테이너만 키보드 진입',
      '←→↑↓로 100개 셀 탐색, 셀별 집계 텍스트로 제공',
      '데이터 표는 상위 20개 셀만 — 모든 데이터를 표로도 무리',
      'aria-live로 활성 셀의 집계 + 주 그룹 안내',
    ],
  },
  28: {
    title: 'Globe · 정사영',
    method: 'd3.geoOrthographic · 회전 가능 · 평면 토글',
    interactions: [
      '마우스 드래그로 카메라 회전, 자전축은 위쪽 유지',
      '20개 주요 도시를 점 크기로 인구 표현',
      '인구 25M+ 도시는 항상 라벨 표시, 나머지는 호버 시',
      '검색으로 도시 골드 링 강조',
      '자동 회전(SPIN) 토글',
    ],
    a11y: [
      '키보드 ←→↑↓로 globe 회전 — 마우스 없이도 모든 면 탐색',
      '평면(equirectangular) 모드 토글 — 정사영의 시각 의존 우회',
      '도시 검색으로 임의 도시에 즉시 접근',
      '검색 결과 개수 aria-live로 알림',
      'prefers-reduced-motion 시 자동 회전 비활성',
      '데이터 표에 모든 도시의 인구·위경도 명시',
    ],
  },
};

// ════════════════════════════════════════════════════════════
// CARD
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
  { num: 24, cat: 'GEOGRAPHIC', cmp: <D24 /> },
  { num: 25, cat: 'GEOGRAPHIC', cmp: <D25 /> },
  { num: 26, cat: '3D · WEBGL', cmp: <D26 /> },
  { num: 27, cat: 'CANVAS · DENSE', cmp: <D27 /> },
  { num: 28, cat: 'GEOGRAPHIC · 3D', cmp: <D28 /> },
];

export default function Phase3() {
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
