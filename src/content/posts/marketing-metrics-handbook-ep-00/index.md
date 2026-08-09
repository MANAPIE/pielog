---
title: "개발자와 디자이너를 위한 - 마케팅 지표 핸드북 ep.00"
description: "ROAS, CTR, MRR. 회의에서 흘러가는 단어들을 자기 화면과 코드로 끌어내리는 핸드북. 시리즈 전체 지도와 세 가지 색인을 ep.00에 담았습니다."
summary: "마케팅 지표 136개를 개발자와 디자이너의 시선으로 정리한 13부작 시리즈의 출발점입니다. 가상 서비스 센티(Centi)를 일관된 예시로 두고, 퍼널 단계별·실무 시나리오별·UI 컴포넌트별 세 가지 색인으로 입구를 세 개 만들었습니다. 어느 쪽으로 들어와도 원하는 용어에 닿도록 설계했습니다."
date: 2026-05-14
thumbnail: ./cover.svg
tags: [series, develop, design, cover, marketing, metrics, glossary, kpi, ux]
draft: false
---

![](./cover.svg)

회의에서 단어가 흘러간다. ROAS가 나빠졌다고 한다. CVR이 0.3%p 떨어졌다고 한다. NRR이 105%라고 한다. 누군가는 끄덕이고 누군가는 메모한다. 디자이너와 개발자는 가끔, 그 단어가 자기 화면의 어디를 가리키는지 모른 채 회의실을 나선다.

이 핸드북은 그 거리감을 좁히기 위한 것이다.

---

## 누구를 위한 글인가

마케터가 아닌 사람을 위해 쓴 마케팅 지표 핸드북입니다.

대상은 셋입니다.

**개발자.** 이벤트 트래킹 코드를 짜라는 요청을 받았을 때, 그 이벤트가 어떤 지표의 분모와 분자가 되는지 모르면 정확한 구현이 어렵습니다. "체험 시작" 버튼 클릭 하나로 **전환율(CVR)**, **활성화율(Activation Rate)**, **퍼널 이탈(Funnel Drop-off)** 이 동시에 영향을 받습니다. 이벤트를 어디서 묶고 어디서 끊을지의 감각이 필요합니다.

**디자이너.** "CTR을 올려달라"는 요청이 들어왔을 때, 그게 카피 문제인지 위치 문제인지 색 문제인지 판단해야 합니다. 지표의 정의를 모르면 본인의 결정이 어떤 숫자에 닿는지 보이지 않습니다.

**기획자(PM).** 마케터가 던지는 단어를 받아서 개발과 디자인 팀에게 다시 풀어줘야 합니다. 양쪽 언어를 번역하는 자리입니다.

마케터에게도 도움이 됩니다. 매일 쓰는 단어가 실제 화면의 어떤 픽셀과 연결되는지 다시 보게 됩니다.

---

## 가상 서비스: 센티(Centi)

이 시리즈는 가상 서비스 **센티(Centi)** 를 일관된 예시로 사용합니다. 매번 새로운 서비스를 가정하지 않고, 같은 화면과 같은 사용자 흐름 위에서 모든 지표를 살펴봅니다.

센티는 모바일 **가계부·자산관리 앱(personal finance app)** 입니다.

**제품 구조**

- 무료 가입 후 계좌·카드 연동
- 거래 자동 분류 — 식비, 교통, 구독, 쇼핑, 의료 등
- 무료 플랜: 최근 한 달 거래 분석, 기본 카테고리
- 프리미엄 플랜: 월 4,900원. 무제한 연동, 가족 공유, 자산 리포트, 예산 알림
- 친구 초대 시 양쪽 모두 프리미엄 1개월 무료

**주요 화면**

- **메인 피드** — 이번 달 요약, 추천 카드, 프리미엄 체험 배너
- **거래 내역** — 필터, 검색, 카테고리 수정
- **카테고리 분석** — 도넛 차트, 전월 비교
- **자산 화면** — 계좌별 잔액, 순자산 추이
- **마이페이지** — 구독 관리, 설정, 초대 링크

실제 서비스와 매핑하면 **뱅크샐러드, 토스 자산관리, 브로콜리** 가 직접 비교군이고, 일부 기능은 카카오뱅크 모임통장과 토스 머니리포트를 떠올리면 됩니다. 편마다 적절한 실제 서비스를 인용합니다.

---

## 시리즈 전체 지도

마케팅 지표는 사용자의 시간 흐름을 따라갑니다. 광고에서 시작해 첫 클릭, 가입, 활성화, 유지, 결제, 그리고 추천까지. 본 시리즈도 이 흐름을 따라갑니다.

