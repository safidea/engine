import type { RunJavascriptCode as Config } from '@adapter/api/configs/Action/RunJavascriptCode'
import { RunJavascriptCode } from '@domain/entities/Action/RunJavascriptCode'

export class RunJavascriptCodeMapper {
  static toEntity = (config: Config): RunJavascriptCode => {
    return new RunJavascriptCode({ ...config })
  }
}
