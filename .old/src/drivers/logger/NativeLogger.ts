import { ILoggerDriver } from '@adapters/mappers/logger/ILoggerDriver'

export class NativeLogger implements ILoggerDriver {
  async log(message: string) {
    console.log(message)
  }
}
