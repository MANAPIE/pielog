---
title: "이탈(Churn) - 마케팅 지표 핸드북 ep.07"
description: "Churn Rate, Logo Churn, Revenue Churn, NRR, GRR. 떠난 사람을 묘사하는 11개의 단어."
summary: "유지의 반대편을 다룹니다. 한 달 사이에 누가 떠났는가, 그게 매출에 어떤 영향을 주는가. 고객 수 기준 이탈과 매출 기준 이탈의 차이, SaaS의 핵심 지표 NRR과 GRR, 자발과 비자발 이탈의 구분, 그리고 윈백과 부활까지. 11개 용어를 정리합니다."
date: 2026-05-17
thumbnail: ./cover.svg
tags: [series, develop, design, marketing, metrics, churn, retention, nrr, grr, saas]
draft: false
---

![](./cover.svg)

리텐션이 *남은 사람을 세는 일* 이라면 이탈은 *떠난 사람을 세는 일* 이다. 같은 데이터의 뒷면.

그런데 이탈은 리텐션보다 한 겹 더 복잡하다. *고객 수가 줄었는지* 와 *매출이 줄었는지* 가 다를 수 있다. 100명 중 10명이 떠났지만 그 10명이 작은 고객이라 매출은 1%만 줄 수도 있고, 5명만 떠났는데 그 5명이 대형 고객이라 매출이 20% 빠질 수도 있다. SaaS와 구독 서비스에서는 *고객 수 이탈* 과 *매출 이탈* 을 항상 구분해서 본다.

---

## 이번 편에서 다룰 것

![마케팅 지표 핸드북 시리즈의 5단계 퍼널 지도. 위에서부터 획득(ep.01–02), 활성화(ep.03–04), 유지(ep.05–07), 수익(ep.08), 추천(ep.09) 카드가 화살표로 연결되고, 이번 편이 속한 유지 단계가 강조 표시되어 있으며 Churn·NRR·GRR·Win-back 지표가 함께 적혀 있다. 맨 아래에는 측정 인프라(MEASUREMENT LAYER) 띠로 ep.10 실험·ep.11 트래킹·ep.12 어트리뷰션이 배치되어 있다.](./mmh-07-01-stage-map.svg)

11개 용어. 이탈 기본 정의(Churn Rate), 두 가지 단위(Logo Churn, Revenue Churn), 매출 잔존 지표(NRR, GRR), 이탈 후 복귀(Reactivation, Win-back), 휴면(Dormant User), 이탈 원인 분류(Voluntary Churn, Involuntary Churn, Churn Reason).

이번 편은 *SaaS와 구독 모델* 의 어휘가 많습니다. 일회성 거래 비즈니스(이커머스)에서는 이 단어들이 약하게만 사용됩니다.

---

## Churn Rate · 이탈률 {#churn-rate}

**① 정의**

기간 시작 시점의 활성 사용자(또는 구독자) 중 *기간 안에 떠난 비율*.

```
Churn Rate = 기간 내 떠난 사용자 수 ÷ 기간 시작 시점 사용자 수 × 100 (%)
```

월 100명에서 시작해 한 달 동안 5명이 구독 해지했다면 월 Churn Rate 5%.

**② 맥락**

- **회의에서**: *"이번 분기 월 Churn 4.2%인데 작년 동기 5.8%였어요. 1.6%p 개선."* — 가장 자주 보는 단일 숫자.
- **UI 위치**: SaaS 대시보드, 구독 서비스 BI, 투자자 자료.

**③ 액션**

- **개발**: Churn 정의서. *언제 떠난 것으로 간주할지* — 구독 해지 클릭 시점, 결제 실패 시점, 마지막 활성 후 N일 경과 시점. 정의에 따라 같은 데이터에서 Churn이 2배 차이.
- **디자인**: 해지 흐름 자체의 디자인이 Churn에 영향. *해지 직전 가치 재안내, 일시 정지 옵션, 다운그레이드 옵션, 해지 사유 수집* 까지.
- **기획**: Churn은 *복리 효과* 때문에 작은 차이가 크게 누적됩니다. 월 5% Churn = 연 46% 잔존, 월 3% Churn = 연 69% 잔존. 2%p 차이가 1년에 23%p 차이.

