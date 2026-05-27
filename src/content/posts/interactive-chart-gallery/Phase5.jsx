import React, { useState, useEffect, useRef, useMemo } from 'react';
import * as d3 from 'd3';

// ════════════════════════════════════════════════════════════
// PALETTE (모든 Phase 동일)
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
// SEEDED RNG + DATA
// ════════════════════════════════════════════════════════════
const makeRng = (seed) => () => {
  seed = (seed * 1664525 + 1013904223) % 4294967296;
  return seed / 4294967296;
};
const boxMuller = (rng) => Math.sqrt(-2 * Math.log(Math.max(1e-9, rng()))) * Math.cos(2 * Math.PI * rng());
const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

// Student GPA by department
const DEPTS = ['컴공', '디자인', '경영', '심리', '물리'];
const STUDENT_DATA = (() => {
  const rng = makeRng(17);
  const params = [
    { mean: 3.5, std: 0.42 },
    { mean: 3.7, std: 0.28 },
    { mean: 3.35, std: 0.5 },
    { mean: 3.6, std: 0.32 },
    { mean: 3.25, std: 0.55 },
  ];
  const arr = [];
  DEPTS.forEach((d, dIdx) => {
    for (let i = 0; i < 60; i++) {
      const g = clamp(params[dIdx].mean + boxMuller(rng) * params[dIdx].std, 1.5, 4.5);
      arr.push({ dept: d, deptIdx: dIdx, gpa: g });
    }
  });
  return arr;
})();

// Monthly precipitation distributions (6 years × 12 months) — Korea-like pattern
const MONTHS = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
const PRECIP_DATA = (() => {
  const rng = makeRng(31);
  // 한국 강수량 패턴 (mm): 7-8월 장마, 겨울 적음
  const monthlyMean = [20, 25, 50, 80, 100, 130, 280, 270, 150, 60, 50, 25];
  const monthlyStd = [10, 15, 20, 30, 30, 50, 80, 90, 60, 25, 20, 12];
  // 각 월에 6년치 + 더 많은 가상 데이터로 분포 표현
  return MONTHS.map((m, mIdx) => {
    const values = [];
    for (let i = 0; i < 30; i++) {
      values.push(clamp(monthlyMean[mIdx] + boxMuller(rng) * monthlyStd[mIdx], 0, 500));
    }
    return { month: m, monthIdx: mIdx, values };
  });
})();

// 자동차 데이터 (5 numeric vars)
const CARS = (() => {
  const rng = makeRng(57);
  const arr = [];
  const types = ['세단', 'SUV', '쿠페'];
  for (let i = 0; i < 36; i++) {
    const cyl = [4, 6, 8][i % 3];
    const baseMpg = cyl === 4 ? 30 : cyl === 6 ? 22 : 16;
    arr.push({
      name: `${types[i % 3]}-${i + 1}`,
      typeIdx: i % 3,
      mpg: clamp(baseMpg + (rng() - 0.5) * 8, 10, 40),
      hp: Math.round(clamp(cyl * 30 + (rng() - 0.5) * 60, 80, 320)),
      weight: Math.round(clamp(cyl * 350 + 1400 + (rng() - 0.5) * 500, 1500, 4200)),
      disp: +clamp(cyl * 0.5 + (rng() - 0.5) * 0.5, 1.5, 5.0).toFixed(1),
      cyl,
    });
  }
  return arr;
})();

// Activity heatmap (24h × 7 days)
const DAYS = ['월', '화', '수', '목', '금', '토', '일'];
const ACTIVITY_DATA = (() => {
  const rng = makeRng(99);
  // 패턴: 평일 9-18 업무, 19-22 저녁, 주말은 11-23 분산
  const arr = [];
  for (let d = 0; d < 7; d++) {
    for (let h = 0; h < 24; h++) {
      let base = 5;
      if (d < 5) { // 평일
        if (h >= 9 && h <= 18) base = 70 + (rng() - 0.5) * 20;
        else if (h >= 19 && h <= 22) base = 50 + (rng() - 0.5) * 20;
        else if (h >= 7 && h <= 8) base = 30 + (rng() - 0.5) * 15;
        else if (h >= 23 || h <= 1) base = 15 + (rng() - 0.5) * 10;
        else base = 3 + rng() * 5;
      } else { // 주말
        if (h >= 11 && h <= 23) base = 40 + (rng() - 0.5) * 30;
        else if (h <= 2) base = 20 + (rng() - 0.5) * 15;
        else base = 3 + rng() * 5;
      }
      arr.push({ day: DAYS[d], dayIdx: d, hour: h, value: Math.round(clamp(base, 0, 100)) });
    }
  }
  return arr;
})();

// KDE helper
const kde = (kernel, X) => (V) => X.map((x) => [x, d3.mean(V, (v) => kernel(x - v))]);
const epanechnikov = (k) => (v) => Math.abs(v /= k) <= 1 ? 0.75 * (1 - v * v) / k : 0;

// 통계 헬퍼
const stats = (vals) => {
  const sorted = [...vals].sort((a, b) => a - b);
  return {
    n: sorted.length,
    min: sorted[0],
    q1: d3.quantile(sorted, 0.25),
    median: d3.quantile(sorted, 0.5),
    q3: d3.quantile(sorted, 0.75),
    max: sorted[sorted.length - 1],
    mean: d3.mean(sorted),
  };
};

