import { join, dirname } from 'path'

export type ParamsType = { path?: string[] }

export function getPathFromParams(params: ParamsType): string {
  return `/${params.path?.join('/') ?? ''}`
}

export function getAppPath(): string {
  const parentDir = process.cwd()
  return join(dirname(parentDir), '..', 'app')
}
