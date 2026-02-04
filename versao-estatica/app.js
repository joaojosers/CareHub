// Data Storage
class DataStore {
    constructor() {
        this.users = JSON.parse(localStorage.getItem('users')) || [];
        this.cuidadores = JSON.parse(localStorage.getItem('cuidadores')) || [];
        this.pacientes = JSON.parse(localStorage.getItem('pacientes')) || [];
        this.plantoes = JSON.parse(localStorage.getItem('plantoes')) || [];
        this.currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

        // Initialize with demo data if empty
        if (this.users.length === 0) {
            this.initializeDemoData();
        }
    }

    initializeDemoData() {
        // Demo admin user
        this.users.push({
            id: this.generateId(),
            tipo: 'admin',
            nome: 'Administrador',
            email: 'admin@carehub.com',
            senha: 'admin123',
            telefone: '(11) 99999-9999',
            cpf: '000.000.000-00',
            status: 'aprovado',
            dataCadastro: new Date().toISOString()
        });

        // Demo cuidadores
        const cuidadoresDemo = [
            { nome: 'Maria Silva', cpf: '111.111.111-11', email: 'maria@email.com', telefone: '(11) 98888-8888' },
            { nome: 'João Santos', cpf: '222.222.222-22', email: 'joao@email.com', telefone: '(11) 97777-7777' },
            { nome: 'Ana Costa', cpf: '333.333.333-33', email: 'ana@email.com', telefone: '(11) 96666-6666' }
        ];

        cuidadoresDemo.forEach(acomp => {
            const id = this.generateId();
            this.cuidadores.push({
                id,
                ...acomp,
                status: 'aprovado',
                dadosBancarios: { banco: 'Banco do Brasil', agencia: '1234', conta: '12345-6' },
                dataCadastro: new Date().toISOString()
            });

            this.users.push({
                id: this.generateId(),
                tipo: 'cuidador',
                cuidadorId: id,
                nome: acomp.nome,
                email: acomp.email,
                senha: '123456',
                telefone: acomp.telefone,
                cpf: acomp.cpf,
                status: 'aprovado',
                dataCadastro: new Date().toISOString()
            });
        });

        // Demo pacientes
        const pacientesDemo = [
            { nome: 'José Oliveira', dataNascimento: '1945-03-15', necessidades: 'Mobilidade reduzida, diabetes' },
            { nome: 'Helena Ferreira', dataNascimento: '1938-07-22', necessidades: 'Alzheimer inicial' },
            { nome: 'Carlos Mendes', dataNascimento: '1950-11-08', necessidades: 'Pós-operatório' }
        ];

        pacientesDemo.forEach(pac => {
            this.pacientes.push({
                id: this.generateId(),
                ...pac,
                status: 'ativo',
                familiaresVinculados: [],
                dataCadastro: new Date().toISOString()
            });
        });

        // Demo plantões
        const now = new Date();
        for (let i = 0; i < 5; i++) {
            const inicio = new Date(now);
            inicio.setDate(inicio.getDate() - i);
            inicio.setHours(8, 0, 0);

            const fim = new Date(inicio);
            fim.setHours(20, 0, 0);

            this.plantoes.push({
                id: this.generateId(),
                cuidadorId: this.cuidadores[i % this.cuidadores.length].id,
                pacienteId: this.pacientes[i % this.pacientes.length].id,
                dataInicio: inicio.toISOString(),
                dataFim: fim.toISOString(),
                horasTrabalhadas: 12,
                relatorio: 'Plantão realizado com sucesso. Paciente estável.',
                status: i === 0 ? 'pendente' : 'aprovado',
                valorPago: i === 0 ? 0 : 240,
                dataCriacao: inicio.toISOString()
            });
        }

        this.save();
    }

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    save() {
        localStorage.setItem('users', JSON.stringify(this.users));
        localStorage.setItem('cuidadores', JSON.stringify(this.cuidadores));
        localStorage.setItem('pacientes', JSON.stringify(this.pacientes));
        localStorage.setItem('plantoes', JSON.stringify(this.plantoes));
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
    }

    login(email, senha, tipo) {
        const user = this.users.find(u =>
            u.email === email &&
            u.senha === senha &&
            u.tipo === tipo &&
            u.status === 'aprovado'
        );

        if (user) {
            this.currentUser = user;
            this.save();
            return true;
        }
        return false;
    }

    logout() {
        this.currentUser = null;
        this.save();
    }

