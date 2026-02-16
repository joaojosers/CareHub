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

**Status:** 🚀 IN PROGRESS

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

- [ ] A visitor can register at `/auth/register` without authentication
- [ ] Registration creates user with `status = PENDENTE`
- [ ] Email and CPF must be unique (409 Conflict if duplicate)
- [ ] Cannot create ADMIN via public registration (400 Bad Request)
- [ ] PENDENTE users cannot login (401 Unauthorized)
- [ ] Admin can list users by status (`GET /users?status=PENDENTE`)
- [ ] Admin can approve users (`PATCH /users/:id/approve`)
- [ ] Admin can reject users (`PATCH /users/:id/reject`)
- [ ] APROVADO users can login successfully
- [ ] REJEITADO users cannot login
- [ ] All endpoints documented in Swagger
- [ ] Password is hashed (never stored in plain text)

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

- [ ] `src/auth/dto/register.dto.ts` - RegisterDto with validation
- [ ] `src/auth/auth.service.ts` - register() method
- [ ] `src/auth/auth.controller.ts` - POST /auth/register endpoint
- [ ] `src/users/users.controller.ts` - Admin approval endpoints
- [ ] `src/users/users.service.ts` - findAll() and updateStatus() methods
- [ ] `src/users/users.module.ts` - UsersController registration
- [ ] Updated Swagger documentation
- [ ] Manual testing completed

---

### 🔗 **Related Issues**

- Depends on: Issue #2 (Authentication Module)
- Depends on: Issue #3 (Users Module)
- Blocks: Issue #15 (Payments Module)
- Related: Future email verification feature
- Related: Future admin notification system

---

## Summary Statistics

| Status | Count |
|--------|-------|
| ✅ Implemented | 13 |
| � In Progress | 1 |
| � Pending | 0 |
| ⏸️ On Hold | 0 |
| **Total** | **14** |

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

**Last Updated:** February 16, 2026  
**Version:** 2.0.0  
**Current Sprint:** Week 3
