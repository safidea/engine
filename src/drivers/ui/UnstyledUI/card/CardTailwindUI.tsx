import React from 'react'
import { CardUI } from '@entities/app/page/component/card/CardComponentUI'

const CardUnstyledUI: CardUI = {
  Card: ({ children }) => <div className="bg-white shadow sm:rounded-lg">{children}</div>,
}

export default CardUnstyledUI
