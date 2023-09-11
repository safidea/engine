import { ILoggerSpi } from '@entities/spi/ILoggerSpi'

export const NativeLogger: ILoggerSpi = (message: string) => {
  console.log(message)
}
