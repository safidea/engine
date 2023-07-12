import { ComponentInterface } from '../interfaces/component.interface'
import { CommonProps } from './common.type'

export type FormSubmit = {
  label?: string
  savingLabel: string
  autosave?: boolean
  type?: 'create' | 'update' | 'upsert'
  actionsOnSuccess: {
    type: string
    path: string
  }[]
}

export type FormField = {
  key: string
  type: string
  label?: string
  placeholder?: string
  table?: string
  multiple?: boolean
  fields?: FormField[]
  addLabel?: string
  submit: {
    type: 'create' | 'update' | 'upsert'
  }
}

export type Form = {
  table: string
  // TODO: infer the type from the json schema
  fields: FormField[]
  router: {
    push: (path: string) => void
  }
  submit: FormSubmit
}

export type FormProps = CommonProps & Form

export type FormConfig = ComponentInterface & Form
