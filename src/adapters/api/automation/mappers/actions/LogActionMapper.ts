import { LogAction } from '@entities/app/automation/actions/LogAction'
import { LogActionDto } from '../../dtos/actions/LogActionDto'
import { ILoggerSpi } from '@entities/spi/ILoggerSpi'

export class LogActionMapper {
  static toEntity(logActionDto: LogActionDto, log: ILoggerSpi) {
    return new LogAction(logActionDto.name, logActionDto.message, log)
  }

  static toDto(logAction: LogAction): LogActionDto {
    return {
      name: logAction.name,
      type: 'log',
      message: logAction.message,
    }
  }

  static toEntities(logActionDtos: LogActionDto[], log: ILoggerSpi): LogAction[] {
    return logActionDtos.map((logActionDto) => this.toEntity(logActionDto, log))
  }

  static toDtos(logActions: LogAction[]): LogActionDto[] {
    return logActions.map((logAction) => this.toDto(logAction))
  }
}
