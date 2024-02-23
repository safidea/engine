import { ILoggerDriver } from '@adapters/mappers/logger/ILoggerDriver'
import { NativeLogger } from './NativeLogger'

export type LoggerDrivers = 'native'

export function getLoggerDriver(logger: LoggerDrivers = 'native'): ILoggerDriver {
  switch (logger) {
    case 'native':
      return new NativeLogger()
    default:
      throw new Error(`Logger driver '${logger}' not found`)
  }
}
