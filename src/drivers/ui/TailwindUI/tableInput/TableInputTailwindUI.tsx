import React from 'react'
import { TableInputUI } from '@entities/app/page/component/tableInput/TableInputComponentUI'
import { ApplyStyle } from '..'

const TableInputTailwindUI = (applyStyle: ApplyStyle): TableInputUI => ({
  Container: ({ children, style }) => {
    return <div className={applyStyle(style)}>{children}</div>
  },
  Menu: ({ children, style }) => {
    return <div className={applyStyle(style)}>{children}</div>
  },
  Label: ({ label, style }) => {
    return <div className={applyStyle(style)}>{label}</div>
  },
  AddButton: ({ label, onClick, style }) => {
    return (
      <button className={applyStyle(style)} onClick={onClick}>
        {label}
      </button>
    )
  },
  Table: ({ children, style }) => {
    return <table className={applyStyle(style)}>{children}</table>
  },
  Header: ({ children, style }) => {
    return (
      <thead className={applyStyle(style)}>
        <tr>{children}</tr>
      </thead>
    )
  },
  HeaderColumn: ({ label, style }) => {
    return <th className={applyStyle(style)}>{label}</th>
  },
  Rows: ({ children, style }) => {
    return <tbody className={applyStyle(style)}>{children}</tbody>
  },
  Row: ({ children, style }) => {
    return <tr className={applyStyle(style)}>{children}</tr>
  },
  Cell: ({ name, placeholder, value, onChange, style }) => {
    return (
      <td className={applyStyle(style)}>
        <input name={name} placeholder={placeholder} onChange={onChange} value={value} />
      </td>
    )
  },
  Remove({ onClick, style }) {
    return (
      <td className={applyStyle(style)}>
        <button onClick={onClick}>Remove</button>
      </td>
    )
  },
})

export default TableInputTailwindUI
