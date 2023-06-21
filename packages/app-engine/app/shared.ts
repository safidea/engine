import { join, dirname } from 'path'

export type ParamsType = { path?: string[] }

export type OptionsType = {
  params?: ParamsType
}

export function getPathFromParams(params: ParamsType): string {
  return `/${params.path?.join('/') ?? ''}`
}

export function getAppPath(): string {
  if (!process.env.APP_PATH) throw new Error('APP_PATH is not defined')
  return process.env.APP_PATH
}
