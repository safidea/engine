import * as t from 'io-ts'
import { ComponentParams } from '../ComponentParams'
import { BaseComponentParams } from '../base/BaseComponentParams'
import { UIStyle } from '@entities/services/ui/UIStyle'

export interface FormComponentParams extends BaseComponentParams {
  type: 'form'
  table: string
  components: ComponentParams[]
  submit: {
    label?: string
    loadingLabel: string
    autosave?: boolean
    actionsOnSuccess?: {
      type: string
      path: string
    }[]
  }
  recordIdToUpdate?: string
  style?: {
    form?: UIStyle
    submit?: UIStyle
    loading?: UIStyle
    errorMessage?: UIStyle
  }
}

export const FormComponentParams: t.Type<FormComponentParams> = t.recursion(
  'FormComponentParams',
  () =>
    t.intersection([
      BaseComponentParams,
      t.type({
        type: t.literal('form'),
        table: t.string,
        components: t.array(ComponentParams),
        submit: t.intersection([
          t.type({
            loadingLabel: t.string,
          }),
          t.partial({
            label: t.string,
            autosave: t.boolean,
            actionsOnSuccess: t.array(
              t.type({
                type: t.string,
                path: t.string,
              })
            ),
          }),
        ]),
      }),
      t.partial({
        recordIdToUpdate: t.string,
        style: t.partial({
          form: UIStyle,
          submit: UIStyle,
          loading: UIStyle,
          errorMessage: UIStyle,
        }),
      }),
    ])
)
