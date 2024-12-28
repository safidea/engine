import { describe, it, expect, beforeEach } from 'bun:test'
import { NotionUser } from '@domain/integrations/Notion/NotionUser'

let user: NotionUser

beforeEach(() => {
  user = new NotionUser(
    'user123',
    'test@example.com',
    'Test User',
    'https://example.com/avatar.png'
  )
})

describe('id', () => {
  it('should return the id', () => {
    expect(user.id).toBe('user123')
  })
})

describe('email', () => {
  it('should return the email', () => {
    expect(user.email).toBe('test@example.com')
  })
})

describe('name', () => {
  it('should return the name', () => {
    expect(user.name).toBe('Test User')
  })
})

describe('avatarUrl', () => {
  it('should return the avatarUrl', () => {
    expect(user.avatarUrl).toBe('https://example.com/avatar.png')
  })
})

describe('getNameOrThrow', () => {
  it('should throw an error if getName is called and name is null', () => {
    user = new NotionUser('user123', 'test@example.com')
    expect(() => user.getNameOrThrow()).toThrow('Name is not set')
  })

  it('should return the name if it is set', () => {
    expect(user.getNameOrThrow()).toBe('Test User')
  })
})

describe('getAvatarUrlOrThrow', () => {
  it('should throw an error if getAvatarUrl is called and avatarUrl is null', () => {
    user = new NotionUser('user123', 'test@example.com', 'Test User')
    expect(() => user.getAvatarUrlOrThrow()).toThrow('Avatar URL is not set')
  })

  it('should return the avatarUrl if it is set', () => {
    expect(user.getAvatarUrlOrThrow()).toBe('https://example.com/avatar.png')
  })
})
