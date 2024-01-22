export interface IComponentBaseProp {
  name: string
}

export interface IComponentObjectProp extends IComponentBaseProp {
  type: 'object'
  props: IComponentProp[]
}

export interface IComponentStringProp extends IComponentBaseProp {
  type: 'string'
}

export type IComponentProp = IComponentObjectProp | IComponentStringProp

export interface IComponent {
  name: string
  template: string
  props?: IComponentProp[]
}
