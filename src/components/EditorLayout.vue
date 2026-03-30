<template>
  <div class="editor-layout">
    <!-- Top toolbar -->
    <Toolbar @device-change="activeDevice = $event" />

    <div class="editor-body">
      <!-- Left panel -->
      <aside class="left-panel">
        <div class="tab-bar">
          <button
            class="tab-btn"
            :class="{ active: store.activeLeftTab === 'blocks' }"
            @click="store.activeLeftTab = 'blocks'"
          >Blocks</button>
          <button
            class="tab-btn"
            :class="{ active: store.activeLeftTab === 'layers' }"
            @click="store.activeLeftTab = 'layers'"
          >Layers</button>
        </div>
        <div class="tab-content">
          <BlockPanel v-show="store.activeLeftTab === 'blocks'" />
          <LayerPanel v-show="store.activeLeftTab === 'layers'" />
        </div>
      </aside>

      <!-- Canvas -->
      <main class="canvas-area">
        <Canvas :active-device="activeDevice" />
      </main>

      <!-- Right panel -->
      <aside class="right-panel">
        <div class="tab-bar">
          <button
            class="tab-btn"
            :class="{ active: store.activeRightTab === 'styles' }"
            @click="store.activeRightTab = 'styles'"
          >Style</button>
          <button
            class="tab-btn"
            :class="{ active: store.activeRightTab === 'traits' }"
            @click="store.activeRightTab = 'traits'"
          >Traits</button>
        </div>
        <div class="tab-content">
          <StylePanel v-show="store.activeRightTab === 'styles'" />
          <TraitPanel v-show="store.activeRightTab === 'traits'" />
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useEditorStore } from '../stores/editor'
import Toolbar from './toolbar/Toolbar.vue'
import BlockPanel from './panels/BlockPanel.vue'
import LayerPanel from './panels/LayerPanel.vue'
import StylePanel from './panels/StylePanel.vue'
import TraitPanel from './panels/TraitPanel.vue'
import Canvas from './canvas/Canvas.vue'

const store = useEditorStore()
const activeDevice = ref('desktop')

// Global keyboard shortcuts
function handleKeydown(e: KeyboardEvent) {
  const target = e.target as HTMLElement
  const tag = target.tagName.toLowerCase()
  if (['input', 'textarea', 'select'].includes(tag)) return
  // Don't intercept keys while typing inside a contenteditable canvas element
  if (target.isContentEditable) return

  if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
    e.preventDefault()
    store.undo()
  }
  if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.shiftKey && e.key === 'z'))) {
    e.preventDefault()
    store.redo()
  }
  if ((e.key === 'Delete' || e.key === 'Backspace') && store.selectedId) {
    e.preventDefault()
    store.removeComponent(store.selectedId)
  }
  if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
    e.preventDefault()
    if (store.selectedId) store.duplicateComponent(store.selectedId)
  }
}

onMounted(() => window.addEventListener('keydown', handleKeydown))
onUnmounted(() => window.removeEventListener('keydown', handleKeydown))
</script>

<style scoped>
.editor-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  background: #0d1b2a;
}

.editor-body {
  flex: 1;
  display: flex;
  min-height: 0;
}

.left-panel,
.right-panel {
  width: 240px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  background: #0d1b2a;
  border-right: 1px solid #1e3a5f;
  overflow: hidden;
}

.right-panel {
  border-right: none;
  border-left: 1px solid #1e3a5f;
}

.canvas-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  overflow: hidden;
}

.tab-bar {
  display: flex;
  background: #0a1520;
  border-bottom: 1px solid #1e3a5f;
  flex-shrink: 0;
}

.tab-btn {
  flex: 1;
  background: none;
  border: none;
  color: #6a8a9a;
  padding: 9px 0;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  letter-spacing: 0.3px;
  transition: color 0.15s, background 0.15s;
  border-bottom: 2px solid transparent;
}
.tab-btn:hover { color: #aac; background: #122030; }
.tab-btn.active { color: #4cc9f0; border-bottom-color: #4cc9f0; }

.tab-content {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
</style>
