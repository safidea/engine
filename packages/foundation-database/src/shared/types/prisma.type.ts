import type { PrismaClientInterface } from '@database'

export type PrismaClientType = { [key: string]: PrismaClientInterface }
export type PrismaClientsType = { [key: string]: PrismaClientType }
