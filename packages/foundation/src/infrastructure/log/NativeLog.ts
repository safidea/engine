import { ILogAdapter } from '@adapter/spi/log/ILogAdapter'

export const NativeLog: ILogAdapter = (message: string) => {
  console.log(message)
}
