import type { Job } from '@domain/entities/Job'
import type { JobDto } from '../dtos/JobDto'
import { CompletedJob } from '@domain/entities/Job/Completed'
import { FailedJob } from '@domain/entities/Job/Failed'
import { CreatedJob } from '@domain/entities/Job/Created'

export class JobMapper {
  static toEntity = (dto: JobDto): Job => {
    switch (dto.state) {
      case 'created':
        return new CreatedJob(dto)
      case 'completed':
        return new CompletedJob(dto)
      case 'failed':
        return new FailedJob(dto)
      default:
        throw new Error(`State ${dto.state} not supported`)
    }
  }

  static toManyEntities = (dtos: JobDto[]): Job[] => {
    return dtos.map(JobMapper.toEntity)
  }
}
