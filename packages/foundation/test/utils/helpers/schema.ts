import { PageDto } from '@adapter/api/page/dtos/PageDto'
import { TableDto } from '@adapter/api/table/dtos/TableDto'
import {
  TABLE_INVOICES,
  TABLE_INVOICES_ITEMS,
  PAGE_LIST_INVOICES,
  PAGE_CREATE_INVOICE,
  PAGE_UPDATE_INVOICE,
} from '../schemas'

export function getTablesDto(...args: string[]): TableDto[] {
  const tables: TableDto[] = []
  for (const tableName of args) {
    switch (tableName) {
      case 'invoices':
        tables.push(TABLE_INVOICES, TABLE_INVOICES_ITEMS)
        break
      case 'invoices_items':
        tables.push(TABLE_INVOICES_ITEMS)
        break
      default:
        throw new Error(`Table ${tableName} not found in schemas`)
    }
  }
  return tables
}

export function getPagesDto(...args: string[]): PageDto[] {
  const pages: PageDto[] = []
  for (const pageName of args) {
    switch (pageName) {
      case 'invoices_list':
        pages.push(PAGE_LIST_INVOICES)
        break
      case 'invoices_create':
        pages.push(PAGE_CREATE_INVOICE)
        break
      case 'invoices_update':
        pages.push(PAGE_UPDATE_INVOICE)
        break
      default:
        throw new Error(`Page ${pageName} not found in schemas`)
    }
  }
  return pages
}
