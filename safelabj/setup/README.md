# 로컬 환경 셋업

`.gitignore` 로 인해 git 에 안 들어가는 환경 설정 파일들의 템플릿입니다.
새로 클론한 사람이 **로컬에서 직접 띄우려고 할 때** 만들어야 하는 파일들.

## 현재 운영 환경에서는?

배포된 시스템은 이 파일들이 **필요 없습니다**:
- **Vercel** (프론트) — Project Settings → Environment Variables 에 다음 등록:
  - `REACT_APP_GEMINI_API_KEY` (필수, 미설정 시 mock 폴백)
  - `REACT_APP_AZURE_SPEECH_KEY` (선택, 미설정 시 브라우저 Web Speech API 폴백)
  - `REACT_APP_AZURE_SPEECH_REGION` (예: `koreacentral`)
  - `REACT_APP_AZURE_SPEECH_VOICE` (예: `ko-KR-SunHiNeural`, 선택)
- **cloudtype** (백엔드) — 서비스 환경변수로 `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`, `OPENAI_API_KEY` 설정

→ 운영용 시크릿은 위 두 콘솔에 들어있고, 이 폴더의 파일은 **로컬 개발용 템플릿** 일 뿐입니다.

---

## 파일 매핑

### 1. 프론트엔드 환경변수
| 항목 | 값 |
|---|---|
| 템플릿 | [frontend.env.local](frontend.env.local) |
| 복사 위치 | `insurtech-frontend-final/insurtech-frontend/.env.local` |
| 무엇이 들어있나 | Gemini API 키 + Azure Speech 키/리전/음성 |
| 자동 로드 | CRA 가 `npm start` 시 자동으로 읽음 |

**설정 절차:**
```bash
cp setup/frontend.env.local insurtech-frontend-final/insurtech-frontend/.env.local
# 그리고 .env.local 안의 placeholder 값들을 본인 키로 교체
```

키 발급:
- **Gemini**: https://aistudio.google.com (무료)
- **Azure Speech**: https://portal.azure.com → Speech 리소스 생성 (Free F0, 월 50만자 Neural 무료)
  1. Resource group + Region (Korea Central 권장) 선택, Pricing tier `F0` 로 생성
  2. 생성된 리소스 → 좌측 **Keys and Endpoint** → KEY 1 + Location 복사
  3. `.env.local` 의 `REACT_APP_AZURE_SPEECH_KEY` / `REACT_APP_AZURE_SPEECH_REGION` 에 붙여넣기

미설정 시 폴백:
- Gemini 미설정 → 시나리오·퀴즈·상담 분석이 mock 으로 동작
- Azure Speech 미설정 → 브라우저 Web Speech API (OS 기본 한국어 음성) 로 동작

### 2. 백엔드 로컬 프로파일
| 항목 | 값 |
|---|---|
| 템플릿 | [application-local.yml](application-local.yml) |
| 복사 위치 | `adjuster-system/src/main/resources/application-local.yml` |
| 무엇이 들어있나 | DB 접속정보 + AI API 키 + 시드 옵션 |
| 자동 로드 | `application.yml` 의 `spring.profiles.active: local` 설정으로 자동 적용 |

**설정 절차:**
```bash
cp setup/application-local.yml adjuster-system/src/main/resources/application-local.yml
# 그리고 application-local.yml 안의 db 비밀번호를 본인 환경에 맞게 수정
```

템플릿은 **두 가지 모드** 를 제공합니다:
- **옵션 A (기본)**: 로컬 MySQL 사용 — 운영과 동일한 DB 엔진
- **옵션 B (주석 처리됨)**: H2 in-memory — MySQL 설치 없이 즉시 실행. 매 부팅마다 초기화됨

H2 로 빠르게 띄우고 싶으면 application-local.yml 을 열어서 옵션 A 블록 주석 처리하고 옵션 B 의 주석을 풀면 됩니다.

---

## 주의사항

1. **이 setup/ 폴더의 파일들은 git 에 커밋해도 됩니다** — 모두 placeholder 라 진짜 시크릿이 들어있지 않음.
2. **복사 후 만들어진 `.env.local` / `application-local.yml` 은 절대 커밋하지 마세요** — `.gitignore` 가 이미 잡고 있긴 합니다.
3. 운영 시크릿(실제 API 키, DB 비밀번호)은 **Vercel/cloudtype 콘솔에서만** 관리.
4. 템플릿 파일을 수정해야 한다면 `setup/` 안의 것만 수정하고 placeholder 형태 유지.

---

## 빠른 점검

복사 후 다음 명령으로 두 서버를 띄울 수 있어야 합니다:

```bash
# 프론트
cd insurtech-frontend-final/insurtech-frontend
npm install
npm start
# → http://localhost:3000

# 백엔드 (별도 터미널)
cd adjuster-system
./gradlew.bat bootRun     # Windows
./gradlew bootRun         # macOS / Linux
# → http://localhost:8080
```

프론트의 `package.json` 에 `"proxy": "http://localhost:8080"` 가 있어서 `/api/*` 요청은 자동으로 백엔드로 라우팅됩니다.
