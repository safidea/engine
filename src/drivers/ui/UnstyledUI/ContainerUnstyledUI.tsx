import React from 'react'
import { IUISpi } from '@entities/services/ui/IUISpi'

const ContainerUnstyledUI: IUISpi['ContainerUI'] = {
  container: ({ children }) => <div>{children}</div>,
}

export default ContainerUnstyledUI
