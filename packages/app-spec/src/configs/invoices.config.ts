import type { ConfigInterface } from 'shared-app'
import mergeConfigs from '../utils/merge-configs.utils'
import { ObjectInterface } from 'shared-common'

const config: ConfigInterface = {
  name: 'invoices',
  version: '1.0.0',
  tables: {
    invoices: {
      fields: {
        name: {
          type: 'String',
        },
        amount: {
          type: 'Int',
          default: 0,
        },
        status: {
          type: 'SingleSelect',
          options: ['draft', 'finalised', 'sent', 'paid'],
          default: 'draft',
        },
        number: {
          type: 'String',
          optional: true,
        },
        finalised_date: {
          type: 'DateTime',
          optional: true,
        },
      },
    },
  },
  pages: {
    '/': {
      title: 'Invoices',
      components: [
        {
          key: 'list',
          table: 'invoices',
          fields: [
            {
              key: 'name',
              label: 'Titre',
            },
            {
              key: 'amount',
              label: 'Montant',
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
          ],
          groupBy: [{ field: 'status', order: 'first_to_last' }],
          sortBy: [
            { field: 'finalised_date', order: 'desc' },
            { field: 'created_date', order: 'desc' },
          ],
        },
      ],
    },
  },
}

export default function getInvoicesConfig(customConfig?: ObjectInterface): ConfigInterface {
  if (customConfig) mergeConfigs(config, customConfig) as ConfigInterface
  return config
}
