import { PrismaClient, UserRole, PacienteStatus, UserStatus } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as pg from 'pg';
import * as bcrypt from 'bcrypt';
import 'dotenv/config';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash('admin123', salt);
    const passCui = await bcrypt.hash('cuidador123', salt);
    const passFam = await bcrypt.hash('familiar123', salt);

    console.log('🌱 Gerando dados de teste...');

    // 1. Criar Admin
    const admin = await prisma.user.upsert({
        where: { email: 'admin@carehub.com' },
        update: {},
        create: {
            email: 'admin@carehub.com',
            nome: 'Administrador CareHub',
            senha: password,
            cpf: '000.000.000-00',
            tipo: UserRole.ADMIN,
            status: UserStatus.APROVADO, // Admin sempre aprovado
        },
    });

    // 2. Criar Cuidador
    const userCui = await prisma.user.upsert({
        where: { email: 'cuidador@test.com' },
        update: {},
        create: {
            email: 'cuidador@test.com',
            nome: 'Ana Cuidadores',
            senha: passCui,
            cpf: '222.222.222-22',
            tipo: UserRole.CUIDADOR,
            status: UserStatus.APROVADO, // Para facilitar testes
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

    // 3. Criar Familiar
    const familiar = await prisma.user.upsert({
        where: { email: 'familiar@carehub.com' },
        update: {},
        create: {
            email: 'familiar@carehub.com',
            nome: 'João Familiar',
            senha: passFam,
            cpf: '111.111.111-11',
            tipo: UserRole.FAMILIAR,
            status: UserStatus.APROVADO, // Para facilitar testes
        },
    });

    // 4. Criar Paciente
    const paciente = await prisma.paciente.create({
        data: {
            nome: 'Dona Maria Oliveira',
            dataNascimento: new Date('1940-05-15'),
            necessidades: 'Auxílio para locomoção e medicação controlada.',
            status: PacienteStatus.ATIVO,
        },
    });

    // 5. Vincular Familiar ao Paciente
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
