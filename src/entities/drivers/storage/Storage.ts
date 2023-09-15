import { Emit } from '@entities/app/automation/AutomationList'
import { StorageDriver } from './StorageDriver'
import { File } from './file/File'

export class Storage {
  private emit?: Emit

  constructor(readonly driver: StorageDriver) {}

  async listen(emit: Emit) {
    this.emit = emit
  }

  async write(bucket: string, file: File): Promise<string> {
    const path = this.driver.write(bucket, file.buffer, file.params())
    //if (this.emit) await this.emit('file_created', { bucket, path })
    return path
  }

  async writeMany(bucket: string, files: File[]): Promise<string[]> {
    const paths = await this.driver.writeMany(
      bucket,
      files.map((file) => ({ data: file.buffer, params: file.params() }))
    )
    //for (const path of paths) if (this.emit) await this.emit('file_created', { bucket, path })
    return paths
  }

  async read(bucket: string, filename: string): Promise<File | undefined> {
    return this.driver.read(bucket, filename)
  }

  async list(bucket: string, filenames?: string[]): Promise<File[]> {
    return this.driver.list(bucket, filenames)
  }
}
