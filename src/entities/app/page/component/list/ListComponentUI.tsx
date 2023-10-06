import React, { Fragment } from 'react'
import { BaseComponentUIProps } from '../base/BaseComponentUI'
import { Record } from '@entities/services/database/record/Record'
import { Column } from './ListComponentParams'
import { BaseComponentProps } from '../base/BaseComponentProps'
import { UIStyle } from '@entities/services/ui/UIStyle'

export interface ListRowComponentProps extends BaseComponentProps {
  record: Record
  columns: Column[]
  getCellByFormat: (column: Column, record: Record) => JSX.Element
  style?: {
    row?: UIStyle
    cell?: UIStyle
  }
}

export function ListRowComponentUI({
  record,
  ui,
  columns,
  getCellByFormat,
  style = {},
}: ListRowComponentProps) {
  const { Row, Cell } = ui.getList()
  return (
    <Row id={record.id} style={style.row}>
      {columns.map((column: Column, index: number) => {
        return (
          <Cell key={index} style={style.cell}>
            {getCellByFormat(column, record)}
          </Cell>
        )
      })}
    </Row>
  )
}

export interface GroupType {
  name: string
  label: string
  records: Record[]
}

export interface ListComponentProps extends BaseComponentProps {
  records: Record[]
  columns: Column[]
  groups: GroupType[]
  getCellByFormat: (column: Column, record: Record) => JSX.Element
  style?: {
    container?: UIStyle
    header?: UIStyle
    headerColumn?: UIStyle
    rows?: UIStyle
    group?: UIStyle
    row?: UIStyle
    cell?: UIStyle
  }
}

export function ListComponentUI({
  columns,
  records,
  groups,
  ui,
  getCellByFormat,
  style = {},
}: ListComponentProps) {
  const { Container, Header, Rows, Group, HeaderColumn } = ui.getList()
  return (
    <Container style={style.container}>
      <Header style={style.header}>
        {columns.map((column: Column, index: number) => {
          return <HeaderColumn label={column.label} key={index} style={style.headerColumn} />
        })}
      </Header>
      <Rows style={style.rows}>
        {groups.length > 0
          ? groups.map((group) => (
              <Fragment key={group.name}>
                <Group colSpan={columns.length} label={group.label} style={style.group} />
                {group.records.map((record) => (
                  <ListRowComponentUI
                    key={record.id}
                    record={record}
                    columns={columns}
                    ui={ui}
                    getCellByFormat={getCellByFormat}
                    style={style}
                  />
                ))}
              </Fragment>
            ))
          : records.map((record: Record) => (
              <ListRowComponentUI
                key={record.id}
                record={record}
                columns={columns}
                ui={ui}
                getCellByFormat={getCellByFormat}
                style={style}
              />
            ))}
      </Rows>
    </Container>
  )
}

export interface ListUI {
  Container: React.FC<BaseComponentUIProps>
  Header: React.FC<BaseComponentUIProps>
  HeaderColumn: React.FC<ListUIHeaderColumnProps>
  Group: React.FC<ListUIGroupProps>
  Rows: React.FC<BaseComponentUIProps>
  Row: React.FC<ListUIRowProps>
  Cell: React.FC<BaseComponentUIProps>
  TextCell: React.FC<ListUITextCellProps>
  ButtonCell: React.FC<ListUIButtonCellProps>
  LinkCell: React.FC<ListUILinkCellProps>
  CurrencyCell: React.FC<ListUICurrencyFieldCellProps>
}

export interface ListUIHeaderColumnProps {
  label: string
  style?: UIStyle
}

export interface ListUIGroupProps {
  label: string
  colSpan: number
  style?: UIStyle
}

export interface ListUIRowProps extends BaseComponentUIProps {
  id: string
}

export interface ListUITextCellProps {
  value: string
  style?: UIStyle
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
