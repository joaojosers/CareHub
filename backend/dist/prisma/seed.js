"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
const pg = __importStar(require("pg"));
const bcrypt = __importStar(require("bcrypt"));
require("dotenv/config");
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new adapter_pg_1.PrismaPg(pool);
const prisma = new client_1.PrismaClient({ adapter });
async function main() {
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash('admin123', salt);
    const passCui = await bcrypt.hash('cuidador123', salt);
    const passFam = await bcrypt.hash('familiar123', salt);
    console.log('🌱 Gerando dados de teste...');
    const admin = await prisma.user.upsert({
        where: { email: 'admin@carehub.com' },
        update: {},
        create: {
            email: 'admin@carehub.com',
            nome: 'Administrador CareHub',
            senha: password,
            cpf: '000.000.000-00',
            tipo: client_1.UserRole.ADMIN,
            status: client_1.UserStatus.APROVADO,
        },
    });
    const userCui = await prisma.user.upsert({
        where: { email: 'cuidador@test.com' },
        update: {},
        create: {
            email: 'cuidador@test.com',
            nome: 'Ana Cuidadores',
            senha: passCui,
            cpf: '222.222.222-22',
            tipo: client_1.UserRole.CUIDADOR,
            status: client_1.UserStatus.APROVADO,
        },
    });
    const cuidador = await prisma.cuidadorDetalhes.upsert({
        where: { userId: userCui.id },
        update: {},
        create: {
            userId: userCui.id,
            especialidades: ['Enfermagem', 'Fisioterapia'],
            mercadoPago: 'ana@mp.com',
        },
    });
    const familiar = await prisma.user.upsert({
        where: { email: 'familiar@carehub.com' },
        update: {},
        create: {
            email: 'familiar@carehub.com',
            nome: 'João Familiar',
            senha: passFam,
            cpf: '111.111.111-11',
            tipo: client_1.UserRole.FAMILIAR,
            status: client_1.UserStatus.APROVADO,
        },
    });
    const paciente = await prisma.paciente.create({
        data: {
            nome: 'Dona Maria Oliveira',
            dataNascimento: new Date('1940-05-15'),
            necessidades: 'Auxílio para locomoção e medicação controlada.',
            status: client_1.PacienteStatus.ATIVO,
        },
    });
    await prisma.familiarVinculo.upsert({
        where: {
            userId_pacienteId: {
                userId: familiar.id,
                pacienteId: paciente.id,
            },
        },
        update: {},
        create: {
            userId: familiar.id,
            pacienteId: paciente.id,
            parentesco: 'Filho',
            isResponsavelFinanceiro: true,
        },
    });
    console.log('✅ Seed completo!');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map