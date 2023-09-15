import { IUIService } from '@entities/services/ui/IUIService'
import { IUIDriver } from './IUIDriver'

export class UIService implements IUIService {
  constructor(readonly driver: IUIDriver) {}

  get name() {
    return this.driver.name
  }

  getTitle() {
    return this.driver.TitleUI
  }

  getParagraph() {
    return this.driver.ParagraphUI
  }

  getLink() {
    return this.driver.LinkUI
  }

  getNavigation() {
    return this.driver.NavigationUI
  }

  getList() {
    return this.driver.ListUI
  }

  getForm() {
    return this.driver.FormUI
  }

  getTextInput() {
    return this.driver.TextInputUI
  }

  getTableInput() {
    return this.driver.TableInputUI
  }

  getSingleSelectInput() {
    return this.driver.SingleSelectInputUI
  }

  getContainer() {
    return this.driver.ContainerUI
  }


}
