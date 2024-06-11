import { Controller } from '@hotwired/stimulus'

export default class Dropdown extends Controller {
  static targets = ['menu']

  declare readonly menuTarget: HTMLDivElement

  show() {
    this.menuTarget.classList.remove('hidden')
  }

  hide() {
    this.menuTarget.classList.add('hidden')
  }
}
