# 3분 리셋 — 디지털 번아웃을 위한 명상

하루 종일 모니터를 보는 직장인이 앱 설치 없이, 지금 이 자리에서 3분 만에 뇌를 리셋할 수 있는 웹앱입니다. 무드별로 미리 준비된 10가지 명상 스크립트 중 하나가 매번 무작위로 재생되고, 브라우저가 직접 만들어내는 앰비언트 사운드와 호흡 애니메이션이 함께합니다. 외부 API 호출은 전혀 없습니다.

## 로컬 실행

```bash
npm install
npm run dev
```

[http://localhost:3000](http://localhost:3000) 에서 확인할 수 있습니다. API 키나 환경변수 설정이 필요 없습니다.

## 프로젝트 구조

- `app/page.tsx` — 메인 플로우 (기분 선택 → 로딩 → 3분 세션 → 완료)
- `app/history/page.tsx` — 누적 기록/연속일 보기
- `lib/moods.ts` — 무드별 4개 주제 × 10개 명상 스크립트 (전부 코드에 내장)
- `lib/ambientSound.ts` — Web Audio API로 생성하는 앰비언트 사운드
- `lib/sessionStore.ts` — localStorage 기반 세션 기록/스트릭
- `components/` — MoodPicker, BreathingFlow, SessionTimer, GuideText, SoundToggle, SessionControls

## 단일 HTML 버전

`public/standalone.html`은 서버/빌드 없이 그 파일 하나만으로 동작하는 독립 실행 버전입니다.

- 메인 앱과 동일한 40개(무드 4개 × 10개) 명상 스크립트가 파일 안에 그대로 내장되어 있음
- 기분 선택 → 호흡 파형 애니메이션 → 타이머 → 완료 → 기록까지 동일한 기능 제공
- 파일 하나만 복사해서 어디서든(로컬 더블클릭, USB, 이메일 첨부, 아무 정적 호스팅) 바로 열어볼 수 있음
- 이 레포를 Vercel에 배포하면 `/standalone.html` 경로로도 접근 가능

## Vercel 배포

1. GitHub에 레포 생성 후 푸시
2. [vercel.com](https://vercel.com)에서 해당 레포 Import
3. Deploy (환경변수 설정 불필요)
