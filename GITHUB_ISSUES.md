# GitHub Issues - CareHub

## Overview
This document tracks all issues, bugs, and feature requests for the CareHub project in sequential order.

---

## Issue #1: Project Setup & Database Schema

**Status:** ✅ IMPLEMENTED

**Category:** Infrastructure

**Description:**
Initial project setup with NestJS, Prisma, PostgreSQL, and Docker configuration.

**Requirements:**
- ✅ Initialize NestJS project
- ✅ Configure Prisma ORM
- ✅ Create database schema (Users, Cuidadores, Pacientes, Plantões)
- ✅ Setup Docker Compose for PostgreSQL
- ✅ Create seed data

**Files Created:**
- `backend/prisma/schema.prisma`
- `backend/docker-compose.yml`
- `backend/.env`

---

## Issue #2: Authentication Module (Login)

**Status:** ✅ IMPLEMENTED

**Category:** Feature Implementation

**Description:**
Implement JWT-based authentication system with login endpoint.

**Requirements:**
- ✅ Create AuthModule, AuthService, AuthController
- ✅ Implement JWT strategy with Passport
- ✅ Create login endpoint: `POST /auth/login`
- ✅ Password hashing with bcrypt
- ✅ JWT token generation

**Files Created:**
- `backend/src/auth/auth.module.ts`
- `backend/src/auth/auth.service.ts`
- `backend/src/auth/auth.controller.ts`
- `backend/src/auth/strategies/jwt.strategy.ts`
- `backend/src/auth/guards/jwt-auth.guard.ts`

---

## Issue #3: Users Module

**Status:** ✅ IMPLEMENTED

**Category:** Feature Implementation

**Description:**
Create Users module to manage user accounts.

**Requirements:**
- ✅ Create UsersModule, UsersService
- ✅ Implement findByEmail method
- ✅ Implement create method with password hashing

**Files Created:**
- `backend/src/users/users.module.ts`
- `backend/src/users/users.service.ts`

---

## Issue #4: Role-Based Access Control (RBAC)

**Status:** ✅ IMPLEMENTED

**Category:** Security

**Description:**
Implement role-based access control with guards and decorators.

**Requirements:**
- ✅ Create RolesGuard
- ✅ Create @Roles decorator
- ✅ Protect endpoints by role (ADMIN, CUIDADOR, FAMILIAR)

**Files Created:**
- `backend/src/auth/guards/roles.guard.ts`
- `backend/src/auth/decorators/roles.decorator.ts`

---

## Issue #5: Cuidadores (Caregivers) Module

**Status:** ✅ IMPLEMENTED

**Category:** Feature Implementation

**Description:**
Create module to manage caregivers with full CRUD operations.

**Requirements:**
- ✅ Create CuidadoresModule, Service, Controller
- ✅ Implement endpoints: POST, GET, GET/:id
- ✅ Admin-only creation
- ✅ Create CuidadorDetalhes relationship

**Files Created:**
- `backend/src/cuidadores/cuidadores.module.ts`
- `backend/src/cuidadores/cuidadores.service.ts`
- `backend/src/cuidadores/cuidadores.controller.ts`
- `backend/src/cuidadores/dto/create-cuidador.dto.ts`

---

## Issue #6: Pacientes (Patients) Module

**Status:** ✅ IMPLEMENTED

**Category:** Feature Implementation

**Description:**
Create module to manage patients with CRUD operations.

**Requirements:**
- ✅ Create PacientesModule, Service, Controller
- ✅ Implement endpoints: POST, GET, GET/:id
- ✅ Link patients to family members

**Files Created:**
- `backend/src/pacientes/pacientes.module.ts`
- `backend/src/pacientes/pacientes.service.ts`
- `backend/src/pacientes/pacientes.controller.ts`
- `backend/src/pacientes/dto/pacientes.dto.ts`

---

## Issue #7: Plantões (Shifts) Module

**Status:** ✅ IMPLEMENTED

**Category:** Feature Implementation

**Description:**
Create module to manage caregiver shifts with approval workflow.

**Requirements:**
- ✅ Create PlantoesModule, Service, Controller
- ✅ Implement endpoints: POST, GET, GET/:id, PATCH/:id/status
- ✅ Status workflow: PENDENTE → APROVADO/REJEITADO
- ✅ Calculate worked hours automatically

