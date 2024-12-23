import { NotionUser } from '@domain/integrations/Notion/NotionUser'
import type { NotionUserDto } from '../dtos/NotionUserDto'

export class NotionUserMapper {
  static toEntity(userDto: NotionUserDto): NotionUser {
    return new NotionUser(userDto.id, userDto.email, userDto.name, userDto.avatarUrl)
  }

  static toManyEntities(userDtos: NotionUserDto[]): NotionUser[] {
    return userDtos.map(NotionUserMapper.toEntity)
  }
}
