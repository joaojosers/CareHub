import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { User, Prisma, UserStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import {UserRole } from '@prisma/client'; // Importe os enums do Prisma

@Injectable()
export class UsersService {
  constructor(private databaseService: DatabaseService) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.databaseService.client.user.findUnique({
      where: { email },
    });
  }

  async create(data: Prisma.UserCreateInput): Promise<User> {
    // 1. Criptografia da senha antes de salvar
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.senha, salt);

    // 2. Criação do registro
    // Usamos o spread (...data) mas sobrescrevemos a senha com o hash.
    // O campo 'status' já vem dentro do objeto 'data' vindo do AuthService.
    return this.databaseService.client.user.create({
      data: {
        ...data,
        senha: hashedPassword,
      },
    });
  }

  /**
   * 3. Busca de usuários com segurança
   * Adicionamos um 'select' para garantir que o hash da senha NUNCA 
   * seja enviado para o Frontend, mesmo que o Admin esteja logado.
   */
  async findAll(status?: UserStatus, tipo?: UserRole) {
    return this.databaseService.client.user.findMany({
      where: {
        // O Prisma vai ignorar campos que vierem como 'undefined'
        status: status || undefined,
        tipo: tipo || undefined,
      },
      orderBy: { dataCadastro: 'desc' },
      select: {
        id: true,
        nome: true,
        email: true,
        cpf: true,
        tipo: true,
        status: true,
        telefone: true,
        dataCadastro: true,
      },
    });
  }
  

  async updateStatus(id: string, status: UserStatus): Promise<User> {
    return this.databaseService.client.user.update({
      where: { id },
      data: { status },
    });
  }

  async findOne(id: string) {
    return this.databaseService.client.user.findUnique({
      where: { id },
      include: {
        familiares: { 
          include: {
            paciente: {
              include: {
                endereco: true, // Necessário para mostrar Rua/Número no card
                plantoes: {
                  where: { status: 'APROVADO' }, // Segurança: Familiar só vê o que foi aprovado
                  include: {
                    relatorioAtividade: true // Necessário para a página de relatórios
                  }
                }
              }
            }
          }
        }
      }
    });
  }
}