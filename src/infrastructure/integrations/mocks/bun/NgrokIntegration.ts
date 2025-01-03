import type { INgrokIntegration } from '@adapter/spi/integrations/NgrokSpi'
import type { NgrokConfig } from '@domain/integrations/Ngrok'
import { Database } from 'bun:sqlite'

export class NgrokIntegration implements INgrokIntegration {
  private db: Database

  constructor(private _config?: NgrokConfig) {
    this.db = new Database('file::memory:?cache=shared')
    this.db.run(`
      CREATE TABLE IF NOT EXISTS Config (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL
      )
    `)
    if (this._config) {
      this.saveConfig(this._config)
    }
  }

  private saveConfig = (config: NgrokConfig): void => {
    this.db.run(
      `
      INSERT OR REPLACE INTO Config (key, value)
      VALUES ('authToken', ?)
    `,
      [config.authToken]
    )
  }

  private getConfigFromDb = (): NgrokConfig => {
    const result = this.db
      .query<{ value: string }, []>(`SELECT value FROM Config WHERE key = 'authToken'`)
      .get()
    if (!result) {
      throw new Error('Ngrok config not set in database')
    }
    return { authToken: result.value }
  }

  getConfig = (): NgrokConfig => {
    if (this._config) {
      return this._config
    }
    return this.getConfigFromDb()
  }

  start = async (port: number): Promise<string> => {
    const url = `http://localhost:${port}`
    this.db.run(
      `
      INSERT INTO Config (key, value)
      VALUES ('lastStartedUrl', ?)
      ON CONFLICT(key) DO UPDATE SET value = excluded.value
    `,
      [url]
    )
    return url
  }

  stop = async (): Promise<void> => {
    this.db.run(`
      DELETE FROM Config WHERE key = 'lastStartedUrl'
    `)
  }
}
