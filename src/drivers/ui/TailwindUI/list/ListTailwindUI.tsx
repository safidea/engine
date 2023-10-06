import React from 'react'
import { ListUI } from '@entities/app/page/component/list/ListComponentUI'
import { ApplyStyle } from '..'

const ListTailwindUI = (applyStyle: ApplyStyle): ListUI => ({
  Container: ({ children, style }) => {
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
  Group: ({ label, colSpan, style }) => {
    return (
      <tr className={applyStyle(style)}>
        <th colSpan={colSpan}>{label}</th>
      </tr>
    )
  },
  Rows: ({ children, style }) => {
    return <tbody className={applyStyle(style)}>{children}</tbody>
  },
  Row: ({ children, id, style }) => {
    return (
      <tr className={applyStyle(style)} id={id}>
        {children}
      </tr>
    )
  },
  Cell: ({ children, style }) => {
    return <td className={applyStyle(style)}>{children}</td>
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
})

export default ListTailwindUI
