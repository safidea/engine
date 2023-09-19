import * as t from 'io-ts'
import { InputComponentParams } from './input/InputComponentParams'

export const FormComponentParams = t.intersection([
  t.type({
    type: t.literal('form'),
    table: t.string,
    inputs: t.array(InputComponentParams),
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
  }),
])

export type FormComponentParams = t.TypeOf<typeof FormComponentParams>
