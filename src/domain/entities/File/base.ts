export interface FileFields {
  id: string
  name: string
  data: Buffer
  created_at: Date
}

export interface FileJson extends Omit<FileFields, 'data' | 'created_at'> {
  created_at: string
}

export class BaseFile {
  constructor(readonly fields: FileFields) {}

  get id(): string {
    return this.fields.id
  }

  get name(): string {
    return this.fields.name
  }

  get data(): Buffer {
    return this.fields.data
  }

  toJson(): FileJson {
    const { id, name, created_at } = this.fields
    return {
      id,
      name,
      created_at: created_at.toISOString(),
    }
  }
}
