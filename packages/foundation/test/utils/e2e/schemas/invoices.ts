import { AutomationDto } from '@adapter/api/automation/dtos/AutomationDto'
import { PageDto } from '@adapter/api/page/dtos/PageDto'
import { TableDto } from '@adapter/api/table/dtos/TableDto'

const invoiceFieldPermission = {
  update: {
    formula: 'number === undefined',
  },
}

export const TABLE_INVOICES: TableDto = {
  name: 'invoices',
  fields: [
    {
      name: 'autonumber',
      type: 'autonumber',
    },
    {
      name: 'preview_number',
      type: 'formula',
      formula: '"P" + (autonumber + 1000)',
    },
    {
      name: 'customer',
      type: 'single_line_text',
      permissions: invoiceFieldPermission,
    },
    {
      name: 'address',
      type: 'single_line_text',
      permissions: invoiceFieldPermission,
    },
    {
      name: 'zip_code',
      type: 'single_line_text',
      permissions: invoiceFieldPermission,
    },
    {
      name: 'city',
      type: 'single_line_text',
      permissions: invoiceFieldPermission,
    },
    {
      name: 'country',
      type: 'single_line_text',
      permissions: invoiceFieldPermission,
    },
    {
      name: 'items',
      type: 'multiple_linked_records',
      table: 'invoices_items',
      permissions: invoiceFieldPermission,
    },
    {
      name: 'total_net_amount',
      type: 'rollup',
      linkedRecords: 'items',
      linkedField: 'total_net_amount',
      formula: 'sum(values)',
      format: 'currency',
    },
    {
      name: 'total_vat',
      type: 'rollup',
      linkedRecords: 'items',
      linkedField: 'total_vat',
      formula: 'sum(values)',
      format: 'currency',
    },
    {
      name: 'total_amount',
      type: 'rollup',
      linkedRecords: 'items',
      linkedField: 'total_amount',
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
      permissions: invoiceFieldPermission,
    },
    {
      name: 'number',
      type: 'number',
      optional: true,
      permissions: invoiceFieldPermission,
    },
    {
      name: 'url',
      type: 'url',
      optional: true,
      permissions: invoiceFieldPermission,
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
              field: 'zip_code',
              label: 'Code postal',
            },
            {
              field: 'city',
              label: 'Ville',
            },
            {
              field: 'country',
              label: 'Pays',
            },
            {
              field: 'total_net_amount',
              label: 'Montant net total',
            },
            {
              field: 'total_vat',
              label: 'TVA total',
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
              field: 'finalised_time',
              label: 'Date de finalisation',
            },
            {
              field: 'created_time',
              label: 'Date de création',
            },
            {
              label: 'Éditer',
              type: 'button',
              action: {
                type: 'redirect',
                path: '/update/:id',
              },
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
              field: 'city',
              label: 'Ville',
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
          recordIdToUpdate: '{{path.params.id}}',
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
              field: 'city',
              label: 'Ville',
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
            autosave: true,
            loadingLabel: 'Mise à jour en cours...',
          },
        },
      ],
    },
  ],
}

export const AUTOMATION_CREATED_INVOICE_WITH_HTML_TEMPLATE: AutomationDto = {
  name: 'invoice-created',
  trigger: {
    event: 'record_created',
    table: 'invoices',
  },
  actions: [
    {
      name: 'create-invoice',
      type: 'create_file',
      filename: 'invoice.pdf',
      input: 'html',
      output: 'pdf',
      template: '<h1>Invoice</h1>',
      bucket: 'invoices',
    },
  ],
}

export const AUTOMATION_CREATED_INVOICE_WITH_HTML_FILE_TEMPLATE: AutomationDto = {
  name: 'invoice-created',
  trigger: {
    event: 'record_created',
    table: 'invoices',
  },
  actions: [
    {
      name: 'create-invoice',
      type: 'create_file',
      filename: 'invoice-{{trigger.preview_number}}.pdf',
      input: 'html',
      output: 'pdf',
      template: {
        privatePath: '/templates/invoice.html',
      },
      bucket: 'invoices',
      data: {
        preview_number: '{{trigger.preview_number}}',
        customer: '{{trigger.customer}}',
        address: '{{trigger.address}}',
        zip_code: '{{trigger.zip_code}}',
        city: '{{trigger.city}}',
        country: '{{trigger.country}}',
        'items.$.activity': '{{trigger.items.$.activity}}',
        'items.$.quantity': '{{trigger.items.$.quantity}}',
        'items.$.unit_price': '{{trigger.items.$.unit_price}}',
        'items.$.vat': '{{trigger.items.$.vat}}',
        'items.$.total_amount': '{{trigger.items.$.total_amount}}',
        total_net_amount: '{{trigger.total_net_amount}}',
        total_vat: '{{trigger.total_vat}}',
        total_amount: '{{trigger.total_amount}}',
      },
    },
    {
      name: 'update-invoice-with-url',
      type: 'update_record',
      table: 'invoices',
      recordId: '{{trigger.id}}',
      fields: {
        url: '{{create_invoice.url}}',
      },
    },
  ],
}
