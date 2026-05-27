import React, { useState, useEffect, useRef, useMemo } from 'react';
import * as d3 from 'd3';
import {
  LineChart, Line, BarChart, Bar, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from 'recharts';

// ════════════════════════════════════════════════════════════
// PALETTE · WCAG AA 통과
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
const DASHES = [undefined, '6 3', '2 2', '8 2 2 2', '4 1 1 1', '1 1'];

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

// 차트 너비를 부모 컨테이너 픽셀 폭과 일치시킨다.
// viewBox W가 실제 픽셀 폭과 같아야 1 user-unit = 1px이 되어 텍스트가 viewBox
// 스케일링과 함께 커지는 일이 없다 (Recharts ResponsiveContainer와 같은 동작).
const useChartW = (initial = 480) => {
  const ref = useRef(null);
  const [w, setW] = useState(initial);
  useEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver((entries) => {
      const cw = Math.round(entries[0].contentRect.width);
      if (cw > 0) setW(cw);
    });
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);
  return [ref, w];
};

// ════════════════════════════════════════════════════════════
// DATA
// ════════════════════════════════════════════════════════════
const monthlyData = [
  { month: 'JAN', revenue: 24, cost: 18 }, { month: 'FEB', revenue: 28, cost: 19 },
  { month: 'MAR', revenue: 35, cost: 22 }, { month: 'APR', revenue: 32, cost: 24 },
  { month: 'MAY', revenue: 41, cost: 26 }, { month: 'JUN', revenue: 48, cost: 29 },
  { month: 'JUL', revenue: 52, cost: 31 }, { month: 'AUG', revenue: 49, cost: 33 },
  { month: 'SEP', revenue: 58, cost: 35 }, { month: 'OCT', revenue: 62, cost: 38 },
  { month: 'NOV', revenue: 71, cost: 42 }, { month: 'DEC', revenue: 84, cost: 48 },
];
const categoryData = [
  { name: '서울', value: 42 }, { name: '경기', value: 38 }, { name: '부산', value: 18 },
  { name: '대구', value: 12 }, { name: '인천', value: 14 }, { name: '광주', value: 8 },
  { name: '대전', value: 9 },
];
const donutData = [
  { name: '모바일', value: 48 }, { name: '데스크탑', value: 27 },
  { name: '태블릿', value: 14 }, { name: '기타', value: 11 },
];
const scatterData = Array.from({ length: 40 }, (_, i) => {
  const x = 10 + Math.random() * 80;
  const y = 15 + x * 0.6 + (Math.random() - 0.5) * 25;
  return { x: +x.toFixed(1), y: +y.toFixed(1), id: i, label: `P${(i + 1).toString().padStart(2, '0')}` };
});
const longSeries = Array.from({ length: 120 }, (_, i) => {
  const w = Math.sin(i / 8) * 8 + Math.sin(i / 3) * 3;
  return { day: i, date: `D${i}`, value: +(30 + i * 0.2 + w + (Math.random() - 0.5) * 3).toFixed(1) };
});
const multiSeries = monthlyData.map((d) => ({
  month: d.month,
  'A': d.revenue, 'B': Math.round(d.revenue * 0.72 + 5),
  'C': Math.round(d.revenue * 0.48 - 2), 'D': Math.round(d.revenue * 0.31 + 8),
}));
const products = ['모바일', '데스크탑', '태블릿', '키오스크'];
const months6 = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN'];
const stackedData = months6.map((m, i) => ({
  month: m,
  모바일: 24 + i * 3 + Math.round(Math.random() * 6),
  데스크탑: 18 + i * 2 + Math.round(Math.random() * 4),
  태블릿: 8 + i + Math.round(Math.random() * 3),
  키오스크: 4 + Math.round(Math.random() * 2),
}));
const cityData9 = [
  { name: '서울', value: 42 }, { name: '경기', value: 38 }, { name: '부산', value: 18 },
  { name: '대구', value: 12 }, { name: '인천', value: 14 }, { name: '광주', value: 8 },
  { name: '대전', value: 9 }, { name: '울산', value: 6 }, { name: '세종', value: 3 },
];
const drillData = {
  root: [
    { name: '전자', value: 145, color: C.navy }, { name: '의류', value: 98, color: C.red },
    { name: '식품', value: 76, color: C.olive }, { name: '도서', value: 42, color: C.teal },
  ],
  전자: [{ name: '노트북', value: 58 }, { name: '스마트폰', value: 47 }, { name: '태블릿', value: 23 }, { name: '액세서리', value: 17 }],
  의류: [{ name: '아우터', value: 38 }, { name: '상의', value: 28 }, { name: '하의', value: 21 }, { name: '신발', value: 11 }],
  식품: [{ name: '신선식품', value: 32 }, { name: '가공식품', value: 24 }, { name: '음료', value: 20 }],
  도서: [{ name: '문학', value: 18 }, { name: '실용서', value: 14 }, { name: '아동', value: 10 }],
};
const seriesA = months6.map((m, i) => ({ month: m, value: 30 + i * 4 + Math.round(Math.random() * 5) }));
const seriesB = months6.map((m, i) => ({ month: m, value: 50 - i * 2 + Math.round(Math.random() * 6) }));
const compareData = months6.map((m, i) => ({
  month: m, '2024': 28 + i * 2 + Math.round(Math.random() * 4),
  '2025': 35 + i * 4 + Math.round(Math.random() * 5),
}));

// ════════════════════════════════════════════════════════════
// 공통 UI
// ════════════════════════════════════════════════════════════
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
// #01 — Line · hover-or-focus tooltip
// ════════════════════════════════════════════════════════════
const D01 = () => {
  const [activeIdx, setActiveIdx] = useState(null);
  const [tableOpen, setTableOpen] = useState(false);
  const [containerRef, W] = useChartW(); const H = 220, m = { t: 12, r: 16, b: 28, l: 36 };
  const innerW = W - m.l - m.r, innerH = H - m.t - m.b;
  const maxV = d3.max(monthlyData, (d) => Math.max(d.revenue, d.cost));
  const xStep = innerW / (monthlyData.length - 1);

  const onKey = (e) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      setActiveIdx((i) => i == null ? 0 : Math.min(monthlyData.length - 1, i + 1));
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      setActiveIdx((i) => i == null ? monthlyData.length - 1 : Math.max(0, i - 1));
    } else if (e.key === 'Home') { e.preventDefault(); setActiveIdx(0); }
    else if (e.key === 'End') { e.preventDefault(); setActiveIdx(monthlyData.length - 1); }
    else if (e.key === 'Escape') { e.preventDefault(); setActiveIdx(null); }
  };

  const active = activeIdx != null ? monthlyData[activeIdx] : null;

  return (
    <div>
      <Usage mouse="호버" keyboard="Tab → ←→ Home/End, Esc 해제" />
      <div ref={containerRef} role="application" aria-label="2024년 12개월간 매출과 비용 추이"
        tabIndex={0} onKeyDown={onKey} onBlur={() => setActiveIdx(null)}
        style={{ position: 'relative' }} {...focusable}>
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: H, background: C.paper, border: `1px solid ${C.rule}` }}>
          {[0, 25, 50, 75].map((v) => (
            <g key={v}>
              <line x1={m.l} x2={W - m.r}
                y1={H - m.b - (v / maxV) * innerH} y2={H - m.b - (v / maxV) * innerH}
                stroke={C.ruleSoft} />
              <text x={m.l - 6} y={H - m.b - (v / maxV) * innerH} textAnchor="end" dy="0.32em"
                fontSize="10" fontFamily={'"Courier New", Courier, monospace'} fill={C.inkSoft}>{v}M</text>
            </g>
          ))}
          {/* lines */}
          {[
            { key: 'revenue', color: C.red, dash: undefined },
            { key: 'cost', color: C.navy, dash: '6 3' },
          ].map(({ key, color, dash }) => (
            <path key={key}
              d={monthlyData.map((d, i) => `${i === 0 ? 'M' : 'L'}${m.l + i * xStep},${H - m.b - (d[key] / maxV) * innerH}`).join(' ')}
              fill="none" stroke={color} strokeWidth={2} strokeDasharray={dash} />
          ))}
          {/* hit-areas + dots */}
          {monthlyData.map((d, i) => {
            const cx = m.l + i * xStep;
            const isActive = i === activeIdx;
            return (
              <g key={d.month}>
                <rect x={cx - xStep / 2} y={m.t} width={xStep} height={innerH}
                  fill="transparent"
                  onMouseEnter={() => setActiveIdx(i)}
                  onMouseLeave={() => setActiveIdx(null)}
                  style={{ cursor: 'pointer' }} />
                {isActive && (
                  <line x1={cx} x2={cx} y1={m.t} y2={H - m.b}
                    stroke={C.ink} strokeDasharray="2 2" />
                )}
                {['revenue', 'cost'].map((k, ki) => {
                  const cy = H - m.b - (d[k] / maxV) * innerH;
                  const color = ki === 0 ? C.red : C.navy;
                  return (
                    <circle key={k} cx={cx} cy={cy} r={isActive ? 5 : 3}
                      fill={isActive ? color : C.paper} stroke={color} strokeWidth={2} />
                  );
                })}
                <text x={cx} y={H - 8} textAnchor="middle"
                  fontSize="10" fontFamily={'"Courier New", Courier, monospace'}
                  fill={isActive ? C.ink : C.inkSoft}
                  fontWeight={isActive ? 600 : 400}>{d.month}</text>
              </g>
            );
          })}
        </svg>
        {active && (
          <div className="absolute px-2.5 py-1.5 pointer-events-none"
            style={{
              background: C.ink, color: C.paper, fontSize: '12px', padding: '8px 12px', borderRadius: '4px', top: 8, right: 16,
              boxShadow: '3px 3px 0 rgba(0,0,0,0.08)',
            }} aria-hidden="true">
            <div style={{ color: 'rgba(251,248,241,0.8)', fontSize: '11px', letterSpacing: 0.04 }}>{active.month}</div>
            <div>매출 {active.revenue}M · 비용 {active.cost}M</div>
          </div>
        )}
      </div>

      <div className="flex gap-3 mt-3 mb-3 items-start">
        <div className="flex gap-3">
          <span style={{ color: C.red }}>━━ 매출</span>
          <span style={{ color: C.navy }}>┅┅ 비용</span>
        </div>
        <div aria-live="polite"
          style={{ color: active ? C.ink : C.inkFaint }}>
          {active ? `${active.month} — 매출 ${active.revenue}M, 비용 ${active.cost}M` : '\u00A0'}
        </div>
        <button onClick={() => setTableOpen((v) => !v)} aria-expanded={tableOpen}
          aria-controls="d01-table"
          className="ml-auto"
          {...focusable}>
          {tableOpen ? '데이터 표 닫기' : '12개월 데이터'}
        </button>
      </div>
      {tableOpen && (
        <div id="d01-table">
          <table>
            <caption style={srOnly}>월별 매출·비용</caption>
            <thead>
              <tr>
                <th scope="col">월</th>
                <th scope="col">매출</th>
                <th scope="col">비용</th>
              </tr>
            </thead>
            <tbody>
              {monthlyData.map((d) => (
                <tr key={d.month}>
                  <td>{d.month}</td>
                  <td>{d.revenue}M</td>
                  <td>{d.cost}M</td>
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
// #02 — Bar · 키보드 + 클릭 선택
// ════════════════════════════════════════════════════════════
const D02 = () => {
  const [selected, setSelected] = useState(null);
  const [focusIdx, setFocusIdx] = useState(0);
  const data = categoryData;
  const max = d3.max(data, (d) => d.value);

  const [containerRef, W] = useChartW(); const H = 220, m = { t: 24, r: 16, b: 32, l: 32 };
  const innerW = W - m.l - m.r, innerH = H - m.t - m.b;
  const step = innerW / data.length;
  const barW = step * 0.65;

  const toggleAt = (i) => setSelected((s) => s === data[i].name ? null : data[i].name);

  const onKey = (e) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault(); setFocusIdx((i) => Math.min(data.length - 1, i + 1));
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault(); setFocusIdx((i) => Math.max(0, i - 1));
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault(); toggleAt(focusIdx);
    } else if (e.key === 'Escape') {
      e.preventDefault(); setSelected(null);
    }
  };

  return (
    <div>
      <Usage mouse="클릭으로 선택/해제" keyboard="Tab → ←→ Enter/Space, Esc 해제" />
      <div ref={containerRef} role="application" aria-label="도시별 점유율, 막대 선택"
        tabIndex={0} onKeyDown={onKey} {...focusable}>
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: H, background: C.paper, border: `1px solid ${C.rule}` }}>
          {[0, 25, 50].map((v) => (
            <line key={v} x1={m.l} x2={W - m.r}
              y1={H - m.b - (v / max) * innerH} y2={H - m.b - (v / max) * innerH}
              stroke={C.ruleSoft} />
          ))}
          {data.map((d, i) => {
            const x = m.l + i * step + (step - barW) / 2;
            const h = (d.value / max) * innerH;
            const y = H - m.b - h;
            const isSel = selected === d.name;
            const isFocus = focusIdx === i;
            return (
              <g key={d.name} onClick={() => { toggleAt(i); setFocusIdx(i); }}
                style={{ cursor: 'pointer' }}>
                {isFocus && (
                  <rect x={x - 4} y={y - 4} width={barW + 8} height={h + 8}
                    fill="none" stroke={C.focus} strokeWidth={2} strokeDasharray="3 3" />
                )}
                <rect x={x} y={y} width={barW} height={h} fill={C.navy}
                  fillOpacity={selected == null ? 0.85 : isSel ? 1 : 0.18}
                  stroke={isSel ? C.ink : 'none'} strokeWidth={isSel ? 1.5 : 0} />
                {(isSel || isFocus) && (
                  <text x={x + barW / 2} y={y - 6} textAnchor="middle"
                    fontSize="11" fontFamily={'"Courier New", Courier, monospace'}
                    fill={C.ink} fontWeight="600">{d.value}%</text>
                )}
                <text x={x + barW / 2} y={H - m.b + 16} textAnchor="middle"
                  fontSize="10" fontFamily={'"Courier New", Courier, monospace'}
                  fill={isSel || isFocus ? C.ink : C.inkSoft}
                  fontWeight={isSel || isFocus ? 600 : 400}>{d.name}</text>
              </g>
            );
          })}
        </svg>
      </div>
      <div className="flex gap-3 mt-3 mb-3 items-start">
        <div aria-live="polite"
          style={{ color: selected ? C.ink : C.inkFaint }}>
          {selected ? `선택: ${selected}, ${data.find((d) => d.name === selected).value}%`
            : `포커스: ${data[focusIdx].name}`}
        </div>
      </div>
    </div>
  );
};

// ════════════════════════════════════════════════════════════
// #03 — Donut · hover-or-focus + 화살표 키
// ════════════════════════════════════════════════════════════
const D03 = () => {
  const [activeIdx, setActiveIdx] = useState(0);
  const total = donutData.reduce((s, d) => s + d.value, 0);
  const active = donutData[activeIdx];

  // Compute arcs
  const cx = 110, cy = 110, rOut = 80, rIn = 50;
  let angle = -Math.PI / 2;
  const arcs = donutData.map((d) => {
    const a0 = angle;
    const a1 = angle + (d.value / total) * Math.PI * 2;
    angle = a1;
    const arc = d3.arc().innerRadius(rIn).outerRadius(rOut)
      .startAngle(a0 + 0.012).endAngle(a1 - 0.012);
    return { d: arc(), start: a0, end: a1, ...d };
  });

  const onKey = (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault(); setActiveIdx((i) => (i + 1) % donutData.length);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault(); setActiveIdx((i) => (i - 1 + donutData.length) % donutData.length);
    }
  };

  return (
    <div>
      <Usage mouse="슬라이스 호버" keyboard="Tab → ←→ 또는 칩 클릭" />
      <div role="application" aria-label="기기별 점유율 도넛 차트"
        tabIndex={0} onKeyDown={onKey} style={{ position: 'relative' }} {...focusable}>
        <svg viewBox="0 0 220 220" style={{ width: '100%', height: 220, background: C.paper, border: `1px solid ${C.rule}` }}>
          {arcs.map((a, i) => (
            <g key={a.name}
              onMouseEnter={() => setActiveIdx(i)}
              style={{ cursor: 'pointer' }}>
              <path d={a.d} transform={`translate(${cx},${cy})`}
                fill={SERIES[i]}
                fillOpacity={activeIdx === i ? 1 : 0.32} />
              {activeIdx === i && (
                <path d={d3.arc().innerRadius(rIn - 3).outerRadius(rOut + 3)
                  .startAngle(a.start).endAngle(a.end)()}
                  transform={`translate(${cx},${cy})`}
                  fill="none" stroke={C.focus} strokeWidth={2} />
              )}
            </g>
          ))}
          {/* 중앙 라벨 */}
          <text x={cx} y={cy - 8} textAnchor="middle"
            fontSize="10" fontFamily={'"Courier New", Courier, monospace'}
            letterSpacing="0.1em" fill={C.inkSoft}>{active.name.toUpperCase()}</text>
          <text x={cx} y={cy + 18} textAnchor="middle"
            fontSize="28" fontFamily="inherit" fill={C.ink}>{active.value}%</text>
          {/* 색 외 이중코딩: 모양 글리프 */}
          {arcs.map((a, i) => {
            // d3.arc는 0 = 12시 방향, 시계방향 회전. Math.cos/sin은 0 = 3시 방향
            // 기준이라 그대로 쓰면 90° 어긋난다. SVG y축은 아래 양수이므로 y 부호도 반전.
            const mid = (a.start + a.end) / 2;
            const r = (rIn + rOut) / 2;
            const x = cx + Math.sin(mid) * r;
            const y = cy - Math.cos(mid) * r;
            return (
              <text key={i} x={x} y={y} textAnchor="middle" dy="0.35em"
                fontSize="11" fill={C.paper} fontWeight="700"
                aria-hidden="true">{SHAPES[i]}</text>
            );
          })}
        </svg>
      </div>
      <div className="flex gap-3 mt-3 mb-3 items-start">
        <div className="flex flex-wrap gap-2" role="group" aria-label="기기 선택">
          {donutData.map((d, i) => (
            <button key={d.name} onClick={() => setActiveIdx(i)}
              aria-pressed={activeIdx === i}
              className="flex"
              style={{
                color: activeIdx === i ? C.paper : C.inkSoft,
                background: activeIdx === i ? SERIES[i] : 'transparent',
                border: `1px solid ${SERIES[i]}`,
              }} {...focusable}>
              <span aria-hidden="true" style={{ color: activeIdx === i ? C.paper : SERIES[i], fontSize: 13 }}>{SHAPES[i]}</span>{d.name} <span style={{ opacity: 0.7 }}>{d.value}%</span>
            </button>
          ))}
        </div>
        <div aria-live="polite" style={srOnly}>{active.name} 선택됨, {active.value}%</div>
      </div>
    </div>
  );
};

