export interface Mailer {
  host: string
  port: string
  user: string
  pass: string
  from: string
  secure?: boolean
}
