import type { BrowserPage } from '@domain/services/BrowserPage'
import type { Event } from '../Event'
import type { Expect } from '../Expect'
import type { App } from '../App'
import { TestError } from '@domain/entities/Error/Test'

interface Config {
  name: string
}

interface Entities {
  when: Event[]
  then: Expect[]
}

export class Test {
  public name: string

  constructor(
    config: Config,
    private _entities: Entities
  ) {
    const { name } = config
    this.name = name
  }

  run = async (app: App, page: BrowserPage): Promise<void> => {
    const { when, then } = this._entities
    try {
      const context: { [key: string]: object } = {}
      for (const event of when) {
        const result = await event.execute(app, page)
        if (result && 'name' in event && event.name) {
          context[event.name] = result
        }
      }
      for (const expect of then) await expect.execute(app, page, context)
      await app.stop()
    } catch (error) {
      if (error instanceof TestError) {
        error.setName(this.name)
      }
      await app.stop()
      throw error
    }
  }
}
