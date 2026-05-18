---
title: "광고 효율 지표 - 마케팅 지표 핸드북 ep.02"
description: "ROAS, ROI, MER, iROAS. 같은 매출을 네 가지 방식으로 측정하는 이유."
summary: "광고비를 얼마나 썼는지(ep.01)에 이어 그래서 얼마를 벌었는지를 다룹니다. ROAS와 ROI의 차이, 광고 매니저가 자기 광고만 본다는 한계, 증분 ROAS와 블렌디드 CAC가 등장한 이유까지. SaaS와 이커머스의 사고 차이도 함께 정리합니다."
date: 2026-05-15
thumbnail: ./cover.svg
tags: [series, develop, design, marketing, metrics, advertising, roas, roi, mer, kpi]
draft: false
---

![](./cover.svg)

[ep.01](/marketing-metrics-handbook-ep-01)이 *지출의 단어들* 이었다면 이번은 *회수의 단어들* 이다.

같은 100만 원을 광고에 썼다. 결과 매출이 300만 원이라면 어떻게 평가할 것인가. 매체는 *ROAS 300%* 라고 말한다. 회계는 *ROI 50%* 라고 말한다. CFO는 *MER 2.4* 라고 말한다. 그로스 팀은 *증분 ROAS는 180%* 라고 말한다. 같은 사실을 네 가지 다른 단어로 묘사한다.

이번 편은 그 네 가지 시선을 정렬한다.

---

## 이번 편에서 다룰 것

