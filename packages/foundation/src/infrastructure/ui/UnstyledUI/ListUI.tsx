import React from 'react'
import {
  UI,
  ListUIGroupProps,
  ListUIHeaderColumnProps,
  ListUITextCellProps,
  ListUIButtonCellProps,
  ListUILinkCellProps,
  ListUIRowProps,
  ListUICurrencyCellProps,
  UIProps,
} from '@adapter/spi/ui/UI'

const ListUI: UI['ListUI'] = {
  container: ({ children }: UIProps) => {
    return <table>{children}</table>
  },
  header: ({ children }: UIProps) => {
    return (
      <thead>
        <tr>{children}</tr>
      </thead>
    )
  },
  headerColumn: ({ label }: ListUIHeaderColumnProps) => {
    return <th>{label}</th>
  },
  group: ({ label, colSpan }: ListUIGroupProps) => {
    return (
      <tr>
        <th colSpan={colSpan}>{label}</th>
      </tr>
    )
  },
  rows: ({ children }: UIProps) => {
    return <tbody>{children}</tbody>
  },
  row: ({ children, id }: ListUIRowProps) => {
    return <tr id={id}>{children}</tr>
  },
  cell: ({ children }: UIProps) => {
    return <td>{children}</td>
  },
  textCell: ({ value }: ListUITextCellProps) => {
    return <>{value}</>
  },
  buttonCell: ({ label, onClick }: ListUIButtonCellProps) => {
    return <button onClick={onClick}>{label}</button>
  },
  linkCell: ({ label }: ListUILinkCellProps) => {
    return <a href="#">{label}</a>
  },
  currencyCell: ({ value, currency }: ListUICurrencyCellProps) => {
    return (
      <>
        {value}
        {currency}
      </>
    )
  },
}

export default ListUI
