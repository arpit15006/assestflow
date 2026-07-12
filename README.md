# AssetFlow AI — Enterprise Asset & Resource Management System

AssetFlow AI is an enterprise-grade resource and asset management platform designed to track, schedule, maintain, and audit high-value enterprise resources. It features a robust TypeScript-driven React frontend and an Express REST API backend backed by a relational PostgreSQL database.

---

## 💡 Architectural Decisions & Engineering Philosophy

To ensure the platform is highly maintainable, type-safe, and ready to scale under load, the following architectural choices were made:

### 1. Unified Layered Design (Service-Repository Pattern)
The backend does not execute raw SQL queries inside route controllers. Instead, it enforces a strict **Controller-Service-Repository** division of labor:
* **Controllers** are responsible purely for HTTP request parsing, calling the Zod validator middleware, and returning standard JSON API envelopes.
* **Services** contain the core business rules (e.g., calculations, validation states, triggering email/socket notifications).
* **Repositories** interact directly with the database via Prisma ORM, consolidating all CRUD logic and complex query joins. This abstracts database implementation details away from business services.

### 2. Optimistic Rendering & State Cache Management (TanStack Query)
On the frontend, instead of relying on complex global states (like Redux) for network-derived data, the platform uses **TanStack Query (React Query)**:
* Server state is cached locally and synchronized using cache invalidation tags.
* When a user triggers an operation (e.g., allocating a device), the client invalidates the query keys (`["assets"]`, `["dashboard"]`), triggering background re-fetches to keep the dashboard numbers updated.

### 3. Bulletproof Cookie-Based JWT Session Management
Authenticated sessions are stored in HTTP-Only, Secure cookies (`access_token`) instead of localStorage to protect against Cross-Site Scripting (XSS) attacks. A silent sliding token renewal endpoint (`/auth/refresh`) runs in an Axios interceptor catch block, automatically refreshing expired sessions without logging out active users.

---

## 🗄️ Relational Database Design

The database schema is designed for relational consistency, referential integrity, and efficient indexing on query columns. 

```
  +--------------+          +-----------------+          +-----------------+
  |  Department  |          |      User       |          |  AssetCategory  |
  +-------+------+          +--------+--------+          +--------+--------+
          | 1                      1 |                            | 1
          |                          |                            |
          | N                        | N                          | N
  +-------v------+          +--------v--------+          +--------v--------+
  |    Asset     <----------+ AssetAllocation +---------->      Asset      |
  +-------+------+          +-----------------+          +--------+--------+
          | 1
          +-----------------+
          | N               | N
  +-------v------+  +-------v--------+
  |   Booking    |  |  Maint.Ticket  |
  +--------------+  +----------------+
```

### Key Models & Relationships:
1. **User & Department (N:1, 1:N)**: A user belongs to a single department, but a user can also manage one or more departments as a `DepartmentHead`.
2. **Department Hierarchy (Self-Relation)**: The `Department` model has a self-referencing relationship (`parentDepartmentId`) to support multi-tier organizational tree structures.
3. **Asset & AssetCategory (N:1)**: Every asset belongs to a category (e.g., Laptops, Meeting Rooms, Vehicles). Categories have a `fields` JSON column to accommodate flexible, category-specific spec sheets.
4. **Asset Custody & Allocations (1:N)**: Tracked via the `AssetAllocation` model, creating a historical ledger of which employee held custody of an asset, who authorized it (`allocatedById`), and when it was checked back in.
5. **Shared Resource Bookings (1:N)**: Links bookable assets (e.g. rooms) to users. Enforces status enums (`UPCOMING`, `ONGOING`, `COMPLETED`, `CANCELLED`).
6. **Maintenance & Repair Tickets (1:N)**: Logs asset incidents reported by employees, assigned to specific technician accounts, with historical resolution notes.
7. **Compliance Audit Ledger (1:N)**: The `AuditCycle` maps to multiple `AuditItem` verification items, locking inventory snapshots when marked completed.

---

## ⚡ Advanced Algorithms & Business Rules

### 1. Booking Collision Prevention Algorithm
To prevent double-booking meeting rooms or company vehicles, the backend runs a collision detection query before database insertion. It checks if the requested time range overlaps with any active (non-cancelled) bookings:

```typescript
const conflict = await prisma.booking.findFirst({
  where: {
    assetId,
    status: { in: ['UPCOMING', 'ONGOING'] },
    OR: [
      {
        startTime: { lt: requestedEndTime },
        endTime: { gt: requestedStartTime }
      }
    ]
  }
});
if (conflict) throw new Error('Booking conflicts with an existing reservation');
```
This mathematical range check `(Start_A < End_B) AND (End_A > Start_B)` ensures zero scheduling overlaps.

### 2. Scoped Dashboard Metrics Engine
Dashboard widgets query counts based on the active session role:
* **Admin**: Audits overall capital asset cost (`Decimal` precision summation) and active allocations count.
* **Department Head**: Automatically limits count calculations only to assets, employees, and maintenance tickets matching their department ID.
* **Technician**: Queries lists where `technicianId` matches their user ID, filtered by active repair statuses.

---

## 💻 Setup, Seeding & Execution

### 1. Prerequisite Installations
* Node.js (v18.x or v20.x+)
* PostgreSQL Database instance

---

### 2. Backend API Setup
1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. Configure environment file (`backend/.env`):
   ```env
   DATABASE_URL="postgres://<USER>:<PASSWORD>@<HOST>:<PORT>/<DATABASE>"
   JWT_SECRET="generate_a_random_jwt_hash"
   JWT_REFRESH_SECRET="generate_a_random_jwt_refresh_hash"
   JWT_ACCESS_EXPIRES="15m"
   JWT_REFRESH_EXPIRES="7d"
   PORT=3001
   FRONTEND_URL="http://localhost:3000"
   SOCKET_CORS_URL="http://localhost:3000"
   ```
4. Generate the database client schema:
   ```bash
   npx prisma generate
   ```
5. Apply database migrations:
   ```bash
   npx prisma migrate dev --name init
   ```
6. Seed database with rich dummy logs & accounts:
   ```bash
   npx tsx prisma/seed.ts
   ```
7. Start the dev watch server:
   ```bash
   npm run dev
   ```

---

### 3. Frontend Web App Setup
1. Navigate to the frontend folder:
   ```bash
   cd ../frontend
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. Configure local environment (`frontend/.env.local`):
   ```env
   NEXT_PUBLIC_API_URL="http://localhost:3001/api/v1"
   NEXT_PUBLIC_SOCKET_URL="http://localhost:3001"
   ```
4. Start the next development server:
   ```bash
   npm run dev
   ```
5. Open `http://localhost:3000` to interact with the platform.

---

## 🛠️ Verification & Compile Checks
Both directories are configured with strict compiler flags (`noImplicitAny: true`, etc.). 

* **To build and verify the backend API**:
  ```bash
  cd backend && npm run build
  ```
* **To build and verify the frontend Next.js bundles**:
  ```bash
  cd frontend && npm run build
  ```
Both builds compile cleanly with **0 errors**.
