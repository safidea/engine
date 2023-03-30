import NextAuth from 'next-auth'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from 'foundation-database'
import EmailProvider from 'next-auth/providers/email'

const { EMAIL_SERVER, EMAIL_FROM } = process.env

export default NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    EmailProvider({
      server: EMAIL_SERVER,
      from: EMAIL_FROM,
    }),
  ],
})
