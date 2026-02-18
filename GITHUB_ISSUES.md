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

**Status:** 📋 PLANNED

**Category:** Feature Implementation / Financial Management

**Branch:** `feat/payments-module`

**Priority:** P1 - High

**Sprint:** Week 4

---

### 📋 **Business Context**

CareHub operates as a gig economy platform where caregivers are paid per shift worked. Currently, there is no automated payment system — administrators must manually calculate and process payments. This creates errors, delays, and lack of transparency for both caregivers and families.

**Goal**: Build a complete payment management system that:
- Automatically calculates caregiver payroll based on approved shifts
- Tracks payment status (PENDENTE, PROCESSADO, FALHOU)
- Gives admins full control over payment processing
- Provides caregivers visibility into their earnings
- Gives families transparency on what they are paying for

**Business Impact**:
- ✅ Eliminates manual payroll errors
- ✅ Faster payment processing
- ✅ Full audit trail of all payments
- ✅ Caregiver trust and retention
- ✅ Family billing transparency

---

### 🎯 **Technical Requirements**

#### **1. Database Schema**
New model `Pagamento` in `schema.prisma`:
- `id` (UUID)
- `cuidadorId` (FK → CuidadorDetalhes)
- `plantaoId` (FK → Plantao) — one payment per shift
- `valorBruto` (Decimal) — `horasTrabalhadas × valorHora`
- `valorLiquido` (Decimal) — after 10% platform fee
- `status` (Enum: PENDENTE, PROCESSADO, FALHOU)
- `metodoPagamento` (Enum: MERCADO_PAGO, TRANSFERENCIA, PIX)
- `dataPagamento` (DateTime?)
- `comprovante` (String?) — URL to receipt
- `dataCriacao` (DateTime)

New enums:
- `PagamentoStatus`: `PENDENTE`, `PROCESSADO`, `FALHOU`
- `MetodoPagamento`: `MERCADO_PAGO`, `TRANSFERENCIA`, `PIX`

Also add `valorHora` (Decimal) to `CuidadorDetalhes`.

#### **2. Endpoints**

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| `GET` | `/payments` | Admin | List all payments (with filters) |
| `GET` | `/payments/my` | Cuidador | List own payments |
| `GET` | `/payments/:id` | Admin/Cuidador | Get payment details |
| `POST` | `/payments/calculate` | Admin | Calculate payroll for a shift |
| `POST` | `/payments/process/:id` | Admin | Process a pending payment |
| `GET` | `/payments/summary` | Admin | Monthly payment summary |

#### **3. Payroll Calculation Logic**
```
valorBruto   = horasTrabalhadas × valorHoraCuidador
valorLiquido = valorBruto - (valorBruto × 0.10)  // 10% platform fee
```

#### **4. Payment Flow**
```
Plantao APROVADO
  → POST /payments/calculate  → Pagamento PENDENTE
  → POST /payments/process/:id → Pagamento PROCESSADO
```

---

### 🛠️ **Implementation Plan**

**Step 1**: Update Prisma Schema
- Add `Pagamento` model with all fields
- Add `PagamentoStatus` and `MetodoPagamento` enums
- Add `valorHora` field to `CuidadorDetalhes`
- Run `npx prisma migrate dev --name add-payments-module`

**Step 2**: Create DTOs
- `CreatePagamentoDto` (plantaoId, metodoPagamento)
- `ProcessPagamentoDto` (comprovante?)

**Step 3**: Create PaymentsService
- `calculate(plantaoId)` — compute valorBruto/Liquido
- `process(id, dto)` — mark as PROCESSADO
- `findAll(filters)` — list with pagination
- `findMy(cuidadorId)` — caregiver's own payments
- `findOne(id)` — single payment detail
- `summary(month, year)` — monthly totals

**Step 4**: Create PaymentsController
- Endpoints with proper guards (Admin vs Cuidador)
- Swagger documentation with `@ApiBearerAuth`

**Step 5**: Register PaymentsModule
- Import DatabaseModule
- Register in AppModule

---

### ✅ **Acceptance Criteria**

