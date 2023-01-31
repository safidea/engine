import { ActionInOutput } from './inoutput.action.api.type'

export type Action = {
  name: string
  service: string
  type: string
  input: ActionInOutput
  output: ActionInOutput
}