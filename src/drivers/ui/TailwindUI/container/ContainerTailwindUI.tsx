import React from 'react'
import { ContainerUI } from '@entities/app/page/component/container/ContainerComponentUI'

const ContainerTailwindUI: ContainerUI = {
  Container: ({ children, columns }) => (
    <div className={`container mx-auto columns-${columns}`}>{children}</div>
  ),
}

export default ContainerTailwindUI
