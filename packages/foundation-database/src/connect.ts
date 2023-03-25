import prisma from './database'

export async function connect() {
  try {
    await prisma.$connect()
    return true
  } catch(error) {
    console.error(error)
    return false
  }
}
