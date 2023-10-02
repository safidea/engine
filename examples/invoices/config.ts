import type { Config } from '../../src/server'

const permissions = {
  update: {
    formula: 'role === "admin" || number === undefined',
  },
}

const config: Config = {
  name: 'Invoices',
  tables: [
    {
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
          permissions,
        },
        {
          name: 'address',
          type: 'single_line_text',
          permissions,
        },
        {
          name: 'zip_code',
          type: 'single_line_text',
          permissions,
        },
        {
          name: 'city',
          type: 'single_line_text',
          permissions,
        },
        {
          name: 'country',
          type: 'single_line_text',
          permissions,
        },
        {
          name: 'items',
          type: 'multiple_linked_records',
          table: 'invoices_items',
          permissions,
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
          permissions,
        },
        {
          name: 'number',
          type: 'number',
          optional: true,
          permissions,
        },
        {
          name: 'url',
          type: 'url',
          optional: true,
          permissions,
        },
        {
          name: 'entity',
          type: 'single_linked_record',
          table: 'entities',
        },
      ],
    },
    {
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
    },
    {
      name: 'entities',
      fields: [
        {
          name: 'name',
          type: 'single_line_text',
        },
        {
          name: 'invoices',
          type: 'multiple_linked_records',
          table: 'invoices',
        },
        {
          name: 'number_index',
          type: 'number',
          default: '1000',
        },
      ],
    },
  ],
  pages: [
    {
      path: '/',
      title: 'Factures',
      components: [
        {
          type: 'navigation',
          title: {
            type: 'title',
            size: 'medium',
            text: 'Factures',
          },
          links: [
            {
              type: 'link',
              text: 'Toutes les factures',
              path: '/',
            },
            {
              type: 'link',
              text: 'Créer une facture',
              path: '/create',
            },
          ],
          components: [
            {
              type: 'title',
              size: 'extra-large',
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
                  field: 'url',
                  label: 'PDF',
                  type: 'button',
                  buttonLabel: 'Ouvrir',
                },
                {
                  label: 'Édition',
                  type: 'button',
                  buttonLabel: 'Éditer',
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
    },
    {
      path: '/create',
      title: 'Factures',
      components: [
        {
          type: 'navigation',
          title: {
            type: 'title',
            size: 'medium',
            text: 'Factures',
          },
          links: [
            {
              type: 'link',
              text: 'Toutes les factures',
              path: '/',
            },
            {
              type: 'link',
              text: 'Créer une facture',
              path: '/create',
            },
          ],
          components: [
            {
              type: 'title',
              size: 'extra-large',
              text: 'Créer une facture',
            },
            {
              type: 'form',
              table: 'invoices',
              components: [
                {
                  type: 'single_select_record_input',
                  field: 'entity',
                  label: 'Entité',
                  fieldForOptionLabel: 'name',
                },
                {
                  type: 'text_input',
                  field: 'customer',
                  label: 'Client',
                },
                {
                  type: 'text_input',
                  field: 'address',
                  label: 'Adresse',
                },
                {
                  type: 'text_input',
                  field: 'zip_code',
                  label: 'Code postal',
                },
                {
                  type: 'text_input',
                  field: 'city',
                  label: 'Ville',
                },
                {
                  type: 'text_input',
                  field: 'country',
                  label: 'Pays',
                },
                {
                  type: 'table_input',
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
    },
    {
      path: '/update/:id',
      title: "Mise à jour d'une facture",
      components: [
        {
          type: 'navigation',
          title: {
            type: 'title',
            size: 'medium',
            text: 'Factures',
          },
          links: [
            {
              type: 'link',
              text: 'Toutes les factures',
              path: '/',
            },
            {
              type: 'link',
              text: 'Créer une facture',
              path: '/create',
            },
          ],
          components: [
            {
              type: 'title',
              text: "Mise à jour d'une facture",
              size: 'extra-large',
            },
            {
              type: 'form',
              table: 'invoices',
              recordIdToUpdate: '{{path.params.id}}',
              components: [
                {
                  type: 'text_input',
                  field: 'customer',
                  label: 'Client',
                },
                {
                  type: 'text_input',
                  field: 'address',
                  label: 'Adresse',
                },
                {
                  type: 'text_input',
                  field: 'zip_code',
                  label: 'Code postal',
                },
                {
                  type: 'text_input',
                  field: 'city',
                  label: 'Ville',
                },
                {
                  type: 'text_input',
                  field: 'country',
                  label: 'Pays',
                },
                {
                  type: 'table_input',
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
                {
                  type: 'single_select_input',
                  field: 'status',
                  label: 'Statut',
                  options: [
                    {
                      value: 'draft',
                      label: 'Brouillon',
                    },
                    {
                      value: 'finalised',
                      label: 'Finalisée',
                    },
                    {
                      value: 'sent',
                      label: 'Envoyée',
                    },
                    {
                      value: 'paid',
                      label: 'Payée',
                    },
                  ],
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
    },
  ],
  automations: [
    {
      name: 'draft-invoice-created',
      trigger: {
        event: 'record_created',
        table: 'invoices',
        filters: [
          {
            field: 'status',
            operator: 'is',
            value: 'draft',
          },
        ],
      },
      actions: [
        {
          name: 'create_invoice_pdf',
          type: 'create_file',
          filename: 'invoice-{{trigger.record.preview_number}}.pdf',
          input: 'html',
          output: 'pdf',
          template: {
            path: '/templates/invoice.html',
          },
          bucket: 'invoices',
          data: {
            preview_number: '{{trigger.record.preview_number}}',
            customer: '{{trigger.record.customer}}',
            address: '{{trigger.record.address}}',
            zip_code: '{{trigger.record.zip_code}}',
            city: '{{trigger.record.city}}',
            country: '{{trigger.record.country}}',
            'items.$.activity': '{{trigger.record.items.$.activity}}',
            'items.$.quantity': '{{trigger.record.items.$.quantity}}',
            'items.$.unit_price': '{{trigger.record.items.$.unit_price}}',
            'items.$.vat': '{{trigger.record.items.$.vat}}',
            'items.$.total_amount': '{{trigger.record.items.$.total_amount}}',
            total_net_amount: '{{trigger.record.total_net_amount}}',
            total_vat: '{{trigger.record.total_vat}}',
            total_amount: '{{trigger.record.total_amount}}',
          },
        },
        {
          name: 'update_invoice_with_url',
          type: 'update_record',
          table: 'invoices',
          recordId: '{{trigger.record.id}}',
          fields: {
            url: '{{create_invoice_pdf.url}}',
          },
        },
      ],
    },
    {
      name: 'draft-invoice-updated',
      trigger: {
        event: 'record_updated',
        table: 'invoices',
        fields: ['customer', 'address', 'zip_code', 'city', 'country', 'items'],
        filters: [
          {
            field: 'status',
            operator: 'is',
            value: 'draft',
          },
        ],
      },
      actions: [
        {
          name: 'create_invoice_pdf',
          type: 'create_file',
          filename: 'invoice-{{trigger.record.preview_number}}.pdf',
          input: 'html',
          output: 'pdf',
          template: {
            path: '/templates/invoice.html',
          },
          bucket: 'invoices',
          data: {
            preview_number: '{{trigger.record.preview_number}}',
            customer: '{{trigger.record.customer}}',
            address: '{{trigger.record.address}}',
            zip_code: '{{trigger.record.zip_code}}',
            city: '{{trigger.record.city}}',
            country: '{{trigger.record.country}}',
            'items.$.activity': '{{trigger.record.items.$.activity}}',
            'items.$.quantity': '{{trigger.record.items.$.quantity}}',
            'items.$.unit_price': '{{trigger.record.items.$.unit_price}}',
            'items.$.vat': '{{trigger.record.items.$.vat}}',
            'items.$.total_amount': '{{trigger.record.items.$.total_amount}}',
            total_net_amount: '{{trigger.record.total_net_amount}}',
            total_vat: '{{trigger.record.total_vat}}',
            total_amount: '{{trigger.record.total_amount}}',
          },
        },
        {
          name: 'update_invoice_with_url',
          type: 'update_record',
          table: 'invoices',
          recordId: '{{trigger.record.id}}',
          fields: {
            url: '{{create_invoice_pdf.url}}',
          },
        },
      ],
    },
    {
      name: 'invoice-item-updated',
      trigger: {
        event: 'record_updated',
        table: 'invoices_items',
        fields: ['activity', 'quantity', 'unit_price', 'vat'],
      },
      actions: [
        {
          name: 'find_invoice',
          type: 'find_record',
          table: 'invoices',
          recordId: '{{trigger.record.invoice}}',
        },
        {
          name: 'create_invoice_pdf',
          type: 'create_file',
          filename: 'invoice-{{trigger.record.preview_number}}.pdf',
          input: 'html',
          output: 'pdf',
          template: {
            path: '/templates/invoice.html',
          },
          bucket: 'invoices',
          data: {
            preview_number: '{{find_invoice.preview_number}}',
            customer: '{{find_invoice.customer}}',
            address: '{{find_invoice.address}}',
            zip_code: '{{find_invoice.zip_code}}',
            city: '{{find_invoice.city}}',
            country: '{{find_invoice.country}}',
            'items.$.activity': '{{find_invoice.items.$.activity}}',
            'items.$.quantity': '{{find_invoice.items.$.quantity}}',
            'items.$.unit_price': '{{find_invoice.items.$.unit_price}}',
            'items.$.vat': '{{find_invoice.items.$.vat}}',
            'items.$.total_amount': '{{find_invoice.items.$.total_amount}}',
            total_net_amount: '{{find_invoice.total_net_amount}}',
            total_vat: '{{find_invoice.total_vat}}',
            total_amount: '{{find_invoice.total_amount}}',
          },
        },
        {
          name: 'update_invoice_with_url',
          type: 'update_record',
          table: 'invoices',
          recordId: '{{find_invoice.id}}',
          fields: {
            url: '{{create_invoice_pdf.url}}',
          },
        },
      ],
    },
    {
      name: 'invoice-finalised',
      trigger: {
        event: 'record_updated',
        table: 'invoices',
        fields: ['status'],
        filters: [
          {
            field: 'status',
            operator: 'is',
            value: 'finalised',
          },
        ],
      },
      actions: [
        {
          name: 'find_entity',
          type: 'find_record',
          table: 'entities',
          recordId: '{{trigger.record.entity}}',
        },
        {
          name: 'update_number_index_entity',
          type: 'update_record',
          table: 'entities',
          recordId: '{{find_entity.id}}',
          fields: {
            number_index: '{{add find_entity.number_index 1}}',
          },
        },
        {
          name: 'update_invoice_with_number_and_finalised_time',
          type: 'update_record',
          table: 'invoices',
          recordId: '{{trigger.record.id}}',
          fields: {
            number: '{{update_number_index_entity.number_index}}',
            finalised_time: '{{now "iso"}}',
          },
        },
        {
          name: 'create_invoice_pdf',
          type: 'create_file',
          filename: 'invoice-{{update_invoice_with_number_and_finalised_time.number}}.pdf',
          input: 'html',
          output: 'pdf',
          template: {
            path: '/templates/invoice.html',
          },
          bucket: 'invoices',
          data: {
            number: '{{update_invoice_with_number_and_finalised_time.number}}',
            finalised_time: '{{update_invoice_with_number_and_finalised_time.finalised_time}}',
            customer: '{{trigger.record.customer}}',
            address: '{{trigger.record.address}}',
            zip_code: '{{trigger.record.zip_code}}',
            city: '{{trigger.record.city}}',
            country: '{{trigger.record.country}}',
            'items.$.activity': '{{trigger.record.items.$.activity}}',
            'items.$.quantity': '{{trigger.record.items.$.quantity}}',
            'items.$.unit_price': '{{trigger.record.items.$.unit_price}}',
            'items.$.vat': '{{trigger.record.items.$.vat}}',
            'items.$.total_amount': '{{trigger.record.items.$.total_amount}}',
            total_net_amount: '{{trigger.record.total_net_amount}}',
            total_vat: '{{trigger.record.total_vat}}',
            total_amount: '{{trigger.record.total_amount}}',
          },
        },
        {
          name: 'update_invoice_with_url',
          type: 'update_record',
          table: 'invoices',
          recordId: '{{trigger.record.id}}',
          fields: {
            url: '{{create_invoice_pdf.url}}',
          },
        },
      ],
    },
  ],
  buckets: [
    {
      name: 'invoices',
    },
  ],
}

export default config
