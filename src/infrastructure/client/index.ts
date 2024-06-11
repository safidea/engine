/// <reference lib="dom" />

import '@hotwired/turbo'
import { Application } from '@hotwired/stimulus'
import Modal from './controllers/Modal'
import Dropdown from './controllers/Dropdown'

window.Stimulus = Application.start()
window.Stimulus.register('modal', Modal)
window.Stimulus.register('dropdown', Dropdown)

console.log('Hotwired client app started')
