export interface ConfigExecInterface {
  configExists: () => boolean
  enrichSchema?: () => Promise<void>
  validateSchema: () => Promise<void>
  setupProviders?: () => Promise<void>
  testProviders?: () => Promise<void>
}
