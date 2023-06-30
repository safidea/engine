export interface ConfigExecInterface {
  dependsOn?: string[]
  isUpdated: ({ silent }?: { silent: boolean }) => boolean
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
