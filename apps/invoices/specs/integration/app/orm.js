import { v4 as uuidv4 } from 'uuid'

class JsonOrm {
  _db = {
    invoices: [],
  }

  invoice = {
    findUnique: async ({ where: { id } }) => {
      return this._db.invoices.find((row) => row.id === id)
    },
    findMany: async () => {
      return this._db.invoices
    },
    create: async ({ data }) => {
      const row = {
        ...data,
        id: uuidv4(),
        created_at: new Date().toISOString(),
      }
      this._db.invoices.push(row)
      return row
    },
    createMany: async ({ data }) => {
      return Promise.all(data.map((row) => this.create({ data: row })))
    },
    update: async ({ where: { id }, data }) => {
      const index = this._db.invoices.findIndex((row) => row.id === id)
      this._db.invoices[index] = { ...this._db.invoices[index], ...data }
      return this._db.invoices[index]
    },
    upsert: async ({ where: { id }, create, update }) => {
      const index = this._db.invoices.findIndex((row) => row.id === id)
      if (index === -1) {
        return this.create({ data: create })
      }
      return this.update({ where: { id }, data: update })
    },
    delete: async ({ where: { id } }) => {
      const row = this._db.invoices.find((row) => row.id === id)
      this._db.invoices = this._db.invoices.filter((row) => row.id !== id)
      return row
    },
  }
}

export default new JsonOrm()
