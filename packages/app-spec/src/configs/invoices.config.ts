import type { ConfigInterface } from 'shared-app'
import mergeConfigs from '../utils/merge-configs.utils'
import { ObjectInterface } from 'shared-common'

const config: ConfigInterface = {
  name: 'invoices',
  version: '1.0.0',
  tables: {
    invoices: {
      fields: {
        title: {
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
      title: 'All invoices',
      components: [
        {
          key: 'appNavigation',
          components: [
            {
              key: 'h1',
              text: 'All invoices',
            },
            {
              key: 'list',
              table: 'invoices',
              fields: [
                {
                  key: 'title',
                  label: 'Title',
                },
                {
                  key: 'amount',
                  label: 'Amount',
                },
                {
                  key: 'status',
                  label: 'Status',
                  options: [
                    {
                      key: 'draft',
                      label: 'Draft',
                    },
                    {
                      key: 'finalised',
                      label: 'Finalised',
                    },
                    {
                      key: 'sent',
                      label: 'Sent',
                    },
                    {
                      key: 'paid',
                      label: 'Paid',
                    },
                  ],
                },
                {
                  key: 'finalised_date',
                  label: 'Finalised date',
                },
                {
                  key: 'created_date',
                  label: 'Created date',
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
    },
    '/create': {
      title: 'Create an invoice',
      components: [
        {
          key: 'appNavigation',
          components: [
            {
              key: 'h1',
              text: 'Create an invoice',
            },
            /*{
              key: 'form',
              table: 'invoices',
              fields: [
                {
                  key: 'title',
                  label: 'Title',
                },
                {
                  key: 'amount',
                  label: 'Amount',
                },
                {
                  key: 'status',
                  label: 'Status',
                  options: [
                    {
                      key: 'draft',
                      label: 'Draft',
                    },
                    {
                      key: 'finalised',
                      label: 'Finalised',
                    },
                    {
                      key: 'sent',
                      label: 'Sent',
                    },
                    {
                      key: 'paid',
                      label: 'Paid',
                    },
                  ],
                },
                {
                  key: 'finalised_date',
                  label: 'Finalised date',
                },
              ],
            },*/
          ],
        },
      ],
    },
  },
  components: {
    appNavigation: {
      key: 'navigation',
      title: 'Invoices',
      navigation: [
        {
          label: 'All invoices',
          icon: 'HomeIcon',
          path: '/',
        },
        {
          label: 'Create an invoice',
          icon: 'DocumentDuplicateIcon',
          path: '/create',
        },
      ],
    },
  },
}

export default function getInvoicesConfig(customConfig?: ObjectInterface): ConfigInterface {
  if (customConfig) mergeConfigs(config, customConfig) as ConfigInterface
  return config
}
