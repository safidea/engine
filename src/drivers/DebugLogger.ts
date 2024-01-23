import debug from 'debug'

export class DebugLogger {
  init(location: string) {
    const log = debug(`engine:${location}`)
    return (message: string) => log(message)
  }
}
