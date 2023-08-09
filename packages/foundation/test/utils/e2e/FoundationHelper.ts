import Foundation from '../../../src/Foundation'
import { DatabaseHelper } from './DatabaseHelper'
import { getDedicatedTmpFolder } from '../helpers/tmp'

export class FoundationHelper {
  private foundation: Foundation

  constructor() {
    const folder = getDedicatedTmpFolder()
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
