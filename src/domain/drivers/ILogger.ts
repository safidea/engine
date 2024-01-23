export type ILoggerLog = (message: string) => void

export interface ILogger {
  init(location: string): ILoggerLog
}
