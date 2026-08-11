# Doctor Tracker — REST API Backend

An enterprise-grade, service-oriented Node.js/Express backend for managing doctors, patients, and clinical statistics built with Prisma ORM and MongoDB.

## 🚀 Features

- **Service-Oriented Architecture**: Clean separation of concerns with thin controllers delegating to service classes (`auth.service.ts`, `doctor.service.ts`, `patient.service.ts`, `dashboard.service.ts`).
- **Prisma & MongoDB**: Document-based ORM schema with explicitly indexed fields (`@@index`) for high-performance regex searching and filtering.
- **Secure Authentication**: JWT session management stored in `httpOnly` cookies with automatic default admin seeding.
- **Robust Middleware**: Global error handling, Zod schema validation, CORS with credentials, and rate limiting.
- **Aggregation Engine**: Optimized MongoDB database-level aggregations (`groupBy`, 30-day intake trend calculations).

## 🛠️ Technical Stack

- **Runtime**: Node.js v23+, TypeScript v5
- **Framework**: Express.js v4
- **ORM**: Prisma v6 (MongoDB provider)
- **Validation**: Zod
- **Security**: JWT, BcryptJS, Helmet, Cookie Parser, Express Rate Limit
- **Dev Runner**: TSX (`tsx watch src/server.ts`)

## 🔑 Technical Decisions

1. **Prisma ORM over Mongoose**:
   - Provides strict compile-time TypeScript typing directly generated from the schema.
   - Simplified relation mapping (`@relation`) and single-query nested operations.

2. **httpOnly Cookie Authentication**:
   - Prevents XSS token theft compared to client-side `localStorage`.
   - Native compatibility with Next.js 16 `proxy.ts` server-side route guarding.

3. **Thin Controllers & Single Responsibility**:
   - Every file maintains a strict <200 line limit. Controllers only extract request parameters and pass execution to service classes.

## 🚦 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Configure environment variables (.env)
DATABASE_URL="mongodb+srv://..."
JWT_SECRET="your-super-secret-key"
CLIENT_URL="http://localhost:3000"
PORT=5000

# 3. Generate Prisma Client & Sync DB
npx prisma generate
npx prisma db push

# 4. Start Development Server
npm run dev
```

Default Admin Account seeded automatically on server boot:
- **Email**: `admin@doctortracker.com`
- **Password**: `admin123`
