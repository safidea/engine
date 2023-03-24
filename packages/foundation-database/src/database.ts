import { PrismaClient } from '@prisma/client'

import generateSchema from './generate-schema'
import { DatabaseConfig } from '../types/database.type'

export default class Database {
  private prisma: PrismaClient | null = null;
  public ready: Promise<void>;

  constructor (config: DatabaseConfig) {
    this.ready = this.initialize(config)
  }

  async initialize(config: DatabaseConfig)  {
    await generateSchema(config)
    this.prisma = new PrismaClient()
  }

}