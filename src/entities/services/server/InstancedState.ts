import { ConfiguredState } from './ConfiguredState'
import { ServerState } from './ServerState'

//TODO: Faire fusionner InstancedState avec ConfiguredState

export class InstancedState extends ServerState {
  // TODO: ajouter la convention "fromJSONConfig"
  config(config: unknown): ServerState {
    return new ConfiguredState(config, this.adapters)
  }
}
