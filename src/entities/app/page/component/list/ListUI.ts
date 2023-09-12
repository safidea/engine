import { BaseUIProps } from '../../base/BaseUI'

export interface ListUI {
  container: React.FC<BaseUIProps>
  header: React.FC<BaseUIProps>
  headerColumn: React.FC<ListUIHeaderColumnProps>
  group: React.FC<ListUIGroupProps>
  rows: React.FC<BaseUIProps>
  row: React.FC<ListUIRowProps>
  cell: React.FC<BaseUIProps>
  textCell: React.FC<ListUITextCellProps>
  buttonCell: React.FC<ListUIButtonCellProps>
  linkCell: React.FC<ListUILinkCellProps>
  currencyCell: React.FC<ListUICurrencyFieldCellProps>
}

export interface ListUIHeaderColumnProps {
  label: string
}

export interface ListUIGroupProps {
  label: string
  colSpan: number
}

export interface ListUIRowProps extends BaseUIProps {
  id: string
}

export interface ListUITextCellProps {
  value: string
}

export interface ListUICurrencyFieldCellProps {
  value: number
  currency: '€'
}

export interface ListUIButtonCellProps {
  label: string
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

export interface ListUILinkCellProps {
  label: string
}
