import React from 'react'
import { IUISpi } from '@entities/drivers/ui/IUISpi'
import { BaseComponentUIProps } from '../../../base/BaseComponentUI'
import { Record } from '@entities/drivers/database/record/Record'

export type Column = {
  label: string
  field: string
  placeholder?: string
}

export interface TableInputComponentUIProps {
  label?: string
  addLabel?: string
  onAddRecord: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  onChangeRecord: (event: React.ChangeEvent<HTMLInputElement>, id: string) => void
  onRemoveRecord: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, id: string) => void
  columns: Column[]
  rows: Record[]
  ui: IUISpi
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
}: TableInputComponentUIProps) {
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
  } = ui.TableInputUI
  return (
    <Container>
      {(label || addLabel) && (
        <Menu>
          {label && <Label label={label} />}
          {addLabel && <AddButton label={addLabel} onClick={onAddRecord} />}
        </Menu>
      )}
      <Table>
        <Header>
          {columns.map((column) => (
            <HeaderColumn key={column.field} label={column.label} />
          ))}
        </Header>
        <Rows>
          {rows.map((row) => (
            <Row key={row.id}>
              <>
                {columns.map((column) => (
                  <Cell
                    key={column.field}
                    name={column.field}
                    placeholder={column.placeholder}
                    value={String(row.getFieldValue(column.field) ?? '')}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChangeRecord(e, row.id)}
                  />
                ))}
              </>
              <Remove
                onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) =>
                  onRemoveRecord(e, row.id)
                }
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

export interface TableInputUIRemoveProps {
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
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
