import { ContainerComponent } from '@domain/entities/page/components/ContainerComponent'
import { ContainerComponentDto } from '../../dtos/components/ContainerComponentDto'
import { ComponentMapper, ComponentMapperSpis } from '../ComponentMapper'
import { Table } from '@domain/entities/table/Table'

export class ContainerComponentMapper {
  static toEntity(
    containerDto: ContainerComponentDto,
    table: Table[],
    spis: ComponentMapperSpis
  ): ContainerComponent {
    const components = ComponentMapper.toEntities(containerDto.components, table, spis)
    if (!spis.ui) throw new Error('UISpi is required')
    return new ContainerComponent(spis.ui.ContainerUI, components)
  }

  static toDto(container: ContainerComponent): ContainerComponentDto {
    const components = ComponentMapper.toDtos(container.components)
    return {
      type: 'container',
      components,
    }
  }

  static toEntities(
    containerDtos: ContainerComponentDto[],
    table: Table[],
    spis: ComponentMapperSpis
  ): ContainerComponent[] {
    return containerDtos.map((containerDto) => this.toEntity(containerDto, table, spis))
  }

  static toDtos(containers: ContainerComponent[]): ContainerComponentDto[] {
    return containers.map((container) => this.toDto(container))
  }
}
