import { File } from '@domain/entities/storage/File'
import { FileDto } from '../dtos/FileDto'

export class FileMapper {
  static toEntity(fileDto: FileDto): File {
    return new File(fileDto.filename, fileDto.data)
  }

  static toDto(file: File): FileDto {
    return {
      filename: file.filename,
      data: file.data,
    }
  }

  static toEntities(dtos: FileDto[]): File[] {
    return dtos.map((dto) => this.toEntity(dto))
  }

  static toDtos(entities: File[]): FileDto[] {
    return entities.map((entity) => this.toDto(entity))
  }
}
