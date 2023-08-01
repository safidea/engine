import fs from 'fs-extra'
import { join } from 'path'
import Foundation from '../../src'
import { DatabaseHelper } from './DatabaseHelper'

export class FoundationHelper {
  private foundation: Foundation | undefined
  private readonly folder: string

  constructor(private readonly port: number) {
    this.folder = join(process.cwd(), `specs/tmp/${port}`)
  }

  async start(config: unknown, options?: { server: string; orm: string }): Promise<DatabaseHelper> {
    await fs.ensureDir(this.folder)
    this.foundation = new Foundation(config, this.folder, this.port, options?.server, options?.orm)
    await this.foundation.start()
    return new DatabaseHelper(this.foundation.app, this.foundation.orm)
  }
}
