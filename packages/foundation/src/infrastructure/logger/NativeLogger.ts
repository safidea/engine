import { ILoggerSpi } from '@domain/spi/ILoggerSpi'

export const NativeLogger: ILoggerSpi = (message: string) => {
  console.log(message)
}
