import { PrismaClient } from '@prisma/client'

    const prisma = new PrismaClient()

    export default prisma.$extends({
      query: {
        invoice: {
          async create({ args, query }) {
            delete args.data.total_amount
            return query(args)
          },
          async update({ args, query }) {
            delete args.data.total_amount
            return query(args)
          },
          async findMany({ args, query }) {
            const invoices = await query(args)
            if (invoices?.length > 0) {
              for (const invoice of invoices) {
                const { quantity, unit_price } = invoice
                invoice.total_amount = quantity * unit_price
              }
            }
            return invoices
          },
          async findUnique ({ args, query }) {
            const invoice = await query(args)
            if (invoice) {
              const { quantity, unit_price } = invoice
              invoice.total_amount = quantity * unit_price
            }
            return invoice
          }
        },
      },
    })