import {
  CreateDocxFromTemplateDocumentAction,
  type CreateDocxFromTemplateDocumentActionConfig,
  type CreateDocxFromTemplateDocumentActionEntities,
  type CreateDocxFromTemplateDocumentActionServices,
} from '@domain/entities/Action/document/CreateDocxFromTemplate'

export type CreateDocxFromTemplateDocumentActionMapperServices =
  CreateDocxFromTemplateDocumentActionServices

export type CreateDocxFromTemplateDocumentActionMapperEntities =
  CreateDocxFromTemplateDocumentActionEntities

export class CreateDocxFromTemplateDocumentActionMapper {
  static toEntity = (
    config: CreateDocxFromTemplateDocumentActionConfig,
    services: CreateDocxFromTemplateDocumentActionMapperServices,
    entities: CreateDocxFromTemplateDocumentActionMapperEntities
  ): CreateDocxFromTemplateDocumentAction => {
    return new CreateDocxFromTemplateDocumentAction(config, services, entities)
  }
}