**Files Created:**
- `backend/src/plantoes/plantoes.module.ts`
- `backend/src/plantoes/plantoes.service.ts`
- `backend/src/plantoes/plantoes.controller.ts`
- `backend/src/plantoes/dto/create-plantao.dto.ts`

**Bug Fixes:**
- ✅ Fixed cuidadorId resolution (Issue #11)

---

## Issue #8: Database Module & Service

**Status:** ✅ IMPLEMENTED

**Category:** Infrastructure

**Description:**
Create centralized database service for Prisma client management.

**Requirements:**
- ✅ Create DatabaseModule
- ✅ Create DatabaseService with Prisma client
- ✅ Export for use across modules

**Files Created:**
- `backend/src/database/database.module.ts`
- `backend/src/database/database.service.ts`

---

## Issue #9: Seed Data for Testing

**Status:** ✅ IMPLEMENTED

**Category:** Development Tools

**Description:**
Create seed script to populate database with test data.

**Requirements:**
- ✅ Create admin user
- ✅ Create sample caregivers
- ✅ Create sample patients
- ✅ Create sample shifts

**Files Created:**
- `backend/prisma/seed.ts`

---

## Issue #10: Docker Environment Setup

**Status:** ✅ IMPLEMENTED

**Category:** Infrastructure

**Description:**
Configure Docker for local development with PostgreSQL.

**Requirements:**
- ✅ Create docker-compose.yml
- ✅ Configure PostgreSQL container
- ✅ Setup environment variables
- ✅ Port mapping (5433:5432)

**Files Created:**
- `backend/docker-compose.yml`

---

## Issue #11: Fix Shift Creation Bug (CuidadorId)

**Status:** ✅ FIXED

**Category:** Bug Fix

**Description:**
Fixed internal server error when creating shifts due to incorrect cuidadorId handling.

**Root Cause:**
PlantoesService expected CuidadorDetalhes.id but received User.id.

**Solution:**
Modified PlantoesService.create() to resolve CuidadorDetalhes from userId.

**Files Modified:**
- `backend/src/plantoes/plantoes.service.ts`

---

## Issue #12: Environment Configuration

**Status:** ✅ IMPLEMENTED

**Category:** Configuration

**Description:**
Setup environment variables for database, JWT, and application config.

**Requirements:**
- ✅ DATABASE_URL configuration
- ✅ JWT_SECRET and JWT_EXPIRES_IN
- ✅ PORT configuration

**Files Created:**
- `backend/.env`
- `backend/.env.example`

---

## Issue #13: Swagger/OpenAPI Documentation

**Status:** ✅ IMPLEMENTED

**Category:** Documentation

**Description:**
Integrate Swagger for interactive API documentation and testing.

**Requirements:**
- ✅ Install @nestjs/swagger
- ✅ Configure SwaggerModule in main.ts
- ✅ Add @ApiTags, @ApiOperation, @ApiResponse decorators
- ✅ Add @ApiBearerAuth for JWT endpoints
- ✅ Document all DTOs with @ApiProperty

**Files Modified:**
- `backend/src/main.ts`
- `backend/src/auth/auth.controller.ts`
- `backend/src/auth/dto/login.dto.ts`
- `backend/src/cuidadores/cuidadores.controller.ts`
- `backend/src/cuidadores/dto/create-cuidador.dto.ts`
- `backend/src/pacientes/pacientes.controller.ts`
- `backend/src/pacientes/dto/pacientes.dto.ts`
- `backend/src/plantoes/plantoes.controller.ts`
- `backend/src/plantoes/dto/create-plantao.dto.ts`

**Access:** `http://localhost:3000/api`

---

## Issue #14: Unified Self-Registration & User Approval Workflow

**Status:** ✅ IMPLEMENTED

**Category:** Feature Implementation / Security Enhancement

**Branch:** `feat/auth-register`

**Priority:** P0 - Critical

**Sprint:** Week 3

---

### 📋 **Business Context**

Currently, the CareHub system requires an administrator to manually create all user accounts (caregivers and family members). This creates a bottleneck and prevents the platform from scaling as a "gig economy" marketplace for healthcare services.

**Goal**: Transform CareHub into a self-service platform where:
- Caregivers can register themselves and wait for admin approval
- Family members can create accounts to manage their patients
- Admins maintain control through an approval workflow
- Security is maintained by blocking unapproved users from accessing the system

**Business Impact**:
- ✅ Faster onboarding (no admin bottleneck)
- ✅ Scalability (hundreds of caregivers can register)
- ✅ Quality control (admin reviews before activation)
- ✅ Compliance (verified identities before service delivery)

---

### 🎯 **Technical Requirements**

#### **1. Public Registration Endpoint**
- **Route**: `POST /auth/register`
- **Authentication**: None (public access)
- **Input**: `RegisterDto` (Nome, Email, Senha, CPF, Tipo)
- **Validation**:
  - Email must be unique
  - CPF must be unique
  - Password minimum 6 characters
  - Tipo must be `CUIDADOR` or `FAMILIAR` (not `ADMIN`)
- **Behavior**:
  - Hash password with bcrypt
  - Create user with `status = PENDENTE`
  - Return user data (without password)
  - Return HTTP 201 Created

#### **2. Admin Approval Endpoints**
- **Route**: `PATCH /users/:id/approve`
- **Authentication**: JWT Bearer Token (Admin only)
- **Behavior**: Change user status to `APROVADO`

- **Route**: `PATCH /users/:id/reject`
- **Authentication**: JWT Bearer Token (Admin only)
- **Behavior**: Change user status to `REJEITADO`

- **Route**: `GET /users?status=PENDENTE`
- **Authentication**: JWT Bearer Token (Admin only)
- **Behavior**: List all users with specified status

#### **3. Login Restriction**
- **Modification**: `AuthService.validateUser()`
- **Behavior**: Only users with `status = APROVADO` can login
- **Security**: PENDENTE and REJEITADO users receive "Invalid credentials" error

---

### 🛠️ **Implementation Plan**

**Step 1**: Create `RegisterDto`
- File: `src/auth/dto/register.dto.ts`
- Validators: `@IsEmail`, `@IsNotEmpty`, `@MinLength`, `@IsEnum`
- Swagger: `@ApiProperty` decorators

**Step 2**: Implement `AuthService.register()`
- Check email uniqueness
- Prevent ADMIN creation
- Hash password
- Create user with PENDENTE status

**Step 3**: Expose `POST /auth/register`
- File: `src/auth/auth.controller.ts`
- Public endpoint (no guards)
- Swagger documentation

**Step 4**: Create `UsersController`
- File: `src/users/users.controller.ts`
- Methods: `findAll()`, `approveUser()`, `rejectUser()`
- Guards: `@UseGuards(JwtAuthGuard, RolesGuard)`, `@Roles(ADMIN)`

**Step 5**: Extend `UsersService`
- Methods: `findAll(status?)`, `updateStatus(id, status)`

**Step 6**: Block PENDENTE login
- Modify: `AuthService.validateUser()`
- Add status check before returning user

---

### ✅ **Acceptance Criteria**

- [x] A visitor can register at `/auth/register` without authentication
- [x] Registration creates user with `status = PENDENTE`
- [x] Email and CPF must be unique (409 Conflict if duplicate)
- [x] Cannot create ADMIN via public registration (400 Bad Request)
- [x] PENDENTE users cannot login (401 Unauthorized)
- [x] Admin can list users by status (`GET /users?status=PENDENTE`)
- [x] Admin can approve users (`PATCH /users/:id/approve`)
- [x] Admin can reject users (`PATCH /users/:id/reject`)
- [x] APROVADO users can login successfully
- [x] REJEITADO users cannot login
- [x] All endpoints documented in Swagger
- [x] Password is hashed (never stored in plain text)

---

### 🧪 **Testing Checklist**

- [ ] Register new caregiver via Swagger
- [ ] Verify user created with PENDENTE status
- [ ] Attempt login with PENDENTE user (should fail)
- [ ] Login as admin
- [ ] List pending users
- [ ] Approve the caregiver
- [ ] Login with approved caregiver (should succeed)
- [ ] Test email uniqueness validation
- [ ] Test ADMIN creation prevention

---

### 📦 **Deliverables**

- [x] `src/auth/dto/register.dto.ts` - RegisterDto with validation
- [x] `src/auth/auth.service.ts` - register() method
- [x] `src/auth/auth.controller.ts` - POST /auth/register endpoint
- [x] `src/users/users.controller.ts` - Admin approval endpoints
- [x] `src/users/users.service.ts` - findAll() and updateStatus() methods
- [x] `src/users/users.module.ts` - UsersController registration
- [x] Updated Swagger documentation
- [x] Manual testing completed

---

### 🔗 **Related Issues**

- Depends on: Issue #2 (Authentication Module)
- Depends on: Issue #3 (Users Module)
- Blocks: Issue #15 (Payments Module)
- Related: Future email verification feature
- Related: Future admin notification system

---

## Issue #15: Payments Module & Payment Processing

**Status:** ✅ IMPLEMENTED

**Category:** Feature Implementation / Financial Management

**Priority:** P1 - High

**Sprint:** Week 4

---

### 📋 **Business Context**

CareHub operates as a gig economy platform where caregivers are paid per shift worked. The system needed an automated payment system to replace manual calculations.

**Goal**: Build a complete payment management system that:
- Automatically calculates caregiver payroll based on approved shifts
- Tracks payment status (PENDENTE, PROCESSADO, PAID)
- Gives admins full control over payment processing
- Provides transparent payment reporting

**Business Impact**:
- ✅ Eliminates manual payroll errors
- ✅ Faster payment processing
- ✅ Full audit trail of all payments
- ✅ Caregiver trust and retention
- ✅ Family billing transparency

---

### 🎯 **Technical Implementation**

#### **1. Payment Data Model (Pagamento)**
- `id` (UUID) - Primary key
- `cuidadorId` (FK → CuidadorDetalhes) - Caregiver reference
- `mes` (String YYYY-MM) - Payment month
- `totalHoras` (Float) - Aggregated hours from approved shifts
- `valorTotal` (Decimal) - R$ 20/hour × totalHoras
- `status` (Enum: PENDENTE, PROCESSADO, PAID) - Payment status
- `dataPagamento` (DateTime?) - Date payment was made
- `numeroComprovante` (String?) - Payment proof/receipt number
- `criadoEm` (DateTime) - Record creation timestamp
- `atualizadoEm` (DateTime) - Record update timestamp

Unique constraint: `(cuidadorId, mes)` — one payment per caregiver per month

#### **2. Payment Processing Workflow**
```
PENDENTE → PROCESSADO → PAID
  ↓          ↓           ↓
Draft    Ready for   Confirmed
         Transfer    with Proof
```

#### **3. Admin Endpoints**
- `POST /pagamentos/calcular-mes` - Calculate/aggregate payments from approved shifts
- `GET /pagamentos` - List payments with filters (mes, status, cuidadorId)
- `GET /pagamentos/:id` - Get payment details
- `GET /pagamentos/relatorio/:mes` - Financial report for month
- `PATCH /pagamentos/:id/processar` - Mark as PROCESSADO
- `PATCH /pagamentos/:id/confirmar-pagamento` - Confirm as PAID with proof
- `DELETE /pagamentos/:id` - Delete only PENDENTE payments

#### **4. Payment Calculation Logic**
```
Algorithm:
1. Find all Plantao records where:
   - status = APROVADO
   - dataInicio is in specified month
   - cuidadorId is not null
2. Group by cuidadorId
3. Sum horasTrabalhadas per caregiver
4. Calculate valorTotal = totalHoras × R$20
5. Create/Update Pagamento record for (cuidadorId, mes)
```

#### **5. Financial Reports**
Monthly summary includes:
- Total caregivers processed
- Total hours paid
- Total amount paid
- Breakdown by caregiver (nome, email, hours, amount)
- Count by status (PENDENTE, PROCESSADO, PAID)

---

### ✅ **Acceptance Criteria**

- [x] Pagamento model created in database with proper relations
- [x] Calculate monthly payments from approved shifts via `POST /pagamentos/calcular-mes`
- [x] Aggregation logic: sums hours, multiplies by R$20
- [x] Admin can list payments filtered by month/status/caregiver
- [x] Admin can mark payment as PROCESSADO (`PATCH /pagamentos/:id/processar`)
- [x] Admin can confirm payment with proof (`PATCH /pagamentos/:id/confirmar-pagamento`)
- [x] Financial report endpoint generates monthly summaries (`GET /pagamentos/relatorio/:mes`)
- [x] Only PENDENTE payments can be deleted
- [x] Cannot transition to invalid states (e.g., PAID → PENDENTE)
- [x] All endpoints documented in Swagger with examples

### 📦 **Files Created**

- `backend/prisma/schema.prisma` - Added Pagamento model and PagamentoStatus enum
- `backend/src/pagamentos/pagamentos.module.ts` - Module configuration
- `backend/src/pagamentos/pagamentos.service.ts` - Payment service with calculation logic
- `backend/src/pagamentos/pagamentos.controller.ts` - REST API endpoints (6 endpoints)
- `backend/src/pagamentos/dto/calcular-mes.dto.ts` - DTO for month calculation
- `backend/src/pagamentos/dto/confirmar-pagamento.dto.ts` - DTO for payment confirmation
- `backend/src/app.module.ts` - Updated imports

### 🚀 **Key Features Implemented**

1. **Payment Calculation Engine**
   - Aggregates approved plantões by caregiver per month
   - Automatic computation: R$ 20/hour (fixed rate)
   - Creates/updates payment records
   - Validates month format (YYYY-MM)

2. **Payment Workflow States**
   - PENDENTE: New payment, awaiting admin review
   - PROCESSADO: Ready for bank transfer/payout system
   - PAID: Transferred with confirmation/receipt

3. **Status Transition Guards**
   - Only PENDENTE → PROCESSADO allowed
   - Only PROCESSADO → PAID allowed
   - Prevents invalid transitions with clear error messages

4. **Financial Reporting**
   - Monthly summaries with totals
   - Breakdown by caregiver (name, email, hours, amount)
   - Status distribution (count by state)
   - Proof tracking (payment date, receipt number)

5. **Admin Controls**
   - Filter payments by month (YYYY-MM format)
   - Filter payments by status (PENDENTE/PROCESSADO/PAID)
   - Filter payments by specific caregiver
   - Delete only PENDENTE payments (safety guard)

6. **Error Handling**
   - 400 Bad Request for invalid month format
   - 400 Bad Request when no shifts found for month
   - 400 Bad Request for invalid status transitions
   - 404 Not Found for non-existent payments
   - 409 Conflict prevented through business logic

### 🔗 **Related Issues**

- Depends on: Issue #7 (Plantões Module) ✅ Completed
- Depends on: Issue #5 (Cuidadores Module) ✅ Completed
- Depends on: Issue #14 (Self-Registration) ✅ Completed
- Blocks: Issue #16 (Reports & Analytics Module)
- Future integration: Pix/bank transfers, email notifications

---

## Summary Statistics

| Status | Count |
|--------|-------|
| ✅ Implemented | 19 |
| 🚧 In Progress | 1 |
| 📋 Pending | 0 |
| **Total** | **20** |

---

## Issue #16: Reports & Analytics Module

**Status:** ✅ IMPLEMENTED

**Category:** Feature Implementation / Business Intelligence

**Priority:** P2 - Medium

**Sprint:** Week 5

---

### 📋 **Business Context**

While CareHub has basic list views and a monthly payment report, the administration needs a centralized way to view the platform's performance, and users (caregivers and families) need better visibility into their activities.

**Goal**: Build a dedicated reporting service that provides:
- High-level metrics for the Admin dashboard
- Performance tracking for caregivers
- Patient care summaries for family members
- Financial health metrics (platform fees collected)

**Business Impact**:
- ✅ Better data-driven decision making
- ✅ Increased transparency for all user types
- ✅ Easier tracking of platform growth
- ✅ Automated monthly summaries

---

### 🎯 **Technical Requirements**

#### **1. Admin Global Metrics**
- **Route**: `GET /reports/admin/stats`
- **Output**:
  - Total active caregivers/patients
  - Total hours worked (all time / current month)
  - Total payments processed
  - Total platform revenue (sum of `taxaPlataforma`)

#### **2. Caregiver Performance Report**
- **Route**: `GET /reports/caregiver/me`
- **Output**:
  - Total earned
  - Total hours worked
  - Breakdown by patient
  - Average hours per shift

#### **3. Family/Patient Activity Report**
- **Route**: `GET /reports/family/patients`
- **Output**:
  - Summary of shifts for all linked patients
  - Total hours consumed
  - List of caregivers who attended the patients

#### **4. Export Capabilities (Future)**
- Foundation for CSV/PDF export

---

### 🛠️ **Implementation Plan**

**Step 1**: Create `ReportsModule`, `ReportsService`, and `ReportsController` ✅
- Base structure in `src/reports/` ✅

**Step 2**: Implement Admin Stats Logic ✅
- Aggregate data from `users`, `plantoes`, and `pagamentos` tables ✅

**Step 3**: Implement Caregiver Personal Report ✅
- Filter data by the authenticated user's `cuidadorId` ✅

**Step 4**: Implement Family Report ✅
- Logic to find patients linked to the familiar and aggregate their plantões ✅

**Step 5**: Document with Swagger ✅

---

### ✅ **Acceptance Criteria**

- [x] Admin can view global platform statistics
- [x] Caregivers can view their own performance metrics
- [x] Families can view activity summaries for their patients
- [x] All endpoints protected by appropriate roles
- [x] Swagger documentation for all report endpoints

---

### 📦 **Files Created**

- `backend/src/reports/reports.module.ts`
- `backend/src/reports/reports.service.ts`
- `backend/src/reports/reports.controller.ts`
- `backend/src/reports/dto/report-stats.dto.ts`

---

### 🔗 **Related Issues**

- Depends on: Issue #15 (Payments Module) ✅ Completed
- Depends on: Issue #7 (Plantões Module) ✅ Completed
- Related: Future Dashboard UI implementation

---

## Issue #18: Testing Infrastructure & Integration Tests

**Status:** ✅ IMPLEMENTED

**Category:** Quality Assurance / Development Tools

**Priority:** P1 - High

**Sprint:** Week 5

**Branch:** `feat/testing-infrastructure`

---

### 📋 **Business Context**

Following the major database normalization refactor (Issue #17), the CareHub backend has grown to cover authentication, caregivers, patients, shifts, payments, and reports. Without a structured test suite, every new feature or refactor risks silently breaking existing functionality.

**Goal**: Establish a comprehensive testing foundation that:
- Validates all critical business logic in isolation (unit tests).
- Verifies that modules interact correctly end-to-end (integration/e2e tests).
- Provides a safety net for future development and refactors.
- Enables a future CI/CD pipeline to run automatically on every Pull Request.

**Business Impact**:
- ✅ **Reliability**: Catch regressions before they reach production.
- ✅ **Confidence**: Developers can refactor and add features without fear.
- ✅ **Auditability**: Tests serve as living documentation of expected behavior.
- ✅ **CI/CD Enablement**: Required by Issue #19 (GitHub Actions Pipeline).

---

### 🎯 **Technical Implementation**

#### **1. Testing Architecture (NestJS Convention)**

NestJS defines two distinct locations for tests — both were respected:

| Type | Location | Suffix | Purpose |
|------|----------|--------|---------|
| **Unit Tests** | `src/modulo/*.spec.ts` | `.spec.ts` | Tests a single class with all dependencies mocked |
| **E2E Tests** | `test/*.e2e-spec.ts` | `.e2e-spec.ts` | Tests the full HTTP layer (future scope) |

#### **2. Mocking Strategy**

All tests use **Jest mock factories** to simulate the `DatabaseService` (Prisma client). No real database connection is needed, ensuring:
- Tests run in **< 1 second** with zero infrastructure.
- Tests are **deterministic** — no flaky network or DB state.
- `bcrypt` was mocked at the module level using `jest.mock()` to avoid ESM property redefinition errors.

#### **3. Test Files & Results**

| File | Tests | Key Scenarios Covered |
|------|-------|-----------------------|
| `src/auth/auth.service.spec.ts` | **9** | validateUser (APROVADO/PENDENTE/REJEITADO), register (email conflict, ADMIN block), login (JWT token) |
| `src/plantoes/plantoes.service.spec.ts` | **13** | Date validation, 8h/6h hour calculation, PENDENTE status default, open shifts (no cuidador), status transitions, cuidador lookup |
| `src/pagamentos/pagamentos.service.spec.ts` | **15** | valorBruto = 8h×R$20=R$160, taxaPlataforma = R$16 (10%), valorLiquido = R$144, PENDENTE→PROCESSADO→PAID transitions, conflict and not-found guards |

#### **4. Final Test Run Result**

```
Test Suites: 5 passed, 5 total
Tests:       39 passed, 39 total
Time:        0.677 s
```

---

### ✅ **Acceptance Criteria**

- [x] Jest is configured for unit testing (`rootDir: src`, `testRegex: *.spec.ts`).
- [x] Unit tests exist for `AuthService` (9), `PlantoesService` (13), and `PagamentosService` (15).
- [x] All financial calculations verified: `valorBruto`, `taxaPlataforma`, `valorLiquido`.
- [x] All status transition guards verified: PENDENTE→PROCESSADO→PAID.
- [x] All 39 tests pass with `npm run test` (0.677s).

---

### 📦 **Files Created**

- `backend/src/auth/auth.service.spec.ts` — 9 unit tests
- `backend/src/plantoes/plantoes.service.spec.ts` — 13 unit tests
- `backend/src/pagamentos/pagamentos.service.spec.ts` — 15 unit tests

---

### 🔗 **Related Issues**

- Depends on: Issue #2 (Auth Module) ✅
- Depends on: Issue #7 (Plantões Module) ✅
- Depends on: Issue #15 (Payments Module) ✅
- Depends on: Issue #17 (DB Normalization) ✅
- Blocks: Issue #19 (CI/CD Pipeline)
- Enables: Issue #21 (Mercado Pago Integration)

---

## Issue #19: CI/CD Pipeline with GitHub Actions

**Status:** ✅ IMPLEMENTED

**Category:** DevOps / Infrastructure

**Priority:** P1 - High

**Sprint:** Week 5

**Branch:** `feat/ci-cd-pipeline`

---

### 📋 **Business Context**

With 39 unit tests now in place (Issue #18), the next critical step is ensuring those tests run **automatically** on every Pull Request and push to `dev` or `main`. Without automation, a developer could accidentally merge broken code after forgetting to run the tests manually.

**Goal**: Create a GitHub Actions workflow that:
- Runs automatically on every `push` and `pull_request` targeting `dev` or `main`.
- Validates the TypeScript build (catches type errors before merge).
- Executes the full unit test suite (39+ tests).
- Blocks a PR from being merged if any step fails.

**Business Impact**:
- ✅ **Zero broken merges**: No code enters `dev` without passing all tests.
- ✅ **Developer confidence**: Automated feedback within minutes of a push.
- ✅ **Audit trail**: Every commit has a CI status badge (pass/fail).
- ✅ **Scalability**: CI runs every future test automatically — no manual effort.

---

### 🎯 **Technical Requirements**

#### **1. CI Workflow Triggers**
```yaml
on:
  push:
    branches: [dev, main]
  pull_request:
    branches: [dev, main]
```

#### **2. Pipeline Stages (in order)**

| Stage | Command | Purpose |
|-------|---------|---------|
| **Install** | `npm ci` | Install exact dependency versions |
| **Build** | `npm run build` | Validate TypeScript compilation |
| **Test** | `npm run test -- --no-coverage` | Run all 39+ unit tests |

#### **3. Environment**
- **Runner**: `ubuntu-latest`
- **Node.js**: Version `22.x` (matches production)
- **Working directory**: `./backend`
- **No database required**: Unit tests use mocks only

#### **4. Status Badge**
- Add a CI status badge to the project `README.md`.

---

### 🛠️ **Implementation Plan**

**Step 1**: Create GitHub Actions workflow file.
- Path: `.github/workflows/ci.yml`
- Trigger on push/PR to `dev` and `main`.

**Step 2**: Define the job with 3 steps: install, build, test.
- Use `working-directory: ./backend`.
- Cache `node_modules` using `actions/cache` for faster runs.

**Step 3**: Validate the workflow.
- Push a commit and verify the pipeline runs successfully on GitHub Actions tab.

**Step 4**: Add CI badge to `README.md`.
- URL format: `https://github.com/joaojosers/CareHub/actions/workflows/ci.yml/badge.svg`

---

### ✅ **Acceptance Criteria**

- [ ] `.github/workflows/ci.yml` exists and is correctly configured.
- [ ] Pipeline triggers on push/PR to `dev` and `main`.
- [ ] `npm run build` passes in the CI environment.
- [ ] `npm run test` passes (39/39 tests) in the CI environment.
- [ ] A failing test causes the pipeline to fail (blocks PR merge).
- [ ] CI status badge appears on `README.md`.
- [ ] GitHub Actions tab shows green checkmark after a successful run.

---

### 📦 **Files to Create**

- `.github/workflows/ci.yml` — Main CI pipeline definition
- `README.md` — Updated with CI badge

---

### 🔗 **Related Issues**

- Depends on: Issue #18 (Testing Infrastructure) ✅
- Enables: Issue #20 (Email Notifications)
- Enables: Issue #21 (Mercado Pago Integration)
- Enables: Issue #23 (Production Deployment)

---

## Issue #21: Integração Mercado Pago

**Status:** 🚧 IN PROGRESS

**Category:** Feature Implementation / Integration

**Priority:** P2 - Medium

**Sprint:** Week 6

**Branch:** `feat/mercado-pago`

---

### 📋 **Business Context**

O módulo de Pagamentos (Issue #15) já calcula e registra pagamentos internamente. Porém, a transferência real de dinheiro para os cuidadores ainda é feita de forma manual fora do sistema. A integração com o Mercado Pago automatiza a movimentação financeira real via Pix, eliminando processos manuais e aumentando a confiança dos cuidadores na plataforma.

**Goal**: Integrar o SDK do Mercado Pago para:
- Processar pagamentos reais via Pix para cuidadores.
- Receber notificações automáticas de confirmação via webhooks.
- Gerar comprovantes de transação com ID externo.

**Business Impact**:
- ✅ **Automação financeira** — Elimina transferências manuais.
- ✅ **Rastreabilidade** — Cada pagamento tem um ID externo do Mercado Pago.
- ✅ **Confiança** — Cuidadores recebem com segurança e rapidez.
- ✅ **Conformidade** — Integração com gateway regulamentado no Brasil.

---

### 🎯 **Technical Requirements**

#### **1. SDK e Configuração**
```bash
npm install mercadopago
```
```env
MP_ACCESS_TOKEN=APP_USR-...
MP_WEBHOOK_SECRET=seu_secret_aqui
```

#### **2. Fluxo de Pagamento**

```
Admin confirma pagamento (PATCH /pagamentos/:id/confirmar)
         ↓
PagamentosService → MercadoPagoService.criarPagamentoPix()
         ↓
MP retorna: { id, qr_code, qr_code_base64 }
         ↓
Pagamento salvo com mpPaymentId + status PROCESSADO
         ↓
Mercado Pago envia webhook POST /pagamentos/webhook
         ↓
Backend valida assinatura → atualiza status para PAID
```

#### **3. Endpoints**

| Método | Rota | Descrição |
|--------|------|-----------|
| `POST` | `/pagamentos/webhook` | Recebe notificações do Mercado Pago |
| Existente | `/pagamentos/:id/confirmar` | Agora aciona o MP internamente |

---

### 🛠️ **Implementation Plan**

**Commit 1**: Instalar SDK e criar `MercadoPagoService` + `MercadoPagoModule`.

**Commit 2**: Implementar `criarPagamentoPix()` — gera a cobrança Pix via MP.

**Commit 3**: Criar webhook controller `POST /pagamentos/webhook` com validação de assinatura.

**Commit 4**: Integrar `MercadoPagoService` no `PagamentosService.confirmarPagamento()`.

**Commit 5**: Adicionar campo `mpPaymentId` no schema Prisma + migration.

---

### ✅ **Acceptance Criteria**

- [ ] SDK `mercadopago` instalado e configurado via `.env`.
- [ ] `MercadoPagoService` com método `criarPagamentoPix()`.
- [ ] Webhook `POST /pagamentos/webhook` recebe e valida notificações MP.
- [ ] Campo `mpPaymentId` salvo no banco após criação da cobrança.
- [ ] Falha na API do MP não quebra o fluxo (try/catch + log).
- [ ] CI continua verde após as mudanças.

---

### 📦 **Files to Create**

- `backend/src/mercado-pago/mercado-pago.module.ts`
- `backend/src/mercado-pago/mercado-pago.service.ts`

### 📦 **Files to Modify**

- `backend/prisma/schema.prisma` — adicionar `mpPaymentId` no modelo `Pagamento`
- `backend/src/pagamentos/pagamentos.service.ts` — integrar MP no confirmar
- `backend/src/pagamentos/pagamentos.controller.ts` — adicionar rota webhook
- `backend/src/app.module.ts` — importar `MercadoPagoModule`

---

### 🔗 **Related Issues**

- Depends on: Issue #15 (Payments Module) ✅
- Depends on: Issue #17 (DB Normalization) ✅
- Depends on: Issue #18 (Testing Infrastructure) ✅
- Depends on: Issue #19 (CI/CD Pipeline) ✅
- Enables: Issue #23 (Production Deployment)

---

## Labels Reference

- **Infrastructure:** Project setup, database, Docker
- **Feature Implementation:** New features and modules
- **Bug Fix:** Issues that need to be resolved
- **Security:** Authentication, authorization, RBAC
- **Documentation:** Swagger, API docs
- **Development Tools:** Seed data, testing utilities
- **Configuration:** Environment variables, settings

---

**Last Updated:** February 25, 2026
**Version:** 2.4.0
**Current Sprint:** Week 6


