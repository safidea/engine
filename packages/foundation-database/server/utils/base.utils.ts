import prisma from './prisma.utils'
import { ConfigService } from 'foundation-common/server'
import { getPrismaModelName } from './schema.utils'
import { Base } from '../../types'

export default function base(tableName: string): Base {
  let model = ConfigService.get(`tables.${tableName}.model`) as string
  if (!model) model = getPrismaModelName(tableName)
  return prisma[model.toLowerCase() as keyof typeof prisma] as unknown as Base
}
