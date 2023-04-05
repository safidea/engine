export async function start(automation: unknown, input: unknown): Promise<unknown> {
  return { automation, input }
}

export async function run(automation: unknown): Promise<unknown> {
  return automation
}

export async function end(automation: unknown): Promise<unknown> {
  return automation
}
