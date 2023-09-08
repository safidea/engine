import React from 'react'
import { IUISpi } from '@domain/spi/IUISpi'

const ContainerUnstyledUI: IUISpi['ContainerUI'] = {
  container: ({ children }) => <div>{children}</div>,
}

export default ContainerUnstyledUI
