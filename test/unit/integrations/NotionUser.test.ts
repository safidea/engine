import { test, expect } from 'bun:test'
import { NotionUser } from '@domain/integrations/Notion/NotionUser'

test('should create a user with the given properties', () => {
  const user = new NotionUser(
    'user123',
    'test@example.com',
    'Test User',
    'https://example.com/avatar.png'
  )

  expect(user.id).toBe('user123')
  expect(user.email).toBe('test@example.com')
  expect(user.name).toBe('Test User')
  expect(user.avatarUrl).toBe('https://example.com/avatar.png')
})

test('should throw an error if getName is called and name is null', () => {
  const user = new NotionUser('user123', 'test@example.com')
  expect(() => user.getName()).toThrow('Name is not set')
})

test('should return the name if it is set', () => {
  const user = new NotionUser('user123', 'test@example.com', 'Test User')
  expect(user.getName()).toBe('Test User')
})

test('should throw an error if getAvatarUrl is called and avatarUrl is null', () => {
  const user = new NotionUser('user123', 'test@example.com', 'Test User')
  expect(() => user.getAvatarUrl()).toThrow('Avatar URL is not set')
})

test('should return the avatarUrl if it is set', () => {
  const user = new NotionUser(
    'user123',
    'test@example.com',
    'Test User',
    'https://example.com/avatar.png'
  )
  expect(user.getAvatarUrl()).toBe('https://example.com/avatar.png')
})
