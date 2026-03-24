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

---

## 🛠️ Stack Tecnológica

| Tecnologia | Versão | Função |
|---|---|---|
| **Node.js** | v22+ | Runtime da API |
| **NestJS** | v11 | Framework MVC |
| **TypeScript** | v5+ | Tipagem estática |
| **Prisma ORM** | v7 | Acesso ao banco de dados |
| **PostgreSQL** | v15+ | Banco de dados relacional |
| **Docker & Compose** | — | Containerização e orquestração |

---

## 🗄️ Banco de Dados CareHub (PostgreSQL)

O CareHub utiliza **PostgreSQL** como banco de dados relacional principal, gerenciado pelo **Prisma ORM** (schema em `prisma/schema.prisma`). A seguir está a documentação completa do esquema de tabelas, relações e enumerações.

### Diagrama de Entidades e Relacionamentos

```
users ──────────────────┬─── cuidador_detalhes ──┬─── documentos_cuidador
  │                     │          │              │
  │ (FamiliarVinculo)   │          │              └─── plantoes ──── relatorios_atividade
  │                     │          │                       │
  └──── familiar_vinculos│          └─── cuidador_paciente_vinculos
             │           │                      │
         pacientes ──────┘──────────────────────┘
             │                                      pagamentos
             └─── enderecos
```

### 📌 Tabelas e Modelos

#### `users` — Usuários do Sistema
Tabela base de autenticação para todos os perfis de acesso.

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | UUID | Identificador único (PK) |
| `tipo` | `UserRole` | Papel do usuário: `ADMIN`, `CUIDADOR`, `FAMILIAR` |
| `nome` | String | Nome completo |
| `email` | String (único) | Endereço de e-mail para login |
| `senha` | String | Hash bcrypt da senha |
| `telefone` | String? | Telefone de contato (opcional) |
| `cpf` | String (único) | CPF do usuário |
| `status` | `UserStatus` | Estado da conta: `PENDENTE`, `APROVADO`, `REJEITADO` |
| `dataCadastro` | DateTime | Timestamp de criação |

**Relações**: `cuidador_detalhes` (1:1), `familiar_vinculos` (1:N), `enderecos` (1:1).

---

#### `cuidador_detalhes` — Perfil Estendido do Cuidador
Extensão do `User` com dados específicos do cuidador profissional.

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | UUID | Identificador único (PK) |
| `userId` | UUID (FK único) | Referência ao `users.id` |
| `mercadoPago` | String? | Chave/conta Mercado Pago vinculada |
| `especialidades` | String[] | Lista de especialidades clínicas |
| `valorHora` | Decimal(10,2) | Valor cobrado por hora (default R$ 20,00) |
| `documentosJson` | JSON? | Campo legado — deprecado em favor de `documentos_cuidador` |
| `dadosBancarios` | JSON? | Dados bancários em formato JSON |

**Relações**: `documentos_cuidador` (1:N), `plantoes` (1:N), `pagamentos` (1:N), `cuidador_paciente_vinculos` (1:N).

---

#### `documentos_cuidador` — Documentos de Habilitação
Armazena documentos (RG, CPF, certificados) enviados pelo cuidador para aprovação administrativa.

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | UUID | Identificador único (PK) |
| `cuidadorId` | UUID (FK) | Referência ao `cuidador_detalhes.id` |
| `tipo` | String | Tipo do documento: `'RG'`, `'CPF'`, `'CERTIFICADO'`, etc. |
| `url` | String | URL de armazenamento do arquivo |
| `status` | `UserStatus` | Estado da análise: `PENDENTE`, `APROVADO`, `REJEITADO` |
| `dataSubmissao` | DateTime | Data do envio |
| `conferidoEm` | DateTime? | Data da revisão administrativa |
| `conferidoPor` | String? | Nome/ID do administrador revisor |

---

