import { IIconDriver } from './IIconDriver'
import { IIconMapper } from '@entities/services/icon/IIconMapper'

export class IconMapper implements IIconMapper {
  constructor(readonly driver: IIconDriver) {}

  get driverName() {
    return this.driver.name
  }
}
