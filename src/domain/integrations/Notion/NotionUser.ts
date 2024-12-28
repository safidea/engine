export class NotionUser {
  constructor(
    readonly id: string,
    readonly email: string,
    readonly name: string | null = null,
    readonly avatarUrl: string | null = null
  ) {}

  getNameOrThrow(): string {
    if (!this.name) throw new Error('Name is not set')
    return this.name
  }

  getAvatarUrlOrThrow(): string {
    if (!this.avatarUrl) throw new Error('Avatar URL is not set')
    return this.avatarUrl
  }
}
