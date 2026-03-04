# CareHub - Sistema de Gestão de Cuidadores e Pacientes

## 📋 Visão Geral

CareHub é uma aplicação web moderna desenvolvida para PMEs que prestam serviços de acompanhamento e cuidado de pacientes. O sistema substitui processos manuais realizados em planilhas Excel e grupos de WhatsApp por uma solução integrada e profissional.

## 🎯 Objetivos do Projeto

- **Digitalizar processos**: Substituir planilhas Excel e WhatsApp por um sistema centralizado
- **Gestão de pessoas**: Cadastro e gerenciamento de cuidadores e pacientes
- **Controle de horas**: Registro e aprovação de plantões com cálculo automático de horas
- **Pagamentos**: Relatórios detalhados para processamento de pagamentos mensais
- **Métricas**: Dashboard com indicadores de gestão em tempo real

## ✨ Funcionalidades Principais

### 1. Gestão de Usuários
- ✅ Auto-cadastro de cuidadores
- ✅ Cadastro de pacientes
- ✅ Sistema de aprovação de documentos
- ✅ Três níveis de acesso: Administrador, Cuidador, Familiar

### 2. Gestão de Plantões
- ✅ Registro de plantões com data/hora início e fim
- ✅ Cálculo automático de horas trabalhadas
- ✅ Relatórios de atividades por plantão
- ✅ Sistema de aprovação de plantões

### 3. Controle Financeiro
- ✅ Relatórios de horas por cuidador
- ✅ Cálculo automático de valores a pagar
- ✅ Filtros por período (mensal)
- ✅ Preparado para integração com gateway de pagamento

### 4. Dashboard e Métricas
- ✅ Total de cuidadores ativos
- ✅ Total de pacientes ativos
- ✅ Horas trabalhadas no mês
- ✅ Pagamentos pendentes
- ✅ Listagem de plantões recentes

## 🚀 Tecnologias Utilizadas

O CareHub está sendo migrado de uma versão estática para uma arquitetura profissional moderna:

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, Shadcn/UI
- **Backend**: NestJS, TypeScript
- **Banco de Dados**: PostgreSQL com Prisma ORM
- **Autenticação**: JWT (Role-Based Access Control)
- **Design**: Visual Premium com Dark Mode e Fluid Design

## 📦 Estrutura do Projeto (Monorepo)

```
CareHub/
├── frontend/               # Aplicação Next.js 15 profissional
├── backend/                # API NestJS com Prisma
├── versao-estatica/        # Versão MVP original (HTML/JS)
├── DOCUMENTO_TECNICO.md    # Especificações técnicas detalhadas
├── README.md               # Este arquivo
├── GUIA_RAPIDO.md          # Guia de uso por perfil
└── .gitignore              # Configurações de ignorar git
```

## 🔗 Repositório GitHub

Este projeto está disponível no GitHub:
- **URL**: [https://github.com/joajosers/CareHub](https://github.com/joajosers/CareHub)
- **Clone**: `git clone https://github.com/joajosers/CareHub.git`

## 🎨 Design e UX

O sistema foi desenvolvido com foco em:
- **Visual Premium**: Gradientes vibrantes, dark mode, glassmorphism
- **Animações Suaves**: Transições e micro-interações
- **Responsividade**: Funciona perfeitamente em desktop, tablet e mobile
- **Acessibilidade**: Estrutura semântica e contraste adequado

## 🔐 Credenciais de Demonstração

Para testar o sistema, use as seguintes credenciais:

**Administrador:**
- Email: `admin@carehub.com`
- Senha: `admin123`
- Tipo: Administrador

**Dados de Demonstração:**
- 3 cuidadores pré-cadastrados
- 3 pacientes pré-cadastrados
- 5 plantões de exemplo

## 💻 Como Executar

### Versão Profissional (Desenvolvimento)
```bash
# Frontend
cd frontend
npm install
npm run dev

# Backend
cd backend
npm install
npm run start:dev
```

### Versão Estática (Legado/Demonstração)
1. Navegue até a pasta `versao-estatica/`
2. Abra o arquivo `index.html` em um navegador moderno

## 📱 Funcionalidades por Tipo de Usuário

### Administrador
- ✅ Visualizar dashboard completo
- ✅ Gerenciar cuidadores (CRUD)
- ✅ Gerenciar pacientes (CRUD)
- ✅ Aprovar/rejeitar plantões
- ✅ Gerar relatórios de pagamento
- ✅ Processar pagamentos

### Cuidador
- ✅ Registrar plantões
- ✅ Adicionar relatórios de atividades
- ✅ Visualizar histórico de plantões
- ✅ Consultar pagamentos

### Familiar
- ✅ Visualizar informações do paciente
- ✅ Consultar relatórios de plantões
- ✅ Acompanhar atividades

## 🔄 Fluxo de Trabalho

1. **Cadastro**: Cuidador se cadastra no sistema
2. **Aprovação**: Administrador aprova o cadastro
3. **Registro**: Cuidador registra plantões realizados
4. **Aprovação**: Administrador aprova plantões
5. **Pagamento**: Sistema gera relatório mensal para pagamento
6. **Processamento**: Pagamentos são processados via gateway

## 📊 Métricas e Relatórios

O sistema oferece:
- Total de horas trabalhadas por período
- Custo total por cuidador
- Número de plantões por paciente
- Taxa de aprovação de plantões
- Projeções de gastos mensais

## 🔮 Cronograma de Desenvolvimento (Roadmap)

Conforme o `DOCUMENTO_TECNICO.md`, o projeto segue um ciclo de 4 semanas para o MVP:

### Fase 1 - Core & Auth (Semana 1)
- [ ] Sistema de autenticação profissional (NextAuth/JWT)
- [ ] CRUD de cuidadores e pacientes no banco de dados
- [ ] Registro básico de plantões e cálculo de horas
- [ ] Dashboard administrativo inicial

### Fase 2 - Recursos Avançados (Semana 2)
- [ ] Sistema de gestão e aprovação de documentos
- [ ] Módulo exclusivo de consulta para **Familiares** (Leitura)
- [ ] Relatórios detalhados e notificações
- [ ] Validações de negócio complexas

### Fase 3 - Pagamentos & Integração (Semana 3)
- [ ] Integração real com Gateway de Pagamento (Mercado Pago/Stripe)
- [ ] Histórico financeiro e comprovantes automáticos
- [ ] Fluxo de fechamento mensal

### Fase 4 - Otimização & Polimento (Semana 4)
- [ ] Otimizações de performance e SEO
- [ ] Testes de segurança e carga
- [ ] Refinamento da UI/UX Premium

## 🛠️ Migração para Produção

Para usar em produção, recomenda-se:

1. **Backend**: Implementar API REST (Node.js/Express ou Python/FastAPI)
2. **Banco de Dados**: Migrar para PostgreSQL ou MongoDB
3. **Autenticação**: Implementar JWT com refresh tokens
4. **Hospedagem**: Deploy em serviços como Vercel, Netlify ou AWS
5. **Gateway de Pagamento**: Integrar Mercado Pago ou Stripe
6. **Segurança**: HTTPS, CORS, rate limiting, validação de dados

## 📄 Licença

Este projeto foi desenvolvido como MVP para simulação laboral.

## 👥 Suporte

Para dúvidas ou sugestões sobre o sistema, entre em contato com a equipe de desenvolvimento.

---

**Desenvolvido com ❤️ para modernizar a gestão de cuidados de saúde**
