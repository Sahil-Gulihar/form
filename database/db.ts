
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
    globalForPrisma.prisma ||
    new PrismaClient({
        transactionOptions: {
            maxWait: 30000, // 30 seconds in milliseconds
            timeout: 30000,
        },
    });

if (process.env.NODE_ENV === "development") {
    globalForPrisma.prisma = prisma;
}