- [ ] Admin can calculate payment for an approved shift
- [ ] Payment is created with status `PENDENTE`
- [ ] Admin can process a pending payment
- [ ] Payment status changes to `PROCESSADO`
- [ ] Caregiver can view their own payments (`GET /payments/my`)
- [ ] Admin can view all payments with filters
- [ ] Monthly summary shows total paid per caregiver
- [ ] Cannot calculate payment for non-approved shifts (400 Bad Request)
- [ ] Cannot process an already processed payment (409 Conflict)
- [ ] All endpoints documented in Swagger

---

### 🧪 **Testing Checklist**

- [ ] Calculate payment for an approved shift
- [ ] Verify `valorBruto = horasTrabalhadas × valorHora`
- [ ] Verify `valorLiquido = valorBruto - 10%`
- [ ] Process the pending payment
- [ ] Verify status changes to `PROCESSADO`
- [ ] Login as cuidador and view own payments
- [ ] Get monthly summary as admin
- [ ] Try to calculate payment for PENDENTE shift (should fail)
- [ ] Try to process already PROCESSADO payment (should fail)

---

### 📦 **Deliverables**

- [ ] `prisma/schema.prisma` — Pagamento model + enums
- [ ] `prisma/migrations/` — new migration
- [ ] `src/payments/payments.module.ts`
- [ ] `src/payments/payments.service.ts`
- [ ] `src/payments/payments.controller.ts`
- [ ] `src/payments/dto/create-pagamento.dto.ts`
- [ ] `src/payments/dto/process-pagamento.dto.ts`
- [ ] Updated `GITHUB_ISSUES.md`

---

### 🔗 **Related Issues**

- Depends on: Issue #7 (Plantões Module) ✅ Completed
- Depends on: Issue #14 (Self-Registration) ✅ Completed
- Blocks: Issue #16 (Reports Module)
- Related: Issue #5 (Cuidadores Module) — valorHora field needed

---

## Summary Statistics

| Status | Count |
|--------|-------|
| ✅ Implemented | 14 |
| 📋 Planned | 1 |
| ⏸️ On Hold | 0 |
| **Total** | **15** |

---

### 🎯 **Technical Requirements**

#### **1. Payment Data Model**
- Create `Pagamento` entity in schema.prisma with fields:
  - `id`, `cuidadorId`, `mes` (YYYY-MM), `totalHoras`, `valorTotal`, `status` (PENDENTE/PROCESSADO/PAID)
  - Timestamps: `criadoEm`, `atualizadoEm`

#### **2. Payment Calculation Endpoints**
- **Route**: `POST /pagamentos/calcular-mes`
- **Input**: `{ mes: "2026-02", cuidadorId?: string }`
- **Behavior**: Auto-calculate payments from approved plantões

- **Route**: `GET /pagamentos?mes=2026-02&status=PENDENTE`
- **Authentication**: JWT (Admin only)
- **Behavior**: List payments with filters

#### **3. Payment Processing**
- **Route**: `PATCH /pagamentos/:id/processar`
- **Behavior**: Mark payment as PROCESSADO (ready for bank transfer)

- **Route**: `PATCH /pagamentos/:id/confirmar-pagamento`
- **Input**: `{ dataPagamento, numeroComprovante }`
- **Behavior**: Mark as PAID with proof

#### **4. Financial Reports**
- **Route**: `GET /pagamentos/relatorio?mes=2026-02`
- **Output**: Summary with total hours, total amount, breakdown by caregiver

---

### 🛠️ **Implementation Plan**

1. Update `schema.prisma` with Pagamento model
2. Create `pagamentos.module.ts`, `pagamentos.service.ts`, `pagamentos.controller.ts`
3. Implement payment calculation logic
4. Create payment DTOs with validation
5. Add Swagger documentation
6. Test with sample shifts

---

### ✅ **Acceptance Criteria**

- [ ] Pagamento model created in database
- [ ] Calculate monthly payments from approved shifts
- [ ] Admin can list payments filtered by month/status
- [ ] Admin can mark payment as processado
- [ ] Admin can confirm payment with proof
- [ ] Financial report endpoint works correctly
- [ ] All endpoints documented in Swagger

---

## Summary Statistics

| Status | Count |
|--------|-------|
| ✅ Implemented | 14 |
| 📋 Pending | 1 |
| ⏸️ On Hold | 0 |
| **Total** | **15** |

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

**Last Updated:** February 18, 2026  
**Version:** 2.1.0  
**Current Sprint:** Week 4
