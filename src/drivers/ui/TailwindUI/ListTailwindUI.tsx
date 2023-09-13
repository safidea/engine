import React from 'react'
import { IUISpi } from '@entities/drivers/ui/IUISpi'

const ListTailwindUI: IUISpi['ListUI'] = {
  container: ({ children }) => {
    return <table>{children}</table>
  },
  header: ({ children }) => {
    return (
      <thead>
        <tr>{children}</tr>
      </thead>
    )
  },
  headerColumn: ({ label }) => {
    return <th>{label}</th>
  },
  group: ({ label, colSpan }) => {
    return (
      <tr>
        <th colSpan={colSpan}>{label}</th>
      </tr>
    )
  },
  rows: ({ children }) => {
    return <tbody>{children}</tbody>
  },
  row: ({ children, id }) => {
    return <tr id={id}>{children}</tr>
  },
  cell: ({ children }) => {
    return <td>{children}</td>
  },
  textCell: ({ value }) => {
    return <>{value}</>
  },
  buttonCell: ({ label, onClick }) => {
    return <button onClick={onClick}>{label}</button>
  },
  linkCell: ({ label }) => {
    return <a href="#">{label}</a>
  },
  currencyCell: ({ value, currency }) => {
    return (
      <>
        {value}
        {currency}
      </>
    )
  },
}

export default ListTailwindUI
