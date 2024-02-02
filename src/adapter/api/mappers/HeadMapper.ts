import { Head } from '@domain/entities/Head'
import type { HeadDto } from '../dtos/HeadDto'
import { Meta } from '@domain/entities/Head/Meta'
import { Link } from '@domain/entities/Head/Link'
import { Script } from '@domain/entities/Head/Script'

export class HeadMapper {
  static toEntity(dto: HeadDto) {
    const Metas = dto.metas.map((meta) => new Meta(meta))
    const Links = dto.links.map((link) => new Link(link))
    const Scripts = dto.scripts.map((script) => new Script(script))
    return new Head({
      title: dto.title,
      metas: Metas,
      links: Links,
      scripts: Scripts,
    })
  }
}
