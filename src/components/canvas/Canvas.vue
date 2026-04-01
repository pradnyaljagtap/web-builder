<template>
  <div class="canvas-wrapper">
    <!-- Canvas frame -->
    <div
      class="canvas-frame"
      :class="`device-${activeDevice}`"
      @click.self="store.select(null)"
      @dragover.prevent
      @drop.self="onDropCanvas"
    >
      <!-- Render component tree -->
      <ComponentNode
        v-for="node in store.tree"
        :key="node.id"
        :node="node"
        :active-device="activeDevice"
      />

      <!-- Empty state -->
      <div v-if="store.tree.length === 0" class="canvas-empty">
        <div class="empty-icon">⬛</div>
        <p>Drag blocks from the left panel to start building</p>
      </div>
    </div>

    <!-- Selected component toolbar -->
    <Teleport to="body">
      <div
        v-if="store.selectedComponent && selectedRect"
        class="selection-toolbar"
        :style="selectionToolbarStyle"
      >
        <span class="sel-label">{{ store.selectedComponent.label }}</span>
        <button class="sel-btn" title="Move Up" @click="store.moveUp(store.selectedId!)">↑</button>
        <button class="sel-btn" title="Move Down" @click="store.moveDown(store.selectedId!)">↓</button>
        <button class="sel-btn" title="Duplicate" @click="store.duplicateComponent(store.selectedId!)">⧉</button>
        <button class="sel-btn danger" title="Delete" @click="store.removeComponent(store.selectedId!)">✕</button>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted, watch } from 'vue'
import { useEditorStore } from '../../stores/editor'
import { defaultBlocks } from '../../blocks/defaultBlocks'
import ComponentNode from './ComponentNode.vue'

const props = defineProps<{ activeDevice: string }>()

const store = useEditorStore()
const selectedRect = ref<DOMRect | null>(null)

// Update selected rect when selection changes
function updateSelectionRect() {
  if (!store.selectedId) {
    selectedRect.value = null
    return
  }
  const el = document.querySelector(`[data-id="${store.selectedId}"]`)
  if (el) {
    selectedRect.value = el.getBoundingClientRect()
  }
}

const selectionToolbarStyle = computed(() => {
  if (!selectedRect.value) return {}
  const rect = selectedRect.value
  const top = Math.max(rect.top - 32, 4)
  return {
    top: `${top}px`,
    left: `${rect.left}px`,
    minWidth: `${Math.max(rect.width, 180)}px`,
  }
})

watch(() => store.selectedId, () => {
  setTimeout(updateSelectionRect, 0)
})

function onDropCanvas(e: DragEvent) {
  const blockId = e.dataTransfer?.getData('text/plain')
  if (!blockId) return
  const block = defaultBlocks.find((b) => b.id === blockId)
  if (block) store.addBlock(block.template(), null)
}

onMounted(() => {
  window.addEventListener('scroll', updateSelectionRect, true)
  window.addEventListener('resize', updateSelectionRect)
})
onUnmounted(() => {
  window.removeEventListener('scroll', updateSelectionRect, true)
  window.removeEventListener('resize', updateSelectionRect)
})
</script>

<style scoped>
.canvas-wrapper {
  flex: 1;
  background: #e8eaed;
  overflow: auto;
  display: flex;
  justify-content: center;
  padding: 28px;
  min-height: 0;
}
.canvas-wrapper::-webkit-scrollbar { width: 6px; height: 6px; }
.canvas-wrapper::-webkit-scrollbar-thumb { background: #c5c9d0; border-radius: 3px; }

.canvas-frame {
  background: #fff;
  min-height: 600px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.4);
  border-radius: 2px;
  transition: width 0.3s;
  position: relative;
  overflow-x: hidden;
  box-sizing: border-box;
}

.device-desktop { width: 100%; max-width: 1280px; }
.device-tablet  { width: 768px; }
.device-mobile  { width: 375px; }

.canvas-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  height: 400px;
  color: #bbb;
  user-select: none;
  pointer-events: none;
}
.empty-icon { font-size: 48px; opacity: 0.3; }
.canvas-empty p { font-size: 14px; }
</style>

<style>
/* Global: selection toolbar (teleported to body) */
.selection-toolbar {
  position: fixed;
  display: flex;
  align-items: center;
  gap: 4px;
  background: #ff6b35;
  color: #fff;
  padding: 3px 6px;
  border-radius: 4px 4px 0 0;
  font-size: 11px;
  font-weight: 600;
  z-index: 9999;
  pointer-events: all;
  white-space: nowrap;
  box-shadow: 0 2px 8px rgba(255,107,53,0.35);
}
.sel-label {
  margin-right: 4px;
  padding-right: 8px;
  border-right: 1px solid rgba(255,255,255,0.3);
}
.sel-btn {
  background: rgba(255,255,255,0.15);
  border: none;
  cursor: pointer;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 12px;
  color: #fff;
  transition: background 0.1s;
}
.sel-btn:hover { background: rgba(255,255,255,0.3); }
.sel-btn.danger:hover { background: #c0392b; color: #fff; }
</style>
