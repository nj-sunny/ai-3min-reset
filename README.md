# 3분 리셋 — 디지털 번아웃을 위한 AI 명상

하루 종일 모니터를 보는 직장인이 앱 설치 없이, 지금 이 자리에서 3분 만에 뇌를 리셋할 수 있는 웹앱입니다. Google Gemini가 매번 다른 3분 명상 스크립트를 생성하고, 브라우저가 직접 만들어내는 앰비언트 사운드와 호흡 애니메이션이 함께합니다.

## 로컬 실행

```bash
npm install
npm run dev
```

[http://localhost:3000](http://localhost:3000) 에서 확인할 수 있습니다.

## Gemini API 키 설정 (선택)

API 키가 없어도 미리 준비된 프리셋 스크립트로 정상 동작합니다. 실제 AI가 매번 다른 스크립트를 생성하게 하려면:

1. [Google AI Studio](https://aistudio.google.com/apikey)에서 무료 API 키 발급
2. 프로젝트 루트에 `.env.local` 파일 생성 (`.env.local.example` 참고)
   ```
   GEMINI_API_KEY=발급받은_키
   ```
3. 개발 서버 재시작 (`npm run dev`)

키는 서버(API route)에서만 사용되며 브라우저에는 노출되지 않습니다.

## 프로젝트 구조

- `app/page.tsx` — 메인 플로우 (기분 선택 → 로딩 → 3분 세션 → 완료)
- `app/history/page.tsx` — 누적 기록/연속일 보기
- `app/api/generate-script/route.ts` — Gemini 호출 서버 라우트 (실패 시 프리셋 폴백)
- `lib/gemini.ts` — Gemini REST 호출 + 프롬프트
- `lib/ambientSound.ts` — Web Audio API로 생성하는 앰비언트 사운드
- `lib/sessionStore.ts` — localStorage 기반 세션 기록/스트릭
- `components/` — MoodPicker, BreathingFlow, SessionTimer, GuideText, SoundToggle, SessionControls

## 단일 HTML 버전 (API 없이)

`public/standalone.html`은 서버/빌드/API 없이 그 파일 하나만으로 동작하는 독립 실행 버전입니다.

- Gemini 연동 없이 무드별 프리셋 스크립트만 사용 (API 키 불필요, 외부 요청 전혀 없음)
- 기분 선택 → 호흡 파형 애니메이션 → 타이머 → 완료 → 기록까지 동일한 기능 제공
- 파일 하나만 복사해서 어디서든(로컬 더블클릭, USB, 이메일 첨부, 아무 정적 호스팅) 바로 열어볼 수 있음
- 이 레포를 Vercel에 배포하면 `/standalone.html` 경로로도 접근 가능

## Vercel 배포

1. GitHub에 레포 생성 후 푸시
2. [vercel.com](https://vercel.com)에서 해당 레포 Import
3. Project Settings → Environment Variables에 `GEMINI_API_KEY` 추가
4. Deploy
