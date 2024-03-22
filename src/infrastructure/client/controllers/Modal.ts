import { Controller } from '@hotwired/stimulus'

export default class Modal extends Controller {
  static targets = ['window']

  declare readonly windowTarget: HTMLDivElement

  open() {
    this.windowTarget.classList.remove('hidden')
  }

  close = () => {
    this.windowTarget.classList.add('hidden')
  }
}
