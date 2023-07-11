import { ComponentInterface } from '../interfaces/component.interface'
import { CommonProps } from './common.type'

export type Form = {
  table: string
  // TODO: infer the type from the json schema
  fields: {
    key: string
    label: string
    type: string
  }[]
  router: {
    push: (path: string) => void
  }
  submit: {
    label?: string
    savingLabel: string
    autosave?: boolean
    type?: 'create' | 'update' | 'upsert'
    actionsOnSuccess: {
      type: string
      path: string
    }[]
  }
}

export type FormProps = CommonProps & Form

export type FormConfig = ComponentInterface & Form
