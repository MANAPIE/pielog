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

// 컨테이너 픽셀 폭에 맞춰 viewBox W를 갱신해서 1 user-unit = 1px를 유지.
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

const useChartFocus = () => {
  const [hasFocus, setHasFocus] = useState(false);
  const [hasHover, setHasHover] = useState(false);
  const isActive = hasFocus || hasHover;
  return {
    hasFocus: isActive,
    isKeyboardFocus: hasFocus,
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

const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
const makeRng = (seed) => () => {
  seed = (seed * 1664525 + 1013904223) % 4294967296;
  return seed / 4294967296;
};

// ════════════════════════════════════════════════════════════
// DATA: 가상 회사 매출 + 주요 이벤트
// ════════════════════════════════════════════════════════════
const COMPANY_DATA = (() => {
  const rng = makeRng(43);
  const arr = [];
  for (let i = 0; i < 60; i++) {
    const year = 2020 + Math.floor(i / 12);
    const month = i % 12;
    let v = 50 + i * 1.5;
    if (i === 3) v *= 0.6;
    if (i >= 14 && i <= 18) v *= 1.3;
    if (i === 26) v *= 0.85;
    if (i >= 36 && i <= 42) v *= 1.2;
    if (i >= 50) v *= 1.35;
    v += (rng() - 0.5) * 12;
    arr.push({
      idx: i, year, month,
      label: `${year}.${month + 1}`,
      value: Math.round(clamp(v, 20, 250)),
    });
  }
  return arr;
})();

const EVENTS = [
  { idx: 3, year: 2020, month: 4, title: '코로나 락다운', desc: '전국 락다운, 매출 -40%', color: C.red },
  { idx: 14, year: 2021, month: 3, title: '신제품 출시', desc: '플래그십 제품 출시, +30%', color: C.olive },
  { idx: 26, year: 2022, month: 3, title: '제품 리콜', desc: '품질 이슈, 일시 감소', color: C.red },
  { idx: 36, year: 2023, month: 1, title: '해외 진출', desc: '동남아 3개국 진출', color: C.navy },
  { idx: 50, year: 2024, month: 3, title: 'AI 사업', desc: '신규 부문 가동, 매출 도약', color: C.mustard },
];

// ════════════════════════════════════════════════════════════
// #41 — Annotated Timeline
// ════════════════════════════════════════════════════════════
const D41 = () => {
  const [focusEventIdx, setFocusEventIdx] = useState(0);
  const [tableOpen, setTableOpen] = useState(false);
  const focus = useChartFocus();
  const refs = useRef([]);

  const [chartRef, W] = useChartW(580); const H = 280;
  const m = { t: 32, r: 16, b: 36, l: 40 };
  const iw = W - m.l - m.r;
  const ih = H - m.t - m.b;
  const xStep = iw / (COMPANY_DATA.length - 1);
  const xAt = (i) => m.l + i * xStep;
  const yScale = d3.scaleLinear().domain([0, 260]).range([H - m.b, m.t]);

  const path = COMPANY_DATA.map((d, i) =>
    `${i === 0 ? 'M' : 'L'}${xAt(i)},${yScale(d.value)}`).join(' ');

  const moveFocus = (next) => {
    refs.current[next]?.focus();
    setFocusEventIdx(next);
  };

  const cur = EVENTS[focusEventIdx];
  const curData = COMPANY_DATA[cur.idx];

  return (
    <div>
      <Usage mouse="이벤트 마커 호버" keyboard="Tab → ←→로 이벤트 순회" />

      <div ref={chartRef} role="toolbar"
        aria-label={`회사 매출 timeline, ${EVENTS.length}개 주요 이벤트`}
        {...focus.handlers}
        style={focus.style}>
        <div style={{ position: 'relative', height: H }}>
          <svg viewBox={`0 0 ${W} ${H}`}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block', pointerEvents: 'none' }}
            aria-hidden="true">
            {[50, 100, 150, 200, 250].map((v) => (
              <line key={v} x1={m.l} x2={W - m.r}
                y1={yScale(v)} y2={yScale(v)}
                stroke={C.ruleSoft} strokeWidth={1}
                vectorEffect="non-scaling-stroke" />
            ))}

            <path d={path} fill="none"
              stroke={C.navy} strokeWidth={2}
              vectorEffect="non-scaling-stroke" />

            {focus.hasFocus && (() => {
              const x = xAt(cur.idx);
              return (
                <g>
                  <line x1={x} x2={x}
                    y1={m.t - 12} y2={H - m.b}
                    stroke={cur.color} strokeWidth={2}
                    vectorEffect="non-scaling-stroke" />
                  <circle cx={x} cy={yScale(curData.value)}
                    r={6} fill={cur.color}
                    stroke={C.paper} strokeWidth={2}
                    vectorEffect="non-scaling-stroke" />
                </g>
              );
            })()}

            {EVENTS.map((ev, ei) => {
              const x = xAt(ev.idx);
              const d = COMPANY_DATA[ev.idx];
              const isFocused = ei === focusEventIdx && focus.hasFocus;
              return (
                <g key={ei}>
                  {!isFocused && (
                    <line x1={x} x2={x}
                      y1={m.t - 6} y2={yScale(d.value) - 8}
                      stroke={ev.color}
                      strokeWidth={1}
                      strokeOpacity={0.4}
                      vectorEffect="non-scaling-stroke" />
                  )}
                  <circle cx={x} cy={yScale(d.value)}
                    r={isFocused ? 6 : 4}
                    fill={isFocused ? ev.color : C.paper}
                    stroke={ev.color} strokeWidth={2}
                    vectorEffect="non-scaling-stroke" />
                </g>
              );
            })}
          </svg>

          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
            {[50, 100, 150, 200, 250].map((v) => (
              <div key={v} style={{
                position: 'absolute',
                left: 0, width: `${((m.l - 4) / W) * 100}%`,
                top: `${(yScale(v) / H) * 100}%`,
                transform: 'translateY(-50%)',
                textAlign: 'right',
                fontFamily: '"Courier New", Courier, monospace',
                fontSize: 10, color: C.inkSoft,
              }}>{v}</div>
            ))}
            {[2020, 2021, 2022, 2023, 2024].map((y, yi) => {
              const monthIdx = yi * 12 + 6;
              return (
                <div key={y} style={{
                  position: 'absolute',
                  left: `${(xAt(monthIdx) / W) * 100}%`,
                  bottom: `${((m.b - 20) / H) * 100}%`,
                  transform: 'translateX(-50%)',
                  fontFamily: '"Courier New", Courier, monospace',
                  fontSize: 10, color: C.inkSoft,
                }}>{y}</div>
              );
            })}

            {focus.hasFocus && (() => {
              const x = xAt(cur.idx);
              const xPct = (x / W) * 100;
              const leftish = xPct < 50;
              return (
                <div style={{
                  position: 'absolute',
                  left: leftish ? `${xPct}%` : 'auto',
                  right: leftish ? 'auto' : `${100 - xPct}%`,
                  top: 4,
                  maxWidth: 220,
                  background: cur.color,
                  color: C.paper,
                  padding: '4px 8px',
                  fontFamily: '"Courier New", Courier, monospace',
                  fontSize: 10,
                  pointerEvents: 'none',
                }}>
                  <div style={{ fontWeight: 700 }}>{cur.title}</div>
                  <div style={{ opacity: 0.85, fontSize: 9 }}>{cur.year}.{cur.month} · {cur.desc}</div>
                </div>
              );
            })()}

            {EVENTS.map((ev, ei) => {
              const x = xAt(ev.idx);
              const xPct = (x / W) * 100;
              const isFocused = ei === focusEventIdx;
              const isActive = isFocused && focus.hasFocus;
              return (
                <button key={ei}
                  ref={(el) => { refs.current[ei] = el; }}
                  type="button"
                  aria-pressed={isActive}
                  aria-label={`${ev.year}년 ${ev.month}월 ${ev.title} — ${ev.desc}`}
                  tabIndex={focusEventIdx === ei ? 0 : -1}
                  onClick={() => { refs.current[ei]?.focus(); setFocusEventIdx(ei); }}
                  onMouseEnter={() => setFocusEventIdx(ei)}
                  onFocus={() => setFocusEventIdx(ei)}
                  onKeyDown={(e) => {
                    if (e.key === 'ArrowRight') {
                      e.preventDefault(); moveFocus(Math.min(EVENTS.length - 1, ei + 1));
                    } else if (e.key === 'ArrowLeft') {
                      e.preventDefault(); moveFocus(Math.max(0, ei - 1));
                    } else if (e.key === 'Home') {
                      e.preventDefault(); moveFocus(0);
                    } else if (e.key === 'End') {
                      e.preventDefault(); moveFocus(EVENTS.length - 1);
                    }
                  }}
                  style={{
                    position: 'absolute',
                    left: `${xPct}%`,
                    transform: 'translateX(-50%)',
                    width: 24, height: 24,
                    top: `${((yScale(COMPANY_DATA[ev.idx].value) - 12) / H) * 100}%`,
                    background: 'transparent',
                    border: 'none', padding: 0,
                    cursor: 'pointer', outline: 'none',
                    borderRadius: 12,
                    boxShadow: isActive ? `0 0 0 3px ${C.focus}` : 'none',
                    pointerEvents: 'auto',
                  }} />
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3">
        {EVENTS.map((ev, ei) => {
          const isActive = ei === focusEventIdx;
          return (
            <div key={ei}
              onClick={() => { refs.current[ei]?.focus(); setFocusEventIdx(ei); }}
              style={{
                padding: 8,
                fontSize: 14,
                background: isActive ? ev.color : 'transparent',
                color: isActive ? C.paper : C.ink,
                border: `1px solid ${isActive ? ev.color : C.rule}`,
                cursor: 'pointer',
              }}>
              <div style={{
                color: isActive ? C.paper : ev.color,
                opacity: isActive ? 0.85 : 1,
                fontWeight: 700,
              }}>{ev.year}.{ev.month}</div>
              <div style={{ fontWeight: 700 }}>{ev.title}</div>
              <div className="mt-0.5"
                style={{ color: isActive ? C.paper : C.inkSoft, opacity: isActive ? 0.85 : 1 }}>
                {ev.desc}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex gap-3 mt-3 mb-3 items-start">
        <div aria-live="polite" style={{ color: C.inkSoft }}>
          <strong style={{ color: cur.color }}>{cur.title}</strong> ({cur.year}.{cur.month})
          — 그 시점 매출 {curData.value}
        </div>
        <button onClick={() => setTableOpen((v) => !v)} aria-expanded={tableOpen}
          aria-controls="d41-table"
          className="ml-auto"
          {...focusable}>
          {tableOpen ? '데이터 표 닫기' : `60개월 + ${EVENTS.length}개 이벤트`}
        </button>
      </div>
      {tableOpen && (
        <div id="d41-table" className="text-[12px]">
          <table>
            <caption>회사 매출 + 이벤트</caption>
            <thead>
              <tr>{['시점', '매출', '이벤트'].map((h) => <th key={h} scope="col">{h}</th>)}</tr>
            </thead>
            <tbody>
              {COMPANY_DATA.map((d) => {
                const ev = EVENTS.find((e) => e.idx === d.idx);
                return (
                  <tr key={d.idx}>
                    <td>{d.label}</td>
                    <td>{d.value}</td>
                    <td>{ev?.title || ''}</td>
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
// #42 — Step-by-Step Narrative
// ════════════════════════════════════════════════════════════
const STEPS = [
  { title: '2020년: 안정적 시작', desc: '월 50-80 매출. 코로나 닥치기 전 평온한 시기.', yearRange: [2020, 2020], highlight: null },
  { title: '2020년 4월: 첫 충격', desc: '코로나 락다운으로 매출 40% 급락. 회복까지 4개월 소요.', yearRange: [2020, 2020], highlight: 3 },
  { title: '2021년: 회복과 도약', desc: '신제품 출시로 매출 30% 상승. 분기당 100 선 돌파.', yearRange: [2020, 2021], highlight: 14 },
  { title: '2022년: 리콜과 정체', desc: '제품 품질 이슈로 일시적 감소. 연간 매출은 보합.', yearRange: [2020, 2022], highlight: 26 },
  { title: '2023년: 글로벌 확장', desc: '동남아 3개국 진출 효과로 점진적 성장.', yearRange: [2020, 2023], highlight: 36 },
  { title: '2024년: AI 도약', desc: '신규 사업 부문 가동으로 매출 250 돌파. 새로운 챕터.', yearRange: [2020, 2024], highlight: 50 },
];

const D42 = () => {
  const [stepIdx, setStepIdx] = useState(0);

  const [chartRef, W] = useChartW(580); const H = 220;
  const m = { t: 12, r: 16, b: 28, l: 40 };
  const iw = W - m.l - m.r;
  const ih = H - m.t - m.b;
  const xStep = iw / (COMPANY_DATA.length - 1);
  const xAt = (i) => m.l + i * xStep;
  const yScale = d3.scaleLinear().domain([0, 260]).range([H - m.b, m.t]);

  const step = STEPS[stepIdx];
  const [startYear, endYear] = step.yearRange;
  const visibleData = COMPANY_DATA.filter((d) =>
    d.year >= startYear && d.year <= endYear);
  const visiblePath = visibleData.map((d, i) =>
    `${i === 0 ? 'M' : 'L'}${xAt(d.idx)},${yScale(d.value)}`).join(' ');
  const highlight = step.highlight != null ? COMPANY_DATA[step.highlight] : null;

  return (
    <div>
      <Usage mouse="단계 탭 또는 다음/이전" keyboard="단계 Tab → ←→ Home/End" />

      <div role="tablist" ref={chartRef} aria-label="스토리 단계" className="flex flex-wrap gap-3 mb-3">
        {STEPS.map((s, i) => (
          <button key={i}
            role="tab"
            aria-selected={stepIdx === i}
            tabIndex={stepIdx === i ? 0 : -1}
            onClick={() => setStepIdx(i)}
            onKeyDown={(e) => {
              if (e.key === 'ArrowRight') {
                e.preventDefault(); setStepIdx(Math.min(STEPS.length - 1, stepIdx + 1));
              } else if (e.key === 'ArrowLeft') {
                e.preventDefault(); setStepIdx(Math.max(0, stepIdx - 1));
              } else if (e.key === 'Home') {
                e.preventDefault(); setStepIdx(0);
              } else if (e.key === 'End') {
                e.preventDefault(); setStepIdx(STEPS.length - 1);
              }
            }}
            style={{
              background: stepIdx === i ? C.ink : 'transparent',
              color: stepIdx === i ? C.paper : C.inkSoft,
              border: `1px solid ${stepIdx === i ? C.ink : C.rule}`,
            }} {...focusable}>
            {(i + 1).toString().padStart(2, '0')}
          </button>
        ))}
      </div>

      <div role="region" aria-live="polite"
        aria-label={`단계 ${stepIdx + 1}: ${step.title}`}
        style={{ background: C.paper, border: `1px solid ${C.rule}`, padding: 10 }}>
        <div style={{ position: 'relative', height: H }}>
          <svg viewBox={`0 0 ${W} ${H}`}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }}
            aria-hidden="true">
            {[50, 100, 150, 200, 250].map((v) => (
              <line key={v} x1={m.l} x2={W - m.r}
                y1={yScale(v)} y2={yScale(v)}
                stroke={C.ruleSoft} strokeWidth={1}
                vectorEffect="non-scaling-stroke" />
            ))}

            <path d={COMPANY_DATA.map((d, i) =>
              `${i === 0 ? 'M' : 'L'}${xAt(i)},${yScale(d.value)}`).join(' ')}
              fill="none" stroke={C.rule} strokeWidth={1}
              vectorEffect="non-scaling-stroke" />

            <path d={visiblePath} fill="none"
              stroke={C.navy} strokeWidth={2.5}
              vectorEffect="non-scaling-stroke" />

            {highlight && (
              <g>
                <line x1={xAt(highlight.idx)} x2={xAt(highlight.idx)}
                  y1={m.t} y2={H - m.b}
                  stroke={C.red} strokeWidth={1.5}
                  strokeDasharray="3 2"
                  vectorEffect="non-scaling-stroke" />
                <circle cx={xAt(highlight.idx)} cy={yScale(highlight.value)}
                  r={7} fill={C.red}
                  stroke={C.paper} strokeWidth={2}
                  vectorEffect="non-scaling-stroke" />
              </g>
            )}
          </svg>

          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
            {[50, 100, 150, 200, 250].map((v) => (
              <div key={v} style={{
                position: 'absolute',
                left: 0, width: `${((m.l - 4) / W) * 100}%`,
                top: `${(yScale(v) / H) * 100}%`,
                transform: 'translateY(-50%)',
                textAlign: 'right',
                fontFamily: '"Courier New", Courier, monospace',
                fontSize: 10, color: C.inkSoft,
              }}>{v}</div>
            ))}
            {[2020, 2021, 2022, 2023, 2024].map((y, yi) => {
              const monthIdx = yi * 12 + 6;
              const inRange = y >= startYear && y <= endYear;
              return (
                <div key={y} style={{
                  position: 'absolute',
                  left: `${(xAt(monthIdx) / W) * 100}%`,
                  bottom: `${((m.b - 14) / H) * 100}%`,
                  transform: 'translateX(-50%)',
                  fontFamily: '"Courier New", Courier, monospace',
                  fontSize: 10,
                  color: inRange ? C.ink : C.inkFaint,
                  fontWeight: inRange ? 600 : 400,
                }}>{y}</div>
              );
            })}
            {highlight && (
              <div style={{
                position: 'absolute',
                left: `${(xAt(highlight.idx) / W) * 100}%`,
                top: `${((yScale(highlight.value) - 16) / H) * 100}%`,
                transform: 'translate(-50%, -100%)',
                background: C.red,
                color: C.paper,
                padding: '3px 6px',
                fontFamily: '"Courier New", Courier, monospace',
                fontSize: 10,
                fontWeight: 700,
                whiteSpace: 'nowrap',
              }}>{highlight.label} · {highlight.value}</div>
            )}
          </div>
        </div>
      </div>

      {/* 스토리 설명 (박스 바깥) */}
      <div className="mt-3 p-3" style={{ borderLeft: `3px solid ${C.red}` }}>
        <div style={{ fontSize: '12px', fontWeight: 700, letterSpacing: 0, marginBottom: '6px', color: C.inkFaint }}>
          STEP {(stepIdx + 1).toString().padStart(2, '0')} / {STEPS.length.toString().padStart(2, '0')}
        </div>
        <p className="text-xl mb-1"
          style={{ fontFamily: 'inherit', fontWeight: 500, color: C.ink, marginTop: '2px' }}>
          {step.title}
        </p>
        <p className="mb-1 text-[11px]" style={{ color: C.inkSoft }}>
          {step.desc}
        </p>
      </div>

      {/* 페이지네이션 — 12px */}
      <div className="flex items-center justify-between mt-3" style={{ fontSize: 12 }}>
        <button onClick={() => setStepIdx(Math.max(0, stepIdx - 1))}
          disabled={stepIdx === 0}
          className="tracking-widest px-3 py-1.5"
          style={{
            border: `1px solid ${C.rule}`,
            color: stepIdx === 0 ? C.inkFaint : C.ink,
            background: 'transparent',
            opacity: stepIdx === 0 ? 0.4 : 1,
            fontSize: 12,
          }} {...focusable}>← 이전</button>
        <span style={{ color: C.inkSoft, fontSize: 12 }}>
          {stepIdx + 1} / {STEPS.length}
        </span>
        <button onClick={() => setStepIdx(Math.min(STEPS.length - 1, stepIdx + 1))}
          disabled={stepIdx === STEPS.length - 1}
          className="tracking-widest px-3 py-1.5"
          style={{
            border: `1px solid ${C.ink}`,
            color: stepIdx === STEPS.length - 1 ? C.inkFaint : C.paper,
            background: stepIdx === STEPS.length - 1 ? C.bg : C.ink,
            opacity: stepIdx === STEPS.length - 1 ? 0.4 : 1,
            fontSize: 12,
          }} {...focusable}>다음 →</button>
      </div>
    </div>
  );
};

// ════════════════════════════════════════════════════════════
// #43 — Connected Scatterplot
// ════════════════════════════════════════════════════════════
const D43 = () => {
  const SCATTER_DATA = useMemo(() => {
    const rng = makeRng(73);
    return d3.range(20).map((i) => {
      const adSpend = 10 + i * 1.2 + (rng() - 0.5) * 5;
      const efficiency = 1 + i * 0.05;
      const revenue = adSpend * efficiency + (rng() - 0.5) * 8;
      return {
        idx: i,
        year: 2020 + Math.floor(i / 4),
        quarter: `Q${(i % 4) + 1}`,
        adSpend: clamp(adSpend, 5, 50),
        revenue: clamp(revenue, 8, 80),
      };
    });
  }, []);

  const [focusIdx, setFocusIdx] = useState(0);
  const [tableOpen, setTableOpen] = useState(false);
  const focus = useChartFocus();
  const refs = useRef([]);
  const [chartRef, W] = useChartW(540);

  const H = 360;
  const m = { t: 16, r: 24, b: 36, l: 48 };
  const iw = W - m.l - m.r;
  const ih = H - m.t - m.b;

  const xScale = d3.scaleLinear().domain([5, 50]).range([m.l, W - m.r]);
  const yScale = d3.scaleLinear().domain([8, 80]).range([H - m.b, m.t]);

  const linePath = SCATTER_DATA.map((d, i) =>
    `${i === 0 ? 'M' : 'L'}${xScale(d.adSpend)},${yScale(d.revenue)}`).join(' ');

  const moveFocus = (next) => {
    refs.current[next]?.focus();
    setFocusIdx(next);
  };

  const cur = SCATTER_DATA[focusIdx];
  const prev = focusIdx > 0 ? SCATTER_DATA[focusIdx - 1] : null;

  // 분기별 색상 그라데이션 — d3 interpolation엔 raw hex 필요 (var()는 못 받음)
  // 블로그의 [data-theme] 속성을 따라간다 — 토글 시 즉시 재계산
  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    const root = document.documentElement;
    const read = () => setIsDark(root.dataset.theme === 'dark');
    read();
    const obs = new MutationObserver(read);
    obs.observe(root, { attributes: true, attributeFilter: ['data-theme'] });
    return () => obs.disconnect();
  }, []);
  const rawNavy = isDark ? '#6F8AAF' : '#1F3450';
  // 최근 분기를 더 밝게 — 초기 navy와 명도 대비를 키워 시간 방향이 잘 드러나게
  const rawBright = isDark ? '#FF8B66' : '#FF6B47';
  const colorOf = (i) => d3.interpolateHcl(rawNavy, rawBright)(i / (SCATTER_DATA.length - 1));

  return (
    <div>
      <Usage mouse="점 호버" keyboard="Tab → ←→로 시간 순 이동" />

      <div role="toolbar"
        aria-label="connected scatterplot, 광고비 대비 매출 시계열"
        {...focus.handlers}
        style={focus.style}>
        <div ref={chartRef} style={{ position: 'relative', height: H }}>
          <svg viewBox={`0 0 ${W} ${H}`}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block', pointerEvents: 'none' }}
            aria-hidden="true">
            {/* grid */}
            {[10, 20, 30, 40, 50].map((v) => (
              <line key={`xg${v}`} x1={xScale(v)} x2={xScale(v)}
                y1={m.t} y2={H - m.b}
                stroke={C.ruleSoft} strokeWidth={1}
                vectorEffect="non-scaling-stroke" />
            ))}
            {[20, 40, 60].map((v) => (
              <line key={`yg${v}`} x1={m.l} x2={W - m.r}
                y1={yScale(v)} y2={yScale(v)}
                stroke={C.ruleSoft} strokeWidth={1}
                vectorEffect="non-scaling-stroke" />
            ))}

            {/* 연결선 (시간 순) */}
            <path d={linePath} fill="none"
              stroke={C.inkSoft} strokeWidth={1.5}
              strokeOpacity={0.4}
              vectorEffect="non-scaling-stroke" />

            {/* 화살표 (방향 표시) */}
            {SCATTER_DATA.slice(0, -1).map((d, i) => {
              const next = SCATTER_DATA[i + 1];
              const dx = xScale(next.adSpend) - xScale(d.adSpend);
              const dy = yScale(next.revenue) - yScale(d.revenue);
              const len = Math.sqrt(dx * dx + dy * dy);
              if (len < 8) return null;
              const midX = (xScale(d.adSpend) + xScale(next.adSpend)) / 2;
              const midY = (yScale(d.revenue) + yScale(next.revenue)) / 2;
              const angle = Math.atan2(dy, dx);
              const ax1 = midX - 4 * Math.cos(angle - 0.4);
              const ay1 = midY - 4 * Math.sin(angle - 0.4);
              const ax2 = midX - 4 * Math.cos(angle + 0.4);
              const ay2 = midY - 4 * Math.sin(angle + 0.4);
              return (
                <path key={i}
                  d={`M${ax1},${ay1} L${midX},${midY} L${ax2},${ay2}`}
                  fill="none" stroke={C.inkSoft}
                  strokeWidth={1} strokeOpacity={0.5}
                  vectorEffect="non-scaling-stroke" />
              );
            })}

            {/* 점들 */}
            {SCATTER_DATA.map((d, i) => {
              const isFocused = focusIdx === i && focus.hasFocus;
              const isPrev = focusIdx === i + 1 && focus.hasFocus;
              return (
                <circle key={i}
                  cx={xScale(d.adSpend)} cy={yScale(d.revenue)}
                  r={isFocused ? 7 : isPrev ? 5 : 4}
                  fill={colorOf(i)}
                  fillOpacity={focus.hasFocus ? (isFocused || isPrev ? 1 : 0.4) : 0.85}
                  stroke={isFocused ? C.ink : C.paper}
                  strokeWidth={isFocused ? 2 : 1.2}
                  vectorEffect="non-scaling-stroke" />
              );
            })}

            {/* prev → cur 화살표 강조 */}
            {focus.hasFocus && prev && (() => {
              const x1 = xScale(prev.adSpend), y1 = yScale(prev.revenue);
              const x2 = xScale(cur.adSpend), y2 = yScale(cur.revenue);
              return (
                <line x1={x1} y1={y1} x2={x2} y2={y2}
                  stroke={C.red} strokeWidth={2.5}
                  vectorEffect="non-scaling-stroke" />
              );
            })()}
          </svg>

          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
            {/* x labels */}
            {[10, 20, 30, 40, 50].map((v) => (
              <div key={v} style={{
                position: 'absolute',
                left: `${(xScale(v) / W) * 100}%`,
                bottom: `${((m.b - 20) / H) * 100}%`,
                transform: 'translateX(-50%)',
                fontFamily: '"Courier New", Courier, monospace',
                fontSize: 10, color: C.inkSoft,
              }}>{v}</div>
            ))}
            {/* y labels */}
            {[20, 40, 60, 80].map((v) => (
              <div key={v} style={{
                position: 'absolute',
                left: 0, width: `${((m.l - 4) / W) * 100}%`,
                top: `${(yScale(v) / H) * 100}%`,
                transform: 'translateY(-50%)',
                textAlign: 'right',
                fontFamily: '"Courier New", Courier, monospace',
                fontSize: 10, color: C.inkSoft,
              }}>{v}</div>
            ))}
            {/* axis titles */}
            <div style={{
              position: 'absolute', right: 8, bottom: 4,
              fontFamily: '"Courier New", Courier, monospace',
              fontSize: 10, color: C.inkSoft,
            }}>광고비 →</div>
            <div style={{
              position: 'absolute', left: 4, top: 4,
              fontFamily: '"Courier New", Courier, monospace',
              fontSize: 10, color: C.inkSoft,
            }}>↑ 매출</div>

            {/* 시작/끝 라벨 */}
            {[0, SCATTER_DATA.length - 1].map((i) => {
              const d = SCATTER_DATA[i];
              const isStart = i === 0;
              return (
                <div key={i} style={{
                  position: 'absolute',
                  left: `${(xScale(d.adSpend) / W) * 100}%`,
                  top: `${(yScale(d.revenue) / H) * 100}%`,
                  transform: isStart ? 'translate(-100%, -50%)' : 'translate(8%, -50%)',
                  marginLeft: isStart ? -10 : 10,
                  fontFamily: '"Courier New", Courier, monospace',
                  fontSize: 10,
                  color: isStart ? C.navy : C.red,
                  fontWeight: 700,
                  whiteSpace: 'nowrap',
                }}>
                  {isStart ? '시작 ' : '끝 '}
                  {d.year}{d.quarter}
                </div>
              );
            })}

            {/* 현재 점 ticker */}
            {focus.hasFocus && (
              <div style={{
                position: 'absolute',
                left: `${(xScale(cur.adSpend) / W) * 100}%`,
                top: `${((yScale(cur.revenue) + 12) / H) * 100}%`,
                transform: 'translateX(-50%)',
                background: colorOf(focusIdx),
                color: C.paper,
                padding: '3px 6px',
                fontFamily: '"Courier New", Courier, monospace',
                fontSize: 10,
                fontWeight: 700,
                whiteSpace: 'nowrap',
              }}>{cur.year}{cur.quarter}</div>
            )}

            {/* buttons */}
            {SCATTER_DATA.map((d, i) => (
              <button key={i}
                ref={(el) => { refs.current[i] = el; }}
                type="button"
                aria-label={`${d.year}년 ${d.quarter} — 광고비 ${d.adSpend.toFixed(1)}, 매출 ${d.revenue.toFixed(1)}`}
                tabIndex={focusIdx === i ? 0 : -1}
                onClick={() => { refs.current[i]?.focus(); setFocusIdx(i); }}
                onMouseEnter={() => setFocusIdx(i)}
                onFocus={() => setFocusIdx(i)}
                onKeyDown={(e) => {
                  if (e.key === 'ArrowRight') {
                    e.preventDefault(); moveFocus(Math.min(SCATTER_DATA.length - 1, i + 1));
                  } else if (e.key === 'ArrowLeft') {
                    e.preventDefault(); moveFocus(Math.max(0, i - 1));
                  } else if (e.key === 'Home') {
                    e.preventDefault(); moveFocus(0);
                  } else if (e.key === 'End') {
                    e.preventDefault(); moveFocus(SCATTER_DATA.length - 1);
                  }
                }}
                style={{
                  position: 'absolute',
                  left: `${(xScale(d.adSpend) / W) * 100}%`,
                  top: `${(yScale(d.revenue) / H) * 100}%`,
                  transform: 'translate(-50%, -50%)',
                  width: 22, height: 22,
                  background: 'transparent',
                  border: 'none', padding: 0,
                  cursor: 'pointer', outline: 'none',
                  borderRadius: 11,
                  boxShadow: focusIdx === i && focus.hasFocus ? `0 0 0 3px ${C.focus}` : 'none',
                  pointerEvents: 'auto',
                }} />
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-3 mt-3 mb-3 items-start">
        <div>
          {/* 범례 + 설명 */}
          <div className="flex flex-wrap gap-3 text-[12px]" style={{ color: C.inkSoft }}>
            <span className="flex items-center gap-1">
              <span style={{ color: colorOf(0), fontSize: 13 }} aria-hidden="true">●</span>
              초기 분기
            </span>
            <span className="flex items-center gap-1">
              <span style={{ color: colorOf(SCATTER_DATA.length - 1), fontSize: 13 }} aria-hidden="true">●</span>
              최근 분기
            </span>
          </div>
          <div className="mt-2 text-[12px]" style={{ color: C.inkSoft }}>
            <span>점이 시간 순으로 색이 변하고, 선이 그 경로를 그림</span>
          </div>
          <div aria-live="polite" className="mt-2" style={{ color: C.ink }}>
            <strong>{cur.year}년 {cur.quarter}</strong> — 광고비 {cur.adSpend.toFixed(1)}, 매출 {cur.revenue.toFixed(1)}
            {prev && (
              <span style={{ color: C.inkSoft }}>
                {' · '}이전 대비 광고비 {(cur.adSpend - prev.adSpend > 0 ? '+' : '')}{(cur.adSpend - prev.adSpend).toFixed(1)},
                매출 {(cur.revenue - prev.revenue > 0 ? '+' : '')}{(cur.revenue - prev.revenue).toFixed(1)}
              </span>
            )}
          </div>
        </div>
        <div className="ml-auto">
          <button onClick={() => setTableOpen((v) => !v)} aria-expanded={tableOpen}
            aria-controls="d43-table"
            {...focusable}>
            {tableOpen ? '데이터 표 닫기' : '20개 분기'}
          </button>
        </div>
      </div>
      {tableOpen && (
        <div id="d43-table" className="text-[12px]">
          <table>
            <caption>분기별 광고비·매출</caption>
            <thead>
              <tr>{['연도', '분기', '광고비', '매출', '효율'].map((h) => <th key={h} scope="col">{h}</th>)}</tr>
            </thead>
            <tbody>
              {SCATTER_DATA.map((d) => (
                <tr key={d.idx}>
                  <td>{d.year}</td>
                  <td>{d.quarter}</td>
                  <td>{d.adSpend.toFixed(1)}</td>
                  <td>{d.revenue.toFixed(1)}</td>
                  <td>{(d.revenue / d.adSpend).toFixed(2)}</td>
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
// #44 — Highlight Comparison
// ════════════════════════════════════════════════════════════
const HIGHLIGHTS = [
  {
    title: '두 회사 비교',
    desc: '회사 A는 코로나 직격, 회사 B는 비대면 사업으로 오히려 성장.',
    annot: { idxA: 3, idxB: 3, side: 'left' },
  },
  {
    title: '회복 속도 차이',
    desc: '12개월 후, 회사 B는 이미 두 배 성장. 회사 A는 회복 중.',
    annot: { idxA: 15, idxB: 15, side: 'middle' },
  },
  {
    title: '교차점',
    desc: 'AI 사업 확장으로 회사 A가 추월. 분기당 매출 격차 해소.',
    annot: { idxA: 52, idxB: 52, side: 'right' },
  },
];

const COMPANY_B = (() => {
  const rng = makeRng(91);
  const arr = [];
  for (let i = 0; i < 60; i++) {
    let v = 30 + i * 1.2;
    if (i >= 3 && i <= 14) v *= 1.4;
    if (i >= 30) v *= 0.95;
    if (i >= 48) v *= 0.85;
    v += (rng() - 0.5) * 10;
    arr.push({ idx: i, value: Math.round(clamp(v, 20, 220)) });
  }
  return arr;
})();

const D44 = () => {
  const [highlightIdx, setHighlightIdx] = useState(0);
  const [tableOpen, setTableOpen] = useState(false);
  const [chartRef, W] = useChartW(580);

  const H = 280;
  const m = { t: 16, r: 16, b: 36, l: 40 };
  const iw = W - m.l - m.r;
  const ih = H - m.t - m.b;
  const xStep = iw / 59;
  const xAt = (i) => m.l + i * xStep;
  const yScale = d3.scaleLinear().domain([0, 260]).range([H - m.b, m.t]);

  const cur = HIGHLIGHTS[highlightIdx];
  const annot = cur.annot;

  const pathA = COMPANY_DATA.map((d, i) =>
    `${i === 0 ? 'M' : 'L'}${xAt(i)},${yScale(d.value)}`).join(' ');
  const pathB = COMPANY_B.map((d, i) =>
    `${i === 0 ? 'M' : 'L'}${xAt(i)},${yScale(d.value)}`).join(' ');

  const aVal = COMPANY_DATA[annot.idxA].value;
  const bVal = COMPANY_B[annot.idxB].value;

  return (
    <div>
      <Usage mouse="하이라이트 탭 클릭"
        keyboard="탭 Tab → ←→로 하이라이트 전환" />

      <div role="tablist" aria-label="하이라이트 시점" className="flex flex-wrap gap-3 mb-3">
        {HIGHLIGHTS.map((h, i) => (
          <button key={i}
            role="tab"
            aria-selected={highlightIdx === i}
            tabIndex={highlightIdx === i ? 0 : -1}
            onClick={() => setHighlightIdx(i)}
            onKeyDown={(e) => {
              if (e.key === 'ArrowRight') {
                e.preventDefault(); setHighlightIdx(Math.min(HIGHLIGHTS.length - 1, highlightIdx + 1));
              } else if (e.key === 'ArrowLeft') {
                e.preventDefault(); setHighlightIdx(Math.max(0, highlightIdx - 1));
              }
            }}
            style={{
              background: highlightIdx === i ? C.ink : 'transparent',
              color: highlightIdx === i ? C.paper : C.inkSoft,
              border: `1px solid ${highlightIdx === i ? C.ink : C.rule}`,
            }} {...focusable}>
            {h.title}
          </button>
        ))}
      </div>

      <div role="region" aria-live="polite"
        aria-label={cur.title}
        style={{ background: C.paper, border: `1px solid ${C.rule}`, padding: 10 }}>
        <div ref={chartRef} style={{ position: 'relative', height: H }}>
          <svg viewBox={`0 0 ${W} ${H}`}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }}
            aria-hidden="true">
            {[50, 100, 150, 200, 250].map((v) => (
              <line key={v} x1={m.l} x2={W - m.r}
                y1={yScale(v)} y2={yScale(v)}
                stroke={C.ruleSoft} strokeWidth={1}
                vectorEffect="non-scaling-stroke" />
            ))}

            {/* 회사 A */}
            <path d={pathA} fill="none"
              stroke={C.navy} strokeWidth={2}
              vectorEffect="non-scaling-stroke" />
            {/* 회사 B */}
            <path d={pathB} fill="none"
              stroke={C.red} strokeWidth={2}
              strokeDasharray="4 3"
              vectorEffect="non-scaling-stroke" />

            {/* 어노테이션 */}
            <line x1={xAt(annot.idxA)} x2={xAt(annot.idxA)}
              y1={m.t} y2={H - m.b}
              stroke={C.ink} strokeWidth={1.5}
              strokeDasharray="3 2"
              vectorEffect="non-scaling-stroke" />

            <circle cx={xAt(annot.idxA)} cy={yScale(aVal)}
              r={8} fill="none"
              stroke={C.navy} strokeWidth={2.5}
              vectorEffect="non-scaling-stroke" />
            <circle cx={xAt(annot.idxA)} cy={yScale(aVal)}
              r={4} fill={C.navy}
              vectorEffect="non-scaling-stroke" />

            <circle cx={xAt(annot.idxB)} cy={yScale(bVal)}
              r={8} fill="none"
              stroke={C.red} strokeWidth={2.5}
              vectorEffect="non-scaling-stroke" />
            <circle cx={xAt(annot.idxB)} cy={yScale(bVal)}
              r={4} fill={C.red}
              vectorEffect="non-scaling-stroke" />

            {/* gap 표시 */}
            <line x1={xAt(annot.idxA) + 12} x2={xAt(annot.idxA) + 12}
              y1={yScale(aVal)} y2={yScale(bVal)}
              stroke={C.ink} strokeWidth={1.5}
              vectorEffect="non-scaling-stroke" />
            <path d={`M${xAt(annot.idxA) + 8},${yScale(aVal)} L${xAt(annot.idxA) + 16},${yScale(aVal)}`}
              stroke={C.ink} strokeWidth={1.5}
              vectorEffect="non-scaling-stroke" />
            <path d={`M${xAt(annot.idxA) + 8},${yScale(bVal)} L${xAt(annot.idxA) + 16},${yScale(bVal)}`}
              stroke={C.ink} strokeWidth={1.5}
              vectorEffect="non-scaling-stroke" />
          </svg>

          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
            {[50, 100, 150, 200, 250].map((v) => (
              <div key={v} style={{
                position: 'absolute',
                left: 0, width: `${((m.l - 4) / W) * 100}%`,
                top: `${(yScale(v) / H) * 100}%`,
                transform: 'translateY(-50%)',
                textAlign: 'right',
                fontFamily: '"Courier New", Courier, monospace',
                fontSize: 10, color: C.inkSoft,
              }}>{v}</div>
            ))}
            {[2020, 2021, 2022, 2023, 2024].map((y, yi) => {
              const monthIdx = yi * 12 + 6;
              return (
                <div key={y} style={{
                  position: 'absolute',
                  left: `${(xAt(monthIdx) / W) * 100}%`,
                  bottom: `${((m.b - 20) / H) * 100}%`,
                  transform: 'translateX(-50%)',
                  fontFamily: '"Courier New", Courier, monospace',
                  fontSize: 10, color: C.inkSoft,
                }}>{y}</div>
              );
            })}

            {/* gap 값 라벨 */}
            <div style={{
              position: 'absolute',
              left: `${((xAt(annot.idxA) + 20) / W) * 100}%`,
              top: `${(((yScale(aVal) + yScale(bVal)) / 2) / H) * 100}%`,
              transform: 'translateY(-50%)',
              fontFamily: '"Courier New", Courier, monospace',
              fontSize: 11, color: C.ink, fontWeight: 700,
              padding: '2px 6px', background: C.paper,
              border: `1px solid ${C.ink}`,
            }}>
              차이 {Math.abs(aVal - bVal)}
            </div>

            {/* A/B 라벨 */}
            <div style={{
              position: 'absolute',
              left: `${((xAt(annot.idxA) - 12) / W) * 100}%`,
              top: `${((yScale(aVal) - 10) / H) * 100}%`,
              transform: 'translate(-100%, -100%)',
              fontFamily: '"Courier New", Courier, monospace',
              fontSize: 10, color: C.navy, fontWeight: 700,
              padding: '2px 6px', background: C.paper,
              whiteSpace: 'nowrap',
            }}>회사 A: {aVal}</div>
            <div style={{
              position: 'absolute',
              left: `${((xAt(annot.idxB) - 12) / W) * 100}%`,
              top: `${((yScale(bVal) + 10) / H) * 100}%`,
              transform: 'translate(-100%, 0)',
              fontFamily: '"Courier New", Courier, monospace',
              fontSize: 10, color: C.red, fontWeight: 700,
              padding: '2px 6px', background: C.paper,
              whiteSpace: 'nowrap',
            }}>회사 B: {bVal}</div>
          </div>
        </div>
      </div>

      {/* 스토리 설명 (박스 바깥, monospace 제거, 마진 정리) */}
      <div className="mt-3 p-3" style={{ borderLeft: `3px solid ${C.ink}` }}>
        <p className="text-lg"
          style={{ fontFamily: 'inherit', fontWeight: 500, color: C.ink, marginTop: 0, marginBottom: 4 }}>
          {cur.title}
        </p>
        <p style={{ color: C.inkSoft, fontSize: 13, marginBottom: 0 }}>
          {cur.desc}
        </p>
      </div>

      <div className="flex gap-3 mt-3 mb-3 items-start">
        <div>
          {/* 범례 */}
          <div className="flex flex-wrap gap-3 text-[12px]" style={{ color: C.inkSoft }}>
            <span className="flex items-center gap-1">
              <svg width="20" height="3" aria-hidden="true">
                <line x1="0" y1="1.5" x2="20" y2="1.5" stroke={C.navy} strokeWidth="2" />
              </svg>회사 A
            </span>
            <span className="flex items-center gap-1">
              <svg width="20" height="3" aria-hidden="true">
                <line x1="0" y1="1.5" x2="20" y2="1.5"
                  stroke={C.red} strokeWidth="2" strokeDasharray="3 2" />
              </svg>회사 B
            </span>
          </div>
        </div>
        <div className="ml-auto">
          <button onClick={() => setTableOpen((v) => !v)} aria-expanded={tableOpen}
            aria-controls="d44-table"
            {...focusable}>
            {tableOpen ? '데이터 표 닫기' : '60개월 양사 비교'}
          </button>
        </div>
      </div>
      {tableOpen && (
        <div id="d44-table" className="text-[12px]">
          <table>
            <caption>두 회사 매출 비교</caption>
            <thead>
              <tr>{['시점', '회사 A', '회사 B', '차이'].map((h) => <th key={h} scope="col">{h}</th>)}</tr>
            </thead>
            <tbody>
              {COMPANY_DATA.map((d, i) => {
                const b = COMPANY_B[i];
                return (
                  <tr key={d.idx}>
                    <td>{d.label}</td>
                    <td>{d.value}</td>
                    <td>{b.value}</td>
                    <td>{d.value - b.value}</td>
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
// META + CARD + EXPORT
// ════════════════════════════════════════════════════════════
const META = {
  41: {
    title: 'Annotated Timeline',
    method: '시계열 + 주요 이벤트 마커 + 호버 카드',
    interactions: [
      '60개월 매출 라인 위에 5개 주요 이벤트 마커',
      '이벤트 마커 호버/포커스 시 상단에 컨텍스트 카드 표시',
      '이벤트 컬러로 종류 구분 (락다운 빨강, 성장 올리브/네이비, 도약 머스타드)',
      '아래 이벤트 목록 카드도 차트와 연동 — 카드 클릭 시 해당 이벤트로 이동',
    ],
    a11y: [
      'roving tabindex — 활성 이벤트 1개만 Tab 진입',
      '←→ Home/End로 이벤트 사이 이동',
      'aria-label에 연도·월·제목·설명 모두 명시',
      'aria-live로 활성 이벤트의 정보 자연어 안내',
      '이벤트 카드와 차트가 같은 state — 어디서 누르든 동기화',
    ],
  },
  42: {
    title: 'Step-by-Step Narrative',
    method: 'tablist + 점진적 데이터 노출 · 6단계 스토리',
    interactions: [
      '6단계 탭으로 스토리 진행',
      '각 단계마다 데이터 범위가 점진적으로 늘어남',
      '핵심 시점에는 빨간 강조 점 + 라벨',
      '배경에는 전체 데이터를 흐리게 깔아 컨텍스트 유지',
      '다음/이전 버튼으로도 진행 가능',
    ],
    a11y: [
      'role="tablist" + role="tab" + aria-selected',
      'role="region" + aria-live로 단계 변경 시 자연어 안내',
      '←→ Home/End 키보드 진행, roving tabindex',
      '단계의 제목·설명·step 번호가 시각·텍스트 양쪽으로 명시',
      '이전/다음 버튼은 disabled 상태도 시각적으로 명확',
    ],
  },
  43: {
    title: 'Connected Scatterplot',
    method: '시계열 산점도 · 점들을 시간 순으로 연결',
    interactions: [
      '두 변수의 산점도 + 시간 순으로 점을 잇는 선',
      '점 색이 시간 순으로 navy→red 그라데이션',
      '연결선 중간에 화살표로 방향성 표시',
      '시작/끝 점에 라벨 — 전체 궤적 한눈에',
      '활성 점과 이전 점을 빨간 라인으로 강조 (변화량)',
    ],
    a11y: [
      'roving tabindex — 활성 분기 1개만 Tab 진입',
      'aria-label에 연도·분기·두 변수 값 모두 명시',
      'aria-live로 활성 시점 + 이전 대비 변화량 자연어 안내',
      '방향성을 색 + 화살표 + 시작/끝 라벨로 삼중 코딩',
      'box-shadow로 활성 점 강조 (브라우저 일관 표시)',
    ],
  },
  44: {
    title: 'Highlight Comparison',
    method: '두 시계열 비교 + 시점별 어노테이션 강조',
    interactions: [
      '두 회사 매출을 색·선 패턴으로 구분 (실선/점선)',
      '3개 하이라이트 시점을 탭으로 전환',
      '활성 시점에 두 회사의 값 차이를 명시적으로 시각화',
      '어노테이션: 세로 가이드라인 + 양쪽 점 원형 강조 + 차이 값 박스',
      '각 하이라이트에 short story title + 설명',
    ],
    a11y: [
      'role="tablist" 패턴, ←→로 하이라이트 전환',
      'role="region" + aria-live로 하이라이트 변경 시 자연어 안내',
      '실선/점선 + 색 + 텍스트 라벨 삼중 코딩 (색맹 대응)',
      '차이 값을 시각적 박스 + 텍스트 양쪽으로 명시',
      '하이라이트 카드 안에 제목·설명이 모두 명시',
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
  { num: 41, cat: 'ANNOTATED', cmp: <D41 /> },
  { num: 42, cat: 'NARRATIVE', cmp: <D42 /> },
  { num: 43, cat: 'CONNECTED', cmp: <D43 /> },
  { num: 44, cat: 'HIGHLIGHT', cmp: <D44 /> },
];

export default function Phase7() {
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
