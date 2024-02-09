export interface Mailer {
  host: string
  port: number
  user: string
  pass: string
  secure?: boolean
}