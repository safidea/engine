import type { Job } from '@domain/services/job'
import type { JobDto } from '../dtos/JobDto'
import { Pending } from '@domain/services/job/Pending'
import { Completed } from '@domain/services/job/Completed'
import { Failed } from '@domain/services/job/Failed'

export class JobMapper {
  static toEntity = (dto: JobDto): Job => {
    switch (dto.state) {
      case 'pending':
        return new Pending(dto)
      case 'completed':
        return new Completed(dto)
      case 'failed':
        return new Failed(dto)
      default:
        throw new Error(`State ${dto.state} not supported`)
    }
  }

  static toManyEntities = (dtos: JobDto[]): Job[] => {
    return dtos.map(JobMapper.toEntity)
  }
}
