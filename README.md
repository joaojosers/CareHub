# CareHub 
# Sistema de Gestão de Cuidadores e Pacientes

![CI](https://github.com/joaojosers/CareHub/actions/workflows/ci.yml/badge.svg?branch=dev)
![Tests](https://img.shields.io/badge/tests-42%20passing-brightgreen)
![Node](https://img.shields.io/badge/node-22.x-green)
![NestJS](https://img.shields.io/badge/NestJS-11-red)
![Prisma](https://img.shields.io/badge/Prisma-7-blue)

## 📋 Visão Geral

CareHub é uma plataforma para gestão de cuidadores e acompanhamento de pacientes.  
O sistema centraliza toda a  operação, eliminando planilhas e processos manuais, oferecendo desde o controle de ponto (plantões) até o fechamento financeiro automatizado.

## 🎯 Objetivos do Projeto

- **Automação Financeira**: Cálculo automático de horas, valores brutos, taxas de plataforma e valores líquidos.
- **Gestão de Pessoas**: Dinamica completa de cadastro, aprovação e gerenciamento de cuidadores/pacientes.
- **Transparência**: Dashboards em tempo real com indicadores de horas trabalhadas e pagamentos pendentes.
- **Pagamentos Integrados**: Facilitação de pagamentos via Gateway (Mercado Pago) e controle de baixas manuais.

## ✨ Funcionalidades Ativas

## 1. Gestão de Usuários
- ✅ Auto-cadastro de cuidadores
- ✅ Cadastro de pacientes
- ✅ Sistema de aprovação de documentos
- ✅ Três níveis de acesso: Administrador, Cuidador, Familiar

## 2. Gestão de Plantões
- ✅ Registro de plantões com data/hora início e fim
- ✅ Cálculo automático de horas trabalhadas
- ✅ Relatórios de atividades por plantão
- ✅ Sistema de aprovação de plantões

## 3. Controle Financeiro
- ✅ Relatórios de horas por cuidador
- ✅ Cálculo automático de valores a pagar
- ✅ Filtros por período (mensal)
- ✅ Preparado para integração com gateway de pagamento

## 4. Dashboard e Métricas
- ✅ Total de cuidadores ativos
- ✅ Total de pacientes ativos
- ✅ Horas trabalhadas no mês
- ✅ Pagamentos pendentes
- ✅ Listagem de plantões recentes

## 🚀 Tecnologias Utilizadas
### Frontend (SPA)
- **React.js**: Biblioteca principal para construção da interface baseada em componentes.
- **Vite 7**: Ferramenta de build e servidor de desenvolvimento de alta performance.
- **JavaScript (JSX)**: Desenvolvimento de componentes com sintaxe declarativa.
- **Componentes Customizados**: UI construída sob medida (Cards, Tabelas, Botões).
- **Inline Styles (CSS-in-JS)**: Estilização nativa do React para garantir consistência visual sem dependências externas.

### Backend (API)
- **NestJS 11**: Framework modular para a construção da API.
- **TypeScript**: Tipagem forte no lado do servidor para maior segurança nas regras de negócio.
- **Prisma ORM**: Gerenciamento de banco de dados PostgreSQL.
- **Autenticação**: JWT (Role-Based Access Control)

## 📦 Estrutura do Projeto

```
CareHub/
├── frontend/           # Aplicação React (SPA) via Vite
├── backend/            # API REST em NestJS (TypeScript)
|     └── prisma/       # Schemas e Migrations (PostgreSQL)
└── README.md           # Documentação do projeto 
```
## 🔐 Fluxo de Operação do Sistema

O sistema segue um workflow rigoroso para garantir a segurança dos dados:

1. **Entrada do Cuidador**: O profissional se cadastra e aguarda com status `PENDENTE` e (`Perfil CUIDADOR`).
2. **Moderação**: O Administrador revisa o cadastro e altera para `APROVADO` ou `REJEITADO`.
3. **Gestão de Pacientes**: O Admin cadastra o Paciente e seu Responsável (`Perfil FAMILIAR`), vinculando os cuidadores autorizados.
4. **Execução**: O Cuidador aprovado realiza o registro dos seus plantões no sistema.
5. **Auditoria**: O Administrador revisa o plantão realizado e clica em **Aprovar**.
6. **Relatórios**: O Familiar acessa o sistema para visualizar os relatórios do seu dependente em tempo real.
7. **Faturamento Automático**: Ao aprovar o plantão, o sistema calcula instantaneamente na página de **Pagamentos**:
   - `Valor Bruto = Horas * Valor/Hora`
   - `Taxa Plataforma = 10%`
   - `Valor Líquido = Bruto - Taxa`
8. **Liquidação**: O Admin processa o pagamento via Gateway (Automático) ou baixa manual (PIX).

## 🔗 Repositório GitHub

Este projeto está disponível no GitHub:
- **URL** [https://github.com/No-Country-simulation/S02-26-Equipe-37-Web-App-Development.git]
- **Clone**: `git clone https://github.com/No-Country-simulation/S02-26-Equipe-37-Web-App-Development.git`

## 🔐 Credenciais de Demonstração

Para testar o sistema, use as seguintes credenciais:

**Administrador:**
- Email: `admin@carehub.com`
- Senha: `admin123`

## 🛠️ Pré-requisitos do Sistema
### Para rodar o sistema na sua máquina, precisará das seguintes ferramentas instaladas:
* Node.js (v20 ou superior): Ambiente de execução para o Frontend e Backend
* PostgreSQL: Base de dados relacional (pode ser instalada localmente).
* Prisma CLI: Para gerir as migrações e a estrutura da base de dados.
* Git: Para clonar o repositório.

## 🚀 Guia Rápido de Instalação  
* Clonar o projeto: git clone https://github.com/No-Country-simulation/S02-26-Equipe-37-Web-App-Development.git
* Configurar Base de Dados: Criar um ficheiro .env na pasta backend com a sua DATABASE_URL.
* Instalar Dependências:  
* No Backend: npm install 
* No Frontend: npm install
* Sincronizar Banco: npx prisma migrate dev (dentro da pasta backend).

## 💻 Como Executar

### Desenvolvimento Local
```bash
# Backend (Porta 3000)
cd backend && npm run start:dev

# Frontend (Porta 5173)
cd frontend && npm run dev
```

## 👨‍💻 Autores

* João Jose Rocha de Souza
* Terezinha Freire Carvalho de Souza
* Priscila Santos
* Patryck Siva
* Paulo Fleury 

## 📄 Licença

Este projeto foi desenvolvido como MVP para simulação laboral.

## 👥 Suporte

Para dúvidas ou sugestões sobre o sistema, entre em contato com a equipe de desenvolvimento.

---

**Desenvolvido com ❤️ para modernizar a gestão de cuidados de saúde**
