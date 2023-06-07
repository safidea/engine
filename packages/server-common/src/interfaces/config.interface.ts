export interface ConfigExecInterface {
  enrich?: () => void | Promise<void>
  validate: () => void | Promise<void>
  lib?: () => void | Promise<void>
  js?: () => void | Promise<void>
}
