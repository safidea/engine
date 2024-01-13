import React from 'react'
import { BaseComponentUIProps } from '../base/BaseComponentUI'
import { Record } from '@entities/services/database/record/Record'
import { BaseComponentProps } from '../base/BaseComponentProps'
import { UIStyle } from '@entities/services/ui/UIStyle'

export type Column = {
  label: string
  field: string
  placeholder?: string
}

export interface TableInputComponentProps extends BaseComponentProps {
  label?: string
  addLabel?: string
  onAddRecord: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  onChangeRecord: (event: React.ChangeEvent<HTMLInputElement>, id: string) => void
  onRemoveRecord: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, id: string) => void
  columns: Column[]
  rows: Record[]
  style?: {
    container?: UIStyle
    menu?: UIStyle
    label?: UIStyle
    addLabel?: UIStyle
    table?: UIStyle
    header?: UIStyle
    headerColumn?: UIStyle
    rows?: UIStyle
    row?: UIStyle
    cell?: UIStyle
    remove?: UIStyle
  }
}

export function TableInputComponentUI({
  label,
  addLabel,
  onAddRecord,
  onChangeRecord,
  onRemoveRecord,
  columns,
  rows,
  ui,
  style = {},
}: TableInputComponentProps) {
  const {
    Container,
    Menu,
    Table,
    Header,
    HeaderColumn,
    Label,
    AddButton,
    Rows,
    Row,
    Cell,
    Remove,
  } = ui.getTableInput()
  return (
    <Container style={style.container}>
      {(label || addLabel) && (
        <Menu style={style.menu}>
          {label && <Label label={label} style={style.label} />}
          {addLabel && <AddButton label={addLabel} onClick={onAddRecord} style={style.addLabel} />}
        </Menu>
      )}
      <Table style={style.table}>
        <Header style={style.header}>
          {columns.map((column) => (
            <HeaderColumn key={column.field} label={column.label} style={style.headerColumn} />
          ))}
        </Header>
        <Rows style={style.rows}>
          {rows.map((row) => (
            <Row key={row.id} style={style.row}>
              <>
                {columns.map((column) => (
                  <Cell
                    key={column.field}
                    name={column.field}
                    placeholder={column.placeholder}
                    value={String(row.getFieldValue(column.field) ?? '')}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChangeRecord(e, row.id)}
                    style={style.cell}
                  />
                ))}
              </>
              <Remove
                onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) =>
                  onRemoveRecord(e, row.id)
                }
                style={style.remove}
              />
            </Row>
          ))}
        </Rows>
      </Table>
    </Container>
  )
}

export interface TableInputUILabelProps {
  label: string
  style?: UIStyle
}

export interface TableInputUIAddButtonProps {
  label: string
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  style?: UIStyle
}

export interface TableInputUIHeaderColumnProps {
  label: string
  style?: UIStyle
}

export interface TableInputUICellProps {
  name: string
  placeholder?: string
  value: string
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  style?: UIStyle
}

export interface TableInputUIRemoveProps {
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  style?: UIStyle
}

export interface TableInputUI {
  Container: React.FC<BaseComponentUIProps>
  Menu: React.FC<BaseComponentUIProps>
  Label: React.FC<TableInputUILabelProps>
  AddButton: React.FC<TableInputUIAddButtonProps>
  Table: React.FC<BaseComponentUIProps>
  Header: React.FC<BaseComponentUIProps>
  HeaderColumn: React.FC<TableInputUIHeaderColumnProps>
  Rows: React.FC<BaseComponentUIProps>
  Row: React.FC<BaseComponentUIProps>
  Cell: React.FC<TableInputUICellProps>
  Remove: React.FC<TableInputUIRemoveProps>
}
