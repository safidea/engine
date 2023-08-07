import { SyncResource } from '@domain/entities/app/Sync'
import { SyncResourceDto } from '../../dtos/sync/SyncResourceDto'
import { FilterMapper } from '../FilterMapper'

export class SyncResourceMapper {
  static toEntity(syncResourceDto: SyncResourceDto): SyncResource {
    const { table, filters } = syncResourceDto
    return {
      table,
      filters: FilterMapper.toEntities(filters ?? []),
    }
  }

  static toDto(syncResource: SyncResource): SyncResourceDto {
    const { table, filters } = syncResource
    return {
      table,
      filters: FilterMapper.toDtos(filters ?? []),
    }
  }

  static toEntities(syncResourceDtos: SyncResourceDto[]): SyncResource[] {
    return syncResourceDtos.map((syncResourceDto) => this.toEntity(syncResourceDto))
  }

  static toDtos(syncResources: SyncResource[]): SyncResourceDto[] {
    return syncResources.map((syncResource) => this.toDto(syncResource))
  }
}
