export interface ConfigExecInterface {
  exists: () => boolean
  isUpdated: () => boolean
  enrichSchema?: () => Promise<void>
  validateSchema: () => Promise<void>
  setupProviders?: () => Promise<void>
  buildProviders?: () => Promise<void>
  cacheProviders?: () => Promise<void>
  loadCached?: () => Promise<void>
}
