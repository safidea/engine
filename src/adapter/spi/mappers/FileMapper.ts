import { Persisted, type Params as PersistedParams } from '@domain/entities/File/Persisted'
import { ToSave } from '@domain/entities/File/ToSave'
import type { PersistedDto, ToSaveDto } from '../dtos/FileDto'

export class FileMapper {
  static toSaveDto = (toSaveRecord: ToSave): ToSaveDto => {
    return toSaveRecord.data
  }

  static toPersistedEntity = (file: PersistedDto, params: PersistedParams) => {
    return new Persisted(file, params)
  }
}
