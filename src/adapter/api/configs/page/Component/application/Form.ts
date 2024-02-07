import type { Props } from '@domain/entities/page/component/application/Form'

export interface Form extends Omit<Props, 'errorMessage'> {
  component: 'Form'
}
