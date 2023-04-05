export async function start(action: unknown, input: unknown): Promise<unknown> {
  return { action, input }
}

export async function run(action: unknown): Promise<unknown> {
  return action
}

export async function end(action: unknown): Promise<unknown> {
  return action
}
