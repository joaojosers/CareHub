import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { User, Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
    constructor(private databaseService: DatabaseService) { }

    async findByEmail(email: string): Promise<User | null> {
        return this.databaseService.client.user.findUnique({
            where: { email },
        });
    }

    async create(data: Prisma.UserCreateInput): Promise<User> {
        return this.databaseService.client.user.create({
            data,
        });
    }
}
