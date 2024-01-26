import { Role } from '@domain/entities/role/Role'
import { drivers } from '@drivers/index'
import { RoleError } from '@domain/entities/role/RoleError'
import type { EngineError } from '@domain/entities/EngineError'
import { RoleController } from './adapter/controllers/RoleController'

export async function createRole(config: unknown): Promise<{ role?: Role; errors: EngineError[] }> {
  const roleController = new RoleController(drivers)
  const { entity, errors } = await roleController.createEntity(config)
  return { role: entity, errors }
}

export type { IRole } from '@domain/entities/role/IRole'
export { RoleError }
