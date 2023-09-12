export interface FormComponentOptions {
  type: 'form'
  table: string
  inputs: InputOptions[]
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
