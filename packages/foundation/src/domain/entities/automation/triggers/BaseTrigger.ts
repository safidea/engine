export type TriggerEvent = 'record_created' | 'record_updated' | 'server_started' | 'server_stopped'

export class BaseTrigger {
  constructor(private _event: TriggerEvent) {}

  get event(): TriggerEvent {
    return this._event
  }
}
