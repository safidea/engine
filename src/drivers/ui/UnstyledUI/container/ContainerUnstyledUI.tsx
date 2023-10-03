import React from 'react'
import { ContainerUI } from '@entities/app/page/component/container/ContainerComponentUI'

const ContainerUnstyledUI: ContainerUI = {
  Container: ({ children, testId }) => <div data-testid={testId}>{children}</div>,
}

export default ContainerUnstyledUI
