import type { Driver } from '@adapter/spi/MonitorSpi'

export class ConsoleDriver implements Driver {
  captureException = (error: Error) => {
    console.error('Monitor error:', error)
  }

  captureMessage = (message: string) => {
    console.log('Monitor message:', message)
  }
}
