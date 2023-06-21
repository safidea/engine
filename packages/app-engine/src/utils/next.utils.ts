export type ParamsType = { path?: string[] }

export type OptionsType = {
  params?: ParamsType
}

export function getPathFromParams(params: ParamsType): string {
  return `/${params.path?.join('/') ?? ''}`
}
