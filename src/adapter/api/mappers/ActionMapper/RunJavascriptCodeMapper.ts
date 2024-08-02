import type { RunJavascriptCode as Config } from '@adapter/api/configs/Action/RunJavascriptCode'
import { RunJavascriptCode } from '@domain/entities/Action/RunJavascriptCode'
import type { CodeCompiler } from '@domain/services/CodeCompiler'
import type { TemplateCompiler } from '@domain/services/TemplateCompiler'

interface Services {
  codeCompiler: CodeCompiler
  templateCompiler: TemplateCompiler
}

export class RunJavascriptCodeMapper {
  static toEntity = (config: Config, services: Services): RunJavascriptCode => {
    const { codeCompiler, templateCompiler } = services
    return new RunJavascriptCode({ ...config, codeCompiler, templateCompiler })
  }
}
