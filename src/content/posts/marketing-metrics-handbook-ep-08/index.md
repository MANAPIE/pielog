---
title: "수익과 단위경제 - 마케팅 지표 핸드북 ep.08"
description: "LTV, CAC, MRR, ARPU. 모든 지표가 한 곳에 모이는 단위경제의 13개 단어."
summary: "광고비를 쓰고, 사용자를 데려오고, 활성화하고, 유지한 결과 회사가 살아남는가의 질문에 답하는 편입니다. LTV와 CAC의 정의와 그 비율, 월 반복 매출과 연 반복 매출, 회수 기간과 기여 마진까지. 가장 무거운 편이자 모든 편이 모이는 편."
date: 2026-05-18
thumbnail: ./cover.svg
tags: [series, develop, design, marketing, metrics, ltv, cac, mrr, unit-economics, saas]
draft: false
---

![](./cover.svg)

지금까지 다룬 모든 지표가 결국 이 편에서 만난다.

광고비를 *얼마나 썼는가*([ep.01](/marketing-metrics-handbook-ep-01/)), 그 광고로 *얼마를 벌었는가*([ep.02](/marketing-metrics-handbook-ep-02/)), 가입자가 *얼마나 유지되는가*([ep.05](/marketing-metrics-handbook-ep-05/)~[ep.07](/marketing-metrics-handbook-ep-07/)). 이 세 가지가 한 사용자 단위에서 만나면 *한 명을 데려오는 데 24,000원 쓰고 평균 9개월 유지로 44,100원을 번다* 같은 문장이 만들어진다. *단위경제(unit economics)*: 한 사용자 단위로 본 돈의 흐름이다.

이 편은 사실 *경영의 편* 이다. 마케팅을 넘어 회사 전체의 건강을 평가하는 어휘.

---

## 이번 편에서 다룰 것

![마케팅 지표 핸드북 시리즈의 5단계 퍼널 지도. 위에서부터 획득(ep.01–02), 활성화(ep.03–04), 유지(ep.05–07), 수익(ep.08), 추천(ep.09) 카드가 화살표로 연결되고, 이번 편이 속한 수익 단계가 강조 표시되어 있으며 LTV·CAC·MRR·LTV:CAC 지표가 함께 적혀 있다. 맨 아래에는 측정 인프라(MEASUREMENT LAYER) 띠로 ep.10 실험·ep.11 트래킹·ep.12 어트리뷰션이 배치되어 있다.](./mmh-08-01-stage-map.svg)

13개 용어. 사용자 가치(LTV, CAC, LTV:CAC Ratio, ARPU, ARPPU), 반복 매출(MRR, ARR, MRR Growth, Net New MRR), 회수와 마진(Payback Period, Gross Margin, Contribution Margin, Quick Ratio).

이번 편은 *시각화가 두 개*. LTV:CAC와 MRR Bridge.

---

## LTV · Lifetime Value · 생애 가치 {#ltv}

**① 정의**

한 사용자가 *서비스를 사용하는 전 기간 동안 가져올 누적 매출(또는 마진)*.

```
LTV = ARPU × 평균 유지 기간
또는
LTV = ARPU ÷ Churn Rate (월)
```

ARPU 4,900원, 월 Churn 6.8%면 LTV = 4,900 ÷ 0.068 = 72,000원입니다.

**② 맥학**

- **회의에서**: *"LTV 72,000원, CAC 24,000원, 비율 3.0배. 건강한 단위경제에요."* - 가장 자주 묶여서 나오는 한 쌍.
- **UI 위치**: SaaS 보드 자료, CFO 대시보드, 투자자 데이터 룸.

**③ 액션**

- **개발**: LTV 계산은 *과거 코호트의 누적 매출 곡선* 으로도, *공식으로* 도 산출. 두 방식의 값이 크게 다르면 가정에 문제가 있는 것.
- **디자인**: LTV에 직접 영향을 주는 디자인 - *업셀, 추가 결제 유도, 가족 공유, 갱신 유도*. 같은 사용자가 더 오래, 더 많이 결제하게.
- **기획**: LTV는 *마진 기준* 으로 봐야 진짜 의미. *매출 LTV* 는 부풀려진 숫자.

**④ 사례**

- **센티(프리미엄)**: ARPU 4,508원(마진 기준 92%), 월 Churn 6.8%. LTV = 4,508 ÷ 0.068 = 66,294원.
- **실제 사례**: 넷플릭스 글로벌 LTV $300대, 디즈니플러스 $130대, 한국 OTT $50~80. 콘텐츠 투자와 LTV가 직결.

**⑤ 비고**

