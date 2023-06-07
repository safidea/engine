import { DatabaseRowType } from 'shared-database'

type DbType = {
  [key: string]: DatabaseRowType[]
}

class PrismaClient {
  private db: DbType = {
    invoices: [],
  }

  invoice: any = {
    create: jest.fn(({ data }) => {
      data.id = this.db.invoices.length + 1
      data.createdAt = new Date()
      this.db.invoices.push(data)
      return data
    }),
    update: jest.fn(({ data, where }) => {
      const index = this.db.invoices.findIndex((invoice) => invoice.id === where.id)
      this.db.invoices[index] = { ...this.db.invoices[index], ...data }
      return data
    }),
    upsert: jest.fn(({ where, create, update }) => {
      const index = this.db.invoices.findIndex((invoice) => invoice.id === where.id)
      if (index === -1) {
        return this.invoice.create({ data: create })
      }
      return this.invoice.update({ data: update, where })
    }),
    findUnique: jest.fn(({ where }) => {
      return this.db.invoices.find((invoice) => invoice.id === where.id)
    }),
    delete: jest.fn(({ where }) => {
      const index = this.db.invoices.findIndex((invoice) => invoice.id === where.id)
      this.db.invoices.splice(index, 1)
      return this.db.invoices[index]
    }),
    findMany: jest.fn(() => {
      return this.db.invoices
    }),
  }
}

export { PrismaClient }
