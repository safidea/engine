import { FileDto } from '@adapters/dtos/FileDto'
import { File } from '@entities/services/storage/file/File'

export class FileMapper {
  static toFile(dto: FileDto, buffer: Buffer): File {
    return new File(buffer, dto)
  }

  static toManyFiles(dtos: FileDto[], buffers: Buffer[]): File[] {
    return buffers.map((buffer, i) => this.toFile(dtos[i], buffer))
  }

  static toDto(file: File): FileDto {
    return file.params()
  }

  static toManyDtos(files: File[]): FileDto[] {
    return files.map(this.toDto)
  }
}
