import fs from 'fs-extra'
import { join } from 'path'
import { Foundation } from '@infrastructure/foundation'
import { FixtureDatabase } from './FixtureDatabase'

export class FixtureFoundation {
  private foundation: Foundation | undefined
  private readonly folder: string

  constructor(private readonly port: number) {
    this.folder = join(process.cwd(), `specs/tmp/${port}`)
  }

  async start(
    config: unknown,
    options?: { server: string; orm: string }
  ): Promise<FixtureDatabase> {
    await fs.ensureDir(this.folder)
    this.foundation = new Foundation(config, this.folder, this.port, options?.server, options?.orm)
    await this.foundation.start()
    return new FixtureDatabase(this.foundation.app, this.foundation.orm)
  }

  async stop(): Promise<void> {
    if (!this.foundation) throw new Error('Foundation not started')
    await this.foundation.stop()
    await fs.remove(this.folder)
  }
}
