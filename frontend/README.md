# CareHub - Aplicação Web Frontend (React/Vite)

<p align="center">
  <img src="/public/vite.svg" width="120" alt="Vite Logo" />
</p>

## 📋 Sobre a Arquitetura

Este é o módulo Frontend (Interface de Usuário) do projeto CareHub. Diferente do esperado por alguns repositórios com o sufixo "API", este repositório **é um Monorepo Fullstack** e abriga tanto a aplicação Backend quanto o nosso painel web interativo.

Esta aplicação SPA (Single Page Application) foi reescrita utilizando **Vite** e **React 19**, proporcionando uma performance ultrarrápida no desenvolvimento e builds infinitamente mais otimizados do que estruturas legadas.

### 🔥 Features do Frontend
- **Design System**: Componentes de alta qualidade com Tailwind CSS.
- **Micro-interações**: Feedback visual de botões de aprovação e carregamento.
- **Roteamento Autenticado**: *ProtectedRoute* impedindo não-autenticados de verem as telas de controle de pacientes.
- **Design Responsivo**: Adaptativo a telas móveis ou PCs na área de trabalho.

## 🛠️ Stack Tecnológica

* **Node.js** (v22+)
* **Vite** (v6)
* **React** (v19)
* **Tailwind CSS** (v4)
* **Axios** (Integração de APIs REST)
* **Docker & Nginx** (Produção)

## 💻 Comandos e Operação Local

Para trabalhar no visual e interações sem hospedar na nuvem:

### 1. Instalação Dependencies
```bash
npm install
```

### 2. Rodando o Servidor de Desenvolvimento
```bash
# Servidor Vite com Hot-Module-Replacement (HMR) ultrarrápido!
npm run dev
```

### 3. Build Analítico (Produção)
```bash
npm run build
```

## 🚢 Empacotamento de Produção (Docker + Nginx)

Na nossa arquitetura oficial da **Oracle Cloud (OCI)**, não jogamos o código solto no servidor. Nós utilizamos um `Dockerfile` localizado nesta pasta responsável por realizar a build do Vite e repassá-la para o roteador ultrarrápido **NGINX**:

```bash
# Executado através do orquestrador via docker-compose na raiz do monorepo:
docker compose build --no-cache frontend
```

### 🌐 Conexão com a API Base
Atente-se para as variáveis de ambiente. Por padrão, em Produção, injetamos a `VITE_API_URL` durante a etapa de build (`ARG VITE_API_URL`) pelo `docker-compose`, garantindo que os componentes Axios conectem corretamente com o servidor backend em `/api`.

> **Nota para Desenvolvedores:** Todas as interações REST estão centralizadas nos arquivos dentro de `/src/services`, garantindo que um erro de rota na API não quebre toda a aplicação visualmente.
