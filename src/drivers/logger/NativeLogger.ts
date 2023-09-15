import { ILoggerSpi } from '@entities/drivers/logger/LoggerDriver'

export const NativeLogger: ILoggerSpi = (message: string) => {
  console.log(message)
}
