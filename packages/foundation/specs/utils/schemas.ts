import { PageDto } from '@application/dtos/page/PageDto'
import { TableDto } from '@application/dtos/table/TableDto'

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
    {
      name: 'status',
      type: 'single_select',
      options: ['draft', 'finalised', 'sent', 'paid'],
      default: 'draft',
    },
    {
      name: 'finalised_time',
      type: 'datetime',
      optional: true,
    },
    {
      name: 'number',
      type: 'number',
      optional: true,
    },
  ],
}

export const TABLE_INVOICES_ITEMS: TableDto = {
  name: 'invoices_items',
  fields: [
    { name: 'invoice', type: 'single_linked_record', table: 'invoices' },
    { name: 'activity', type: 'single_line_text' },
    { name: 'description', type: 'long_text', optional: true },
    { name: 'quantity', type: 'number' },
    { name: 'unity', type: 'single_line_text' },
    { name: 'unit_price', type: 'currency' },
    { name: 'vat', type: 'number', default: '0.2' },
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
      type: 'navigation',
      title: {
        type: 'title',
        size: 'md',
        text: 'Factures',
      },
      links: [
        {
          type: 'link',
          label: 'Toutes les factures',
          path: '/',
        },
        {
          type: 'link',
          label: 'Créer une facture',
          path: '/create',
        },
      ],
      components: [
        {
          type: 'title',
          size: 'xl',
          text: 'Toutes les factures',
        },
        {
          type: 'list',
          table: 'invoices',
          columns: [
            {
              field: 'customer',
              label: 'Client',
            },
            {
              field: 'address',
              label: 'Adresse',
            },
            {
              field: 'total_amount',
              label: 'Montant total',
            },
            {
              field: 'status',
              label: 'Statut',
              options: [
                {
                  name: 'draft',
                  label: 'Brouillon',
                },
                {
                  name: 'finalised',
                  label: 'Finalisée',
                },
                {
                  name: 'sent',
                  label: 'Envoyée',
                },
                {
                  name: 'paid',
                  label: 'Payée',
                },
              ],
            },
            {
              field: 'finalised_date',
              label: 'Date de finalisation',
            },
            {
              field: 'created_date',
              label: 'Date de création',
            },
            {
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
            { field: 'finalised_time', order: 'desc' },
            { field: 'created_time', order: 'desc' },
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
      type: 'navigation',
      title: {
        type: 'title',
        size: 'md',
        text: 'Factures',
      },
      links: [
        {
          type: 'link',
          label: 'Toutes les factures',
          path: '/',
        },
        {
          type: 'link',
          label: 'Créer une facture',
          path: '/create',
        },
      ],
      components: [
        {
          type: 'title',
          size: 'xl',
          text: 'Créer une facture',
        },
        {
          type: 'form',
          table: 'invoices',
          inputs: [
            {
              field: 'customer',
              label: 'Client',
            },
            {
              field: 'address',
              label: 'Adresse',
            },
            {
              field: 'zip_code',
              label: 'Code postal',
            },
            {
              field: 'country',
              label: 'Pays',
            },
            {
              field: 'items',
              label: 'Lignes de facture',
              columns: [
                {
                  field: 'activity',
                  label: 'Activité',
                  placeholder: 'Activité',
                },
                {
                  field: 'quantity',
                  label: 'Quantité',
                  placeholder: 'Quantité',
                },
                {
                  field: 'unity',
                  label: 'Unité',
                  placeholder: 'Unité',
                },
                {
                  field: 'unit_price',
                  label: 'Prix unitaire',
                  placeholder: 'Prix unitaire',
                },
              ],
              addLabel: 'Nouvelle ligne',
            },
          ],
          submit: {
            label: 'Enregistrer',
            loadingLabel: 'Enregistrement en cours...',
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

export const PAGE_UPDATE_INVOICE: PageDto = {
  path: '/update/:id',
  title: "Mise à jour d'une facture",
  components: [
    {
      type: 'navigation',
      title: {
        type: 'title',
        size: 'md',
        text: 'Factures',
      },
      links: [
        {
          type: 'link',
          label: 'Toutes les factures',
          path: '/',
        },
        {
          type: 'link',
          label: 'Créer une facture',
          path: '/create',
        },
      ],
      components: [
        {
          type: 'title',
          text: "Mise à jour d'une facture",
          size: 'xl',
        },
        {
          type: 'form',
          table: 'invoices',
          defaultRecordId: {
            formula: 'path.params.id',
          },
          inputs: [
            {
              field: 'customer',
              label: 'Client',
            },
            {
              field: 'address',
              label: 'Adresse',
            },
            {
              field: 'zip_code',
              label: 'Code postal',
            },
            {
              field: 'country',
              label: 'Pays',
            },
            {
              field: 'items',
              label: 'Lignes de facture',
              columns: [
                {
                  field: 'activity',
                  label: 'Activité',
                  placeholder: 'Activité',
                },
                {
                  field: 'quantity',
                  label: 'Quantité',
                  placeholder: 'Quantité',
                },
                {
                  field: 'unity',
                  label: 'Unité',
                  placeholder: 'Unité',
                },
                {
                  field: 'unit_price',
                  label: 'Prix unitaire',
                  placeholder: 'Prix unitaire',
                },
              ],
              addLabel: 'Nouvelle ligne',
            },
          ],
          submit: {
            label: 'Mettre à jour',
            loadingLabel: 'Mise à jour en cours...',
          },
        },
      ],
    },
  ],
}
