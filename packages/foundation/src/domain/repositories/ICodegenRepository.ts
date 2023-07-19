export interface ICodegenRepository {
  runScript: (
    script: string,
    context: { [key: string]: string | number | boolean | undefined }
  ) => Promise<string | number | boolean | undefined>
}
