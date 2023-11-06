import * as t from 'io-ts'
import { ComponentParams } from '../ComponentParams'
import { BaseComponentParams } from '../base/BaseComponentParams'
import { UIStyle } from '@entities/services/ui/UIStyle'

export interface FormComponentParams extends BaseComponentParams {
  readonly type: 'form'
  readonly table: string
  readonly components: ComponentParams[]
  readonly submit: {
    readonly label?: string
    readonly loadingLabel: string
    readonly autosave?: boolean
    readonly actionsOnSuccess?: {
      readonly type: string
      readonly path: string
    }[]
  }
  readonly recordIdToUpdate?: string
  readonly style?: {
    readonly form?: UIStyle
    readonly submit?: UIStyle
    readonly loading?: UIStyle
    readonly errorMessage?: UIStyle
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
