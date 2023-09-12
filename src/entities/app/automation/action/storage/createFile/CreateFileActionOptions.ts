export interface CreateFileActionOptions {
  readonly name: string
  readonly type: 'create_file'
  readonly filename: string
  readonly input: 'html'
  readonly output: 'pdf'
  readonly template: string | { path: string }
  readonly bucket: string
  readonly data: { [key: string]: string }
}
