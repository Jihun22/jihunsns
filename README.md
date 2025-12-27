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
| 인증       | Credentials 기반 로그인                           |
| 기타       | Docker, Prisma Studio, RESTful API                |

---

## 📸 주요 기능

- [x] 사용자 회원가입 & 로그인
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
   - 공통으로 사용하는 키: `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `BACKEND_URL`, `NEXT_PUBLIC_API_BASE_URL`

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
