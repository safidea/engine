import type { IComponentParagraph, IComponentParagraphProps } from './base/Text'

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

export interface IComponentBase {
  name: string
  template: (props: IComponentParagraphProps) => JSX.Element
}

// TODO: maybe remove this interface and managing only arbitrary props ?
export interface IComponentCustom extends IComponentBase {
  props?: IComponentProp[]
}

export type IComponent = IComponentCustom | IComponentParagraph
