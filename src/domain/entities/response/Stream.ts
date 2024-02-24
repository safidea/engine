import { Base } from './base'

export class Stream extends Base {
  private interval: Timer
  private callback?: (event: string) => void

  constructor() {
    super({
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    })
    this.interval = setInterval(() => {
      this.sendEvent(`event: ping\ndata: {}\n\n`)
    }, 55000)
  }

  onEvent = (callback: (message: string) => void) => {
    this.callback = callback
  }

  sendEvent = (html: string) => {
    if (this.callback) this.callback(`event: message\ndata: ${html}\n\n`)
  }

  close = () => {
    clearInterval(this.interval)
  }
}

export function isStream(value: unknown): value is Stream {
  return value instanceof Stream
}
