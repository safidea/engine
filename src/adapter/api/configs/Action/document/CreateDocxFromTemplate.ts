import type { Config } from '@domain/entities/Action/document/CreateDocxFromTemplate'

export interface CreateDocxFromTemplate extends Config {
  service: 'Document'
  action: 'CreateDocxFromTemplate'
}
