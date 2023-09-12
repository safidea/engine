import React from 'react'
import { IUISpi } from '@entities/app/page/IUISpi'

const ContainerUnstyledUI: IUISpi['ContainerUI'] = {
  container: ({ children }) => <div>{children}</div>,
}

export default ContainerUnstyledUI
