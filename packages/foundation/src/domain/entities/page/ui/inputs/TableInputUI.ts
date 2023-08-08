import { BaseUIProps } from '../BaseUI'

export interface TableInputUILabelProps {
  label: string
}

export interface TableInputUIAddButtonProps {
  label: string
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

export interface TableInputUIHeaderColumnProps {
  label: string
}

export interface TableInputUICellProps {
  name: string
  placeholder?: string
  value: string
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export interface TableInputUI {
  container: React.FC<BaseUIProps>
  menu: React.FC<BaseUIProps>
  label: React.FC<TableInputUILabelProps>
  addButton: React.FC<TableInputUIAddButtonProps>
  table: React.FC<BaseUIProps>
  header: React.FC<BaseUIProps>
  headerColumn: React.FC<TableInputUIHeaderColumnProps>
  rows: React.FC<BaseUIProps>
  row: React.FC<BaseUIProps>
  cell: React.FC<TableInputUICellProps>
}
