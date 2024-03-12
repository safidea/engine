type Base = {
  path: string
  baseUrl: string
  headers: { [key: string]: string }
  query: { [key: string]: string }
  params: { [key: string]: string }
}

export type GetDto = Base

export type PostDto = Base & {
  body: unknown
}

export type PatchDto = PostDto