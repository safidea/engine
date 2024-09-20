import type { InputText as Config } from '@adapter/api/configs/Expect/InputText'
import { InputText, type Services } from '@domain/entities/Expect/InputText'

export class InputTextMapper {
  static toEntity = (config: Config, services: Services): InputText => {
    return new InputText(config, services)
  }
}
