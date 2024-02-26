import type { Auth } from './Auth'
import type { Database } from './Database'
import type { Feature } from './Feature'
import type { Mailer } from './Mailer'
import type { Server } from './Server'
import type { Block } from './Block'

export interface App {
  name: string
  features: Feature[]
  translations?: {
    language: 'EN'
    texts: string[]
  }[]
  server?: Server
  database?: Database
  mailer?: Mailer
  auth?: Auth
  blocks?: Block[]
}

export type AppSchema = App
