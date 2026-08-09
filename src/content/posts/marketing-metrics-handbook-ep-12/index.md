---
title: "어트리뷰션과 도구 지도 - 마케팅 지표 핸드북 ep.12"
description: "First-touch, Last-touch, Multi-touch, Data-driven. 한 가입자의 공로를 어디에 돌릴 것인가의 13개 단어."
summary: "시리즈의 마지막 편. 한 사용자가 광고를 다섯 번 보고 가입했다면 그 공로는 어느 광고에게 갈까요. 첫 광고, 마지막 광고, 모든 광고에 골고루, 또는 데이터가 학습한 가중치. 어트리뷰션 모델 일곱 종과 마지막으로 실제 도구들 — GA4, Amplitude, Mixpanel의 차이까지. 13개 용어로 시리즈를 마칩니다."
date: 2026-05-19
thumbnail: ./cover.svg
tags: [series, develop, design, marketing, metrics, attribution, ga4, amplitude, mixpanel]
draft: false
---

![](./cover.svg)

한 사용자가 페이스북 광고를 보고, 며칠 후 구글 검색으로 다시 들어오고, 또 며칠 후 인스타그램 광고를 본 다음 가입했다.

이 가입자의 공로를 *어느 광고에게 돌릴 것인가*. 페이스북? 구글? 인스타그램? 셋 다? 답은 *고른 어트리뷰션 모델에 따라 다르다*. 같은 데이터가 *Last-touch 모델* 에서는 인스타그램이, *First-touch 모델* 에서는 페이스북이, *Linear 모델* 에서는 세 매체가 각 1/3씩 가져갑니다.

이 결정이 *어느 채널에 광고비를 더 쓸지* 를 바꾼다. 어트리뷰션은 마케팅 의사결정의 가장 깊은 층에 있습니다.

마지막 편입니다.

---

## 이번 편에서 다룰 것

![핸드북 시리즈 전체 구조를 보여주는 단계 지도이며 시리즈 마지막 편 표시가 있다. 위쪽에는 다섯 단계 퍼널이 세로로 쌓여 있다 — ep.01–02 획득, ep.03–04 활성화, ep.05–07 유지, ep.08 수익, ep.09 추천. 그 아래 '측정 인프라 · MEASUREMENT LAYER'라는 띠가 있고 세 항목이 들어 있다 — ep.10 실험(A/B · p-value · MDE), ep.11 트래킹(UTM · Event · Pixel · CAPI), ep.12 어트리뷰션(Last-touch · Data-driven · GA4 · Amplitude). 이번 편인 ep.12 어트리뷰션 항목이 강조 표시되어 있다. 하단 설명은 측정 인프라가 다섯 단계 전체에서 작동한다고 적혀 있다.](./mmh-12-01-stage-map.svg)

13개 용어. 어트리뷰션 모델 7종(First-touch, Last-touch, Linear, Time-decay, Position-based, Data-driven, Multi-touch), 모델 외 개념(View-through, Click-through, Incrementality), 실제 도구 3종(GA4, Amplitude, Mixpanel).

시리즈의 마지막 편입니다. 도구 지도까지 마치면 *13편 136개 용어* 의 어휘집이 끝납니다.

---

## First-touch Attribution · 첫 접점 어트리뷰션 {#first-touch}

**① 정의**

가입자의 공로를 *가장 처음 만난 채널* 에 100% 부여.

```
페이스북 → 구글 → 인스타그램 → 가입
페이스북 = 1.0 (100% 공로)
나머지 = 0
```

**② 맥락**

- **회의에서**: *"브랜드 인지도 캠페인 효과를 보려면 First-touch가 적합."* — *처음 알게 한 채널* 평가.

**③ 액션**

- **기획**: First-touch는 *브랜드 광고와 디스플레이 광고에 우호적*. 검색 광고는 보통 *나중에 등장* 하므로 First-touch 모델에서는 과소평가됩니다.

