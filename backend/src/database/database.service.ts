import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as pg from 'pg';

@Injectable()
export class DatabaseService implements OnModuleInit {
    public client: PrismaClient;

    constructor() {
        const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
        const adapter = new PrismaPg(pool);
        this.client = new PrismaClient({ adapter });
    }

    async onModuleInit() {
        await this.client.$connect();
    }
}
