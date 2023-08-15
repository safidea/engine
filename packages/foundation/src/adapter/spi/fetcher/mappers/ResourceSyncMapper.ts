import { SyncResource } from '@domain/entities/orm/Sync'
import { ResourceSyncDto } from '@adapter/spi/fetcher/dtos/ResourceSyncDto'
import { FilterMapper } from '@adapter/spi/orm/mappers/FilterMapper'

export class ResourceSyncMapper {
  static toEntity(ResourceSyncDto: ResourceSyncDto): SyncResource {
    const { table, filters } = ResourceSyncDto
    return {
      table,
      filters: FilterMapper.toEntities(filters ?? []),
    }
  }

  static toDto(syncResource: SyncResource): ResourceSyncDto {
    const { table, filters } = syncResource
    return {
      table,
      filters: FilterMapper.toDtos(filters ?? []),
    }
  }

  static toEntities(ResourceSyncDtos: ResourceSyncDto[]): SyncResource[] {
    return ResourceSyncDtos.map((ResourceSyncDto) => this.toEntity(ResourceSyncDto))
  }

  static toDtos(syncResources: SyncResource[]): ResourceSyncDto[] {
    return syncResources.map((syncResource) => this.toDto(syncResource))
  }
}
