# CareHub - Sistema de Gestão de Acompanhantes e Pacientes

## 📋 Visão Geral

CareHub é uma aplicação web moderna desenvolvida para PMEs que prestam serviços de acompanhamento e cuidado de pacientes. O sistema substitui processos manuais realizados em planilhas Excel e grupos de WhatsApp por uma solução integrada e profissional.

## 🎯 Objetivos do Projeto

- **Digitalizar processos**: Substituir planilhas Excel e WhatsApp por um sistema centralizado
- **Gestão de pessoas**: Cadastro e gerenciamento de acompanhantes/cuidadores e pacientes
- **Controle de horas**: Registro e aprovação de plantões com cálculo automático de horas
- **Pagamentos**: Relatórios detalhados para processamento de pagamentos mensais
- **Métricas**: Dashboard com indicadores de gestão em tempo real

## ✨ Funcionalidades Principais

### 1. Gestão de Usuários
- ✅ Auto-cadastro de acompanhantes/cuidadores
- ✅ Cadastro de pacientes
- ✅ Sistema de aprovação de documentos
- ✅ Três níveis de acesso: Administrador, Acompanhante, Familiar

### 2. Gestão de Plantões
- ✅ Registro de plantões com data/hora início e fim
- ✅ Cálculo automático de horas trabalhadas
- ✅ Relatórios de atividades por plantão
- ✅ Sistema de aprovação de plantões

### 3. Controle Financeiro
- ✅ Relatórios de horas por acompanhante
- ✅ Cálculo automático de valores a pagar
- ✅ Filtros por período (mensal)
- ✅ Preparado para integração com gateway de pagamento

### 4. Dashboard e Métricas
- ✅ Total de acompanhantes ativos
- ✅ Total de pacientes ativos
- ✅ Horas trabalhadas no mês
- ✅ Pagamentos pendentes
- ✅ Listagem de plantões recentes

## 🚀 Tecnologias Utilizadas

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Armazenamento**: LocalStorage (MVP) - Preparado para migração para PostgreSQL
- **Design**: CSS moderno com gradientes, glassmorphism e animações
- **Responsividade**: Mobile-first design

## 📦 Estrutura do Projeto

```
CareHub/
├── index.html              # Estrutura HTML principal
├── styles.css              # Estilos CSS com design moderno
├── app.js                  # Lógica da aplicação
├── README.md               # Este arquivo
├── DOCUMENTO_TECNICO.md    # Documentação técnica completa
├── GUIA_RAPIDO.md          # Guia rápido de uso
├── RESUMO_ENTREGA.md       # Resumo da entrega
├── LICENSE                 # Licença MIT
└── .gitignore              # Arquivos ignorados pelo Git
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
- 3 acompanhantes pré-cadastrados
- 3 pacientes pré-cadastrados
- 5 plantões de exemplo

## 💻 Como Executar

### Opção 1: Clonar do GitHub (Recomendado)
```bash
# Clone o repositório
git clone https://github.com/joajosers/CareHub.git

# Entre na pasta do projeto
cd CareHub

# Abra o arquivo index.html no navegador
open index.html  # macOS
# ou
start index.html  # Windows
# ou
xdg-open index.html  # Linux
```

### Opção 2: Usar um servidor local
```bash
# Navegue até a pasta do projeto
cd CareHub

# Usando Python 3
python3 -m http.server 8000

# Usando Node.js (npx)
npx serve

# Acesse http://localhost:8000
```

### Opção 3: Abrir diretamente (se já tiver os arquivos)
1. Navegue até a pasta `CareHub`
2. Abra o arquivo `index.html` em um navegador moderno

## 📱 Funcionalidades por Tipo de Usuário

### Administrador
- ✅ Visualizar dashboard completo
- ✅ Gerenciar acompanhantes (CRUD)
- ✅ Gerenciar pacientes (CRUD)
- ✅ Aprovar/rejeitar plantões
- ✅ Gerar relatórios de pagamento
- ✅ Processar pagamentos

### Acompanhante/Cuidador
- ✅ Registrar plantões
- ✅ Adicionar relatórios de atividades
- ✅ Visualizar histórico de plantões
- ✅ Consultar pagamentos

### Familiar
- ✅ Visualizar informações do paciente
- ✅ Consultar relatórios de plantões
- ✅ Acompanhar atividades

## 🔄 Fluxo de Trabalho

1. **Cadastro**: Acompanhante se cadastra no sistema
2. **Aprovação**: Administrador aprova o cadastro
3. **Registro**: Acompanhante registra plantões realizados
4. **Aprovação**: Administrador aprova plantões
5. **Pagamento**: Sistema gera relatório mensal para pagamento
6. **Processamento**: Pagamentos são processados via gateway

## 📊 Métricas e Relatórios

O sistema oferece:
- Total de horas trabalhadas por período
- Custo total por acompanhante
- Número de plantões por paciente
- Taxa de aprovação de plantões
- Projeções de gastos mensais

## 🔮 Próximas Funcionalidades (Roadmap)

### Fase 2 - Funcionalidades Avançadas
- [ ] Sistema completo de edição de registros
- [ ] Upload e validação de documentos
- [ ] Notificações por email
- [ ] Exportação de relatórios (PDF/Excel)
- [ ] Histórico de alterações

### Fase 3 - Integração de Pagamentos
- [ ] Integração com Mercado Pago
- [ ] Integração com bancos (PIX, TED)
- [ ] Comprovantes automáticos
- [ ] Histórico de transações

### Fase 4 - Mobile e Avançado
- [ ] Aplicativo mobile nativo (React Native)
- [ ] Integração com WhatsApp Business API
- [ ] Sistema de agendamento automático
- [ ] Geolocalização para check-in/check-out
- [ ] IA para análise de relatórios

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
