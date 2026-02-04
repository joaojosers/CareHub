# Documento Técnico - Sistema de Gestão de Acompanhantes e Pacientes

## 1. Visão Geral do Projeto

### 1.1 Contexto
Somos uma PME que atualmente realiza atividades de forma artesanal utilizando planilhas Excel e gestão de grupos WhatsApp por paciente. 

### 1.2 Objetivo
Desenvolver uma aplicação web que permita:
- Cadastro (ABM - Alta, Baixa, Modificação) de Acompanhantes/Cuidadores e Pacientes
- Gestão de atividades e relatórios dos acompanhantes/cuidadores para cada paciente
- Geração de relatórios sobre quantidade de horas trabalhadas por acompanhante/cuidador por paciente para processamento de pagamentos mensais
- Realização de pagamentos para contas bancárias ou Mercado Pago dos colaboradores através de gateway de pagamento confiável
- Permitir que acompanhantes/cuidadores carreguem seus relatórios e horas trabalhadas por plantão realizado
- Visualização de métricas de gestão

### 1.3 Usuários do Sistema
1. **Cuidadores**: Registro de plantões, horas trabalhadas e relatórios
2. **Família do Paciente**: Visualização de informações e relatórios
3. **Administração da PME**: Gestão completa, aprovações, pagamentos e métricas

## 2. Requisitos Funcionais

### 2.1 Módulo de Cadastro de Usuários

#### 2.1.1 Cadastro de Cuidadores
- Auto-registro com validação de documentos
- Upload de documentos obrigatórios:
  - RG/CPF
  - Comprovante de residência
  - Certificados de formação
  - Atestado de antecedentes criminais
- Dados bancários para pagamento
- Dados de contato do Mercado Pago (opcional)

#### 2.1.2 Cadastro de Pacientes
- Informações pessoais
- Histórico médico relevante
- Necessidades específicas de cuidado
- Vinculação com familiares

#### 2.1.3 Cadastro de Familiares
- Informações de contato
- Grau de parentesco
- Vinculação com paciente(s)

### 2.2 Módulo de Gestão de Plantões

#### 2.2.1 Registro de Plantões
- Data e horário de início/fim
- Paciente atendido
- Acompanhante responsável
- Tipo de plantão (12h, 24h, etc.)
- Status (pendente, aprovado, rejeitado)

#### 2.2.2 Relatórios de Atividades
- Descrição das atividades realizadas
- Observações sobre o estado do paciente
- Medicamentos administrados
- Intercorrências
- Anexo de fotos/documentos (opcional)

### 2.3 Módulo de Controle de Horas

#### 2.3.1 Registro de Horas
- Cálculo automático baseado em início/fim do plantão
- Horas extras
- Descontos
- Aprovação por administrador

#### 2.3.2 Relatórios de Horas
- Por acompanhante
- Por paciente
- Por período
- Exportação para Excel/PDF

### 2.4 Módulo de Pagamentos

#### 2.4.1 Cálculo de Pagamentos
- Valor por hora trabalhada
- Bônus e descontos
- Impostos e encargos
- Total a pagar

#### 2.4.2 Processamento de Pagamentos
- Integração com gateway de pagamento
- Suporte para transferência bancária
- Suporte para Mercado Pago
- Histórico de pagamentos
- Comprovantes

### 2.5 Módulo de Métricas e Dashboard

#### 2.5.1 Métricas Operacionais
- Total de horas trabalhadas (mensal/anual)
- Número de plantões por acompanhante
- Taxa de aprovação de relatórios
- Pacientes ativos

#### 2.5.2 Métricas Financeiras
- Total de pagamentos realizados
- Custo médio por paciente
- Custo médio por hora
- Projeções de gastos

## 3. Requisitos Não Funcionais

### 3.1 Segurança
- Autenticação e autorização baseada em roles
- Criptografia de dados sensíveis
- Proteção contra CSRF e XSS
- Logs de auditoria

### 3.2 Performance
- Tempo de resposta < 2 segundos
- Suporte para 100+ usuários simultâneos
- Backup diário automático

### 3.3 Usabilidade
- Interface responsiva (mobile-first)
- Suporte para navegadores modernos
- Acessibilidade (WCAG 2.1)

### 3.4 Escalabilidade
- Arquitetura modular
- Possibilidade de expansão de funcionalidades

## 4. Arquitetura Técnica - MVP

### 4.1 Stack Tecnológico
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Backend**: Node.js com Express (simulado no MVP)
- **Banco de Dados**: LocalStorage (MVP) / PostgreSQL (produção)
- **Autenticação**: JWT (simulado no MVP)

### 4.2 Estrutura de Dados

#### 4.2.1 Usuários
```javascript
{
  id: string,
  tipo: 'acompanhante' | 'familiar' | 'admin',
  nome: string,
  email: string,
  telefone: string,
  cpf: string,
  status: 'pendente' | 'aprovado' | 'rejeitado',
  documentos: Array<{tipo: string, url: string}>,
  dadosBancarios: {banco: string, agencia: string, conta: string},
  mercadoPago: string,
  dataCadastro: Date
}
```

#### 4.2.2 Pacientes
```javascript
{
  id: string,
  nome: string,
  dataNascimento: Date,
  necessidades: string,
  familiaresVinculados: Array<string>,
  status: 'ativo' | 'inativo',
  dataCadastro: Date
}
```

#### 4.2.3 Plantões
```javascript
{
  id: string,
  acompanhanteId: string,
  pacienteId: string,
  dataInicio: Date,
  dataFim: Date,
  horasTrabalhadas: number,
  relatorio: string,
  status: 'pendente' | 'aprovado' | 'rejeitado',
  valorPago: number,
  dataCriacao: Date
}
```

## 5. Roadmap de Desenvolvimento

### 5.1 Fase 1 - MVP (2-3 semanas)
- [ ] Sistema de autenticação básico
- [ ] CRUD de acompanhantes
- [ ] CRUD de pacientes
- [ ] Registro de plantões
- [ ] Cálculo de horas
- [ ] Dashboard básico

### 5.2 Fase 2 - Funcionalidades Avançadas (3-4 semanas)
- [ ] Sistema de aprovação de documentos
- [ ] Relatórios detalhados
- [ ] Exportação de dados
- [ ] Notificações por email

### 5.3 Fase 3 - Integração de Pagamentos (2-3 semanas)
- [ ] Integração com gateway de pagamento
- [ ] Integração com Mercado Pago
- [ ] Histórico de transações
- [ ] Comprovantes automáticos

### 5.4 Fase 4 - Otimizações (2 semanas)
- [ ] Melhorias de performance
- [ ] Testes de segurança
- [ ] Documentação completa
- [ ] Treinamento de usuários

## 6. Considerações de Implementação

### 6.1 Prioridades do MVP
1. Autenticação e controle de acesso
2. Cadastro de usuários e pacientes
3. Registro de plantões e horas
4. Dashboard com métricas básicas

### 6.2 Funcionalidades Futuras
- Aplicativo mobile nativo
- Integração com WhatsApp Business API
- Sistema de agendamento automático
- IA para análise de relatórios
- Geolocalização para check-in/check-out

## 7. Glossário

- **ABM**: Alta, Baixa, Modificação (CRUD em português)
- **Acompanhante/Cuidador**: Profissional que presta cuidados ao paciente
- **Plantão**: Período de trabalho do acompanhante
- **PME**: Pequena e Média Empresa
- **Gateway de Pagamento**: Sistema que processa pagamentos online
