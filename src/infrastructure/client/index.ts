/// <reference lib="dom" />

import '@hotwired/turbo'
import { Application } from '@hotwired/stimulus'
import Modal from './controllers/Modal'
import Menu from './controllers/Menu'

window.Stimulus = Application.start()
window.Stimulus.register('modal', Modal)
window.Stimulus.register('menu', Menu)

console.log('Hotwired client app started')
