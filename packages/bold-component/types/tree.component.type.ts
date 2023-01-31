export type ComponentTree = {
  [key: string]: (string | ComponentTree)[] | string
}
