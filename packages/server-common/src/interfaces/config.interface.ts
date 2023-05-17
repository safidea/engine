export interface ConfigInterface {
  enrich?: () => void
  validate: () => void
  lib?: () => void
  js?: () => void
}
