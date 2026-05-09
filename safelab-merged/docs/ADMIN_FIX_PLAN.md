# `/admin` 흰 화면 해결 플랜

배포본 https://safelab-eight.vercel.app/admin/login 에서 `admin / admin1234` 로그인 후 `/admin` 으로 이동하면 흰 화면이 뜨는 문제를 해결한다.

---

## 1. 문제 요약

| 항목 | 값 |
|---|---|
| 증상 | `/admin` 진입 시 흰 화면 (DOM 비어 있음) |
| 발생 환경 | Vercel 배포본만 (로컬 정상) |
| 직접 원인 | `AdminDashboardPage` 렌더 중 `TypeError` 로 React 트리 언마운트 |
| 근본 원인 | `vercel.json` 의 catch-all rewrite 가 `/api/*` 까지 삼켜 axios 가 HTML 을 JSON 인 양 받음 + `AdminDashboardPage` 가 응답 형태를 검증하지 않음 |

## 2. 근본 원인 (3-layer 합작)

```
[layer 1] vercel.json
    /(.*) → /index.html      ← /api/safety/admin/progress 도 같이 잡힘
                ↓
        200 OK + HTML 응답
                ↓
[layer 2] api.js (baseURL: '/api') + axios 기본 transformResponse
    JSON.parse 실패 → res.data = HTML 문자열
                ↓
        axios 는 success 분기 (.then) 호출
                ↓
[layer 3] AdminDashboardPage
    setServerData(res.data)              ← string 저장됨
    serverData ? {...} : ADMIN_KPI       ← string 도 truthy → 깨진 객체 분기
    kpi.scenariosCompleted.toLocaleString()
                ↓
        TypeError: Cannot read properties of undefined
                ↓
        React 가 트리 언마운트 → 흰 화면
```

## 3. 해결 전략

두 layer 를 모두 고친다. 어느 한쪽만 고쳐도 흰 화면은 사라지지만, 양쪽 다 고쳐야 견고하다.

- **A. Routing 레이어 (vercel.json)** — `/api/*` 를 SPA 리라이트에서 제외하고 운영 백엔드(cloudtype)로 프록시.
- **B. 방어 레이어 (AdminDashboardPage)** — 응답 형태를 검증하고 안전하게 mock 폴백.

A 만 고치면 백엔드가 죽었을 때 다시 깨질 수 있고, B 만 고치면 백엔드 호출이 영영 mock 으로만 동작한다. 그래서 둘 다 고친다.

---

## 4. 단계별 작업

### Step 1. vercel.json 수정 — `/api/*` 프록시 분기

**파일:** `insurtech-frontend-final/insurtech-frontend/vercel.json`

**현재:**
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

**변경 후:**
```json
{
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "https://port-0-safelab-mon2359z1706e4ba.sel3.cloudtype.app/api/$1"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

**작동 원리**
- Vercel 의 rewrites 는 위에서 아래로 매칭. `/api/...` 가 먼저 잡혀 cloudtype 으로 프록시되고, 그 외만 SPA fallback.
- 브라우저 입장에서 `/api/...` 가 같은 origin 으로 보이므로 **CORS 처리 불필요**.
- 프론트의 `baseURL: '/api'` 코드는 그대로 두면 됨.

**리스크/주의**
- cloudtype 백엔드가 다운되면 5xx 가 그대로 프론트로 전달됨 → axios `.catch()` 가 발화 → 기존 mock 폴백 동작 → 흰 화면은 안 뜸. (Step 2 가 추가 보호선.)
- cloudtype URL 이 바뀌면 vercel.json 도 같이 수정 필요. 변동성 있다면 Step 4 의 환경변수화 고려.

### Step 2. AdminDashboardPage 방어 코드

**파일:** `insurtech-frontend-final/insurtech-frontend/src/pages/AdminDashboardPage.js`

**현재 (33-46행):**
```js
safetyApi.getAdminProgress()
  .then((res) => {
    if (!alive) return;
    setServerData(res.data);
    setServerStatus('live');
  })
  .catch(() => {
    if (!alive) return;
    setServerStatus('offline');
  });
