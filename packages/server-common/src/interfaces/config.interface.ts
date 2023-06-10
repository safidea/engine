export interface ConfigExecInterface {
  enrichSchema?: () => Promise<void>
  validateSchema: () => Promise<void>
  setupProviders?: () => Promise<void>
  testProviders?: () => Promise<void>
}
