import type { Props } from '@domain/engine/page/component/application/Form'

export interface Form extends Omit<Props, 'errorMessage'> {
  component: 'Form'
}
