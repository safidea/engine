import * as t from 'io-ts'
import { BaseComponentParams } from '../base/BaseComponentParams'
import { UIStyle } from '@entities/services/ui/UIStyle'

export interface TableInputComponentParams extends BaseComponentParams {
  readonly type: 'table_input'
  readonly field: string
  readonly columns: {
    readonly label: string
    readonly field: string
    readonly placeholder?: string
  }[]
  readonly addLabel: string
  readonly label?: string
  readonly placeholder?: string
  readonly style?: {
    readonly container?: UIStyle
    readonly menu?: UIStyle
    readonly label?: UIStyle
    readonly addLabel?: UIStyle
    readonly table?: UIStyle
    readonly header?: UIStyle
    readonly headerColumn?: UIStyle
    readonly rows?: UIStyle
    readonly row?: UIStyle
    readonly cell?: UIStyle
    readonly remove?: UIStyle
  }
}

export const TableInputComponentParams: t.Type<TableInputComponentParams> = t.intersection([
  BaseComponentParams,
  t.type({
    type: t.literal('table_input'),
    field: t.string,
    columns: t.array(
      t.intersection([
        t.type({
          label: t.string,
          field: t.string,
        }),
        t.partial({ placeholder: t.string }),
      ])
    ),
    addLabel: t.string,
  }),
  t.partial({
    label: t.string,
    placeholder: t.string,
    style: t.partial({
      container: UIStyle,
      menu: UIStyle,
      label: UIStyle,
      addLabel: UIStyle,
      table: UIStyle,
      header: UIStyle,
      headerColumn: UIStyle,
      rows: UIStyle,
      row: UIStyle,
      cell: UIStyle,
      remove: UIStyle,
    }),
  }),
])
