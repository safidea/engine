import type { Method } from '@domain/entities/request'
import type { Title } from '../base/Title'
import type { Paragraph } from '../base/Paragraph'
import type { Button } from '../base/Button'
import type { Input } from '../base/Input'

export interface Form {
  action: string
  method?: Method
  inputs: Input[]
  buttons: Button[]
  title?: Title
  paragraph?: Paragraph
  successMessage?: string
}

export interface FormComponent extends Form {
  component: 'Form'
}

export interface FormBlock extends FormComponent {
  ref: string
}

export interface FormBlockRef extends Partial<Form> {
  component: 'Form'
  blockRef: string
}