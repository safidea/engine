import { LogAction } from '@domain/entities/automation/actions/LogAction'
import { LogActionDto } from '../../dtos/actions/LogActionDto'
import { ILogSpi } from '@domain/spi/ILogSpi'

export class LogActionMapper {
  static toEntity(logActionDto: LogActionDto, log: ILogSpi) {
    return new LogAction(logActionDto.message, log)
  }

  static toDto(logAction: LogAction): LogActionDto {
    return {
      type: 'log',
      message: logAction.message,
    }
  }

  static toEntities(logActionDtos: LogActionDto[], log: ILogSpi): LogAction[] {
    return logActionDtos.map((logActionDto) => this.toEntity(logActionDto, log))
  }

  static toDtos(logActions: LogAction[]): LogActionDto[] {
    return logActions.map((logAction) => this.toDto(logAction))
  }
}