    addCuidador(data) {
        const cuidador = {
            id: this.generateId(),
            ...data,
            status: 'aprovado',
            dataCadastro: new Date().toISOString()
        };
        this.cuidadores.push(cuidador);
        this.save();
        return cuidador;
    }

    updateCuidador(id, data) {
        const index = this.cuidadores.findIndex(a => a.id === id);
        if (index !== -1) {
            this.cuidadores[index] = { ...this.cuidadores[index], ...data };
            this.save();
            return true;
        }
        return false;
    }

    deleteCuidador(id) {
        this.cuidadores = this.cuidadores.filter(a => a.id !== id);
        this.save();
    }

    addPaciente(data) {
        const paciente = {
            id: this.generateId(),
            ...data,
            status: 'ativo',
            familiaresVinculados: [],
            dataCadastro: new Date().toISOString()
        };
        this.pacientes.push(paciente);
        this.save();
        return paciente;
    }

    updatePaciente(id, data) {
        const index = this.pacientes.findIndex(p => p.id === id);
        if (index !== -1) {
            this.pacientes[index] = { ...this.pacientes[index], ...data };
            this.save();
            return true;
        }
        return false;
    }

    deletePaciente(id) {
        this.pacientes = this.pacientes.filter(p => p.id !== id);
        this.save();
    }

    addPlantao(data) {
        const inicio = new Date(data.dataInicio);
        const fim = new Date(data.dataFim);
        const horas = Math.abs(fim - inicio) / 36e5; // Convert to hours

        const plantao = {
            id: this.generateId(),
            ...data,
            horasTrabalhadas: horas,
            status: 'pendente',
            valorPago: 0,
            dataCriacao: new Date().toISOString()
        };
        this.plantoes.push(plantao);
        this.save();
        return plantao;
    }

    updatePlantao(id, data) {
        const index = this.plantoes.findIndex(p => p.id === id);
        if (index !== -1) {
            this.plantoes[index] = { ...this.plantoes[index], ...data };
            this.save();
            return true;
        }
        return false;
    }

    deletePlantao(id) {
        this.plantoes = this.plantoes.filter(p => p.id !== id);
        this.save();
    }

    getCuidadorById(id) {
        return this.cuidadores.find(a => a.id === id);
    }

    getPacienteById(id) {
        return this.pacientes.find(p => p.id === id);
    }

    getPlantoesByCuidador(cuidadorId) {
        return this.plantoes.filter(p => p.cuidadorId === cuidadorId);
    }

    getPlantoesByPaciente(pacienteId) {
        return this.plantoes.filter(p => p.pacienteId === pacienteId);
    }

    getTotalHorasMes() {
        const now = new Date();
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);

        return this.plantoes
            .filter(p => {
                const plantaoDate = new Date(p.dataInicio);
                return plantaoDate >= firstDay && p.status === 'aprovado';
            })
            .reduce((total, p) => total + p.horasTrabalhadas, 0);
    }

    getTotalPagamentosPendentes() {
        return this.plantoes
            .filter(p => p.status === 'pendente')
            .reduce((total, p) => total + (p.horasTrabalhadas * 20), 0); // R$ 20/hora
    }
}

// Initialize data store
const store = new DataStore();

// Screen Management
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

function showLoginScreen() {
    showScreen('loginScreen');
}

function showRegisterScreen() {
    showScreen('registerScreen');
}

function showDashboard() {
    showScreen('dashboardScreen');
    updateDashboard();
}

// View Management
function switchView(viewName) {
    document.querySelectorAll('.view').forEach(view => {
        view.classList.remove('active');
    });
    document.getElementById(viewName + 'View').classList.add('active');

    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`[data-view="${viewName}"]`).classList.add('active');

    // Update view content
    switch (viewName) {
        case 'dashboard':
            updateDashboard();
            break;
        case 'cuidadores':
            updateCuidadoresTable();
            break;
        case 'pacientes':
            updatePacientesTable();
            break;
        case 'plantoes':
            updatePlantoesTable();
            break;
        case 'pagamentos':
            // Pagamentos view
            break;
    }
}

// Login
document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const userType = document.getElementById('userType').value;

    if (store.login(email, password, userType)) {
        // Update user info in sidebar
        const user = store.currentUser;
        document.getElementById('userName').textContent = user.nome;
        const roleMap = {
            'admin': 'Administrador',
            'cuidador': 'Cuidador',
            'familiar': 'Familiar'
        };
        document.getElementById('userRole').textContent = roleMap[user.tipo] || user.tipo;

        const initials = user.nome.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
        document.getElementById('userInitials').textContent = initials;

        showDashboard();
    } else {
        alert('Credenciais inválidas ou usuário não aprovado!');
    }
});

