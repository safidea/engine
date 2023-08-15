import { ILogSpi } from '@domain/spi/ILogSpi'

export const NativeLog: ILogSpi = (message: string) => {
  console.log(message)
}
