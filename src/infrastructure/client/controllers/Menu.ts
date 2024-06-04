import { Controller } from '@hotwired/stimulus'

export default class Menu extends Controller {
  static targets = ['panel']

  declare readonly panelTarget: HTMLDivElement

  /*connect() {
    document.addEventListener('click', this.handleClickOutside)
  }

  disconnect() {
    document.removeEventListener('click', this.handleClickOutside)
  }*/

  open() {
    this.panelTarget.classList.remove('hidden')
  }

  close = () => {
    this.panelTarget.classList.add('hidden')
  }

  /*handleClickOutside = (event: MouseEvent) => {
    if (!this.panelTarget.contains(event.target as Node)) {
      this.close()
    }
  }*/
}