// Register
document.getElementById('registerForm').addEventListener('submit', (e) => {
    e.preventDefault();

    const senha = document.getElementById('regSenha').value;
    const confirmSenha = document.getElementById('regConfirmSenha').value;

    if (senha !== confirmSenha) {
        alert('As senhas não coincidem!');
        return;
    }

    const userData = {
        nome: document.getElementById('regNome').value,
        cpf: document.getElementById('regCPF').value,
        email: document.getElementById('regEmail').value,
        telefone: document.getElementById('regTelefone').value,
        dadosBancarios: {
            banco: document.getElementById('regBanco').value,
            agencia: document.getElementById('regAgencia').value,
            conta: document.getElementById('regConta').value
        },
        mercadoPago: document.getElementById('regMercadoPago').value
    };

    store.addCuidador(userData);

    store.users.push({
        id: store.generateId(),
        tipo: 'cuidador',
        nome: userData.nome,
        email: userData.email,
        senha: senha,
        telefone: userData.telefone,
        cpf: userData.cpf,
        status: 'pendente',
        dataCadastro: new Date().toISOString()
    });
    store.save();

    alert('Cadastro realizado com sucesso! Aguarde aprovação do administrador.');
    showLoginScreen();
});

// Logout
function logout() {
    store.logout();
    showLoginScreen();
}

// Update Dashboard
function updateDashboard() {
    // Update stats
    document.getElementById('totalCuidadores').textContent =
        store.cuidadores.filter(a => a.status === 'aprovado').length;

    document.getElementById('totalPacientes').textContent =
        store.pacientes.filter(p => p.status === 'ativo').length;

    document.getElementById('totalHoras').textContent =
        Math.round(store.getTotalHorasMes());

    document.getElementById('totalPagamentos').textContent =
        'R$ ' + store.getTotalPagamentosPendentes().toFixed(2);

    // Update recent plantoes
    const recentPlantoes = store.plantoes.slice(-5).reverse();
    const tbody = document.getElementById('recentPlantoesTable');

    if (recentPlantoes.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="empty-state">Nenhum plantão registrado</td></tr>';
    } else {
        tbody.innerHTML = recentPlantoes.map(plantao => {
            const cuidador = store.getCuidadorById(plantao.cuidadorId);
            const paciente = store.getPacienteById(plantao.pacienteId);
            const data = new Date(plantao.dataInicio).toLocaleDateString('pt-BR');

            return `
                <tr>
                    <td>${cuidador?.nome || 'N/A'}</td>
                    <td>${paciente?.nome || 'N/A'}</td>
                    <td>${data}</td>
                    <td>${plantao.horasTrabalhadas}h</td>
                    <td><span class="status-badge ${plantao.status}">${getStatusText(plantao.status)}</span></td>
                </tr>
            `;
        }).join('');
    }
}

