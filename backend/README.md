# CareHub - API Backend (NestJS)

<p align="center">
  <img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" />
</p>

## 📋 Sobre a Arquitetura

Este é o microsserviço oficial da API do CareHub, desenvolvido integralmente com o framework **NestJS**. Ele alimenta todo o Frontend React validando rotas, autenticação, transações com gateway (Mercado Pago) e consultas ao nosso banco de dados relacional.

A API foi projetada para atuar em Nuvem utilizando **Docker Multi-Stage**. Em produção, o código-fonte TypeScript é abandonado e subimos estritamente o código Javascript pré-compilado, rodando sem sobrecarga.

### 🔥 Features Importantes da API
- **Proteção RBAC**: Uso de Guards customizados e extração assíncrona de JWT.
- **Documentação Automática**: Rotas e schemas via *Swagger* em `/api` do servidor.
- **Relacionamentos Complexos**: Gerenciamento limpo com o Prisma ORM e PostgreSQL.
- **CI/CD Unit Tests**: ~40 testes unitários automatizados garantem que as lógicas de faturamento e plantões não quebrem (Jest Config).

## 🛠️ Stack Tecnológica

* **Node.js** (v22+)
* **NestJS** (v11)
* **TypeScript**
* **Prisma** (v7)
* **PostgreSQL**
* **Docker & Compose**

## 💻 Comandos e Operação Local

Para trabalhar no código da API sem o Container de Produção:

### 1. Instalação Dependencies
```bash
npm ci
```

### 2. Rodando o Servidor de Desenvolvimento
```bash
# Sobe o servidor assistindo as trocas de arquivo
npm run start:dev
```

### 3. Migrações e Banco de Dados (Prisma)
Se você criar um novo Model em `prisma/schema.prisma`:
```bash
npx prisma generate
npx prisma migrate dev --name <nome-da-mudanca>
```

### 4. Gerando as Sementes (Seed) de Teste Locais
```bash
npx prisma db seed
```

## 🚢 Empacotamento de Produção (Docker)

Esta API possui um `Dockerfile` otimizado em dois estágios, que constrói a cópia e exclui as ferramentas de desenvolvimento em favor da leveza de imagem:

```bash
# O comando a seguir é governado pela raiz do projeto via docker-compose
docker compose build --no-cache backend
```
>*Nota de Engenharia*: O compilador embutido ignora o `.dockerignore` nas cópias da pasta `src/`, permitindo o Build sem quebras de módulos ou falsos *MODULE_NOT_FOUND*. 

## 🧪 Testes

Testes de todos os serviços principais encontram-se estruturados internamente:

```bash
# Executar todos os Unit Tests
npm run test

# Avaliar porcentagem de cobertura (Coverage)
npm run test:cov
```
