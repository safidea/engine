export interface ConfigExecInterface {
  dependsOn?: string[]
  isUpdated: () => boolean
  enrichSchema?: () => Promise<void>
  validateSchema: () => Promise<void>
  setupProviders?: () => Promise<void>
  buildProviders?: () => Promise<void>
  cacheProviders?: () => Promise<void>
  loadCached?: () => Promise<void>
}

export interface ConfigsExecInterface {
  [key: string]: ConfigExecInterface
}
