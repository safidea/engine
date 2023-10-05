import { describe, test, expect } from 'bun:test'
import { IUIDriverStyle, TailwindUI } from './index'
import { getIconDriver } from '@drivers/icon'

describe('TailwindUI', () => {
  test('should apply a background style', async () => {
    // GIVEN
    const style: IUIDriverStyle = {
      background: {
        color: 'gray-100',
      },
    }
    const tailwindUI = new TailwindUI(getIconDriver())

    // WHEN
    const className = tailwindUI.applyStyle(style)

    // THEN
    expect(className).toEqual('bg-gray-100')
  })
})
