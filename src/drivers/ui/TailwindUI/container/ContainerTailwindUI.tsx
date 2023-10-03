import React from 'react'
import { ContainerUI } from '@entities/app/page/component/container/ContainerComponentUI'

const ContainerTailwindUI: ContainerUI = {
  Container: ({ children, testId }) => {
    return (
      <div className="container mx-auto flex flex-row" data-testid={testId}>
        {children}
      </div>
    )
  },
}

export default ContainerTailwindUI
