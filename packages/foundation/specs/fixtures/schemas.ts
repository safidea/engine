import { PageDto } from '@application/dtos/PageDto'
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

export const PAGE_LIST_INVOICES: PageDto = {
  path: '/list',
  title: 'Factures',
  components: [
    {
      type: 'appNavigation',
      components: [
        {
          key: 'h1',
          text: 'Toutes les factures',
          className: 'p-2 text-4xl font-bold text-gray-800',
        },
        {
          key: 'list',
          table: 'invoices',
          fields: [
            {
              key: 'customer',
              label: 'Client',
            },
            {
              key: 'address',
              label: 'Adresse',
            },
            {
              key: 'total_amount',
              label: 'Montant total',
            },
            {
              key: 'status',
              label: 'Statut',
              options: [
                {
                  key: 'draft',
                  label: 'Brouillon',
                },
                {
                  key: 'finalised',
                  label: 'Finalisée',
                },
                {
                  key: 'sent',
                  label: 'Envoyée',
                },
                {
                  key: 'paid',
                  label: 'Payée',
                },
              ],
            },
            {
              key: 'finalised_date',
              label: 'Date de finalisation',
            },
            {
              key: 'created_date',
              label: 'Date de création',
            },
            {
              key: 'edit',
              label: 'Éditer',
              format: 'button',
              actions: [
                {
                  type: 'redirect',
                  path: '/update/:id',
                },
              ],
            },
          ],
          groupBy: [{ field: 'status', order: 'first_to_last' }],
          sortBy: [
            { field: 'finalised_date', order: 'desc' },
            { field: 'created_date', order: 'desc' },
          ],
        },
      ],
    },
  ],
}

export const PAGE_CREATE_INVOICE: PageDto = {
  path: '/create',
  title: 'Factures',
  components: [
    {
      key: 'appNavigation',
      components: [
        {
          key: 'h1',
          text: 'Créer une facture',
          className: 'p-2 text-4xl font-bold text-gray-800',
        },
        {
          key: 'form',
          table: 'invoices',
          fields: [
            {
              key: 'customer',
              label: 'Client',
            },
            {
              key: 'address',
              label: 'Adresse',
            },
            {
              key: 'zip_code',
              label: 'Code postal',
            },
            {
              key: 'country',
              label: 'Pays',
            },
            {
              key: 'items',
              label: 'Lignes de facture',
              fields: [
                {
                  key: 'activity',
                  label: 'Activité',
                  placeholder: 'Activité',
                },
                {
                  key: 'quantity',
                  label: 'Quantité',
                  placeholder: 'Quantité',
                },
                {
                  key: 'unity',
                  label: 'Unité',
                  placeholder: 'Unité',
                },
                {
                  key: 'unit_price',
                  label: 'Prix unitaire',
                  placeholder: 'Prix unitaire',
                },
              ],
              addLabel: 'Nouvelle ligne',
            },
          ],
          submit: {
            label: 'Enregistrer',
            loading_label: 'Enregistrement en cours...',
            actionsOnSuccess: [
              {
                type: 'redirect',
                path: '/',
              },
            ],
          },
        },
      ],
    },
  ],
}
