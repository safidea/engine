import React from 'react'
import {
  IUIGateway,
  ListUIGroupProps,
  ListUIHeaderColumnProps,
  ListUITextCellProps,
  ListUIButtonCellProps,
  ListUILinkCellProps,
  ListUIRowProps,
  UIProps,
} from '@domain/gateways/IUIGateway'

const ListUI: IUIGateway['ListUI'] = {
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
  buttonCell: ({ label }: ListUIButtonCellProps) => {
    return <button>{label}</button>
  },
  linkCell: ({ label }: ListUILinkCellProps) => {
    return <a href="#">{label}</a>
  },
}

export default ListUI
