import { ILoggerService } from '@entities/services/logger/ILoggerService'

export class NativeLogger implements ILoggerService {
  async log(message: string) {
    console.log(message)
  }
}
