/// <reference lib="dom" />

import '@hotwired/turbo'
import { Application } from '@hotwired/stimulus'
import Modal from './controllers/Modal'

window.Stimulus = Application.start()
window.Stimulus.register('modal', Modal)

console.log('Hotwired client app started')
