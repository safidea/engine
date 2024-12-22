import type { CreateDocxFromTemplateDocumentActionConfig } from '@domain/entities/Action/document/CreateDocxFromTemplate'

export interface ICreateDocxFromTemplateDocumentAction
  extends CreateDocxFromTemplateDocumentActionConfig {
  service: 'Document'
  action: 'CreateDocxFromTemplate'
}
