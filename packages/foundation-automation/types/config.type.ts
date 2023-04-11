import { Resource } from './resource.type'
import { Action } from './action.type'
import { Automation } from './automation.type'

export type Resources = {
  [key: string]: Resource
}

export type Automations = {
  [key: string]: Automation
}

export type Actions = {
  [key: string]: Action
}

export type Config = {
  resources: Resources
  actions: Actions
  automations: Automations
}
