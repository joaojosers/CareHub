# Guia Rápido - CareHub

## 🚀 Início Rápido

### 1. Acessar o Sistema

Abra o arquivo `index.html` no seu navegador ou acesse através de um servidor local.

### 2. Login

Use as credenciais de demonstração:
- **Email**: admin@carehub.com
- **Senha**: admin123
- **Tipo**: Administrador

### 3. Explorar o Dashboard

Após o login, você verá:
- **Estatísticas**: Acompanhantes ativos, pacientes, horas do mês, pagamentos pendentes
- **Plantões Recentes**: Lista dos últimos plantões registrados
- **Menu Lateral**: Navegação entre as diferentes seções

## 📋 Principais Operações

### Cadastrar Novo Acompanhante

1. Clique em "Acompanhantes" no menu lateral
2. Clique no botão "Novo Acompanhante"
3. Preencha os dados obrigatórios:
   - Nome completo
   - CPF
   - Email
   - Telefone
4. Clique em "Salvar"

### Cadastrar Novo Paciente

1. Clique em "Pacientes" no menu lateral
2. Clique no botão "Novo Paciente"
3. Preencha os dados:
   - Nome completo
   - Data de nascimento
   - Necessidades especiais (opcional)
4. Clique em "Salvar"

### Registrar Plantão

1. Clique em "Plantões" no menu lateral
2. Clique no botão "Novo Plantão"
3. Selecione:
   - Acompanhante responsável
   - Paciente atendido
   - Data/hora de início
   - Data/hora de fim
4. Adicione o relatório de atividades (opcional)
5. Clique em "Salvar"

**Nota**: O sistema calcula automaticamente as horas trabalhadas!

### Aprovar Plantão

1. Vá para "Plantões"
2. Localize plantões com status "Pendente"
3. Clique no botão verde de aprovação (✓)
4. O plantão será aprovado e o valor calculado automaticamente (R$ 20/hora)

### Gerar Relatório de Pagamentos

1. Clique em "Pagamentos" no menu lateral
2. Selecione o mês desejado no filtro
3. Clique em "Gerar Relatório"
4. Visualize o total de horas e valores por acompanhante
5. Use o botão "Processar" para simular o pagamento

## 🎯 Casos de Uso Práticos

### Cenário 1: Novo Cuidador

**Situação**: Maria Silva quer trabalhar como cuidadora

**Passos**:
1. Maria acessa o sistema
2. Clica em "Primeiro acesso? Cadastre-se"
3. Preenche todos os dados pessoais e bancários
4. Submete o cadastro
5. Aguarda aprovação do administrador
6. Administrador revisa e aprova o cadastro
7. Maria pode fazer login e começar a registrar plantões

### Cenário 2: Registro de Plantão

**Situação**: João trabalhou 12 horas cuidando do Sr. Carlos

**Passos**:
1. João faz login no sistema
2. Vai em "Plantões" → "Novo Plantão"
3. Seleciona seu nome e o paciente (Sr. Carlos)
4. Define início: 08/02/2026 às 08:00
5. Define fim: 08/02/2026 às 20:00
6. Escreve relatório: "Paciente alimentado, medicação administrada conforme prescrição, sem intercorrências"
7. Salva o plantão
8. Sistema calcula: 12 horas trabalhadas

### Cenário 3: Fechamento Mensal

**Situação**: Final do mês, precisa processar pagamentos

**Passos**:
1. Administrador acessa "Pagamentos"
2. Seleciona "Fevereiro 2026"
3. Clica em "Gerar Relatório"
4. Sistema mostra:
   - Maria Silva: 120 horas = R$ 2.400,00
   - João Santos: 96 horas = R$ 1.920,00
   - Ana Costa: 144 horas = R$ 2.880,00
5. Administrador processa os pagamentos

## 💡 Dicas e Boas Práticas

### Para Administradores

✅ **Aprove plantões regularmente** para manter o sistema atualizado
✅ **Revise relatórios** antes de aprovar plantões
✅ **Gere relatórios mensais** no início de cada mês
✅ **Mantenha dados de contato atualizados**

### Para Acompanhantes

✅ **Registre plantões imediatamente** após concluí-los
✅ **Seja detalhado nos relatórios** de atividades
✅ **Verifique dados bancários** estão corretos
✅ **Acompanhe status** dos seus plantões

### Para Familiares

✅ **Consulte relatórios regularmente** para acompanhar o cuidado
✅ **Verifique informações** do paciente estão atualizadas
✅ **Comunique mudanças** nas necessidades do paciente

## 🔍 Solução de Problemas

### Não consigo fazer login

- Verifique se o email está correto
- Verifique se a senha está correta
- Confirme que selecionou o tipo de usuário correto
- Se for novo usuário, aguarde aprovação do administrador

### Plantão não aparece na lista

- Verifique se salvou corretamente
- Atualize a página (F5)
- Verifique se está na aba correta

### Relatório de pagamentos vazio

- Confirme que selecionou um mês
- Verifique se há plantões aprovados no período
- Certifique-se que os plantões foram aprovados (não apenas registrados)

## 📊 Entendendo os Status

### Status de Usuários
- **Aprovado**: Pode usar o sistema normalmente
- **Pendente**: Aguardando aprovação do administrador
- **Rejeitado**: Cadastro não aprovado

### Status de Plantões
- **Pendente**: Aguardando aprovação do administrador
- **Aprovado**: Plantão confirmado, valor calculado
- **Rejeitado**: Plantão não aprovado

### Status de Pacientes
- **Ativo**: Recebendo cuidados atualmente
- **Inativo**: Não está mais sob cuidados

## 🎓 Glossário

- **Acompanhante/Cuidador**: Profissional que presta cuidados ao paciente
- **Plantão**: Período de trabalho do acompanhante
- **ABM**: Alta, Baixa, Modificação (criar, deletar, editar)
- **Dashboard**: Painel principal com visão geral
- **Gateway de Pagamento**: Sistema para processar pagamentos online

## 📞 Próximos Passos

Após dominar o básico:

1. **Explore todas as funcionalidades** do sistema
2. **Cadastre dados reais** (quando em produção)
3. **Configure integrações** de pagamento
4. **Treine sua equipe** no uso do sistema
5. **Colete feedback** dos usuários
6. **Solicite melhorias** conforme necessário

---

**Dúvidas?** Consulte o arquivo `DOCUMENTO_TECNICO.md` para informações detalhadas sobre a arquitetura e funcionalidades do sistema.
