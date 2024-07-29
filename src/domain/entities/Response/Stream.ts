import { Base } from './base'

export class Stream extends Base {
  private _interval: Timer
  public onEvent?: (event: string) => void
  public onClose?: () => void

  constructor() {
    super({
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    })
    this._interval = setInterval(() => {
      if (this.onEvent) this.onEvent(`event: ping\ndata: {}\n\n`)
    }, 55000)
  }

  sendEvent = (html: string) => {
    if (this.onEvent) this.onEvent(`event: message\ndata: ${html}\n\n`)
  }

  close = () => {
    clearInterval(this._interval)
    if (this.onClose) this.onClose()
  }
}

export function isStream(value: unknown): value is Stream {
  return value instanceof Stream
}
