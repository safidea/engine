import type { PrismaClientInterface } from '../interfaces/prisma.interface'

export type PrismaClientType = { [key: string]: PrismaClientInterface }
export type PrismaClientsType = { [key: string]: PrismaClientType }