#### `pacientes` — Pacientes Cadastrados
Registro dos pacientes que receberão cuidados.

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | UUID | Identificador único (PK) |
| `nome` | String | Nome completo do paciente |
| `dataNascimento` | DateTime | Data de nascimento |
| `necessidades` | Text? | Descrição clínica de necessidades especiais |
| `status` | `PacienteStatus` | Estado: `ATIVO`, `INATIVO` |
| `dataCadastro` | DateTime | Timestamp de criação |

**Relações**: `familiar_vinculos` (1:N), `plantoes` (1:N), `enderecos` (1:1), `cuidador_paciente_vinculos` (1:N).

---

#### `enderecos` — Endereços
Armazena endereços associados a um `User` ou `Paciente` (mutuamente exclusivos via FK nula).

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | UUID | Identificador único (PK) |
| `logradouro` | String | Rua / Avenida |
| `numero` | String | Número do imóvel |
| `complemento` | String? | Complemento (apto, bloco) |
| `bairro` | String | Bairro |
| `cidade` | String | Cidade |
| `estado` | String | UF |
| `cep` | Char(8) | CEP sem formatação |
| `referencia` | String? | Ponto de referência |
| `userId` | UUID? (FK único) | Vínculo com `users.id` |
| `pacienteId` | UUID? (FK único) | Vínculo com `pacientes.id` |

---

#### `familiar_vinculos` — Vínculo Familiar ↔ Paciente
Tabela associativa que define quais familiares acompanham quais pacientes.

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | UUID | Identificador único (PK) |
| `userId` | UUID (FK) | Familiar (`users.id`) |
| `pacienteId` | UUID (FK) | Paciente vinculado |
| `parentesco` | String | Grau de parentesco (ex: `"filho"`, `"cônjuge"`) |
| `isResponsavelFinanceiro` | Boolean | Flag: responsável pelo pagamento (default `false`) |

**Constraint única**: `(userId, pacienteId)` — um familiar não se vincula duas vezes ao mesmo paciente.

---

#### `cuidador_paciente_vinculos` — Vínculo Cuidador ↔ Paciente
Registra quais cuidadores estão atribuídos a quais pacientes e o valor hora acordado.

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | UUID | Identificador único (PK) |
| `pacienteId` | UUID (FK) | Paciente atendido |
| `cuidadorId` | UUID (FK) | Cuidador responsável |
| `valorHoraAcordado` | Decimal(10,2) | Valor negociado por hora para este vínculo |
| `dataVinculo` | DateTime | Data de criação do vínculo |

**Constraint única**: `(pacienteId, cuidadorId)` — evita vínculos duplicados.

---

#### `plantoes` — Plantões de Atendimento
Registro central de cada atendimento/plantão realizado.

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | UUID | Identificador único (PK) |
| `cuidadorId` | UUID? (FK) | Cuidador que realizou o plantão |
| `pacienteId` | UUID (FK) | Paciente atendido |
| `dataInicio` | DateTime | Início do plantão |
| `dataFim` | DateTime | Fim do plantão |
| `horasTrabalhadas` | Float | Total de horas calculadas |
| `status` | `PlantaoStatus` | Estado: `PENDENTE`, `APROVADO`, `REJEITADO` |
| `valorPago` | Decimal(10,2) | Valor pago ao cuidador (default 0) |
| `dataCriacao` | DateTime | Timestamp de registro |
| `relatorioLegacy` | Text? | Campo legado (mantido para não perda de dados) |

**Relações**: `relatorios_atividade` (1:1), `pagamentos` (1:1).

---

#### `relatorios_atividade` — Relatórios de Plantão (Normalizado)
Detalha clinicamente cada plantão — substitui o campo legado `relatorioLegacy`.

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | UUID | Identificador único (PK) |
| `plantaoId` | UUID (FK único) | Plantão correspondente |
| `descricao` | Text | Descrição geral das atividades |
| `medicacoes` | Text? | Medicações administradas |
| `pressaoArterial` | String? | Leitura de pressão arterial |
| `observacoes` | Text? | Observações clínicas adicionais |
| `criadoEm` | DateTime | Timestamp de criação |

