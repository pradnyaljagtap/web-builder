<template>
  <header class="toolbar">
    <!-- Left: branding -->
    <div class="toolbar-left">
      <span class="brand">Web Builder</span>
    </div>

    <!-- Center: device switcher -->
    <div class="toolbar-center">
      <button
        v-for="device in devices"
        :key="device.id"
        class="device-btn"
        :class="{ active: activeDevice === device.id }"
        :title="device.label"
        @click="activeDevice = device.id"
      >
        {{ device.icon }}
      </button>
    </div>

    <!-- Right: actions -->
    <div class="toolbar-right">
      <button class="tb-btn" :disabled="!store.canUndo" title="Undo (Ctrl+Z)" @click="store.undo()">↩</button>
      <button class="tb-btn" :disabled="!store.canRedo" title="Redo (Ctrl+Y)" @click="store.redo()">↪</button>
      <div class="separator" />
      <button class="tb-btn danger" title="Clear canvas" @click="confirmClear">🗑</button>
      <div class="separator" />
      <button class="tb-btn" title="Export HTML" @click="exportHtml">HTML</button>
      <button class="tb-btn" title="Save JSON" @click="saveJson">Save</button>
      <label class="tb-btn" title="Load JSON">
        Load
        <input ref="fileInput" type="file" accept=".json" style="display:none" @change="loadJson" />
      </label>
      <button class="tb-btn primary" title="Preview" @click="preview">Preview</button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useEditorStore } from '../../stores/editor'
import { exportToHtml } from '../../utils/htmlExporter'

const store = useEditorStore()
const fileInput = ref<HTMLInputElement | null>(null)

const devices = [
  { id: 'desktop', label: 'Desktop', icon: '🖥' },
  { id: 'tablet', label: 'Tablet', icon: '📱' },
  { id: 'mobile', label: 'Mobile', icon: '📲' },
]
const activeDevice = ref('desktop')

const emit = defineEmits<{ (e: 'deviceChange', id: string): void }>()

function confirmClear() {
  if (store.tree.length === 0 || confirm('Clear the canvas? This cannot be undone.')) {
    store.clearCanvas()
  }
}

function exportHtml() {
  const html = exportToHtml(store.tree)
  const blob = new Blob([html], { type: 'text/html' })
  downloadBlob(blob, 'page.html')
}

function saveJson() {
  const json = store.saveToJson()
  const blob = new Blob([json], { type: 'application/json' })
  downloadBlob(blob, 'page.json')
}

function loadJson(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (ev) => store.loadFromJson(ev.target?.result as string)
  reader.readAsText(file)
}

function preview() {
  const html = exportToHtml(store.tree)
  const win = window.open('', '_blank')
  if (win) {
    win.document.write(html)
    win.document.close()
  }
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
</script>

<style scoped>
.toolbar {
  height: 48px;
  background: #16213e;
  border-bottom: 1px solid #0f3460;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  gap: 12px;
  flex-shrink: 0;
  z-index: 100;
}

.brand {
  color: #4cc9f0;
  font-weight: 700;
  font-size: 15px;
  letter-spacing: 0.5px;
}

.toolbar-center {
  display: flex;
  gap: 4px;
  background: #0f3460;
  padding: 3px;
  border-radius: 6px;
}

.device-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 14px;
  color: #aaa;
  transition: background 0.15s;
}
.device-btn:hover { background: #1a4a7a; color: #fff; }
.device-btn.active { background: #4cc9f0; color: #0d1b2a; }

.toolbar-right { display: flex; align-items: center; gap: 6px; }

.tb-btn {
  background: #1e3a5f;
  border: 1px solid #2a5080;
  color: #cdd;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  transition: background 0.15s, color 0.15s;
  white-space: nowrap;
}
.tb-btn:hover:not(:disabled) { background: #2a5080; color: #fff; }
.tb-btn:disabled { opacity: 0.35; cursor: not-allowed; }
.tb-btn.primary { background: #4cc9f0; color: #0d1b2a; border-color: #4cc9f0; font-weight: 600; }
.tb-btn.primary:hover { background: #6bd5f5; }
.tb-btn.danger:hover:not(:disabled) { background: #c0392b; border-color: #e74c3c; color: #fff; }

.separator {
  width: 1px;
  height: 24px;
  background: #2a5080;
  margin: 0 2px;
}
</style>
