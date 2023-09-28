import React from 'react'
import { ContainerUI } from '@entities/app/page/component/container/ContainerComponentUI'

const ContainerTailwindUI: ContainerUI = {
  Container: ({ children }) => {
    return <div className="container mx-auto flex flex-row">{children}</div>
  },
}

export default ContainerTailwindUI
