---
title: "트래킹과 데이터 수집 - 마케팅 지표 핸드북 ep.11"
description: "UTM, 이벤트 트래킹, 픽셀, 서버사이드 트래킹. 모든 측정의 밑바닥에 있는 12개 단어."
summary: "지금까지의 모든 지표가 정확하기 위해서는 데이터가 정확하게 수집되어야 합니다. UTM 파라미터로 채널을 구분하고, 이벤트로 사용자 행동을 잡고, 픽셀과 태그로 외부 매체와 연결하고, 서버사이드 트래킹으로 정확도를 끌어올리는 흐름. 그리고 쿠키 시대 종말과 동의 모드까지. 측정 인프라의 어휘 12개."
date: 2026-05-19
thumbnail: ./cover.svg
tags: [series, develop, design, frontend, marketing, metrics, tracking, analytics, utm, pixel]
draft: false
---

![](./cover.svg)

지표가 틀리는 가장 흔한 이유는 *계산 실수가 아니라 측정 실수*다.

이벤트가 안 잡혔거나, 두 번 잡혔거나, 다른 채널로 어트리뷰션되었거나, 쿠키 차단으로 사라졌거나. 데이터의 *밑바닥 인프라* 가 모든 지표의 정확도를 결정한다. 마케팅이 아니라 *데이터 엔지니어링과 프론트엔드* 의 영역이지만, PM·디자이너도 이 어휘를 알아야 회의에서 진단이 가능하다.

---

## 이번 편에서 다룰 것

![핸드북 시리즈 전체 구조를 보여주는 단계 지도. 위쪽에는 다섯 단계 퍼널이 세로로 쌓여 있다 — ep.01–02 획득, ep.03–04 활성화, ep.05–07 유지, ep.08 수익, ep.09 추천. 그 아래 '측정 인프라 · MEASUREMENT LAYER'라는 띠가 있고 세 항목이 들어 있다 — ep.10 실험(A/B · p-value · MDE), ep.11 트래킹(UTM · Event · Pixel · CAPI), ep.12 어트리뷰션(Last-touch · Data-driven · GA4 · Amplitude). 이번 편인 ep.11 트래킹 항목이 강조 표시되어 있다. 하단 설명은 측정 인프라가 다섯 단계 전체에서 작동한다고 적혀 있다.](./mmh-11-01-stage-map.svg)

12개 용어. 캠페인 파라미터(UTM), 이벤트 측정(Event Tracking, Pageview, Custom Event, User Property), 외부 트래킹 도구(Cookie, Pixel/Tag, Server-side Tracking), 동의와 식별(Consent Mode, Identity Resolution), 데이터의 출처(First-party Data, Third-party Data).

이번 편은 *프론트엔드 개발자* 의 편에 가깝습니다. 그러나 *어트리뷰션이 왜 깨졌는지* 진단하려면 모두 알아야 합니다.

---

## UTM · UTM Parameter · 캠페인 파라미터 {#utm}

**① 정의**

URL에 붙는 *추적용 쿼리 파라미터*. 트래픽이 *어디서 왔는지* 를 표기.

```
https://centi.app/landing?utm_source=facebook&utm_medium=cpc&utm_campaign=spring-2026&utm_content=video-a&utm_term=가계부
```

다섯 가지 파라미터.

- **utm_source**: 매체 (facebook, google, naver)
- **utm_medium**: 유형 (cpc, email, social)
- **utm_campaign**: 캠페인명 (spring-2026)
- **utm_content**: 크리에이티브 (video-a)
- **utm_term**: 키워드 (검색 광고용)

**② 맥락**

- **회의에서**: *"네이버 광고 UTM이 utm_medium=cpa로 잘못 박혀서 cpc 그룹에 안 잡혔어요. 보고서 다시 돌립니다."* — 사소한 오타가 전체 보고를 깨뜨립니다.
- **UI 위치**: GA4 *Traffic Acquisition*, Amplitude *Acquisition* 보고서.

**③ 액션**

- **개발**: UTM 파라미터를 *모든 광고 링크에 자동 부여* 하는 도구(*UTM Builder*). 각 매체마다 다른 매크로(macro) 표기로 *광고 ID, 캠페인 ID 자동 치환*. Meta는 `{{ad.id}}`, Google은 `{ad_id}` 같은 식.
- **디자인**: 광고 디자인과 UTM은 *함께 운영*. 디자인 변경 시 utm_content 갱신.
- **기획**: UTM 명명 규칙을 *팀 단위로 통일*. 자유 입력 허용하면 *Facebook, facebook, FB* 가 동시에 등장하는 혼돈.

**④ 사례**

