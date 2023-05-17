import '@testing-library/jest-dom'
import ResizeObserver from 'resize-observer-polyfill'
import userEvent from '@testing-library/user-event'

const user = userEvent.setup()

global.ResizeObserver = ResizeObserver

export { user }
