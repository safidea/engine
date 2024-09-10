import { PersistedFile } from '@domain/entities/File/Persisted'
import type { FileDto } from '../dtos/FileDto'
import type { CreatedFile } from '@domain/entities/File/Created'

export class FileMapper {
  static toCreatedDto = (createdFile: CreatedFile): FileDto => {
    return createdFile.fields
  }

  static toPersistedEntity = (file: FileDto) => {
    return new PersistedFile(file)
  }
}
