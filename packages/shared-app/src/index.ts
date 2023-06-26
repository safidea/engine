export { default as AppSchema } from './schemas/app.schema.json'

export type { AppInterface, ConfigInterface, EnvInterface } from './interfaces/app.interface'
export type { ConfigsExecInterface, ConfigExecInterface } from './interfaces/config.interface'
export type {
  RequestInterface,
  RequestBodyInterface,
  RequestArrayBodyInterface,
} from './interfaces/request.interface'
export type {
  ResponseInterface,
  ResponseJsonType,
  ResponseErrorInterface,
} from './interfaces/response.interface'
