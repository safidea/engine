import type { Driver } from '@adapter/spi/MonitorSpi'

const isTest = process.env.TESTING === 'true'

export class ConsoleDriver implements Driver {
  captureException = (error: Error) => {
    if (!isTest) console.error('Monitor error:', error)
  }

  captureMessage = (message: string) => {
    if (!isTest) console.info('Monitor message:', message)
  }
}
