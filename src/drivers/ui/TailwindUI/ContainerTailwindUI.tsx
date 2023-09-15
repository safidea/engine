import React from 'react'
import { IUISpi } from '@entities/services/ui/IUISpi'

const ContainerTailwindUI: IUISpi['ContainerUI'] = {
  // TODO: styled the component for Tailwind
  container: ({ children }) => <div>{children}</div>,
}

export default ContainerTailwindUI
