import fs from 'fs-extra'
import { execSync } from 'child_process'
import { Pool } from 'pg'
import { join } from 'path'
import http from 'http'
import buildApp from '../utils/build-app.utils'

import type { AppInterface } from '../utils/build-app.utils'

const pathToDockerCompose = join(__dirname, '../../docker-compose.yml')
const pgDefaultCredentials = {
  host: '0.0.0.0',
  user: 'admin',
  password: 'admin',
  database: 'master',
  port: '5432',
}

class App {
  private path: string
  private name: string
  public port: string
  private pg: Pool

  constructor({ config, env = {} }: AppInterface) {
    env.PRISMA_BINARY_TARGETS = env.PRISMA_BINARY_TARGETS ?? 'native,linux-musl-openssl-3.0.x'
    env.DATABASE_HOST = env.DATABASE_HOST ?? pgDefaultCredentials.host
    env.DATABASE_PORT = env.DATABASE_PORT ?? pgDefaultCredentials.port
    env.DATABASE_NAME = env.DATABASE_NAME ?? pgDefaultCredentials.database
    env.DATABASE_USER = env.DATABASE_USER ?? pgDefaultCredentials.user
    env.DATABASE_PASSWORD = env.DATABASE_PASSWORD ?? pgDefaultCredentials.password
    env.DATABASE_URL =
      env.DATABASE_URL ??
      `postgresql://${env.DATABASE_USER}:${env.DATABASE_PASSWORD}@db/${env.DATABASE_NAME}`
    config.database = config.database ?? {
      url: '${DATABASE_URL}',
      provider: 'postgresql',
    }
    const { path, port, name } = buildApp({ config, env }, 'e2e')
    this.port = port
    this.path = path
    this.name = name
    this.pg = new Pool({
      host: env.DATABASE_HOST,
      port: Number(env.DATABASE_PORT),
      user: env.DATABASE_USER,
      password: env.DATABASE_PASSWORD,
      database: env.DATABASE_NAME,
    })
    fs.copyFileSync(pathToDockerCompose, join(this.path, 'docker-compose.yml'))
  }

  public async start(): Promise<void> {
    const url = 'http://localhost:' + this.port
    const envPath = join(this.path, '.env')
    const dockerComposePath = join(this.path, 'docker-compose.yml')
    execSync(`docker compose --env-file ${envPath} -f ${dockerComposePath} up -d`, {
      stdio: 'inherit',
    })
    console.log(`Waiting for app ${this.name} to start...`)
    await new Promise<void>((resolve, reject) => {
      let retries = 0
      const testUrl = async () => {
        await new Promise((resolve) => setTimeout(resolve, 5000))
        if (retries++ > 30) {
          reject(new Error(`${url} is not available`))
        }
        http
          .get(url, (res) => {
            if (res.statusCode === 200) {
              resolve()
            } else {
              testUrl()
            }
          })
          .on('error', testUrl)
      }
      testUrl()
    })
    console.log(`App ${this.name} started on`, url)
  }

  public async stop(): Promise<void> {
    await this.pg.end()
    execSync(`docker compose -f ${join(this.path, 'docker-compose.yml')} down`, {
      stdio: 'inherit',
    })
  }

  public async clear(): Promise<void> {
    const client = await this.pg.connect()
    try {
      const { rows } = await client.query(`
        SELECT tablename 
        FROM pg_tables
        WHERE schemaname = 'public';
      `)
      await client.query('BEGIN')
      await client.query('SET CONSTRAINTS ALL DEFERRED')
      for (const row of rows) {
        await client.query(`TRUNCATE TABLE ${row.tablename} RESTART IDENTITY CASCADE;`)
      }
      await client.query('COMMIT')
    } catch (error) {
      console.error('Error clearing database:', error)
      await client.query('ROLLBACK')
    } finally {
      client.release()
    }
  }
}

export default App
