import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

type TableNames = keyof typeof prisma;

export default function db(tableName: string) {
  if (!prisma.hasOwnProperty(tableName)) {
    throw new Error(`Table ${tableName} does not exist`)
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return prisma[tableName as TableNames] as any
}

export async function connect() {
  try {
    await prisma.$connect()
    return true
  } catch (error) {
    console.error(error)
    return false
  }
}
