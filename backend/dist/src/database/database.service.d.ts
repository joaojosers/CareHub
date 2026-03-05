import { OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
export declare class DatabaseService implements OnModuleInit {
    client: PrismaClient;
    constructor();
    onModuleInit(): Promise<void>;
}