**④ 사례**

- **센티**: 프리미엄 구독자 월 Churn 6.8%. 평균 구독 유지 14.7개월(1÷0.068). *해지 직전 일시 정지 옵션* 추가 후 Churn 4.9%로 감소.
- **실제 사례**: 넷플릭스 글로벌 월 Churn 약 2%, 디즈니플러스 약 4%, 한국 OTT(웨이브, 티빙) 6~10%. 운영 성숙도와 콘텐츠 강도의 차이.
- **벤치마크(2025년 기준)**: B2B SaaS 0.5\~1.5%(월), B2C 구독 5\~10%(월), 모바일 게임 30%(월).

**⑤ 비고**

- **흔한 함정**: 월 Churn과 연 Churn을 혼동. 월 5%는 연 46%로 환산. 같은 회의에서 두 단위가 섞이면 의사결정이 틀어집니다.
- **함께 보기**: [Logo Churn](#logo-churn), [Revenue Churn](#revenue-churn), [Retention Curve](/marketing-metrics-handbook-ep-06/#retention-curve)

---

## Logo Churn · 고객 수 이탈 {#logo-churn}

**① 정의**

기간 안에 *떠난 고객 수의 비율*. 매출 크기와 상관없이 *고객 1명 = 1로 카운트*.

```
Logo Churn = 떠난 고객 수 ÷ 기간 시작 고객 수 × 100 (%)
```

*Logo* 는 B2B 맥락의 어휘 — *기업 고객의 로고가 하나 없어졌다* 는 비유.

**② 맥락**

- **회의에서**: *"이번 분기 Logo Churn 3.2%, Revenue Churn 1.8%. 떠난 고객이 평균 이하 크기였어요."* — 두 수치를 항상 묶어서 봅니다.
- **UI 위치**: SaaS 대시보드. *Customer Churn* 으로도 표기.

**③ 액션**

- **개발**: 고객 단위 카운트와 매출 단위 카운트를 *두 컬럼으로 함께* 산출. 단일 쿼리에서 둘 다 나오게.
- **기획**: Logo Churn만 보면 *어떤 고객이 떠났는지* 정보가 빠집니다. Revenue Churn과 ARPU를 함께 봐야 진단이 완성.

**④ 사례**

- **센티(B2B 가족 플랜)**: 분기 Logo Churn 4.1%, Revenue Churn 2.3%. 떠난 가족 그룹이 평균 인원 적은 그룹.
- **실제 사례**: 슬랙 초기 Logo Churn 2%대였지만 Revenue Churn은 마이너스. 떠난 고객 매출보다 *기존 고객의 추가 결제* 가 더 많았기 때문. → NRR > 100%.

**⑤ 비고**

- **함께 보기**: [Revenue Churn](#revenue-churn), [NRR](#nrr)

---

## Revenue Churn · 매출 이탈 {#revenue-churn}

**① 정의**

기간 안에 *잃은 매출의 비율*. 떠난 고객의 매출 + 다운그레이드한 고객의 감소분.

```
Revenue Churn = (이탈 매출 + 다운그레이드 매출 감소) ÷ 기간 시작 MRR × 100 (%)
```

```
Gross Revenue Churn = 매출 손실만
Net Revenue Churn = 매출 손실 - 기존 고객 확장 매출
```

**② 맥락**

- **회의에서**: *"Gross Revenue Churn 4%인데 Expansion이 6%라서 Net은 -2%. NRR 102%."* — 매출 잔존의 정밀 진단.

**③ 액션**

- **개발**: 매출 변동을 *유형별로 분리* — 신규(New), 확장(Expansion), 축소(Contraction), 이탈(Churn). 이걸 MRR Movement 또는 *MRR Bridge* 라고 부릅니다.
- **기획**: Revenue Churn은 *고객 크기에 따른 가중* 평균. 대형 고객 1명 이탈이 소형 고객 100명 이탈과 같은 무게.

**④ 사례**

- **센티(B2B 가족 플랜)**: 월 시작 MRR 1억 8천만 원. 이탈 800만, 축소 200만, 신규 1,200만, 확장 600만. Gross Churn 5.6%, Net Churn 0%. NRR 100%.

**⑤ 비고**

- **함께 보기**: [NRR](#nrr), [GRR](#grr), [Logo Churn](#logo-churn)
- **시각화**

![같은 분기 100명 고객의 이탈을 두 단위로 비교한 다이어그램. 위쪽 '고객 수 단위 — Logo Churn'은 모든 고객을 동일 가중으로 보아 100개의 점 중 맨 아랫줄 10개가 이탈로 표시되며, Logo Churn 10.0%(100명 중 10명 이탈)이다. 아래쪽 '매출 단위 — Revenue Churn'은 큰 고객에 큰 무게를 두어, 대형 5명 합 500만원·중형 35명 합 350만원·소형 60명 합 120만원으로 매출 막대를 그린다. 이탈한 10명은 대형 0명·중형 2명·소형 8명으로 매출 손실은 20만+16만=36만원이고, Revenue Churn은 970만 중 36만 손실로 3.7%이다. 결론은 Logo 10.0% ≠ Revenue 3.7%로, 떠난 고객이 평균보다 작았다는 진단이며 두 수치를 항상 함께 봐야 한다는 것.](./mmh-07-02-logo-vs-revenue-churn.svg)

---

## NRR · Net Revenue Retention · 순매출 잔존율 {#nrr}

**① 정의**

기간 시작 시점의 매출이 *기간 끝에 얼마나 남았는가* — 확장(expansion)까지 포함한 순잔존.

```
NRR = (시작 MRR - 이탈 MRR - 축소 MRR + 확장 MRR) ÷ 시작 MRR × 100 (%)
```

NRR 110%는 *기존 고객 100명이 떠난 사람을 빼고도 110의 매출을 만들었다* 는 뜻. 가장 강력한 SaaS 지표.

**② 맥락**

- **회의에서**: *"이번 분기 NRR 118%에요. 신규 없이도 매출이 18% 자라요."* — *PLG(Product-Led Growth)* 의 황금 신호.

**③ 액션**

- **개발**: NRR의 분자는 *시작 시점에 활성이던 고객의 종료 시점 매출 합*. *시작 시점에 활성이었던 사용자* 의 코호트가 핵심.
- **기획**: NRR이 100%를 넘으면 *완벽한 회사*. 광고 없이도 매출이 자랍니다. 100~110%가 좋은 SaaS, 120%+ 가 최상위.

**④ 사례**

- **센티(가족 플랜)**: NRR 104%. 가족 인원 추가가 확장 매출을 만들어 이탈을 상쇄.
- **실제 사례**: 스노우플레이크 NRR 170%대, 데이터독 130%대로 유명. 슬랙 초기 130%대였습니다.
- **벤치마크**: SaaS B2B 100\~120% 좋음, 120%+ 최상위. SMB·B2C SaaS는 80\~100% 흔함.

**⑤ 비고**

- **함께 보기**: [GRR](#grr), [Revenue Churn](#revenue-churn), [MRR](/marketing-metrics-handbook-ep-08/#mrr)

---

## GRR · Gross Revenue Retention · 순순매출 잔존율 {#grr}

**① 정의**

확장을 *제외하고* 본 매출 잔존율. *기존 고객이 떠나거나 축소된 만큼만* 본 수치.

```
GRR = (시작 MRR - 이탈 MRR - 축소 MRR) ÷ 시작 MRR × 100 (%)
```

GRR은 항상 100% 이하. NRR ≥ GRR.

**② 맥락**

- **회의에서**: *"NRR 118%인데 GRR 92%에요. 이탈은 분명 있지만 확장이 그걸 덮어요."* — *진짜 떠나는 사람은 얼마인가* 의 질문.

**③ 액션**

- **기획**: GRR이 90% 미만이면 *확장으로 가리는 이탈이 너무 크다* 는 신호. *진짜 충성 고객 비중* 의 측정.

**④ 사례**

- **센티(가족 플랜)**: GRR 94%. *떠나는 가족이 6%* 인데 확장이 10%로 NRR 104%를 만듭니다. 떠나는 사람을 줄이면 NRR이 더 강해질 여지.

**⑤ 비고**

- **벤치마크**: B2B 엔터프라이즈 GRR 95%+, SMB SaaS 80\~90%, B2C 50\~70%(자연 이탈 높음).
- **함께 보기**: [NRR](#nrr)

---

## Reactivation · 재활성화 {#reactivation}

**① 정의**

휴면 또는 이탈한 사용자가 *다시 활성으로 돌아온 사건*. [ep.06](/marketing-metrics-handbook-ep-06/)의 *Resurrected User* 와 비슷하지만, *마케팅 액션의 결과* 라는 관점에서 사용.

```
Reactivation Rate = 부활한 사용자 수 ÷ 휴면 사용자 수
```

**② 맥락**

- **회의에서**: *"휴면 90일 사용자 대상 푸시 캠페인 Reactivation Rate 4.8%, 일반 평균 1%."* — 윈백 캠페인의 효과 측정.

**③ 액션**

- **개발**: 사용자 상태 머신 — Active, Dormant, Churned, Reactivated. *재활성화 사건 발생 시* 알림 이벤트와 마케팅 도구 연동.
- **디자인**: 부활한 사용자는 *왜 떠났는지* 모르고 *다시 떠나기 쉽습니다*. 복귀 직후 *가치 재경험* 화면 디자인.
- **기획**: 재활성화 캠페인의 *허용 비용* 정의. 신규 CAC의 절반 이하가 일반적.

**④ 사례**

- **센티**: 90일 휴면 → *"이번 달 카드값 12% 증가"* 푸시. Reactivation Rate 4.8%. 신규 CAC 24,000원 대비 부활 비용 약 6,000원으로 매우 효율적.

**⑤ 비고**

- **함께 보기**: [Win-back](#win-back), [Resurrected User](/marketing-metrics-handbook-ep-06/#resurrected-user)

---

## Win-back · 윈백 {#win-back}

**① 정의**

이탈한 (구독 해지한) 고객을 *다시 가입하게 만드는 캠페인 또는 그 결과*.

```
Win-back Rate = 윈백 성공 고객 수 ÷ 이탈 고객 수
```

Reactivation과 비슷하지만, *명시적으로 떠난 고객* 을 대상으로 합니다. (Reactivation은 *조용히 안 들어온 사용자* 까지 포함.)

**② 맥락**

- **회의에서**: *"3개월 전 해지 고객 윈백 캠페인 결과 8.2% 복귀."* — 명시적 해지자의 회수율.

**③ 액션**

- **개발**: 해지 시점에 *해지 사유* 와 *해지 후 상태(이메일 수신 동의 등)* 를 함께 저장. 윈백 캠페인 타겟팅의 기초.
- **디자인**: 윈백 이메일·푸시는 *떠난 이유에 맞춘 메시지*. 가격이 문제였다면 할인, 기능이 부족했다면 신기능 안내.
- **기획**: 윈백의 ROI 계산 — *돌아온 고객의 LTV* vs *윈백 캠페인 비용*. 보통 ROI가 매우 높지만 모수가 작습니다.

**④ 사례**

- **센티**: 3개월 전 해지 고객 대상 *50% 할인 3개월* 윈백. 응답률 8.2%. 그중 70%가 할인 종료 후에도 정가로 갱신.
- **실제 사례**: 넷플릭스의 *결제 정보 갱신 캠페인*, 디즈니플러스의 *연간 구독 할인 윈백*. 매월 정기적으로 실행되는 SaaS 운영 패턴.

**⑤ 비고**

- **함께 보기**: [Reactivation](#reactivation), [Churn Reason](#churn-reason)

---

## Dormant User · 휴면 사용자 {#dormant-user}

**① 정의**

*N일 이상 활성이 없지만 명시적으로 떠나지 않은* 사용자.

```
Dormant User = 마지막 활성 후 N일 이상 경과 + 계정은 살아있음
```

N의 기준은 보통 30일·60일·90일. 제품마다 다릅니다.

**② 맥락**

- **회의에서**: *"휴면 30일 사용자가 8.2K, 60일 12.4K, 90일 18.6K. 휴면 누적이 활성보다 빨라요."* — 휴면이 쌓이는 속도의 진단.

**③ 액션**

- **개발**: 매일 batch로 *사용자 상태 업데이트* — Active ↔ Dormant. 마지막 활성 시각만 알면 계산 가능.
- **디자인**: 휴면 사용자는 *조용한 이탈자*. 명시적 해지가 없어서 알아채기 어려움. 휴면 초기에 *재미있는 인사이트 알림* 으로 복귀 유도.
- **기획**: 휴면 30일 → 60일 → 90일 단계마다 *재활성화 시도의 강도와 빈도* 를 차등.

**⑤ 비고**

- **함께 보기**: [Reactivation](#reactivation), [N-day Retention](/marketing-metrics-handbook-ep-06/#n-day-retention)

---

## Voluntary Churn · 자발 이탈 {#voluntary-churn}

**① 정의**

사용자가 *명시적으로 해지한* 이탈. 가격, 기능 부족, 경쟁사 이동 등 *의도된* 사유.

```
Voluntary Churn = 사용자가 직접 해지 액션을 한 이탈
```

**② 맥락**

- **회의에서**: *"전체 Churn 중 Voluntary 72%, Involuntary 28%."* — 이탈 원인의 첫 번째 분류.

**③ 액션**

- **개발**: 해지 액션 이벤트에 *해지 사유* 필드 함께 저장. 해지 페이지의 사유 선택 UI가 데이터의 출발점.
- **디자인**: 해지 페이지의 사유 옵션을 *진짜 분석에 쓸 수 있게* 설계. 자유 입력만 받으면 분석 어려움, 선택지만 주면 진짜 사유 누락.
- **기획**: Voluntary Churn은 *제품·가격 문제*. 이걸 줄이는 것이 PM의 책임.

**⑤ 비고**

- **함께 보기**: [Involuntary Churn](#involuntary-churn), [Churn Reason](#churn-reason)

---

## Involuntary Churn · 비자발 이탈 {#involuntary-churn}

**① 정의**

사용자가 *떠나려는 의도 없이* 발생한 이탈. 가장 흔한 사유는 *카드 결제 실패*. 외에 만료된 카드, 한도 초과, 카드 변경 후 미갱신 등.

```
Involuntary Churn = 결제 실패 또는 기술적 문제로 발생한 이탈
```

**② 맥락**

- **회의에서**: *"Involuntary 비중 32%. 절반이 결제 실패에요. Dunning 프로세스를 강화해야 합니다."* — 이건 *제품 문제가 아니라 결제 시스템 문제*.

**③ 액션**

- **개발**: *Dunning Management* — 결제 실패 시 재시도 로직, 사용자에게 알림 시퀀스, 카드 갱신 유도 페이지. 외부 SaaS(Stripe Smart Retries 등) 활용 가능.
- **디자인**: 결제 실패 알림의 *카피와 위계*. *"카드가 만료되었어요"* 의 톤이 단호한가 부드러운가에 따라 갱신율이 크게 다릅니다.
- **기획**: Involuntary Churn은 *통제 가능한* 이탈. 보통 50% 이상을 복구할 수 있습니다.

**④ 사례**

- **센티**: 월 Involuntary Churn 1.8%. Dunning 시퀀스 추가(D-3 알림, D0 결제 실패, D+1 재시도, D+3 사용자 알림, D+7 최종 알림) 후 0.6%로 감소.
- **실제 사례**: 넷플릭스가 *카드 만료 30일 전 갱신 알림* 으로 Involuntary Churn을 크게 줄인 사례.

**⑤ 비고**

- **함께 보기**: [Voluntary Churn](#voluntary-churn)

---

## Churn Reason · 이탈 사유 {#churn-reason}

**① 정의**

사용자가 떠난 *이유의 분류*. 보통 5~7개 카테고리로 묶입니다.

흔한 분류:
- 가격이 비쌈
- 기능이 부족함
- 거의 안 씀
- 경쟁사로 이동
- 잠시 필요 없음 (일시 정지)
- 기타

**② 맥락**

- **회의에서**: *"이탈 사유 1위가 *거의 안 씀* 44%에요. 가격이 아니라 가치 인식의 문제."* — 사유별 처방이 완전히 다릅니다.

**③ 액션**

- **개발**: 해지 페이지의 *드롭다운 + 자유 입력* 조합. 드롭다운만 받으면 깊이가 부족, 자유 입력만 받으면 분류 못 함.
- **디자인**: 사유 수집을 *해지 흐름 안에 자연스럽게*. 너무 길면 사용자가 짜증.
- **기획**: 사유별 *맞춤 대응* — 가격 문제는 할인 제안, 기능 부족은 신기능 안내, 거의 안 씀은 일시 정지 제안.

**④ 사례**

- **센티**: 이탈 사유 — *거의 안 씀 44%, 경쟁사 이동 22%, 기능 부족 18%, 가격 12%, 기타 4%*. *거의 안 씀* 사용자에게 *3개월 일시 정지* 옵션을 추가한 후 이 카테고리의 즉시 이탈 35%가 일시 정지로 전환.

**⑤ 비고**

- **함께 보기**: [Voluntary Churn](#voluntary-churn), [Win-back](#win-back)

---

## 이번 편 한눈에 보기

| 용어 | 정의 (한 줄) | 좋은 값 (참고) |
|---|---|---|
| Churn Rate | 기간 내 이탈 비율 | B2B SaaS 월 < 1.5%, B2C 월 5~10% |
| Logo Churn | 고객 수 이탈 비율 | — |
| Revenue Churn | 매출 이탈 비율 | Gross < 5% 월, Net < 0% 이상적 |
| NRR | 순매출 잔존율 (확장 포함) | 100~120% 좋음 |
| GRR | 순순매출 잔존율 (확장 제외) | 90%+ |
| Reactivation | 휴면→활성 복귀 | — |
| Win-back | 명시적 이탈자 복귀 | 5~10% 응답률 |
| Dormant User | N일 이상 비활성 | — |
| Voluntary Churn | 사용자가 명시 해지 | — |
| Involuntary Churn | 결제 실패 등 비의도 | 전체 Churn의 20~40% |
| Churn Reason | 이탈 사유 분류 | — |

---

## 자주 헷갈리는 쌍

### Logo Churn vs Revenue Churn

| | Logo Churn | Revenue Churn |
|---|---|---|
| **단위** | 고객 수 | 매출 금액 |
| **가중** | 모든 고객 동일 | 큰 고객 큰 무게 |
| **무엇을 봄** | 사용자 기반 축소 | 매출 손실 |

### NRR vs GRR

```
NRR = GRR + Expansion Rate
```

차이가 크면 *확장으로 이탈을 가리고 있다*. 두 수치를 함께 보고 *확장에 의존하는가 vs 진짜 유지가 강한가* 를 판단.

### Voluntary vs Involuntary

| | Voluntary | Involuntary |
|---|---|---|
| **원인** | 의도된 해지 | 결제 실패 등 |
| **처방** | 제품·가격 개선 | Dunning 강화 |
| **회수 난이도** | 어려움 | 쉬움 (50%+) |

### Churn vs Drop-off vs Bounce

세 단어 모두 *떠남* 의 측정이지만 시간 단위가 다릅니다.

- **Bounce** ([ep.03](/marketing-metrics-handbook-ep-03/)): 한 세션 안에서 떠남 (초~분)
- **Drop-off** ([ep.04](/marketing-metrics-handbook-ep-04/)): 퍼널 단계 간 떠남 (세션 안 또는 며칠)
- **Churn** (ep.07): 장기 구독·관계의 끝 (월·연 단위)

---

## 참고 자료

- Skok, D. *SaaS Metrics 2.0*. For Entrepreneurs.
- Reichheld, F. F. (2003). *The One Number You Need to Grow*. Harvard Business Review.
- Profitwell. *Churn and Retention*. https://www.profitwell.com
- Tunguz, T. *The SaaS Adventure — NRR and GRR*. https://tomtunguz.com
- Bain & Company. *Loyalty Effect Research*. https://www.bain.com
- Stripe. *Best Practices for Reducing Involuntary Churn*. https://stripe.com/docs

---

## 다음 편 예고

> [ep.08 — 수익과 단위경제](/marketing-metrics-handbook-ep-08/)

지금까지의 모든 지표가 한 곳에 모이는 편. LTV와 CAC, MRR과 ARR, ARPU와 ARPPU, 그리고 *이 회사는 살아남는가* 의 질문에 답하는 LTV:CAC 비율과 Payback Period까지. 13개 용어.
