import React from 'react'
import { TableInputUI } from '@entities/app/page/component/tableInput/TableInputComponentUI'

const TableInputUnstyledUI: TableInputUI = {
  Container: ({ children }) => {
    return <>{children}</>
  },
  Menu: ({ children }) => {
    return <>{children}</>
  },
  Label: ({ label }) => {
    return <>{label}</>
  },
  AddButton: ({ label, onClick }) => {
    return <button onClick={onClick}>{label}</button>
  },
  Table: ({ children }) => {
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
  Rows: ({ children }) => {
    return <tbody>{children}</tbody>
  },
  Row: ({ children }) => {
    return <tr>{children}</tr>
  },
  Cell: ({ name, placeholder, value, onChange }) => {
    return (
      <td>
        <input name={name} placeholder={placeholder} onChange={onChange} value={value} />
      </td>
    )
  },
  Remove({ onClick }) {
    return (
      <td>
        <button onClick={onClick}>Remove</button>
      </td>
    )
  },
}

export default TableInputUnstyledUI
