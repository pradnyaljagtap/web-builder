<template>
  <div class="editor-layout">
    <!-- Top toolbar -->
    <Toolbar />

    <div class="editor-body">
      <!-- Canvas -->
      <main class="canvas-area">
        <Canvas :active-device="store.activeDevice" />
      </main>

      <!-- Right side: content panel + vertical icon tabs -->
      <aside class="right-side">
        <div class="panel-content">
          <BlockPanel v-show="activeTab === 'content'" />
          <LayerPanel v-show="activeTab === 'layers'" />
          <StylePanel v-show="activeTab === 'style'" />
          <TraitPanel v-show="activeTab === 'traits'" />
        </div>

        <div class="icon-tabs">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            class="icon-tab"
            :class="{ active: activeTab === tab.id }"
            :title="tab.label"
            @click="activeTab = tab.id"
          >
            <span class="icon-tab-icon" v-html="tab.icon" />
            <span class="icon-tab-label">{{ tab.label }}</span>
          </button>
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
const activeTab = ref<'content' | 'layers' | 'style' | 'traits'>('content')

const tabs = [
  {
    id: 'content',
    label: 'Content',
    icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M4 5h6v6H4zM14 5h6v6h-6zM4 13h6v6H4zM14 13h6v6h-6z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>`,
  },
  {
    id: 'layers',
    label: 'Blocks',
    icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="4" rx="1.5" stroke="currentColor" stroke-width="1.6"/><rect x="3" y="10" width="18" height="4" rx="1.5" stroke="currentColor" stroke-width="1.6"/><rect x="3" y="16" width="18" height="4" rx="1.5" stroke="currentColor" stroke-width="1.6"/></svg>`,
  },
  {
    id: 'style',
    label: 'Body',
    icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="2.5" stroke="currentColor" stroke-width="1.6"/><rect x="7" y="7" width="10" height="10" rx="1.5" stroke="currentColor" stroke-width="1.4"/></svg>`,
  },
  {
    id: 'images',
    label: 'Images',
    icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" stroke-width="1.6"/><circle cx="8.5" cy="10" r="1.5" fill="currentColor"/><path d="M3 17l5-4 4 3 3-2.5 6 4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  },
  {
    id: 'traits',
    label: 'Audit',
    icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="4" y="3" width="16" height="18" rx="2" stroke="currentColor" stroke-width="1.6"/><line x1="8" y1="8" x2="16" y2="8" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><line x1="8" y1="12" x2="16" y2="12" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><line x1="8" y1="16" x2="12" y2="16" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>`,
  },
]

// Global keyboard shortcuts
function handleKeydown(e: KeyboardEvent) {
  const target = e.target as HTMLElement
  const tag = target.tagName.toLowerCase()
  if (['input', 'textarea', 'select'].includes(tag)) return
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
  background: #f0f2f5;
}

.editor-body {
  flex: 1;
  display: flex;
  min-height: 0;
}

.canvas-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  overflow: hidden;
}

/* Right side: panel content + icon tabs */
.right-side {
  display: flex;
  flex-direction: row;
  flex-shrink: 0;
  border-left: 1px solid #e2e5e9;
  background: #fff;
}

.panel-content {
  width: 260px;
  min-width: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: #fff;
  border-right: 1px solid #e2e5e9;
}

/* Vertical icon tabs on the far right */
.icon-tabs {
  width: 72px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  background: #fff;
  border-left: 1px solid #e2e5e9;
  padding: 4px 0;
  gap: 0;
  overflow-y: auto;
}

.icon-tab {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  padding: 12px 4px 10px;
  background: none;
  border: none;
  border-left: 3px solid transparent;
  cursor: pointer;
  color: #9aa5b4;
  transition: color 0.15s, border-color 0.15s, background 0.15s;
}
.icon-tab:hover {
  color: #555;
  background: #f8f9fa;
}
.icon-tab.active {
  color: #ff6b35;
  border-left-color: #ff6b35;
  background: #fff8f5;
}

.icon-tab-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}

.icon-tab-label {
  font-size: 10px;
  font-weight: 600;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  letter-spacing: 0.2px;
  text-align: center;
  white-space: nowrap;
}
</style>
