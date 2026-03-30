import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { ComponentNode, HistoryEntry } from '../types'
import { generateId, generateIds } from '../utils/idGenerator'

export const useEditorStore = defineStore('editor', () => {
  const tree = ref<ComponentNode[]>([])
  const selectedId = ref<string | null>(null)
  const hoveredId = ref<string | null>(null)
  const history = ref<HistoryEntry[]>([{ tree: [], selectedId: null }])
  const historyIndex = ref(0)
  const activeLeftTab = ref<'blocks' | 'layers'>('blocks')
  const activeRightTab = ref<'styles' | 'traits'>('styles')

  // ── Getters ──────────────────────────────────────────────────────────────

  const selectedComponent = computed(() =>
    selectedId.value ? findById(tree.value, selectedId.value) : null
  )

  const canUndo = computed(() => historyIndex.value > 0)
  const canRedo = computed(() => historyIndex.value < history.value.length - 1)

  // ── Tree helpers ──────────────────────────────────────────────────────────

  function findById(nodes: ComponentNode[], id: string): ComponentNode | null {
    for (const node of nodes) {
      if (node.id === id) return node
      const found = findById(node.children, id)
      if (found) return found
    }
    return null
  }

  function findParent(nodes: ComponentNode[], id: string): ComponentNode | null {
    for (const node of nodes) {
      if (node.children.some((c) => c.id === id)) return node
      const found = findParent(node.children, id)
      if (found) return found
    }
    return null
  }

  function removeFromTree(nodes: ComponentNode[], id: string): boolean {
    const idx = nodes.findIndex((n) => n.id === id)
    if (idx !== -1) {
      nodes.splice(idx, 1)
      return true
    }
    for (const node of nodes) {
      if (removeFromTree(node.children, id)) return true
    }
    return false
  }

  // ── History ───────────────────────────────────────────────────────────────

  function snapshot() {
    const entry: HistoryEntry = {
      tree: JSON.parse(JSON.stringify(tree.value)),
      selectedId: selectedId.value,
    }
    history.value = history.value.slice(0, historyIndex.value + 1)
    history.value.push(entry)
    historyIndex.value++
  }

  function restoreEntry(entry: HistoryEntry) {
    tree.value = JSON.parse(JSON.stringify(entry.tree))
    selectedId.value = entry.selectedId
  }

  // ── Actions ───────────────────────────────────────────────────────────────

  function select(id: string | null) {
    selectedId.value = id
  }

  function setHovered(id: string | null) {
    hoveredId.value = id
  }

  function addBlock(template: Omit<ComponentNode, 'id'>, parentId?: string | null) {
    snapshot()
    const node: ComponentNode = JSON.parse(JSON.stringify({ ...template, id: '' }))
    generateIds(node as unknown as { id: string; children: { id: string; children: unknown[] }[] })

    if (parentId) {
      const parent = findById(tree.value, parentId)
      if (parent?.droppable) {
        parent.children.push(node)
        selectedId.value = node.id
        return
      }
    }
    tree.value.push(node)
    selectedId.value = node.id
  }

  function removeComponent(id: string) {
    snapshot()
    removeFromTree(tree.value, id)
    if (selectedId.value === id) selectedId.value = null
  }

  function updateStyle(id: string, property: string, value: string) {
    const node = findById(tree.value, id)
    if (!node) return
    if (value === '') {
      delete node.styles[property]
    } else {
      node.styles[property] = value
    }
  }

  function updateContent(id: string, content: string) {
    const node = findById(tree.value, id)
    if (node) node.content = content
  }

  function updateAttr(id: string, attr: string, value: string) {
    const node = findById(tree.value, id)
    if (node) node.attrs[attr] = value
  }

  function duplicateComponent(id: string) {
    snapshot()
    const node = findById(tree.value, id)
    if (!node) return
    const clone: ComponentNode = JSON.parse(JSON.stringify(node))
    generateIds(clone as unknown as { id: string; children: { id: string; children: unknown[] }[] })

    const parent = findParent(tree.value, id)
    if (parent) {
      const idx = parent.children.findIndex((c) => c.id === id)
      parent.children.splice(idx + 1, 0, clone)
    } else {
      const idx = tree.value.findIndex((n) => n.id === id)
      tree.value.splice(idx + 1, 0, clone)
    }
    selectedId.value = clone.id
  }

  function moveUp(id: string) {
    snapshot()
    const parent = findParent(tree.value, id)
    const arr = parent ? parent.children : tree.value
    const idx = arr.findIndex((n) => n.id === id)
    if (idx > 0) {
      const tmp = arr[idx]
      arr[idx] = arr[idx - 1]
      arr[idx - 1] = tmp
    }
  }

  function moveDown(id: string) {
    snapshot()
    const parent = findParent(tree.value, id)
    const arr = parent ? parent.children : tree.value
    const idx = arr.findIndex((n) => n.id === id)
    if (idx < arr.length - 1) {
      const tmp = arr[idx]
      arr[idx] = arr[idx + 1]
      arr[idx + 1] = tmp
    }
  }

  function undo() {
    if (canUndo.value) {
      historyIndex.value--
      restoreEntry(history.value[historyIndex.value])
    }
  }

  function redo() {
    if (canRedo.value) {
      historyIndex.value++
      restoreEntry(history.value[historyIndex.value])
    }
  }

  function clearCanvas() {
    snapshot()
    tree.value = []
    selectedId.value = null
  }

  function saveToJson(): string {
    return JSON.stringify({ tree: tree.value }, null, 2)
  }

  function loadFromJson(json: string) {
    try {
      const data = JSON.parse(json)
      snapshot()
      tree.value = data.tree ?? []
      selectedId.value = null
    } catch {
      alert('Invalid JSON file')
    }
  }

  function generateNewId(): string {
    return generateId()
  }

  return {
    tree,
    selectedId,
    hoveredId,
    activeLeftTab,
    activeRightTab,
    selectedComponent,
    canUndo,
    canRedo,
    findById,
    findParent,
    select,
    setHovered,
    addBlock,
    removeComponent,
    updateStyle,
    updateContent,
    updateAttr,
    duplicateComponent,
    moveUp,
    moveDown,
    undo,
    redo,
    clearCanvas,
    saveToJson,
    loadFromJson,
    generateNewId,
  }
})
