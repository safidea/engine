import fs from 'fs-extra'
import { join } from 'path'
import Foundation from '../../src/Foundation'
import { DatabaseHelper } from './DatabaseHelper'
import { nanoid } from 'nanoid'

export class FoundationHelper {
  private foundation: Foundation

  constructor() {
    const folder = join(process.cwd(), `specs/tmp/${nanoid(10)}`)
    fs.ensureDirSync(folder)
    this.foundation = new Foundation({ folder })
  }

  async start(): Promise<{ url: string; port: number }> {
    return this.foundation.start()
  }

  async config(config: unknown): Promise<DatabaseHelper> {
    const app = await this.foundation.config(config)
    return new DatabaseHelper(app, this.foundation.getOrm())
  }
}
