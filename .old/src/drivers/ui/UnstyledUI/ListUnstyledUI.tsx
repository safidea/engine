import React from 'react'
import { ListUI } from '@entities/app/page/component/list/ListComponentUI'

const ListUnstyledUI: ListUI = {
  Container: ({ children }) => {
    return <table>{children}</table>
  },
  Header: ({ children }) => {
    return (
      <thead>
        <tr>{children}</tr>
      </thead>
    )
  },
  HeaderColumn: ({ label }) => {
    return <th>{label}</th>
  },
  Group: ({ label, colSpan }) => {
    return (
      <tr>
        <th colSpan={colSpan}>{label}</th>
      </tr>
    )
  },
  Rows: ({ children }) => {
    return <tbody>{children}</tbody>
  },
  Row: ({ children, id }) => {
    return <tr id={id}>{children}</tr>
  },
  Cell: ({ children }) => {
    return <td>{children}</td>
  },
  TextCell: ({ value }) => {
    return <>{value}</>
  },
  ButtonCell: ({ label, onClick }) => {
    return <button onClick={onClick}>{label}</button>
  },
  LinkCell: ({ label }) => {
    return <a href="#">{label}</a>
  },
  CurrencyCell: ({ value, currency }) => {
    return (
      <>
        {value}
        {currency}
      </>
    )
  },
}

export default ListUnstyledUI
