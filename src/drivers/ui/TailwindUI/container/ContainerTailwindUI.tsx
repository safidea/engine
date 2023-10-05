import React from 'react'
import { ContainerUI } from '@entities/app/page/component/container/ContainerComponentUI'

const ContainerTailwindUI: ContainerUI = {
  Container: ({ children, testId }) => {
    return (
      <div className="container mx-auto" data-testid={testId}>
        {children}
      </div>
    )
  },
}

export default ContainerTailwindUI
