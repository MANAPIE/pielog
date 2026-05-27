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

// 컨테이너 픽셀 폭에 맞춰 viewBox W를 갱신해서 1 user-unit = 1px를 유지.
const useChartW = (initial = 280) => {
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

// ════════════════════════════════════════════════════════════
// DATA — 가상 전자상거래 주문 데이터셋
// ════════════════════════════════════════════════════════════
const MONTHS = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
const CATS = ['전자', '의류', '식품', '도서'];
const REGIONS = ['수도권', '영남', '호남', '제주'];

const ECOMMERCE = (() => {
  // 일관된 데이터를 위해 seed 사용
  let seed = 42;
  const rng = () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
  const arr = [];
  for (let i = 0; i < 400; i++) {
    const m = Math.floor(rng() * 12);
    const cat = CATS[Math.floor(rng() * CATS.length)];
    const region = REGIONS[Math.floor(rng() * REGIONS.length)];
    // 카테고리별 가격대 차이
    const basePrice = cat === '전자' ? 80 : cat === '의류' ? 40 : cat === '식품' ? 15 : 20;
    const price = Math.round(basePrice + rng() * basePrice * 2);
    const qty = Math.floor(1 + rng() * 6);
    arr.push({
      id: i, month: m, cat, region,
      price, qty, total: price * qty,
    });
  }
  return arr;
})();

// 헬퍼: 그룹별 집계
const sumByKey = (data, key, valKey = 'total') => {
  const m = d3.rollup(data, (v) => d3.sum(v, (d) => d[valKey]), (d) => d[key]);
  return m;
};
const countByKey = (data, key) => {
  const m = d3.rollup(data, (v) => v.length, (d) => d[key]);
  return m;
};
const priceBins = [0, 50, 100, 150, 200, 250, 350];
const PRICE_LABELS = ['~50', '~100', '~150', '~200', '~250', '250+'];
const binIndex = (price) => {
  for (let i = 1; i < priceBins.length; i++) {
    if (price < priceBins[i]) return i - 1;
  }
  return priceBins.length - 2;
};

// ════════════════════════════════════════════════════════════
// #29 — Crossfilter Dashboard
// ════════════════════════════════════════════════════════════
const D29 = () => {
  const [filters, setFilters] = useState({ month: null, cat: null, region: null, priceBin: null });
  const [announce, setAnnounce] = useState('');
  const [tableOpen, setTableOpen] = useState(false);

  // 현재 활성 필터 적용된 데이터
  const filtered = useMemo(() => {
    return ECOMMERCE.filter((d) => {
      if (filters.month != null && d.month !== filters.month) return false;
      if (filters.cat && d.cat !== filters.cat) return false;
      if (filters.region && d.region !== filters.region) return false;
      if (filters.priceBin != null && binIndex(d.price) !== filters.priceBin) return false;
      return true;
    });
  }, [filters]);

  const toggleFilter = (key, value) => {
    setFilters((f) => {
      const next = { ...f, [key]: f[key] === value ? null : value };
      // 알림 만들기
      const active = Object.entries(next).filter(([, v]) => v != null);
      const count = ECOMMERCE.filter((d) => {
        if (next.month != null && d.month !== next.month) return false;
        if (next.cat && d.cat !== next.cat) return false;
        if (next.region && d.region !== next.region) return false;
        if (next.priceBin != null && binIndex(d.price) !== next.priceBin) return false;
        return true;
      }).length;
      setAnnounce(`${active.length}개 필터 적용, ${count}개 주문 매치`);
      return next;
    });
  };

  const clearAll = () => {
    setFilters({ month: null, cat: null, region: null, priceBin: null });
    setAnnounce('필터 해제됨, 전체 400개 주문');
  };

  const activeFilters = Object.entries(filters).filter(([, v]) => v != null);

  // 작은 차트 — SVG는 막대만, 텍스트·인터랙션은 HTML overlay
  const MiniBar = ({ title, items, filterKey, w = 220, h = 100 }) => {
    const [focusIdx, setFocusIdx] = useState(0);
    const [hasFocus, setHasFocus] = useState(false);
    const [hasHover, setHasHover] = useState(false);
    const chartActive = hasFocus || hasHover;
    const barRefs = useRef([]);

    const filteredAgg = useMemo(() =>
      items.map(({ k, l }) => ({
        k, l,
        v: filtered.filter((d) =>
          filterKey === 'priceBin' ? binIndex(d.price) === k : d[filterKey] === k
        ).length,
      })),
      [filtered]
    );
    const allMax = d3.max(items.map(({ k }) =>
      ECOMMERCE.filter((d) => filterKey === 'priceBin' ? binIndex(d.price) === k : d[filterKey] === k).length
    )) || 1;
    const max = d3.max(filteredAgg, (d) => d.v) || 1;
    const scale = Math.max(max, allMax);

    const m = { t: 18, r: 4, b: 26, l: 4 };
    const innerW = w - m.l - m.r;
    const innerH = h - m.t - m.b;
    const step = innerW / items.length;
    const barW = step * 0.65;

    const moveFocus = (next) => {
      barRefs.current[next]?.focus();
      setFocusIdx(next);
    };

    // 퍼센트 계산
    const innerTopPct = (m.t / h) * 100;
    const innerHeightPct = (innerH / h) * 100;
    const bottomMarginPct = (m.b / h) * 100;

    return (
      <div role="toolbar"
        aria-label={`${title} — 총 ${items.length}개 항목. 막대 클릭으로 필터 토글.`}
        onFocusCapture={() => setHasFocus(true)}
        onBlurCapture={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget)) {
            setHasFocus(false);
          }
        }}
        onMouseEnter={() => setHasHover(true)}
        onMouseLeave={() => setHasHover(false)}
        style={{
          outline: hasFocus ? `1.5px dashed ${C.focus}` : '1.5px dashed transparent',
          outlineOffset: '-1.5px',
          transition: 'outline-color 0.12s',
        }}>
        {/* 차트 제목 — 박스 바깥, 활성 차트 강조 */}
        <div className="flex items-center gap-1"
          style={{
            fontSize: '12px', fontWeight: chartActive ? 700 : 500, letterSpacing: 0, marginBottom: '6px',
            color: chartActive ? C.focus : C.inkSoft,
          }}>
          <span aria-hidden="true" style={{
            display: 'inline-block',
            width: chartActive ? 8 : 0,
            transition: 'width 0.12s',
            overflow: 'hidden',
          }}>▸</span>
          {title}
        </div>

        {/* SVG + HTML overlay 컨테이너 — 박스는 여기에만 */}
        <div style={{ position: 'relative', height: h, background: C.paper, border: `1px solid ${C.rule}`, padding: '8px 0' }}>
          {/* SVG — 막대만, 텍스트 없음 (찌그러짐 방지) */}
          <svg viewBox={`0 0 ${w} ${h}`}
            preserveAspectRatio="none"
            style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%',
              display: 'block', pointerEvents: 'none',
            }}
            aria-hidden="true">
            {filteredAgg.map(({ k, v }, i) => {
              const x = m.l + i * step + (step - barW) / 2;
              const isActive = filters[filterKey] === k;
              const hAct = (v / scale) * innerH;
              return (
                <g key={k}>
                  {/* 전체 데이터 배경 */}
                  <rect x={x} y={m.t} width={barW} height={innerH}
                    fill={C.ruleSoft} />
                  {/* 필터된 막대 */}
                  <rect x={x} y={m.t + innerH - hAct}
                    width={barW} height={hAct}
                    fill={isActive ? C.red : activeFilters.length > 0 ? C.olive : C.navy} />
                </g>
              );
            })}
          </svg>

          {/* HTML overlay — 텍스트와 button (찌그러짐 없음) */}
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
            {filteredAgg.map(({ k, l, v }, i) => {
              const x = m.l + i * step + (step - barW) / 2;
              const isActive = filters[filterKey] === k;
              const isFocused = focusIdx === i;
              const hAct = (v / scale) * innerH;
              // 막대 위 값 위치 (%)
              const valueTopPct = ((m.t + innerH - hAct) / h) * 100;

              return (
                <div key={k} style={{
                  position: 'absolute',
                  left: `${(x / w) * 100}%`,
                  width: `${(barW / w) * 100}%`,
                  top: 0, bottom: 0,
                  pointerEvents: 'none',
                }}>
                  {/* 막대 위 값 표시 */}
                  <div style={{
                    position: 'absolute',
                    top: `${valueTopPct}%`,
                    left: 0, right: 0,
                    transform: 'translateY(-100%) translateY(-2px)',
                    textAlign: 'center',
                    fontFamily: '"Courier New", Courier, monospace',
                    fontSize: 10,
                    lineHeight: 1,
                    color: isActive ? C.red : C.inkSoft,
                    fontWeight: isActive || (isFocused && chartActive) ? 700 : 400,
                    pointerEvents: 'none',
                    whiteSpace: 'nowrap',
                  }}>{v}</div>

                  {/* 하단 라벨 — 막대보다 넓을 수 있어 cell 중앙 기준으로 펼침 */}
                  <div style={{
                    position: 'absolute',
                    bottom: 4,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    textAlign: 'center',
                    fontFamily: '"Courier New", Courier, monospace',
                    fontSize: 10,
                    lineHeight: 1,
                    color: isActive || (isFocused && chartActive) ? C.ink : C.inkSoft,
                    fontWeight: isActive ? 600 : 400,
                    pointerEvents: 'none',
                    whiteSpace: 'nowrap',
                  }}>{l}</div>

                  {/* HTML button — 막대 영역과 정확히 일치 */}
                  <button
                    ref={(el) => { barRefs.current[i] = el; }}
                    type="button"
                    aria-pressed={isActive}
                    aria-label={`${l}: ${v}건${isActive ? ' — 선택됨' : ''}`}
                    tabIndex={focusIdx === i ? 0 : -1}
                    onClick={() => {
                      barRefs.current[i]?.focus();
                      setFocusIdx(i);
                      toggleFilter(filterKey, k);
                    }}
                    onMouseEnter={() => setFocusIdx(i)}
                    onFocus={() => setFocusIdx(i)}
                    onKeyDown={(e) => {
                      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                        e.preventDefault();
                        moveFocus(Math.min(items.length - 1, i + 1));
                      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                        e.preventDefault();
                        moveFocus(Math.max(0, i - 1));
                      } else if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        toggleFilter(filterKey, k);
                      } else if (e.key === 'Home') {
                        e.preventDefault(); moveFocus(0);
                      } else if (e.key === 'End') {
                        e.preventDefault(); moveFocus(items.length - 1);
                      }
                    }}
                    style={{
                      position: 'absolute',
                      top: `${innerTopPct}%`,
                      height: `${innerHeightPct}%`,
                      left: 0, right: 0,
                      background: 'transparent',
                      border: 'none',
                      padding: 0,
                      margin: 0,
                      cursor: 'pointer',
                      outline: 'none',
                      // 활성/포커스 시각 표시를 box-shadow로 통합
                      boxShadow: [
                        isFocused && chartActive ? `inset 0 0 0 2px ${C.focus}` : null,
                        isActive ? `inset 0 0 0 1.5px ${C.ink}` : null,
                      ].filter(Boolean).join(', ') || 'none',
                      pointerEvents: 'auto',
                    }} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <Usage mouse="막대 클릭 → 필터 토글 (포커스 유지됨)"
        keyboard="Tab → 차트 진입, ←→ Home/End 이동, Enter/Space 토글, 칩으로 해제" />

      {/* 활성 필터 칩 */}
      <div className="flex items-center gap-2 mb-3 flex-wrap min-h-[28px]" style={{ fontSize: 12 }}>
        {activeFilters.length === 0 ? (
          <span style={{ color: C.inkFaint }}>
            필터 없음 — 전체 {ECOMMERCE.length}개 주문
          </span>
        ) : (
          <>
            {activeFilters.map(([k, v]) => {
              const label = k === 'month' ? MONTHS[v]
                : k === 'priceBin' ? PRICE_LABELS[v]
                  : v;
              return (
                <button key={k}
                  onClick={() => toggleFilter(k, v)}
                  aria-label={`${k} ${label} 필터 해제`}
                  {...focusable}>
                  {k}: {label} <span style={{ opacity: 0.7 }}>✕</span>
                </button>
              );
            })}
            <button onClick={clearAll}
              className="ml-1"
              {...focusable}>전체 해제</button>
            <span className="ml-auto" style={{ color: C.ink }}>
              <strong>{filtered.length}</strong> / {ECOMMERCE.length}건
            </span>
          </>
        )}
      </div>

      {/* 4개 미니 차트 — 외부 박스 없이 각 차트가 자체 박스 보유 */}
      <div className="grid grid-cols-2 gap-4">
        <MiniBar title="월별" filterKey="month"
          items={MONTHS.map((l, k) => ({ k, l: l.replace('월', '') }))} />
        <MiniBar title="카테고리" filterKey="cat"
          items={CATS.map((k) => ({ k, l: k }))} />
        <MiniBar title="지역" filterKey="region"
          items={REGIONS.map((k) => ({ k, l: k }))} />
        <MiniBar title="가격대" filterKey="priceBin"
          items={PRICE_LABELS.map((l, k) => ({ k, l }))} />
      </div>

      <div className="flex gap-3 mt-3 mb-3 items-start">
        <div aria-live="polite" aria-atomic="true" style={{ color: C.ink }}>
          {announce}
        </div>
        <button onClick={() => setTableOpen((v) => !v)} aria-expanded={tableOpen}
          aria-controls="d29-table"
          className="ml-auto"
          {...focusable}>
          {tableOpen ? '데이터 표 닫기' : `매치 ${filtered.length}건 (처음 30건)`}
        </button>
      </div>
      {tableOpen && (
        <div id="d29-table">
          <table>
            <caption style={srOnly}>현재 필터 결과</caption>
            <thead>
              <tr>{['ID', '월', '카테고리', '지역', '금액', '수량'].map((h) => <th key={h} scope="col">{h}</th>)}</tr>
            </thead>
            <tbody>
              {filtered.slice(0, 30).map((d) => (
                <tr key={d.id}>
                  <td>{d.id}</td>
                  <td>{MONTHS[d.month]}</td>
                  <td>{d.cat}</td>
                  <td>{d.region}</td>
                  <td>{d.price.toLocaleString()}</td>
                  <td>{d.qty}</td>
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
// #30 — Synchronized Brushing
// ════════════════════════════════════════════════════════════
const D30 = () => {
  const [brush, setBrush] = useState(null); // [startMonth, endMonth]

  // 차트 1: 월별 매출 line + brush
  const W1 = 480, H1 = 140;
  const m1 = { t: 12, r: 16, b: 24, l: 36 };
  const monthlyTotal = useMemo(() => {
    return MONTHS.map((_, i) => ({
      month: i,
      total: d3.sum(ECOMMERCE.filter((d) => d.month === i), (d) => d.total),
    }));
  }, []);
  const maxMonthly = d3.max(monthlyTotal, (d) => d.total);
  const innerW1 = W1 - m1.l - m1.r;
  const innerH1 = H1 - m1.t - m1.b;
  const xStep = innerW1 / 11;
  const mx = (m) => m1.l + m * xStep;
  const my = (v) => m1.t + innerH1 - (v / maxMonthly) * innerH1;

  // 데이터 필터링
  const inBrush = (d) => !brush || (d.month >= brush[0] && d.month <= brush[1]);

  // 차트 2: 카테고리 막대 (브러시 범위 기준)
  const catSums = useMemo(() => {
    const filtered = ECOMMERCE.filter(inBrush);
    return CATS.map((cat) => ({
      cat,
      total: d3.sum(filtered.filter((d) => d.cat === cat), (d) => d.total),
      totalAll: d3.sum(ECOMMERCE.filter((d) => d.cat === cat), (d) => d.total),
    }));
  }, [brush]);
  const maxCat = d3.max(catSums, (d) => d.totalAll);

  // 차트 3: 가격 vs 수량 산점도 (브러시 안의 주문만 강조)
  const scatterData = ECOMMERCE;

  // 드래그 brush
  const svgRef = useRef(null);
  useEffect(() => {
    const el = svgRef.current;
    if (!el) return;
    let dragging = false;
    let startM = 0;
    const md = (e) => {
      const rect = el.getBoundingClientRect();
      const cx = (e.clientX - rect.left) * (W1 / rect.width);
      const m = Math.max(0, Math.min(11, Math.round((cx - m1.l) / xStep)));
      dragging = true;
      startM = m;
      setBrush([m, m]);
    };
    const mm = (e) => {
      if (!dragging) return;
      const rect = el.getBoundingClientRect();
      const cx = (e.clientX - rect.left) * (W1 / rect.width);
      const m = Math.max(0, Math.min(11, Math.round((cx - m1.l) / xStep)));
      setBrush([Math.min(startM, m), Math.max(startM, m)]);
    };
    const mu = () => { dragging = false; };
    el.addEventListener('mousedown', md);
    window.addEventListener('mousemove', mm);
    window.addEventListener('mouseup', mu);
    return () => {
      el.removeEventListener('mousedown', md);
      window.removeEventListener('mousemove', mm);
      window.removeEventListener('mouseup', mu);
    };
  }, []);

  const filteredCount = brush
    ? ECOMMERCE.filter(inBrush).length
    : ECOMMERCE.length;

  return (
    <div>
      <Usage mouse="시계열 차트에 드래그 brush 또는 슬라이더 조작"
        keyboard="Tab → 시작/끝 슬라이더, ←→ Home/End로 정밀 조정" />

      {/* 차트 1 — 시계열 + brush */}
      <div className="mb-3">
        <div
          style={{ fontSize: '12px', fontWeight: 700, letterSpacing: 0, marginBottom: '6px', color: C.inkSoft }}>
          ① 월별 매출 — 마스터 차트 (drag brush 또는 아래 슬라이더)
        </div>
        <div role="img"
          aria-label={`월별 매출 시계열${brush ? `, ${brush[0] + 1}월부터 ${brush[1] + 1}월까지 선택됨` : ', 범위 미선택'}`}>
          <svg ref={svgRef} viewBox={`0 0 ${W1} ${H1}`}
            style={{ width: '100%', height: H1, cursor: 'crosshair', background: C.paper, border: `1px solid ${C.rule}`, padding: '8px 0', boxSizing: 'content-box' }}>
            {/* baseline */}
            <line x1={m1.l} x2={W1 - m1.r} y1={H1 - m1.b} y2={H1 - m1.b} stroke={C.rule} />
            {/* line */}
            <path d={monthlyTotal.map((d, i) =>
              `${i === 0 ? 'M' : 'L'}${mx(i)},${my(d.total)}`).join(' ')}
              fill="none" stroke={C.navy} strokeWidth={2} />
            {/* brush 영역 */}
            {brush && (
              <rect x={mx(brush[0]) - xStep / 2} y={m1.t}
                width={(brush[1] - brush[0]) * xStep + xStep}
                height={innerH1}
                fill={C.red} fillOpacity={0.12}
                stroke={C.red} strokeWidth={1.5} />
            )}
            {/* dots */}
            {monthlyTotal.map((d, i) => {
              const isIn = brush ? i >= brush[0] && i <= brush[1] : true;
              return (
                <g key={i}>
                  <circle cx={mx(i)} cy={my(d.total)} r={3}
                    fill={isIn ? C.navy : C.inkFaint} stroke={C.paper} strokeWidth={1.5} />
                  <text x={mx(i)} y={H1 - 8} textAnchor="middle"
                    fontSize="9" fontFamily={'"Courier New", Courier, monospace'}
                    fill={isIn ? C.ink : C.inkFaint}>{i + 1}월</text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Dual range slider — 시작/끝 독립 조작 */}
        <div className="flex items-center gap-3 mt-4 mb-3 flex-wrap text-[12px]"
          role="group" aria-label="brush 범위 슬라이더">
          <div className="flex items-center gap-2 flex-1" style={{ minWidth: 200 }}>
            <span className="tracking-widest"
              style={{ color: C.inkSoft, minWidth: 32 }}>시작</span>
            <input type="range" min="0" max="11" step="1"
              value={brush ? brush[0] : 0}
              onChange={(e) => {
                const v = +e.target.value;
                if (!brush) setBrush([v, 11]);
                else setBrush([Math.min(v, brush[1]), brush[1]]);
              }}
              aria-label="시작 월"
              aria-valuetext={`${(brush?.[0] ?? 0) + 1}월부터`}
              style={{ accentColor: C.red, flex: 1 }}
              {...focusable} />
            <span className="tabular-nums"
              style={{ color: C.ink, minWidth: 28 }}>
              {brush ? brush[0] + 1 : 1}월
            </span>
          </div>
          <div className="flex items-center gap-2 flex-1" style={{ minWidth: 200 }}>
            <span className="tracking-widest"
              style={{ color: C.inkSoft, minWidth: 24 }}>끝</span>
            <input type="range" min="0" max="11" step="1"
              value={brush ? brush[1] : 11}
              onChange={(e) => {
                const v = +e.target.value;
                if (!brush) setBrush([0, v]);
                else setBrush([brush[0], Math.max(v, brush[0])]);
              }}
              aria-label="끝 월"
              aria-valuetext={`${(brush?.[1] ?? 11) + 1}월까지`}
              style={{ accentColor: C.red, flex: 1 }}
              {...focusable} />
            <span className="tabular-nums"
              style={{ color: C.ink, minWidth: 28 }}>
              {brush ? brush[1] + 1 : 12}월
            </span>
          </div>
          <button onClick={() => setBrush(null)}
            disabled={!brush}
            style={{
              border: `1px solid ${C.rule}`,
              color: brush ? C.inkSoft : C.inkFaint,
              background: 'transparent',
              opacity: brush ? 1 : 0.5,
            }}
            {...focusable}>해제</button>
        </div>
      </div>

      {/* 차트 2 — 카테고리 막대 */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <div
            style={{ fontSize: '12px', fontWeight: 700, letterSpacing: 0, marginBottom: '6px', color: C.inkSoft }}>
            ② 카테고리별 매출
          </div>
          <svg viewBox="0 0 240 140"
            style={{ width: '100%', height: 140, background: C.paper, border: `1px solid ${C.rule}`, padding: '8px 0', boxSizing: 'content-box' }}
            role="img"
            aria-label={`카테고리별 매출, ${brush ? `${brush[0] + 1}~${brush[1] + 1}월 범위` : '전체'}`}>
            {catSums.map((d, i) => {
              const x = 8 + i * 56;
              const hAll = (d.totalAll / maxCat) * 100;
              const hSel = (d.total / maxCat) * 100;
              return (
                <g key={d.cat}>
                  {/* 배경 — 전체 데이터 */}
                  <rect x={x} y={120 - hAll} width={48} height={hAll}
                    fill={C.ruleSoft} />
                  {/* 선택 영역 */}
                  <rect x={x} y={120 - hSel} width={48} height={hSel}
                    fill={SERIES[i]} />
                  <text x={x + 24} y={120 - hSel - 3} textAnchor="middle"
                    fontSize="9" fontFamily={'"Courier New", Courier, monospace'}
                    fill={C.ink} fontWeight="600">
                    {(d.total / 1000).toFixed(0)}K
                  </text>
                  <text x={x + 24} y={134} textAnchor="middle"
                    fontSize="10" fontFamily={'"Courier New", Courier, monospace'}
                    fill={C.inkSoft}>{d.cat}</text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* 차트 3 — 산점도 */}
        <div>
          <div
            style={{ fontSize: '12px', fontWeight: 700, letterSpacing: 0, marginBottom: '6px', color: C.inkSoft }}>
            ③ 가격 × 수량 (강조)
          </div>
          <svg viewBox="0 0 240 140"
            style={{ width: '100%', height: 140, background: C.paper, border: `1px solid ${C.rule}`, padding: '8px 0', boxSizing: 'content-box' }}
            role="img"
            aria-label="가격과 수량 산점도, brush 영역 안 주문 강조">
            {/* 배경 그리드 */}
            {[35, 70, 105].map((y) => (
              <line key={y} x1={20} x2={232} y1={y} y2={y} stroke={C.ruleSoft} />
            ))}
            {scatterData.map((d) => {
              const x = 20 + (d.price / 350) * 210;
              const y = 120 - (d.qty / 7) * 100;
              const isIn = inBrush(d);
              return (
                <circle key={d.id} cx={x} cy={y} r={2}
                  fill={isIn ? C.red : C.inkFaint}
                  fillOpacity={isIn ? 0.6 : 0.12} />
              );
            })}
            <text x={20} y={138} fontSize="8"
              fontFamily={'"Courier New", Courier, monospace'} fill={C.inkSoft}>가격→</text>
            <text x={232} y={138} textAnchor="end" fontSize="8"
              fontFamily={'"Courier New", Courier, monospace'} fill={C.inkSoft}>↑수량</text>
          </svg>
        </div>
      </div>

      <div className="flex gap-3 mt-3 mb-3 items-start">
        <div aria-live="polite" style={{ color: C.ink }}>
          {brush
            ? `${MONTHS[brush[0]]} ~ ${MONTHS[brush[1]]} 선택 · ${filteredCount}/${ECOMMERCE.length}건 · 카테고리/산점도 모두 갱신`
            : `전체 ${ECOMMERCE.length}건 표시. 시계열에 brush를 그리면 ②③ 차트가 그 범위로 강조`}
        </div>
      </div>
    </div>
  );
};

// ════════════════════════════════════════════════════════════
// #31 — Master-Detail
// ════════════════════════════════════════════════════════════
const D31 = () => {
  const [selected, setSelected] = useState(CATS[0]);
  const [trendRef, trendW] = useChartW(280);

  // 카테고리별 통계
  const summaries = useMemo(() =>
    CATS.map((cat) => {
      const items = ECOMMERCE.filter((d) => d.cat === cat);
      return {
        cat,
        count: items.length,
        total: d3.sum(items, (d) => d.total),
        avgPrice: d3.mean(items, (d) => d.price),
        avgQty: d3.mean(items, (d) => d.qty),
        items,
      };
    }), []);

  const current = summaries.find((s) => s.cat === selected);

  // 월별 추이 (상세)
  const monthlyTrend = useMemo(() =>
    MONTHS.map((_, m) => ({
      m,
      total: d3.sum(current.items.filter((d) => d.month === m), (d) => d.total),
    })),
    [current]
  );
  const maxTrend = d3.max(monthlyTrend, (d) => d.total) || 1;

  // 지역별 분포 (상세)
  const regionDist = useMemo(() =>
    REGIONS.map((r) => ({
      r,
      count: current.items.filter((d) => d.region === r).length,
    })),
    [current]
  );
  const maxRegion = d3.max(regionDist, (d) => d.count) || 1;

  const onListKey = (e) => {
    const idx = summaries.findIndex((s) => s.cat === selected);
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelected(summaries[(idx + 1) % summaries.length].cat);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelected(summaries[(idx - 1 + summaries.length) % summaries.length].cat);
    } else if (e.key === 'Home') {
      e.preventDefault(); setSelected(summaries[0].cat);
    } else if (e.key === 'End') {
      e.preventDefault(); setSelected(summaries[summaries.length - 1].cat);
    }
  };

  return (
    <div>
      <Usage mouse="목록 항목 클릭" keyboard="목록 Tab → ↑↓ Home/End" />

      <div className="grid grid-cols-[1fr_1.5fr] gap-3">
        {/* 왼쪽: master list — 2단 그리드 */}
        <div style={{
          background: C.paper, border: `1px solid ${C.rule}`, fontSize: 12,
          display: 'grid', gridTemplateColumns: '1fr 1fr',
        }}
          role="listbox"
          aria-label="카테고리 목록"
          tabIndex={0}
          onKeyDown={onListKey}
          {...focusable}>
          {summaries.map((s, i) => {
            const isActive = s.cat === selected;
            const totalRows = Math.ceil(summaries.length / 2);
            const myRow = Math.floor(i / 2);
            const isLeftCol = (i % 2) === 0;
            const isLastRow = myRow === totalRows - 1;
            return (
              <div key={s.cat}
                role="option"
                aria-selected={isActive}
                onClick={() => setSelected(s.cat)}
                className="px-3 py-2 cursor-pointer"
                style={{
                  background: isActive ? C.ink : 'transparent',
                  borderRight: isLeftCol ? `1px solid ${C.ruleSoft}` : 'none',
                  borderBottom: !isLastRow ? `1px solid ${C.ruleSoft}` : 'none',
                }}>
                <div className="flex items-center justify-between mb-1">
                  <span className="flex items-center gap-2"
                    style={{ color: isActive ? C.paper : C.ink, fontWeight: 600 }}>
                    <span aria-hidden="true" style={{ color: SERIES[i] }}>{SHAPES[i]}</span>
                    {s.cat}
                  </span>
                  <span className="tabular-nums"
                    style={{ color: isActive ? C.paper : C.inkSoft }}>
                    {s.count}건
                  </span>
                </div>
                {/* sparkline 같은 작은 막대 — 활성 시 옵션의 dark bg와 어울리도록 자체 bg/border 제거 */}
                <svg viewBox="0 0 200 16" style={{
                  width: '100%', height: 14,
                  background: isActive ? 'transparent' : C.bg,
                  border: `1px solid ${isActive ? 'transparent' : C.rule}`,
                }}
                  aria-hidden="true">
                  <rect x="0" y="6" width="200" height="4"
                    fill={isActive ? 'rgba(251,248,241,0.25)' : C.ruleSoft} />
                  <rect x="0" y="6"
                    width={Math.min(200, (s.total / d3.max(summaries, (x) => x.total)) * 200)}
                    height="4" fill={isActive ? C.paper : SERIES[i]} />
                </svg>
              </div>
            );
          })}
        </div>

        {/* 오른쪽: detail — 외부 박스 없이 안의 차트만 자체 박스 보유 */}
        <div role="region" aria-live="polite"
          aria-label={`${selected} 상세`}
          style={{ fontSize: 12 }}>
          <div className="flex items-baseline justify-between mb-3">
            <p
              style={{ marginTop: 20, color: C.ink, fontFamily: 'inherit', fontWeight: 500, fontSize: 18, lineHeight: 1.2, margin: 0 }}>
              {selected}
            </p>
            <span style={{ color: C.inkFaint }}>
              {current.count}건 · 합계 {(current.total / 1000).toFixed(0)}K
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-3">
            <div style={{ border: `1px solid ${C.rule}`, padding: 6 }}>
              <div style={{ color: C.inkFaint, fontSize: 9 }}>평균 가격</div>
              <div style={{ color: C.ink, fontSize: 14, fontFamily: 'inherit', fontWeight: 500 }}>
                {Math.round(current.avgPrice).toLocaleString()}
              </div>
            </div>
            <div style={{ border: `1px solid ${C.rule}`, padding: 6 }}>
              <div style={{ color: C.inkFaint, fontSize: 9 }}>평균 수량</div>
              <div style={{ color: C.ink, fontSize: 14, fontFamily: 'inherit', fontWeight: 500 }}>
                {current.avgQty.toFixed(1)}
              </div>
            </div>
          </div>

          {/* 월별 추이 */}
          <div
            style={{ fontSize: '12px', fontWeight: 700, letterSpacing: 0, marginBottom: '6px', color: C.inkSoft }}>월별 매출 추이</div>
          <div ref={trendRef}>
            {(() => {
              const xPad = 10;
              const xStep = (trendW - xPad * 2) / 11;
              const xAt = (i) => xPad + i * xStep;
              return (
                <svg viewBox={`0 0 ${trendW} 80`} style={{ width: '100%', height: 80, marginBottom: 8, background: C.paper, border: `1px solid ${C.rule}`, padding: '8px 0', boxSizing: 'content-box' }}
                  aria-hidden="true">
                  <path d={monthlyTrend.map((d, i) =>
                    `${i === 0 ? 'M' : 'L'}${xAt(i)},${70 - (d.total / maxTrend) * 60}`).join(' ')}
                    fill="none" stroke={SERIES[CATS.indexOf(selected)]} strokeWidth={2} />
                  {monthlyTrend.map((d, i) => (
                    <circle key={i} cx={xAt(i)}
                      cy={70 - (d.total / maxTrend) * 60} r={2}
                      fill={SERIES[CATS.indexOf(selected)]} />
                  ))}
                </svg>
              );
            })()}
          </div>

          {/* 지역별 분포 */}
          <div
            style={{ fontSize: '12px', fontWeight: 700, letterSpacing: 0, marginBottom: '6px', color: C.inkSoft }}>지역별 분포</div>
          <div className="space-y-1"
            style={{ background: C.paper, border: `1px solid ${C.rule}`, padding: 12 }}>
            {regionDist.map((d) => (
              <div key={d.r} className="flex items-center gap-2">
                <span style={{ color: C.inkSoft, width: 50 }}>{d.r}</span>
                <div className="flex-1" style={{ background: C.ruleSoft, height: 8 }}>
                  <div style={{
                    background: SERIES[CATS.indexOf(selected)],
                    height: '100%', width: `${(d.count / maxRegion) * 100}%`,
                  }} />
                </div>
                <span style={{ color: C.ink, width: 30, textAlign: 'right' }}>{d.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ════════════════════════════════════════════════════════════
// #32 — Filter Bar Dashboard
// ════════════════════════════════════════════════════════════
const D32 = () => {
  const [query, setQuery] = useState('');
  const [selectedCats, setSelectedCats] = useState(new Set());
  const [priceRange, setPriceRange] = useState([0, 350]);
  const [monthlyRef, monthlyW] = useChartW(280);
  const [regionRef, regionW] = useChartW(280);

  // 필터된 데이터
  const filtered = useMemo(() => {
    return ECOMMERCE.filter((d) => {
      if (selectedCats.size > 0 && !selectedCats.has(d.cat)) return false;
      if (d.price < priceRange[0] || d.price > priceRange[1]) return false;
      if (query.trim()) {
        const q = query.trim();
        if (!d.cat.includes(q) && !d.region.includes(q)) return false;
      }
      return true;
    });
  }, [query, selectedCats, priceRange]);

  const toggleCat = (cat) => {
    setSelectedCats((s) => {
      const n = new Set(s);
      n.has(cat) ? n.delete(cat) : n.add(cat);
      return n;
    });
  };

  const reset = () => {
    setQuery('');
    setSelectedCats(new Set());
    setPriceRange([0, 350]);
  };

  // 월별 집계 (필터된)
  const monthly = useMemo(() =>
    MONTHS.map((_, m) => ({
      m,
      total: d3.sum(filtered.filter((d) => d.month === m), (d) => d.total),
      count: filtered.filter((d) => d.month === m).length,
    })), [filtered]);
  const maxMonthly = d3.max(monthly, (d) => d.total) || 1;

  // 지역별 집계
  const byRegion = useMemo(() =>
    REGIONS.map((r) => ({
      r,
      total: d3.sum(filtered.filter((d) => d.region === r), (d) => d.total),
    })), [filtered]);
  const maxRegion = d3.max(byRegion, (d) => d.total) || 1;

  const totalSum = d3.sum(filtered, (d) => d.total);
  const activeFilterCount =
    (query.trim() ? 1 : 0) + (selectedCats.size > 0 ? 1 : 0) +
    (priceRange[0] > 0 || priceRange[1] < 350 ? 1 : 0);

  return (
    <div>
      <Usage mouse="필터 바 조작 → 하단 차트 동시 반응"
        keyboard="Tab → 검색·체크박스·슬라이더 차례로" />

      {/* 필터 바 (박스 바깥) */}
      <div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-start">
          {/* 검색 */}
          <label className="block">
            <span style={{ display: 'block', fontSize: 12, fontWeight: 700, letterSpacing: 0, marginBottom: 6, color: C.inkSoft }}>
              검색 (카테고리 / 지역)
            </span>
            <input type="search" value={query} onChange={(e) => setQuery(e.target.value)}
              placeholder="🔍 예: 전자, 영남"
              className="w-full font-mono text-[12px] px-3 py-2"
              style={{ border: `1px solid ${C.rule}`, background: 'transparent', color: C.ink }}
              {...focusable} />
          </label>

          {/* 카테고리 체크박스 */}
          <fieldset style={{ border: 0, padding: 0, margin: 0, minWidth: 0 }}>
            <legend style={{ padding: 0, fontSize: 12, fontWeight: 700, letterSpacing: 0, marginBottom: 6, color: C.inkSoft }}>
              카테고리
            </legend>
            <div className="flex flex-wrap gap-3">
              {CATS.map((cat, i) => {
                const isOn = selectedCats.has(cat);
                return (
                  <button key={cat} onClick={() => toggleCat(cat)}
                    aria-pressed={isOn}
                    style={{
                      background: isOn ? SERIES[i] : undefined,
                      color: isOn ? C.paper : undefined,
                      borderColor: isOn ? SERIES[i] : undefined,
                    }} {...focusable}>
                    <span aria-hidden="true">{SHAPES[i]}</span>{cat}
                  </button>
                );
              })}
            </div>
          </fieldset>

          {/* 가격 range */}
          <div>
            <div
              style={{ fontSize: 12, fontWeight: 700, letterSpacing: 0, marginBottom: 6, color: C.inkSoft }}>
              가격 범위 ({priceRange[0]} ~ {priceRange[1]})
            </div>
            <div className="space-y-1">
              <input type="range" min="0" max="350" step="10"
                value={priceRange[0]}
                onChange={(e) => setPriceRange([Math.min(+e.target.value, priceRange[1]), priceRange[1]])}
                aria-label="최소 가격"
                aria-valuetext={`최소 ${priceRange[0]}`}
                className="w-full" style={{ accentColor: C.red }} {...focusable} />
              <input type="range" min="0" max="350" step="10"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], Math.max(+e.target.value, priceRange[0])])}
                aria-label="최대 가격"
                aria-valuetext={`최대 ${priceRange[1]}`}
                className="w-full" style={{ accentColor: C.red }} {...focusable} />
            </div>
          </div>
        </div>

        {/* 상태 + reset */}
        <div className="flex items-start justify-between mt-3 pt-2"
          style={{ height: 46, fontSize: 12, marginBottom: 0, paddingTop: 10, borderTop: `1px solid ${C.rule}` }}>
          <span style={{ color: C.inkSoft }}>
            <strong style={{ color: C.ink }}>{filtered.length}</strong> / {ECOMMERCE.length}건 ·
            합계 <strong style={{ color: C.ink }}>{totalSum.toLocaleString()}</strong> ·
            활성 필터 {activeFilterCount}개
          </span>
          {activeFilterCount > 0 && (
            <button onClick={reset} {...focusable}>전체 리셋</button>
          )}
        </div>
      </div>

      {/* 하단 차트들 — 외부 박스 없이 각 차트가 자체 박스 보유 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* 월별 매출 */}
        <div ref={monthlyRef}>
          <div
            style={{ fontSize: '12px', fontWeight: 700, letterSpacing: 0, marginBottom: '6px', color: C.inkSoft }}>월별 매출 추이</div>
          {(() => {
            const xPad = 20;
            const innerW = monthlyW - xPad - 8;
            const slot = innerW / 12;
            const barW = Math.max(8, slot * 0.76);
            return (
              <svg viewBox={`0 0 ${monthlyW} 120`} style={{ width: '100%', height: 120, background: C.paper, border: `1px solid ${C.rule}` }}
                role="img" aria-label={`월별 매출, ${filtered.length}건 기준`}>
                {[0, 0.5, 1].map((p) => (
                  <line key={p} x1={xPad} x2={monthlyW - 8}
                    y1={100 - p * 80} y2={100 - p * 80}
                    stroke={C.ruleSoft} />
                ))}
                {monthly.map((d, i) => {
                  const x = xPad + i * slot + (slot - barW) / 2;
                  const h = (d.total / maxMonthly) * 80;
                  return (
                    <g key={i}>
                      <rect x={x} y={100 - h} width={barW} height={h}
                        fill={C.navy} />
                      <text x={x + barW / 2} y={114} textAnchor="middle"
                        fontSize="9" fontFamily={'"Courier New", Courier, monospace'}
                        fill={C.inkSoft}>{i + 1}</text>
                    </g>
                  );
                })}
              </svg>
            );
          })()}
        </div>

        {/* 지역별 매출 */}
        <div ref={regionRef}>
          <div
            style={{ fontSize: '12px', fontWeight: 700, letterSpacing: 0, marginBottom: '6px', color: C.inkSoft }}>지역별 매출</div>
          {(() => {
            const xPad = 24;
            const innerW = regionW - xPad * 2;
            const slot = innerW / Math.max(1, byRegion.length);
            const barW = Math.max(20, slot * 0.8);
            return (
              <svg viewBox={`0 0 ${regionW} 120`} style={{ width: '100%', height: 120, background: C.paper, border: `1px solid ${C.rule}` }}
                role="img" aria-label={`지역별 매출, ${filtered.length}건 기준`}>
                {byRegion.map((d, i) => {
                  const x = xPad + i * slot + (slot - barW) / 2;
                  const h = maxRegion > 0 ? (d.total / maxRegion) * 80 : 0;
                  return (
                    <g key={d.r}>
                      <rect x={x} y={100 - h} width={barW} height={h}
                        fill={SERIES[i]} />
                      <text x={x + barW / 2} y={100 - h - 4} textAnchor="middle"
                        fontSize="9" fontFamily={'"Courier New", Courier, monospace'}
                        fill={C.ink} fontWeight="600">
                        {d.total > 0 ? (d.total / 1000).toFixed(0) + 'K' : '-'}
                      </text>
                      <text x={x + barW / 2} y={114} textAnchor="middle"
                        fontSize="10" fontFamily={'"Courier New", Courier, monospace'}
                        fill={C.inkSoft}>{d.r}</text>
                    </g>
                  );
                })}
              </svg>
            );
          })()}
        </div>
      </div>

      <div aria-live="polite" aria-atomic="true" style={srOnly}>
        필터 적용: {filtered.length}건 매치
      </div>
    </div >
  );
};

// ════════════════════════════════════════════════════════════
// META
// ════════════════════════════════════════════════════════════
const META = {
  29: {
    title: 'Crossfilter Dashboard',
    method: 'SVG 시각 + HTML button overlay · roving tabindex · 명시적 focus()',
    interactions: [
      '월/카테고리/지역/가격대 4개 막대 차트가 같은 데이터를 다른 차원으로 표현',
      '아무 막대 클릭 → 그 항목으로 필터 추가 (다시 클릭 → 해제)',
      '클릭 후에도 그 막대에 포커스가 머물러 ←→로 연속 탐색 가능',
      '활성 필터는 상단 빨간 칩, × 클릭으로 개별 해제',
      '각 막대 배경에 전체 데이터의 위치를 옅게 표시 (필터 효과 명확)',
    ],
    a11y: [
      'SVG는 시각만, HTML button이 인터랙션 — 모든 브라우저에서 focus 보장',
      'roving tabindex 패턴 — 차트당 활성 막대 1개만 tabIndex=0',
      'aria-pressed로 토글 시맨틱 (스크린리더가 "선택됨/안 됨" 읽음)',
      '포커스 시각화 이중: HTML inset box-shadow + SVG dashed rect',
      'onClick에서 명시적 focus() 호출 — Safari 등 click 후 focus 미부여 우회',
      '←→↑↓ Home/End 모두 지원, aria-live로 매치 수 요약',
    ],
  },
  30: {
    title: 'Synchronized Brushing',
    method: 'master 차트의 brush · dual range slider · detail 차트 자동 갱신',
    interactions: [
      '월별 매출 line 위에 드래그로 brush 그리기',
      '시작/끝 슬라이더로 임의 중간 범위도 정밀 조정 가능',
      'brush 범위 안의 데이터만 카테고리 막대에 진하게',
      '산점도의 점들도 brush 안만 빨강, 밖은 회색 흐림',
      'master(시계열)만 인터랙티브, detail(②③)은 결과 표시',
    ],
    a11y: [
      'WCAG 2.5.7 — 드래그 대신 dual range slider 제공',
      '슬라이더 시작/끝이 독립적이라 중간 범위(예: 5월~8월) 자유 설정',
      'aria-valuetext로 "5월부터, 8월까지" 자연어 안내',
      'detail 차트는 role="img"로 결과 이미지 (인터랙티브 X)',
      '해제 버튼 + brush 미선택 시 disabled 시각화',
      'aria-live로 현재 범위 + 매치 수 자연어 요약',
    ],
  },
  31: {
    title: 'Master-Detail',
    method: 'listbox 패턴 · 좌측 master, 우측 detail',
    interactions: [
      '좌측: 카테고리 목록, 각 행에 sparkline 막대',
      '항목 클릭 → 우측 상세 갱신',
      '활성 항목은 검은 배경으로 강조',
      '상세에는 평균·합계·월 추이·지역 분포',
    ],
    a11y: [
      'role="listbox"의 목록, role="option"의 각 항목',
      'aria-selected로 활성 상태 시맨틱 표현',
      '↑↓ Home/End 키보드 탐색',
      'detail은 role="region" + aria-live — 선택 변경 시 음성 안내',
      '상세 차트들은 aria-hidden (시각 보조), 핵심 수치는 텍스트로도 명시',
    ],
  },
  32: {
    title: 'Filter Bar Dashboard',
    method: '검색 + 다중 체크 + range slider · 모든 차트 동시 반응',
    interactions: [
      '상단 필터 바에 검색·카테고리 체크·가격 range 모두 모음',
      '필터 변경 → 하단 차트들 즉시 갱신',
      '활성 필터 개수·매치 수·합계를 한 줄에 명시',
      '리셋 버튼은 활성 필터가 있을 때만 노출',
    ],
    a11y: [
      '검색은 role="search", type="search"',
      '카테고리 체크는 aria-pressed 토글 버튼 (다중 선택 명확)',
      '가격은 dual range slider, 각각 aria-valuetext로 의미 명시',
      'aria-live는 sr-only 별도 영역으로 — 시각 사용자는 메인 표시 사용',
      'fieldset+legend로 카테고리 그룹 시맨틱',
      '필터가 모두 같은 데이터를 다룬다 → 사용자가 조합 효과 학습 가능',
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
  { num: 29, cat: 'CROSSFILTER', cmp: <D29 /> },
  { num: 30, cat: 'BRUSHING', cmp: <D30 /> },
  { num: 31, cat: 'MASTER-DETAIL', cmp: <D31 /> },
  { num: 32, cat: 'FILTER BAR', cmp: <D32 /> },
];

export default function Phase4() {
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
