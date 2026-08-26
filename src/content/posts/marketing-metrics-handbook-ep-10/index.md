---
title: "실험과 통계 - 마케팅 지표 핸드북 ep.10"
description: "A/B Test, p-value, Confidence Interval, MDE, Holdout. 변화가 진짜 효과인지 검증하는 12개의 통계 어휘."
summary: "지표가 좋아졌다. 그런데 진짜 우리 변경의 효과일까. 아니면 그냥 운일까. 이 질문에 답하기 위한 통계 도구들: A/B 테스트의 설계, 표본 크기 계산, p-value의 의미, 두 종류의 오류, 그리고 통계적 유의성과 비즈니스 유의성의 차이까지. 12개 용어를 정리합니다."
date: 2026-05-19
thumbnail: ./cover.svg
tags: [series, develop, design, marketing, metrics, ab-test, statistics, experimentation]
draft: false
---

![](./cover.svg)

같은 광고를 두 가지 카피로 돌렸다. 새 카피의 CVR이 4.2%, 기존 카피가 3.8%였다. 새 카피를 채택할까.

답은 *모른다*. 0.4%p 차이가 *진짜 카피의 효과* 인지, *우연인지* 모르기 때문이다. 매일 같은 카피를 돌려도 어느 날은 4.2%, 어느 날은 3.5%로 흔들린다. *흔들림보다 큰 차이* 여야 진짜 효과다.

통계는 이 "흔들림보다 큰가"의 판단 도구다. *p-value*, *confidence interval*, *MDE*. 모두 이 한 질문의 다른 표현이다.

---

## 이번 편에서 다룰 것

![핸드북 시리즈 전체 구조를 보여주는 단계 지도. 위쪽에는 다섯 단계 퍼널이 세로로 쌓여 있다: ep.01–02 획득, ep.03–04 활성화, ep.05–07 유지, ep.08 수익, ep.09 추천. 그 아래 '측정 인프라 · MEASUREMENT LAYER'라는 띠가 있고 세 항목이 들어 있다: ep.10 실험(A/B · p-value · MDE), ep.11 트래킹(UTM · Event · Pixel · CAPI), ep.12 어트리뷰션(Last-touch · Data-driven · GA4 · Amplitude). 이번 편인 ep.10 실험 항목이 강조 표시되어 있다. 하단 설명은 측정 인프라가 다섯 단계 전체에서 작동한다고 적혀 있다.](./mmh-10-01-stage-map.svg)

12개 용어. 실험 형태(A/B Test, Multivariate Test, Holdout), 통계의 기본(Statistical Significance, Confidence Interval, p-value), 실험 설계(Sample Size, MDE, Statistical Power), 두 가지 오류(Type I Error, Type II Error), 그리고 분석 함정(Sequential Testing).

이번 편은 *측정 인프라* 편입니다. 지금까지의 모든 지표가 *변화하는지 진짜 확인* 하는 도구들입니다.

---

## A/B Test · A/B 테스트 {#ab-test}

**① 정의**

사용자를 *무작위로 두 그룹으로 나눠* 각각 다른 경험을 보여주고, *결과 지표의 차이* 를 비교하는 실험.

```
A (대조군) — 기존 경험을 본 사용자 그룹
B (실험군) — 변경된 경험을 본 사용자 그룹
비교: 두 그룹의 핵심 지표 (CVR, 클릭률, 매출 등)
```

**② 맥락**

- **회의에서**: *"새 가입 흐름 A/B 테스트 결과 B군 CVR이 18% 높았어요. 통계적으로 유의합니다."* - 의사결정의 가장 강한 근거.
- **UI 위치**: 실험 플랫폼(Optimizely, GrowthBook, Statsig), 자체 A/B 도구.

**③ 액션**

- **개발**: 실험 인프라 - *무작위 그룹 배정, 실험 ID 트래킹, 일관된 노출(sticky bucketing), 통계 계산 자동화*. 가장 까다로운 부분은 *같은 사용자가 항상 같은 그룹* 이 되도록 보장.
- **디자인**: A/B를 *한 요소만 변경* 하는 원칙. CTA 카피와 색상을 같이 바꾸면 *어느 게 효과인지* 모릅니다.
- **기획**: 실험 *기간과 표본 크기* 를 시작 전에 결정. 도중에 멈추면 *Sequential Testing 함정*.

