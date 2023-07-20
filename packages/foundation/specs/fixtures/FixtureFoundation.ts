import fs from 'fs-extra'
import { join } from 'path'
import { AppDto } from '@application/dtos/AppDto'
import { Foundation } from '@infrastructure/foundation'
import { FixtureDatabase } from './FixtureDatabase'

export class FixtureFoundation {
  private foundation: Foundation | undefined
  private readonly folder: string

  constructor(private readonly port: number) {
    this.folder = join(process.cwd(), `specs/tmp/${port}`)
  }

  async start(appDto: AppDto, options?: { server: string; orm: string }): Promise<FixtureDatabase> {
    await fs.ensureDir(this.folder)
    this.foundation = new Foundation(appDto, this.folder, this.port, options?.server, options?.orm)
    await this.foundation.start()
    return new FixtureDatabase(this.foundation.app, this.foundation.orm, this.foundation.codegen)
  }

  async stop(): Promise<void> {
    await this.foundation?.stop()
    await fs.remove(this.folder)
  }
}
