import { Resource } from './resource.type'
import { Action } from './action.type'

export type Resources = {
  [key: string]: Resource
}

export type Automations = {
  [key: string]: unknown
}

export type Actions = {
  [key: string]: Action
}

export type Config = {
  resources: Resources
  actions: Actions
  automations: Automations
}
