export interface ComponentStyles {
  [property: string]: string
}

export interface ComponentAttrs {
  [attr: string]: string
}

export interface ComponentNode {
  id: string
  type: string
  tag: string
  label: string
  attrs: ComponentAttrs
  styles: ComponentStyles
  classes: string[]
  content: string
  children: ComponentNode[]
  draggable: boolean
  selectable: boolean
  droppable: boolean
  locked: boolean
}

export interface Block {
  id: string
  label: string
  category: string
  icon: string
  template: () => Omit<ComponentNode, 'id'>
}

export interface StyleProperty {
  label: string
  property: string
  type: 'color' | 'text' | 'select' | 'range' | 'number'
  options?: Array<{ value: string; label: string }>
  min?: number
  max?: number
  unit?: string
  default?: string
  placeholder?: string
}

export interface StyleSector {
  name: string
  open: boolean
  properties: StyleProperty[]
}

export interface HistoryEntry {
  tree: ComponentNode[]
  selectedId: string | null
}
