export class NotionUser {
  constructor(
    public id: string,
    public email: string,
    public name: string | null = null,
    public avatarUrl: string | null = null
  ) {}

  getName(): string {
    if (!this.name) throw new Error('Name is not set')
    return this.name
  }

  getAvatarUrl(): string {
    if (!this.avatarUrl) throw new Error('Avatar URL is not set')
    return this.avatarUrl
  }
}
