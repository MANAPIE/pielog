---
title: "유지와 참여 - 마케팅 지표 핸드북 ep.05"
description: "DAU, WAU, MAU, Stickiness, Session. 매일 들어오는 사람과 한 달 만에 다시 온 사람을 묶고 가르는 12개 지표."
summary: "활성화한 사용자가 계속 돌아오는가의 문제. 일·주·월 활성 사용자를 묶는 단위, 두 단위를 나눠 만드는 Stickiness, 세션의 정의와 그 안의 시간 지표들. DAU가 늘었는데 사용자는 그대로일 수 있는 이유와 그 함정까지 정리합니다."
date: 2026-05-17
thumbnail: ./cover.svg
tags: [series, develop, design, marketing, metrics, retention, dau, mau, engagement, session]
draft: false
---

![](./cover.svg)

활성화한 사용자가 *내일도 들어올까*. 일주일 뒤에도. 한 달 뒤에도.

이 질문에 대답하는 단어들은 단순해 보이지만 매번 헷갈린다. DAU가 늘었다고 좋은 건가. MAU 100만은 어떻게 해석해야 하는가. 같은 100만에 Stickiness 40%와 Stickiness 8%는 다른 회사다. 가장 자주 인용되는 숫자가 가장 자주 잘못 해석되는 숫자들이기도 하다.

---

## 이번 편에서 다룰 것

![마케팅 퍼널 5단계를 세로로 쌓은 지도 다이어그램. 위에 'FOCUS — 유지 · 참여' 표시. 위에서 아래로 획득(ep.01–02), 활성화(ep.03–04), 유지(ep.05–07), 수익(ep.08), 추천(ep.09) 순서로 화살표로 연결되며, 세 번째 유지 단계가 강조되어 있고 'DAU · MAU · Stickiness · Session' 지표가 표기됨. 맨 아래에는 측정 인프라(MEASUREMENT LAYER) 띠로 ep.10 실험, ep.11 트래킹, ep.12 어트리뷰션이 놓임. 이번 편 ep.05가 유지 단계에 속함을 보여줌.](./mmh-05-01-stage-map.svg)

12개 용어. 시간 단위 활성 사용자(DAU, WAU, MAU), 단위 사이의 비율(Stickiness), 세션의 어휘(Session, Session Duration, Pages per Session, Average Session), 세션의 질(Engaged Session, Bounce Session, Engagement Rate), 사용자 단위의 활성도(Active Days).

이번 편은 *유지의 시작점* 이고, 다음 편 [ep.06](/marketing-metrics-handbook-ep-06/)이 *코호트와 리텐션 곡선*, [ep.07](/marketing-metrics-handbook-ep-07/)이 *이탈* 입니다. 세 편이 묶입니다.

---

## DAU · Daily Active Users · 일간 활성 사용자 {#dau}

**① 정의**

24시간 안에 *활성* 으로 정의된 행동을 한 고유 사용자 수.

```
DAU = 그 날짜에 활성 이벤트가 한 번 이상 발생한 unique user 수
```

*활성* 의 정의는 제품마다 다릅니다. *앱 열기* 만으로 활성으로 보는 경우, *의미 있는 행동을 한 경우*, *세션 시간이 N초 이상*.

**② 맥락**

- **회의에서**: *"이번 주 DAU 124K, 지난 주 118K. 5.1% 증가."* — 가장 빠른 신호. 매일 보고되는 첫 번째 숫자.
- **UI 위치**: 거의 모든 그로스 대시보드의 첫 칸. GA4, Amplitude, Mixpanel, 자체 BI.

**③ 액션**

- **개발**: *활성* 이벤트의 정의가 모든 DAU의 의미를 결정. *앱 열기* 만으로 활성으로 잡으면 푸시 알림 한 번에 DAU가 거짓으로 부풀려집니다. *앱 열기 + 의미 있는 화면 도달* 이 일반적.
- **디자인**: DAU에 직접 영향을 주는 디자인은 *복귀 유도* — 푸시 알림 카피, 위젯, 이메일 시퀀스, 알림 배지.
- **기획**: DAU는 *유입에 흔들립니다*. 광고 캠페인 시작 직후 DAU 급증이 *질적 성장* 인지 *일시적 유입* 인지 구분이 필요. WAU·MAU와 함께 봐야 합니다.

