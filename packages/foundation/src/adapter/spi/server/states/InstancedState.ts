import { ConfiguredState } from './ConfiguredState'
import { ServerState } from '../ServerState'

export class InstancedState extends ServerState {
  config(config: unknown): ServerState {
    return new ConfiguredState(config, this.adapters)
  }
}