// Update Cuidadores Table
function updateCuidadoresTable() {
    const tbody = document.getElementById('cuidadoresTable');

    if (store.cuidadores.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="empty-state">Nenhum cuidador cadastrado</td></tr>';
    } else {
        tbody.innerHTML = store.cuidadores.map(acomp => `
            <tr>
                <td>${acomp.nome}</td>
                <td>${acomp.cpf}</td>
                <td>${acomp.telefone}</td>
                <td>${acomp.email}</td>
                <td><span class="status-badge ${acomp.status}">${getStatusText(acomp.status)}</span></td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-action edit" onclick="editCuidador('${acomp.id}')" title="Editar">
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </button>
                        <button class="btn-action delete" onclick="deleteCuidador('${acomp.id}')" title="Excluir">
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }
}

// Update Pacientes Table
function updatePacientesTable() {
    const tbody = document.getElementById('pacientesTable');

    if (store.pacientes.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="empty-state">Nenhum paciente cadastrado</td></tr>';
    } else {
        tbody.innerHTML = store.pacientes.map(pac => {
            const dataNasc = new Date(pac.dataNascimento).toLocaleDateString('pt-BR');
            return `
                <tr>
                    <td>${pac.nome}</td>
                    <td>${dataNasc}</td>
                    <td>${pac.necessidades || 'N/A'}</td>
                    <td><span class="status-badge ${pac.status}">${getStatusText(pac.status)}</span></td>
                    <td>
                        <div class="action-buttons">
                            <button class="btn-action edit" onclick="editPaciente('${pac.id}')" title="Editar">
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            </button>
                            <button class="btn-action delete" onclick="deletePaciente('${pac.id}')" title="Excluir">
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    }
}

// Update Plantões Table
function updatePlantoesTable() {
    const tbody = document.getElementById('plantoesTable');

    if (store.plantoes.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="empty-state">Nenhum plantão registrado</td></tr>';
    } else {
        tbody.innerHTML = store.plantoes.map(plantao => {
            const cuidador = store.getCuidadorById(plantao.cuidadorId);
            const paciente = store.getPacienteById(plantao.pacienteId);
            const dataInicio = new Date(plantao.dataInicio).toLocaleString('pt-BR');
            const dataFim = new Date(plantao.dataFim).toLocaleString('pt-BR');

            return `
                <tr>
                    <td>${cuidador?.nome || 'N/A'}</td>
                    <td>${paciente?.nome || 'N/A'}</td>
                    <td>${dataInicio}</td>
                    <td>${dataFim}</td>
                    <td>${plantao.horasTrabalhadas.toFixed(1)}h</td>
                    <td><span class="status-badge ${plantao.status}">${getStatusText(plantao.status)}</span></td>
                    <td>
                        <div class="action-buttons">
                            ${plantao.status === 'pendente' ? `
                                <button class="btn-action" onclick="aprovarPlantao('${plantao.id}')" title="Aprovar" style="background: var(--success-color); color: white; border-color: var(--success-color);">
                                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                </button>
                            ` : ''}
                            <button class="btn-action delete" onclick="deletePlantao('${plantao.id}')" title="Excluir">
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    }
}

// Modal Management
function showModal(modalId) {
    document.getElementById('modalOverlay').classList.add('active');
    document.getElementById(modalId).classList.add('active');
}

function closeModal() {
    document.getElementById('modalOverlay').classList.remove('active');
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.remove('active');
    });
}

// Add Cuidador
function showAddCuidadorModal() {
    document.getElementById('addCuidadorForm').reset();
    showModal('addCuidadorModal');
}

document.getElementById('addCuidadorForm').addEventListener('submit', (e) => {
    e.preventDefault();

    const data = {
        nome: document.getElementById('acompNome').value,
        cpf: document.getElementById('acompCPF').value,
        email: document.getElementById('acompEmail').value,
        telefone: document.getElementById('acompTelefone').value
    };

    store.addCuidador(data);
    closeModal();
    updateCuidadorsTable();
    updateDashboard();
});

// Add Paciente
function showAddPacienteModal() {
    document.getElementById('addPacienteForm').reset();
    showModal('addPacienteModal');
}

document.getElementById('addPacienteForm').addEventListener('submit', (e) => {
    e.preventDefault();

    const data = {
        nome: document.getElementById('pacNome').value,
        dataNascimento: document.getElementById('pacDataNasc').value,
        necessidades: document.getElementById('pacNecessidades').value
    };

    store.addPaciente(data);
    closeModal();
    updatePacientesTable();
    updateDashboard();
});

// Add Plantão
function showAddPlantaoModal() {
    document.getElementById('addPlantaoForm').reset();

    // Populate selects
    const acompSelect = document.getElementById('plantaoAcomp');
    const pacSelect = document.getElementById('plantaoPac');

    acompSelect.innerHTML = '<option value="">Selecione...</option>' +
        store.cuidadores.map(a => `<option value="${a.id}">${a.nome}</option>`).join('');

    pacSelect.innerHTML = '<option value="">Selecione...</option>' +
        store.pacientes.map(p => `<option value="${p.id}">${p.nome}</option>`).join('');

    showModal('addPlantaoModal');
}

document.getElementById('addPlantaoForm').addEventListener('submit', (e) => {
    e.preventDefault();

    const data = {
        cuidadorId: document.getElementById('plantaoAcomp').value,
        pacienteId: document.getElementById('plantaoPac').value,
        dataInicio: document.getElementById('plantaoInicio').value,
        dataFim: document.getElementById('plantaoFim').value,
        relatorio: document.getElementById('plantaoRelatorio').value
    };

    store.addPlantao(data);
    closeModal();
    updatePlantoesTable();
    updateDashboard();
});

// Delete functions
function deleteCuidador(id) {
    if (confirm('Tem certeza que deseja excluir este cuidador?')) {
        store.deleteCuidador(id);
        updateCuidadorsTable();
        updateDashboard();
    }
}

function deletePaciente(id) {
    if (confirm('Tem certeza que deseja excluir este paciente?')) {
        store.deletePaciente(id);
        updatePacientesTable();
        updateDashboard();
    }
}

function deletePlantao(id) {
    if (confirm('Tem certeza que deseja excluir este plantão?')) {
        store.deletePlantao(id);
        updatePlantoesTable();
        updateDashboard();
    }
}

// Aprovar Plantão
function aprovarPlantao(id) {
    const valorHora = 20; // R$ 20/hora
    const plantao = store.plantoes.find(p => p.id === id);

    if (plantao) {
        store.updatePlantao(id, {
            status: 'aprovado',
            valorPago: plantao.horasTrabalhadas * valorHora
        });
        updatePlantoesTable();
        updateDashboard();
    }
}

// Edit functions (simplified for MVP)
function editCuidador(id) {
    alert('Funcionalidade de edição será implementada na próxima versão.');
}

function editPaciente(id) {
    alert('Funcionalidade de edição será implementada na próxima versão.');
}

// Pagamentos
function gerarRelatorio() {
    const mes = document.getElementById('mesFilter').value;

    if (!mes) {
        alert('Selecione um mês para gerar o relatório.');
        return;
    }

    const [ano, mesNum] = mes.split('-');
    const firstDay = new Date(ano, mesNum - 1, 1);
    const lastDay = new Date(ano, mesNum, 0);

    const plantoesMes = store.plantoes.filter(p => {
        const plantaoDate = new Date(p.dataInicio);
        return plantaoDate >= firstDay && plantaoDate <= lastDay && p.status === 'aprovado';
    });

    // Group by cuidador
    const relatorio = {};
    plantoesMes.forEach(plantao => {
        if (!relatorio[plantao.cuidadorId]) {
            relatorio[plantao.cuidadorId] = {
                totalHoras: 0,
                totalPagar: 0
            };
        }
        relatorio[plantao.cuidadorId].totalHoras += plantao.horasTrabalhadas;
        relatorio[plantao.cuidadorId].totalPagar += plantao.valorPago;
    });

    const tbody = document.getElementById('pagamentosTable');
    const valorHora = 20;

    if (Object.keys(relatorio).length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="empty-state">Nenhum plantão aprovado neste período</td></tr>';
    } else {
        tbody.innerHTML = Object.entries(relatorio).map(([acompId, data]) => {
            const acomp = store.getCuidadorById(acompId);
            return `
                <tr>
                    <td>${acomp?.nome || 'N/A'}</td>
                    <td>${data.totalHoras.toFixed(1)}h</td>
                    <td>R$ ${valorHora.toFixed(2)}</td>
                    <td>R$ ${data.totalPagar.toFixed(2)}</td>
                    <td><span class="status-badge pending">Pendente</span></td>
                    <td>
                        <button class="btn btn-sm btn-primary" onclick="processarPagamento('${acompId}', ${data.totalPagar})">
                            Processar
                        </button>
                    </td>
                </tr>
            `;
        }).join('');
    }
}

function processarPagamento(cuidadorId, valor) {
    const acomp = store.getCuidadorById(cuidadorId);
    alert(`Pagamento de R$ ${valor.toFixed(2)} para ${acomp.nome} será processado.\n\nEm produção, isso seria integrado com um gateway de pagamento real.`);
}

function processarPagamentos() {
    alert('Esta funcionalidade processaria todos os pagamentos pendentes através de um gateway de pagamento.\n\nNo MVP, use o botão "Gerar Relatório" para visualizar os pagamentos por período.');
}

// Utility functions
function getStatusText(status) {
    const statusMap = {
        'aprovado': 'Aprovado',
        'pendente': 'Pendente',
        'rejeitado': 'Rejeitado',
        'ativo': 'Ativo',
        'inativo': 'Inativo'
    };
    return statusMap[status] || status;
}

// Close modal on overlay click
document.getElementById('modalOverlay').addEventListener('click', (e) => {
    if (e.target.id === 'modalOverlay') {
        closeModal();
    }
});

// Initialize app
if (store.currentUser) {
    showDashboard();
} else {
    showLoginScreen();
}
