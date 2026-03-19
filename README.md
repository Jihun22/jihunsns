# 🖼️ JihunSNS

**JihunSNS**는 이미지 업로드, 사용자 인증, 닉네임 중복 확인 기능 등을 포함한 소셜 기반의 미니 SNS 프로젝트입니다.  
Next.js 15과 Prisma, PostgreSQL(Docker 기반)을 활용해 백엔드를 구성하였으며, 간단한 구조로 쉽게 확장 가능한 구조를 갖추고 있습니다.

---

## 🚀 기술 스택

| 구분       | 기술                                              |
| ---------- | ------------------------------------------------- |
| 프론트엔드 | Next.js 15 (App Router), TypeScript, Tailwind CSS |
| 백엔드     | Next.js API Route, Prisma ORM                     |
| DB         | PostgreSQL (Docker Compose 기반)                  |
| 인증       | Credentials + OAuth(Google·Naver·Kakao)           |
| 기타       | Docker, Prisma Studio, RESTful API                |

---

## 📸 주요 기능

- [x] 사용자 회원가입 & 로그인
- [x] 구글 / 네이버 / 카카오 OAuth 소셜 로그인
- [x] 닉네임 중복 검사 (`/api/user/check-nickname`)
- [x] 게시글 작성 (텍스트 + 이미지 업로드)
- [x] 이미지 업로드 (정적 디렉토리 `/public/uploads`)
- [x] 게시글 목록 / 상세 조회
- [x] Docker 기반 PostgreSQL 연동
- [x] Prisma Studio 데이터 관리 (`npx prisma studio`)

---

## 📂 프로젝트 구조

jihunsns/  
├── app/ # App Router 기반 페이지
│ └── page.tsx  
├── pages/api/ # API 라우트 (REST API)  
│ └── user/  
│ └── check-nickname.ts  
├── prisma/ # Prisma 스키마 및 마이그레이션  
│ └── schema.prisma  
├── public/uploads/ # 이미지 저장 경로  
├── lib/  
│ └── prisma.ts # Prisma Client 인스턴스  
├── docker-compose.yml # DB 실행용 설정  
└── .env # 환경 변수 설정

---

## ⚙️ 설치 및 실행

1. **레포지토리 클론**

   ```bash
   git clone https://github.com/Jihun22/jihunsns.git
   cd jihunsns

   ```

2. 환경변수 설정

   ```bash
   cp .env.example .env.local
   # 로컬 개발에 맞게 값들을 업데이트하세요.
   ```

   - 운영 배포 시에는 `.env.production` 파일을 생성해 동일한 키를 프로덕션 값으로 채워주세요.
   - 공통으로 사용하는 키: `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `BACKEND_URL`, `NEXT_PUBLIC_API_BASE_URL`, `NEXT_PUBLIC_OAUTH_CALLBACK_PATH`
   - 소셜 로그인은 `${BACKEND_URL}/oauth2/authorization/{provider}`로 리디렉션하며, `NEXT_PUBLIC_OAUTH_CALLBACK_PATH`(기본 `/oauth/callback`)로 되돌아온 뒤 `accessToken`/`refreshToken`을 쿼리스트링으로 전달해야 합니다.

### 🔐 소셜 로그인 흐름

1. `/login` 페이지에서 원하는 소셜 버튼을 클릭하면 `${NEXT_PUBLIC_API_BASE_URL}/oauth2/authorization/{provider}?redirect_uri=${ORIGIN}${NEXT_PUBLIC_OAUTH_CALLBACK_PATH}` 형태로 백엔드에 이동합니다.
2. 백엔드 OAuth 인증이 완료되면 `redirect_uri`로 다시 돌아오면서 `accessToken` (필수), `refreshToken` (선택), `next` (선택) 값을 쿼리스트링으로 포함합니다.
3. 프런트의 `/oauth/callback` 페이지는 토큰을 `localStorage`에 저장하고 `auth:updated` 이벤트를 발생시킨 후 홈으로 리디렉트합니다.

3. Docker로 postgreSql실행
   ```bash
    docker-compose up -d

   ```
4. 의존성 설치 후 서버 실행
   ```bash
   npm install
    npm run dev

   ```
5. Prisma 마이그레이션

```bash
 npx prisma migrate dev


6.Prisma Studio(DB관리 UI)
 npx prisma studio
```

---

## ☁️ Oracle Cloud Docker 배포

1. **환경 변수 준비**  
   ```bash
   cp .env.production.example .env.production
   ```
   - `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `NEXT_PUBLIC_API_BASE_URL`, `NEXT_PUBLIC_OAUTH_CALLBACK_PATH`, `DATABASE_URL` 등 값을 실제 도메인/백엔드 주소에 맞게 수정하세요.
   - `NEXT_PUBLIC_API_BASE_URL`/`BACKEND_URL`은 Oracle Cloud에 올려둔 백엔드 API 주소로 변경해야 합니다.

2. **Docker Compose 실행**  
   ```bash
   docker compose -f docker-compose.prod.yml up -d --build
   ```
   - `web` 서비스가 Next.js 앱을 빌드하고 3000번 포트를 노출합니다.
   - 이 프로덕션용 Compose 파일에는 DB가 포함되지 않으므로, OCI의 PostgreSQL 인스턴스 혹은 별도 서버에서 `DATABASE_URL`로 접근 가능해야 합니다.
   - 업로드 파일은 `uploads-data` 볼륨으로 OCI 인스턴스 디스크에 저장됩니다.

3. **마이그레이션/관리 작업(필요 시)**  
   ```bash
   docker compose -f docker-compose.prod.yml exec web npx prisma migrate deploy
   # 또는 API 서버 초기화/시드 명령 등
   ```

4. **방화벽/Load Balancer 설정**  
   - OCI 인스턴스 보안 목록에서 3000번(웹) 포트를 허용하고, 외부 DB를 사용한다면 해당 인스턴스에도 접근 허용 규칙을 추가하세요.
   - HTTPS를 적용하려면 OCI Load Balancer 혹은 Nginx Reverse Proxy를 활용해주세요.

이제 Oracle Cloud 인스턴스에서 `docker compose` 명령만으로 프런트/Next.js 웹앱을 배포하고, 준비해 둔 외부 DB에 연결할 수 있습니다.
