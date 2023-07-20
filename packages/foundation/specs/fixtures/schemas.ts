import { TableDto } from '@application/dtos/TableDto'

export const TABLE_INVOICES: TableDto = {
  name: 'invoices',
  fields: [
    {
      name: 'customer',
      type: 'single_line_text',
    },
    {
      name: 'address',
      type: 'single_line_text',
    },
    {
      name: 'zip_code',
      type: 'single_line_text',
    },
    {
      name: 'country',
      type: 'single_line_text',
    },
    {
      name: 'items',
      type: 'multiple_linked_records',
      table: 'invoices_items',
    },
    {
      name: 'total_net_amount',
      type: 'rollup',
      linked_records: 'items',
      linked_field: 'total_net_amount',
      formula: 'sum(values)',
      format: 'currency',
    },
    {
      name: 'total_vat',
      type: 'rollup',
      linked_records: 'items',
      linked_field: 'total_vat',
      formula: 'sum(values)',
      format: 'currency',
    },
    {
      name: 'total_amount',
      type: 'rollup',
      linked_records: 'items',
      linked_field: 'total_amount',
      formula: 'sum(values)',
      format: 'currency',
    },
  ],
}

export const TABLE_INVOICES_ITEMS: TableDto = {
  name: 'invoices_items',
  fields: [
    { name: 'invoice', type: 'single_linked_record', table: 'invoices' },
    { name: 'name', type: 'single_line_text' },
    { name: 'description', type: 'long_text', optional: true },
    { name: 'quantity', type: 'number' },
    { name: 'unity', type: 'single_line_text' },
    { name: 'unit_price', type: 'currency' },
    { name: 'vat', type: 'number' },
    {
      name: 'total_net_amount',
      type: 'formula',
      formula: 'quantity * unit_price',
      format: 'currency',
    },
    {
      name: 'total_vat',
      type: 'formula',
      formula: 'total_net_amount * vat',
      format: 'currency',
    },
    {
      name: 'total_amount',
      type: 'formula',
      formula: 'total_net_amount + total_vat',
      format: 'currency',
    },
  ],
}
