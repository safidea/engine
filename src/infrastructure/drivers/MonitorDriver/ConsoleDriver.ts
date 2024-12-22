import type { IMonitorDriver } from '@adapter/spi/drivers/MonitorSpi'

export class ConsoleDriver implements IMonitorDriver {
  captureException = (error: Error) => {
    console.error('Monitor error:', error)
  }

  captureMessage = (message: string) => {
    console.log('Monitor message:', message)
  }
}