![시리즈 전체 5단계 퍼널 중 ep.02의 위치를 표시한 세로 스택 지도. 맨 위에 \"FOCUS — 획득 · 광고 효율\"이라는 강조 태그가 있고, 5개 단계 카드가 위에서 아래로 화살표로 이어진다. 첫 번째 획득(ep.01~02) 카드만 주황색으로 강조되어 ROAS·ROI·MER·iROAS 지표를 담고, 이어지는 활성화(ep.03~04), 유지(ep.05~07), 수익(ep.08), 추천(ep.09) 카드는 회색으로 흐리게 처리되어 있다. 맨 아래에는 측정 인프라(Measurement Layer) 띠가 놓여 ep.10 실험, ep.11 트래킹, ep.12 어트리뷰션을 표시한다. ep.02가 획득 단계의 광고 효율 지표를 다룬다는 점을 강조한다.](./mmh-02-01-stage-map.svg)

광고 효율 지표 9개. ROAS, ROI, MER, iROAS, Blended CAC, Paid vs Organic, Marketing Efficiency Ratio, Payback Window, Funnel Efficiency.

[ep.01](/marketing-metrics-handbook-ep-01) 비용 지표가 *광고 매니저 화면의 단어* 였다면, ep.02는 *대표·CFO·투자자가 보는 화면의 단어* 입니다. 같은 데이터지만 시선이 한 단계 위로 올라옵니다.

---

## ROAS · Return on Ad Spend · 광고 수익률 {#roas}

**① 정의**

광고비 대비 직접 발생한 매출의 비율.

```
ROAS = 광고로 발생한 매출 ÷ 광고비 × 100 (%)
또는
ROAS = 광고로 발생한 매출 ÷ 광고비 (배수, ×)
```

100만 원 써서 300만 원 매출이면 ROAS 300% 또는 3.0×.

**② 맥락**

- **회의에서**: *"이번 캠페인 ROAS 420%인데 손익분기점이 350%니까 OK입니다."* — 손익분기 ROAS와 비교해 판단하는 것이 핵심.
- **UI 위치**: 광고 매니저의 *전환 가치(conversion value)* 칼럼, GA4 *수익* 보고서, Shopify·카페24의 광고 채널별 매출.
- **대시보드**: Meta *Purchase ROAS*, 구글 애즈 *Conv. value/cost*, Appsflyer *Ad ROAS*.

**③ 액션**

- **개발**: 매출 이벤트(purchase, subscription_start)에 *value* 파라미터가 정확히 들어가야 합니다. 환불·할인·세금 처리 — 어떤 금액을 매출로 잡을지 정의서가 필요. 정의에 따라 ROAS가 30%까지 흔들립니다.
- **디자인**: ROAS 자체는 디자인의 결과 지표지만, *광고 → 랜딩 → 결제* 의 모든 화면이 누적된 결과입니다. 한 단계의 CVR이 떨어지면 ROAS도 함께 떨어집니다.
- **기획**: *손익분기 ROAS(break-even ROAS)* 를 먼저 계산해야 합니다. 마진율이 30%인 상품이면 ROAS 333%가 손익분기. 그 이상이면 흑자, 미만이면 적자.

**④ 사례**

- **센티**: 프리미엄 첫 결제 4,900원 기준. 마진율 92%(서버비·결제 수수료 제외)니까 손익분기 ROAS는 약 109%. 그러나 평균 9개월 구독을 가정하면 LTV 44,100원, 손익분기 ROAS는 12%까지 떨어집니다.
- **실제 사례**: 무신사의 의류 카테고리 ROAS 목표 350~500%, 마켓컬리의 신규 구매 ROAS는 손익분기 미만이지만 첫 구매를 *고객 획득 비용* 으로 보고 운영. 카카오 선물하기는 ROAS 600% 이상.
- **UI 예시**

![\"광고 매니저 KPI 카드의 풍경\"이라는 제목으로 같은 캠페인의 다섯 칸을 보여주는 대시보드 모형. 위쪽에 2x2로 배치된 KPI 카드 4개가 있다. 광고비는 지난 30일 12,400,000원, 광고 매출은 어트리뷰션 매출 52,080,000원, ROAS는 녹색으로 420%(매출 ÷ 광고비 × 100), 손익분기 ROAS는 주황색으로 350%(마진율 28.6% 기준)로 표시된다. 그 아래에는 \"일별 ROAS 추이 — 30일\" 꺾은선 그래프가 있고, Y축은 150%·300%·450%·600%, X축은 1일·7일·14일·21일·30일이며, 주황색 점선으로 손익분기 350% 라인이 그어져 있다. ROAS 곡선은 1일차 약 150%대에서 시작해 30일차 약 580%까지 우상향하며 손익분기선 위로 올라간다. 맨 아래 \"읽는 법\" 박스에는 ROAS 420%가 손익분기 350%보다 위라 광고 자체는 흑자, 30일 추이가 상승세라 캠페인 학습이 자리 잡는 중, 손익분기는 마진율의 역수(1 ÷ 0.286 = 3.5×), 그러나 ROAS는 어트리뷰션 매출만 본다는 설명이 적혀 있다.](./mmh-02-02-roas-dashboard.svg)

**⑤ 비고**

- **흔한 함정**: ROAS는 *광고 매니저가 자기 광고에 귀속된 매출만* 봅니다. 같은 사람이 다른 채널 광고를 먼저 보고 들어왔어도 마지막에 클릭한 광고가 매출을 다 가져갑니다. [ep.12](/marketing-metrics-handbook-ep-12) 어트리뷰션과 직결.
- **함께 보기**: [ROI](#roi), [MER](#mer), [iROAS](#iroas), [CAC](/marketing-metrics-handbook-ep-08#cac)
- **% vs ×**: ROAS 300%와 ROAS 3.0×는 같은 뜻. 업계마다 표기가 다르므로 회의 시작 시 단위를 확인하는 습관.

---

## ROI · Return on Investment · 투자 수익률 {#roi}

**① 정의**

투자 대비 *순이익* 의 비율. ROAS가 *매출* 기반이라면 ROI는 *이익* 기반.

```
ROI = (수익 - 비용) ÷ 비용 × 100 (%)
```

광고비 100만 원으로 300만 원 매출, 그중 순이익이 90만 원이면 ROI = (90 - 100) ÷ 100 = -10%. *매출은 났지만 손해* 라는 진단.

**② 맥락**

- **회의에서**: *"ROAS는 좋은데 ROI가 마이너스에요."* — 매출은 났지만 마진이 낮아 광고비를 못 회수하는 상황. 마진 구조를 다시 봐야 합니다.
- **UI 위치**: 회계 시스템, 경영진 대시보드, 투자자 보고 자료. 광고 매니저에서 ROI를 직접 보여주는 경우는 드뭅니다(매체는 매출만 알고 마진은 모름).

**③ 액션**

- **개발**: ROI 계산을 자동화하려면 *원가 데이터* 가 마케팅 데이터 옆에 있어야 합니다. ERP·회계 시스템 연동. 보통 데이터 웨어하우스에서 조인.
- **디자인**: ROI에 직접 영향을 주는 디자인 요소는 *업셀·교차판매(upsell, cross-sell)* UI. 같은 광고 비용으로 더 비싼 상품을 사게 만들면 ROI 상승.
- **기획**: ROI는 *광고만의 지표가 아닙니다*. 가격, 마진, 원가 구조의 함수. 따라서 마케팅이 단독으로 책임지기 어려운 지표.

**④ 사례**

- **센티**: 광고비 1,000만 원, 신규 프리미엄 가입 2,200건. 첫 결제 매출 1,078만 원, 마진 992만 원. ROI = (992 - 1,000) ÷ 1,000 = -0.8%. 첫 달만 보면 적자, LTV로 회수.
- **실제 사례**: 명품·럭셔리 브랜드(까르띠에, 디올 한국)는 ROAS는 낮지만 마진율이 높아 ROI는 양호. 반대로 저마진 이커머스는 ROAS는 높아도 ROI가 마이너스인 경우.

**⑤ 비고**

- **흔한 함정**: ROAS와 ROI를 같은 회의에서 섞어 쓰면 혼란. 단위를 분명히 구분해야 합니다.
- **함께 보기**: [ROAS](#roas), [Gross Margin](/marketing-metrics-handbook-ep-08#gross-margin), [Contribution Margin](/marketing-metrics-handbook-ep-08#contribution-margin)

---

## MER · Marketing Efficiency Ratio · 마케팅 효율 비율 {#mer}

**① 정의**

*전체 매출* 을 *전체 마케팅 비용* 으로 나눈 값. ROAS의 *블렌디드 버전*.

```
MER = 총 매출 ÷ 총 마케팅 비용
```

ROAS는 *어트리뷰션된 매출 ÷ 광고비* 라면, MER은 *모든 매출 ÷ 모든 마케팅 비용*. 어트리뷰션 문제를 우회합니다.

**② 맥락**

- **회의에서**: *"각 채널 ROAS는 3.5×인데 통합 MER은 2.1×에요. 채널 간 카니발리제이션이 있어 보입니다."* — 채널별 합산이 전체와 안 맞을 때 의심해보는 지표.
- **UI 위치**: 전사 그로스 대시보드, CFO 보고. 개별 광고 매니저에는 안 나옵니다.

**③ 액션**

- **개발**: MER은 *외부 데이터 통합* 의 결과. 모든 매체 비용 + 인하우스 마케터 인건비 + 도구 비용을 한 곳에 모아야 합니다. 데이터 파이프라인 작업.
- **디자인**: MER 자체는 디자인의 직접 책임이 아니지만, *오가닉 트래픽(organic traffic)을 키우는 디자인* — SEO 최적화, 공유 가능한 콘텐츠, 입소문 유도 — 이 MER 분자를 키웁니다.
- **기획**: MER은 *어트리뷰션 논쟁을 피할 수 있는 평화의 지표*. 채널별 ROAS는 매번 분쟁이 있지만 MER은 분쟁의 여지가 적습니다.

**④ 사례**

- **센티**: 1분기 총 매출 4억 5천만 원, 총 마케팅 비용 1억 8천만 원. MER = 2.5×. 채널별 ROAS 합산은 3.8×인데 MER이 2.5×인 이유는 *오가닉 매출이 광고에 잘못 귀속되었기 때문*.
- **실제 사례**: D2C(Direct-to-Consumer) 브랜드들 사이에서 MER이 ROAS보다 신뢰받는 지표로 자리 잡았습니다. *Allbirds, Glossier, 무신사 스탠다드* 같은 브랜드의 IR 자료에서 MER 언급.

**⑤ 비고**

- **흔한 함정**: MER이 좋다고 모든 채널이 좋은 건 아닙니다. 한 채널이 나머지를 들어 올리는 구조일 수 있습니다.
- **함께 보기**: [ROAS](#roas), [Blended CAC](#blended-cac), [iROAS](#iroas)
- **기준선**: 일반적으로 MER 3.0× 이상이 건강한 D2C, 5.0× 이상이 매우 효율적. 산업·단계별로 다릅니다.

---

## iROAS · Incremental ROAS · 증분 광고 수익률 {#iroas}

**① 정의**

*광고를 안 봤어도 어차피 사용자가 구매했을 매출* 을 빼고 측정한 ROAS.

```
iROAS = (광고를 본 그룹의 매출 - 안 본 그룹의 매출) ÷ 광고비
```

리프트 테스트(lift test) 또는 홀드아웃(holdout) 실험으로만 측정 가능. [ep.10](/marketing-metrics-handbook-ep-10)과 직결.

**② 맥락**

- **회의에서**: *"리타기팅 광고 ROAS 800%인데 iROAS는 120%에요. 어차피 살 사람한테 보여준 거에요."* — 광고가 진짜로 매출을 *증분* 시켰는지 묻는 회의.
- **UI 위치**: Meta *Conversion Lift Study*, Google *Ad Lift*, 자체 홀드아웃 실험 대시보드.

**③ 액션**

- **개발**: 홀드아웃 그룹 설계 — *광고를 보여주지 않는 통제군* 을 무작위로 선정해 일정 기간 광고에서 제외. 노출 직전 단계에서 차단해야 정확. 이걸 매체와 사전 협의해 구현.
- **디자인**: 디자인 직접 영향은 없지만, *광고가 없었어도 살 사람* 과 *광고를 봐야 사는 사람* 의 차이를 만드는 것이 결국 크리에이티브의 힘.
- **기획**: iROAS 측정은 비용이 큽니다. *광고를 안 보여준 그룹의 잠재 매출 손실* 이 측정 비용. 분기에 한두 번 핵심 채널에서만 합니다.

**④ 사례**

- **센티**: 카카오 비즈보드 리타기팅 ROAS 12.0×. iROAS 측정 후 2.8×. *이미 앱 설치한 사용자에게 한 번 더 보여준 것* 이 매출의 절반 이상을 자연스럽게 가져갔다는 진단.
- **실제 사례**: 우버, Airbnb, eBay가 *수십억 원 규모의 광고비를 iROAS 측정 후 줄였다* 는 사례가 학계와 업계에서 자주 인용됩니다(eBay paid search 실험, 2015).

**⑤ 비고**

- **흔한 함정**: 리타기팅 ROAS는 항상 과대평가됩니다. 이미 구매 의향이 있는 사람에게 보여주기 때문. iROAS 없이 리타기팅 예산을 늘리면 위험.
- **함께 보기**: [ROAS](#roas), [Incrementality](/marketing-metrics-handbook-ep-12#incrementality), [Holdout](/marketing-metrics-handbook-ep-10#holdout)

---

## Blended CAC · 블렌디드 고객획득비용 {#blended-cac}

**① 정의**

*특정 채널에 귀속되지 않은* 전체 마케팅 비용을 *전체 신규 고객 수* 로 나눈 값.

```
Blended CAC = 총 마케팅 비용 ÷ 신규 고객 수
```

채널별 CAC(*paid CAC*)와 대비됩니다. Blended는 오가닉까지 포함한 진짜 평균.

**② 맥락**

- **회의에서**: *"Paid CAC 35,000원, Blended CAC 21,000원. 오가닉이 견인하고 있어요."* — 오가닉 비율이 높을수록 Blended CAC가 낮아집니다.
- **UI 위치**: 분기 KPI 보고, 투자자 자료. 일반적으로 *Paid CAC* 와 *Blended CAC* 를 함께 보고.

**③ 액션**

- **개발**: Blended CAC 계산을 자동화하려면 *모든 채널의 사용자 유입을 한 ID 시스템에 통합* 해야 합니다. 오가닉도 *referral source* 로 추적.
- **디자인**: Blended CAC를 낮추는 디자인은 *공유·추천 UI*, *SEO 친화 페이지*, *입소문 유도 기능*. [ep.09](/marketing-metrics-handbook-ep-09)의 K-factor·Viral Coefficient가 직결.
- **기획**: Paid 비중이 너무 높으면 Blended CAC가 Paid CAC에 수렴. 오가닉 채널을 의도적으로 키워야 합니다.

**④ 사례**

- **센티**: Paid CAC 24,000원, 친구 초대 CAC(인센티브 비용) 9,000원, 오가닉 검색 CAC ≈ 0. 신규 가입 비율 4:3:3으로 가정 → Blended CAC = (24,000×0.4 + 9,000×0.3 + 0×0.3) = 12,300원.
- **실제 사례**: 토스의 초기 *친구 추천 5,000원 캐시백* 캠페인이 Blended CAC를 Paid CAC의 1/3 수준으로 끌어내린 사례. 당근마켓의 *동네 인증* 메커니즘이 오가닉 채널 자체.

**⑤ 비고**

- **흔한 함정**: 회사 규모가 커지면 *오가닉이 이미 광고에 흡수된 것* 인지 *진짜 오가닉* 인지 구분이 어려워집니다. 브랜드 광고가 검색 트래픽을 만드는 식.
- **함께 보기**: [CAC](/marketing-metrics-handbook-ep-08#cac), [Paid vs Organic](#paid-vs-organic), [MER](#mer)

---

## Paid vs Organic · 유료 대 유기 트래픽 {#paid-vs-organic}

**① 정의**

광고비를 직접 써서 데려온 트래픽(*paid*)과 자연적으로 들어온 트래픽(*organic*)의 구분.

- **Paid**: 검색 광고, 디스플레이, SNS 광고, 제휴 마케팅
- **Organic**: SEO 검색, 직접 방문, 자연 검색, 입소문, 친구 추천

**② 맥락**

- **회의에서**: *"전체 가입 중 Paid 비중이 1년 전 78%에서 52%로 떨어졌어요. 오가닉이 자랐습니다."* — 브랜드가 성숙해진다는 신호.
- **UI 위치**: GA4 *Default Channel Group*, Amplitude *Acquisition Source*, 자체 분석 대시보드의 *유입 채널* 보고서.

**③ 액션**

- **개발**: UTM, referrer header, 첫 이벤트의 source 속성을 정확히 캡처. 이게 안 되면 Paid/Organic 구분 자체가 안 됩니다. [ep.11](/marketing-metrics-handbook-ep-11) 트래킹에서 자세히.
- **디자인**: 오가닉을 키우는 디자인은 *공유 가능성 높은 OG 이미지*, *공유하고 싶은 결과 화면*, *SEO 친화적 URL과 시맨틱 HTML*.
- **기획**: 두 트래픽의 *질적 차이* 도 봐야 합니다. 오가닉이 일반적으로 활성화율과 LTV가 더 높습니다. *진짜 관심이 있어서 직접 찾아온 사용자* 이기 때문.

**④ 사례**

- **센티**: 1분기 Paid 78%, Organic 22%. 1년 후 Paid 52%, Organic 48%. 친구 초대(referral)가 Organic의 60%를 차지. 자연 검색 30%, 직접 방문 10%.
- **실제 사례**: 토스의 가입 채널 중 *친구 추천 + 직접 방문* 합산이 50%를 넘은 시점이 *PMF(Product-Market Fit) 의 신호* 로 회자됩니다. 당근마켓도 동네 입소문 비중이 매우 높음.

**⑤ 비고**

- **흔한 함정**: *Direct* 트래픽은 사실 *측정 실패한 트래픽* 인 경우가 많습니다. UTM이 빠진 채로 들어오면 Direct로 분류됩니다.
- **함께 보기**: [Blended CAC](#blended-cac), [Referral Rate](/marketing-metrics-handbook-ep-09#referral-rate), [UTM](/marketing-metrics-handbook-ep-11#utm)

---

## Marketing Efficiency Ratio (SaaS) · SaaS 마케팅 효율 지표 {#marketing-efficiency-ratio}

**① 정의**

SaaS 컨텍스트에서 *새로 확보한 ARR* 을 *영업·마케팅 비용* 으로 나눈 값. *Magic Number* 와 함께 SaaS 효율을 보는 대표 지표.

```
SaaS MER = 분기 Net New ARR ÷ 직전 분기 S&M 비용
```

분자가 *매출* 이 아니라 *연간 반복 매출 증가분(ARR)* 이라는 점에서 이커머스 MER과 다릅니다.

**② 맥락**

- **회의에서**: *"이번 분기 Magic Number 0.7이에요. 1.0 미만이면 영업 효율이 약하다는 신호입니다."* — SaaS 보드 미팅과 시리즈 B 이후 투자 협상에서 단골.
- **UI 위치**: SaaS 전용 BI 대시보드, 투자자 데이터 룸.

**③ 액션**

- **개발**: ARR 산정 로직을 명확히. 월결제·연결제·할인·환불·다운그레이드를 모두 어떻게 ARR에 반영할지 정의서. 이게 흐트러지면 Magic Number도 흐트러집니다.
- **디자인**: SaaS 효율을 끌어올리는 디자인은 *셀프 서브(self-serve) 가입과 결제 흐름*. 영업 개입을 줄이는 PLG(Product-Led Growth) 디자인.
- **기획**: *비즈니스 모델 자체* 의 지표. 가격 정책, 패키지 구성, 영업 조직 구조 모두와 얽힙니다.

**④ 사례**

- **센티(B2B 확장 시나리오)**: 직전 분기 영업·마케팅 비용 5,000만 원, 이번 분기 Net New ARR 6,500만 원. Magic Number = 1.3. 1.0 이상이면 *효율적인 성장*, 0.5 미만이면 *비효율적*.
- **실제 사례**: 슬랙, 줌, 노션 같은 PLG SaaS가 초기에 Magic Number 1.5 이상을 기록한 사례. 한국에서는 채널코퍼레이션, 채널톡 같은 SaaS가 유사 지표를 추적.

**⑤ 비고**

- **흔한 함정**: SaaS 초기에는 *Burn Multiple* (현금 소진 비율)도 함께 봅니다. Magic Number 좋아도 현금 소진이 심하면 위험.
- **함께 보기**: [MRR](/marketing-metrics-handbook-ep-08#mrr), [ARR](/marketing-metrics-handbook-ep-08#arr), [CAC](/marketing-metrics-handbook-ep-08#cac)

---

## Payback Window · 회수 기간 {#payback-window}

**① 정의**

광고비(또는 CAC)를 회수하는 데 걸리는 시간.

```
Payback Window = CAC ÷ 월평균 매출(또는 마진)
```

CAC 24,000원, 월평균 매출 4,900원이면 Payback = 4.9개월. *5개월 만에 광고비를 회수한다* 는 뜻.

**② 맥락**

- **회의에서**: *"Payback Window가 14개월인데 평균 구독 유지가 9개월이라 적자에요."* — 회수 전에 떠난다는 진단.
- **UI 위치**: CFO 대시보드, SaaS 단위경제 보고서. 보통 *마진 기준* 으로 계산.

**③ 액션**

- **개발**: 코호트별 누적 매출 곡선을 산출. *N월차에 누적 매출이 CAC를 넘는가* 의 시각화. 이게 [ep.06](/marketing-metrics-handbook-ep-06) 리텐션 곡선과 같은 도구로 그려집니다.
- **디자인**: Payback을 줄이는 디자인은 *첫 결제까지의 시간 단축*. 가입 즉시 결제 유도, 첫 결제 할인, 무료 체험 → 자동 결제 전환의 UX 흐름.
- **기획**: Payback Window의 적정 길이는 산업별. SaaS B2B 12개월 이내가 건강, 모바일 컨슈머 앱은 6개월 이내가 일반적.

**④ 사례**

- **센티**: CAC 24,000원, 월 4,900원 × 마진율 92% = 월 마진 4,508원. Payback = 5.3개월. 평균 구독 유지 9개월이므로 회수 후 약 3.7개월의 순이익이 남습니다.
- **실제 사례**: 넷플릭스의 Payback Window가 한때 18개월이었다가 콘텐츠 투자 확대로 24개월로 늘어난 시기가 IR 자료에 보고됩니다.

**⑤ 비고**

- **흔한 함정**: Payback이 짧다고 무조건 좋은 건 아닙니다. LTV가 짧은 비즈니스(저가 일회성 구매)는 Payback이 짧을 수밖에 없습니다. *LTV ÷ Payback* 비율을 함께.
- **함께 보기**: [Payback Period](/marketing-metrics-handbook-ep-08#payback-period), [LTV:CAC Ratio](/marketing-metrics-handbook-ep-08#ltv-cac-ratio)

---

## Funnel Efficiency · 퍼널 효율성 {#funnel-efficiency}

**① 정의**

전체 퍼널을 통과해 최종 전환에 도달한 사용자의 비율, 또는 단계별 전환율의 곱.

```
Funnel Efficiency = 최종 전환 수 ÷ 진입 수
또는
= 단계 1 CVR × 단계 2 CVR × … × 단계 N CVR
```

5단계 퍼널에서 각 단계 CVR이 50%면 최종 Funnel Efficiency = 0.5⁵ = 3.1%. 단계가 많아질수록 급격히 떨어집니다.

**② 맥락**

- **회의에서**: *"가입 → 활성화 → 첫 결제까지 Funnel Efficiency가 1.8%에요. 같은 광고비라면 어디를 고쳐야 가장 효과가 클지 봅시다."* — *깔때기의 어느 구멍을 막을 것인가* 의 회의.
- **UI 위치**: GA4 *탐색 → 깔때기 탐색*, Amplitude *Funnel Analysis*, Mixpanel *Funnels*.

**③ 액션**

- **개발**: 각 단계의 이벤트를 정확히 정의하고 동일 사용자 ID로 연결. *동일 사용자가 한 단계를 여러 번 거치는 경우* 의 카운팅 규칙을 명시.
- **디자인**: 가장 큰 누수가 있는 단계의 화면을 우선 개선. *데이터의 핫스팟* 을 디자인 우선순위로 변환.
- **기획**: 단계 수 자체를 줄이는 것이 종종 최고의 효율화. 4단계를 3단계로 줄이면 같은 단계 CVR로도 효율이 25% 상승.

**④ 사례**

- **센티**: 광고 클릭 → 앱 설치 → 회원가입 → 계좌 연동 → 첫 거래 분류 = 5단계. 각 단계 60%, 55%, 70%, 80%, 65% → 최종 Funnel Efficiency = 12%. 가장 약한 가입 단계를 70%로 끌어올리면 13.5%로 상승.
- **실제 사례**: 토스가 *간편 인증 → 송금까지 3탭* 으로 압축한 것은 단계 축소의 대표 사례. 카카오뱅크가 *카카오톡 인증 → 계좌 개설까지 4단계* 로 유지하는 것도 의도된 단순화.

**⑤ 비고**

- **함께 보기**: [Drop-off Rate](/marketing-metrics-handbook-ep-04#drop-off-rate), [Conversion Funnel](/marketing-metrics-handbook-ep-04#conversion-funnel), [Funnel Step](/marketing-metrics-handbook-ep-04#funnel-step)

---

## 이번 편 한눈에 보기

| 용어 | 분자 | 분모 | 시선 |
|---|---|---|---|
| ROAS | 광고로 발생한 매출 | 광고비 | 광고 매니저 |
| ROI | 순이익 | 투자 비용 | 회계·경영진 |
| MER | 총 매출 | 총 마케팅 비용 | CFO·CMO |
| iROAS | 증분 매출 | 광고비 | 그로스 팀 |
| Blended CAC | 마케팅 비용 | 전체 신규 고객 | 단위경제 |
| SaaS MER | Net New ARR | S&M 비용 | SaaS 보드·투자자 |
| Payback Window | CAC | 월 매출(마진) | CFO·투자자 |
| Funnel Efficiency | 최종 전환 | 진입 | 제품 PM |

---

## 자주 헷갈리는 쌍

### ROAS vs ROI

| | ROAS | ROI |
|---|---|---|
| **분자** | 매출 | 순이익 |
| **분모** | 광고비 | 투자 비용 |
| **마진 반영** | 없음 | 있음 |
| **누가 봄** | 마케터, 광고 매니저 | 경영진, 회계 |
| **위험** | 매출만 났지 적자일 수 있음 | 마진 구조 의존도 큼 |

### ROAS vs MER

![\"같은 매출, 두 가지 시선\"이라는 제목으로 ROAS와 MER을 위아래 두 패널로 비교하는 다이어그램. 위쪽 \"ROAS 시선 — 매체 보고서\" 패널은 각 매체가 자기 광고에 귀속한 매출만 카운트하는 모습으로, Meta는 ROAS 380%(광고비 4,000,000·매출 15,200,000), Google은 ROAS 460%(광고비 3,000,000·매출 13,800,000), Kakao는 ROAS 320%(광고비 5,400,000·매출 17,280,000)의 막대로 나열된다. 단순 합산하면 광고비 12,400,000·매출 46,280,000·합산 ROAS 373%이다. 아래쪽 \"MER 시선 — 회사 손익\" 패널은 매체 어트리뷰션과 무관하게 발생한 전체 매출을 큰 사각형 안에 담아, 광고 귀속 매출(Meta 15.2M·Google 13.8M·Kakao 17.3M)과 중복 어트리뷰션(−6,000,000, 동일 유저가 여러 매체를 클릭), Organic/Direct 매출(10,000,000, 검색·추천·재방문)을 함께 보여준다. 통합 손익은 마케팅 비용 12,400,000 + 도구·인건비 7,600,000 = 20,000,000, 총 매출 50,280,000, MER 2.5×이다. 맨 아래 해설은 ROAS 합산 373%와 MER 252% 사이의 격차가 어트리뷰션 중복과 오가닉 매출에서 비롯됨을 설명한다.](./mmh-02-03-roas-vs-mer.svg)

ROAS는 *광고 매니저가 자기 광고에 귀속한 매출만* 봅니다. MER은 *모든 매출 ÷ 모든 마케팅 비용*. 채널이 많아질수록 ROAS 합산과 MER이 어긋납니다. 어트리뷰션 충돌의 신호.

### ROAS vs iROAS

리타기팅 캠페인은 ROAS 800%, iROAS 120%처럼 6배 이상 차이가 나는 경우가 흔합니다. *광고를 안 봤어도 살 사람* 이 그만큼 많기 때문. 신규 획득 캠페인은 두 수치 차이가 작습니다.

### Payback Window vs LTV:CAC

Payback은 *시간* 의 단위, LTV:CAC는 *비율* 의 단위. 같은 사실의 두 측면.

```
Payback이 짧다 = 빠르게 회수한다
LTV:CAC가 크다 = 회수 후 많이 남는다
```

둘 다 본 후에야 단위경제 판단이 완성됩니다.

---

## 참고 자료

- Skok, D. *SaaS Metrics 2.0*. For Entrepreneurs.
- Tunguz, T. *The SaaS Adventure*. https://tomtunguz.com
- Christensen, M. *The Magic Number Explained*. SaaStr.
- eBay Research Labs. (2015). *Consumer Heterogeneity and Paid Search Effectiveness: A Large Scale Field Experiment*. Econometrica.
- Meta. *Conversion Lift Studies*. https://www.facebook.com/business/help
- Google Ads Help. *Incrementality Testing*. https://support.google.com/google-ads

---

## 다음 편 예고

> [ep.03 — 유입과 클릭](/marketing-metrics-handbook-ep-03)

광고비가 화면에 닿고 사용자가 우리 영역으로 넘어왔습니다. 이 첫 1분에 일어나는 일들 — 클릭률, 전환율, 이탈, 스크롤 깊이. 12개 용어를 다룹니다.