**⑤ 비고**

- **함께 보기**: [Last-touch](#last-touch), [Multi-touch](#multi-touch)

---

## Last-touch Attribution · 마지막 접점 어트리뷰션 {#last-touch}

**① 정의**

가입자의 공로를 *가장 마지막에 만난 채널* 에 100% 부여.

```
페이스북 → 구글 → 인스타그램 → 가입
인스타그램 = 1.0 (100% 공로)
나머지 = 0
```

오랫동안 *기본 모델* 이었습니다. Google Analytics Universal Analytics(UA)의 기본값이 *Last Non-direct Click*.

**② 맥락**

- **회의에서**: *"GA4 기본은 Data-driven인데 우리는 익숙해서 Last-touch도 함께 봅니다."* — 모델 전환기의 일반적 운영.

**③ 액션**

- **기획**: Last-touch는 *전환 직전 채널에 우호적*. 검색 광고와 리타게팅 광고가 *과대평가* 되기 쉽습니다.

**④ 사례**

- **센티**: Last-touch 모델에서는 *카카오 검색* 이 35% 공로 1위. *그러나 그 사용자들이 어디서 처음 들었는지* 보면 페이스북 비중이 훨씬 높음. 모델만 보면 카카오 광고비를 늘리는 잘못된 결정.

**⑤ 비고**

- **함께 보기**: [First-touch](#first-touch), [Multi-touch](#multi-touch)

---

## Linear Attribution · 선형 어트리뷰션 {#linear}

**① 정의**

가입자의 공로를 *모든 접점에 동일하게 분배*.

```
페이스북 → 구글 → 인스타그램 → 가입
페이스북 = 0.33, 구글 = 0.33, 인스타그램 = 0.33
```

**② 맥락**

- **회의에서**: *"단순 평등 모델. 어느 채널도 과소평가 안 됩니다."* — 모델 선택의 출발점.

**③ 액션**

- **기획**: Linear는 *치우치지 않지만 진실에 가깝지도 않은* 모델. 보통 *분석 시작 시 베이스라인* 으로 사용.

**⑤ 비고**

- **함께 보기**: [Time-decay](#time-decay), [Position-based](#position-based)

---

## Time-decay Attribution · 시간 감쇠 어트리뷰션 {#time-decay}

**① 정의**

가입에 *가까운 접점일수록 큰 가중치*. 반감기(half-life)에 따라 감쇠.

```
페이스북 (3주 전) → 구글 (1주 전) → 인스타그램 (1일 전) → 가입
페이스북 = 0.15, 구글 = 0.30, 인스타그램 = 0.55 (예시)
```

**② 맥락**

- **회의에서**: *"전환까지의 마지막 1주가 더 결정적이라는 가정. Time-decay 7일 반감기."* — 적당한 가중의 표준 모델.

**③ 액션**

- **기획**: Time-decay는 *짧은 구매 결정 사이클*(이커머스)에 적합. 긴 사이클(B2B SaaS)에는 *너무 큰 가중* 을 마지막 접점에 줍니다.

**⑤ 비고**

- **함께 보기**: [Linear](#linear), [Position-based](#position-based)

---

## Position-based Attribution · 위치 기반 어트리뷰션 {#position-based}

**① 정의**

*첫 접점과 마지막 접점* 에 큰 가중치, 중간에 작은 가중치. *U자형*. *40-20-40* 또는 *40-40-20* 의 변형.

```
페이스북 (첫) → 구글 (중간) → 인스타그램 (마지막) → 가입
페이스북 = 0.40, 구글 = 0.20, 인스타그램 = 0.40
```

**② 맥락**

- **회의에서**: *"브랜드 인지와 전환 모두 중요. Position-based 40-20-40."* — 균형 모델.

**③ 액션**

- **기획**: Position-based는 *마케팅 깔때기의 시작과 끝* 을 모두 인정. 디스플레이와 검색이 같은 비중을 가집니다.

**⑤ 비고**

- **함께 보기**: [Linear](#linear), [Time-decay](#time-decay)

---

## Data-driven Attribution · 데이터 기반 어트리뷰션 {#data-driven}

**① 정의**

알고리즘이 *각 접점의 실제 기여도를 데이터로 학습* 해서 가중치 부여. 머신러닝 기반.

```
GA4 Data-driven, Google Ads Data-driven, Adobe Algorithmic
"전환한 경로와 전환하지 않은 경로를 비교해 어느 채널이 진짜 영향을 줬는지 추정"
```

**② 맥락**

- **회의에서**: *"GA4가 2024년 Data-driven을 기본으로 바꿨어요. Last-touch 보고서가 사라졌습니다."* — 표준 변화의 회의.

**③ 액션**

- **개발**: Data-driven은 *충분한 전환 데이터*(보통 월 300 전환+)가 있어야 모델 학습 가능. 작은 캠페인은 모델이 안 돌아갑니다.
- **기획**: Data-driven은 *블랙박스* 라 결과를 100% 설명하기 어렵습니다. 다른 모델과 *함께 보기* 가 안전.

**④ 사례**

- **센티**: GA4 Data-driven 모델 결과 — 페이스북 32%, 구글 28%, 카카오 18%, 기타 22%. Last-touch였던 카카오 35% 1위가 페이스북에 자리를 넘겼습니다.
- **실제 사례**: Google이 2024~2025년 모든 어트리뷰션 보고서의 *기본을 Data-driven으로 통일*. 사실상 *Last-touch 시대의 종말*.

**⑤ 비고**

- **함께 보기**: [Multi-touch](#multi-touch), [Incrementality](#incrementality)

---

## Multi-touch Attribution (MTA) · 멀티터치 어트리뷰션 {#multi-touch}

**① 정의**

*여러 접점에 공로를 분배하는 모델 전체* 의 우산 용어. Linear, Time-decay, Position-based, Data-driven 모두 MTA의 일종.

```
Single-touch: First-touch, Last-touch
Multi-touch: Linear, Time-decay, Position-based, Data-driven
```

**② 맥락**

- **회의에서**: *"Single-touch 시대에서 MTA로 전환 중. 그러나 cookie 종말로 MTA 자체의 정확도도 하락."* — 환경 변화의 어휘.

**⑤ 비고**

- **함께 보기**: [First-touch](#first-touch), [Last-touch](#last-touch), [Data-driven](#data-driven)

---

![어트리뷰션 모델 6종이 같은 경로의 공로를 어떻게 다르게 나누는지 비교하는 누적 가로 막대그래프. 제목은 '한 가입자, 세 광고, 여섯 가지 답'이다. 시나리오는 한 사용자가 페이스북(3주 전) → 구글(1주 전) → 인스타그램(1일 전)을 거쳐 가입한 경로이며, 1.0의 공로를 어떻게 나눌 것인가를 묻는다. 색상 범례는 페이스북(첫 접점), 구글(중간), 인스타그램(마지막)이다. 모델별 막대는 다음과 같다 — First-touch는 첫 접점에 100%로 페이스북 100% · 구글 0 · 인스타그램 0, Last-touch는 마지막 접점에 100%로 페이스북 0 · 구글 0 · 인스타그램 100%, Linear는 모든 접점 동일로 33% · 33% · 33%, Time-decay는 최근일수록 큰 가중치로 15% · 30% · 55%, Position-based는 첫·마지막 강조 U자형으로 40% · 20% · 40%, Data-driven은 ML이 데이터로 학습해 32% · 28% · 40%. 결론은 같은 데이터라도 모델 선택에 따라 여섯 가지 결론이 나오며 어느 모델을 쓰느냐가 광고비 배분을 바꾼다는 것, 2024년 이후 GA4 기본은 Data-driven이지만 모든 모델의 정확도는 결국 Incrementality 테스트로만 검증된다는 것이다.](./mmh-12-02-attribution-models.svg)

---

## View-through Conversion · 노출 후 전환 {#view-through}

**① 정의**

광고를 *클릭하지 않고 보기만 했는데도* 나중에 전환한 경우, 그 광고에 공로 부여.

```
View-through Window: 보통 1일~7일
"본 후 N일 안에 전환하면 그 광고 효과로 카운트"
```

**② 맥락**

- **회의에서**: *"디스플레이 광고는 View-through 비중이 높아요. 클릭만 보면 효과가 작아 보입니다."* — 디스플레이 광고 평가의 주요 지표.

**③ 액션**

- **기획**: View-through는 *과대평가 위험*. 광고를 봤다고 *그 광고가 원인* 이라고 단정할 수 없습니다. *Incrementality 테스트* 로 검증.

**⑤ 비고**

- **함께 보기**: [Click-through](#click-through), [Incrementality](#incrementality)

---

## Click-through Conversion · 클릭 후 전환 {#click-through}

**① 정의**

광고를 *클릭한 후* 전환한 경우.

```
Click-through Window: 보통 7일~30일
"클릭한 후 N일 안에 전환하면 그 광고 효과로 카운트"
```

View-through보다 *훨씬 강한 신호*.

**② 맥락**

- **회의에서**: *"검색 광고는 Click-through 위주, 디스플레이는 View-through 위주."* — 채널별 평가 기준.

**⑤ 비고**

- **함께 보기**: [View-through](#view-through), [Last-touch](#last-touch)

---

## Incrementality · 증분 효과 {#incrementality}

**① 정의**

광고가 *없었다면 일어나지 않았을 전환* 의 비율. *진짜 광고 효과*.

```
Incremental Conversion = 실험군 전환 - 대조군 전환
Incrementality % = Incremental ÷ 실험군 전환 × 100
```

대조군은 *광고를 보지 않은 집단*. Geo Holdout(지역별), PSA Test(공익광고 대체) 등으로 측정.

**② 맥락**

- **회의에서**: *"리타게팅 광고 ROAS 600%인데 Incrementality 테스트 결과 진짜 효과는 25%. 나머지는 그냥 들어왔을 사람."* — 어트리뷰션의 함정 폭로.

**③ 액션**

- **개발**: Incrementality 테스트는 *지역(도시) 단위 홀드아웃* 이 일반. 한 지역은 광고 보여주고, 비교 지역은 안 보여주고 차이 측정.
- **기획**: Incrementality 결과가 *어트리뷰션 보고서의 진실 검증*. 모든 광고 의사결정의 최후 기준.

**④ 사례**

- **실제 사례**: 페이스북·구글이 *Lift Studies(Brand Lift, Conversion Lift)* 도구로 Incrementality 측정 제공. 그러나 매체가 제공하는 결과는 *유리한 쪽으로 편향* 우려, 독립 측정 권장.

**⑤ 비고**

- **함께 보기**: [Holdout](/marketing-metrics-handbook-ep-10/#holdout), [Data-driven](#data-driven)

---

## GA4 · Google Analytics 4 {#ga4}

**① 정의**

Google의 무료 *웹·앱 통합 분석 도구*. 2023년 7월부터 *Universal Analytics(UA) 대체*. 모든 데이터가 *이벤트 기반*.

**② 맥락**

- **회의에서**: *"GA4로 옮긴 후 보고서가 다르게 보여요. UA와 정의가 달라요."* — 전환기의 일반적 혼란.

**③ 액션**

- **개발**: gtag.js 또는 Google Tag Manager 설치. 자동 측정 + 커스텀 이벤트.
- **기획**: GA4는 *마케팅 보고* 에 강점. 제품 분석(*funnel, retention, segmentation*)은 Amplitude·Mixpanel이 더 강함.

**④ 사례**

- **벤치마크 환경**: 한국 기준 GA4 점유율은 가장 높습니다. *무료 + 광고 매체 연동* 의 강점.

**⑤ 비고**

- **함께 보기**: [Amplitude](#amplitude), [Mixpanel](#mixpanel)

---

## Amplitude {#amplitude}

**① 정의**

*제품 분석(Product Analytics)* 전문 도구. *사용자 행동 추적, 코호트, 리텐션, A/B 테스트* 에 강점.

**② 맥락**

- **회의에서**: *"GA4는 광고 어트리뷰션, Amplitude는 제품 분석. 둘 다 운영."* — 일반적 도구 분담.

**③ 액션**

- **기획**: Amplitude는 *PM과 디자이너의 도구*. *코호트 분석, 퍼널 분석, 사용자 경로 분석* 에 GA4보다 친화적. 무료 플랜으로 시작 가능, 본격 사용은 유료.

**④ 사례**

- **실제 사례**: 토스, 당근, 무신사 등 한국 주요 IT 기업 다수가 Amplitude 사용.

**⑤ 비고**

- **함께 보기**: [GA4](#ga4), [Mixpanel](#mixpanel)

---

## Mixpanel {#mixpanel}

**① 정의**

Amplitude와 유사한 *제품 분석 도구*. *사용자 경로, 깊이 분석, 자유로운 쿼리* 에 강점.

**② 맥락**

- **회의에서**: *"Mixpanel은 분석가가 SQL처럼 깊이 파고들기 좋아요. Amplitude는 PM이 빠르게 보기 좋고요."* — 두 도구의 일반적 비교.

**③ 액션**

- **기획**: Mixpanel은 *분석가·데이터팀의 도구*. *Boards, JQL*(Mixpanel Query Language) 등 자유도 높음.

**⑤ 비고**

- **함께 보기**: [GA4](#ga4), [Amplitude](#amplitude)

---

## 이번 편 한눈에 보기

| 용어 | 정의 (한 줄) | 비고 |
|---|---|---|
| First-touch | 첫 접점 100% 공로 | 브랜드 평가 |
| Last-touch | 마지막 접점 100% 공로 | UA 기본, 종말 중 |
| Linear | 모든 접점 동일 분배 | 베이스라인 |
| Time-decay | 가입에 가까울수록 큰 가중치 | 짧은 사이클에 적합 |
| Position-based | 첫·마지막 강조, 중간 약화 | 40-20-40 |
| Data-driven | ML로 가중치 학습 | GA4 기본 (2024+) |
| Multi-touch (MTA) | 다중 접점 모델 우산 용어 | — |
| View-through | 광고 본 후 전환 | 과대평가 위험 |
| Click-through | 광고 클릭 후 전환 | 강한 신호 |
| Incrementality | 진짜 광고 효과 | 어트리뷰션의 진실 검증 |
| GA4 | Google 통합 분석 | 마케팅 어트리뷰션 표준 |
| Amplitude | 제품 분석 도구 | PM·디자이너 친화 |
| Mixpanel | 제품 분석 도구 | 분석가 친화, 깊은 쿼리 |

---

## 도구 지도 — 어떤 도구가 어떤 일에 맞나

| 분석 목적 | 적합한 도구 |
|---|---|
| 광고 어트리뷰션 | GA4, Adjust, AppsFlyer |
| 사용자 행동 분석 | Amplitude, Mixpanel |
| A/B 테스트 | GrowthBook, Optimizely, Statsig |
| 히트맵·세션 리플레이 | Hotjar, Microsoft Clarity, FullStory |
| NPS·설문 | Delighted, AskNicely, Typeform |
| 데이터 웨어하우스 | BigQuery, Snowflake, Redshift |
| BI 대시보드 | Looker, Tableau, Metabase |
| 마케팅 자동화 | Braze, Iterable, CleverTap |

---

## 자주 헷갈리는 쌍

### Attribution vs Incrementality

| | Attribution | Incrementality |
|---|---|---|
| **무엇 측정** | 전환의 공로 분배 | 진짜 광고 효과 |
| **방식** | 관찰 데이터 | 실험 (대조군) |
| **함정** | 채널별 과대평가 | 측정 비용 큼 |

### View-through vs Click-through

| | View-through | Click-through |
|---|---|---|
| **트리거** | 광고 노출만 | 광고 클릭 |
| **신뢰도** | 약함 | 강함 |
| **윈도우** | 1~7일 | 7~30일 |

### GA4 vs Amplitude vs Mixpanel

| | GA4 | Amplitude | Mixpanel |
|---|---|---|---|
| **주 목적** | 마케팅 어트리뷰션 | 제품 분석 | 제품 분석 (깊이) |
| **무료** | 완전 무료 | 한도 있음 | 한도 있음 |
| **광고 매체 연동** | 매우 강함 | 약함 | 약함 |
| **사용자 경로** | 보통 | 강함 | 매우 강함 |
| **타겟 사용자** | 마케터 | PM·디자이너 | 분석가·데이터팀 |

---

## 시리즈를 마치며

13편 136개 용어. *광고 비용 → 효율 → 유입 → 활성화 → 유지 → 이탈 → 수익 → 추천 → 실험 → 트래킹 → 어트리뷰션* 까지 깔때기 전 구간을 한 어휘 체계로 묶었습니다.

처음 [개요와 색인](/marketing-metrics-handbook-ep-00/) 으로 돌아가 *세 가지 색인 — 퍼널 단계별 / 회의 시나리오별 / UI 컴포넌트별 — 으로 다시 둘러보시기를* 권합니다. 어휘는 한 번에 외우는 게 아니라 *필요할 때 찾아 쓰는 것* 이니까요.

회의에서 *모르는 단어가 나왔을 때* 다시 찾으실 수 있도록, 이 시리즈는 *읽고 끝* 이 아니라 *옆에 두는 핸드북* 이 되기를 의도했습니다.

---

## 참고 자료

- Google. *Attribution Modeling in GA4*. https://support.google.com/analytics
- Singh, S. *Marketing Attribution*. Wiley.
- Facebook Marketing Partners. *Conversion Lift Study Guide*.
- Adjust. *Mobile Attribution 101*. https://www.adjust.com
- AppsFlyer. *The State of Mobile Attribution*.
- Tunguz, T. *MTA, MMM, and Incrementality*. https://tomtunguz.com
- Mixpanel vs Amplitude — *G2 Crowd Comparisons*. https://www.g2.com

---

## 시리즈 전체 목차

- [ep.00 — 개요와 색인](/marketing-metrics-handbook-ep-00/)
- [ep.01 — 광고 비용 지표](/marketing-metrics-handbook-ep-01/)
- [ep.02 — 광고 효율 지표](/marketing-metrics-handbook-ep-02/)
- [ep.03 — 유입과 클릭](/marketing-metrics-handbook-ep-03/)
- [ep.04 — 활성화와 온보딩](/marketing-metrics-handbook-ep-04/)
- [ep.05 — 유지와 참여](/marketing-metrics-handbook-ep-05/)
- [ep.06 — 코호트와 리텐션 곡선](/marketing-metrics-handbook-ep-06/)
- [ep.07 — 이탈(Churn)](/marketing-metrics-handbook-ep-07/)
- [ep.08 — 수익과 단위경제](/marketing-metrics-handbook-ep-08/)
- [ep.09 — 만족과 추천](/marketing-metrics-handbook-ep-09/)
- [ep.10 — 실험과 통계](/marketing-metrics-handbook-ep-10/)
- [ep.11 — 트래킹과 데이터 수집](/marketing-metrics-handbook-ep-11/)
- ep.12 — 어트리뷰션과 도구 지도