![사용자 여정을 시간 흐름(위에서 아래로)에 따라 좁아지는 5단계 세로 퍼널 다이어그램. 1단계 획득(Acquisition, ep.01~02)은 CPM·CPC·CPA·CPI·CPV·CPL·Impression·Reach·Frequency·ROAS·ROI·MER·Blended CAC, 2단계 활성화(Activation, ep.03~04)는 CTR·CVR·Bounce·Scroll Depth·Sign-up Rate·Activation Rate·Time-to-Value·Aha, 3단계 유지(Retention, ep.05~07)는 DAU·WAU·MAU·Stickiness·Session·Cohort·N-day·Churn·NRR·GRR, 4단계 수익(Revenue, ep.08)은 MRR·ARR·LTV·CAC·LTV:CAC·ARPU·Payback, 5단계 추천(Referral, ep.09)은 NPS·CSAT·K-factor 지표를 담는다. 각 단계는 아래 방향 화살표로 이어지고, 추천 단계에서 다시 획득 단계로 돌아가는 순환 화살표가 \"추천이 다시 획득으로 — Viral loop\"라는 라벨과 함께 그려져 있다. 5단계 퍼널 아래에는 측정 레이어(Measurement Layer) 띠가 가로로 놓여 ep.10 실험과 통계(A/B·MDE·p-value), ep.11 트래킹과 데이터 수집(UTM·Event·Pixel), ep.12 어트리뷰션과 도구 지도(First/Last/Multi-touch·GA4)를 나란히 보여준다. 측정 인프라는 다섯 단계 모두에서 작동하지만 별도 회차로 묶었음을 나타낸다.](./mmh-00-01-funnel-map.svg)

다섯 단계 위에 측정의 인프라가 얹힙니다. **UTM, 이벤트 트래킹, 어트리뷰션(attribution)** 같은 것들입니다. 이들은 모든 단계에서 작동하지만 별도의 편으로 묶었습니다([ep.10](/marketing-metrics-handbook-ep-10/)~[ep.12](/marketing-metrics-handbook-ep-12/)).

---

## 색인 1 — 퍼널 단계별

마케터가 회의에서 사고하는 순서입니다. *"획득이 약하다", "활성화에서 빠진다", "수익은 좋은데 유지가 나쁘다"* 같은 진단이 이 흐름으로 나옵니다.

### 획득 1 — 광고 비용 [ep.01](/marketing-metrics-handbook-ep-01/)

[CPM](/marketing-metrics-handbook-ep-01/#cpm) · [CPC](/marketing-metrics-handbook-ep-01/#cpc) · [CPA](/marketing-metrics-handbook-ep-01/#cpa) · [CPI](/marketing-metrics-handbook-ep-01/#cpi) · [CPV](/marketing-metrics-handbook-ep-01/#cpv) · [CPL](/marketing-metrics-handbook-ep-01/#cpl) · [CPS](/marketing-metrics-handbook-ep-01/#cps) · [Impression](/marketing-metrics-handbook-ep-01/#impression) · [Reach](/marketing-metrics-handbook-ep-01/#reach) · [Frequency](/marketing-metrics-handbook-ep-01/#frequency) · [Share of Voice](/marketing-metrics-handbook-ep-01/#share-of-voice)

### 획득 2 — 광고 효율 [ep.02](/marketing-metrics-handbook-ep-02/)

[ROAS](/marketing-metrics-handbook-ep-02/#roas) · [ROI](/marketing-metrics-handbook-ep-02/#roi) · [MER](/marketing-metrics-handbook-ep-02/#mer) · [iROAS](/marketing-metrics-handbook-ep-02/#iroas) · [Blended CAC](/marketing-metrics-handbook-ep-02/#blended-cac) · [Paid vs Organic](/marketing-metrics-handbook-ep-02/#paid-vs-organic) · [Marketing Efficiency Ratio](/marketing-metrics-handbook-ep-02/#marketing-efficiency-ratio) · [Payback Window](/marketing-metrics-handbook-ep-02/#payback-window) · [Funnel Efficiency](/marketing-metrics-handbook-ep-02/#funnel-efficiency)

### 유입과 클릭 [ep.03](/marketing-metrics-handbook-ep-03/)

[CTR](/marketing-metrics-handbook-ep-03/#ctr) · [CVR](/marketing-metrics-handbook-ep-03/#cvr) · [Bounce Rate](/marketing-metrics-handbook-ep-03/#bounce-rate) · [Exit Rate](/marketing-metrics-handbook-ep-03/#exit-rate) · [Scroll Depth](/marketing-metrics-handbook-ep-03/#scroll-depth) · [Heatmap](/marketing-metrics-handbook-ep-03/#heatmap) · [Click Map](/marketing-metrics-handbook-ep-03/#click-map) · [Landing Page CVR](/marketing-metrics-handbook-ep-03/#landing-page-cvr) · [Above-the-fold](/marketing-metrics-handbook-ep-03/#above-the-fold) · [Hero Section](/marketing-metrics-handbook-ep-03/#hero-section) · [Time on Page](/marketing-metrics-handbook-ep-03/#time-on-page) · [Page Load Speed](/marketing-metrics-handbook-ep-03/#page-load-speed)

### 활성화와 온보딩 [ep.04](/marketing-metrics-handbook-ep-04/)

[Activation Rate](/marketing-metrics-handbook-ep-04/#activation-rate) · [Time-to-Value](/marketing-metrics-handbook-ep-04/#time-to-value) · [Aha Moment](/marketing-metrics-handbook-ep-04/#aha-moment) · [Onboarding Completion](/marketing-metrics-handbook-ep-04/#onboarding-completion) · [Drop-off Rate](/marketing-metrics-handbook-ep-04/#drop-off-rate) · [Sign-up Rate](/marketing-metrics-handbook-ep-04/#sign-up-rate) · [First Action](/marketing-metrics-handbook-ep-04/#first-action) · [Magic Number](/marketing-metrics-handbook-ep-04/#magic-number) · [Conversion Funnel](/marketing-metrics-handbook-ep-04/#conversion-funnel) · [Funnel Step](/marketing-metrics-handbook-ep-04/#funnel-step) · [Sign-up to Activation](/marketing-metrics-handbook-ep-04/#sign-up-to-activation)

### 유지와 참여 [ep.05](/marketing-metrics-handbook-ep-05/)

[DAU](/marketing-metrics-handbook-ep-05/#dau) · [WAU](/marketing-metrics-handbook-ep-05/#wau) · [MAU](/marketing-metrics-handbook-ep-05/#mau) · [Stickiness](/marketing-metrics-handbook-ep-05/#stickiness) · [Session](/marketing-metrics-handbook-ep-05/#session) · [Session Duration](/marketing-metrics-handbook-ep-05/#session-duration) · [Pages per Session](/marketing-metrics-handbook-ep-05/#pages-per-session) · [Engaged Session](/marketing-metrics-handbook-ep-05/#engaged-session) · [Bounce Session](/marketing-metrics-handbook-ep-05/#bounce-session) · [Engagement Rate](/marketing-metrics-handbook-ep-05/#engagement-rate) · [Active Days](/marketing-metrics-handbook-ep-05/#active-days) · [Average Session](/marketing-metrics-handbook-ep-05/#average-session)

### 코호트와 리텐션 곡선 [ep.06](/marketing-metrics-handbook-ep-06/)

[Retention Curve](/marketing-metrics-handbook-ep-06/#retention-curve) · [N-day Retention](/marketing-metrics-handbook-ep-06/#n-day-retention) · [Rolling Retention](/marketing-metrics-handbook-ep-06/#rolling-retention) · [Cohort Analysis](/marketing-metrics-handbook-ep-06/#cohort-analysis) · [Power User Curve](/marketing-metrics-handbook-ep-06/#power-user-curve) · [L7](/marketing-metrics-handbook-ep-06/#l7) · [L28](/marketing-metrics-handbook-ep-06/#l28) · [New User](/marketing-metrics-handbook-ep-06/#new-user) · [Returning User](/marketing-metrics-handbook-ep-06/#returning-user) · [Resurrected User](/marketing-metrics-handbook-ep-06/#resurrected-user)

### 이탈(Churn) [ep.07](/marketing-metrics-handbook-ep-07/)

[Churn Rate](/marketing-metrics-handbook-ep-07/#churn-rate) · [Logo Churn](/marketing-metrics-handbook-ep-07/#logo-churn) · [Revenue Churn](/marketing-metrics-handbook-ep-07/#revenue-churn) · [NRR](/marketing-metrics-handbook-ep-07/#nrr) · [GRR](/marketing-metrics-handbook-ep-07/#grr) · [Reactivation](/marketing-metrics-handbook-ep-07/#reactivation) · [Win-back](/marketing-metrics-handbook-ep-07/#win-back) · [Dormant User](/marketing-metrics-handbook-ep-07/#dormant-user) · [Voluntary Churn](/marketing-metrics-handbook-ep-07/#voluntary-churn) · [Involuntary Churn](/marketing-metrics-handbook-ep-07/#involuntary-churn) · [Churn Reason](/marketing-metrics-handbook-ep-07/#churn-reason)

### 수익과 단위경제 [ep.08](/marketing-metrics-handbook-ep-08/)

[LTV](/marketing-metrics-handbook-ep-08/#ltv) · [CAC](/marketing-metrics-handbook-ep-08/#cac) · [LTV:CAC Ratio](/marketing-metrics-handbook-ep-08/#ltv-cac-ratio) · [ARPU](/marketing-metrics-handbook-ep-08/#arpu) · [ARPPU](/marketing-metrics-handbook-ep-08/#arppu) · [MRR](/marketing-metrics-handbook-ep-08/#mrr) · [ARR](/marketing-metrics-handbook-ep-08/#arr) · [Payback Period](/marketing-metrics-handbook-ep-08/#payback-period) · [Gross Margin](/marketing-metrics-handbook-ep-08/#gross-margin) · [Contribution Margin](/marketing-metrics-handbook-ep-08/#contribution-margin) · [Quick Ratio](/marketing-metrics-handbook-ep-08/#quick-ratio) · [MRR Growth](/marketing-metrics-handbook-ep-08/#mrr-growth) · [Net New MRR](/marketing-metrics-handbook-ep-08/#net-new-mrr)

### 만족과 추천 [ep.09](/marketing-metrics-handbook-ep-09/)

[NPS](/marketing-metrics-handbook-ep-09/#nps) · [CSAT](/marketing-metrics-handbook-ep-09/#csat) · [CES](/marketing-metrics-handbook-ep-09/#ces) · [Viral Coefficient](/marketing-metrics-handbook-ep-09/#viral-coefficient) · [K-factor](/marketing-metrics-handbook-ep-09/#k-factor) · [Referral Rate](/marketing-metrics-handbook-ep-09/#referral-rate) · [Word-of-Mouth](/marketing-metrics-handbook-ep-09/#word-of-mouth) · [Promoter](/marketing-metrics-handbook-ep-09/#promoter) · [Detractor](/marketing-metrics-handbook-ep-09/#detractor) · [Passive](/marketing-metrics-handbook-ep-09/#passive)

### 실험과 통계 [ep.10](/marketing-metrics-handbook-ep-10/)

[A/B Test](/marketing-metrics-handbook-ep-10/#ab-test) · [Multivariate Test](/marketing-metrics-handbook-ep-10/#multivariate-test) · [Statistical Significance](/marketing-metrics-handbook-ep-10/#statistical-significance) · [Confidence Interval](/marketing-metrics-handbook-ep-10/#confidence-interval) · [p-value](/marketing-metrics-handbook-ep-10/#p-value) · [Sample Size](/marketing-metrics-handbook-ep-10/#sample-size) · [MDE](/marketing-metrics-handbook-ep-10/#mde) · [Type I Error](/marketing-metrics-handbook-ep-10/#type-1-error) · [Type II Error](/marketing-metrics-handbook-ep-10/#type-2-error) · [Sequential Testing](/marketing-metrics-handbook-ep-10/#sequential-testing) · [Holdout](/marketing-metrics-handbook-ep-10/#holdout) · [Statistical Power](/marketing-metrics-handbook-ep-10/#statistical-power)

### 트래킹과 데이터 수집 [ep.11](/marketing-metrics-handbook-ep-11/)

[UTM](/marketing-metrics-handbook-ep-11/#utm) · [Event Tracking](/marketing-metrics-handbook-ep-11/#event-tracking) · [Pageview](/marketing-metrics-handbook-ep-11/#pageview) · [Custom Event](/marketing-metrics-handbook-ep-11/#custom-event) · [User Property](/marketing-metrics-handbook-ep-11/#user-property) · [Cookie](/marketing-metrics-handbook-ep-11/#cookie) · [Pixel/Tag](/marketing-metrics-handbook-ep-11/#pixel-tag) · [Server-side Tracking](/marketing-metrics-handbook-ep-11/#server-side-tracking) · [Consent Mode](/marketing-metrics-handbook-ep-11/#consent-mode) · [Identity Resolution](/marketing-metrics-handbook-ep-11/#identity-resolution) · [First-party Data](/marketing-metrics-handbook-ep-11/#first-party-data) · [Third-party Data](/marketing-metrics-handbook-ep-11/#third-party-data)

### 어트리뷰션과 도구 지도 [ep.12](/marketing-metrics-handbook-ep-12/)

[First-touch](/marketing-metrics-handbook-ep-12/#first-touch) · [Last-touch](/marketing-metrics-handbook-ep-12/#last-touch) · [Linear Attribution](/marketing-metrics-handbook-ep-12/#linear) · [Time-decay](/marketing-metrics-handbook-ep-12/#time-decay) · [Position-based](/marketing-metrics-handbook-ep-12/#position-based) · [Data-driven Attribution](/marketing-metrics-handbook-ep-12/#data-driven) · [Multi-touch](/marketing-metrics-handbook-ep-12/#multi-touch) · [View-through](/marketing-metrics-handbook-ep-12/#view-through) · [Click-through](/marketing-metrics-handbook-ep-12/#click-through) · [Incrementality](/marketing-metrics-handbook-ep-12/#incrementality) · [GA4](/marketing-metrics-handbook-ep-12/#ga4) · [Amplitude](/marketing-metrics-handbook-ep-12/#amplitude) · [Mixpanel](/marketing-metrics-handbook-ep-12/#mixpanel)

---

## 색인 2 — 실무 시나리오별

회의의 종류로 묶었습니다. "이 회의에 들어가면 이 단어들이 날아온다"는 감각으로 정리했습니다.

### 광고 운영 회의에서 듣는 말

광고 매니저 화면을 띄워놓고 *"이번 캠페인은…"* 으로 시작하는 회의입니다.

[CPM](/marketing-metrics-handbook-ep-01/#cpm) · [CPC](/marketing-metrics-handbook-ep-01/#cpc) · [CPA](/marketing-metrics-handbook-ep-01/#cpa) · [CPI](/marketing-metrics-handbook-ep-01/#cpi) · [Impression](/marketing-metrics-handbook-ep-01/#impression) · [Reach](/marketing-metrics-handbook-ep-01/#reach) · [Frequency](/marketing-metrics-handbook-ep-01/#frequency) · [CTR](/marketing-metrics-handbook-ep-03/#ctr) · [ROAS](/marketing-metrics-handbook-ep-02/#roas) · [MER](/marketing-metrics-handbook-ep-02/#mer) · [iROAS](/marketing-metrics-handbook-ep-02/#iroas) · [Share of Voice](/marketing-metrics-handbook-ep-01/#share-of-voice)

### 주간 그로스 미팅에서 듣는 말

대시보드를 공유하며 *"이번 주는…"* 으로 시작하는 회의입니다.

[DAU](/marketing-metrics-handbook-ep-05/#dau) · [WAU](/marketing-metrics-handbook-ep-05/#wau) · [MAU](/marketing-metrics-handbook-ep-05/#mau) · [Stickiness](/marketing-metrics-handbook-ep-05/#stickiness) · [Activation Rate](/marketing-metrics-handbook-ep-04/#activation-rate) · [Drop-off Rate](/marketing-metrics-handbook-ep-04/#drop-off-rate) · [Conversion Funnel](/marketing-metrics-handbook-ep-04/#conversion-funnel) · [Retention Curve](/marketing-metrics-handbook-ep-06/#retention-curve) · [Cohort Analysis](/marketing-metrics-handbook-ep-06/#cohort-analysis) · [N-day Retention](/marketing-metrics-handbook-ep-06/#n-day-retention) · [Churn Rate](/marketing-metrics-handbook-ep-07/#churn-rate)

### 분기 보고·투자 자료에서 듣는 말

이사회나 투자자에게 보여주는 자료에서 나오는 단어입니다.

[MRR](/marketing-metrics-handbook-ep-08/#mrr) · [ARR](/marketing-metrics-handbook-ep-08/#arr) · [LTV](/marketing-metrics-handbook-ep-08/#ltv) · [CAC](/marketing-metrics-handbook-ep-08/#cac) · [LTV:CAC Ratio](/marketing-metrics-handbook-ep-08/#ltv-cac-ratio) · [Payback Period](/marketing-metrics-handbook-ep-08/#payback-period) · [Gross Margin](/marketing-metrics-handbook-ep-08/#gross-margin) · [Contribution Margin](/marketing-metrics-handbook-ep-08/#contribution-margin) · [Quick Ratio](/marketing-metrics-handbook-ep-08/#quick-ratio) · [NRR](/marketing-metrics-handbook-ep-07/#nrr) · [GRR](/marketing-metrics-handbook-ep-07/#grr) · [Net New MRR](/marketing-metrics-handbook-ep-08/#net-new-mrr) · [Logo Churn](/marketing-metrics-handbook-ep-07/#logo-churn) · [Revenue Churn](/marketing-metrics-handbook-ep-07/#revenue-churn)

### 디자인 리뷰·A/B 테스트 결과 공유에서 듣는 말

시안을 두고 *"이쪽 안이 더 좋다"* 고 말할 때, 또는 실험 결과를 공유할 때 등장하는 단어입니다.

[CTR](/marketing-metrics-handbook-ep-03/#ctr) · [CVR](/marketing-metrics-handbook-ep-03/#cvr) · [Bounce Rate](/marketing-metrics-handbook-ep-03/#bounce-rate) · [Scroll Depth](/marketing-metrics-handbook-ep-03/#scroll-depth) · [Heatmap](/marketing-metrics-handbook-ep-03/#heatmap) · [Above-the-fold](/marketing-metrics-handbook-ep-03/#above-the-fold) · [Hero Section](/marketing-metrics-handbook-ep-03/#hero-section) · [A/B Test](/marketing-metrics-handbook-ep-10/#ab-test) · [Statistical Significance](/marketing-metrics-handbook-ep-10/#statistical-significance) · [p-value](/marketing-metrics-handbook-ep-10/#p-value) · [MDE](/marketing-metrics-handbook-ep-10/#mde) · [Sample Size](/marketing-metrics-handbook-ep-10/#sample-size) · [Aha Moment](/marketing-metrics-handbook-ep-04/#aha-moment) · [Time-to-Value](/marketing-metrics-handbook-ep-04/#time-to-value)

### CS·제품 회고에서 듣는 말

분기 회고나 사용자 인터뷰 결과 공유 자리에서 나오는 단어입니다.

[NPS](/marketing-metrics-handbook-ep-09/#nps) · [CSAT](/marketing-metrics-handbook-ep-09/#csat) · [CES](/marketing-metrics-handbook-ep-09/#ces) · [Promoter](/marketing-metrics-handbook-ep-09/#promoter) · [Detractor](/marketing-metrics-handbook-ep-09/#detractor) · [Churn Reason](/marketing-metrics-handbook-ep-07/#churn-reason) · [Voluntary Churn](/marketing-metrics-handbook-ep-07/#voluntary-churn) · [Involuntary Churn](/marketing-metrics-handbook-ep-07/#involuntary-churn) · [Reactivation](/marketing-metrics-handbook-ep-07/#reactivation) · [Win-back](/marketing-metrics-handbook-ep-07/#win-back) · [Word-of-Mouth](/marketing-metrics-handbook-ep-09/#word-of-mouth)

### 데이터 인프라 논의에서 듣는 말

데이터 팀, 그로스 엔지니어, 또는 외부 어트리뷰션 벤더와의 회의에서 나오는 단어입니다.

[UTM](/marketing-metrics-handbook-ep-11/#utm) · [Event Tracking](/marketing-metrics-handbook-ep-11/#event-tracking) · [Custom Event](/marketing-metrics-handbook-ep-11/#custom-event) · [User Property](/marketing-metrics-handbook-ep-11/#user-property) · [Pixel/Tag](/marketing-metrics-handbook-ep-11/#pixel-tag) · [Cookie](/marketing-metrics-handbook-ep-11/#cookie) · [Server-side Tracking](/marketing-metrics-handbook-ep-11/#server-side-tracking) · [Consent Mode](/marketing-metrics-handbook-ep-11/#consent-mode) · [Identity Resolution](/marketing-metrics-handbook-ep-11/#identity-resolution) · [First-touch](/marketing-metrics-handbook-ep-12/#first-touch) · [Last-touch](/marketing-metrics-handbook-ep-12/#last-touch) · [Multi-touch](/marketing-metrics-handbook-ep-12/#multi-touch) · [Data-driven Attribution](/marketing-metrics-handbook-ep-12/#data-driven) · [Incrementality](/marketing-metrics-handbook-ep-12/#incrementality) · [GA4](/marketing-metrics-handbook-ep-12/#ga4) · [Amplitude](/marketing-metrics-handbook-ep-12/#amplitude) · [Mixpanel](/marketing-metrics-handbook-ep-12/#mixpanel)

---

## 색인 3 — UI 컴포넌트별

화면 요소에서 출발한 색인입니다. 디자이너가 시안을 보다가 "이 영역은 어떤 지표에 영향을 주지?" 싶을 때 들춰보는 입구입니다.

### 광고 크리에이티브 · 랜딩 페이지

[CPM](/marketing-metrics-handbook-ep-01/#cpm) · [Impression](/marketing-metrics-handbook-ep-01/#impression) · [Frequency](/marketing-metrics-handbook-ep-01/#frequency) · [CTR](/marketing-metrics-handbook-ep-03/#ctr) · [Bounce Rate](/marketing-metrics-handbook-ep-03/#bounce-rate) · [Above-the-fold](/marketing-metrics-handbook-ep-03/#above-the-fold) · [Hero Section](/marketing-metrics-handbook-ep-03/#hero-section) · [Landing Page CVR](/marketing-metrics-handbook-ep-03/#landing-page-cvr) · [Page Load Speed](/marketing-metrics-handbook-ep-03/#page-load-speed)

### CTA 버튼

[CTR](/marketing-metrics-handbook-ep-03/#ctr) · [CVR](/marketing-metrics-handbook-ep-03/#cvr) · [Click Map](/marketing-metrics-handbook-ep-03/#click-map) · [Heatmap](/marketing-metrics-handbook-ep-03/#heatmap)

### 회원가입 · 온보딩 플로우

[Sign-up Rate](/marketing-metrics-handbook-ep-04/#sign-up-rate) · [Onboarding Completion](/marketing-metrics-handbook-ep-04/#onboarding-completion) · [Activation Rate](/marketing-metrics-handbook-ep-04/#activation-rate) · [Time-to-Value](/marketing-metrics-handbook-ep-04/#time-to-value) · [Aha Moment](/marketing-metrics-handbook-ep-04/#aha-moment) · [Drop-off Rate](/marketing-metrics-handbook-ep-04/#drop-off-rate) · [First Action](/marketing-metrics-handbook-ep-04/#first-action) · [Funnel Step](/marketing-metrics-handbook-ep-04/#funnel-step) · [Conversion Funnel](/marketing-metrics-handbook-ep-04/#conversion-funnel)

### 메인 피드 · 홈 화면

[DAU](/marketing-metrics-handbook-ep-05/#dau) · [Session](/marketing-metrics-handbook-ep-05/#session) · [Session Duration](/marketing-metrics-handbook-ep-05/#session-duration) · [Engaged Session](/marketing-metrics-handbook-ep-05/#engaged-session) · [Engagement Rate](/marketing-metrics-handbook-ep-05/#engagement-rate) · [Scroll Depth](/marketing-metrics-handbook-ep-03/#scroll-depth) · [Stickiness](/marketing-metrics-handbook-ep-05/#stickiness) · [Pages per Session](/marketing-metrics-handbook-ep-05/#pages-per-session)

### 결제 · 구독 화면

[CVR](/marketing-metrics-handbook-ep-03/#cvr) · [ARPU](/marketing-metrics-handbook-ep-08/#arpu) · [ARPPU](/marketing-metrics-handbook-ep-08/#arppu) · [MRR](/marketing-metrics-handbook-ep-08/#mrr) · [Net New MRR](/marketing-metrics-handbook-ep-08/#net-new-mrr) · [LTV](/marketing-metrics-handbook-ep-08/#ltv) · [Payback Period](/marketing-metrics-handbook-ep-08/#payback-period) · [Voluntary Churn](/marketing-metrics-handbook-ep-07/#voluntary-churn) · [Involuntary Churn](/marketing-metrics-handbook-ep-07/#involuntary-churn)

### 알림 · 이메일 · 푸시

[CTR](/marketing-metrics-handbook-ep-03/#ctr) · [CVR](/marketing-metrics-handbook-ep-03/#cvr) · [Reactivation](/marketing-metrics-handbook-ep-07/#reactivation) · [Win-back](/marketing-metrics-handbook-ep-07/#win-back) · [Engagement Rate](/marketing-metrics-handbook-ep-05/#engagement-rate)

### 공유 · 초대 화면

[Referral Rate](/marketing-metrics-handbook-ep-09/#referral-rate) · [K-factor](/marketing-metrics-handbook-ep-09/#k-factor) · [Viral Coefficient](/marketing-metrics-handbook-ep-09/#viral-coefficient) · [Word-of-Mouth](/marketing-metrics-handbook-ep-09/#word-of-mouth)

### 마이페이지 · 설정

[Churn Rate](/marketing-metrics-handbook-ep-07/#churn-rate) · [Churn Reason](/marketing-metrics-handbook-ep-07/#churn-reason) · [Dormant User](/marketing-metrics-handbook-ep-07/#dormant-user) · [NPS](/marketing-metrics-handbook-ep-09/#nps) · [CSAT](/marketing-metrics-handbook-ep-09/#csat) · [CES](/marketing-metrics-handbook-ep-09/#ces)

### 분석 대시보드 · 보고서

[Cohort Analysis](/marketing-metrics-handbook-ep-06/#cohort-analysis) · [Retention Curve](/marketing-metrics-handbook-ep-06/#retention-curve) · [N-day Retention](/marketing-metrics-handbook-ep-06/#n-day-retention) · [Power User Curve](/marketing-metrics-handbook-ep-06/#power-user-curve) · [Funnel Step](/marketing-metrics-handbook-ep-04/#funnel-step) · [User Property](/marketing-metrics-handbook-ep-11/#user-property)

---

## 이 핸드북 활용법

세 가지 동선을 추천합니다.

**처음부터 읽기 — 마케팅 사고 흐름을 익히고 싶은 경우**

[ep.01](/marketing-metrics-handbook-ep-01/)부터 [ep.12](/marketing-metrics-handbook-ep-12/)까지 순서대로. 마케터가 회의에서 생각하는 순서와 일치합니다. 본인이 마케터 옆자리에서 일하는 PM·기획자·디자이너라면 이 동선이 가장 맞습니다.

**필요할 때 찾아보기 — 회의 직후 또는 작업 중**

[ep.00](/marketing-metrics-handbook-ep-00/)의 세 색인 중 본인에게 익숙한 입구로 들어가세요. 개발자는 색인 2(시나리오) 또는 색인 1(퍼널), 디자이너는 색인 3(UI 컴포넌트), 마케터·PM은 색인 1(퍼널)이 자연스럽습니다.

**역방향으로 읽기 — 본인 업무에서 출발해 마케팅으로 거슬러 올라가고 싶은 경우**

디자이너는 [ep.03](/marketing-metrics-handbook-ep-03/)(유입과 클릭)과 [ep.04](/marketing-metrics-handbook-ep-04/)(활성화)부터, 개발자는 [ep.10](/marketing-metrics-handbook-ep-10/)(실험)과 [ep.11](/marketing-metrics-handbook-ep-11/)(트래킹)부터, 데이터 엔지니어는 [ep.11](/marketing-metrics-handbook-ep-11/)과 [ep.12](/marketing-metrics-handbook-ep-12/)(어트리뷰션)부터 시작하면 본인 도메인 안에서 시작해 점차 외곽으로 확장됩니다.

---

## 전체 목차

1. [ep.00 — 개요와 색인](/marketing-metrics-handbook-ep-00/)
2. [ep.01 — 광고 비용 지표](/marketing-metrics-handbook-ep-01/)
3. [ep.02 — 광고 효율 지표](/marketing-metrics-handbook-ep-02/)
4. [ep.03 — 유입과 클릭](/marketing-metrics-handbook-ep-03/)
5. [ep.04 — 활성화와 온보딩](/marketing-metrics-handbook-ep-04/)
6. [ep.05 — 유지와 참여](/marketing-metrics-handbook-ep-05/)
7. [ep.06 — 코호트와 리텐션 곡선](/marketing-metrics-handbook-ep-06/)
8. [ep.07 — 이탈(Churn)](/marketing-metrics-handbook-ep-07/)
9. [ep.08 — 수익과 단위경제](/marketing-metrics-handbook-ep-08/)
10. [ep.09 — 만족과 추천](/marketing-metrics-handbook-ep-09/)
11. [ep.10 — 실험과 통계](/marketing-metrics-handbook-ep-10/)
12. [ep.11 — 트래킹과 데이터 수집](/marketing-metrics-handbook-ep-11/)
13. [ep.12 — 어트리뷰션과 도구 지도](/marketing-metrics-handbook-ep-12/)

총 136개 용어입니다.

---

## 참고 자료

- McClure, D. *Startup Metrics for Pirates: AARRR*. 500 Startups.
- Reichheld, F. F. (2003). *The One Number You Need to Grow*. Harvard Business Review.
- Croll, A., & Yoskovitz, B. (2013). *Lean Analytics: Use Data to Build a Better Startup Faster*. O'Reilly Media.
- Skok, D. *SaaS Metrics 2.0 — A Guide to Measuring and Improving What Matters*. For Entrepreneurs.
- Google. *GA4 도움말 — 측정기준 및 측정항목 정의*. https://support.google.com/analytics
- Amplitude. *Product Analytics Playbook*. https://amplitude.com/blog
- Mixpanel. *Mixpanel Documentation — Events, Properties, Cohorts*. https://docs.mixpanel.com

---

## 다음 편 예고

> [ep.01 — 광고 비용 지표](/marketing-metrics-handbook-ep-01/)

CPM과 CPC는 같은 광고에서 동시에 측정됩니다. 그렇다면 어느 쪽을 봐야 잘 굴러가는 캠페인인지 알 수 있을까요. 광고 비용 지표 11개를 정리합니다.