---

#### `pagamentos` — Pagamentos via Mercado Pago / Pix
Controle financeiro de cada plantão aprovado.

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | UUID | Identificador único (PK) |
| `plantaoId` | UUID (FK único) | Plantão referenciado |
| `cuidadorId` | UUID (FK) | Cuidador a receber |
| `valorBruto` | Decimal(10,2) | Valor total sem taxas |
| `valorLiquido` | Decimal(10,2) | Valor líquido ao cuidador |
| `taxaPlataforma` | Decimal(10,2) | Taxa retida pela plataforma |
| `status` | `PagamentoStatus` | `PENDENTE`, `PROCESSADO`, `PAID` |
| `metodoPagamento` | `MetodoPagamento` | `PIX`, `TRANSFERENCIA`, `MERCADO_PAGO` |
| `dataPagamento` | DateTime? | Data de confirmação do pagamento |
| `mpPaymentId` | String? | ID externo Mercado Pago |
| `mpQrCode` | String? | String do QR Code Pix |
| `mpQrCodeBase64` | String? | Imagem do QR Code em Base64 |
| `mpTicketUrl` | String? | URL do ticket de pagamento Pix |
| `criadoEm` | DateTime | Criação do registro |
| `atualizadoEm` | DateTime | Última atualização (auto-gerenciado) |

---

### 🏷️ Enumerações (Enums)

| Enum | Valores | Uso |
|---|---|---|
| `UserRole` | `ADMIN`, `CUIDADOR`, `FAMILIAR` | Papel do usuário no sistema |
| `UserStatus` | `PENDENTE`, `APROVADO`, `REJEITADO` | Status de contas e documentos |
| `PacienteStatus` | `ATIVO`, `INATIVO` | Estado do cadastro do paciente |
| `PlantaoStatus` | `PENDENTE`, `APROVADO`, `REJEITADO` | Estado do plantão |
| `PagamentoStatus` | `PENDENTE`, `PROCESSADO`, `PAID` | Status do fluxo de pagamento |
| `MetodoPagamento` | `PIX`, `TRANSFERENCIA`, `MERCADO_PAGO` | Método de pagamento utilizado |

---

## 💻 Comandos e Operação Local

Para trabalhar no código da API sem o Container de Produção:

### 1. Instalação de Dependências
```bash
npm ci
```

### 2. Rodando o Servidor de Desenvolvimento
```bash
# Sobe o servidor assistindo as trocas de arquivo
npm run start:dev
```

### 3. Migrações e Banco de Dados (Prisma)
Se você criar ou alterar um Model em `prisma/schema.prisma`:
```bash
# Gera o cliente Prisma atualizado
npx prisma generate

# Cria e aplica uma nova migration
npx prisma migrate dev --name <nome-da-mudanca>

# Visualiza o banco de dados com interface gráfica
npx prisma studio
```

### 4. Gerando as Sementes (Seed) de Teste Locais
```bash
npx prisma db seed
```

---

## 🚢 Empacotamento de Produção (Docker)

Esta API possui um `Dockerfile` otimizado em dois estágios, que constrói a cópia e exclui as ferramentas de desenvolvimento em favor da leveza de imagem:

```bash
# O comando a seguir é governado pela raiz do projeto via docker-compose
docker compose build --no-cache backend
```
> *Nota de Engenharia*: O compilador embutido ignora o `.dockerignore` nas cópias da pasta `src/`, permitindo o Build sem quebras de módulos ou falsos *MODULE_NOT_FOUND*.

---

## 🧪 Testes

Testes de todos os serviços principais encontram-se estruturados internamente:

```bash
# Executar todos os Unit Tests
npm run test

# Avaliar porcentagem de cobertura (Coverage)
npm run test:cov
```