```

**변경 후:**
```js
safetyApi.getAdminProgress()
  .then((res) => {
    if (!alive) return;
    const data = res.data;
    // HTML 문자열이나 형태 안 맞는 응답 거부 — completionRate 같은 핵심 키가 있어야 정상으로 간주
    const looksValid = data
      && typeof data === 'object'
      && typeof data.completionRate === 'number';
    if (!looksValid) {
      setServerStatus('offline');
      return;
    }
    setServerData(data);
    setServerStatus('live');
  })
  .catch(() => {
    if (!alive) return;
    setServerStatus('offline');
  });
```

**현재 (54-61행):**
```js
const kpi = serverData ? {
  totalStudents: serverData.totalStudents,
  enrolledStudents: serverData.enrolledStudents,
  completionRate: serverData.completionRate,
  pendingStudents: serverData.pendingStudents,
  recentIncidents7d: serverData.recentIncidents7d,
  scenariosCompleted: serverData.scenariosCompleted,
} : ADMIN_KPI;
```

**변경 후 (mock 키로 디폴트 백업):**
```js
const kpi = serverData ? {
  totalStudents:       serverData.totalStudents       ?? ADMIN_KPI.totalStudents,
  enrolledStudents:    serverData.enrolledStudents    ?? ADMIN_KPI.enrolledStudents,
  completionRate:      serverData.completionRate      ?? ADMIN_KPI.completionRate,
  pendingStudents:     serverData.pendingStudents     ?? ADMIN_KPI.pendingStudents,
  recentIncidents7d:   serverData.recentIncidents7d   ?? ADMIN_KPI.recentIncidents7d,
  scenariosCompleted:  serverData.scenariosCompleted  ?? ADMIN_KPI.scenariosCompleted,
} : ADMIN_KPI;
```

이렇게 하면 응답 일부 필드가 빠져도 mock 값으로 채워져 `.toLocaleString()` 등 메서드 호출이 안전해진다.

**왜 두 군데 다 고치나**
- 첫 번째(검증) 가 1차 방어선 — 비정상 응답을 아예 거부.
- 두 번째(폴백) 가 2차 방어선 — 부분적으로 깨진 정상 JSON(예: 백엔드가 일부 필드만 반환)에도 안전.

### Step 3. 로컬 동작 확인

```powershell
cd "c:/Users/youns/바탕 화면/ai_cap/safelab/insurtech-frontend-final/insurtech-frontend"
npm start
```

체크포인트:
- `http://localhost:3000/admin/login` → `admin / admin1234` 로그인
- `/admin` 진입 시 KPI 카드들이 정상 렌더 (백엔드 미가동 시: 우측 상단 노란 "오프라인 모드" 배지 + ADMIN_KPI mock 수치)
- 백엔드(`adjuster-system`) 가동 후엔 녹색 "백엔드 연동 중" 배지로 전환 확인
  ```powershell
  cd "c:/Users/youns/바탕 화면/ai_cap/safelab/adjuster-system"
  ./gradlew.bat bootRun
  ```

### Step 4. Vercel 배포 및 검증

```powershell
git add insurtech-frontend-final/insurtech-frontend/vercel.json `
        insurtech-frontend-final/insurtech-frontend/src/pages/AdminDashboardPage.js