// ════════════════════════════════════════════════════════════
// #04 — Scatter · 드래그 + 키보드 + 체크박스 표 (3중 입력)
// ════════════════════════════════════════════════════════════
const D04 = () => {
  const ref = useRef(null);
  const [selected, setSelected] = useState(new Set());
  const [focusId, setFocusId] = useState(null);
  const [hover, setHover] = useState(null);
  const [tableOpen, setTableOpen] = useState(false);

  const [containerRef, W] = useChartW(); const H = 280, m = { t: 16, r: 16, b: 32, l: 40 };
  const x = d3.scaleLinear().domain([0, 100]).range([m.l, W - m.r]);
  const y = d3.scaleLinear().domain([0, 100]).range([H - m.b, m.t]);

  const toggleId = (id) => setSelected((p) => {
    const n = new Set(p);
    n.has(id) ? n.delete(id) : n.add(id);
    return n;
  });

  const brushRef = useRef(null);
  const brushGRef = useRef(null);

  const clearAll = () => {
    setSelected(new Set());
    if (brushRef.current && brushGRef.current) {
      brushGRef.current.call(brushRef.current.move, null);
    }
  };

  useEffect(() => {
    const svg = d3.select(ref.current);
    const brushG = svg.select('.brush');
    const brush = d3.brush()
      .extent([[m.l, m.t], [W - m.r, H - m.b]])
      .on('brush end', (ev) => {
        if (!ev.selection) return;
        const [[x0, y0], [x1, y1]] = ev.selection;
        const next = new Set();
        scatterData.forEach((p) => {
          const cx = x(p.x), cy = y(p.y);
          if (cx >= x0 && cx <= x1 && cy >= y0 && cy <= y1) next.add(p.id);
        });
        setSelected(next);
      });
    brushG.call(brush);
    brushG.selectAll('.selection')
      .attr('fill', C.red).attr('fill-opacity', 0.08).attr('stroke', C.red);
    brushRef.current = brush;
    brushGRef.current = brushG;
  }, []);

  const onKey = (e) => {
    if (focusId == null && (e.key.startsWith('Arrow') || e.key === ' ')) {
      e.preventDefault(); setFocusId(scatterData[0].id); return;
    }
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault();
      const sorted = [...scatterData].sort((a, b) => a.x - b.x);
      const cur = sorted.findIndex((p) => p.id === focusId);
      const next = e.key === 'ArrowRight'
        ? Math.min(sorted.length - 1, cur + 1)
        : Math.max(0, cur - 1);
      setFocusId(sorted[next].id);
    } else if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault(); toggleId(focusId);
    } else if ((e.key === 'a' || e.key === 'A') && (e.ctrlKey || e.metaKey)) {
      e.preventDefault(); setSelected(new Set(scatterData.map((p) => p.id)));
    } else if (e.key === 'Escape') {
      e.preventDefault(); clearAll();
    }
  };

  const fp = scatterData.find((p) => p.id === focusId);
  const tipPoint = hover || fp;

  return (
    <div>
      <Usage mouse="드래그 영역 선택 / 점 클릭 토글"
        keyboard="Tab → ←→ Space, Ctrl+A 전체, Esc 해제" />
      <div ref={containerRef} role="application" aria-label="40개 점 산점도, 선택 가능"
        aria-describedby="d04-status" tabIndex={0} onKeyDown={onKey}
        style={{ position: 'relative' }} {...focusable}>
        <svg ref={ref} viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: H, display: 'block', background: C.paper, border: `1px solid ${C.rule}` }}>
          {[0, 25, 50, 75, 100].map((v) => (
            <g key={v}>
              <line x1={m.l} x2={W - m.r} y1={y(v)} y2={y(v)} stroke={C.ruleSoft} />
              <text x={m.l - 6} y={y(v)} textAnchor="end" dy="0.32em"
                fontSize="10" fontFamily={'"Courier New", Courier, monospace'} fill={C.inkSoft}>{v}</text>
              <text x={x(v)} y={H - m.b + 14} textAnchor="middle"
                fontSize="10" fontFamily={'"Courier New", Courier, monospace'} fill={C.inkSoft}>{v}</text>
            </g>
          ))}
          <g className="brush" />
          {scatterData.map((p) => {
            const sel = selected.has(p.id);
            const foc = p.id === focusId;
            return (
              <g key={p.id}>
                {foc && <circle cx={x(p.x)} cy={y(p.y)} r={10}
                  fill="none" stroke={C.focus} strokeWidth={2} strokeDasharray="2 2" />}
                <circle cx={x(p.x)} cy={y(p.y)}
                  r={sel ? 6 : 4} fill={sel ? C.red : C.olive}
                  fillOpacity={sel ? 1 : 0.6} stroke={sel ? C.ink : 'none'} strokeWidth={sel ? 1 : 0}
                  onMouseEnter={() => setHover(p)} onMouseLeave={() => setHover(null)}
                  onClick={() => toggleId(p.id)}
                  style={{ cursor: 'pointer', pointerEvents: 'all' }} />
              </g>
            );
          })}
        </svg>
        {tipPoint && (
          <div className="absolute pointer-events-none px-2 py-1"
            style={{
              background: C.ink, color: C.paper,
              left: `${(x(tipPoint.x) / W) * 100}%`,
              top: `${(y(tipPoint.y) / H) * 100}%`,
              transform: 'translate(-50%, -130%)', whiteSpace: 'nowrap',
            }}>
            {tipPoint.label} · ({tipPoint.x}, {tipPoint.y})
          </div>
        )}
      </div>
      <div className="flex gap-3 mt-3 mb-3 items-start">
        <div id="d04-status" aria-live="polite"
          style={{ color: selected.size ? C.ink : C.inkFaint }}>
          <span>
            {selected.size === 0 ? '선택 없음' : `${selected.size}/${scatterData.length}개`}
            {fp && <span style={{ marginLeft: 12, color: C.inkSoft }}>· 포커스 {fp.label}</span>}
          </span>
        </div>
        <div className="flex gap-3 ml-auto">
          <button onClick={clearAll}
            style={{ border: `1px solid ${C.rule}`, color: C.inkSoft, background: 'transparent' }}
            {...focusable}>해제</button>
          <button onClick={() => setTableOpen((v) => !v)} aria-expanded={tableOpen}
            aria-controls="d04-table"
            {...focusable}>
            {tableOpen ? '데이터 표 닫기'
              : (selected.size > 0 ? `표로 선택 (${selected.size}개 선택됨)` : '표로 선택')}
          </button>
        </div>
      </div>
      {tableOpen && (
        <div id="d04-table">
          <table>
            <caption style={srOnly}>40개 점의 좌표와 선택 상태</caption>
            <thead>
              <tr>
                <th scope="col">✓</th>
                <th scope="col">ID</th>
                <th scope="col">X</th>
                <th scope="col">Y</th>
              </tr>
            </thead>
            <tbody>
              {scatterData.map((p) => (
                <tr key={p.id}>
                  <td>
                    <input type="checkbox" checked={selected.has(p.id)}
                      onChange={() => toggleId(p.id)} aria-label={`${p.label} 선택`} />
                  </td>
                  <td>{p.label}</td>
                  <td>{p.x}</td>
                  <td>{p.y}</td>
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
// #05 — Area · Brush 줌 + 키보드 줌 컨트롤
// ════════════════════════════════════════════════════════════
const D05 = () => {
  const reduced = useReducedMotion();
  const [range, setRange] = useState([40, 90]);
  const visible = longSeries.slice(range[0], range[1] + 1);
  const max = d3.max(longSeries, (d) => d.value);

  const [containerRef, W] = useChartW(); const H = 200, m = { t: 12, r: 16, b: 50, l: 32 };
  const innerH = H - m.t - m.b - 30;
  const innerW = W - m.l - m.r;
  const svgRef = useRef(null);
  const dragRef = useRef({ mode: null, startIdx: 0, startRange: null });

  // 메인 영역
  const xMain = (i) => m.l + (i / (visible.length - 1)) * innerW;
  const yMain = (v) => m.t + innerH - (v / max) * innerH;
  const mainPath = visible.length > 1
    ? visible.map((d, i) => `${i === 0 ? 'M' : 'L'}${xMain(i)},${yMain(d.value)}`).join(' ')
    : '';

  // 미니맵
  const miniY = H - m.b + 4;
  const miniH = 22;
  const xMini = (i) => m.l + (i / (longSeries.length - 1)) * innerW;

  // 클라이언트 X 좌표 → 데이터 인덱스 (SVG viewBox 기준)
  const clientToIdx = (clientX) => {
    const el = svgRef.current;
    if (!el) return 0;
    const r = el.getBoundingClientRect();
    const xPx = ((clientX - r.left) / r.width) * W;
    const i = Math.round(((xPx - m.l) / innerW) * (longSeries.length - 1));
    return Math.max(0, Math.min(longSeries.length - 1, i));
  };

  // 마우스/터치 양쪽에서 clientX를 추출 (touch는 첫 손가락만)
  const pointerX = (e) => e.touches ? e.touches[0]?.clientX : e.clientX;

  const startDrag = (mode) => (e) => {
    e.preventDefault();
    const cx = pointerX(e);
    if (cx == null) return;
    dragRef.current = {
      mode,
      startIdx: clientToIdx(cx),
      startRange: [range[0], range[1]],
    };
  };

  useEffect(() => {
    const onMove = (e) => {
      const { mode, startIdx, startRange } = dragRef.current;
      if (!mode || !startRange) return;
      const cx = pointerX(e);
      if (cx == null) return;
      // touchmove의 기본 스크롤 동작 차단 — 미니맵 드래그가 페이지 스크롤로 가로채이지 않게
      if (e.cancelable) e.preventDefault();
      const dx = clientToIdx(cx) - startIdx;
      if (mode === 'left') {
        const next = Math.max(0, Math.min(startRange[1] - 5, startRange[0] + dx));
        setRange([next, startRange[1]]);
      } else if (mode === 'right') {
        const next = Math.max(startRange[0] + 5, Math.min(longSeries.length - 1, startRange[1] + dx));
        setRange([startRange[0], next]);
      } else if (mode === 'move') {
        const len = startRange[1] - startRange[0];
        const nL = Math.max(0, Math.min(longSeries.length - 1 - len, startRange[0] + dx));
        setRange([nL, nL + len]);
      }
    };
    const onUp = () => { dragRef.current.mode = null; };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    // touchmove는 passive:false여야 preventDefault가 동작 (페이지 스크롤 차단)
    window.addEventListener('touchmove', onMove, { passive: false });
    window.addEventListener('touchend', onUp);
    window.addEventListener('touchcancel', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onUp);
      window.removeEventListener('touchcancel', onUp);
    };
  }, []);

  const shift = (delta) => {
    const len = range[1] - range[0];
    const ns = Math.max(0, Math.min(longSeries.length - 1 - len, range[0] + delta));
    setRange([ns, ns + len]);
  };
  const zoom = (delta) => {
    const cur = range[1] - range[0];
    const next = Math.max(10, Math.min(longSeries.length - 1, cur + delta));
    const center = (range[0] + range[1]) / 2;
    const half = next / 2;
    setRange([Math.max(0, Math.round(center - half)),
    Math.min(longSeries.length - 1, Math.round(center + half))]);
  };

  return (
    <div>
      <Usage mouse="미니맵 양 끝 드래그"
        keyboard="◀ ▶ 이동, ＋ - ◯ 줌" />
      <div ref={containerRef} role="application" aria-label={`시계열 차트, 표시 범위 ${range[0]}일~${range[1]}일`}>
        <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: H, background: C.paper, border: `1px solid ${C.rule}` }}>
          <defs>
            <linearGradient id="d05grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={C.teal} stopOpacity={0.45} />
              <stop offset="100%" stopColor={C.teal} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          {/* main grid */}
          {[0, 25, 50, 75].map((v) => (
            <line key={v} x1={m.l} x2={W - m.r}
              y1={yMain(v)} y2={yMain(v)} stroke={C.ruleSoft} />
          ))}
          {/* main area */}
          {visible.length > 1 && (
            <>
              <path d={`${mainPath} L${xMain(visible.length - 1)},${yMain(0)} L${xMain(0)},${yMain(0)} Z`}
                fill="url(#d05grad)" />
              <path d={mainPath} fill="none" stroke={C.teal} strokeWidth={1.5} />
            </>
          )}
          {/* axis labels */}
          <text x={m.l} y={H - m.b - 4} fontSize="9" fontFamily={'"Courier New", Courier, monospace'}
            fill={C.inkSoft}>D{range[0]}</text>
          <text x={W - m.r} y={H - m.b - 4} fontSize="9" fontFamily={'"Courier New", Courier, monospace'}
            fill={C.inkSoft} textAnchor="end">D{range[1]}</text>

          {/* 미니맵 */}
          <rect x={m.l} y={miniY} width={innerW} height={miniH}
            fill={C.paper} stroke={C.rule} />
          <path d={longSeries.map((d, i) => `${i === 0 ? 'M' : 'L'}${xMini(i)},${miniY + miniH - (d.value / max) * miniH}`).join(' ')}
            fill="none" stroke={C.inkFaint} strokeWidth={1} />
          {/* range — 가운데 드래그로 전체 이동 */}
          <rect x={xMini(range[0])} y={miniY}
            width={xMini(range[1]) - xMini(range[0])} height={miniH}
            fill={C.red} fillOpacity={0.12} stroke={C.red}
            onMouseDown={startDrag('move')}
            onTouchStart={startDrag('move')}
            style={{ cursor: 'grab', touchAction: 'none' }} />
          {/* 좌측 핸들 — 시작 인덱스 드래그 */}
          <rect x={xMini(range[0]) - 5} y={miniY - 3}
            width={10} height={miniH + 6}
            fill={C.red} fillOpacity={0.001}
            onMouseDown={startDrag('left')}
            onTouchStart={startDrag('left')}
            style={{ cursor: 'ew-resize', touchAction: 'none' }} />
          <rect x={xMini(range[0]) - 1} y={miniY - 2}
            width={2} height={miniH + 4}
            fill={C.red} pointerEvents="none" />
          {/* 우측 핸들 — 끝 인덱스 드래그 */}
          <rect x={xMini(range[1]) - 5} y={miniY - 3}
            width={10} height={miniH + 6}
            fill={C.red} fillOpacity={0.001}
            onMouseDown={startDrag('right')}
            onTouchStart={startDrag('right')}
            style={{ cursor: 'ew-resize', touchAction: 'none' }} />
          <rect x={xMini(range[1]) - 1} y={miniY - 2}
            width={2} height={miniH + 4}
            fill={C.red} pointerEvents="none" />
        </svg>
      </div>
      <div className="flex gap-3 mt-3 mb-3 items-start">
        <div aria-live="polite">
          D{range[0]} → D{range[1]} ({range[1] - range[0] + 1}일)
        </div>
        {reduced && <span style={{ color: C.inkFaint }}>
          ⚠ reduced-motion
        </span>}
        <div className="flex gap-1 ml-auto" role="group" aria-label="범위 조정">
          {[
            { label: '◀', fn: () => shift(-10), title: '왼쪽으로 10일' },
            { label: '▶', fn: () => shift(10), title: '오른쪽으로 10일' },
            { label: '＋', fn: () => zoom(10), title: '확대' },
            { label: '-', fn: () => zoom(-10), title: '축소' },
            { label: '◯', fn: () => setRange([0, longSeries.length - 1]), title: '전체' },
          ].map(({ label, fn, title }) => (
            <button key={title} onClick={fn} aria-label={title}
              style={{ border: `1px solid ${C.rule}`, color: C.inkSoft, background: 'transparent' }}
              {...focusable}>{label}</button>
          ))}
        </div>
      </div>
    </div>
  );
};

// ════════════════════════════════════════════════════════════
// #06 — Multi-line · 시리즈 토글 + 삼중코딩
// ════════════════════════════════════════════════════════════
const D06 = () => {
  const keys = ['A', 'B', 'C', 'D'];
  const [visible, setVisible] = useState({ A: true, B: true, C: true, D: true });
  const [activeIdx, setActiveIdx] = useState(null);

  const [containerRef, W] = useChartW(); const H = 220, m = { t: 12, r: 16, b: 28, l: 32 };
  const innerW = W - m.l - m.r, innerH = H - m.t - m.b;
  const maxV = d3.max(multiSeries, (d) => Math.max(...keys.map((k) => d[k])));
  const xStep = innerW / (multiSeries.length - 1);

  const onKey = (e) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      setActiveIdx((i) => i == null ? 0 : Math.min(multiSeries.length - 1, i + 1));
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      setActiveIdx((i) => i == null ? multiSeries.length - 1 : Math.max(0, i - 1));
    } else if (e.key === 'Escape') {
      e.preventDefault(); setActiveIdx(null);
    }
  };

  const visibleCount = Object.values(visible).filter(Boolean).length;
  const active = activeIdx != null ? multiSeries[activeIdx] : null;

  return (
    <div>
      <Usage mouse="범례 클릭 + 차트 호버" keyboard="Tab → ←→로 월 이동" />
      <div ref={containerRef} role="application" aria-label="제품별 매출 추이, 4개 시리즈"
        tabIndex={0} onKeyDown={onKey} onBlur={() => setActiveIdx(null)}
        style={{ position: 'relative' }} {...focusable}>
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: H, background: C.paper, border: `1px solid ${C.rule}` }}>
          {[0, 25, 50, 75].map((v) => (
            <line key={v} x1={m.l} x2={W - m.r}
              y1={H - m.b - (v / maxV) * innerH} y2={H - m.b - (v / maxV) * innerH}
              stroke={C.ruleSoft} />
          ))}
          {/* lines */}
          {keys.map((k, i) => visible[k] && (
            <path key={k}
              d={multiSeries.map((d, idx) => `${idx === 0 ? 'M' : 'L'}${m.l + idx * xStep},${H - m.b - (d[k] / maxV) * innerH}`).join(' ')}
              fill="none" stroke={SERIES[i]} strokeWidth={2}
              strokeDasharray={DASHES[i]} />
          ))}
          {/* hit-areas */}
          {multiSeries.map((d, i) => {
            const cx = m.l + i * xStep;
            const isActive = i === activeIdx;
            return (
              <g key={d.month}>
                <rect x={cx - xStep / 2} y={m.t} width={xStep} height={innerH}
                  fill="transparent"
                  onMouseEnter={() => setActiveIdx(i)}
                  onMouseLeave={() => setActiveIdx(null)}
                  style={{ cursor: 'pointer' }} />
                {isActive && (
                  <line x1={cx} x2={cx} y1={m.t} y2={H - m.b}
                    stroke={C.ink} strokeDasharray="2 2" />
                )}
                {isActive && keys.map((k, ki) => visible[k] && (
                  <g key={k}>
                    <circle cx={cx} cy={H - m.b - (d[k] / maxV) * innerH}
                      r={4} fill={SERIES[ki]} stroke={C.paper} strokeWidth={2} />
                  </g>
                ))}
                <text x={cx} y={H - 8} textAnchor="middle"
                  fontSize="10" fontFamily={'"Courier New", Courier, monospace'}
                  fill={isActive ? C.ink : C.inkSoft}
                  fontWeight={isActive ? 600 : 400}>{d.month}</text>
              </g>
            );
          })}
        </svg>
        {active && (
          <div className="absolute px-2.5 py-1.5 pointer-events-none"
            style={{
              background: C.ink, color: C.paper, fontSize: '12px', padding: '8px 12px', borderRadius: '4px', top: 8, right: 16,
              boxShadow: '3px 3px 0 rgba(0,0,0,0.08)',
            }}>
            <div style={{ color: 'rgba(251,248,241,0.8)', fontSize: '11px', letterSpacing: 0.04 }}>{active.month}</div>
            {keys.map((k, i) => visible[k] && (
              <div key={k} className="flex items-center gap-2">
                <span aria-hidden="true">{SHAPES[i]}</span>
                <span>제품 {k}</span>
                <span className="ml-auto tabular-nums" style={{ fontWeight: 600 }}>{active[k]}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="flex gap-3 mt-3 mb-3 items-start">
        <div aria-live="polite" style={srOnly}>
          {visibleCount}개 시리즈 표시 중
          {active && `, ${active.month}: ${keys.filter((k) => visible[k]).map((k) => `${k} ${active[k]}`).join(', ')}`}
        </div>
        <div role="group" aria-label="시리즈 토글" className="flex flex-wrap gap-3">
          {keys.map((k, i) => (
            <button key={k} aria-pressed={visible[k]}
              onClick={() => setVisible({ ...visible, [k]: !visible[k] })}
              style={{
                border: `1px solid ${SERIES[i]}`,
                color: visible[k] ? C.paper : SERIES[i],
                background: visible[k] ? SERIES[i] : 'transparent',
                opacity: visible[k] ? 1 : 0.7,
              }} {...focusable}>
              <span aria-hidden="true">{SHAPES[i]}</span>제품 {k}
            </button>
          ))}
        </div>      </div>
    </div>
  );
};

// ════════════════════════════════════════════════════════════
// #07 — Bar · 등장 애니메이션 + reduce-motion
// ════════════════════════════════════════════════════════════
const D07 = () => {
  const reduced = useReducedMotion();
  const [key, setKey] = useState(0);
  return (
    <div>
      <Usage mouse="REPLAY 클릭" keyboard="Tab → Enter" />
      <div role="region" aria-label="등장 애니메이션 데모"
        style={{ width: '100%', height: 220, background: C.paper }}>
        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
          <BarChart key={key} data={categoryData} margin={{ top: 8, right: 4, left: -16, bottom: 1 }}>
            <CartesianGrid stroke={C.ruleSoft} vertical={false} />
            <XAxis dataKey="name" tick={{ fill: C.inkSoft, fontSize: 10, fontFamily: '"Courier New", Courier, monospace' }}
              tickLine={false} axisLine={false} />
            <YAxis tick={{ fill: C.inkSoft, fontSize: 10, fontFamily: '"Courier New", Courier, monospace' }}
              tickLine={false} axisLine={false} />
            <Bar dataKey="value" fill={C.mustard}
              animationDuration={reduced ? 0 : 900} isAnimationActive={!reduced} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="flex gap-3 mt-3 mb-3 items-start">
        <div className="ml-auto">
          <button onClick={() => setKey((k) => k + 1)}
            style={{ border: `1px solid ${C.rule}`, color: C.inkSoft, background: 'transparent' }}
            {...focusable}>
            {reduced ? '🔄 RELOAD' : '▶ REPLAY'}
          </button>
          {reduced && (
            <span style={{ color: C.inkFaint }}>
              애니메이션 꺼짐 (시스템 설정 감지)
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

// ════════════════════════════════════════════════════════════
// #08 — Line · 실시간 스트리밍 + reduce-motion 기본 정지
// ════════════════════════════════════════════════════════════
const D08 = () => {
  const reduced = useReducedMotion();
  const [data, setData] = useState(() =>
    Array.from({ length: 30 }, (_, i) => ({ t: i, v: 50 + (Math.random() - 0.5) * 20 }))
  );
  const [running, setRunning] = useState(false);
  useEffect(() => { if (!reduced) setRunning(true); }, [reduced]);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setData((d) => {
        const last = d[d.length - 1];
        const next = Math.max(10, Math.min(90, last.v + (Math.random() - 0.5) * 8));
        return [...d.slice(1), { t: last.t + 1, v: +next.toFixed(1) }];
      });
    }, 800);
    return () => clearInterval(id);
  }, [running]);

  const curr = data[data.length - 1].v;

  return (
    <div>
      <Usage mouse="PAUSE/RESUME 클릭" keyboard="Tab → Space로 토글" />
      <div role="region" aria-label="실시간 스트리밍 차트"
        style={{ width: '100%', height: 200, background: C.paper }}>
        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
          <LineChart data={data} margin={{ top: 8, right: 12, left: -16, bottom: 1 }}>
            <CartesianGrid stroke={C.ruleSoft} vertical={false} />
            <XAxis dataKey="t" hide />
            <YAxis domain={[0, 100]} tick={{ fill: C.inkSoft, fontSize: 10, fontFamily: '"Courier New", Courier, monospace' }}
              tickLine={false} axisLine={false} />
            <Line type="monotone" dataKey="v" stroke={C.rose} strokeWidth={2}
              dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="flex gap-3 mt-3 mb-3 items-start">
        <span className="text-[12px]" style={{ color: C.inkSoft }}>
          현재 {curr.toFixed(1)}
        </span>
        {reduced && (
          <span style={{ color: C.inkFaint }}>
            ⚠ reduced-motion → 기본 정지
          </span>
        )}
        <div className="ml-auto">
          <button onClick={() => setRunning((r) => !r)} aria-pressed={running}
            style={{ border: `1px solid ${C.rule}`, color: C.inkSoft, background: 'transparent' }}
            {...focusable}>
            {running ? '■ PAUSE' : '▶ RESUME'}
          </button>
        </div>
      </div>
      {/* 라이브 영역은 폴링 빈도가 너무 높으면 SR가 못 따라가니, 폴라이트로만 */}
    </div>
  );
};

// ════════════════════════════════════════════════════════════
// #09 — Bar · 드래그 + 키보드 슬라이더 편집
// ════════════════════════════════════════════════════════════
const D09 = () => {
  const initial = [
    { label: 'Q1', value: 32 }, { label: 'Q2', value: 48 },
    { label: 'Q3', value: 41 }, { label: 'Q4', value: 56 },
  ];
  const [data, setData] = useState(initial);
  const [dragging, setDragging] = useState(null);
  const [focusIdx, setFocusIdx] = useState(null);
  const svgRef = useRef(null);

  const [containerRef, W] = useChartW(); const H = 240, m = { t: 16, r: 16, b: 32, l: 32 };
  const innerW = W - m.l - m.r, innerH = H - m.t - m.b;
  const barW = (innerW / data.length) * 0.55;
  const gap = (innerW / data.length) * 0.45;
  const maxV = 100;

  const yToValue = (yPx) => {
    const rel = (H - m.b - yPx) / innerH;
    return Math.round(Math.max(0, Math.min(maxV, rel * maxV)));
  };

  useEffect(() => {
    if (dragging == null) return;
    const pointerY = (e) => e.touches ? e.touches[0]?.clientY : e.clientY;
    const onMove = (e) => {
      const cy = pointerY(e);
      if (cy == null) return;
      if (e.cancelable) e.preventDefault();
      const r = svgRef.current.getBoundingClientRect();
      const y = ((cy - r.top) / r.height) * H;
      setData((d) => d.map((row, i) => i === dragging ? { ...row, value: yToValue(y) } : row));
    };
    const onUp = () => setDragging(null);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp, { once: true });
    window.addEventListener('touchmove', onMove, { passive: false });
    window.addEventListener('touchend', onUp, { once: true });
    window.addEventListener('touchcancel', onUp, { once: true });
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('touchmove', onMove);
    };
  }, [dragging]);

  const onKey = (e, i) => {
    let delta = 0;
    if (e.key === 'ArrowUp') delta = e.shiftKey ? 10 : 1;
    else if (e.key === 'ArrowDown') delta = e.shiftKey ? -10 : -1;
    else if (e.key === 'Home') {
      e.preventDefault();
      setData((d) => d.map((r, idx) => idx === i ? { ...r, value: 0 } : r)); return;
    }
    else if (e.key === 'End') {
      e.preventDefault();
      setData((d) => d.map((r, idx) => idx === i ? { ...r, value: maxV } : r)); return;
    }
    else return;
    e.preventDefault();
    setData((d) => d.map((row, idx) => idx === i
      ? { ...row, value: Math.max(0, Math.min(maxV, row.value + delta)) } : row));
  };

  return (
    <div>
      <Usage mouse="막대 상단 핸들 드래그"
        keyboard="Tab → ↑↓ (1), Shift+↑↓ (10), Home=0, End=100" />
      <div ref={containerRef} style={{ width: '100%' }}>
        <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`}
          style={{ width: '100%', height: H, userSelect: 'none', display: 'block', background: C.paper, border: `1px solid ${C.rule}` }}>
          {[0, 25, 50, 75, 100].map((v) => (
            <g key={v}>
              <line x1={m.l} x2={W - m.r}
                y1={H - m.b - (v / maxV) * innerH} y2={H - m.b - (v / maxV) * innerH}
                stroke={C.ruleSoft} />
              <text x={m.l - 6} y={H - m.b - (v / maxV) * innerH} textAnchor="end" dy="0.32em"
                fontSize="10" fontFamily={'"Courier New", Courier, monospace'} fill={C.inkSoft}>{v}</text>
            </g>
          ))}
          {data.map((d, i) => {
            const x = m.l + i * (barW + gap) + gap / 2;
            const h = (d.value / maxV) * innerH;
            const y = H - m.b - h;
            const isActive = dragging === i || focusIdx === i;
            return (
              <g key={d.label}
                tabIndex={0} role="slider"
                aria-label={`${d.label} 값`} aria-valuemin={0} aria-valuemax={maxV}
                aria-valuenow={d.value} aria-valuetext={`${d.value}점`}
                aria-orientation="vertical"
                onKeyDown={(e) => onKey(e, i)}
                onFocus={(e) => { setFocusIdx(i); focusable.onFocus(e); }}
                onBlur={(e) => { setFocusIdx(null); focusable.onBlur(e); }}>
                {isActive && (
                  <rect x={x - 4} y={y - 4} width={barW + 8} height={h + 8}
                    fill="none" stroke={C.focus} strokeWidth={2} strokeDasharray="3 3" />
                )}
                <rect x={x} y={y} width={barW} height={h}
                  fill={isActive ? C.red : C.navy} fillOpacity={isActive ? 1 : 0.85} />
                {/* 항상 보이는 핸들 — gestalt: 줄무늬 */}
                <rect x={x} y={y - 8} width={barW} height={6} fill={isActive ? C.red : C.ink} />
                <line x1={x + 4} x2={x + barW - 4} y1={y - 5} y2={y - 5}
                  stroke={C.paper} strokeWidth={0.5} />
                <line x1={x + 4} x2={x + barW - 4} y1={y - 3} y2={y - 3}
                  stroke={C.paper} strokeWidth={0.5} />
                <rect x={x - 2} y={y - 10} width={barW + 4} height={14} fill="transparent"
                  onMouseDown={(e) => { e.preventDefault(); setDragging(i); }}
                  onTouchStart={(e) => { e.preventDefault(); setDragging(i); }}
                  style={{ cursor: 'ns-resize', touchAction: 'none' }} />
                <text x={x + barW / 2} y={H - m.b + 16} textAnchor="middle"
                  fontSize="11" fontFamily={'"Courier New", Courier, monospace'}
                  fill={C.inkSoft}>{d.label}</text>
                <text x={x + barW / 2} y={y - 14} textAnchor="middle"
                  fontSize="11" fontFamily={'"Courier New", Courier, monospace'}
                  fill={isActive ? C.red : C.ink} fontWeight={isActive ? 600 : 500}>{d.value}</text>
              </g>
            );
          })}
        </svg>
      </div>
      <div className="flex gap-3 mt-3 mb-3 items-start">
        <span className="text-[12px]" style={{ color: C.inkSoft }}>
          드래그 또는 키보드로 값 조정
        </span>
        <div className="ml-auto">
          <button onClick={() => setData(initial)}
            style={{ border: `1px solid ${C.rule}`, color: C.inkSoft, background: 'transparent' }}
            {...focusable}>RESET</button>
        </div>
      </div>
    </div>
  );
};

// ════════════════════════════════════════════════════════════
// #10 — Bar · 타임 스크러버
// ════════════════════════════════════════════════════════════
const D10 = () => {
  const frames = useMemo(() =>
    Array.from({ length: 24 }, (_, h) => ({
      hour: h,
      data: ['A', 'B', 'C', 'D', 'E'].map((name, i) => ({
        name,
        value: Math.round(30 + 20 * Math.sin((h + i * 2) / 3) + 10 * Math.cos((h - i) / 4) + i * 3),
      })),
    })), []);
  const [hour, setHour] = useState(12);
  const current = frames[hour].data;

  const jump = (delta) => setHour((h) => Math.max(0, Math.min(23, h + delta)));

  return (
    <div>
      <Usage mouse="슬라이더 드래그" keyboard="Tab → ←→ (1시간), PgUp/PgDn (6시간)" />
      <div role="region" aria-label="24시간 데이터 스크러버"
        style={{ width: '100%', height: 200, background: C.paper }}>
        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
          <BarChart data={current} margin={{ top: 8, right: 4, left: -16, bottom: 0 }}>
            <CartesianGrid stroke={C.ruleSoft} vertical={false} />
            <XAxis dataKey="name" tick={{ fill: C.inkSoft, fontSize: 10, fontFamily: '"Courier New", Courier, monospace' }}
              tickLine={false} axisLine={{ stroke: C.rule }} />
            <YAxis domain={[0, 80]} tick={{ fill: C.inkSoft, fontSize: 10, fontFamily: '"Courier New", Courier, monospace' }}
              tickLine={false} axisLine={false} />
            <Bar dataKey="value" fill={C.olive} isAnimationActive={false} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="flex gap-3 mt-3 mb-3 items-start" style={{ paddingBottom: '1em' }}>
        <span className="text-[12px]" style={{ color: C.ink, minWidth: 56 }}>
          {hour.toString().padStart(2, '0')}:00
        </span>
        <input type="range" min="0" max="23" value={hour}
          onChange={(e) => setHour(+e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'PageUp') { e.preventDefault(); jump(6); }
            else if (e.key === 'PageDown') { e.preventDefault(); jump(-6); }
          }}
          aria-label="시간 선택"
          aria-valuetext={`${hour}시, ${current.map((d) => `${d.name} ${d.value}`).join(', ')}`}
          className="flex-1" style={{ accentColor: C.olive }} {...focusable} />
      </div>
      <div aria-live="polite" style={srOnly}>
        {hour}시 — {current.map((d) => `${d.name} ${d.value}`).join(', ')}
      </div>
    </div>
  );
};

// ════════════════════════════════════════════════════════════
// #11 — Bar · 키보드 탐색 (이미 a11y-first)
// ════════════════════════════════════════════════════════════
const D11 = () => {
  const [focusIdx, setFocusIdx] = useState(0);
  const [tableOpen, setTableOpen] = useState(false);
  const data = cityData9;
  const max = d3.max(data, (d) => d.value);
  const [containerRef, W] = useChartW(); const H = 220, m = { t: 28, r: 16, b: 36, l: 32 };
  const innerW = W - m.l - m.r, innerH = H - m.t - m.b;
  const barW = (innerW / data.length) * 0.7;
  const step = innerW / data.length;

  const onKey = (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault(); setFocusIdx((i) => Math.min(data.length - 1, i + 1));
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault(); setFocusIdx((i) => Math.max(0, i - 1));
    } else if (e.key === 'Home') { e.preventDefault(); setFocusIdx(0); }
    else if (e.key === 'End') { e.preventDefault(); setFocusIdx(data.length - 1); }
  };

  return (
    <div>
      <Usage mouse="막대 호버/클릭" keyboard="Tab → ←→ Home/End" />
      <div ref={containerRef} role="application"
        aria-label="도시별 점유율, 키보드로 탐색"
        tabIndex={0} onKeyDown={onKey}
        style={{ background: C.paper, border: `1px solid ${C.rule}`, padding: 12 }}
        {...focusable}>
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: H, display: 'block' }}>
          {[0, 25, 50].map((v) => (
            <line key={v} x1={m.l} x2={W - m.r}
              y1={H - m.b - (v / max) * innerH} y2={H - m.b - (v / max) * innerH}
              stroke={C.ruleSoft} />
          ))}
          {data.map((d, i) => {
            const x = m.l + i * step + (step - barW) / 2;
            const h = (d.value / max) * innerH;
            const y = H - m.b - h;
            const isF = i === focusIdx;
            return (
              <g key={d.name}
                onMouseEnter={() => setFocusIdx(i)}
                onClick={() => setFocusIdx(i)}
                style={{ cursor: 'pointer' }}>
                {isF && <rect x={x - 4} y={y - 4} width={barW + 8} height={h + 8}
                  fill="none" stroke={C.focus} strokeWidth={2.5} />}
                {/* 전체 막대 칸 hit-area — 막대가 짧아도 호버/클릭 가능 */}
                <rect x={x} y={m.t} width={barW} height={innerH} fill="transparent" />
                <rect x={x} y={y} width={barW} height={h}
                  fill={C.navy} fillOpacity={isF ? 1 : 0.45} />
                {isF && (
                  <text x={x + barW / 2} y={y - 8} textAnchor="middle"
                    fontSize="12" fontFamily={'"Courier New", Courier, monospace'}
                    fill={C.ink} fontWeight="700">{d.value}%</text>
                )}
                <text x={x + barW / 2} y={H - m.b + 16} textAnchor="middle"
                  fontSize="10" fontFamily={'"Courier New", Courier, monospace'}
                  fill={isF ? C.ink : C.inkSoft} fontWeight={isF ? 600 : 400}>{d.name}</text>
              </g>
            );
          })}
        </svg>
      </div>
      <div className="flex gap-3 mt-3 mb-3 items-start">
        <div aria-live="polite" style={{ color: C.ink }}>
          선택: {data[focusIdx].name}, {data[focusIdx].value}%
        </div>
        <button onClick={() => setTableOpen((v) => !v)} aria-expanded={tableOpen}
          aria-controls="d11-table"
          className="ml-auto"
          {...focusable}>
          {tableOpen ? '데이터 표 닫기' : `총 ${data.length}개`}
        </button>
      </div>
      {tableOpen && (
        <div id="d11-table">
          <table>
            <caption style={srOnly}>도시별 점유율</caption>
            <thead>
              <tr>
                <th scope="col">도시</th>
                <th scope="col">점유율</th>
              </tr>
            </thead>
            <tbody>
              {data.map((d) => (
                <tr key={d.name}>
                  <td>{d.name}</td>
                  <td>{d.value}%</td>
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
// #12 — Scatter · Voronoi hover + 키보드 탐색
// ════════════════════════════════════════════════════════════
const D12 = () => {
  const ref = useRef(null);
  const [active, setActive] = useState(null);
  const [focusId, setFocusId] = useState(null);

  const [containerRef, W] = useChartW(); const H = 260, m = { t: 12, r: 12, b: 28, l: 32 };

  useEffect(() => {
    const x = d3.scaleLinear().domain([0, 100]).range([m.l, W - m.r]);
    const y = d3.scaleLinear().domain([0, 100]).range([H - m.b, m.t]);
    d3.select(ref.current).selectAll('svg').remove();
    const svg = d3.select(ref.current).append('svg')
      .attr('viewBox', `0 0 ${W} ${H}`)
      .style('width', '100%').style('height', 'auto');

    svg.append('g').selectAll('line').data(y.ticks(5)).join('line')
      .attr('x1', m.l).attr('x2', W - m.r)
      .attr('y1', (d) => y(d)).attr('y2', (d) => y(d))
      .attr('stroke', C.ruleSoft);

    svg.append('g').attr('transform', `translate(0,${H - m.b})`)
      .call(d3.axisBottom(x).ticks(5).tickSize(0).tickPadding(8))
      .call((g) => g.select('.domain').attr('stroke', C.rule))
      .call((g) => g.selectAll('text').attr('fill', C.inkSoft)
        .attr('font-family', '"Courier New", Courier, monospace').attr('font-size', 10));

    svg.append('g').attr('transform', `translate(${m.l},0)`)
      .call(d3.axisLeft(y).ticks(5).tickSize(0).tickPadding(8))
      .call((g) => g.select('.domain').remove())
      .call((g) => g.selectAll('text').attr('fill', C.inkSoft)
        .attr('font-family', '"Courier New", Courier, monospace').attr('font-size', 10));

    const dots = svg.append('g').selectAll('circle').data(scatterData).join('circle')
      .attr('cx', (d) => x(d.x)).attr('cy', (d) => y(d.y))
      .attr('r', 3).attr('fill', C.teal).attr('fill-opacity', 0.55);

    const delaunay = d3.Delaunay.from(scatterData, (d) => x(d.x), (d) => y(d.y));
    const voronoi = delaunay.voronoi([m.l, m.t, W - m.r, H - m.b]);
    svg.append('g').selectAll('path').data(scatterData).join('path')
      .attr('d', (_, i) => voronoi.renderCell(i))
      .attr('fill', 'transparent').style('cursor', 'crosshair')
      .on('mouseenter', (_, d) => setActive(d))
      .on('mouseleave', () => setActive(null));
  }, [W]);

  // 키보드 탐색: focusId → 강조
  useEffect(() => {
    const x = d3.scaleLinear().domain([0, 100]).range([m.l, W - m.r]);
    const y = d3.scaleLinear().domain([0, 100]).range([H - m.b, m.t]);
    const svg = d3.select(ref.current).select('svg');
    const fOrA = active?.id ?? focusId;
    svg.selectAll('circle')
      .attr('r', (d) => d.id === fOrA ? 6 : 3)
      .attr('fill', (d) => d.id === fOrA ? C.red : C.teal)
      .attr('fill-opacity', (d) => d.id === fOrA ? 1 : 0.55);
    // 포커스 링 그리기
    svg.selectAll('.focus-ring').remove();
    if (focusId != null && !active) {
      const p = scatterData.find((s) => s.id === focusId);
      svg.append('circle').attr('class', 'focus-ring')
        .attr('cx', x(p.x)).attr('cy', y(p.y)).attr('r', 10)
        .attr('fill', 'none').attr('stroke', C.focus).attr('stroke-width', 2)
        .attr('stroke-dasharray', '2 2');
    }
  }, [active, focusId]);

  const onKey = (e) => {
    if (focusId == null && e.key.startsWith('Arrow')) {
      e.preventDefault();
      setFocusId(scatterData[0].id); return;
    }
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault();
      const sorted = [...scatterData].sort((a, b) => a.x - b.x);
      const cur = sorted.findIndex((p) => p.id === focusId);
      const next = e.key === 'ArrowRight'
        ? Math.min(sorted.length - 1, cur + 1) : Math.max(0, cur - 1);
      setFocusId(sorted[next].id);
    } else if (e.key === 'Escape') {
      e.preventDefault(); setFocusId(null);
    }
  };

  const tip = active || (focusId != null && scatterData.find((p) => p.id === focusId));

  return (
    <div>
      <Usage mouse="화면 어디든 호버 (가장 가까운 점)"
        keyboard="Tab → ←→ X순 이동, Esc 해제" />
      <div ref={containerRef} role="application" aria-label="40개 점 산점도, Voronoi 호버"
        tabIndex={0} onKeyDown={onKey} onBlur={() => setFocusId(null)}
        style={{ position: 'relative' }} {...focusable}>
        <div ref={ref} style={{ width: '100%', background: C.paper }} />
        {tip && (
          <div className="absolute top-2 right-2 px-2 py-1 pointer-events-none"
            style={{ background: C.ink, color: C.paper }}>
            {tip.label} · ({tip.x}, {tip.y})
          </div>
        )}
      </div>
      <div aria-live="polite" style={srOnly}>
        {tip ? `${tip.label}, X ${tip.x}, Y ${tip.y}` : ''}
      </div>
    </div>
  );
};

// ════════════════════════════════════════════════════════════
// #13 — Linked Tooltip · 두 차트 동기화 (hover-or-focus 통합)
// ════════════════════════════════════════════════════════════
const D13 = () => {
  const [activeIdx, setActiveIdx] = useState(null);
  const [containerRef, W] = useChartW(); const H = 130, m = { t: 12, r: 16, b: 28, l: 36 };
  const innerW = W - m.l - m.r, innerH = H - m.t - m.b;
  const xStep = innerW / (months6.length - 1);

  const onKey = (e) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      setActiveIdx((i) => i == null ? 0 : Math.min(months6.length - 1, i + 1));
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      setActiveIdx((i) => i == null ? months6.length - 1 : Math.max(0, i - 1));
    } else if (e.key === 'Home') { e.preventDefault(); setActiveIdx(0); }
    else if (e.key === 'End') { e.preventDefault(); setActiveIdx(months6.length - 1); }
    else if (e.key === 'Escape') { e.preventDefault(); setActiveIdx(null); }
  };

  const Chart = ({ data, color, label, dash, maxV }) => (
    <div className="mb-1">
      <div style={{ fontSize: '12px', fontWeight: 700, letterSpacing: 0, marginBottom: '6px', color: C.inkSoft }}>
        {label}
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: H, display: 'block', background: C.paper, border: `1px solid ${C.rule}` }}>
        <line x1={m.l} x2={W - m.r} y1={H - m.b} y2={H - m.b} stroke={C.rule} />
        <path d={data.map((d, i) => `${i === 0 ? 'M' : 'L'}${m.l + i * xStep},${H - m.b - (d.value / maxV) * innerH}`).join(' ')}
          fill="none" stroke={color} strokeWidth={2} strokeDasharray={dash} />
        {data.map((d, i) => {
          const cx = m.l + i * xStep;
          const cy = H - m.b - (d.value / maxV) * innerH;
          const isA = i === activeIdx;
          return (
            <g key={d.month}>
              <rect x={cx - xStep / 2} y={m.t} width={xStep} height={innerH} fill="transparent"
                onMouseEnter={() => setActiveIdx(i)}
                onMouseLeave={() => setActiveIdx(null)}
                style={{ cursor: 'pointer' }} />
              {isA && <line x1={cx} x2={cx} y1={m.t} y2={H - m.b}
                stroke={C.ink} strokeDasharray="2 2" />}
              <circle cx={cx} cy={cy} r={isA ? 5 : 3}
                fill={isA ? color : C.paper} stroke={color} strokeWidth={2} />
              <text x={cx} y={H - 8} textAnchor="middle" fontSize="9"
                fontFamily={'"Courier New", Courier, monospace'}
                fill={isA ? C.ink : C.inkSoft}
                fontWeight={isA ? 600 : 400}>{d.month}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );

  const maxA = d3.max(seriesA, (d) => d.value);
  const maxB = d3.max(seriesB, (d) => d.value);
  const active = activeIdx != null ? {
    month: months6[activeIdx], a: seriesA[activeIdx].value, b: seriesB[activeIdx].value,
  } : null;

  return (
    <div>
      <Usage mouse="한 차트에 호버 → 두 차트 모두 강조"
        keyboard="Tab → ←→ Home/End, Esc 해제" />
      <div ref={containerRef} role="application"
        aria-label="서비스 A와 B 비교, 6개월간 가입자 추이"
        aria-describedby="d13-status" tabIndex={0} onKeyDown={onKey}
        onBlur={() => setActiveIdx(null)} style={{ position: 'relative' }}
        {...focusable}>
        <Chart data={seriesA} color={C.red} label="서비스 A" maxV={maxA} />
        <Chart data={seriesB} color={C.navy} label="서비스 B" dash="6 3" maxV={maxB} />
        {active && (
          <div className="absolute px-3 py-2 pointer-events-none"
            style={{
              background: C.ink, color: C.paper, fontSize: '12px', padding: '8px 12px', borderRadius: '4px', top: 4, right: 16,
              boxShadow: '3px 3px 0 rgba(0,0,0,0.08)',
            }}>
            <div style={{ color: 'rgba(251,248,241,0.8)', fontSize: '11px', letterSpacing: 0.04 }}>{active.month}</div>
            <div className="flex items-center gap-2">
              <span style={{ background: C.red, width: 8, height: 8 }} aria-hidden="true" />
              A <span className="ml-auto tabular-nums">{active.a}</span>
            </div>
            <div className="flex items-center gap-2">
              <span style={{
                background: 'none', borderTop: `2px dashed ${C.paper}`,
                width: 8, height: 0,
              }} aria-hidden="true" />
              B <span className="ml-auto tabular-nums">{active.b}</span>
            </div>
          </div>
        )}
      </div>
      <div className="flex gap-3 mt-3 mb-3 items-start">
        <div id="d13-status" aria-live="polite"
          style={{ color: active ? C.ink : C.inkFaint }}>
          {active ? `${active.month} — A ${active.a}명, B ${active.b}명`
            : '월을 선택하면 두 서비스가 함께 표시됩니다'}
        </div>
      </div>
    </div>
  );
};

// ════════════════════════════════════════════════════════════
// #14 — Bar · 표시 모드 토글
// ════════════════════════════════════════════════════════════
const D14 = () => {
  const [mode, setMode] = useState('stacked');
  const [tableOpen, setTableOpen] = useState(false);
  const reduced = useReducedMotion();
  const data = useMemo(() => {
    if (mode === 'normalized') {
      return stackedData.map((d) => {
        const total = products.reduce((s, p) => s + d[p], 0);
        const out = { month: d.month };
        products.forEach((p) => { out[p] = +((d[p] / total) * 100).toFixed(1); });
        return out;
      });
    }
    return stackedData;
  }, [mode]);

  // #06 스타일 툴팁 — SHAPES 글리프 + 색 이중코딩
  const D14Tooltip = ({ active: tipActive, payload, label }) => {
    if (!tipActive || !payload || !payload.length) return null;
    return (
      <div style={{
        background: C.ink, color: C.paper, padding: '8px 12px',
        boxShadow: '3px 3px 0 rgba(0,0,0,0.08)', fontSize: 12,
      }}>
        <div style={{ color: 'rgba(251,248,241,0.8)', fontSize: 11, marginBottom: 4 }}>{label}</div>
        {payload.map((p) => {
          const i = products.indexOf(p.dataKey);
          return (
            <div key={p.dataKey} className="flex items-center gap-2">
              <span aria-hidden="true" style={{ color: SERIES[i] }}>{SHAPES[i]}</span>
              <span>{p.dataKey}</span>
              <span className="ml-auto tabular-nums" style={{ fontWeight: 600 }}>
                {p.value}{mode === 'normalized' ? '%' : ''}
              </span>
            </div>
          );
        })}
      </div>
    );
  };
  return (
    <div role="region" aria-label="제품별 매출, 표시 방식 전환">
      <Usage mouse="라디오 버튼 클릭" keyboard="Tab → ↑↓ 또는 ←→로 모드 변경" />
      <div role="group" aria-label="표시 방식" className="flex gap-3 mb-3">
        {[{ v: 'stacked', l: '누적' }, { v: 'grouped', l: '그룹' }, { v: 'normalized', l: '100%' }].map(({ v, l }) => (
          <button key={v}
            onClick={() => setMode(v)}
            aria-pressed={mode === v}
            style={{
              gap: 0,
              background: mode === v ? C.ink : 'transparent',
              color: mode === v ? C.paper : C.inkSoft,
              border: `1px solid ${mode === v ? C.ink : C.rule}`,
            }} {...focusable}>
            <span aria-hidden="true"></span>{l}
          </button>
        ))}
      </div>
      <div style={{ width: '100%', height: 200 }}>
        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
          <BarChart data={data} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
            <defs>
              {/* 색 외 패턴 이중코딩 — 색맹 대응. 각 시리즈에 다른 stripe/dot 패턴 */}
              {SERIES.slice(0, products.length).map((color, i) => (
                <pattern key={i} id={`d14-pat-${i}`}
                  patternUnits="userSpaceOnUse" width="6" height="6"
                  patternTransform={`rotate(${i * 30})`}>
                  <rect width="6" height="6" fill={color} />
                  {i % 3 === 1 && <line x1="0" y1="0" x2="0" y2="6" stroke={C.paper} strokeWidth="1.2" strokeOpacity="0.4" />}
                  {i % 3 === 2 && <circle cx="3" cy="3" r="1.2" fill={C.paper} fillOpacity="0.5" />}
                </pattern>
              ))}
            </defs>
            <CartesianGrid stroke={C.ruleSoft} vertical={false} />
            <XAxis dataKey="month" tick={{ fill: C.inkSoft, fontSize: 12, fontFamily: '"Courier New", Courier, monospace' }}
              tickLine={false} axisLine={{ stroke: C.rule }} />
            <YAxis tick={{ fill: C.inkSoft, fontSize: 12, fontFamily: '"Courier New", Courier, monospace' }}
              tickLine={false} axisLine={false} unit={mode === 'normalized' ? '%' : ''} />
            <Tooltip content={<D14Tooltip />} cursor={{ fill: C.rule, fillOpacity: 0.3 }} />
            {products.map((p, i) => (
              <Bar key={p} dataKey={p}
                stackId={mode === 'grouped' ? undefined : 'a'}
                fill={`url(#d14-pat-${i})`} isAnimationActive={!reduced} animationDuration={reduced ? 0 : 350} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="flex gap-3 mt-3 mb-3 items-start">
        <div className="flex flex-wrap gap-2" style={{ fontSize: 12 }}>
          {products.map((p, i) => (
            <span key={p} className="flex items-center gap-1" style={{ color: C.inkSoft }}>
              <span style={{ color: SERIES[i], fontSize: 13 }} aria-hidden="true">{SHAPES[i]}</span>{p}
            </span>
          ))}
        </div>
        <button onClick={() => setTableOpen((v) => !v)} aria-expanded={tableOpen}
          aria-controls="d14-table"
          className="ml-auto"
          {...focusable}>
          {tableOpen ? '데이터 표 닫기' : (mode === 'normalized' ? '비율(%)' : '절대값')}
        </button>
      </div>
      {tableOpen && (
        <div id="d14-table" className="text-[12px]">
          <table>
            <caption style={srOnly}>제품별 월 매출</caption>
            <thead>
              <tr>
                <th scope="col">월</th>
                {products.map((p) => <th key={p} scope="col">{p}</th>)}
              </tr>
            </thead>
            <tbody>
              {data.map((d) => (
                <tr key={d.month}>
                  <td>{d.month}</td>
                  {products.map((p) => <td key={p}>{d[p]}</td>)}
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
// #15 — Bar · 드릴다운
// ════════════════════════════════════════════════════════════
const D15 = () => {
  const [containerRef, W] = useChartW();
  const H = 200;
  const [path, setPath] = useState([]);
  const [focusIdx, setFocusIdx] = useState(null);
  const current = path.length === 0 ? drillData.root : drillData[path[0]];
  const total = current.reduce((s, d) => s + d.value, 0);
  const max = d3.max(current, (d) => d.value);
  const isRoot = path.length === 0;

  useEffect(() => { setFocusIdx(null); }, [path.length]);

  useEffect(() => {
    const onK = (e) => {
      if (e.key === 'Escape' && !isRoot) { e.preventDefault(); setPath([]); }
    };
    window.addEventListener('keydown', onK);
    return () => window.removeEventListener('keydown', onK);
  }, [isRoot]);

  const onKey = (e) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      setFocusIdx((i) => i == null ? 0 : Math.min(current.length - 1, i + 1));
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      setFocusIdx((i) => i == null ? current.length - 1 : Math.max(0, i - 1));
    } else if ((e.key === 'Enter' || e.key === ' ') && isRoot && focusIdx != null) {
      e.preventDefault(); setPath([current[focusIdx].name]);
    } else if (e.key === 'Backspace' && !isRoot) {
      e.preventDefault(); setPath([]);
    }
  };

  return (
    <div>
      <Usage mouse="막대 클릭 → 진입, 전체 클릭 → 복귀"
        keyboard="Tab → ←→ Enter, Esc/Backspace 복귀" />
      <nav aria-label="드릴다운 경로" className="flex items-center gap-1 mb-2" style={{ fontSize: 12, minHeight: 18, lineHeight: '18px' }}>
        <button onClick={() => setPath([])}
          aria-current={isRoot ? 'page' : undefined}
          className="tracking-wide"
          style={{
            color: isRoot ? C.ink : C.focus,
            textDecoration: isRoot ? 'none' : 'underline',
            background: 'none', border: 'none', padding: 0,
            cursor: isRoot ? 'default' : 'pointer',
            fontSize: 12,
          }} {...focusable}>전체</button>
        {path.map((p) => (
          <React.Fragment key={p}>
            <span style={{ color: C.inkFaint }}>/</span>
            <span style={{ color: C.ink }} aria-current="page">{p}</span>
          </React.Fragment>
        ))}
        {!isRoot && (
          <span className="ml-auto" style={{ color: C.inkFaint }}>ESC ← 돌아가기</span>
        )}
      </nav>
      <div ref={containerRef} role="application"
        aria-label={`${isRoot ? '카테고리별' : path[0] + ' 하위'} 매출`}
        tabIndex={0} onKeyDown={onKey} {...focusable}>
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: H, background: C.paper, border: `1px solid ${C.rule}` }}>
          {[0, 50, 100].map((p) => {
            const v = (max * p) / 100;
            const y = 175 - (v / max) * 140;
            return <line key={p} x1={28} x2={W - 8} y1={y} y2={y} stroke={C.ruleSoft} />;
          })}
          {current.map((d, i) => {
            const barW = (W - 28 - 12) / current.length;
            const x = 28 + i * barW + barW * 0.15;
            const w = barW * 0.7;
            const h = (d.value / max) * 140;
            const y = 175 - h;
            const isF = focusIdx === i;
            return (
              <g key={d.name}
                onClick={() => isRoot && setPath([d.name])}
                style={{ cursor: isRoot ? 'pointer' : 'default' }}>
                {isF && <rect x={x - 4} y={y - 4} width={w + 8} height={h + 8}
                  fill="none" stroke={C.focus} strokeWidth={2} strokeDasharray="3 3" />}
                <rect x={x} y={y} width={w} height={h}
                  fill={d.color || C.olive} fillOpacity={isF || focusIdx == null ? 1 : 0.7} />
                <text x={x + w / 2} y={193} textAnchor="middle" fontSize="10"
                  fontFamily={'"Courier New", Courier, monospace'}
                  fill={isF ? C.ink : C.inkSoft}
                  fontWeight={isF ? 600 : 400}>{d.name}</text>
                <text x={x + w / 2} y={y - 4} textAnchor="middle" fontSize="11"
                  fontFamily={'"Courier New", Courier, monospace'}
                  fill={C.ink} fontWeight={isF ? 700 : 500}>{d.value}</text>
              </g>
            );
          })}
        </svg>
      </div>
      <div className="flex gap-3 mt-3 mb-3 items-start">
        <div aria-live="polite" style={{ color: C.inkFaint }}>
          {isRoot
            ? `전체 — ${current.length}개 카테고리, 합 ${total}${focusIdx != null ? ` (포커스: ${current[focusIdx]?.name})` : ''}`
            : `${path[0]} — ${current.length}개 항목, 합 ${total}`}
        </div>
      </div>
    </div>
  );
};

// ════════════════════════════════════════════════════════════
// #16 — Bar · 검색 강조
// ════════════════════════════════════════════════════════════
const D16 = () => {
  const [containerRef, W] = useChartW();
  const H = 200;
  const [q, setQ] = useState('');
  const max = d3.max(cityData9, (d) => d.value);
  const matches = useMemo(() => {
    if (!q.trim()) return cityData9.map((d) => d.name);
    return cityData9.filter((d) => d.name.includes(q.trim())).map((d) => d.name);
  }, [q]);
  const matchCount = q.trim() ? matches.length : null;

  return (
    <div role="search" aria-label="도시 검색">
      <Usage mouse="검색창 입력" keyboard="Tab → 텍스트 입력" />
      <label className="block">
        <span style={srOnly}>도시명 검색</span>
        <input type="search" value={q} onChange={(e) => setQ(e.target.value)}
          placeholder="🔍 도시명 검색 (예: 서)"
          className="w-full font-mono text-[12px] px-3 py-2"
          style={{ border: `1px solid ${C.rule}`, background: 'transparent', color: C.ink }}
          aria-describedby="d16-result" {...focusable} />
      </label>
      <div id="d16-result" aria-live="polite" aria-atomic="true"
        className="mb-2 mt-1"
        style={{ color: matchCount === 0 ? C.red : C.inkSoft }}>
        {matchCount === null ? `전체 ${cityData9.length}개 도시 · 검색어를 입력해보세요`
          : matchCount === 0 ? '결과 없음'
            : `${matchCount}개 결과: ${matches.join(', ')}`}
      </div>
      <div ref={containerRef}>
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: H, background: C.paper, border: `1px solid ${C.rule}` }} role="img"
          aria-label="9개 도시 막대 차트, 검색어 일치 항목 강조">
          {cityData9.map((d, i) => {
            const barW = (W - 28 - 12) / cityData9.length;
            const x = 28 + i * barW + barW * 0.15;
            const w = barW * 0.7;
            const h = (d.value / max) * 160;
            const y = 175 - h;
            const isM = matches.includes(d.name);
            return (
              <g key={d.name}>
                <rect x={x} y={y} width={w} height={h}
                  fill={isM ? C.mustard : C.rule}
                  fillOpacity={isM ? 1 : 0.45}
                  stroke={isM && q.trim() ? C.ink : 'none'} strokeWidth={1} />
                {isM && q.trim() && (
                  <text x={x + w / 2} y={y - 4} textAnchor="middle" fontSize="10"
                    fontFamily={'"Courier New", Courier, monospace'} fill={C.ink} fontWeight="600">{d.value}</text>
                )}
                <text x={x + w / 2} y={193} textAnchor="middle" fontSize="10"
                  fontFamily={'"Courier New", Courier, monospace'}
                  fill={isM ? C.ink : C.inkFaint}
                  fontWeight={isM && q.trim() ? 600 : 400}>{d.name}</text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};

// ════════════════════════════════════════════════════════════
// #17 — Compare slider · Before/After
// ════════════════════════════════════════════════════════════
const D17 = () => {
  const [split, setSplit] = useState(50);
  const [containerRef, W] = useChartW(); const H = 240, m = { t: 16, r: 16, b: 32, l: 36 };
  const innerW = W - m.l - m.r, innerH = H - m.t - m.b;
  const max = d3.max(compareData, (d) => Math.max(d['2024'], d['2025']));
  const xStep = innerW / (compareData.length - 1);
  const splitX = m.l + (split / 100) * innerW;
  const path = (k) => compareData.map((d, i) =>
    `${i === 0 ? 'M' : 'L'}${m.l + i * xStep},${H - m.b - (d[k] / max) * innerH}`
  ).join(' ');

  return (
    <div>
      <Usage mouse="슬라이더 드래그" keyboard="Tab → ←→ 또는 Home/End" />
      <div ref={containerRef} role="img"
        aria-label={`2024와 2025 매출 비교, 분할선 ${split}% 지점`}>
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: H, background: C.paper, border: `1px solid ${C.rule}` }}>
          <defs>
            <clipPath id="d17L"><rect x={0} y={0} width={splitX} height={H} /></clipPath>
            <clipPath id="d17R"><rect x={splitX} y={0} width={W - splitX} height={H} /></clipPath>
          </defs>
          {[0, 25, 50, 75].map((v) => (
            <line key={v} x1={m.l} x2={W - m.r}
              y1={H - m.b - (v / max) * innerH} y2={H - m.b - (v / max) * innerH}
              stroke={C.ruleSoft} />
          ))}
          <path d={path('2024')} fill="none" stroke={C.inkSoft} strokeWidth={2}
            strokeDasharray="4 3" clipPath="url(#d17L)" />
          <path d={path('2025')} fill="none" stroke={C.red} strokeWidth={2.5}
            clipPath="url(#d17R)" />
          <line x1={splitX} x2={splitX} y1={m.t} y2={H - m.b}
            stroke={C.ink} strokeWidth={1.5} />
          <circle cx={splitX} cy={m.t + 10} r={8} fill={C.ink} />
          <text x={splitX} y={m.t + 14} textAnchor="middle" fontSize="9"
            fill={C.paper} fontFamily={'"Courier New", Courier, monospace'}>◄►</text>
          {compareData.map((d, i) => (
            <text key={d.month} x={m.l + i * xStep} y={H - 8} textAnchor="middle"
              fontSize="10" fontFamily={'"Courier New", Courier, monospace'} fill={C.inkSoft}>{d.month}</text>
          ))}
          {/* 2024 label */}
          <text x={m.l + 4} y={m.t + 12} fontSize="10" fontFamily={'"Courier New", Courier, monospace'}
            fill={C.inkSoft}>2024 ┅</text>
          {/* 2025 label */}
          <text x={W - m.r - 4} y={m.t + 12} fontSize="10" fontFamily={'"Courier New", Courier, monospace'}
            fill={C.red} textAnchor="end">━ 2025</text>
        </svg>
      </div>
      <label className="block mt-3">
        <span style={srOnly}>분할선 위치</span>
        <input type="range" min="0" max="100" step="1" value={split}
          onChange={(e) => setSplit(+e.target.value)} className="w-full"
          style={{ accentColor: C.red }}
          aria-valuetext={`${split}% 지점, 왼쪽 2024년 점선, 오른쪽 2025년 실선`}
          {...focusable} />
      </label>
      <div className="flex gap-3 mb-4 items-start" style={{ fontSize: 12 }}>
        <span style={{ color: C.inkSoft }}>◀ 2024 (점선)</span>
        <span className="ml-auto" style={{ color: C.red }}>2025 (실선) ▶</span>
      </div>
    </div>
  );
};

// ════════════════════════════════════════════════════════════
// 메타 정보 — 각 데모의 인터랙션·접근성 고려사항
// ════════════════════════════════════════════════════════════
const META = {
  1: {
    title: 'Line · 커스텀 툴팁',
    method: 'hover-or-focus 통합 · crosshair · 실선/점선',
    interactions: [
      'X축 마우스 호버로 두 시리즈 값 동시 확인',
      'crosshair(점선 세로선)로 정확한 위치 안내',
      'hit-area를 점이 아닌 X-step 폭으로 확장',
      '활성 시 점 크기 증가 + 색 채움 (시각 임팩트)',
      '툴팁은 오른쪽 상단 고정 위치 — 차트를 가리지 않음',
    ],
    a11y: [
      'tabIndex로 차트 진입 가능 (WCAG 2.1.1)',
      '←→ Home/End/Esc 키보드 탐색',
      'hover와 focus가 같은 activeIdx state 공유 (WCAG 1.4.13)',
      '실선/점선 이중코딩 — 색맹 사용자도 시리즈 구분 가능',
      'aria-live로 활성 데이터를 음성 안내',
      '데이터 표 fallback (▤ 토글)',
    ],
  },
  2: {
    title: 'Bar · 클릭 선택',
    method: '클릭 + 키보드 탐색 · 토글 동작 · dim',
    interactions: [
      '막대 클릭으로 선택, 다시 클릭 시 해제',
      '선택되지 않은 막대는 18% 투명도로 dim',
      '선택된 막대는 검은 테두리로 추가 강조',
      '값 라벨은 선택/포커스 시에만 노출',
    ],
    a11y: [
      '컨테이너에 role="application" + tabIndex',
      '←→로 막대 간 이동, Enter/Space로 선택, Esc로 해제',
      '포커스된 막대에 점선 outline (선택 상태와 구분)',
      'aria-live로 선택/포커스 상태 음성 안내',
      'dim은 색만이 아닌 투명도 + 테두리 유무로 이중 표현',
    ],
  },
  3: {
    title: 'Donut · 호버 강조',
    method: 'hover-or-focus + 칩 클릭 + 모양 이중코딩',
    interactions: [
      '슬라이스 호버 시 해당만 100% 채움, 나머지 32%',
      '중앙 라벨이 활성 슬라이스에 맞춰 동적 변경',
      '활성 슬라이스 안쪽/바깥쪽에 파란 outline arc',
      '하단 칩으로도 같은 토글 가능 — 모바일·터치 친화',
    ],
    a11y: [
      'Tab 진입 + ←→↑↓로 슬라이스 순환',
      '칩에 aria-pressed로 토글 상태 시맨틱 표현',
      '슬라이스마다 모양 글리프(●■▲◆) 중앙 배치',
      '칩에는 색·모양·값을 모두 표기 (삼중 코딩)',
      'aria-live로 활성 항목 음성 안내',
    ],
  },
  4: {
    title: 'Scatter · 영역 선택',
    method: '드래그 brush + 키보드 + 체크박스 표 (3중 입력)',
    interactions: [
      '드래그로 영역 brush 선택 (가장 익숙한 방식)',
      '개별 점 클릭으로도 토글 — 드래그 어려운 환경 대안',
      '선택 점은 빨간색 + 검은 테두리 + 크기 1.5배',
      '호버/포커스 시 점 위에 라벨 툴팁',
      '하단에 선택 카운터 + 전체/해제 버튼',
    ],
    a11y: [
      'WCAG 2.5.7 (드래그 동작) — 드래그 외 두 가지 대안',
      'Tab → ←→로 X축 순서대로 점 이동, Space로 토글',
      'Ctrl+A 전체 선택, Esc 전체 해제',
      'details/summary로 체크박스 표 — 정밀 운동 어려운 사용자',
      'aria-live로 선택 개수 + 포커스 위치 안내',
      'aria-describedby로 차트와 상태 텍스트 연결',
    ],
  },
  5: {
    title: 'Area · 브러시 줌',
    method: '미니맵 brush + 키보드 컨트롤 버튼 + reduced-motion',
    interactions: [
      '하단 미니맵에서 빨간 영역 = 현재 표시 범위',
      '컨트롤 버튼으로 좌/우 이동, 확대/축소, 전체보기',
      '범위 변경 시 메인 영역이 즉시 재계산',
      '미니맵 자체에도 전체 시계열을 얇게 표시',
    ],
    a11y: [
      '버튼마다 aria-label로 동작 설명 ("왼쪽으로 10일")',
      '버튼 크기 36×36 (터치 친화)',
      'aria-live로 표시 범위 음성 안내',
      'prefers-reduced-motion 감지 → 페이드 인 끔',
      '드래그가 아니어도 모든 기능 조작 가능',
    ],
  },
  6: {
    title: 'Multi-line · 시리즈 토글',
    method: 'aria-pressed + 색·모양·실선/점선 삼중코딩',
    interactions: [
      '범례 클릭으로 4개 시리즈 개별 on/off',
      '비활성 시리즈는 chart에서 즉시 제거',
      '차트 호버 시 활성 시리즈의 같은 X 값 모두 표시',
      '통합 툴팁에 모든 활성 시리즈 값을 한 번에',
    ],
    a11y: [
      '범례 버튼에 aria-pressed로 토글 시맨틱',
      '색 + 모양(●■▲◆) + 대시패턴 — 삼중 이중코딩',
      'Tab → ←→로 X 이동, Esc 해제',
      'hover와 focus가 통합 state 공유',
      'aria-live로 활성 시리즈 수와 현재 값 안내',
    ],
  },
  7: {
    title: 'Bar · 등장 애니메이션',
    method: 'replay 버튼 · prefers-reduced-motion 가드',
    interactions: [
      '컴포넌트 key 변경으로 mount 애니메이션 재실행',
      '0.9초 동안 막대가 아래에서 위로 자라남',
      '값 라벨도 함께 페이드 인',
    ],
    a11y: [
      'prefers-reduced-motion 감지 시 애니메이션 0초',
      '버튼 라벨이 모션 상태에 따라 변경 (▶ REPLAY ↔ 🔄 RELOAD)',
      '모션 꺼졌음을 사용자에게 텍스트로 명시',
      '애니메이션 자체가 핵심 정보가 아님 — 결과는 정적 상태로도 완전',
    ],
  },
  8: {
    title: 'Line · 실시간 스트리밍',
    method: 'setInterval · PAUSE/RESUME · reduced-motion 기본 정지',
    interactions: [
      '800ms마다 새 데이터 push, 오래된 데이터 shift',
      'PAUSE/RESUME으로 스트리밍 제어',
      '현재 값을 카운터로 동시 표시',
    ],
    a11y: [
      'prefers-reduced-motion 사용자는 기본 PAUSE 상태로 시작',
      '버튼에 aria-pressed로 재생/정지 상태',
      '모션 감지 사실을 텍스트로 명시 ("⚠ reduced-motion")',
      'aria-live는 폴링 빈도가 높아 의도적으로 미적용 — SR 폭주 방지',
      '대신 일시정지 후 정적 값 읽기 가능',
    ],
  },
  9: {
    title: 'Bar · 드래그 + 키보드 편집',
    method: 'role="slider" · ↑↓ Shift+↑↓ Home/End',
    interactions: [
      '막대 상단의 핸들을 드래그하여 값 조정',
      '핸들에 줄무늬 디자인으로 "여기를 잡을 수 있다" 어포던스',
      '드래그 중 색 변경 + 활성 outline',
      'RESET 버튼으로 초기값 복귀',
    ],
    a11y: [
      'WCAG 2.5.7 — 드래그 대안으로 키보드 슬라이더',
      'role="slider" + aria-valuemin/max/now/text',
      'aria-orientation="vertical" 명시',
      '↑↓: 1씩, Shift+↑↓: 10씩, Home: 0, End: 100',
      'Tab 진입 시 핸들이 항상 보임 (호버 의존 X)',
      '포커스 outline은 점선으로 선택/드래그와 구분',
    ],
  },
  10: {
    title: 'Bar · 타임 스크러버',
    method: 'range input · PgUp/PgDn · aria-valuetext',
    interactions: [
      '슬라이더 드래그로 0~23시 프레임 이동',
      '시간 라벨이 분 정밀도로 표시 (00:00 형식)',
      '프레임 전환 시 데이터 즉시 갱신',
    ],
    a11y: [
      'range input의 키보드 동작은 브라우저 기본 (←→)',
      'PgUp/PgDn 추가 바인딩으로 6시간 점프',
      'aria-valuetext에 현재 시간 + 모든 시리즈 값 포함',
      '브라우저 무관하게 24개 step 명시',
      'aria-live로 프레임 변경 안내',
    ],
  },
  11: {
    title: 'Bar · 키보드 탐색',
    method: 'role="application" · 화살표/Home/End',
    interactions: [
      '키보드 우선 설계 — 마우스는 보조',
      '포커스 outline이 굵게(2.5px) 가시화',
      '활성 막대 위에 값을 큼지막하게 노출',
    ],
    a11y: [
      'role="application" — 차트 전체가 인터랙티브 단위',
      '←→↑↓ 모두 동작, Home/End로 양 끝 점프',
      'aria-live로 활성 막대 음성 안내',
      '데이터 표 토글로 전체 데이터 일괄 확인 가능',
      '포커스 시 색 차이도 강조 (45% → 100%)',
    ],
  },
  12: {
    title: 'Scatter · Voronoi 호버',
    method: 'd3-delaunay hit-area + 키보드 탐색',
    interactions: [
      'Voronoi polygon으로 화면 빈틈없이 분할',
      '작은 점에서도 마우스가 가까이만 가면 활성',
      '활성 점은 빨간색으로 크기 2배',
      '오른쪽 상단 고정 툴팁으로 차트 시야 보장',
    ],
    a11y: [
      'hit-area 확장 → 정밀 운동 어려운 사용자 친화',
      'Tab 진입 후 ←→로 X 순서 이동',
      '키보드 포커스에도 점이 활성 + 점선 링',
      'hover와 focus가 같은 시각 상태 공유',
      'aria-live로 활성 점 음성 안내',
    ],
  },
  13: {
    title: 'Linked Tooltip · 두 차트 동기화',
    method: '부모 state 공유 · hover-or-focus · 통합 툴팁',
    interactions: [
      '한 차트 호버 시 두 차트 모두 같은 X에 crosshair',
      '두 차트의 값을 한 통합 툴팁에 묶어 표시',
      'hit-area를 점이 아닌 X-step 사각형으로 확장',
      '점 색 채움도 활성 시 변경',
    ],
    a11y: [
      'Tab 한 번으로 두 차트 묶음에 진입',
      '←→ Home/End로 월 이동, Esc 해제',
      'hover와 focus가 단일 activeIdx state 공유',
      '실선/점선으로 시리즈 이중코딩',
      'aria-describedby로 차트와 상태 텍스트 연결',
      'aria-live로 한 줄에 두 값 모두 안내',
    ],
  },
  14: {
    title: 'Bar · 표시 모드 토글',
    method: 'fieldset + radiogroup · 누적/그룹/100%',
    interactions: [
      '3가지 시각화 방식 즉시 전환',
      '누적: 합계의 구성, 그룹: 항목 비교, 100%: 비율',
      '전환 시 짧은 트랜지션으로 변화 추적',
    ],
    a11y: [
      'fieldset + legend + radiogroup으로 시맨틱',
      '키보드 ↑↓/←→로 라디오 이동 (브라우저 기본)',
      '4개 시리즈는 모양 글리프로 이중코딩',
      'reduce-motion 감지 시 트랜지션 0초',
      '데이터 표 토글로 정확한 값 검증',
    ],
  },
  15: {
    title: 'Bar · 드릴다운',
    method: 'breadcrumb · Esc/Backspace 복귀 · Enter/Space 진입',
    interactions: [
      '루트 막대 클릭 → 세부 카테고리 진입',
      'breadcrumb로 현재 위치 시각화',
      '루트 상태에서만 클릭 가능, 세부에선 비활성',
    ],
    a11y: [
      'Tab → ←→로 막대 이동, Enter/Space로 진입',
      'Esc 또는 Backspace로 상위 복귀',
      'breadcrumb에 aria-current="page"',
      'aria-label에 "클릭하여 세부보기" 명시',
      'aria-live로 합계 + 포커스 위치 안내',
    ],
  },
  16: {
    title: 'Bar · 검색 강조',
    method: 'role="search" · aria-live 결과 알림',
    interactions: [
      '즉시 매칭(every keystroke)으로 강조 갱신',
      '비매칭은 dim, 매칭은 색 + 값 라벨 + 검은 테두리',
      '결과 없을 때 빨간 텍스트로 명시',
    ],
    a11y: [
      'role="search" 컨테이너',
      'type="search"로 시맨틱 입력 (브라우저 X 버튼)',
      'aria-describedby로 입력과 결과 연결',
      'aria-live="polite"로 결과 개수 즉시 알림',
      'aria-atomic="true"로 변경 시 전체 재읽기',
      '시각 + 음성 모두 결과 0 상태를 빨간색/단어로 강조',
    ],
  },
  17: {
    title: 'Line · Before/After 비교',
    method: 'clipPath 분할 · aria-valuetext · 실선/점선',
    interactions: [
      '한 차트에 두 시점을 분할선 좌/우로 동시 표시',
      '슬라이더로 분할 비율 조정 — 어느 시점을 더 보여줄지',
      '슬라이더 핸들 자체에도 ◄► 아이콘으로 어포던스',
    ],
    a11y: [
      'range input의 기본 키보드 동작 (←→ Home/End)',
      'aria-valuetext에 "X% 지점, 왼쪽 2024 점선, 오른쪽 2025 실선" 명시',
      '색 외에 실선/점선으로 이중코딩',
      '차트 안에 시점 라벨도 명시적으로 표기',
    ],
  },
};

// ════════════════════════════════════════════════════════════
// 메인
// ════════════════════════════════════════════════════════════
const DEMOS = [
  { num: 1, cat: 'CHART', cmp: <D01 /> },
  { num: 2, cat: 'SELECT', cmp: <D02 /> },
  { num: 3, cat: 'HOVER', cmp: <D03 /> },
  { num: 4, cat: 'SELECT', cmp: <D04 /> },
  { num: 5, cat: 'ZOOM', cmp: <D05 /> },
  { num: 6, cat: 'TOGGLE', cmp: <D06 /> },
  { num: 7, cat: 'MOTION', cmp: <D07 /> },
  { num: 8, cat: 'MOTION', cmp: <D08 /> },
  { num: 9, cat: 'EDIT', cmp: <D09 /> },
  { num: 10, cat: 'TIME', cmp: <D10 /> },
  { num: 11, cat: 'A11Y', cmp: <D11 /> },
  { num: 12, cat: 'HOVER', cmp: <D12 /> },
  { num: 13, cat: 'DASHBOARD', cmp: <D13 /> },
  { num: 14, cat: 'TOGGLE', cmp: <D14 /> },
  { num: 15, cat: 'DRILL', cmp: <D15 /> },
  { num: 16, cat: 'SEARCH', cmp: <D16 /> },
  { num: 17, cat: 'COMPARE', cmp: <D17 /> },
];

export default function GalleryFinal() {
  const [openAll, setOpenAll] = useState(false);

  useEffect(() => {
    injectChartGalleryVars();
  }, []);

  return (
    <div style={{
      fontFamily: 'inherit', color: C.ink,
    }} className="">

      {DEMOS.map(({ num, cat, cmp }) => (
        <ExpandedCard key={num} num={num} cat={cat} openAll={openAll}>
          {cmp}
        </ExpandedCard>
      ))}

    </div>
  );
}

// ExpandedCard: openAll prop을 받아서 일괄 펼치기 지원
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
