<template>
  <component
    :is="node.tag"
    ref="elRef"
    class="wb-node"
    :class="nodeClasses"
    :data-id="node.id"
    v-bind="nodeAttrs"
    :contenteditable="isEditing ? 'true' : undefined"
    @click.stop="handleClick($event)"
    @mouseenter.stop="handleMouseEnter"
    @mouseleave.stop="handleMouseLeave"
    @blur="stopEdit"
    @keydown.esc.stop.prevent="stopEdit"
    @input.stop="onInput"
    @dragover.prevent.stop="handleDragOver"
    @dragleave.stop="handleDragLeave"
    @drop.stop="handleDrop"
  >
    <!-- Don't render Vue children while editing — we control innerText directly -->
    <template v-if="!isEditing">
      <!-- Void / self-closing tags have no children -->
      <template v-if="!isVoid">
        <!-- Text content (leaf nodes) -->
        <template v-if="hasTextContent && !node.children.length">{{ node.content }}</template>
        <!-- Child components -->
        <ComponentNode
          v-for="child in node.children"
          :key="child.id"
          :node="child"
          :active-device="activeDevice"
        />
        <!-- Empty droppable hint -->
        <div
          v-if="node.droppable && !node.children.length && !hasTextContent"
          class="drop-hint"
        >
          Drop here
        </div>
      </template>
    </template>
  </component>
</template>

<script setup lang="ts">
import { computed, ref, nextTick } from 'vue'
import { useEditorStore } from '../../stores/editor'
import { defaultBlocks } from '../../blocks/defaultBlocks'
import type { ComponentNode } from '../../types'

const props = defineProps<{ node: ComponentNode; activeDevice?: string }>()

const store = useEditorStore()
const elRef = ref<HTMLElement | null>(null)
const isEditing = ref(false)
const isDragTarget = ref(false)

const VOID_TAGS = new Set(['img', 'hr', 'br', 'input', 'video'])

const isVoid = computed(() => VOID_TAGS.has(props.node.tag))
const hasTextContent = computed(() => !!props.node.content)
const isSelected = computed(() => store.selectedId === props.node.id)
const isHovered = computed(() => store.hoveredId === props.node.id && !isSelected.value)

// Only leaf text nodes are directly editable (no children, has content, not void)
const isTextEditable = computed(
  () => hasTextContent.value && !isVoid.value && props.node.children.length === 0,
)

const nodeClasses = computed(() => ({
  'wb-selected': isSelected.value,
  'wb-hovered': isHovered.value,
  'wb-drop-target': isDragTarget.value,
  'wb-editing': isEditing.value,
  [`wb-type-${props.node.type}`]: true,
}))

const nodeAttrs = computed(() => {
  const attrs: Record<string, string> = { ...props.node.attrs }
  const styles = { ...props.node.styles }

  // Responsive overrides for mobile
  if (props.activeDevice === 'mobile') {
    if (props.node.type === 'columns') {
      styles['flex-direction'] = 'column'
      styles['width'] = '100%'
    }
    if (props.node.type === 'column') {
      styles['width'] = '100%'
      styles['max-width'] = '100%'
      styles['flex'] = 'none'
      styles['min-width'] = '0'
      styles['overflow'] = 'hidden'
      styles['box-sizing'] = 'border-box'
    }
    if (props.node.type === 'image') {
      styles['width'] = '100%'
      styles['max-width'] = '100%'
      styles['height'] = 'auto'
    }
  }

  attrs.style = Object.entries(styles).map(([k, v]) => `${k}:${v}`).join(';')
  if (props.node.classes.length) {
    attrs.class = props.node.classes.join(' ')
  }
  return attrs
})

// ── Event handlers ────────────────────────────────────────────────────────

function handleClick(e: MouseEvent) {
  // Prevent <a> tags from navigating in the editor
  if (props.node.tag === 'a') e.preventDefault()

  if (isEditing.value) return // let browser position cursor

  if (!props.node.selectable) return

  if (isSelected.value && isTextEditable.value) {
    // Second click on already-selected text node → enter edit mode
    enterEditMode()
  } else {
    store.select(props.node.id)
  }
}

function handleMouseEnter() {
  store.setHovered(props.node.id)
}

function handleMouseLeave() {
  if (store.hoveredId === props.node.id) store.setHovered(null)
}

function enterEditMode() {
  isEditing.value = true
  nextTick(() => {
    const el = elRef.value
    if (!el) return
    // Manually set text — Vue no longer controls this while editing
    el.innerText = props.node.content
    el.focus()
    // Place caret at end
    const range = document.createRange()
    range.selectNodeContents(el)
    range.collapse(false)
    const sel = window.getSelection()
    sel?.removeAllRanges()
    sel?.addRange(range)
  })
}

function stopEdit() {
  if (!isEditing.value) return
  if (elRef.value) {
    // Save final text back to store before Vue re-takes control
    store.updateContent(props.node.id, elRef.value.innerText)
  }
  isEditing.value = false
}

function onInput(e: Event) {
  // Live-update store so layer tree / trait panel stay in sync
  store.updateContent(props.node.id, (e.target as HTMLElement).innerText)
}

// ── Drag & drop ───────────────────────────────────────────────────────────

function handleDragOver() {
  if (props.node.droppable) isDragTarget.value = true
}

function handleDragLeave() {
  isDragTarget.value = false
}

function handleDrop(e: DragEvent) {
  isDragTarget.value = false
  const blockId = e.dataTransfer?.getData('text/plain')
  if (!blockId) return
  const block = defaultBlocks.find((b) => b.id === blockId)
  if (!block || !props.node.droppable) return
  store.addBlock(block.template(), props.node.id)
}
</script>

<style>
/* Global — scoped won't apply to dynamically-rendered tag names */
.wb-node {
  position: relative;
  box-sizing: border-box;
  max-width: 100%;
  outline: 2px solid transparent;
  outline-offset: -2px;
  transition: outline-color 0.1s;
}

.wb-node.wb-hovered {
  outline: 2px dashed #ff6b35 !important;
}

.wb-node.wb-selected {
  outline: 2px solid #ff6b35 !important;
}

.wb-node.wb-editing {
  outline: 2px solid #f39c12 !important;
  cursor: text !important;
}

.wb-node.wb-drop-target {
  outline: 2px solid #2ecc71 !important;
  background-color: rgba(46, 204, 113, 0.05) !important;
}

.drop-hint {
  text-align: center;
  color: #bbb;
  font-size: 13px;
  padding: 20px;
  border: 2px dashed #ddd;
  border-radius: 4px;
  pointer-events: none;
  user-select: none;
}
</style>
