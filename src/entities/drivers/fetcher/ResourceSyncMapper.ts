import { SyncResource } from '@entities/drivers/database/sync/Sync'
import { ResourceSyncDto } from '@adapters/spi/fetcher/dtos/ResourceSyncDto'
import { FilterMapper } from '@adapters/spi/orm/mappers/FilterMapper'

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