// ════════════════════════════════════════════════════════════
// #33 — Violin Plot
// ════════════════════════════════════════════════════════════
const D33 = () => {
  const [focusIdx, setFocusIdx] = useState(0);
  const [hasFocus, setHasFocus] = useState(false);
  const [hasHover, setHasHover] = useState(false);
  const [tableOpen, setTableOpen] = useState(false);
  const chartActive = hasFocus || hasHover;
  const refs = useRef([]);

  const W = 540, H = 320;
  const m = { t: 20, r: 20, b: 50, l: 50 };
  const iw = W - m.l - m.r;
  const ih = H - m.t - m.b;

  const xStep = iw / DEPTS.length;
  const xc = (i) => m.l + i * xStep + xStep / 2;
  const violinW = xStep * 0.7;

  const allGpa = STUDENT_DATA.map((d) => d.gpa);
  const yScale = d3.scaleLinear().domain([1.5, 4.5]).range([H - m.b, m.t]);

  // 학과별 통계 + KDE
  const perDept = useMemo(() => DEPTS.map((d, i) => {
    const vals = STUDENT_DATA.filter((s) => s.deptIdx === i).map((s) => s.gpa);
    const s = stats(vals);
    const ticks = d3.range(1.5, 4.51, 0.05);
    const density = kde(epanechnikov(0.18), ticks)(vals);
    const maxDensity = d3.max(density, (d) => d[1]);
    return { name: d, vals, ...s, density, maxDensity };
  }), []);

  const globalMaxDensity = d3.max(perDept, (d) => d.maxDensity);
  const xPath = d3.scaleLinear().domain([0, globalMaxDensity]).range([0, violinW / 2]);

  const moveFocus = (next) => {
    refs.current[next]?.focus();
    setFocusIdx(next);
  };

  const cur = perDept[focusIdx];

  return (
    <div>
      <Usage mouse="violin 호버" keyboard="Tab → ←→ 학과 순회" />

      <div role="toolbar"
        aria-label="학과별 GPA 분포 violin plot"
        onFocusCapture={() => setHasFocus(true)}
        onBlurCapture={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget)) setHasFocus(false);
        }}
        onMouseEnter={() => setHasHover(true)}
        onMouseLeave={() => setHasHover(false)}
        style={{
          background: C.paper,
          border: `1px solid ${C.rule}`,
          padding: 10,
          outline: hasFocus ? `1.5px dashed ${C.focus}` : '1.5px dashed transparent',
          outlineOffset: '-1.5px',
          transition: 'outline-color 0.12s',
          position: 'relative',
        }}>
        <div style={{ position: 'relative', height: H }}>
          <svg viewBox={`0 0 ${W} ${H}`}
            preserveAspectRatio="none"
            style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%',
              display: 'block', pointerEvents: 'none',
            }}
            aria-hidden="true">
            {/* y-axis grid */}
            {[1.5, 2, 2.5, 3, 3.5, 4, 4.5].map((g) => (
              <line key={g} x1={m.l} x2={W - m.r}
                y1={yScale(g)} y2={yScale(g)}
                stroke={C.ruleSoft} strokeWidth={1}
                vectorEffect="non-scaling-stroke" />
            ))}

            {perDept.map((d, i) => {
              const cx = xc(i);
              const isFocused = focusIdx === i && chartActive;
              const color = SERIES[i];

              // violin path (좌우 대칭)
              const right = d.density.map(([y, dens]) => `${cx + xPath(dens)},${yScale(y)}`);
              const left = [...d.density].reverse().map(([y, dens]) => `${cx - xPath(dens)},${yScale(y)}`);
              const path = `M${right.join(' L')} L${left.join(' L')} Z`;

              return (
                <g key={d.name} opacity={isFocused || !chartActive ? 1 : 0.4}>
                  {/* violin shape */}
                  <path d={path} fill={color} fillOpacity={0.35}
                    stroke={color} strokeWidth={1.5}
                    vectorEffect="non-scaling-stroke" />
                  {/* box (Q1-Q3) */}
                  <rect x={cx - 5} y={yScale(d.q3)}
                    width={10} height={yScale(d.q1) - yScale(d.q3)}
                    fill={C.paper} stroke={C.ink} strokeWidth={1.5}
                    vectorEffect="non-scaling-stroke" />
                  {/* median */}
                  <line x1={cx - 5} x2={cx + 5}
                    y1={yScale(d.median)} y2={yScale(d.median)}
                    stroke={C.ink} strokeWidth={2.5}
                    vectorEffect="non-scaling-stroke" />
                  {/* whiskers */}
                  <line x1={cx} x2={cx}
                    y1={yScale(d.min)} y2={yScale(d.q1)}
                    stroke={C.ink} strokeWidth={1}
                    vectorEffect="non-scaling-stroke" />
                  <line x1={cx} x2={cx}
                    y1={yScale(d.q3)} y2={yScale(d.max)}
                    stroke={C.ink} strokeWidth={1}
                    vectorEffect="non-scaling-stroke" />
                </g>
              );
            })}
          </svg>

          {/* HTML overlay: 축 라벨 + button */}
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
            {/* y-axis ticks */}
            {[1.5, 2, 2.5, 3, 3.5, 4, 4.5].map((g) => (
              <div key={g} style={{
                position: 'absolute',
                left: 0, width: `${(m.l - 4) / W * 100}%`,
                top: `${(yScale(g) / H) * 100}%`,
                transform: 'translateY(-50%)',
                textAlign: 'right',
                fontFamily: '"Courier New", Courier, monospace',
                fontSize: 10,
                color: C.inkSoft,
              }}>{g.toFixed(1)}</div>
            ))}
            <div style={{
              position: 'absolute',
              left: 0, top: '50%',
              transform: 'rotate(-90deg) translateY(-100%)',
              transformOrigin: 'left top',
              fontFamily: '"Courier New", Courier, monospace',
              fontSize: 10,
              color: C.inkSoft,
              letterSpacing: '0.15em',
            }}>GPA</div>

            {/* per-dept buttons + labels */}
            {perDept.map((d, i) => {
              const cx = xc(i);
              const isFocused = focusIdx === i;
              const isActive = isFocused && chartActive;
              return (
                <div key={d.name} style={{
                  position: 'absolute',
                  left: `${((cx - violinW / 2) / W) * 100}%`,
                  width: `${(violinW / W) * 100}%`,
                  top: 0, bottom: 0,
                  pointerEvents: 'none',
                }}>
                  <button
                    ref={(el) => { refs.current[i] = el; }}
                    type="button"
                    aria-pressed={isActive}
                    aria-label={`${d.name} — N=${d.n}, 중앙값 ${d.median.toFixed(2)}, 평균 ${d.mean.toFixed(2)}`}
                    tabIndex={focusIdx === i ? 0 : -1}
                    onClick={() => { refs.current[i]?.focus(); setFocusIdx(i); }}
                    onMouseEnter={() => setFocusIdx(i)}
                    onFocus={() => setFocusIdx(i)}
                    onKeyDown={(e) => {
                      if (e.key === 'ArrowRight') {
                        e.preventDefault(); moveFocus(Math.min(DEPTS.length - 1, i + 1));
                      } else if (e.key === 'ArrowLeft') {
                        e.preventDefault(); moveFocus(Math.max(0, i - 1));
                      } else if (e.key === 'Home') {
                        e.preventDefault(); moveFocus(0);
                      } else if (e.key === 'End') {
                        e.preventDefault(); moveFocus(DEPTS.length - 1);
                      }
                    }}
                    style={{
                      position: 'absolute',
                      top: `${(m.t / H) * 100}%`,
                      height: `${(ih / H) * 100}%`,
                      left: 0, right: 0,
                      background: 'transparent',
                      border: 'none', padding: 0, margin: 0,
                      cursor: 'pointer', outline: 'none',
                      boxShadow: isActive ? `inset 0 0 0 2px ${C.focus}` : 'none',
                      pointerEvents: 'auto',
                    }} />
                  {/* 학과 라벨 */}
                  <div style={{
                    position: 'absolute',
                    left: 0, right: 0,
                    bottom: `${((m.b - 30) / H) * 100}%`,
                    textAlign: 'center',
                    fontFamily: '"Courier New", Courier, monospace',
                    fontSize: 11,
                    color: isActive ? C.ink : C.inkSoft,
                    fontWeight: isActive ? 700 : 500,
                  }}>{d.name}</div>
                  {/* N 표시 */}
                  <div style={{
                    position: 'absolute',
                    left: 0, right: 0,
                    bottom: `${((m.b - 46) / H) * 100}%`,
                    textAlign: 'center',
                    fontFamily: '"Courier New", Courier, monospace',
                    fontSize: 9,
                    color: C.inkFaint,
                  }}>n={d.n}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-3">
        {[
          { label: 'N', v: cur.n },
          { label: '평균', v: cur.mean.toFixed(2) },
          { label: '중앙값', v: cur.median.toFixed(2) },
          { label: 'IQR', v: `${cur.q1.toFixed(2)}–${cur.q3.toFixed(2)}` },
        ].map(({ label, v }) => (
          <div key={label} style={{ border: `1px solid ${C.rule}`, padding: 6 }}>
            <div style={{ color: C.inkFaint, fontSize: 9 }}>{label}</div>
            <div style={{ color: C.ink, fontSize: 14, fontFamily: 'inherit', fontWeight: 500 }}>{v}</div>
          </div>
        ))}
      </div>

      <div className="flex gap-3 mt-3 mb-3 items-start">
        <div aria-live="polite" style={{ color: C.inkSoft }}>
          <strong style={{ color: C.ink }}>{cur.name}</strong> — N={cur.n}, 평균 {cur.mean.toFixed(2)}, 중앙값 {cur.median.toFixed(2)}, IQR {cur.q1.toFixed(2)}–{cur.q3.toFixed(2)}, 범위 {cur.min.toFixed(2)}–{cur.max.toFixed(2)}
        </div>
        <button onClick={() => setTableOpen((v) => !v)} aria-expanded={tableOpen}
          aria-controls="d33-table"
          className="ml-auto"
          {...focusable}>
          {tableOpen ? '데이터 표 닫기' : '5개 학과 · 학과당 60명'}
        </button>
      </div>
      {tableOpen && (
        <div id="d33-table" className="text-[12px]">
          <table>
            <caption>학과별 GPA 통계</caption>
            <thead>
              <tr>{['학과', 'N', '평균', 'Min', 'Q1', '중앙값', 'Q3', 'Max'].map((h) => <th key={h} scope="col">{h}</th>)}</tr>
            </thead>
            <tbody>
              {perDept.map((d) => (
                <tr key={d.name}>
                  <td>{d.name}</td>
                  <td>{d.n}</td>
                  <td>{d.mean.toFixed(2)}</td>
                  <td>{d.min.toFixed(2)}</td>
                  <td>{d.q1.toFixed(2)}</td>
                  <td>{d.median.toFixed(2)}</td>
                  <td>{d.q3.toFixed(2)}</td>
                  <td>{d.max.toFixed(2)}</td>
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
// #34 — Ridgeline Plot
// ════════════════════════════════════════════════════════════
const D34 = () => {
  const [focusIdx, setFocusIdx] = useState(6); // 7월부터 시작 (장마)
  const [hasFocus, setHasFocus] = useState(false);
  const [tableOpen, setTableOpen] = useState(false);
  const [hasHover, setHasHover] = useState(false);
  const chartActive = hasFocus || hasHover;
  const refs = useRef([]);

  const W = 540, H = 380;
  const m = { t: 50, r: 20, b: 40, l: 60 };
  const iw = W - m.l - m.r;
  const ih = H - m.t - m.b;

  // 모든 강수량 값 → 공통 x 도메인
  const allVals = PRECIP_DATA.flatMap((d) => d.values);
  const xScale = d3.scaleLinear().domain([0, 500]).range([m.l, W - m.r]);

  // 각 월의 KDE
  const ridges = useMemo(() => {
    const ticks = d3.range(0, 501, 8);
    return PRECIP_DATA.map((d) => {
      const density = kde(epanechnikov(15), ticks)(d.values);
      const maxDens = d3.max(density, (p) => p[1]);
      const mean = d3.mean(d.values);
      const median = d3.median(d.values);
      return { ...d, density, maxDens, mean, median };
    });
  }, []);

  const globalMaxDens = d3.max(ridges, (r) => r.maxDens);
  const rowH = ih / ridges.length;
  const ridgeH = rowH * 2.5; // 겹침
  const yPath = d3.scaleLinear().domain([0, globalMaxDens]).range([0, ridgeH]);
  const baselineY = (i) => m.t + (i + 0.7) * rowH;

  const moveFocus = (next) => {
    refs.current[next]?.focus();
    setFocusIdx(next);
  };

  const cur = ridges[focusIdx];

  return (
    <div>
      <Usage mouse="ridge 호버" keyboard="Tab → ↑↓ 월 순회" />

      <div role="toolbar"
        aria-label="월별 강수량 분포 ridgeline"
        onFocusCapture={() => setHasFocus(true)}
        onBlurCapture={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget)) setHasFocus(false);
        }}
        onMouseEnter={() => setHasHover(true)}
        onMouseLeave={() => setHasHover(false)}
        style={{
          background: C.paper,
          border: `1px solid ${C.rule}`,
          padding: 10,
          outline: hasFocus ? `1.5px dashed ${C.focus}` : '1.5px dashed transparent',
          outlineOffset: '-1.5px',
          transition: 'outline-color 0.12s',
        }}>
        <div style={{ position: 'relative', height: H }}>
          <svg viewBox={`0 0 ${W} ${H}`}
            preserveAspectRatio="none"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block', pointerEvents: 'none' }}
            aria-hidden="true">
            {/* x grid */}
            {[0, 100, 200, 300, 400, 500].map((v) => (
              <line key={v} x1={xScale(v)} x2={xScale(v)}
                y1={m.t} y2={H - m.b}
                stroke={C.ruleSoft} strokeWidth={1}
                vectorEffect="non-scaling-stroke" />
            ))}

            {ridges.map((r, i) => {
              const isFocused = focusIdx === i && chartActive;
              const y0 = baselineY(i);
              // ridge path: 각 (x, density)를 y0 - yPath(density) 위치로
              const path = `M${xScale(0)},${y0} ` +
                r.density.map(([x, d]) =>
                  `L${xScale(x)},${y0 - yPath(d)}`).join(' ') +
                ` L${xScale(500)},${y0} Z`;
              return (
                <g key={r.month}>
                  <path d={path}
                    fill={isFocused ? C.red : C.navy}
                    fillOpacity={chartActive ? (isFocused ? 0.7 : 0.18) : 0.45}
                    stroke={isFocused ? C.red : C.navy}
                    strokeWidth={isFocused ? 1.5 : 1}
                    vectorEffect="non-scaling-stroke" />
                  {/* baseline */}
                  <line x1={xScale(0)} x2={xScale(500)}
                    y1={y0} y2={y0}
                    stroke={isFocused ? C.ink : C.ruleSoft}
                    strokeWidth={1} vectorEffect="non-scaling-stroke" />
                  {/* median tick */}
                  {isFocused && (
                    <line x1={xScale(r.median)} x2={xScale(r.median)}
                      y1={y0 - 4} y2={y0 - yPath(globalMaxDens) - 2}
                      stroke={C.ink} strokeWidth={1.5}
                      strokeDasharray="3 2"
                      vectorEffect="non-scaling-stroke" />
                  )}
                </g>
              );
            })}
          </svg>

          {/* HTML overlay */}
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
            {/* x ticks */}
            {[0, 100, 200, 300, 400, 500].map((v) => (
              <div key={v} style={{
                position: 'absolute',
                left: `${(xScale(v) / W) * 100}%`,
                bottom: `${((m.b - 16) / H) * 100}%`,
                transform: 'translateX(-50%)',
                fontFamily: '"Courier New", Courier, monospace',
                fontSize: 10,
                color: C.inkSoft,
              }}>{v}</div>
            ))}
            <div style={{
              position: 'absolute',
              right: 12, bottom: 4,
              fontFamily: '"Courier New", Courier, monospace',
              fontSize: 10,
              color: C.inkSoft,
            }}>강수량 (mm)</div>

            {/* month labels + buttons */}
            {ridges.map((r, i) => {
              const isFocused = focusIdx === i;
              const isActive = isFocused && chartActive;
              const y0 = baselineY(i);
              const yTop = y0 - rowH * 1.2;
              return (
                <div key={r.month} style={{
                  position: 'absolute',
                  left: 0, right: 0,
                  top: `${(yTop / H) * 100}%`,
                  height: `${((rowH * 1.4) / H) * 100}%`,
                  pointerEvents: 'none',
                }}>
                  {/* y label */}
                  <div style={{
                    position: 'absolute',
                    left: 4, top: '50%',
                    transform: 'translateY(-50%)',
                    width: m.l - 12,
                    textAlign: 'right',
                    fontFamily: '"Courier New", Courier, monospace',
                    fontSize: 11,
                    color: isActive ? C.red : isFocused ? C.ink : C.inkSoft,
                    fontWeight: isActive ? 700 : 500,
                  }}>{r.month}</div>

                  <button
                    ref={(el) => { refs.current[i] = el; }}
                    type="button"
                    aria-pressed={isActive}
                    aria-label={`${r.month} 강수량 분포 — 평균 ${r.mean.toFixed(0)}mm, 중앙값 ${r.median.toFixed(0)}mm`}
                    tabIndex={focusIdx === i ? 0 : -1}
                    onClick={() => { refs.current[i]?.focus(); setFocusIdx(i); }}
                    onMouseEnter={() => setFocusIdx(i)}
                    onFocus={() => setFocusIdx(i)}
                    onKeyDown={(e) => {
                      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
                        e.preventDefault(); moveFocus(Math.min(ridges.length - 1, i + 1));
                      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
                        e.preventDefault(); moveFocus(Math.max(0, i - 1));
                      } else if (e.key === 'Home') {
                        e.preventDefault(); moveFocus(0);
                      } else if (e.key === 'End') {
                        e.preventDefault(); moveFocus(ridges.length - 1);
                      }
                    }}
                    style={{
                      position: 'absolute',
                      left: `${(m.l / W) * 100}%`,
                      right: `${(m.r / W) * 100}%`,
                      top: 0, bottom: 0,
                      background: 'transparent',
                      border: 'none', padding: 0, margin: 0,
                      cursor: 'pointer', outline: 'none',
                      boxShadow: isActive ? `inset 0 0 0 2px ${C.focus}` : 'none',
                      pointerEvents: 'auto',
                    }} />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex gap-3 mt-3 mb-3 items-start">
        <div aria-live="polite" style={{ color: C.inkSoft }}>
          <strong style={{ color: C.ink }}>{cur.month}</strong> — 평균 {cur.mean.toFixed(0)}mm, 중앙값 {cur.median.toFixed(0)}mm, N={cur.values.length}
        </div>
        <button onClick={() => setTableOpen((v) => !v)} aria-expanded={tableOpen}
          aria-controls="d34-table"
          className="ml-auto"
          {...focusable}>
          {tableOpen ? '데이터 표 닫기' : '월별 강수량 분포'}
        </button>
      </div>
      {tableOpen && (
        <div id="d34-table" className="text-[12px]">
          <table>
            <caption>월별 강수량</caption>
            <thead>
              <tr>{['월', 'N', '평균', '중앙값', '최댓값'].map((h) => <th key={h} scope="col">{h}</th>)}</tr>
            </thead>
            <tbody>
              {ridges.map((r) => (
                <tr key={r.month}>
                  <td>{r.month}</td>
                  <td>{r.values.length}</td>
                  <td>{r.mean.toFixed(0)}</td>
                  <td>{r.median.toFixed(0)}</td>
                  <td>{d3.max(r.values).toFixed(0)}</td>
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
// #35 — Parallel Coordinates
// ════════════════════════════════════════════════════════════
const D35 = () => {
  const [hoverCarIdx, setHoverCarIdx] = useState(null);
  const [focusIdx, setFocusIdx] = useState(0);
  const [hasFocus, setHasFocus] = useState(false);
  const [hasHover, setHasHover] = useState(false);
  const [tableOpen, setTableOpen] = useState(false);
  const chartActive = hasFocus || hasHover;
  // brush: { [axisKey]: [min, max] }
  const [brush, setBrush] = useState({});
  const refs = useRef([]);

  const AXES = [
    { k: 'mpg', l: '연비(mpg)', min: 10, max: 40 },
    { k: 'hp', l: '마력', min: 80, max: 320 },
    { k: 'weight', l: '무게', min: 1500, max: 4200 },
    { k: 'disp', l: '배기량', min: 1.5, max: 5.0 },
    { k: 'cyl', l: '실린더', min: 4, max: 8 },
  ];

  const W = 600, H = 320;
  const m = { t: 28, r: 24, b: 30, l: 24 };
  const iw = W - m.l - m.r;
  const ih = H - m.t - m.b;
  const xStep = iw / (AXES.length - 1);
  const xAt = (i) => m.l + i * xStep;
  const scales = AXES.map((a) => d3.scaleLinear()
    .domain([a.min, a.max]).range([H - m.b, m.t]));

  // 필터된 자동차
  const matchCar = (car) => {
    return Object.entries(brush).every(([k, [min, max]]) =>
      car[k] >= min && car[k] <= max);
  };
  const filtered = CARS.filter(matchCar);

  const moveFocus = (next) => {
    refs.current[next]?.focus();
    setFocusIdx(next);
  };

  const curAxis = AXES[focusIdx];
  const curBrush = brush[curAxis.k];

  const resetBrush = () => setBrush({});

  return (
    <div>
      <Usage mouse="라인 호버 · 축 슬라이더로 필터"
        keyboard="Tab → 축 ←→ 선택, 슬라이더로 brush" />

      <div role="toolbar"
        aria-label="자동차 5개 변수 parallel coordinates"
        onFocusCapture={() => setHasFocus(true)}
        onBlurCapture={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget)) setHasFocus(false);
        }}
        onMouseEnter={() => setHasHover(true)}
        onMouseLeave={() => setHasHover(false)}
        style={{
          background: C.paper,
          border: `1px solid ${C.rule}`,
          padding: 10,
          outline: hasFocus ? `1.5px dashed ${C.focus}` : '1.5px dashed transparent',
          outlineOffset: '-1.5px',
          transition: 'outline-color 0.12s',
        }}>
        <div style={{ position: 'relative', height: H }}>
          <svg viewBox={`0 0 ${W} ${H}`}
            preserveAspectRatio="none"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block', pointerEvents: 'none' }}
            aria-hidden="true">
            {/* axes */}
            {AXES.map((a, i) => (
              <line key={a.k} x1={xAt(i)} x2={xAt(i)}
                y1={m.t} y2={H - m.b}
                stroke={C.inkSoft} strokeWidth={1.5}
                vectorEffect="non-scaling-stroke" />
            ))}

            {/* lines for each car — 색+선 패턴 이중코딩 (색맹 대응) */}
            {CARS.map((car, ci) => {
              const isMatch = matchCar(car);
              const isHover = hoverCarIdx === ci;
              const points = AXES.map((a, i) => [xAt(i), scales[i](car[a.k])]);
              const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0]},${p[1]}`).join(' ');
              // 세단=실선, SUV=점선, 쿠페=긴 dash
              const dash = ['', '2 2', '6 3'][car.typeIdx];
              return (
                <path key={ci} d={path}
                  fill="none"
                  stroke={isHover ? C.red : SERIES[car.typeIdx]}
                  strokeWidth={isHover ? 2 : 1}
                  strokeOpacity={isMatch ? (isHover ? 1 : 0.45) : 0.06}
                  strokeDasharray={dash || undefined}
                  vectorEffect="non-scaling-stroke" />
              );
            })}

            {/* brush highlight on each axis */}
            {AXES.map((a, i) => {
              const b = brush[a.k];
              if (!b) return null;
              const y1 = scales[i](b[1]);
              const y2 = scales[i](b[0]);
              return (
                <rect key={`b-${a.k}`}
                  x={xAt(i) - 6} y={y1}
                  width={12} height={y2 - y1}
                  fill={C.red} fillOpacity={0.18}
                  stroke={C.red} strokeWidth={1.5}
                  vectorEffect="non-scaling-stroke" />
              );
            })}

            {/* axis ticks */}
            {AXES.map((a, i) => (
              <g key={`t-${a.k}`}>
                <line x1={xAt(i) - 4} x2={xAt(i) + 4}
                  y1={scales[i](a.min)} y2={scales[i](a.min)}
                  stroke={C.inkSoft} strokeWidth={1.5}
                  vectorEffect="non-scaling-stroke" />
                <line x1={xAt(i) - 4} x2={xAt(i) + 4}
                  y1={scales[i](a.max)} y2={scales[i](a.max)}
                  stroke={C.inkSoft} strokeWidth={1.5}
                  vectorEffect="non-scaling-stroke" />
              </g>
            ))}
          </svg>

          {/* HTML overlay */}
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
            {AXES.map((a, i) => {
              const isFocused = focusIdx === i;
              const isActive = isFocused && chartActive;
              const xPct = (xAt(i) / W) * 100;
              return (
                <div key={a.k} style={{
                  position: 'absolute',
                  left: `${xPct}%`,
                  transform: 'translateX(-50%)',
                  top: 0, bottom: 0,
                  width: 80,
                  pointerEvents: 'none',
                }}>
                  {/* axis label (top) */}
                  <div style={{
                    position: 'absolute',
                    top: 2, left: 0, right: 0,
                    textAlign: 'center',
                    fontFamily: '"Courier New", Courier, monospace',
                    fontSize: 10,
                    color: isActive ? C.red : C.ink,
                    fontWeight: isActive ? 700 : 600,
                  }}>{a.l}</div>
                  {/* min/max labels */}
                  <div style={{
                    position: 'absolute',
                    left: 0, right: 0,
                    top: `${(m.t / H) * 100}%`,
                    transform: 'translateY(-100%)',
                    textAlign: 'center',
                    fontFamily: '"Courier New", Courier, monospace',
                    fontSize: 9,
                    color: C.inkFaint,
                  }}>{a.max}</div>
                  <div style={{
                    position: 'absolute',
                    left: 0, right: 0,
                    bottom: `${((H - (H - m.b) + 2) / H) * 100}%`,
                    textAlign: 'center',
                    fontFamily: '"Courier New", Courier, monospace',
                    fontSize: 9,
                    color: C.inkFaint,
                  }}>{a.min}</div>

                  {/* button (axis 영역) */}
                  <button
                    ref={(el) => { refs.current[i] = el; }}
                    type="button"
                    aria-pressed={isActive}
                    aria-label={`${a.l} 축${brush[a.k] ? `, 필터 ${brush[a.k][0]}~${brush[a.k][1]}` : ''}`}
                    tabIndex={focusIdx === i ? 0 : -1}
                    onClick={() => { refs.current[i]?.focus(); setFocusIdx(i); }}
                    onMouseEnter={() => setFocusIdx(i)}
                    onFocus={() => setFocusIdx(i)}
                    onKeyDown={(e) => {
                      if (e.key === 'ArrowRight') {
                        e.preventDefault(); moveFocus(Math.min(AXES.length - 1, i + 1));
                      } else if (e.key === 'ArrowLeft') {
                        e.preventDefault(); moveFocus(Math.max(0, i - 1));
                      }
                    }}
                    style={{
                      position: 'absolute',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: 24,
                      top: `${(m.t / H) * 100}%`,
                      height: `${(ih / H) * 100}%`,
                      background: 'transparent',
                      border: 'none', padding: 0,
                      cursor: 'pointer', outline: 'none',
                      boxShadow: isActive ? `inset 0 0 0 2px ${C.focus}` : 'none',
                      pointerEvents: 'auto',
                    }} />
                </div>
              );
            })}

            {/* 자동차 라인용 마우스 오버 영역 (위 SVG에서 잡기 어려우므로 생략 — 호버는 표만 사용) */}
          </div>
        </div>
      </div>

      {/* 현재 축 brush slider */}
      <div className="flex items-center gap-3 mt-3 flex-wrap text-[12px]"
        style={{ paddingBottom: 12, borderBottom: `1px solid ${C.rule}` }}
        role="group" aria-label="현재 축 brush 범위">
        <span
          style={{ color: chartActive ? C.red : C.inkSoft, fontWeight: 700, minWidth: 60 }}>
          {curAxis.l}
        </span>
        <div className="flex items-center gap-2 flex-1" style={{ minWidth: 180 }}>
          <span style={{ color: C.inkSoft }}>최소</span>
          <input type="range"
            min={curAxis.min} max={curAxis.max}
            step={(curAxis.max - curAxis.min) / 50}
            value={curBrush ? curBrush[0] : curAxis.min}
            onChange={(e) => {
              const v = +e.target.value;
              const max = curBrush ? curBrush[1] : curAxis.max;
              setBrush({ ...brush, [curAxis.k]: [Math.min(v, max), max] });
            }}
            aria-label={`${curAxis.l} 최솟값`}
            aria-valuetext={`${curBrush ? curBrush[0].toFixed(1) : curAxis.min}부터`}
            style={{ accentColor: C.red, flex: 1 }}
            {...focusable} />
          <span className="tabular-nums" style={{ color: C.ink, minWidth: 40 }}>
            {(curBrush ? curBrush[0] : curAxis.min).toFixed(1)}
          </span>
        </div>
        <div className="flex items-center gap-2 flex-1" style={{ minWidth: 180 }}>
          <span style={{ color: C.inkSoft }}>최대</span>
          <input type="range"
            min={curAxis.min} max={curAxis.max}
            step={(curAxis.max - curAxis.min) / 50}
            value={curBrush ? curBrush[1] : curAxis.max}
            onChange={(e) => {
              const v = +e.target.value;
              const min = curBrush ? curBrush[0] : curAxis.min;
              setBrush({ ...brush, [curAxis.k]: [min, Math.max(v, min)] });
            }}
            aria-label={`${curAxis.l} 최댓값`}
            aria-valuetext={`${curBrush ? curBrush[1].toFixed(1) : curAxis.max}까지`}
            style={{ accentColor: C.red, flex: 1 }}
            {...focusable} />
          <span className="tabular-nums" style={{ color: C.ink, minWidth: 40 }}>
            {(curBrush ? curBrush[1] : curAxis.max).toFixed(1)}
          </span>
        </div>
      </div>

      {/* 범례 — 색+선 패턴 이중코딩 (차트와 동일한 dash 매칭) */}
      <div className="flex flex-wrap mt-3 gap-3 text-[12px] items-start" style={{ color: C.inkSoft }}>
        <div>
          <div className="flex flex-wrap gap-3">
            {['세단', 'SUV', '쿠페'].map((t, i) => {
              const dash = ['', '2 2', '6 3'][i];
              return (
                <span key={t} className="flex items-center gap-1.5">
                  <svg width="20" height="6" aria-hidden="true">
                    <line x1="0" y1="3" x2="20" y2="3"
                      stroke={SERIES[i]} strokeWidth="2"
                      strokeDasharray={dash || undefined} />
                  </svg>
                  <span style={{ color: SERIES[i], fontSize: 12 }} aria-hidden="true">{SHAPES[i]}</span>
                  &nbsp;{t}
                </span>
              );
            })}
          </div>
          <div className="mt-2">
            <span style={{ color: C.inkSoft }}>
              매치 <strong style={{ color: C.ink }}>{filtered.length}</strong> / {CARS.length}대
              {Object.keys(brush).length > 0 && ` · ${Object.keys(brush).length}개 축 필터`}
            </span>
          </div>
        </div>
        <div className="flex flex-wrap gap-3 ml-auto">
          {curBrush && (
            <button onClick={() => {
              const next = { ...brush };
              delete next[curAxis.k];
              setBrush(next);
            }}
              style={{ border: `1px solid ${C.rule}`, color: C.inkSoft, background: 'transparent' }}
              {...focusable}>이 축 해제</button>
          )}
          {Object.keys(brush).length > 0 && (
            <button onClick={resetBrush}
              style={{ border: `1px solid ${C.rule}`, color: C.inkSoft, background: 'transparent' }}
              {...focusable}>전체 해제</button>
          )}
          <button onClick={() => setTableOpen((v) => !v)} aria-expanded={tableOpen}
            aria-controls="d35-table"
            {...focusable}>
            {tableOpen ? '데이터 표 닫기' : `매치 ${filtered.length}대 / 전체 ${CARS.length}대`}
          </button>
        </div>
      </div>

      {tableOpen && (
        <div id="d35-table" className="text-[12px]">
          <table>
            <caption>자동차 사양 (필터 적용)</caption>
            <thead>
              <tr>{['이름', '타입', 'MPG', 'HP', '무게', '배기량', '실린더'].map((h) => <th key={h} scope="col">{h}</th>)}</tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.name}>
                  <td>{c.name}</td>
                  <td>{['세단', 'SUV', '쿠페'][c.typeIdx]}</td>
                  <td>{c.mpg.toFixed(1)}</td>
                  <td>{c.hp}</td>
                  <td>{c.weight.toLocaleString()}</td>
                  <td>{c.disp.toFixed(1)}</td>
                  <td>{c.cyl}</td>
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
// #36 — Heatmap (24h × 7day)
// ════════════════════════════════════════════════════════════
const D36 = () => {
  const [focusCell, setFocusCell] = useState({ d: 0, h: 9 });
  const [hasFocus, setHasFocus] = useState(false);
  const [hasHover, setHasHover] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [tableOpen, setTableOpen] = useState(false);
  const chartActive = hasFocus || hasHover;
  const cellRefs = useRef({});

  // [data-theme]을 따라가서 <10 셀 색을 결정 — paper 배경과 분명히 차이나도록
  useEffect(() => {
    const root = document.documentElement;
    const read = () => setIsDark(root.dataset.theme === 'dark');
    read();
    const obs = new MutationObserver(read);
    obs.observe(root, { attributes: true, attributeFilter: ['data-theme'] });
    return () => obs.disconnect();
  }, []);

  const W = 600, H = 240;
  const m = { t: 30, r: 8, b: 8, l: 40 };
  const iw = W - m.l - m.r;
  const ih = H - m.t - m.b;
  const cw = iw / 24;
  const ch = ih / 7;

  const maxVal = d3.max(ACTIVITY_DATA, (d) => d.value);
  const emptyColor = isDark ? '#0E0C0A' : '#FFFFFF';
  const colorFor = (v) => {
    if (v < 10) return emptyColor;
    if (v < 25) return '#E8D4B8';
    if (v < 45) return C.mustard;
    if (v < 65) return C.red;
    return C.navy;
  };

  const getCell = (d, h) => ACTIVITY_DATA.find((c) => c.dayIdx === d && c.hour === h);

  const moveFocus = (d, h) => {
    setFocusCell({ d, h });
    setTimeout(() => cellRefs.current[`${d}-${h}`]?.focus(), 0);
  };

  const cur = getCell(focusCell.d, focusCell.h);
  const allByDay = useMemo(() =>
    DAYS.map((d, di) => ({
      day: d,
      avg: d3.mean(ACTIVITY_DATA.filter((c) => c.dayIdx === di), (c) => c.value),
    })), []);
  const allByHour = useMemo(() =>
    d3.range(24).map((h) => ({
      hour: h,
      avg: d3.mean(ACTIVITY_DATA.filter((c) => c.hour === h), (c) => c.value),
    })), []);

  return (
    <div>
      <Usage mouse="셀 호버" keyboard="Tab → ←→↑↓로 셀 탐색" />

      <div role="toolbar"
        aria-label="요일 × 시간 활동 강도 heatmap, 7행 24열"
        onFocusCapture={() => setHasFocus(true)}
        onBlurCapture={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget)) setHasFocus(false);
        }}
        onMouseEnter={() => setHasHover(true)}
        onMouseLeave={() => setHasHover(false)}
        style={{
          background: C.paper,
          border: `1px solid ${C.rule}`,
          padding: 10,
          outline: hasFocus ? `1.5px dashed ${C.focus}` : '1.5px dashed transparent',
          outlineOffset: '-1.5px',
          transition: 'outline-color 0.12s',
        }}>
        <div style={{ position: 'relative', height: H }}>
          <svg viewBox={`0 0 ${W} ${H}`}
            preserveAspectRatio="none"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block', pointerEvents: 'none' }}
            aria-hidden="true">
            {ACTIVITY_DATA.map((c, i) => {
              const x = m.l + c.hour * cw;
              const y = m.t + c.dayIdx * ch;
              return (
                <rect key={i} x={x + 0.5} y={y + 0.5}
                  width={cw - 1} height={ch - 1}
                  fill={colorFor(c.value)} />
              );
            })}
          </svg>

          {/* HTML overlay */}
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
            {/* hour ticks (top) */}
            {d3.range(0, 24, 3).map((h) => (
              <div key={h} style={{
                position: 'absolute',
                left: `${((m.l + h * cw + cw / 2) / W) * 100}%`,
                top: 4,
                transform: 'translateX(-50%)',
                fontFamily: '"Courier New", Courier, monospace',
                fontSize: 10,
                color: C.inkSoft,
              }}>{h}시</div>
            ))}
            {/* day labels (left) */}
            {DAYS.map((d, i) => (
              <div key={d} style={{
                position: 'absolute',
                left: 4, top: `${((m.t + i * ch + ch / 2) / H) * 100}%`,
                transform: 'translateY(-50%)',
                width: m.l - 8,
                textAlign: 'right',
                fontFamily: '"Courier New", Courier, monospace',
                fontSize: 11,
                color: C.inkSoft,
              }}>{d}</div>
            ))}

            {/* cell buttons */}
            {ACTIVITY_DATA.map((c) => {
              const x = m.l + c.hour * cw;
              const y = m.t + c.dayIdx * ch;
              const isFocused = focusCell.d === c.dayIdx && focusCell.h === c.hour;
              const isActive = isFocused && chartActive;
              return (
                <button key={`${c.dayIdx}-${c.hour}`}
                  ref={(el) => { cellRefs.current[`${c.dayIdx}-${c.hour}`] = el; }}
                  type="button"
                  aria-label={`${c.day}요일 ${c.hour}시, 활동 ${c.value}`}
                  tabIndex={isFocused ? 0 : -1}
                  onClick={() => { setFocusCell({ d: c.dayIdx, h: c.hour }); }}
                  onMouseEnter={() => setFocusCell({ d: c.dayIdx, h: c.hour })}
                  onFocus={() => setFocusCell({ d: c.dayIdx, h: c.hour })}
                  onKeyDown={(e) => {
                    const { d, h } = focusCell;
                    if (e.key === 'ArrowRight') {
                      e.preventDefault(); moveFocus(d, Math.min(23, h + 1));
                    } else if (e.key === 'ArrowLeft') {
                      e.preventDefault(); moveFocus(d, Math.max(0, h - 1));
                    } else if (e.key === 'ArrowDown') {
                      e.preventDefault(); moveFocus(Math.min(6, d + 1), h);
                    } else if (e.key === 'ArrowUp') {
                      e.preventDefault(); moveFocus(Math.max(0, d - 1), h);
                    } else if (e.key === 'Home') {
                      e.preventDefault(); moveFocus(d, 0);
                    } else if (e.key === 'End') {
                      e.preventDefault(); moveFocus(d, 23);
                    }
                  }}
                  style={{
                    position: 'absolute',
                    left: `${(x / W) * 100}%`,
                    top: `${(y / H) * 100}%`,
                    width: `${(cw / W) * 100}%`,
                    height: `${(ch / H) * 100}%`,
                    background: 'transparent',
                    border: 'none', padding: 0, margin: 0,
                    cursor: 'pointer', outline: 'none',
                    boxShadow: isActive ? `inset 0 0 0 2px ${C.focus}, 0 0 0 1px ${C.focus}` : 'none',
                    zIndex: isActive ? 2 : 1,
                    pointerEvents: 'auto',
                  }} />
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex gap-3 mt-3 mb-3 items-start">
        <div>
          <div className="flex flex-wrap gap-3 text-[12px]" style={{ color: C.inkSoft }}>
            {[
              { l: '<10', c: emptyColor },
              { l: '10-25', c: '#E8D4B8' },
              { l: '25-45', c: C.mustard },
              { l: '45-65', c: C.red },
              { l: '65+', c: C.navy },
            ].map((b) => (
              <span key={b.l} className="flex items-center gap-1.5">
                <svg width="14" height="14" aria-hidden="true">
                  <rect width="14" height="14" fill={b.c} stroke={C.rule} />
                </svg>&nbsp;{b.l}
              </span>
            ))}
          </div>
          <div className="mt-2" aria-live="polite" style={{ color: C.ink }}>
            <strong>{cur.day}요일 {cur.hour}시</strong> — 활동 {cur.value}
            <span style={{ color: C.inkSoft }}>
              {' · '}요일 평균 {allByDay[cur.dayIdx].avg.toFixed(1)}{' · '}
              시간대 평균 {allByHour[cur.hour].avg.toFixed(1)}
            </span>
          </div></div>
        <button onClick={() => setTableOpen((v) => !v)} aria-expanded={tableOpen}
          aria-controls="d36-table"
          className="ml-auto"
          {...focusable}>
          {tableOpen ? '데이터 표 닫기' : '7요일 × 24시간 = 168셀'}
        </button>
      </div>
      {tableOpen && (
        <div id="d36-table" className="text-[12px]">
          <table>
            <caption>요일별 평균 활동</caption>
            <thead>
              <tr>{['요일', '평균 활동', '최대', '피크 시간'].map((h) => <th key={h} scope="col">{h}</th>)}</tr>
            </thead>
            <tbody>
              {DAYS.map((d, di) => {
                const cells = ACTIVITY_DATA.filter((c) => c.dayIdx === di);
                const max = cells.reduce((a, b) => a.value > b.value ? a : b);
                return (
                  <tr key={d}>
                    <td>{d}</td>
                    <td>{d3.mean(cells, (c) => c.value).toFixed(1)}</td>
                    <td>{max.value}</td>
                    <td>{max.hour}시</td>
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
// META
// ════════════════════════════════════════════════════════════
const META = {
  33: {
    title: 'Violin Plot',
    method: 'KDE 분포 + 박스플롯 통합 · 학과별 GPA',
    interactions: [
      'KDE로 매끄러운 분포 형태 표현',
      '안에 박스(Q1-Q3) + 중앙값 + whisker 모두 포함',
      '학과 호버/클릭 시 그것만 강조, 나머지 dim',
      '4개 통계 카드(N/평균/중앙값/IQR)가 활성 학과 기준 즉시 갱신',
    ],
    a11y: [
      'roving tabindex — 활성 학과만 tabIndex=0',
      '←→ Home/End로 학과 사이 이동',
      'SVG는 violin/박스만, 텍스트(축·라벨·통계)는 HTML로 분리 (찌그러짐 방지)',
      'aria-live로 활성 학과의 N·평균·중앙값·IQR·범위 자연어 안내',
      'preserveAspectRatio=none + vectorEffect=non-scaling-stroke',
      '데이터 표에 5개 학과의 6개 통계량 명시',
    ],
  },
  34: {
    title: 'Ridgeline Plot',
    method: '12개월 강수량 분포 · joy division 스타일 겹침',
    interactions: [
      '각 행이 한 달의 KDE 분포',
      '서로 겹쳐 그려 변화 패턴 강조',
      '활성 월만 진하게, 중앙값에 점선 표시',
      '7-8월의 장마 분포가 우측으로 길게 늘어진 것이 한눈에',
    ],
    a11y: [
      '↑↓ ←→로 월 사이 이동 (동일 동작)',
      'roving tabindex로 활성 월 1개만 Tab 진입',
      'SVG는 ridge path만, 월 라벨·축·tooltip은 HTML',
      'aria-live로 활성 월의 평균·중앙값·N 안내',
      '각 ridge가 button으로 키보드 직접 접근 가능',
    ],
  },
  35: {
    title: 'Parallel Coordinates',
    method: '5개 변수 자동차 데이터 · 축별 dual range slider',
    interactions: [
      '각 축이 다른 변수, 자동차는 5개 축을 가로지르는 선',
      '활성 축의 brush 슬라이더로 그 변수 범위 필터',
      '여러 축에 동시 brush 가능 (AND 조건)',
      '필터 안 들어가는 자동차는 매우 옅게',
      'typeIdx별 색 코딩 (세단/SUV/쿠페)',
    ],
    a11y: [
      '←→로 활성 축 변경 → 하단 슬라이더가 그 축 범위 조정',
      'dual range slider로 키보드만으로 임의 범위 brush 가능',
      'aria-valuetext로 "X부터 Y까지" 자연어 안내',
      '범례에 색·타입 명시',
      '매치 수를 항상 명시, 데이터 표로 결과 검증',
    ],
  },
  36: {
    title: 'Heatmap · 24h × 7day',
    method: '활동 강도 매트릭스 · 5단계 색 양자화',
    interactions: [
      '7요일 × 24시간 = 168 셀',
      '5단계로 양자화한 색 (셀별 절대값)',
      '셀 호버/포커스 시 해당 요일+시간의 정확한 값',
      '활성 셀의 요일·시간대 평균을 비교용으로 추가 표시',
    ],
    a11y: [
      '←→↑↓로 셀 사이 격자 탐색, Home/End로 같은 요일 양 끝',
      'roving tabindex — 활성 셀만 tabIndex=0',
      '5단계 양자화 + 범례 — 색 차이가 무한히 다양하지 않음',
      'aria-label에 "요일 시 활동 값" 모두 명시',
      'aria-live로 절대값 + 요일평균 + 시간대평균 비교 가능',
      '데이터 표에 요일별 평균·최대·피크 시간 요약',
    ],
  },
};

// ════════════════════════════════════════════════════════════
// CARD + EXPORT
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
  { num: 33, cat: 'DISTRIBUTION', cmp: <D33 /> },
  { num: 34, cat: 'DISTRIBUTION', cmp: <D34 /> },
  { num: 35, cat: 'MULTIVARIATE', cmp: <D35 /> },
  { num: 36, cat: 'MATRIX', cmp: <D36 /> },
];

export default function Phase5() {
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
