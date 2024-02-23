import React from 'react'
import { ButtonUI } from '@entities/app/page/component/button/ButtonComponentUI'
import { ApplyStyle } from '..'

const ButtonTailwindUI = (applyStyle: ApplyStyle): ButtonUI => ({
  Button: ({ children, style }) => {
    return <button className={applyStyle(style)}>{children}</button>
  },
})

export default ButtonTailwindUI