git commit -m "fix: prevent admin dashboard white screen on Vercel"
git push
```

자동 배포 대기 후 https://safelab-eight.vercel.app/admin/login 에서 검증:

- [ ] `admin / admin1234` 로그인 → `/admin` 진입 시 화면이 정상 렌더
- [ ] DevTools → Network 탭 → `/api/safety/admin/progress` 응답이 JSON (HTML 아님)
- [ ] DevTools → Console 에 `TypeError` 없음
- [ ] 우측 상단 배지가 cloudtype 백엔드 상태에 따라 🟢 또는 🟡 (둘 다 OK, 흰 화면 아니면 됨)

---

## 5. 검증 체크리스트 (배포 후)

| 시나리오 | 기대 동작 |
|---|---|
| cloudtype 백엔드 정상 + 데이터 있음 | KPI = 백엔드 값, 배지 🟢 |
| cloudtype 백엔드 정상 + 응답 형태 다름 | KPI = ADMIN_KPI mock, 배지 🟡, 콘솔 에러 없음 |
| cloudtype 백엔드 다운/5xx | KPI = ADMIN_KPI mock, 배지 🟡, 흰 화면 없음 |
| cloudtype URL 자체 변경/사라짐 | KPI = ADMIN_KPI mock, 배지 🟡, 흰 화면 없음 |

핵심: **어떤 백엔드 상태에서도 흰 화면이 나오지 않아야 함.**

---

## 6. 선택 작업 (시간 여유 있을 때)

### Option A. baseURL 환경변수화

cloudtype URL 을 vercel.json 에 박는 대신 `REACT_APP_API_BASE_URL` 환경변수로 분리.

- `insurtech-frontend-final/insurtech-frontend/src/services/api.js`
  ```js
  const api = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL || '/api',
    headers: { 'Content-Type': 'application/json' },
  });
  ```
- Vercel: Project Settings → Environment Variables 에 `REACT_APP_API_BASE_URL=https://port-0-safelab-...cloudtype.app/api` 추가
- 이 경우 vercel.json rewrite 는 원복하거나 그대로 둠 (env 가 우선됨)
- **단점:** 백엔드 CORS 에 Vercel 도메인이 명시돼야 함 → 이미 [SecurityConfig.java:89](adjuster-system/src/main/java/com/adjuster/system/config/SecurityConfig.java#L89) 에 `https://safelab-eight.vercel.app` 등록되어 있어 OK. 단 PR/preview 배포 도메인은 제외.

→ Step 1 의 vercel.json rewrite 가 더 단순하고 안전. Option A 는 권장하지 않음.

### Option B. axios 응답 검증 강화

응답 Content-Type 이 `text/html` 이면 throw 하도록 axios interceptor 추가.

- `services/api.js`
  ```js
  api.interceptors.response.use((response) => {
    const ct = response.headers['content-type'] || '';
    if (ct.includes('text/html')) {
      return Promise.reject(new Error('Backend returned HTML — likely SPA fallback'));
    }
    return response;
  });
  ```

→ 모든 API 호출에 일관된 보호선. Step 1 + Step 2 만으로도 충분하지만, 향후 비슷한 함정 방지용으로 유용.

---

## 7. 롤백 플랜

문제 발생 시 즉시 직전 커밋으로 돌리기:

```powershell
git revert HEAD
git push
```

- vercel.json 만 되돌리면 흰 화면이 다시 뜨지만, AdminDashboardPage 의 방어 코드는 코드만 봐서는 무해하므로 부분 롤백도 가능.
- cloudtype 의 cors/도메인 설정은 이번 작업에서 건드리지 않으므로 백엔드 측 롤백은 불필요.

---

## 8. 후속 과제 (이 플랜 범위 외)

이번엔 안 다루지만 같은 뿌리(`/api/*` SPA catch-all + dev-only proxy)에서 파생된 다른 이슈:

- 🟠 **`/insurance/room/:roomId` WebRTC** — `useWebRTC.js:3` 의 `ws://localhost:8080/ws/signal` 하드코딩. Vercel HTTPS 에서 mixed content 차단 + 호스트 부재로 시그널링 영구 실패. → 별도 PR 로 `wss://` 운영 주소 + 환경변수화.
- 🟡 **`SafetyQuizPage.recordAttempt`** — 결과 미사용이라 UI 영향 없지만 백엔드 통계가 안 쌓임. 이번 Step 1 (vercel.json 수정) 으로 자동 해결됨.

---

## 9. 작업 시간 예상

| 단계 | 예상 시간 |
|---|---|
| Step 1 (vercel.json) | 5분 |
| Step 2 (AdminDashboardPage 방어) | 10분 |
| Step 3 (로컬 검증) | 10분 |
| Step 4 (배포 + 검증) | 10분 |
| **합계** | **~35분** |
