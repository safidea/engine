import { BaseFile, type FileFields } from './base'

export class PersistedFile extends BaseFile {
  constructor(data: FileFields) {
    super(data)
  }
}