**④ 사례**

- **센티**: 평일 DAU 평균 89K, 주말 62K. 월급일·카드값 결제일 주변 DAU 140K 스파이크. *시간대별 사용 패턴* 이 가계부 앱의 특성을 그대로 보여줍니다.
- **실제 사례**: 카카오톡 DAU 4,000만대, 토스 DAU 1,700만대, 당근마켓 DAU 1,800만대(2025년 추정). 한국 인구 5,100만 중 1/3 이상이 매일 사용하는 서비스.

**⑤ 비고**

- **흔한 함정**: DAU가 늘었다고 *사용자가 늘은* 게 아닐 수 있습니다. *같은 사용자가 더 자주 들어온* 경우도 DAU는 같이 늡니다. WAU·MAU와 묶어서 해석.
- **함께 보기**: [WAU](#wau), [MAU](#mau), [Stickiness](#stickiness)

---

## WAU · Weekly Active Users · 주간 활성 사용자 {#wau}

**① 정의**

7일 안에 *한 번 이상* 활성 행동을 한 고유 사용자 수.

```
WAU = 지난 7일 안에 활성 이벤트가 발생한 unique user 수
```

DAU와 달리 *매일 들어올 필요는 없습니다*. 7일 중 한 번이라도 들어오면 카운트.

**② 맥락**

- **회의에서**: *"WAU는 늘었는데 DAU는 평이해요. 사용자는 늘었지만 빈도는 그대로라는 신호에요."* — 변화의 결을 읽는 어휘.
- **UI 위치**: WAU는 DAU만큼 자주 보고되지는 않지만, *제품 회의의 깊은 분석* 에 자주 쓰입니다.

**③ 액션**

- **개발**: WAU는 *7일 윈도우 안의 unique count*. SQL로는 `count(distinct user_id) where date between :date-7 and :date`. 매일 새로 계산.
- **디자인**: 주 단위 사용 빈도를 끌어올리는 디자인 — *주간 요약 알림*, *지난주와 비교한 인사이트*, *주말 전용 콘텐츠*.
- **기획**: WAU는 *제품의 자연 사용 주기* 를 측정. 매일 쓰는 제품(메신저, 음악)은 DAU 위주, 주 1~2회 쓰는 제품(가계부, 가맹점 앱)은 WAU 위주.

**④ 사례**

- **센티**: WAU 320K. DAU/WAU = 28%. *가입자의 28%가 매일 들어옴*. 가계부 앱으로는 양호한 수치(보통 15~25%).
- **실제 사례**: 슬랙·노션 같은 업무 도구는 WAU 위주로 측정. *일하는 날에만 쓰니까 DAU가 의미가 적은* 구조.

**⑤ 비고**

- **함께 보기**: [DAU](#dau), [MAU](#mau)

---

## MAU · Monthly Active Users · 월간 활성 사용자 {#mau}

**① 정의**

30일(또는 캘린더 월) 안에 *한 번 이상* 활성 행동을 한 고유 사용자 수.

```
MAU = 지난 30일 안에 활성 이벤트가 발생한 unique user 수
```

산업·서비스 전반의 *규모* 를 묘사하는 가장 보편적 지표.

**② 맥락**

- **회의에서**: *"MAU 1,200만, 1년 전 대비 32% 증가."* — 분기 보고와 IR 자료의 단골.
- **UI 위치**: 분기 KPI 보고, 투자자 자료, 언론 보도.

**③ 액션**

- **개발**: MAU는 *30일 롤링 윈도우* 또는 *캘린더 월* 두 방식. 회사 안에서 어느 방식인지 통일.
- **디자인**: 월 단위 복귀를 유도하는 디자인 — *월 1회 리포트 발송*, *월별 챌린지*, *멤버십 갱신 시점 알림*.
- **기획**: MAU는 *광고비를 정당화하는 가장 큰 숫자* 지만, 그만큼 의미가 옅어진 단어. *질적 지표(Stickiness, 잔존율)* 와 함께 봐야 합니다.

**④ 사례**

- **센티**: MAU 920K. DAU/MAU = 9.7% → Stickiness 9.7%. *한 달 안에 들어온 사람의 10%가 매일 들어옴*. 가계부 앱으로는 평균.
- **실제 사례**: 카카오톡 MAU 4,800만대(거의 전 국민), 토스 MAU 2,600만대, 당근마켓 MAU 2,200만대(2025년 추정).

**⑤ 비고**

- **흔한 함정**: MAU 100만이 되었다는 발표가 *그 100만 명의 80%가 다시 안 들어왔다* 는 사실을 가립니다. 절대 수만 보면 위험.
- **함께 보기**: [DAU](#dau), [Stickiness](#stickiness)

---

## Stickiness · 점착도 · DAU/MAU {#stickiness}

**① 정의**

월간 활성 사용자 중 *매일 들어오는 사용자의 비율*.

```
Stickiness = DAU ÷ MAU × 100 (%)
```

해석: *한 달 안에 들어온 사람 중 평균 X%가 어느 날이든 들어와 있다*.

**② 맥락**

- **회의에서**: *"MAU는 늘었는데 Stickiness가 12%에서 9%로 떨어졌어요."* — 사용자는 늘었지만 *빈도가 떨어진* 다는 진단. 단순 MAU 증가가 위험 신호일 수 있습니다.

**③ 액션**

- **개발**: Stickiness는 *비율 지표*. 일 단위로 계산해 7일 평균을 보면 노이즈가 줄어듭니다.
- **디자인**: Stickiness를 높이는 디자인은 *습관 형성 메커니즘* — 매일 다른 콘텐츠, 매일 다른 상태(streak), 일일 푸시 알림, 위젯.
- **기획**: 산업별 Stickiness 벤치마크가 매우 다릅니다. 메신저 60\~80%, 음악·동영상 30\~50%, 이커머스 5\~15%, 가계부·금융 8\~15%, 여행 3\~8%.

**④ 사례**

- **센티**: Stickiness 9.7%. 가계부·금융 평균. *습관 형성 위젯* 출시 후 12.3%로 상승. 매일 홈화면에서 *오늘의 지출* 을 보면서 자연스럽게 앱 진입.
- **실제 사례**: 토스의 Stickiness가 40%를 넘은 시점이 *송금 앱이 종합 금융 앱으로 자리잡은* 시점. 카카오톡은 70% 이상. 인스타그램·페이스북도 50% 이상.

**⑤ 비고**

- **흔한 함정**: Stickiness만 보면 *사용자 수의 변화* 를 못 봅니다. MAU가 감소하는 와중에도 Stickiness는 오를 수 있습니다.
- **함께 보기**: [DAU](#dau), [MAU](#mau), [Power User Curve](/marketing-metrics-handbook-ep-06/#power-user-curve)

---

![월·주·일 활성 사용자의 포함 관계를 보여주는 세 겹 동심원 다이어그램. 같은 사용자 데이터를 세 시간창으로 나눈 것으로 안쪽일수록 자주 들어오는 사람. 가장 바깥 원은 MAU 920,000명, 그 안의 원은 WAU 320,000명, 가장 안쪽 채워진 원은 DAU 89K. 아래에는 세 가지 비율 주석이 가로로 놓임: DAU÷MAU는 Stickiness 9.7%(한 달 안에 들어온 사람의 10%가 아무 날에나 들어와 있다는 뜻), DAU÷WAU는 27.8%(일주일에 한 번이라도 온 사람 중 28%가 매일 들어옴), WAU÷MAU는 34.8%(한 달 안에 온 사람의 35%가 일주일에 한 번 이상 다시 옴). 맨 아래 공식 박스에 'Stickiness = DAU ÷ MAU'와 업종별 벤치마크(메신저 60~80%, 음악·동영상 30~50%, 가계부·금융 8~15%)가 표기됨.](./mmh-05-02-dau-wau-mau.svg)

---

## Session · 세션 {#session}

**① 정의**

사용자가 *연속해서 앱·웹을 사용한 한 단위*. 세션의 끝은 매체별로 정의가 다릅니다.

- GA4 웹: 30분 무활동 또는 자정 통과 시 세션 종료
- 모바일 앱: 백그라운드 진입 + 30초~5분 무활동
- Amplitude: 기본 30분 inactivity

**② 맥락**

- **회의에서**: *"오늘 DAU 100K, 세션 240K. 1인당 평균 2.4 세션."* — 같은 사용자가 하루에 여러 번 들어옴.

**③ 액션**

- **개발**: 세션 정의의 *임계 시간(timeout)* 을 명시. 30분 vs 5분 vs 1시간 — 같은 데이터에서 세션 수가 크게 달라집니다. 회사 전체 합의 필요.
- **디자인**: 세션 수를 늘리는 디자인은 *짧고 자주 들어오는 사용* — 위젯, 푸시, 다양한 알림 트리거.
- **기획**: 세션은 *방문 횟수* 의 측정. 사용 빈도가 높은 제품은 세션이 많아야 하지만, *세션이 너무 짧으면 가치 못 본 채로 떠난* 신호.

**⑤ 비고**

- **함께 보기**: [Session Duration](#session-duration), [DAU](#dau)

---

## Session Duration · 세션 지속시간 {#session-duration}

**① 정의**

한 세션이 *시작에서 종료까지 걸린 시간*. 보통 평균 또는 중앙값으로 보고.

```
Average Session Duration = Σ 세션 시간 ÷ 세션 수
```

**② 맥락**

- **회의에서**: *"평균 세션 시간 4분 12초인데 광고 트래픽만 따로 보면 1분 8초에요."* — 트래픽 질의 차이.

**③ 액션**

- **개발**: 세션 종료 시점 측정이 까다롭습니다. 사용자가 *명시적으로 종료* 하지 않으므로 *마지막 이벤트로부터 N분* 으로 추정. 백그라운드 진입의 모바일 앱도 비슷.
- **디자인**: 세션 시간을 늘리는 디자인이 항상 좋은 건 아닙니다. *과업 완수형 앱(송금, 가계부 분류)* 은 짧을수록 좋고, *콘텐츠 소비형 앱(유튜브, 인스타그램)* 은 길수록 좋습니다.
- **기획**: 제품 성격에 맞는 *목표 세션 시간* 을 정해두면 평가 기준이 명확.

**④ 사례**

- **센티**: 평균 세션 1분 48초. 짧은 편이지만 *카드 분류와 잔액 확인이 빠르게 끝나는* 가계부 앱의 특성. 너무 길면 *분류가 헷갈리는* 문제 신호.

**⑤ 비고**

- **흔한 함정**: 평균은 항상 *극단값* 에 흔들립니다. 중앙값이 더 정확.
- **함께 보기**: [Session](#session), [Time on Page](/marketing-metrics-handbook-ep-03/#time-on-page)

---

## Pages per Session · 세션당 페이지 수 {#pages-per-session}

**① 정의**

한 세션에서 본 *페이지(또는 화면) 수의 평균*.

```
Pages per Session = 총 페이지뷰 ÷ 총 세션 수
```

**② 맥락**

- **회의에서**: *"Pages per Session이 3.2에서 4.8로 올랐어요. 사용자가 더 많이 둘러봤다는 신호."* — 콘텐츠 발견의 깊이.

**③ 액션**

- **개발**: 페이지 변경 이벤트(SPA는 라우터 이벤트)가 정확히 잡혀야 함. *SPA에서 페이지뷰가 누락* 되어 Pages per Session이 부풀려지거나 떨어진 사례가 흔합니다.
- **디자인**: Pages per Session을 늘리는 디자인은 *연관 콘텐츠 추천, 카테고리 탐색, 검색 결과의 풍부함*.
- **기획**: 이커머스·미디어에서는 Pages per Session이 핵심 지표. 가계부·금융 같은 *과업형* 에서는 의미가 적습니다.

**⑤ 비고**

- **함께 보기**: [Session Duration](#session-duration), [Engagement Rate](#engagement-rate)

---

## Engaged Session · 의미 있는 세션 {#engaged-session}

**① 정의**

GA4가 도입한 개념. 다음 셋 중 *하나라도 충족* 한 세션.

- 10초 이상 머무름
- 2페이지 이상 봄
- 전환 이벤트가 발생함

```
Engaged Session = 위 셋 중 하나 이상을 만족한 세션
```

**② 맥락**

- **회의에서**: *"Engaged Session 비율 62%에요. 38%는 사실상 Bounce."* — 의미 있는 세션의 비율 지표.

**③ 액션**

- **개발**: GA4는 자동으로 측정. 자체 분석에서는 *Engaged의 정의를 우리 제품에 맞게 변형* 가능. 가계부 앱은 *카드 분류 1건 이상 = Engaged* 로 정의할 수도.
- **디자인**: Engaged 비율을 높이려면 *첫 화면에서 즉시 가치 제공*. 10초를 견디게 만드는 콘텐츠.
- **기획**: Engaged Session 정의는 *제품 본질에 맞춰* 변형하는 것이 좋습니다. GA4 기본 정의는 미디어·블로그에 최적.

**⑤ 비고**

- **함께 보기**: [Bounce Rate](/marketing-metrics-handbook-ep-03/#bounce-rate), [Engagement Rate](#engagement-rate)

---

## Bounce Session · 이탈 세션 {#bounce-session}

**① 정의**

Engaged Session의 반대. 10초 미만, 1페이지만 보고, 전환 없이 떠난 세션.

```
Bounce Session = 세션 총수 - Engaged Session 수
Bounce Rate = Bounce Session ÷ 세션 총수
```

**② 맥락**

- [ep.03](/marketing-metrics-handbook-ep-03/)의 Bounce Rate와 같은 개념을 *세션 단위로* 부른 것. 회사·도구에 따라 용어 선호가 다릅니다.

**⑤ 비고**

- **함께 보기**: [Bounce Rate](/marketing-metrics-handbook-ep-03/#bounce-rate), [Engaged Session](#engaged-session)

---

## Engagement Rate · 참여율 {#engagement-rate}

**① 정의**

전체 세션 중 *Engaged Session의 비율*.

```
Engagement Rate = Engaged Session ÷ Total Session × 100 (%)
또는
Engagement Rate = 1 - Bounce Rate
```

**② 맥락**

- **회의에서**: *"Engagement Rate 62% — 좋은 페이지 평균. 광고 트래픽만 따로 보면 41%로 떨어져요."* — 트래픽 채널별 차이를 보는 지표.

**③ 액션**

- **개발**: GA4 표준 보고서에 포함. Engagement Rate가 0%인 채널은 *측정이 깨진 것일 수 있음* — 의심해보고 디버깅.
- **디자인**: Engagement Rate를 높이는 모든 디자인 — 빠른 로딩, 명확한 가치 약속, 즉각적 인터랙션 가능 요소.

**④ 사례**

- **센티**: 자연 검색 Engagement Rate 71%, 광고 41%. 광고 랜딩이 *진짜 관심 있는 사람보다 일단 본 사람* 을 더 많이 끌어온다는 신호.

**⑤ 비고**

- **함께 보기**: [Engaged Session](#engaged-session), [Bounce Rate](/marketing-metrics-handbook-ep-03/#bounce-rate)

---

## Active Days · 활성 일수 {#active-days}

**① 정의**

특정 기간 동안 사용자가 *활성으로 카운트된 날의 수*.

```
사용자 X의 Active Days (지난 30일) = 30일 중 활성 이벤트가 발생한 날 수
```

사용자 단위 지표. *DAU의 사용자 별 분해*.

**② 맥락**

- **회의에서**: *"우리 사용자 30일 평균 Active Days 5.2일. 헤비 유저는 21일이고 라이트 유저는 1일."* — 사용자 분포 분석.

**③ 액션**

- **개발**: 사용자별 days 카운트 SQL — `count(distinct date) where user_id = X`. 사용자 코호트 분석의 기본.
- **디자인**: Active Days 분포가 *바벨 형태(매일 vs 거의 안 옴)* 인 제품이 흔합니다. 라이트 유저를 헤비 유저로 끌어올리는 디자인이 주요 레버.
- **기획**: [ep.06](/marketing-metrics-handbook-ep-06/)의 *Power User Curve* 가 Active Days 분포를 시각화한 도구.

**⑤ 비고**

- **함께 보기**: [Power User Curve](/marketing-metrics-handbook-ep-06/#power-user-curve), [DAU](#dau)

---

## Average Session · 평균 세션 (수) {#average-session}

**① 정의**

기간 내 *사용자 1인당 평균 세션 수*.

```
Average Session per User = 총 세션 수 ÷ 활성 사용자 수
```

DAU 100K에 세션 240K이면 Average Session = 2.4. *하루에 평균 2.4번 들어옴*.

**② 맥락**

- **회의에서**: *"DAU는 그대로인데 평균 세션이 1.8 → 2.6으로 올랐어요. 같은 사람이 더 자주 들어옵니다."* — 사용 빈도 변화의 시그널.

**⑤ 비고**

- **함께 보기**: [Session](#session), [Stickiness](#stickiness)

---

## 이번 편 한눈에 보기

| 용어 | 정의 (한 줄) | 좋은 값 (참고) |
|---|---|---|
| DAU | 24시간 내 활성 unique user | — |
| WAU | 7일 내 활성 unique user | — |
| MAU | 30일 내 활성 unique user | — |
| Stickiness | DAU ÷ MAU | 가계부 8\~15%, 메신저 60\~80% |
| Session | 연속 사용 단위 | — |
| Session Duration | 한 세션 지속시간 | 과업형 1\~3분, 콘텐츠형 5\~15분 |
| Pages per Session | 세션당 페이지 수 | 이커머스 4\~8, 가계부 2\~4 |
| Engaged Session | 10초+ / 2pv+ / 전환 | — |
| Bounce Session | Engaged 반대 | — |
| Engagement Rate | Engaged ÷ Total | 50~70% |
| Active Days | 사용자별 활성 일수 (30일 중) | — |
| Average Session | 1인당 평균 세션 수 | — |

---

## 자주 헷갈리는 쌍

### DAU vs MAU vs Stickiness

같은 사용자 데이터의 세 각도. *어느 시점에 잘랐느냐* 의 차이.

- DAU 100K
- WAU 320K
- MAU 920K
- Stickiness 10.9%
- DAU/WAU 31.3%

같은 사용자라도 *매일 = DAU, 주에 한 번 = WAU만, 월에 한 번 = MAU만* 으로 다르게 분류됩니다.

### Engaged Session vs Bounce Session

| | Engaged | Bounce |
|---|---|---|
| **조건** | 10초+ / 2pv+ / 전환 | 위 셋 다 못 만족 |
| **둘의 합** | = 전체 세션 | |

### Session Duration vs Time on Page

| | Session Duration | Time on Page |
|---|---|---|
| **단위** | 세션 전체 | 한 페이지 |
| **포함관계** | Session = Σ Pages | |

---

## 참고 자료

- Lambert, J. *DAU/MAU is an Important Metric, but Here's Where It Fails*. Andreessen Horowitz.
- Ellis, S. *Hacking Growth*. Currency.
- GA4 Help. *Engagement Metrics*. https://support.google.com/analytics
- Amplitude. *Stickiness Patterns*. https://amplitude.com/blog
- Reforge. *Engagement Quality*. https://www.reforge.com

---

## 다음 편 예고

> [ep.06 — 코호트와 리텐션 곡선](/marketing-metrics-handbook-ep-06/)

DAU와 MAU는 *현재* 의 단어들이라면, 다음 편은 *시간 경과* 의 단어들입니다. 같은 날 가입한 사람들을 묶어 따라가면 어떤 곡선이 그려지는가. Retention Curve, Cohort, N-day Retention, Power User Curve. 10개 용어.
