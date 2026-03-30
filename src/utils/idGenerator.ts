let counter = 0

export function generateId(): string {
  return `c-${Date.now()}-${++counter}`
}

export function generateIds(node: { id: string; children: { id: string; children: unknown[] }[] }): void {
  node.id = generateId()
  node.children.forEach((child) => generateIds(child as { id: string; children: { id: string; children: unknown[] }[] }))
}
