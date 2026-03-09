# CareHub - Aplicação Fullstack (API Backend & Frontend UI)

![CI](https://github.com/joaojosers/CareHub/actions/workflows/ci.yml/badge.svg?branch=dev)
![Tests](https://img.shields.io/badge/tests-39%20passing-brightgreen)
![Node](https://img.shields.io/badge/node-22.x-green)
![NestJS](https://img.shields.io/badge/NestJS-11-red)
![Prisma](https://img.shields.io/badge/Prisma-7-blue)
![React](https://img.shields.io/badge/React-19-61dafb)

## 📋 Visão Geral do Monorepo

CareHub é uma aplicação web moderna full-stack desenvolvida para PMEs que prestam serviços de acompanhamento e cuidado de pacientes, revolucionando processos antigos em planilhas com uma arquitetura digital completa. 

> **Aviso Importante**: Embora a organização do projeto possa levar o nome de "CareHub API", este repositório **é um Monorepo** e contém tanto o código oficial do Servidor (Backend NestJS) quanto o código do Cliente/Painel Web (Frontend React/Vite) integrados no mesmo ambiente Docker.

## 🎯 Objetivos do Projeto (Atingidos 🚀)

- **Digitalizar processos**: Totalmente integrado via aplicação Web.
- **Gestão de pessoas**: CRUD completo com aprovação e RBAC.
- **Controle de horas**: Registro e histórico de plantões.
- **Pagamentos**: Geração e fechamento relatorial.
- **Métricas**: Dashboards interativos.

## 🚀 Tecnologias Utilizadas (Production-ready)

- **Frontend**: Vite, React 19, Tailwind CSS, Autenticação de Tokens
- **Backend**: NestJS, TypeScript, Prisma ORM (Compilação ultra-otimizada)
- **Banco de Dados**: PostgreSQL
- **Integração de Pagamento**: Mercado Pago
- **Infraestrutura e Deploy**: Docker Multi-stage, Nginx, e Ubuntu Server na Oracle Cloud Infrastructure (OCI)

## 📦 Arquitetura do Repositório (Monorepo)

```text
CareHub/
├── frontend/               # SPA Vite/React (Empacotado via Nginx em Produção)
├── backend/                # API NestJS + PostgreSQL
├── docker-compose.yml      # Orquestrador oficial do ambiente OCI
├── DOCUMENTO_TECNICO.md    # Especificações de Arquitetura e Negócios
└── README.md               # Este arquivo de documentação oficial
```

## 🏗️ Ambiente de Produção & Deploy Oficial (OCI)

O aplicativo foi comissionado, construído e estabilizado em Containers na **Oracle Cloud**.

Para reiniciar ou re-publicar os serviços de produção, os comandos oficiais do mantenedor são:

```bash
git checkout -f dev
git pull origin dev
docker compose up -d --build
```
> O Frontend ficará exposto globalmente na porta `80` por Nginx, e a API na porta `3000`.

## 🔐 Credenciais Oficiais do Ambiente

**Administrador Global:**
- Email: `admin@carehub.com`
- Senha: `admin123`

*Para a inicialização dessas sementes em servidor novo, basta invadir o container API:*
```bash
docker exec -it carehub-backend node dist/prisma/seed.js
```

## 🔮 Cronograma de Desenvolvimento (Roadmap Concluído ✅)

Todas as metas propostas no ciclo inicial do MVP foram executadas com sucesso:

### Fase 1 - Core & Auth (Finalizado)
- [x] Sistema de autenticação profissional (JWT/RBAC)
- [x] CRUD de cuidadores e pacientes no banco de dados
- [x] Configuração centralizada
- [x] Dashboard administrativo

### Fase 2 - Recursos Avançados (Finalizado)
- [x] Gestão e aprovação robusta
- [x] Views exclusivas para **Familiares** e **Cuidadores**
- [x] Relatórios e Views Dinâmicas.
- [x] Validações de negócio complexas e testes unitários

### Fase 3 - Pagamentos & Integração (Finalizado)
- [x] Integração implementada em serviço Mock para o Gateway Mercado Pago.
- [x] Webhook de notificação capturada
- [x] Controle por turnos

### Fase 4 - Otimização, Docker & Deploy (Finalizado)
- [x] Empacotamento Multi-stage para Backend e Frontend
- [x] Deploy blindado por Security Lists na Nuvem Pública 
- [x] Correções avançadas de Entrypoints e Network/CORS

## 👨‍💻 Roadmap de Desenvolvimento Alternativo (Local)

Caso necessite rodar em máquina avulsa de desenvolvedor sem Docker Compose:

```bash
# Frontend
cd frontend && npm install && npm run dev

# Backend
cd backend && npm install && npm run start:dev
```

## 📄 Licença
Inteiramente versionado, testado e publicado. MVP para simulação laboral profissional concluído com excelência e engenharia de software de ponta.

