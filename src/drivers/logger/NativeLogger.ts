import { ILoggerSpi } from '@adapters/services/logger/ILoggerDriver'

export const NativeLogger: ILoggerSpi = (message: string) => {
  console.log(message)
}
