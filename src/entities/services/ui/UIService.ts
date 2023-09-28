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

  getColumn() {
    return this.mapper.getColumn()
  }

  getImage() {
    return this.mapper.getImage()
  }

  getRow() {
    return this.mapper.getRow()
  }
}
