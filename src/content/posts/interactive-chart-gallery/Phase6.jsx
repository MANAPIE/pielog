import React, { useState, useEffect, useRef, useMemo } from 'react';
import * as d3 from 'd3';

// PALETTE
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

const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
const makeRng = (seed) => () => {
  seed = (seed * 1664525 + 1013904223) % 4294967296;
  return seed / 4294967296;
};

// ════════════════════════════════════════════════════════════
// DATA — 5년치 월별 매출 (60개월)
// trend: 선형 증가, seasonal: 12개월 주기, noise: 가우시안
// ════════════════════════════════════════════════════════════
const MONTHS = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
const TS_DATA = (() => {
  const rng = makeRng(23);
  const boxMuller = () => Math.sqrt(-2 * Math.log(Math.max(1e-9, rng()))) * Math.cos(2 * Math.PI * rng());
  const arr = [];
  for (let i = 0; i < 60; i++) {
    const year = 2020 + Math.floor(i / 12);
    const month = i % 12;
    const trend = 100 + i * 1.8;
    // 계절성: 11-1월 피크 (연말 시즌), 7-8월 하락
    const seasonal = 35 * Math.cos(((month - 11) / 12) * 2 * Math.PI);
    const noise = boxMuller() * 8;
    const value = Math.round(clamp(trend + seasonal + noise, 50, 500));
    arr.push({ idx: i, year, month, label: `${year}.${month + 1}`, value });
  }
  return arr;
})();

// 이동평균 (centered, window=12)
const movingAvg = (data, window = 12) => {
  const half = Math.floor(window / 2);
  return data.map((d, i) => {
    const start = Math.max(0, i - half);
    const end = Math.min(data.length, i + half + 1);
    const slice = data.slice(start, end);
    return { ...d, trendValue: d3.mean(slice, (x) => x.value) };
  });
};

// 분해
const decompose = (data) => {
  const withTrend = movingAvg(data, 12);
  // detrended
  const detrended = withTrend.map((d) => ({
    ...d,
    detrended: d.value - d.trendValue,
  }));
  // 월별 평균 (계절성)
  const seasonalByMonth = {};
  for (let m = 0; m < 12; m++) {
    const vals = detrended.filter((d) => d.month === m).map((d) => d.detrended);
    seasonalByMonth[m] = d3.mean(vals);
  }
  // residual = original - trend - seasonal
  return detrended.map((d) => ({
    ...d,
    seasonalValue: seasonalByMonth[d.month],
    residual: d.value - d.trendValue - seasonalByMonth[d.month],
  }));
};

const DECOMPOSED = decompose(TS_DATA);

