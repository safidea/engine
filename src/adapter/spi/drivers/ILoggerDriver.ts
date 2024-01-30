export type ILoggerLog = (message: string) => void

export interface ILoggerDriver {
  log: (message: string) => void
}
