export interface ConfigExecInterface {
  isUpdated: () => boolean
  enrichSchema?: () => Promise<void>
  validateSchema: () => Promise<void>
  setupProviders?: () => Promise<void>
  testProviders?: () => Promise<void>
}
