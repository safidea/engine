import { IUIMapper } from '@entities/services/ui/IUIMapper'

export class UIService {
  constructor(readonly mapper: IUIMapper) {}

  get driverName() {
    return this.mapper.driverName
  }

  getTitle() {
    return this.mapper.getTitle()
  }

  getParagraph() {
    return this.mapper.getParagraph()
  }

  getLink() {
    return this.mapper.getLink()
  }

  getNavigation() {
    return this.mapper.getNavigation()
  }

  getList() {
    return this.mapper.getList()
  }

  getForm() {
    return this.mapper.getForm()
  }

  getTextInput() {
    return this.mapper.getTextInput()
  }

  getTableInput() {
    return this.mapper.getTableInput()
  }

  getSingleSelectInput() {
    return this.mapper.getSingleSelectInput()
  }

  getContainer() {
    return this.mapper.getContainer()
  }

  getColumns() {
    return this.mapper.getColumns()
  }

  getImage() {
    return this.mapper.getImage()
  }

  getRows() {
    return this.mapper.getRows()
  }

  getButton() {
    return this.mapper.getButton()
  }

  getIcon() {
    return this.mapper.getIcon()
  }
}
