import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { User, Prisma, UserStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(private databaseService: DatabaseService) { }

    async findByEmail(email: string): Promise<User | null> {
        return this.databaseService.client.user.findUnique({
            where: { email },
        });
    }

    async create(data: Prisma.UserCreateInput): Promise<User> {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(data.senha, salt);

        return this.databaseService.client.user.create({
            data: {
                ...data,
                senha: hashedPassword,
            },
        });
    }

    async findAll(status?: UserStatus): Promise<User[]> {
        return this.databaseService.client.user.findMany({
            where: status ? { status } : undefined,
            orderBy: { dataCadastro: 'desc' },
        });
    }

    async updateStatus(id: string, status: UserStatus): Promise<User> {
        return this.databaseService.client.user.update({
            where: { id },
            data: { status },
        });
    }
}
