import { IUIMapper } from '@entities/services/ui/IUIMapper'
import { IUIDriver } from './IUIDriver'

export class UIMapper implements IUIMapper {
  constructor(readonly driver: IUIDriver) {}

  get driverName() {
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

  getColumns() {
    return this.driver.ColumnsUI
  }

  getImage() {
    return this.driver.ImageUI
  }

  getRows() {
    return this.driver.RowsUI
  }
}