**④ 사례**

- **센티**: *"카카오로 시작" CTA 카피 A/B*. A: *"카카오로 시작하기"*, B: *"카카오 1초 가입"*. B군 CVR 9.8%, A군 8.4%. 1.4%p 차이, 통계적 유의. B 채택.
- **실제 사례**: 부킹닷컴은 *매년 1,000개 이상의 A/B 테스트* 운영. 모든 디자인 변경이 실험을 통과해야 배포. 토스도 비슷한 문화.

**⑤ 비고**

- **흔한 함정**: 표본 크기 부족 → 우연한 차이를 진짜 효과로 오인.
- **함께 보기**: [Sample Size](#sample-size), [Statistical Significance](#statistical-significance), [p-value](#p-value)

---

## Multivariate Test · 다변량 테스트 {#multivariate-test}

**① 정의**

*여러 요소를 동시에 변형* 해 모든 조합의 효과를 보는 실험.

```
A/B: 변형 2개 → 2그룹
MVT 2x2: 변형 4개 → 4그룹
MVT 3x3: 변형 9개 → 9그룹
```

각 요소의 *주효과(main effect)* 와 *상호작용(interaction)* 까지 측정.

**② 맥락**

- **회의에서**: *"카피 3종 × 이미지 3종 = 9개 조합 MVT 돌립니다. 각 조합 1,200명씩 6주 필요."* - 표본 크기가 급격히 늘어나는 한계.

**③ 액션**

- **개발**: MVT는 *그룹 수가 많아 분석 복잡도* 증가. 결과 해석 자동화 도구 필요.
- **기획**: 일반적으로 *A/B 테스트로 한 요소씩 검증* 이 더 효율적. MVT는 *상호작용을 보고 싶을 때만* 사용.

**⑤ 비고**

- **함께 보기**: [A/B Test](#ab-test)

---

## Statistical Significance · 통계적 유의성 {#statistical-significance}

**① 정의**

관찰된 차이가 *우연으로 설명되지 않을 만큼 큰* 정도. 보통 *p-value < 0.05* 또는 *0.01* 을 기준으로.

```
통계적 유의함 = p-value < α (보통 0.05)
```

*우연일 확률이 5% 미만* 이라는 뜻.

**② 맥락**

- **회의에서**: *"차이는 1.4%p이지만 p-value 0.03이라 통계적 유의함."* - 결과 발표의 표준 어휘.

**③ 액션**

- **기획**: *통계적 유의 = 비즈니스적 의미* 가 아닙니다. 표본이 충분히 크면 *0.1%p 차이* 도 통계적 유의가 됩니다. 그 차이가 *실제로 의미 있는지* 는 별개 판단.

**⑤ 비고**

- **함께 보기**: [p-value](#p-value), [MDE](#mde)

---

## Confidence Interval · 신뢰 구간 {#confidence-interval}

**① 정의**

추정값이 *얼마나 정확한지* 의 범위. *95% 신뢰 구간* 은 *동일한 실험을 100번 반복하면 95번은 이 범위 안에 진짜 값이 있을 것* 이라는 뜻.

```
B군 CVR = 9.8% [95% CI: 8.9% ~ 10.7%]
```

**② 맥락**

- **회의에서**: *"B군 9.8%, 95% CI 8.9~10.7%. A군 8.4%와 겹치지 않아 유의함."* - 두 구간이 겹치는지 안 겹치는지가 유의성의 직관적 신호.

**③ 액션**

- **개발**: CI 계산은 실험 플랫폼이 자동. *모수가 작으면 CI가 매우 넓어집니다*. 표본이 적은 실험은 결과를 믿기 어려움.
- **기획**: 단순 *평균 차이* 만 보고하면 위험. 항상 CI와 함께 보고.

**⑤ 비고**

- **함께 보기**: [Statistical Significance](#statistical-significance), [Sample Size](#sample-size)

---

![A/B 테스트 결과를 보여주는 두 개의 종 모양 분포 곡선 그래프. 제목은 '두 분포가 얼마나 겹치는가'이며, 가로축은 CVR로 7.5%부터 10.5%까지 0.5% 간격이다. 회색 곡선은 A군(평균 8.4%), 진한 녹색 곡선은 B군(평균 9.8%)으로 각각 점선으로 평균이 표시되어 있고, 두 분포가 살짝 겹치는 영역이 주황색으로 칠해져 있다. 두 평균 사이에는 +1.4%p 차이가 표시된다. 아래에는 2×2 통계 박스 네 개가 있다: P-VALUE 0.03(우연일 확률 3%), 95% CI (B−A) +0.4~+2.4%p(0을 포함하지 않아 유의), SAMPLE SIZE 12,400×2(그룹당 표본), 상대 변화 +16.7%(9.8/8.4−1). 분포가 겹치는 영역이 작을수록 차이가 우연이 아닐 확률이 높다는 것을 보여준다.](./mmh-10-02-ab-test-distribution.svg)

---

## p-value · p값 {#p-value}

**① 정의**

*두 그룹 사이에 차이가 없다고 가정(귀무가설)했을 때, 관찰된 차이 이상이 우연히 발생할 확률*.

```
p-value: 0~1 사이의 값
p < 0.05: 우연일 확률 5% 미만 → 통계적 유의
p < 0.01: 우연일 확률 1% 미만 → 매우 유의
```

**② 맥락**

- **회의에서**: *"p-value 0.03. 우연일 확률 3%."* - 가장 흔한 보고 형식.

**③ 액션**

- **기획**: p-value의 의미를 정확히. *"A안이 B안보다 좋을 확률 95%"* 가 아닙니다. *"두 안이 같다고 가정했을 때 이런 차이가 우연일 확률 5% 미만"*. 미묘하지만 결정적 차이.

**⑤ 비고**

- **흔한 함정**: *p-value 0.06이면 거의 유의함* 으로 보고 채택하는 함정. 0.05 임계는 *결정 규칙* 일 뿐 *진리* 가 아닙니다. 더 큰 모수로 재실험이 정답.
- **함께 보기**: [Statistical Significance](#statistical-significance), [Confidence Interval](#confidence-interval)

---

## Sample Size · 표본 크기 {#sample-size}

**① 정의**

실험에 필요한 *각 그룹의 최소 사용자 수*. 세 요소로 계산.

```
필요 표본 = f(baseline, MDE, α, power)
- baseline: 기준 지표 값 (예: 현재 CVR 4%)
- MDE: 감지하려는 최소 차이 (예: 0.5%p)
- α: 유의수준 (보통 0.05)
- power: 검정력 (보통 0.80)
```

**② 맥락**

- **회의에서**: *"MDE 0.5%p 잡으면 각 그룹 12,400명 필요해요. 트래픽 기준 4주 걸립니다."* - 실험 *기간 계산* 의 출발점.

**③ 액션**

- **개발**: 표본 크기 계산기(*Optimizely Sample Size Calculator, Evan Miller, GrowthBook*). 실험 시작 전 필수.
- **기획**: 트래픽이 부족하면 *MDE를 크게* 잡거나 *기간을 늘리거나* 결단. 작은 효과를 빠르게 찾는 건 불가능.

**④ 사례**

- **센티**: 가입 페이지 CVR baseline 4.2%, MDE 0.5%p. 그룹당 12,400명 필요. 일 가입 시도 800명이라 16일 + 주말 효과 보정 21일.

**⑤ 비고**

- **함께 보기**: [MDE](#mde), [Statistical Power](#statistical-power)

---

## MDE · Minimum Detectable Effect · 최소 감지 효과 {#mde}

**① 정의**

실험이 *감지할 수 있는 최소 차이*. MDE보다 작은 효과는 *표본이 부족해 보이지 않을 수* 있습니다.

```
MDE = 실험 설계에서 정한 최소 차이
일반적으로 5% 상대 변화 또는 0.5%p 절대 변화
```

**② 맥락**

- **회의에서**: *"MDE 5% 상대 변화로 설계. 그보다 작은 효과는 못 봅니다."* - 실험의 *해상도* 사전 공시.

**③ 액션**

- **기획**: MDE를 작게 잡으면 표본 크기가 *제곱으로* 늘어남. MDE 0.5%p → 1%p로 풀면 표본 1/4로 감소.

**⑤ 비고**

- **함께 보기**: [Sample Size](#sample-size), [Statistical Power](#statistical-power)

---

## Type I Error · 1종 오류 {#type-i-error}

**① 정의**

*효과가 없는데 있다고 판단* 하는 오류. *위양성(false positive)*.

```
Type I Error 확률 = α (유의수준) = 보통 5%
```

p-value 임계를 0.05로 잡으면 *진짜 효과가 없는 경우 100번 중 5번은* 잘못 채택하게 됩니다.

**② 맥락**

- **회의에서**: *"여러 실험을 동시 돌리면 1종 오류 누적. 본페로니 보정 검토 필요."* - 다중 비교의 함정.

**③ 액션**

- **기획**: *동시에 5개 실험* 을 돌리면 1종 오류가 결합 - 적어도 하나가 잘못 유의로 나올 확률 약 23%. 본페로니 보정(α를 실험 수로 나누기).

**⑤ 비고**

- **함께 보기**: [Type II Error](#type-ii-error), [Statistical Significance](#statistical-significance)

---

## Type II Error · 2종 오류 {#type-ii-error}

**① 정의**

*효과가 있는데 없다고 판단* 하는 오류. *위음성(false negative)*.

```
Type II Error 확률 = β
Statistical Power = 1 - β = 보통 80%
```

표본 크기가 부족하면 *진짜 효과를 놓칠* 확률 증가.

**② 맥락**

- **회의에서**: *"실험 결과 차이 없음. 그런데 MDE 1%p로 풀어서 봤어요. 진짜 차이가 0.5%p였다면 못 봤을 수 있습니다."* - Type II 가능성 인정.

**③ 액션**

- **기획**: *차이 없음* 결과를 받아들이기 전에 *충분한 표본이었는지* 확인. *Power Analysis* 필수.

**⑤ 비고**

- **함께 보기**: [Type I Error](#type-i-error), [Statistical Power](#statistical-power)

---

## Statistical Power · 통계적 검정력 {#statistical-power}

**① 정의**

*진짜 효과가 있을 때 그걸 발견할 확률*.

```
Power = 1 - β = 보통 0.80
```

Power 80%는 *진짜 효과가 있다면 100번 중 80번은 발견* 한다는 뜻.

**② 맥락**

- **회의에서**: *"Power 80% 기준으로 표본 크기 계산했어요."* - 실험 설계의 표준 가정.

**③ 액션**

- **기획**: *중요한 의사결정 실험* 은 Power 90% 이상으로 설계. *일상 변경 실험* 은 80%로 충분.

**⑤ 비고**

- **함께 보기**: [Sample Size](#sample-size), [Type II Error](#type-ii-error)

---

## Sequential Testing · 순차 검정 {#sequential-testing}

**① 정의**

실험 *진행 도중* 결과를 *반복적으로 확인* 하면서 *유의가 나오는 즉시 중단* 하는 접근.

표준 A/B 테스트는 *기간이 끝나기 전 결과를 봐서는 안 됩니다*. 도중에 보고 멈추면 *1종 오류가 부풀려집니다*. 이걸 보정하는 것이 Sequential Testing.

**② 맥락**

- **회의에서**: *"중간에 결과 보고 싶으면 Sequential 방식으로 설계. 그렇지 않으면 끝까지 기다리세요."* - 실험 운영의 규율.

**③ 액션**

- **개발**: Sequential Testing은 *별도 통계 방법*(SPRT, mSPRT 등). 일반 A/B 통계와 다름. 실험 플랫폼이 지원하는지 확인.

**⑤ 비고**

- **흔한 함정**: 가장 흔한 실험 실수가 *도중에 결과 보고 멈추기*. p-value가 흔들리면서 우연히 유의가 나오는 시점에 중단하면 *거짓 양성*.
- **함께 보기**: [p-value](#p-value), [Type I Error](#type-i-error)

---

## Holdout · 홀드아웃 {#holdout}

**① 정의**

전체 사용자 중 *일부를 의도적으로 변경에서 제외* 해 *장기 효과를 측정* 하는 방법.

```
Holdout = 신기능을 끝까지 안 보는 대조군 (예: 5%)
```

A/B 테스트가 *단기 변화* 를 측정한다면, Holdout은 *분기·연 단위 효과* 측정.

**② 맥락**

- **회의에서**: *"가족 공유 기능 5% 홀드아웃 유지 중. 6개월 후 그룹 간 LTV 비교 예정."* - 장기 효과 측정.

**③ 액션**

- **개발**: 사용자 ID 기반 *영구 그룹 배정*. 한 번 홀드아웃이면 영구 홀드아웃. 사용자에게 불공정으로 느껴질 수 있어 *비공개 운영*.
- **기획**: 홀드아웃 크기는 트래픽의 *5~10%* 가 일반적. 너무 크면 *기회비용*, 너무 작으면 통계 검정력 부족.

**④ 사례**

- **센티**: 가족 공유 기능 출시 시 5% 홀드아웃. 6개월 후 *홀드아웃 그룹 LTV 52,000원 vs 노출 그룹 LTV 71,000원*. 가족 공유 효과 +19,000원/사용자.
- **실제 사례**: 페이스북·인스타그램이 일부 기능 *영구 홀드아웃 그룹* 을 유지하는 것으로 알려진 운영 패턴. *뉴스피드를 못 본 사용자* 가 비교 대조군.

**⑤ 비고**

- **함께 보기**: [A/B Test](#ab-test), [LTV](/marketing-metrics-handbook-ep-08/#ltv)

---

## 이번 편 한눈에 보기

| 용어 | 정의 (한 줄) | 표준 값 |
|---|---|---|
| A/B Test | 무작위 두 그룹 비교 실험 | - |
| Multivariate Test | 여러 요소 동시 변형 실험 | - |
| Statistical Significance | 우연이 아닌 차이 | p < 0.05 |
| Confidence Interval | 추정값의 범위 | 95% CI |
| p-value | 우연일 확률 | < 0.05 유의 |
| Sample Size | 필요 표본 크기 | MDE에 따라 계산 |
| MDE | 감지 가능한 최소 효과 | 보통 5% 상대 |
| Type I Error | 위양성 (없는데 있다) | α = 5% |
| Type II Error | 위음성 (있는데 없다) | β = 20% |
| Statistical Power | 효과 발견 확률 | 1 − β = 80% |
| Sequential Testing | 도중 확인 보정 방법 | - |
| Holdout | 영구 대조군 | 5~10% |

---

## 자주 헷갈리는 쌍

### Statistical Significance vs Business Significance

| | Statistical | Business |
|---|---|---|
| **무엇 판단** | 차이가 우연이 아닌가 | 그 차이가 실용적인가 |
| **기준** | p < 0.05 | 매출·전략 임계 |
| **함께 봐야** | 둘 다 통과해야 채택 | |

CVR 4.2% → 4.21% 차이가 통계적으로 유의해도 비즈니스적으로는 무의미할 수 있습니다.

### Type I vs Type II

| | Type I | Type II |
|---|---|---|
| **위양성/위음성** | 위양성 | 위음성 |
| **방향** | 없는 효과를 있다고 | 있는 효과를 없다고 |
| **결과** | 잘못된 변경 채택 | 좋은 변경 폐기 |
| **기본 확률** | 5% (α) | 20% (β) |

### A/B Test vs Holdout

| | A/B Test | Holdout |
|---|---|---|
| **기간** | 보통 1~6주 | 분기·연 단위 |
| **측정** | 단기 행동 변화 | 장기 LTV·잔존 |
| **그룹 영구성** | 끝나면 모두 한 안으로 | 일부 영구 분리 |

---

## 참고 자료

- Kohavi, R., Tang, D., & Xu, Y. (2020). *Trustworthy Online Controlled Experiments*. Cambridge University Press.
- Wasserstein, R. L., & Lazar, N. A. (2016). *The ASA's Statement on p-Values*. The American Statistician.
- Optimizely. *Stats Engine Documentation*. https://help.optimizely.com
- Evan Miller. *Sample Size Calculator*. https://www.evanmiller.org/ab-testing
- GrowthBook. *Sequential Testing Methodology*. https://docs.growthbook.io
- Microsoft Experimentation Platform. *ExP Guides*.

---

## 다음 편 예고

> [ep.11 - 트래킹과 데이터 수집](/marketing-metrics-handbook-ep-11/)

이 모든 측정의 *밑바닥에 깔리는 인프라*. UTM, 이벤트 트래킹, 픽셀·태그, 서버사이드 트래킹, 그리고 쿠키 시대의 종말과 동의 모드까지. 12개 용어.