- **흔한 함정**: *공식 LTV* 는 *현재 Churn이 유지된다는 가정*. Churn이 변하면 LTV도 변합니다. 가정의 명시 필요.
- **함께 보기**: [CAC](#cac), [LTV:CAC Ratio](#ltv-cac-ratio), [ARPU](#arpu)

---

## CAC · Customer Acquisition Cost · 고객 획득 비용 {#cac}

**① 정의**

*한 명의 신규 고객* 을 데려오는 데 든 비용. 광고비뿐 아니라 *마케팅·영업의 모든 비용* 포함.

```
CAC = (광고비 + 마케팅 인건비 + 도구·외주 + 제휴 비용) ÷ 신규 고객 수
```

CPA가 *광고비만* 본다면 CAC는 *전체 비용*. 분모도 *신규 고객*(매출 발생 사용자)이라는 점이 차이.

**② 맥락**

- **회의에서**: *"이번 분기 CAC 24,000원. 작년 18,000원에서 33% 상승. 광고 단가 인상이 주 원인."* - 시간에 따른 변화를 추적.

**③ 액션**

- **개발**: CAC 계산을 자동화하려면 *모든 비용 데이터* 가 *고객 수 데이터* 옆에 있어야 합니다. 데이터 웨어하우스에서 인사 시스템·광고 매니저·자체 DB를 조인.
- **기획**: CAC를 *낮추는 것* 만 목표로 하면 위험. CAC가 낮은 채널은 *질도 낮을 수 있음*. LTV:CAC 비율로 봐야 합니다.

**④ 사례**

- **센티**: Paid CAC 24,000원, Blended CAC 12,300원. Blended가 낮은 이유는 *친구 초대와 자연 검색* 비중. 신규 가입자의 30%가 친구 초대 경로.

**⑤ 비고**

- **함께 보기**: [LTV](#ltv), [LTV:CAC Ratio](#ltv-cac-ratio), [Blended CAC](/marketing-metrics-handbook-ep-02/#blended-cac)

---

## LTV:CAC Ratio · 생애가치 대비 획득비용 {#ltv-cac-ratio}

**① 정의**

LTV를 CAC로 나눈 비율. 단위경제의 *결론 한 줄*.

```
LTV:CAC = LTV ÷ CAC
```

해석:
- **< 1.0**: 적자. 한 명 데려올 때마다 손실.
- **1.0 ~ 3.0**: 회수 가능하지만 효율 낮음.
- **3.0 ~ 5.0**: 건강한 SaaS.
- **> 5.0**: 매우 효율적 (또는 광고에 *덜 쓰고 있는* 신호 - 더 써도 됨).

**② 맥락**

- **회의에서**: *"비율 3.0배 유지. 광고비 더 써도 됩니다."* - 광고 예산 증액의 근거.

**③ 액션**

- **개발**: 비율은 LTV와 CAC를 정확히 산출하면 자동. 그러나 *마진 기준 LTV* 와 *전체 비용 CAC* 의 정합성이 핵심.
- **기획**: 산업·단계별 적정 비율 - *시드·시리즈 A*: 비율보다 *성장* 우선이라 1.0~2.0도 허용. *성장 단계*: 3.0+. *성숙 단계*: 5.0+.

**④ 사례**

- **센티**: LTV 66,294원, CAC 24,000원. 비율 2.76배. 3.0 미만이지만 *신규 사용자의 LTV 곡선이 12개월 이후도 살아있는* 점을 감안하면 양호.
- **실제 사례**: 슬랙·노션·줌 같은 대형 PLG SaaS가 *비율 5.0~10.0배* 의 단위경제로 성장. 한국에서는 토스가 *블렌디드 기준* 으로 매우 높은 비율을 기록.
- **시각화**

![한 사용자의 누적 매출을 시간축으로 그린 선그래프. 세로축은 −24,000원부터 +80,000원까지, 가로축은 M0부터 M15까지의 월. 0원 라인 아래는 손실 영역, 위는 순이익 영역으로 색이 구분된다. CAC −24,000원을 출발점(점선)으로 시작해 누적 매출 곡선이 매월 ARPU만큼 우상향하며, 약 5.3개월(Payback) 지점에서 0원 라인을 넘어 손실을 회수한다. 평균 유지 14.7개월 시점에서 LTV는 약 +66,000원에 도달한다. 하단 결론: LTV ÷ CAC = 66,000 ÷ 24,000 = 2.76배, Payback 5.3개월 이후 약 9.4개월의 순이익 기간이 남으며, 건강한 범위이고 광고 단가가 올라도 3.0배 이상 유지가 목표라는 평가.](./mmh-08-02-ltv-cac.svg)

**⑤ 비고**

- **흔한 함정**: 비율만 보면 *절대 규모* 가 안 보입니다. *3배 × 100명* 과 *3배 × 100만 명* 은 다른 회사.
- **함께 보기**: [LTV](#ltv), [CAC](#cac), [Payback Period](#payback-period)

---

## ARPU · Average Revenue Per User · 사용자당 평균 매출 {#arpu}

**① 정의**

기간 안에 *활성 사용자 1명당 평균 매출*. 무료 사용자도 분모에 포함.

```
ARPU = 총 매출 ÷ 활성 사용자 수
```

월 매출 1억, MAU 50만이면 월 ARPU = 200원입니다.

**② 맥락**

- **회의에서**: *"ARPU 200원에서 280원으로 40% 상승. 광고 매출과 프리미엄 비중 증가 둘 다 기여."* - 매출 다각화의 결과.

**③ 액션**

- **개발**: ARPU 계산 시 *어떤 매출 포함* 인지 명시. 광고 매출, 구독 매출, 인앱 결제, 환불.
- **기획**: ARPU는 *제품 단위 가격 × 구매 빈도 × 구매율* 의 곱. 어느 요소를 끌어올릴지가 전략.

**⑤ 비고**

- **함께 보기**: [ARPPU](#arppu), [LTV](#ltv), [MRR](#mrr)

---

## ARPPU · Average Revenue Per Paying User · 결제 사용자당 평균 매출 {#arppu}

**① 정의**

*결제한 사용자* 만 분모로 한 ARPU. 무료 사용자 제외.

```
ARPPU = 총 매출 ÷ 결제 사용자 수
```

**② 맥락**

- **회의에서**: *"ARPU 280원, ARPPU 4,900원. 결제 전환율 5.7%."* - 두 수치의 비율이 결제 전환율.

**③ 액션**

- **기획**: 프리미엄 모델은 ARPPU가 핵심. 게임 업계에서는 *돌고래·고래(dolphin, whale) 사용자* 의 ARPPU 분포가 매출의 결정 요인.

**④ 사례**

- **센티**: ARPU 280원, ARPPU 4,900원. 결제 전환율 5.7%. 가족 플랜 도입 후 ARPPU 7,200원으로 상승(가족 1팀당 평균 1.5인 결제).

**⑤ 비고**

- **함께 보기**: [ARPU](#arpu)

---

## MRR · Monthly Recurring Revenue · 월 반복 매출 {#mrr}

**① 정의**

*매월 반복적으로 발생하는* 매출. SaaS와 구독 비즈니스의 핵심 지표.

```
MRR = 월간 구독 사용자 수 × 평균 월 결제액
연간 결제는 12로 나눠 월 환산.
```

**② 맥락**

- **회의에서**: *"MRR 4억 2천만, 전월 대비 6.2% 성장."* - 매월의 가장 중요한 단일 숫자.

**③ 액션**

- **개발**: MRR은 *시점 스냅샷*. 매월 말일 기준. 연간 결제는 12등분, 분기 결제는 3등분.
- **기획**: MRR을 늘리는 네 가지 길 - *New(신규), Expansion(확장), Reactivation(부활), 그리고 줄이는 두 가지 Churn과 Contraction*. 이 다섯 가지의 합이 *Net New MRR*.

**④ 사례**

- **센티**: MRR 1억 8천만. 신규 1,200만, 확장 600만, 부활 200만, 이탈 -800만, 축소 -200만. Net New MRR = +1,000만.
- **시각화**

![한 달 MRR 변동을 보여주는 폭포(워터폴) 차트. 세로축은 1.8억부터 2.0억까지. 왼쪽 시작 MRR 막대 1.8억(전월말)에서 출발해, 증가 항목 New +1,200만(신규 가입), Expansion +600만(기존 확장), Reactivation +200만(부활)이 차례로 쌓이고, 감소 항목 Churn −800만(이탈), Contraction −200만(축소)이 빠진 뒤, 오른쪽 종료 MRR 막대 1.9억(이번달말)에 도달한다. 하단 결론: Net New MRR = (1,200+600+200) − (800+200) = +1,000만원, Quick Ratio = (1,200+600) ÷ (800+200) = 1.8, MoM Growth = 1,000 ÷ 18,000 = 5.6%, Gross Revenue Churn 5.6%·Expansion 3.3%로 Net Revenue Churn 2.3%, NRR은 100% 부근에서 안정.](./mmh-08-03-mrr-bridge.svg)

**⑤ 비고**

- **함께 보기**: [ARR](#arr), [Net New MRR](#net-new-mrr), [MRR Growth](#mrr-growth)

---

## ARR · Annual Recurring Revenue · 연 반복 매출 {#arr}

**① 정의**

MRR의 연 환산. 또는 *연간 결제 기준 반복 매출*.

```
ARR = MRR × 12
```

**② 맥락**

- **회의에서**: *"ARR 50억 돌파."* - 분기 보고, 시리즈 B 이후 투자 라운드의 단골.

**③ 액션**

- **기획**: 이사회와 투자자는 ARR을, 운영 팀은 MRR을 봅니다. 같은 데이터의 두 단위.

**⑤ 비고**

- **함께 보기**: [MRR](#mrr)
- **벤치마크**: 시리즈 A 진입 ARR 약 10억, 시리즈 B 약 30~50억, 시리즈 C 100억+(국내 기준).

---

## Payback Period · 회수 기간 {#payback-period}

**① 정의**

CAC를 *몇 개월 만에 회수* 하는가.

```
Payback Period = CAC ÷ (ARPU × 마진율)
```

월 ARPU 4,900원, 마진율 92%, CAC 24,000원이면 Payback = 24,000 ÷ (4,900 × 0.92) = 5.3개월입니다.

[ep.02](/marketing-metrics-handbook-ep-02/)의 *Payback Window* 와 같은 개념. 회사·문맥에 따라 두 단어가 섞여 쓰입니다.

**② 맥락**

- **회의에서**: *"Payback Period 5.3개월. 평균 구독 유지 14.7개월의 36%."* - 회수 후 *순이익 기간이 얼마나 남는가* 의 진단.

**③ 액션**

- **기획**: 산업별 적정 Payback - *B2B SaaS 12개월 이내*, *B2C 구독 6개월 이내*, *이커머스 첫 구매 시점에 회수* 가 이상적.

**④ 사례**

- **센티**: Payback 5.3개월. 평균 유지 14.7개월이라 약 9개월의 순이익 기간. 양호.

**⑤ 비고**

- **함께 보기**: [Payback Window](/marketing-metrics-handbook-ep-02/#payback-window), [LTV:CAC Ratio](#ltv-cac-ratio)

---

## Gross Margin · 총이익률 {#gross-margin}

**① 정의**

매출에서 *직접 원가(COGS, Cost of Goods Sold)* 를 뺀 비율.

```
Gross Margin = (매출 - COGS) ÷ 매출 × 100 (%)
```

SaaS의 COGS는 보통 *서버비, 결제 수수료, CS 인건비*. 이커머스의 COGS는 *상품 매입가, 물류, 배송*.

**② 맥락**

- **회의에서**: *"Gross Margin 87%에요. 일반 SaaS 기준 양호."* - 단위경제의 출발점.

**③ 액션**

- **기획**: Gross Margin이 낮으면 LTV가 부풀려진 거짓 매출. *마진 기준 LTV* 와 *매출 LTV* 의 격차가 큼.

**⑤ 비고**

- **벤치마크**: SaaS 70\~90%, 이커머스 30\~50%, 미디어 40\~60%.

---

## Contribution Margin · 기여 마진 {#contribution-margin}

**① 정의**

매출에서 *변동비(variable cost)* 만 뺀 마진. 고정비는 제외.

```
Contribution Margin = (매출 - 변동비) ÷ 매출 × 100 (%)
```

각 사용자가 *얼마나 회사 운영에 기여하는가* 의 단위.

**② 맥락**

- **회의에서**: *"Contribution Margin 78%에요. 광고비를 더 써도 단위경제는 양호."* - 광고비 증액의 한계 판단.

**⑤ 비고**

- **함께 보기**: [Gross Margin](#gross-margin)

---

## Quick Ratio · 빠른 비율 (SaaS) {#quick-ratio}

**① 정의**

SaaS 성장의 *질* 을 보는 비율. 신규+확장 매출이 *이탈+축소 매출의 몇 배인가*.

```
Quick Ratio = (New MRR + Expansion MRR) ÷ (Churned MRR + Contraction MRR)
```

> 4.0: 매우 좋음. 1.0: 보합. < 1.0: 매출이 줄고 있음.

**② 맥락**

- **회의에서**: *"Quick Ratio 3.8이에요. 1,000만 잃으면 3,800만 들어옴."* - 성장 속도의 *질*.

**④ 사례**

- **센티**: New 1,200만 + Expansion 600만 = 1,800만. Churned 800만 + Contraction 200만 = 1,000만. Quick Ratio 1.8. 보합과 좋은 사이.

**⑤ 비고**

- **함께 보기**: [MRR](#mrr), [NRR](/marketing-metrics-handbook-ep-07/#nrr)
- **벤치마크**: 시리즈 A 단계 SaaS 4.0+가 이상적, 성숙기 1.5~2.5.

---

## MRR Growth · MRR 성장률 {#mrr-growth}

**① 정의**

이전 기간 대비 MRR이 *얼마나 성장했는가* 의 비율.

```
MoM MRR Growth = (이번 달 MRR - 직전 달 MRR) ÷ 직전 달 MRR × 100 (%)
YoY MRR Growth = (이번 달 MRR - 12개월 전 MRR) ÷ 12개월 전 MRR × 100 (%)
```

**② 맥락**

- **회의에서**: *"이번 분기 MoM MRR Growth 평균 6.2%, YoY 92%."* - 성장의 단일 숫자.

**⑤ 비고**

- **벤치마크**: 초기 SaaS MoM 15\~20%, 성장 SaaS MoM 5\~10%, 성숙 SaaS MoM 2\~5%.

---

## Net New MRR · 순 신규 MRR {#net-new-mrr}

**① 정의**

이번 달 *늘어난 MRR에서 줄어든 MRR을 뺀 순증가분*.

```
Net New MRR = (New + Expansion + Reactivation) - (Churn + Contraction)
```

MRR Bridge의 *결론 숫자*.

**② 맥락**

- **회의에서**: *"Net New MRR +1,000만. 전월 +1,400만에서 둔화."* - 성장 모멘텀의 단일 신호.

**⑤ 비고**

- **함께 보기**: [MRR](#mrr), [Quick Ratio](#quick-ratio)

---

## 이번 편 한눈에 보기

| 용어 | 정의 (한 줄) | 좋은 값 (참고) |
|---|---|---|
| LTV | 사용자 평생 매출 | (마진 기준 본 후 LTV:CAC로 평가) |
| CAC | 신규 고객 1명 비용 | (LTV:CAC로 평가) |
| LTV:CAC Ratio | 비율 | 3.0~5.0 건강 |
| ARPU | 활성 사용자당 매출 | - |
| ARPPU | 결제 사용자당 매출 | - |
| MRR | 월 반복 매출 | - |
| ARR | 연 반복 매출 (MRR×12) | - |
| Payback Period | CAC 회수 기간 | B2B 12개월 이내, B2C 6개월 이내 |
| Gross Margin | 매출-COGS / 매출 | SaaS 70~90% |
| Contribution Margin | 매출-변동비 / 매출 | - |
| Quick Ratio | 성장 ÷ 손실 | 4.0+ 매우 좋음 |
| MRR Growth | MRR 성장률 | 초기 MoM 15~20% |
| Net New MRR | 순증가 MRR | - |

---

## 자주 헷갈리는 쌍

### LTV vs ARPU

| | LTV | ARPU |
|---|---|---|
| **기간** | 사용자 전 생애 | 한 기간 (월·연) |
| **단위** | 사용자당 누적 | 사용자당 평균 |
| **관계** | LTV = ARPU × 평균 유지 기간 | |

### CAC vs CPA

| | CAC | CPA |
|---|---|---|
| **비용** | 마케팅 전체 | 광고비만 |
| **분모** | 신규 고객 | 액션 1건 |
| **상세** | ep.08 | [ep.01](/marketing-metrics-handbook-ep-01/#cpa) |

### MRR vs ARR

같은 데이터의 두 단위. *운영팀은 MRR, 이사회는 ARR*.

### Gross Margin vs Contribution Margin

| | Gross Margin | Contribution Margin |
|---|---|---|
| **공제** | COGS만 | 모든 변동비 |
| **남는 것** | 운영비·마케팅 부담 가능 비율 | 사용자당 회사 기여 비율 |

---

## 참고 자료

- Skok, D. *SaaS Metrics 2.0*. For Entrepreneurs.
- Tunguz, T. *SaaS Adventure Series*. https://tomtunguz.com
- Bessemer Venture Partners. *State of the Cloud Reports*.
- Andreessen Horowitz. *The Macro Cycle of Growth-stage SaaS Metrics*.
- McKinsey. *Grow Fast or Die Slow*.
- Reichheld, F. F. *The Loyalty Effect*. Harvard Business Review Press.

---

## 다음 편 예고

> [ep.09 - 만족과 추천](/marketing-metrics-handbook-ep-09/)

만족한 사용자가 *다른 사람을 데려오면* 단위경제가 한 번 더 좋아집니다. NPS, CSAT, K-factor, Viral Coefficient. 10개 용어로 추천과 만족의 측정을 다룹니다.