- **센티**: UTM 규약 — `utm_source = facebook | google | naver | kakao`, `utm_medium = cpc | display | social | email | push`, `utm_campaign = {month}-{theme}-{audience}`. 명명 규칙 문서가 마케팅 팀의 핵심 자산.

**⑤ 비고**

- **흔한 함정**: UTM 대소문자 — `Facebook`과 `facebook`이 다른 채널로 잡힙니다. 항상 소문자.
- **함께 보기**: [Event Tracking](#event-tracking), [First-touch](/marketing-metrics-handbook-ep-12/#first-touch)

---

## Event Tracking · 이벤트 트래킹 {#event-tracking}

**① 정의**

사용자의 *행동을 측정 가능한 단위로 기록* 하는 시스템. 각 행동이 하나의 *이벤트(event)*.

```
이벤트 = 이벤트 이름 + 발생 시각 + 사용자 ID + 추가 속성

예: { event: "sign_up_completed", time: "2026-05-14 14:32:18", 
      user_id: "u_4a3b", properties: { method: "kakao", channel: "facebook" } }
```

**② 맥락**

- **회의에서**: *"sign_up_completed 이벤트가 D-7부터 안 잡혀요. SDK 업데이트 영향 의심."* — 정확도 진단의 출발.
- **UI 위치**: Amplitude, Mixpanel, GA4의 *Events* 보고서.

**③ 액션**

- **개발**: 이벤트 정의서(*event taxonomy*)가 모든 측정의 기반. *이벤트 이름, 발화 시점, 속성 스키마* 를 문서화. 변경 시 *버전 관리*.
- **기획**: *너무 많은 이벤트* 도 *너무 적은 이벤트* 도 문제. 일반적으로 *제품 핵심 30~50개 이벤트* 가 안정점.

**④ 사례**

- **센티 이벤트 분류**:
  - *Acquisition*: page_view, ad_click, deep_link_opened
  - *Onboarding*: sign_up_started, sign_up_completed, account_linked, first_categorization
  - *Engagement*: app_opened, dashboard_viewed, alert_received
  - *Monetization*: paywall_viewed, subscription_started, subscription_cancelled
  - *Referral*: invite_sent, invite_accepted, referral_bonus_received

**⑤ 비고**

- **함께 보기**: [Custom Event](#custom-event), [Pageview](#pageview)

---

![트래킹 인프라의 두 가지 경로를 비교하는 흐름도. 제목은 '두 가지 트래킹 경로'이며 같은 사용자 행동이 두 갈래 길로 흐른다. 위쪽 경로 ① 클라이언트 사이드 — 픽셀·태그(정확도 70~80%)는 '브라우저·앱(사용자 디바이스)' 노드에서 점선 화살표 두 개가 갈라져 나간다 — 하나는 '픽셀 신호, 차단 영향 큼'으로 '광고 매체(Meta·Google·Kakao)'에, 다른 하나는 'SDK 신호(GA4·Amplitude)'로 '분석 도구(GA4·Amplitude)'에 도달한다. 점선 구분선 아래 경로 ② 서버사이드 — Conversion API(정확도 90%+)는 '브라우저·앱'에서 실선 화살표 '이벤트'로 '우리 서버(centi-api)'에 보내고, 우리 서버는 'CAPI 해시 식별자 + 이벤트'로 '광고 매체'에, 또 아래로 '데이터 웨어하우스(BigQuery·Snowflake)'를 거쳐 '분석·BI(Amplitude·자체 BI)'로 흐른다. 하단 결론은 서버사이드 도입의 ROI가 광고 월비 1억 이상부터 명확하며 두 경로 병행이 2026년 표준이라고 적혀 있다.](./mmh-11-02-tracking-infra.svg)

---

## Pageview · 페이지뷰 {#pageview}

**① 정의**

가장 기본적인 이벤트. *사용자가 페이지(또는 화면)에 도착한 사건*.

```
Pageview = { url, title, referrer, time, user_id }
```

웹은 페이지 URL, 모바일 앱은 화면 이름.

**② 맥락**

- **회의에서**: *"DAU는 그대로인데 pageview가 30% 늘었어요. 사용자당 둘러본 페이지가 늘었다는 신호."* — 가장 기본 지표.

**③ 액션**

- **개발**: SPA(Single Page Application)에서는 *라우터 이벤트* 에 수동으로 pageview 발화. 자동 측정이 누락되기 쉽습니다.
- **기획**: 모바일 앱은 *Screen View* 라고도 부릅니다. 같은 개념.

**⑤ 비고**

- **함께 보기**: [Event Tracking](#event-tracking), [Custom Event](#custom-event)

---

## Custom Event · 커스텀 이벤트 {#custom-event}

**① 정의**

제품 *특수 상황* 을 측정하기 위해 직접 정의한 이벤트. 표준 이벤트(pageview, click) 외 모든 의도된 행동.

```
예: card_categorized, family_invited, budget_alert_set, csv_exported
```

**② 맥락**

- **회의에서**: *"새 기능 출시했는데 이벤트 정의를 안 했어요. 다음 주부터 측정해야 합니다."* — 가장 흔한 실수.

**③ 액션**

- **개발**: 기능 *출시 전* 에 이벤트 정의 + 발화 코드 추가가 표준. 출시 후 추가는 *과거 데이터 없음* 상태에서 시작.
- **기획**: PRD(Product Requirements Document)에 *측정 이벤트* 섹션 필수. *어떤 행동을 측정할지* 가 기능 정의의 일부.

**⑤ 비고**

- **함께 보기**: [Event Tracking](#event-tracking)

---

## User Property · 사용자 속성 {#user-property}

**① 정의**

사용자에 *영구적으로 붙는 속성*. 이벤트마다 새로 보내지 않고 한 번 설정.

```
사용자 속성 예시:
- 가입일, 가입 채널, 첫 결제일
- 가입 시 연령대, 지역
- 현재 플랜, 가족 인원 수
- 마지막 활성 채널, 기기 종류
```

**② 맥락**

- **회의에서**: *"코호트 분석할 때 사용자 속성에 sign_up_channel이 있어야 채널별 잔존이 나옵니다."* — 분석 단위의 결정.

**③ 액션**

- **개발**: 사용자 속성은 *처음 설정 시점* 과 *업데이트 시점* 의 정의가 중요. 가입 채널은 *처음 1회만*, 현재 플랜은 *변경 시마다 업데이트*.
- **기획**: 분석에 자주 쓰는 *세그먼테이션 축* 을 사용자 속성으로 미리 설계.

**⑤ 비고**

- **함께 보기**: [Event Tracking](#event-tracking), [Identity Resolution](#identity-resolution)

---

## Cookie · 쿠키 {#cookie}

**① 정의**

브라우저에 저장되는 *작은 텍스트 데이터*. 사용자 식별, 세션 유지, 광고 추적의 표준 도구였습니다.

```
First-party Cookie: 우리 도메인이 직접 발급
Third-party Cookie: 다른 도메인(광고 매체)이 발급
```

2024~2025년 *Third-party Cookie 시대 종말*. Safari·Firefox는 이미 차단, Chrome도 단계적 제한.

**② 맥락**

- **회의에서**: *"iOS Safari 사용자는 third-party cookie가 0이라 페이스북 어트리뷰션이 깨져요. 서버사이드로 옮겨야 합니다."* — 어트리뷰션 정확도 하락의 주 원인.

**③ 액션**

- **개발**: First-party 쿠키 위주 측정으로 전환. *우리 도메인 안의 식별자* 와 *서버사이드 트래킹* 을 결합.
- **기획**: Cookie 의존도가 높았던 어트리뷰션 모델(View-through, 광고 매체별 CVR)이 *2025년 이후 부정확해진* 환경 변화의 이해 필수.

**⑤ 비고**

- **함께 보기**: [Pixel](#pixel-tag), [Server-side Tracking](#server-side-tracking), [Identity Resolution](#identity-resolution)

---

## Pixel · Tag · 픽셀·태그 {#pixel-tag}

**① 정의**

외부 광고 매체가 *우리 페이지에 심는 작은 스크립트*. 광고 어트리뷰션과 리타게팅에 사용.

```
Meta Pixel, Google Tag, TikTok Pixel, Kakao Pixel, Naver Premium Log
```

페이지가 로드될 때 *해당 매체로 신호 전송* — *"이 사용자가 우리 사이트를 봤다"*. 매체는 이걸 자기 광고 이력과 매칭.

**② 맥락**

- **회의에서**: *"Meta Pixel 신호가 30% 누락. iOS ATT(App Tracking Transparency) 영향."* — 측정 누락의 일반 원인.

**③ 액션**

- **개발**: Pixel은 *클라이언트 사이드* 동작이라 *광고 차단기·쿠키 차단·ATT* 에 영향받음. 정확도 70~80%로 떨어집니다. 또한 Pixel 스크립트가 *페이지 로딩 속도* 에 영향. 너무 많은 픽셀이 페이지를 무겁게 만듭니다.
- **기획**: Pixel은 *2026년 현재 어트리뷰션의 약한 고리*. 서버사이드 트래킹과 병행이 표준.

**⑤ 비고**

- **함께 보기**: [Server-side Tracking](#server-side-tracking), [Cookie](#cookie)

---

## Server-side Tracking · 서버사이드 트래킹 {#server-side-tracking}

**① 정의**

이벤트를 *클라이언트(브라우저·앱)* 가 아니라 *우리 서버에서 광고 매체로 직접 전송*.

```
클라이언트 사이드: 사용자 브라우저 → 광고 매체 (쿠키·픽셀)
서버사이드: 사용자 브라우저 → 우리 서버 → 광고 매체 (Conversion API)
```

광고 차단기·쿠키 차단에 영향을 덜 받아 *정확도 90%+ 유지*.

**② 맥락**

- **회의에서**: *"Meta CAPI(Conversions API) 도입했어요. 이전 픽셀 대비 신호 22% 회복."* — 정확도 복원의 표준 방법.

**③ 액션**

- **개발**: 광고 매체마다 *Conversion API* 또는 *Enhanced Match* 도입. Meta CAPI, Google Enhanced Conversions, TikTok Events API, 네이버 NMP 등. 사용자 식별자(이메일, 전화번호)를 *해시* 해서 전송.
- **기획**: 서버사이드 도입은 *개발 리소스* 와 *마케팅 효율* 의 트레이드오프. 일반적으로 *광고비 월 1억 이상* 사용하면 즉시 ROI.

**④ 사례**

- **센티**: Meta CAPI 도입 전후 *Meta 어트리뷰션 매출* 15% 증가(실제 매출 변화 아님, 측정 정확도 회복). ROAS 보고서 신뢰도 회복.

**⑤ 비고**

- **함께 보기**: [Pixel](#pixel-tag), [Cookie](#cookie)

---

## Consent Mode · 동의 모드 {#consent-mode}

**① 정의**

사용자가 *쿠키·트래킹에 동의했는지* 에 따라 데이터 수집을 *조건부로 제한* 하는 시스템.

```
사용자 동의 여부:
- Granted: 모든 트래킹 활성
- Denied: 식별 가능 데이터 차단, 익명 집계만
```

GDPR(유럽), CCPA(캘리포니아), 한국 개인정보보호법 등 *법적 요구*.

**② 맥락**

- **회의에서**: *"유럽 사용자 30%가 트래킹 거부. 그쪽 어트리뷰션은 추정 모델."* — 지역별 데이터 정확도 차이.

**③ 액션**

- **개발**: Cookie Banner와 Consent Management Platform(*CMP*). GA4 *Consent Mode v2*, Google Tag *consent default*. 사용자 동의 상태를 매 이벤트에 함께 전송.
- **기획**: 트래킹 거부 사용자의 *추정 보정* 모델. 일부 광고 매체는 *모델 기반 보정* 자동 제공.

**⑤ 비고**

- **함께 보기**: [Cookie](#cookie), [Pixel](#pixel-tag)

---

## Identity Resolution · 신원 식별 {#identity-resolution}

**① 정의**

*같은 사용자의 여러 식별자를 하나로 묶는 과정*. 디바이스 ID, 쿠키 ID, 사용자 ID(로그인 후), 이메일, 전화번호 등.

```
같은 사용자 = 익명 디바이스 A → (로그인) → user_id u_4a3b
                 ↓
             다른 디바이스 B → (로그인) → 같은 user_id u_4a3b
```

**② 맥락**

- **회의에서**: *"광고는 디바이스로 어트리뷰션, 결제는 user_id로 추적. 두 단위 매칭이 30% 누락."* — 가장 흔한 데이터 결손.

**③ 액션**

- **개발**: *Identity Stitching* — 가입·로그인 시점에 익명 디바이스 ID를 user_id에 연결. 모든 이벤트에 *두 ID 동시 저장*.
- **기획**: Identity Resolution이 정확하면 *Cross-device LTV* 같은 분석 가능. 모바일에서 본 광고가 데스크탑 결제로 이어진 사례까지 추적.

**⑤ 비고**

- **함께 보기**: [User Property](#user-property), [Server-side Tracking](#server-side-tracking)

---

## First-party Data · 1자 데이터 {#first-party-data}

**① 정의**

*우리가 직접 사용자에게 받은 데이터*. 가입 시 입력 정보, 우리 서비스 사용 데이터, 우리 도메인의 쿠키 등.

```
가입 정보, 결제 기록, 우리 사이트 이벤트, 우리 도메인 쿠키
```

**② 맥락**

- **회의에서**: *"Third-party 데이터 의존도 줄이고 First-party 강화. 가입 시 더 풍부한 프로파일 수집."* — 2025년 이후 마케팅 데이터 전략의 핵심 방향.

**③ 액션**

- **개발**: First-party 데이터 수집 강화 — 회원 정보, 이벤트, 거래 기록, 사용자 프로파일.
- **기획**: First-party 데이터는 *우리만의 자산*. 광고 매체와 공유 시(CAPI, Customer Match) 강력한 타게팅과 어트리뷰션 가능.

**⑤ 비고**

- **함께 보기**: [Third-party Data](#third-party-data)

---

## Third-party Data · 3자 데이터 {#third-party-data}

**① 정의**

*다른 사람이 수집한 데이터* 를 구매·사용. 데이터 브로커가 모은 인구 통계, 관심사, 행동 패턴.

```
오라클, Acxiom, Experian 등 데이터 브로커의 제공 데이터
```

쿠키 시대 종말과 함께 *영향력 감소 중*. GDPR·CCPA 이후 더 어려워진 영역.

**② 맥락**

- **회의에서**: *"기존 Third-party 데이터 기반 타게팅 효율 절반으로 하락. First-party 중심으로 재편."* — 2025년 이후 마케팅 데이터의 변화.

**③ 액션**

- **기획**: Third-party 데이터에서 *First-party + Second-party(파트너 공유)* 로의 이행. 데이터 클린룸(*Data Clean Room*) 같은 새 도구의 등장.

**⑤ 비고**

- **함께 보기**: [First-party Data](#first-party-data), [Cookie](#cookie)

---

## 이번 편 한눈에 보기

| 용어 | 정의 (한 줄) | 비고 |
|---|---|---|
| UTM | 캠페인 추적 URL 파라미터 | 5종 필드 |
| Event Tracking | 행동 단위 측정 | event taxonomy 필요 |
| Pageview | 페이지 도착 이벤트 | 가장 기본 |
| Custom Event | 직접 정의한 이벤트 | 출시 전 정의 필수 |
| User Property | 사용자 영구 속성 | 세그먼테이션 축 |
| Cookie | 브라우저 텍스트 저장 | Third-party는 종말 |
| Pixel · Tag | 매체가 우리 페이지에 심는 스크립트 | 정확도 70~80% |
| Server-side Tracking | 서버에서 매체로 직접 전송 | CAPI, Enhanced Match |
| Consent Mode | 동의 기반 조건부 수집 | GDPR·CCPA 대응 |
| Identity Resolution | 여러 식별자 하나로 묶기 | Cross-device 분석의 기초 |
| First-party Data | 우리가 직접 받은 데이터 | 자산 |
| Third-party Data | 데이터 브로커 데이터 | 영향력 감소 중 |

---

## 자주 헷갈리는 쌍

### Client-side vs Server-side Tracking

| | Client-side (Pixel) | Server-side (CAPI) |
|---|---|---|
| **어디서** | 사용자 브라우저·앱 | 우리 서버 |
| **차단 영향** | 큼 (광고 차단기·쿠키 차단·ATT) | 작음 |
| **정확도** | 70~80% | 90%+ |
| **구현 난도** | 쉬움 | 어려움 |

### First-party vs Third-party Cookie

| | First-party | Third-party |
|---|---|---|
| **발급자** | 우리 도메인 | 다른 도메인 (광고 매체) |
| **차단 상태** | 거의 살아있음 | 거의 차단됨 (2025+) |
| **용도** | 우리 사이트 식별 | 매체 간 어트리뷰션 |

### Event vs User Property

| | Event | User Property |
|---|---|---|
| **단위** | 한 번의 행동 | 사용자의 상태 |
| **저장** | 시간 시퀀스 | 현재 값 또는 첫 설정 값 |
| **예시** | sign_up_completed | sign_up_channel |

---

## 참고 자료

- Segment. *Analytics.js Documentation*. https://segment.com/docs
- Google. *GA4 Event Reference*. https://support.google.com/analytics
- Amplitude. *Taxonomy Best Practices*. https://amplitude.com
- Meta. *Conversions API Documentation*. https://developers.facebook.com
- IAB. *Consent Management Platform List*. https://iabeurope.eu
- Apple. *App Tracking Transparency Guide*. https://developer.apple.com

---

## 다음 편 예고

> [ep.12 — 어트리뷰션과 도구 지도](/marketing-metrics-handbook-ep-12/)

마지막 편. 한 가입자가 *어느 광고 덕분에 들어왔는지* 결정하는 모델들과, 모든 측정을 실제로 돌리는 도구들의 비교까지. First-touch, Last-touch, Multi-touch, Data-driven 어트리뷰션, GA4·Amplitude·Mixpanel. 13개 용어.
