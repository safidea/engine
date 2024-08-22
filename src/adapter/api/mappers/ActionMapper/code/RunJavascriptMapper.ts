import type { RunJavascript as Config } from '@adapter/api/configs/Action/code/RunJavascript'
import { RunJavascript } from '@domain/entities/Action/code/RunJavascript'
import type { JavascriptCompiler } from '@domain/services/JavascriptCompiler'
import type { TemplateCompiler } from '@domain/services/TemplateCompiler'

interface Services {
  javascriptCompiler: JavascriptCompiler
  templateCompiler: TemplateCompiler
}

export class RunJavascriptMapper {
  static toEntity = (config: Config, services: Services): RunJavascript => {
    const { javascriptCompiler, templateCompiler } = services
    return new RunJavascript({ ...config, javascriptCompiler, templateCompiler })
  }
}