// ════════════════════════════════════════════════════════════
// 공통 차트 헬퍼 (HTML overlay 패턴)
// ════════════════════════════════════════════════════════════
// 컨테이너 픽셀 폭에 맞춰 viewBox W를 갱신해서 1 user-unit = 1px를 유지.
const useChartW = (initial = 580) => {
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

const useChartFocus = () => {
  const [hasFocus, setHasFocus] = useState(false);  // 키보드 포커스
  const [hasHover, setHasHover] = useState(false);
  const isActive = hasFocus || hasHover;
  return {
    hasFocus: isActive,         // 차트 내부 요소 강조용 (호버 + 포커스 모두)
    isKeyboardFocus: hasFocus,  // 컨테이너 outline 전용
    handlers: {
      onFocusCapture: () => setHasFocus(true),
      onBlurCapture: (e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setHasFocus(false);
      },
      onMouseEnter: () => setHasHover(true),
      onMouseLeave: () => setHasHover(false),
    },
    style: {
      background: C.paper,
      border: `1px solid ${C.rule}`,
      padding: 10,
      // outline은 키보드 포커스 시에만 — 호버는 가벼운 탐색
      outline: hasFocus ? `1.5px dashed ${C.focus}` : '1.5px dashed transparent',
      outlineOffset: '-1.5px',
      transition: 'outline-color 0.12s',
    },
  };
};

// ════════════════════════════════════════════════════════════
// #37 — Trend Decomposition (4-panel)
// ════════════════════════════════════════════════════════════
const D37 = () => {
  const [focusIdx, setFocusIdx] = useState(30);
  const [tableOpen, setTableOpen] = useState(false);
  const focus = useChartFocus();
  const refs = useRef([]);

  const [chartRef, W] = useChartW(580); const panelH = 90;
  const m = { t: 14, r: 16, b: 18, l: 48 };
  const iw = W - m.l - m.r;
  const ih = panelH - m.t - m.b;

  const xStep = iw / (TS_DATA.length - 1);
  const xAt = (i) => m.l + i * xStep;

  const PANELS = [
    { key: 'value', label: '원본', color: C.ink, valMin: 50, valMax: 380 },
    { key: 'trendValue', label: '추세 (12개월 이동평균)', color: C.red, valMin: 80, valMax: 280 },
    { key: 'seasonalValue', label: '계절성 (월별 편차)', color: C.olive, valMin: -50, valMax: 50 },
    { key: 'residual', label: '잔차', color: C.mustard, valMin: -40, valMax: 40 },
  ];

  const scales = PANELS.map((p) =>
    d3.scaleLinear().domain([p.valMin, p.valMax]).range([panelH - m.b, m.t]));

  const moveFocus = (next) => {
    refs.current[next]?.focus();
    setFocusIdx(next);
  };

  const cur = DECOMPOSED[focusIdx];

  return (
    <div>
      <Usage mouse="포인트 호버" keyboard="Tab → ←→로 시점 탐색" />

      <div ref={chartRef} role="toolbar"
        aria-label="시계열 분해, 4개 패널 (원본·추세·계절성·잔차)"
        {...focus.handlers}
        style={{
          outline: focus.isKeyboardFocus ? `1.5px dashed ${C.focus}` : '1.5px dashed transparent',
          outlineOffset: '-1.5px',
          transition: 'outline-color 0.12s',
        }}>
        {PANELS.map((p, pIdx) => {
          const scale = scales[pIdx];
          // line path
          const path = DECOMPOSED.map((d, i) =>
            `${i === 0 ? 'M' : 'L'}${xAt(i)},${scale(d[p.key])}`).join(' ');
          // baseline for centered metrics
          const zeroY = (p.key === 'seasonalValue' || p.key === 'residual')
            ? scale(0) : null;
          return (
            <div key={p.key} style={{ marginBottom: pIdx < PANELS.length - 1 ? 8 : 0 }}>
              <div style={{ fontSize: '12px', fontWeight: 700, letterSpacing: 0, marginBottom: '6px', color: C.inkSoft }}>
                {p.label}
              </div>
              <div style={{ position: 'relative', height: panelH, background: C.paper, border: `1px solid ${C.rule}` }}>
                <svg viewBox={`0 0 ${W} ${panelH}`}
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block', pointerEvents: 'none' }}
                  aria-hidden="true">
                  {/* y axis ticks */}
                  {[p.valMin, (p.valMin + p.valMax) / 2, p.valMax].map((v) => (
                    <line key={v} x1={m.l} x2={W - m.r}
                      y1={scale(v)} y2={scale(v)}
                      stroke={C.ruleSoft} strokeWidth={1}
                      vectorEffect="non-scaling-stroke" />
                  ))}
                  {zeroY != null && (
                    <line x1={m.l} x2={W - m.r}
                      y1={zeroY} y2={zeroY}
                      stroke={C.inkFaint} strokeWidth={1}
                      strokeDasharray="2 2"
                      vectorEffect="non-scaling-stroke" />
                  )}
                  {/* main line */}
                  <path d={path} fill="none"
                    stroke={p.color} strokeWidth={1.5}
                    vectorEffect="non-scaling-stroke" />
                  {/* focus point */}
                  {DECOMPOSED[focusIdx] && (
                    <>
                      <line x1={xAt(focusIdx)} x2={xAt(focusIdx)}
                        y1={m.t} y2={panelH - m.b}
                        stroke={focus.hasFocus ? C.focus : C.inkFaint}
                        strokeWidth={focus.hasFocus ? 1.5 : 1}
                        strokeDasharray={focus.hasFocus ? '0' : '2 2'}
                        vectorEffect="non-scaling-stroke" />
                      <circle cx={xAt(focusIdx)} cy={scale(DECOMPOSED[focusIdx][p.key])}
                        r={3.5} fill={p.color}
                        stroke={C.paper} strokeWidth={1.5}
                        vectorEffect="non-scaling-stroke" />
                    </>
                  )}
                </svg>

                {/* y-axis labels + value display */}
                <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                  {[p.valMin, p.valMax].map((v) => (
                    <div key={v} style={{
                      position: 'absolute',
                      left: 0, width: `${((m.l - 4) / W) * 100}%`,
                      top: `${(scale(v) / panelH) * 100}%`,
                      transform: 'translateY(-50%)',
                      textAlign: 'right',
                      fontFamily: '"Courier New", Courier, monospace',
                      fontSize: 9,
                      color: C.inkFaint,
                    }}>{Math.round(v)}</div>
                  ))}
                  {/* focus 값 */}
                  <div style={{
                    position: 'absolute',
                    right: 4, top: 2,
                    fontFamily: '"Courier New", Courier, monospace',
                    fontSize: 10,
                    color: p.color, fontWeight: 700,
                  }}>{cur[p.key]?.toFixed(1) ?? '—'}</div>
                </div>
              </div>
            </div>
          );
        })}

        {/* shared x-axis buttons */}
        <div style={{ position: 'relative', height: 20, marginTop: 4 }}>
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
            {/* year labels */}
            {[2020, 2021, 2022, 2023, 2024].map((y, yi) => {
              const monthIdx = yi * 12 + 6;
              return (
                <div key={y} style={{
                  position: 'absolute',
                  left: `${(xAt(monthIdx) / W) * 100}%`,
                  top: 4,
                  transform: 'translateX(-50%)',
                  fontFamily: '"Courier New", Courier, monospace',
                  fontSize: 10,
                  color: C.inkSoft,
                }}>{y}</div>
              );
            })}

            {/* invisible buttons for each month */}
            {DECOMPOSED.map((d, i) => (
              <button key={i}
                ref={(el) => { refs.current[i] = el; }}
                type="button"
                aria-label={`${d.label} — 원본 ${d.value}, 추세 ${d.trendValue.toFixed(0)}, 계절성 ${d.seasonalValue.toFixed(1)}, 잔차 ${d.residual.toFixed(1)}`}
                tabIndex={focusIdx === i ? 0 : -1}
                onClick={() => { refs.current[i]?.focus(); setFocusIdx(i); }}
                onMouseEnter={() => setFocusIdx(i)}
                onFocus={() => setFocusIdx(i)}
                onKeyDown={(e) => {
                  if (e.key === 'ArrowRight') {
                    e.preventDefault(); moveFocus(Math.min(DECOMPOSED.length - 1, i + 1));
                  } else if (e.key === 'ArrowLeft') {
                    e.preventDefault(); moveFocus(Math.max(0, i - 1));
                  } else if (e.key === 'Home') {
                    e.preventDefault(); moveFocus(0);
                  } else if (e.key === 'End') {
                    e.preventDefault(); moveFocus(DECOMPOSED.length - 1);
                  }
                }}
                style={{
                  position: 'absolute',
                  left: `${((xAt(i) - xStep / 2) / W) * 100}%`,
                  width: `${(xStep / W) * 100}%`,
                  top: -360, height: 380, // 위 panels 모두 덮음
                  background: 'transparent',
                  border: 'none', padding: 0,
                  cursor: 'pointer', outline: 'none',
                  pointerEvents: 'auto',
                  zIndex: focusIdx === i ? 2 : 1,
                }} />
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-3 mt-3 mb-3 items-start">
        <div aria-live="polite" style={{ color: C.ink }}>
          <strong>{cur.label}</strong> — 원본 {cur.value} ={' '}
          <span style={{ color: C.red }}>추세 {cur.trendValue.toFixed(1)}</span> +{' '}
          <span style={{ color: C.olive }}>계절성 {cur.seasonalValue.toFixed(1)}</span> +{' '}
          <span style={{ color: C.mustard }}>잔차 {cur.residual.toFixed(1)}</span>
        </div>
        <button onClick={() => setTableOpen((v) => !v)} aria-expanded={tableOpen}
          aria-controls="d37-table"
          className="ml-auto"
          {...focusable}>
          {tableOpen ? '데이터 표 닫기' : '60개월 분해 데이터'}
        </button>
      </div>
      {tableOpen && (
        <div id="d37-table" className="text-[12px]">
          <table>
            <caption>시계열 분해 데이터</caption>
            <thead>
              <tr>{['시점', '원본', '추세', '계절성', '잔차'].map((h) => <th key={h} scope="col">{h}</th>)}</tr>
            </thead>
            <tbody>
              {DECOMPOSED.map((d) => (
                <tr key={d.label}>
                  <td>{d.label}</td>
                  <td>{d.value}</td>
                  <td>{d.trendValue.toFixed(1)}</td>
                  <td>{d.seasonalValue.toFixed(1)}</td>
                  <td>{d.residual.toFixed(1)}</td>
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
// #38 — Seasonal Subseries
// ════════════════════════════════════════════════════════════
const D38 = () => {
  const [focusMonth, setFocusMonth] = useState(11); // 12월
  const [tableOpen, setTableOpen] = useState(false);
  const focus = useChartFocus();
  const refs = useRef([]);

  const [chartRef, W] = useChartW(580); const H = 240;
  const m = { t: 12, r: 8, b: 30, l: 38 };
  const iw = W - m.l - m.r;
  const ih = H - m.t - m.b;
  const monthW = iw / 12;
  // 각 월 안에 5년치 데이터 (12 patches)
  const yearsCount = 5;
  const innerStep = (monthW - 6) / (yearsCount - 1);

  const yScale = d3.scaleLinear().domain([50, 380]).range([H - m.b, m.t]);

  // 월별로 그룹
  const byMonth = useMemo(() => {
    return d3.range(12).map((mIdx) => {
      const items = TS_DATA.filter((d) => d.month === mIdx);
      return {
        month: mIdx,
        items,
        mean: d3.mean(items, (d) => d.value),
      };
    });
  }, []);

  const moveFocus = (next) => {
    refs.current[next]?.focus();
    setFocusMonth(next);
  };

  const cur = byMonth[focusMonth];

  return (
    <div>
      <Usage mouse="월 호버" keyboard="Tab → ←→ 월 사이 이동" />

      <div ref={chartRef} role="toolbar"
        aria-label="seasonal subseries — 월별 추이 비교"
        {...focus.handlers}
        style={focus.style}>
        <div style={{ position: 'relative', height: H }}>
          <svg viewBox={`0 0 ${W} ${H}`}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block', pointerEvents: 'none' }}
            aria-hidden="true">
            {/* y grid */}
            {[100, 200, 300].map((v) => (
              <line key={v} x1={m.l} x2={W - m.r}
                y1={yScale(v)} y2={yScale(v)}
                stroke={C.ruleSoft} strokeWidth={1}
                vectorEffect="non-scaling-stroke" />
            ))}

            {byMonth.map((mData, mIdx) => {
              const x0 = m.l + mIdx * monthW + 3;
              const isFocused = focusMonth === mIdx && focus.hasFocus;
              const sortedItems = [...mData.items].sort((a, b) => a.year - b.year);
              // line for this month across years
              const path = sortedItems.map((it, i) =>
                `${i === 0 ? 'M' : 'L'}${x0 + i * innerStep},${yScale(it.value)}`).join(' ');
              // mean line
              return (
                <g key={mIdx}>
                  {/* month separator */}
                  {mIdx > 0 && (
                    <line x1={m.l + mIdx * monthW} x2={m.l + mIdx * monthW}
                      y1={m.t} y2={H - m.b}
                      stroke={C.ruleSoft} strokeWidth={1}
                      vectorEffect="non-scaling-stroke" />
                  )}
                  {/* mean horizontal line */}
                  <line x1={x0 - 2} x2={x0 + (yearsCount - 1) * innerStep + 2}
                    y1={yScale(mData.mean)} y2={yScale(mData.mean)}
                    stroke={isFocused ? C.red : C.inkFaint}
                    strokeWidth={isFocused ? 2 : 1}
                    vectorEffect="non-scaling-stroke" />
                  {/* main line */}
                  <path d={path}
                    fill="none"
                    stroke={isFocused ? C.ink : C.navy}
                    strokeWidth={isFocused ? 2 : 1.2}
                    strokeOpacity={focus.hasFocus ? (isFocused ? 1 : 0.3) : 0.7}
                    vectorEffect="non-scaling-stroke" />
                  {/* dots */}
                  {sortedItems.map((it, i) => (
                    <circle key={i}
                      cx={x0 + i * innerStep}
                      cy={yScale(it.value)} r={isFocused ? 2.5 : 1.8}
                      fill={isFocused ? C.ink : C.navy}
                      fillOpacity={focus.hasFocus ? (isFocused ? 1 : 0.3) : 0.85}
                      vectorEffect="non-scaling-stroke" />
                  ))}
                </g>
              );
            })}
          </svg>

          {/* HTML overlay */}
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
            {/* y labels */}
            {[100, 200, 300].map((v) => (
              <div key={v} style={{
                position: 'absolute',
                left: 0, width: `${((m.l - 4) / W) * 100}%`,
                top: `${(yScale(v) / H) * 100}%`,
                transform: 'translateY(-50%)',
                textAlign: 'right',
                fontFamily: '"Courier New", Courier, monospace',
                fontSize: 10,
                color: C.inkSoft,
              }}>{v}</div>
            ))}

            {/* month labels + buttons */}
            {byMonth.map((mData, mIdx) => {
              const x0 = m.l + mIdx * monthW;
              const isFocused = focusMonth === mIdx;
              const isActive = isFocused && focus.hasFocus;
              return (
                <div key={mIdx} style={{
                  position: 'absolute',
                  left: `${(x0 / W) * 100}%`,
                  width: `${(monthW / W) * 100}%`,
                  top: 0, bottom: 0,
                  pointerEvents: 'none',
                }}>
                  {/* month label */}
                  <div style={{
                    position: 'absolute',
                    left: 0, right: 0,
                    bottom: `${((m.b - 18) / H) * 100}%`,
                    textAlign: 'center',
                    fontFamily: '"Courier New", Courier, monospace',
                    fontSize: 10,
                    color: isActive ? C.red : C.inkSoft,
                    fontWeight: isActive ? 700 : 500,
                  }}>{mIdx + 1}월</div>
                  <div style={{
                    position: 'absolute',
                    left: 0, right: 0,
                    bottom: `${((m.b - 32) / H) * 100}%`,
                    textAlign: 'center',
                    fontFamily: '"Courier New", Courier, monospace',
                    fontSize: 9,
                    color: C.inkFaint,
                  }}>μ {mData.mean.toFixed(0)}</div>

                  <button
                    ref={(el) => { refs.current[mIdx] = el; }}
                    type="button"
                    aria-pressed={isActive}
                    aria-label={`${mIdx + 1}월, 5년 평균 ${mData.mean.toFixed(0)}`}
                    tabIndex={focusMonth === mIdx ? 0 : -1}
                    onClick={() => { refs.current[mIdx]?.focus(); setFocusMonth(mIdx); }}
                    onMouseEnter={() => setFocusMonth(mIdx)}
                    onFocus={() => setFocusMonth(mIdx)}
                    onKeyDown={(e) => {
                      if (e.key === 'ArrowRight') {
                        e.preventDefault(); moveFocus(Math.min(11, mIdx + 1));
                      } else if (e.key === 'ArrowLeft') {
                        e.preventDefault(); moveFocus(Math.max(0, mIdx - 1));
                      } else if (e.key === 'Home') {
                        e.preventDefault(); moveFocus(0);
                      } else if (e.key === 'End') {
                        e.preventDefault(); moveFocus(11);
                      }
                    }}
                    style={{
                      position: 'absolute',
                      left: 2, right: 2,
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
          </div>
        </div>
      </div>

      <div className="flex gap-3 mt-3 mb-3 items-start">
        <div aria-live="polite" style={{ color: C.ink }}>
          <strong>{focusMonth + 1}월</strong> — 5년 평균 {cur.mean.toFixed(0)},
          2020년 {cur.items.find(i => i.year === 2020)?.value} →
          2024년 {cur.items.find(i => i.year === 2024)?.value}
        </div>
        <button onClick={() => setTableOpen((v) => !v)} aria-expanded={tableOpen}
          aria-controls="d38-table"
          className="ml-auto"
          {...focusable}>
          {tableOpen ? '데이터 표 닫기' : '12개월 × 5년 = 60 포인트'}
        </button>
      </div>
      {tableOpen && (
        <div id="d38-table" className="text-[12px]">
          <table>
            <caption>월별 5년 추이</caption>
            <thead>
              <tr>{['월', '5년 평균', '2020', '2021', '2022', '2023', '2024'].map((h) => <th key={h} scope="col">{h}</th>)}</tr>
            </thead>
            <tbody>
              {byMonth.map((mo) => (
                <tr key={mo.month}>
                  <td>{mo.month + 1}월</td>
                  <td>{mo.mean.toFixed(0)}</td>
                  {[2020, 2021, 2022, 2023, 2024].map((y) => (
                    <td key={y}>{mo.items.find((i) => i.year === y)?.value ?? '—'}</td>
                  ))}
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
// #39 — Year-over-Year (YoY) 비교
// ════════════════════════════════════════════════════════════
const D39 = () => {
  const [activeYears, setActiveYears] = useState(new Set([2023, 2024]));
  const [focusIdx, setFocusIdx] = useState(0);
  const [tableOpen, setTableOpen] = useState(false);
  const focus = useChartFocus();
  const refs = useRef([]);

  const [chartRef, W] = useChartW(580); const H = 280;
  const m = { t: 16, r: 16, b: 30, l: 40 };
  const iw = W - m.l - m.r;
  const ih = H - m.t - m.b;
  const xStep = iw / 11;
  const xAt = (mIdx) => m.l + mIdx * xStep;

  const YEARS = [2020, 2021, 2022, 2023, 2024];
  const byYear = useMemo(() =>
    YEARS.map((y) => ({
      year: y,
      values: TS_DATA.filter((d) => d.year === y),
    })), []);

  const yScale = d3.scaleLinear().domain([50, 380]).range([H - m.b, m.t]);

  const toggleYear = (y) => {
    setActiveYears((s) => {
      const n = new Set(s);
      n.has(y) ? n.delete(y) : n.add(y);
      return n;
    });
  };

  const moveFocus = (next) => {
    refs.current[next]?.focus();
    setFocusIdx(next);
  };

  // 활성 연도들의 한 달 값들
  const activeYearList = [...activeYears].sort();
  const monthData = focusIdx >= 0 ? activeYearList.map((y) => {
    const yd = byYear.find((b) => b.year === y);
    return { year: y, value: yd.values[focusIdx]?.value };
  }) : [];

  return (
    <div>
      <Usage mouse="연도 칩 토글 · 월 호버"
        keyboard="Tab → 월 ←→ 탐색, 연도 칩 별도 Tab" />

      {/* 연도 토글 */}
      <div className="flex flex-wrap gap-3 mb-3" role="group" aria-label="비교할 연도 선택">
        {YEARS.map((y, i) => {
          const on = activeYears.has(y);
          return (
            <button key={y} onClick={() => toggleYear(y)}
              aria-pressed={on}
              style={{
                background: on ? SERIES[i] : 'transparent',
                color: on ? C.paper : C.inkSoft,
                border: `1px solid ${on ? SERIES[i] : C.rule}`,
              }} {...focusable}>
              ━ {y}
            </button>
          );
        })}
      </div>

      <div role="toolbar"
        aria-label={`연도 비교 차트, ${activeYearList.length}개 연도 표시 중`}
        {...focus.handlers}
        style={focus.style}>
        <div style={{ position: 'relative', height: H }}>
          <svg viewBox={`0 0 ${W} ${H}`}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block', pointerEvents: 'none' }}
            aria-hidden="true">
            {/* y grid */}
            {[100, 200, 300].map((v) => (
              <line key={v} x1={m.l} x2={W - m.r}
                y1={yScale(v)} y2={yScale(v)}
                stroke={C.ruleSoft} strokeWidth={1}
                vectorEffect="non-scaling-stroke" />
            ))}

            {/* 활성 연도들의 라인 */}
            {byYear.map((yd, yi) => {
              const isOn = activeYears.has(yd.year);
              if (!isOn) return null;
              const sortedV = [...yd.values].sort((a, b) => a.month - b.month);
              const path = sortedV.map((d, i) =>
                `${i === 0 ? 'M' : 'L'}${xAt(d.month)},${yScale(d.value)}`).join(' ');
              return (
                <g key={yd.year}>
                  <path d={path}
                    fill="none" stroke={SERIES[yi]} strokeWidth={2}
                    vectorEffect="non-scaling-stroke" />
                  {sortedV.map((d, i) => (
                    <circle key={i} cx={xAt(d.month)} cy={yScale(d.value)}
                      r={2.5} fill={SERIES[yi]}
                      stroke={C.paper} strokeWidth={1}
                      vectorEffect="non-scaling-stroke" />
                  ))}
                </g>
              );
            })}

            {/* focus crosshair */}
            {focus.hasFocus && (
              <line x1={xAt(focusIdx)} x2={xAt(focusIdx)}
                y1={m.t} y2={H - m.b}
                stroke={C.focus} strokeWidth={1.5}
                strokeDasharray="3 2"
                vectorEffect="non-scaling-stroke" />
            )}
          </svg>

          {/* HTML overlay */}
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
            {/* y labels */}
            {[100, 200, 300].map((v) => (
              <div key={v} style={{
                position: 'absolute',
                left: 0, width: `${((m.l - 4) / W) * 100}%`,
                top: `${(yScale(v) / H) * 100}%`,
                transform: 'translateY(-50%)',
                textAlign: 'right',
                fontFamily: '"Courier New", Courier, monospace',
                fontSize: 10,
                color: C.inkSoft,
              }}>{v}</div>
            ))}

            {/* month buttons */}
            {MONTHS.map((mLabel, mIdx) => {
              const isFocused = focusIdx === mIdx;
              const isActive = isFocused && focus.hasFocus;
              return (
                <div key={mIdx} style={{
                  position: 'absolute',
                  left: `${((xAt(mIdx) - xStep / 2) / W) * 100}%`,
                  width: `${(xStep / W) * 100}%`,
                  top: 0, bottom: 0,
                  pointerEvents: 'none',
                }}>
                  <div style={{
                    position: 'absolute',
                    bottom: `${((m.b - 18) / H) * 100}%`,
                    left: 0, right: 0,
                    textAlign: 'center',
                    fontFamily: '"Courier New", Courier, monospace',
                    fontSize: 10,
                    color: isActive ? C.ink : C.inkSoft,
                    fontWeight: isActive ? 700 : 400,
                  }}>{mIdx + 1}</div>

                  <button
                    ref={(el) => { refs.current[mIdx] = el; }}
                    type="button"
                    aria-pressed={isActive}
                    aria-label={`${mIdx + 1}월${activeYearList.length > 0
                      ? ' — ' + activeYearList.map((y) => {
                        const v = byYear.find((b) => b.year === y).values[mIdx]?.value;
                        return `${y}년 ${v}`;
                      }).join(', ')
                      : ''}`}
                    tabIndex={focusIdx === mIdx ? 0 : -1}
                    onClick={() => { refs.current[mIdx]?.focus(); setFocusIdx(mIdx); }}
                    onMouseEnter={() => setFocusIdx(mIdx)}
                    onFocus={() => setFocusIdx(mIdx)}
                    onKeyDown={(e) => {
                      if (e.key === 'ArrowRight') {
                        e.preventDefault(); moveFocus(Math.min(11, mIdx + 1));
                      } else if (e.key === 'ArrowLeft') {
                        e.preventDefault(); moveFocus(Math.max(0, mIdx - 1));
                      } else if (e.key === 'Home') {
                        e.preventDefault(); moveFocus(0);
                      } else if (e.key === 'End') {
                        e.preventDefault(); moveFocus(11);
                      }
                    }}
                    style={{
                      position: 'absolute',
                      left: 0, right: 0,
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
          </div>
        </div>
      </div>

      <div className="flex gap-3 mt-3 mb-3 items-start">
        <div aria-live="polite" style={{ color: C.ink }}>
          <strong>{focusIdx + 1}월</strong> —{' '}
          {monthData.length > 0
            ? monthData.map((d, i) => (
              <span key={d.year}>
                {i > 0 && ' · '}
                <span style={{ color: SERIES[YEARS.indexOf(d.year)], fontWeight: 700 }}>
                  {d.year}년 {d.value}
                </span>
              </span>
            ))
            : '연도를 선택하세요'}
        </div>
        <div className="ml-auto">
          <button onClick={() => setTableOpen((v) => !v)} aria-expanded={tableOpen}
            aria-controls="d39-table"
            className="ml-auto"
            {...focusable}>
            {tableOpen ? '데이터 표 닫기' : '12개월 × 5년'}
          </button>
        </div>
      </div>
      {tableOpen && (
        <div id="d39-table" className="text-[12px]">
          <table>
            <caption>월별 연도 비교</caption>
            <thead>
              <tr>
                <th scope="col">월</th>
                {YEARS.map((y) => <th key={y} scope="col">{y}</th>)}
              </tr>
            </thead>
            <tbody>
              {MONTHS.map((_, mIdx) => (
                <tr key={mIdx}>
                  <td>{mIdx + 1}월</td>
                  {YEARS.map((y) => (
                    <td key={y}>{byYear.find((b) => b.year === y).values[mIdx]?.value ?? '—'}</td>
                  ))}
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
// #40 — Forecast (simple)
// ════════════════════════════════════════════════════════════
const D40 = () => {
  const [horizon, setHorizon] = useState(12);
  const [focusIdx, setFocusIdx] = useState(60); // 첫 예측 시점
  const [tableOpen, setTableOpen] = useState(false);
  const focus = useChartFocus();
  const refs = useRef([]);

  // 단순 예측: 추세선 외삽 + 계절성 적용 + 잔차 std로 신뢰구간
  const forecast = useMemo(() => {
    // 추세 기울기 (선형 회귀)
    const xs = DECOMPOSED.map((d) => d.idx);
    const ys = DECOMPOSED.map((d) => d.trendValue).filter((v) => !isNaN(v));
    const validXs = xs.slice(6, -6); // 가장자리 NaN 제외
    const validYs = ys;
    const meanX = d3.mean(validXs);
    const meanY = d3.mean(validYs);
    const slope = d3.sum(validXs.map((x, i) =>
      (x - meanX) * (validYs[i] - meanY))) /
      d3.sum(validXs.map((x) => (x - meanX) ** 2));
    const intercept = meanY - slope * meanX;

    // 잔차 std
    const residualStd = Math.sqrt(d3.mean(DECOMPOSED.map((d) => d.residual ** 2)));

    // 계절성 (월별)
    const seasonalByMonth = {};
    for (let m = 0; m < 12; m++) {
      seasonalByMonth[m] = DECOMPOSED.find((d) => d.month === m && !isNaN(d.seasonalValue))?.seasonalValue || 0;
    }

    const forecasts = [];
    for (let i = 0; i < horizon; i++) {
      const idx = 60 + i;
      const month = idx % 12;
      const trendVal = intercept + slope * idx;
      const seasonal = seasonalByMonth[month];
      const point = trendVal + seasonal;
      // 신뢰구간 (예측 거리에 따라 증가)
      const ci = residualStd * Math.sqrt(1 + i * 0.1) * 1.96;
      forecasts.push({
        idx, month,
        year: 2025 + Math.floor(i / 12),
        label: `${2025 + Math.floor(i / 12)}.${month + 1}`,
        value: point,
        ciLower: point - ci,
        ciUpper: point + ci,
      });
    }
    return forecasts;
  }, [horizon]);

  const [chartRef, W] = useChartW(580); const H = 240;
  const m = { t: 14, r: 16, b: 28, l: 40 };
  const iw = W - m.l - m.r;
  const ih = H - m.t - m.b;
  const totalLen = TS_DATA.length + horizon;
  const xStep = iw / (totalLen - 1);
  const xAt = (i) => m.l + i * xStep;

  const allMaxV = Math.max(
    d3.max(TS_DATA, (d) => d.value),
    d3.max(forecast, (d) => d.ciUpper)
  );
  const yScale = d3.scaleLinear().domain([50, allMaxV + 20]).range([H - m.b, m.t]);

  const all = [...TS_DATA, ...forecast];

  const moveFocus = (next) => {
    refs.current[next]?.focus();
    setFocusIdx(next);
  };

  const cur = all[focusIdx];
  const isForecast = focusIdx >= TS_DATA.length;

  return (
    <div>
      <Usage mouse="시점 호버 · 예측 기간 슬라이더"
        keyboard="Tab → ←→로 시점 탐색" />

      <div ref={chartRef} role="toolbar"
        aria-label={`매출 forecast, 과거 60개월 + 향후 ${horizon}개월 예측`}
        {...focus.handlers}
        style={{
          outline: focus.isKeyboardFocus ? `1.5px dashed ${C.focus}` : '1.5px dashed transparent',
          outlineOffset: '-1.5px',
          transition: 'outline-color 0.12s',
        }}>
        <div style={{ position: 'relative', height: H, background: C.paper, border: `1px solid ${C.rule}` }}>
          <svg viewBox={`0 0 ${W} ${H}`}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block', pointerEvents: 'none' }}
            aria-hidden="true">
            {/* y grid */}
            {[100, 200, 300, 400].map((v) => (
              <line key={v} x1={m.l} x2={W - m.r}
                y1={yScale(v)} y2={yScale(v)}
                stroke={C.ruleSoft} strokeWidth={1}
                vectorEffect="non-scaling-stroke" />
            ))}

            {/* forecast 영역 배경 */}
            <rect x={xAt(60)} y={m.t}
              width={iw - 60 * xStep} height={ih}
              fill={C.paper} fillOpacity={0.4} />

            {/* CI 영역 */}
            {forecast.length > 1 && (
              <path d={[
                `M${xAt(60)},${yScale(forecast[0].ciUpper)}`,
                ...forecast.slice(1).map((d, i) =>
                  `L${xAt(60 + i + 1)},${yScale(d.ciUpper)}`),
                ...forecast.slice().reverse().map((d, i) =>
                  `L${xAt(60 + forecast.length - 1 - i)},${yScale(d.ciLower)}`),
                'Z',
              ].join(' ')}
                fill={C.red} fillOpacity={0.12}
                stroke="none" />
            )}

            {/* 과거 라인 */}
            <path d={TS_DATA.map((d, i) =>
              `${i === 0 ? 'M' : 'L'}${xAt(i)},${yScale(d.value)}`).join(' ')}
              fill="none" stroke={C.navy} strokeWidth={1.5}
              vectorEffect="non-scaling-stroke" />

            {/* 예측 라인 (점선) */}
            {forecast.length > 0 && (
              <path d={[
                `M${xAt(59)},${yScale(TS_DATA[59].value)}`,
                ...forecast.map((d, i) => `L${xAt(60 + i)},${yScale(d.value)}`),
              ].join(' ')}
                fill="none" stroke={C.red} strokeWidth={1.5}
                strokeDasharray="4 3"
                vectorEffect="non-scaling-stroke" />
            )}

            {/* divider */}
            <line x1={xAt(60)} x2={xAt(60)}
              y1={m.t} y2={H - m.b}
              stroke={C.inkFaint} strokeWidth={1}
              strokeDasharray="2 2"
              vectorEffect="non-scaling-stroke" />

            {/* focus marker */}
            {focus.hasFocus && cur && (
              <>
                <line x1={xAt(focusIdx)} x2={xAt(focusIdx)}
                  y1={m.t} y2={H - m.b}
                  stroke={C.focus} strokeWidth={1.5}
                  strokeDasharray="3 2"
                  vectorEffect="non-scaling-stroke" />
                <circle cx={xAt(focusIdx)} cy={yScale(cur.value)}
                  r={4}
                  fill={isForecast ? C.red : C.navy}
                  stroke={C.paper} strokeWidth={1.5}
                  vectorEffect="non-scaling-stroke" />
              </>
            )}
          </svg>

          {/* HTML overlay */}
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
            {/* y labels — 도메인 안의 값만 표시 (400은 데이터 범위에 따라 박스 밖으로 나갈 수 있음) */}
            {[100, 200, 300, 400].filter((v) => v <= allMaxV + 20).map((v) => (
              <div key={v} style={{
                position: 'absolute',
                left: 0, width: `${((m.l - 4) / W) * 100}%`,
                top: `${(yScale(v) / H) * 100}%`,
                transform: 'translateY(-50%)',
                textAlign: 'right',
                fontFamily: '"Courier New", Courier, monospace',
                fontSize: 10,
                color: C.inkSoft,
              }}>{v}</div>
            ))}

            {/* year markers */}
            {[2020, 2021, 2022, 2023, 2024, 2025, 2026].map((y, yi) => {
              const monthIdx = yi * 12 + 6;
              if (monthIdx >= totalLen) return null;
              return (
                <div key={y} style={{
                  position: 'absolute',
                  left: `${(xAt(monthIdx) / W) * 100}%`,
                  bottom: `${((m.b - 14) / H) * 100}%`,
                  transform: 'translateX(-50%)',
                  fontFamily: '"Courier New", Courier, monospace',
                  fontSize: 10,
                  color: y >= 2025 ? C.red : C.inkSoft,
                  fontWeight: y >= 2025 ? 700 : 400,
                }}>{y}</div>
              );
            })}

            {/* forecast 영역 라벨 */}
            <div style={{
              position: 'absolute',
              left: `${(xAt(60) / W) * 100}%`,
              top: 4,
              paddingLeft: 4,
              fontFamily: '"Courier New", Courier, monospace',
              fontSize: 9,
              color: C.red,
              letterSpacing: '0.1em',
            }}>FORECAST →</div>

            {/* buttons */}
            {all.map((d, i) => (
              <button key={i}
                ref={(el) => { refs.current[i] = el; }}
                type="button"
                aria-label={`${d.label} — ${d.value.toFixed(0)}${i >= 60 ? `, 신뢰구간 ${d.ciLower.toFixed(0)}-${d.ciUpper.toFixed(0)}` : ''}`}
                tabIndex={focusIdx === i ? 0 : -1}
                onClick={() => { refs.current[i]?.focus(); setFocusIdx(i); }}
                onMouseEnter={() => setFocusIdx(i)}
                onFocus={() => setFocusIdx(i)}
                onKeyDown={(e) => {
                  if (e.key === 'ArrowRight') {
                    e.preventDefault(); moveFocus(Math.min(all.length - 1, i + 1));
                  } else if (e.key === 'ArrowLeft') {
                    e.preventDefault(); moveFocus(Math.max(0, i - 1));
                  } else if (e.key === 'Home') {
                    e.preventDefault(); moveFocus(0);
                  } else if (e.key === 'End') {
                    e.preventDefault(); moveFocus(all.length - 1);
                  }
                }}
                style={{
                  position: 'absolute',
                  left: `${((xAt(i) - xStep / 2) / W) * 100}%`,
                  width: `${(xStep / W) * 100}%`,
                  top: `${(m.t / H) * 100}%`,
                  height: `${(ih / H) * 100}%`,
                  background: 'transparent',
                  border: 'none', padding: 0,
                  cursor: 'pointer', outline: 'none',
                  pointerEvents: 'auto',
                }} />
            ))}
          </div>
        </div>

      </div>

      {/* 예측 기간 슬라이더 — #35 스타일, #30보다 넉넉한 상하 여백 */}
      <div className="flex items-center gap-3 flex-wrap text-[12px]"
        style={{ marginTop: 16, marginBottom: 20, paddingBottom: 12, borderBottom: `1px solid ${C.rule}` }}
        role="group" aria-label="예측 기간">
        <span style={{ color: C.inkSoft, fontWeight: 700, minWidth: 60 }}>
          예측 기간
        </span>
        <div className="flex items-center gap-2 flex-1" style={{ minWidth: 180 }}>
          <input type="range" min="3" max="24" step="3"
            value={horizon}
            onChange={(e) => {
              setHorizon(+e.target.value);
              setFocusIdx(60);
            }}
            aria-label="예측 기간 (개월)"
            aria-valuetext={`${horizon}개월`}
            style={{ accentColor: C.red, flex: 1 }}
            {...focusable} />
          <span className="tabular-nums" style={{ color: C.ink, minWidth: 50 }}>
            {horizon}개월
          </span>
        </div>
      </div>

      <div className="flex flex-wrap mt-3 gap-3 text-[12px] items-start" style={{ color: C.inkSoft }}>
        <div>
          {/* 범례 */}
          <div className="flex flex-wrap gap-4">
            <span className="flex items-center gap-1.5">
              <svg width="20" height="3" aria-hidden="true">
                <line x1="0" y1="1.5" x2="20" y2="1.5" stroke={C.navy} strokeWidth="2" />
              </svg>&nbsp;관측값
            </span>
            <span className="flex items-center gap-1.5">
              <svg width="20" height="3" aria-hidden="true">
                <line x1="0" y1="1.5" x2="20" y2="1.5"
                  stroke={C.red} strokeWidth="2" strokeDasharray="3 2" />
              </svg>&nbsp;예측값
            </span>
            <span className="flex items-center gap-1.5">
              <svg width="20" height="8" aria-hidden="true">
                <rect width="20" height="8" fill={C.red} fillOpacity="0.12" />
              </svg>&nbsp;95% 신뢰구간
            </span>
          </div>
          <div className="mt-2" aria-live="polite" style={{ color: C.ink }}>
            <strong style={{ color: isForecast ? C.red : C.navy }}>{cur.label}</strong>
            {' '}— {isForecast
              ? `예측 ${cur.value.toFixed(0)} (CI ${cur.ciLower.toFixed(0)}–${cur.ciUpper.toFixed(0)})`
              : `관측 ${cur.value}`}
          </div>
        </div>
        <div className="flex flex-wrap gap-3 ml-auto">
          <button onClick={() => setTableOpen((v) => !v)} aria-expanded={tableOpen}
            aria-controls="d40-table"
            {...focusable}>
            {tableOpen ? '데이터 표 닫기' : `${horizon}개월 예측`}
          </button>
        </div>
      </div>
      {tableOpen && (
        <div id="d40-table" className="text-[12px]">
          <table>
            <caption>예측</caption>
            <thead>
              <tr>{['시점', '구분', '값', 'CI 하한', 'CI 상한'].map((h) => <th key={h} scope="col">{h}</th>)}</tr>
            </thead>
            <tbody>
              {forecast.map((d) => (
                <tr key={d.label}>
                  <td>{d.label}</td>
                  <td>예측</td>
                  <td>{d.value.toFixed(1)}</td>
                  <td>{d.ciLower.toFixed(1)}</td>
                  <td>{d.ciUpper.toFixed(1)}</td>
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
// META + CARD + EXPORT
// ════════════════════════════════════════════════════════════
const META = {
  37: {
    title: 'Trend Decomposition',
    method: '원본 = 추세 + 계절성 + 잔차 · 4-panel 정렬',
    interactions: [
      '4개 패널이 같은 x축으로 정렬 (시간)',
      '한 시점에 호버하면 모든 패널의 점이 동시에 강조 (crosshair)',
      '추세는 12개월 centered moving average',
      '계절성은 detrended의 월별 평균',
      '잔차 = 원본 - 추세 - 계절성',
    ],
    a11y: [
      '60개월 모두 button으로 키보드 ←→ 진입 가능',
      'roving tabindex로 활성 시점 1개만 Tab 진입',
      'aria-live로 한 시점의 4가지 값(원본=추세+계절성+잔차)을 색 코딩과 함께 안내',
      '각 패널 라벨은 HTML로, SVG 라인만 가로 늘어남 (찌그러짐 없음)',
      '4개 패널을 묶는 button overlay가 모든 패널을 동시 강조',
    ],
  },
  38: {
    title: 'Seasonal Subseries',
    method: '12개월 그룹 안에 5년 추이 · 평균선 강조',
    interactions: [
      '월별로 묶어서 각 월의 5년 추이를 별도 line으로 표시',
      '월별 평균 가로선 — 계절성 강도를 한눈에',
      '활성 월만 진하게, 나머지 dim — focus-within 패턴',
      '12월·11월의 매출 피크가 시각적으로 즉각 보임',
    ],
    a11y: [
      '각 월이 button — ←→ Home/End로 순회',
      'roving tabindex — 활성 월에만 tabIndex=0',
      'aria-label에 "X월, 5년 평균 Y" 자연어 명시',
      '월 평균과 시작·끝 연도 값을 aria-live로 비교 가능',
      'SVG의 line/dot은 viewBox 늘어남 OK (위치 표현이라), 라벨은 HTML',
    ],
  },
  39: {
    title: 'Year-over-Year 비교',
    method: '여러 연도의 12개월 패턴을 겹쳐서 시각화',
    interactions: [
      '연도 칩 토글로 비교할 연도 선택 (다중 선택)',
      '같은 월의 여러 연도 값을 동시에 비교',
      '월 호버 시 활성 연도들의 값이 한꺼번에 표시',
      '연도별 색은 시계열 순서로 (그라데이션)',
    ],
    a11y: [
      '연도 칩과 차트가 별도 Tab 그룹',
      '연도 칩은 aria-pressed로 다중 선택 명확',
      '월 button의 aria-label에 모든 활성 연도의 값 명시',
      'aria-live로 활성 월의 연도별 값 색 코딩과 함께 안내',
      '연도가 비활성이면 라인을 아예 안 그림 — 비교 명확',
    ],
  },
  40: {
    title: 'Forecast (단순)',
    method: '선형 추세 외삽 + 계절성 + CI',
    interactions: [
      '관측 부분(실선) + 예측 부분(점선) 시각 구분',
      '95% 신뢰구간을 빨강 영역으로',
      '예측 기간을 슬라이더로 조절 (3~24개월)',
      '예측이 멀어질수록 신뢰구간이 넓어짐',
    ],
    a11y: [
      '관측 vs 예측을 색·선 패턴·텍스트 라벨 삼중 코딩',
      '예측 기간 슬라이더 aria-valuetext "X개월"',
      'aria-label에 "관측 X" 또는 "예측 X, CI Y-Z" 명시',
      '연도 라벨도 2025년부터 빨강으로 시각 구분',
      'aria-live로 활성 시점이 관측인지 예측인지 명시',
    ],
  },
};

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
  { num: 37, cat: 'DECOMPOSITION', cmp: <D37 /> },
  { num: 38, cat: 'SEASONAL', cmp: <D38 /> },
  { num: 39, cat: 'YOY COMPARE', cmp: <D39 /> },
  { num: 40, cat: 'FORECAST', cmp: <D40 /> },
];

export default function Phase6() {
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
