import { InputComponentOptions } from './input/InputComponentOptions'

export interface FormComponentOptions {
  type: 'form'
  table: string
  inputs: InputComponentOptions[]
  recordIdToUpdate?: string
  submit: {
    label?: string
    autosave?: boolean
    loadingLabel: string
    actionsOnSuccess?: {
      type: string
      path: string
    }[]
  }
}
