export interface IPageComponent {
  component: string
  name?: string
  children?: IPageComponent[]
  [x: string]: string | { [key: string]: string } | IPageComponent[] | undefined
}
