<template>
  <div class="toolbar-wrap">
    <!-- Top bar: page name | device switcher | actions -->
    <header class="toolbar">
      <!-- Left: page name -->
      <div class="toolbar-left">
        <input
          v-if="editingName"
          ref="nameInput"
          v-model="store.pageName"
          class="page-name-input"
          @blur="editingName = false"
          @keydown.enter="editingName = false"
          @keydown.esc="editingName = false"
        />
        <button v-else class="page-name-btn" title="Click to rename" @click="startEditName">
          {{ store.pageName }}
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style="margin-left:4px;opacity:0.5"><path d="M8.5 1.5l2 2-7 7H1.5v-2l7-7z" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/></svg>
        </button>
      </div>

      <!-- Center: device switcher -->
      <div class="toolbar-center">
        <button
          v-for="device in devices"
          :key="device.id"
          class="device-btn"
          :class="{ active: store.activeDevice === device.id }"
          :title="device.label"
          @click="store.activeDevice = device.id"
        >
          <span v-html="device.icon" />
        </button>
      </div>

      <!-- Right: export/save/preview -->
      <div class="toolbar-right">
        <button class="tb-btn" title="Export HTML" @click="exportHtml">Export</button>
        <button class="tb-btn" title="Save JSON" @click="saveJson">Save</button>
        <label class="tb-btn" title="Load JSON">
          Load
          <input ref="fileInput" type="file" accept=".json" style="display:none" @change="loadJson" />
        </label>
        <button class="tb-btn primary" title="Preview" @click="preview">Preview</button>
      </div>
    </header>

    <!-- Sub-bar: undo / redo / delete -->
    <div class="sub-bar">
      <button class="tb-btn icon-btn" :disabled="!store.canUndo" title="Undo (Ctrl+Z)" @click="store.undo()">↩</button>
      <button class="tb-btn icon-btn" :disabled="!store.canRedo" title="Redo (Ctrl+Y)" @click="store.redo()">↪</button>
      <div class="separator" />
      <button class="tb-btn icon-btn danger" title="Clear canvas" @click="confirmClear">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 4h10M6 4V2.5A.5.5 0 016.5 2h3a.5.5 0 01.5.5V4M5 4l.5 9h5L11 4" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { useEditorStore } from '../../stores/editor'
import { exportToHtml } from '../../utils/htmlExporter'

const store = useEditorStore()
const fileInput = ref<HTMLInputElement | null>(null)
const nameInput = ref<HTMLInputElement | null>(null)
const editingName = ref(false)

function startEditName() {
  editingName.value = true
  nextTick(() => {
    nameInput.value?.select()
  })
}


const devices = [
  {
    id: 'desktop',
    label: 'Desktop',
    icon: `<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="1" y="2" width="16" height="11" rx="2" stroke="currentColor" stroke-width="1.4" fill="none"/><path d="M6 16h6M9 13v3" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>`,
  },
  {
    id: 'mobile',
    label: 'Mobile',
    icon: `<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="5" y="1" width="8" height="16" rx="2" stroke="currentColor" stroke-width="1.4" fill="none"/><circle cx="9" cy="14.5" r="0.8" fill="currentColor"/></svg>`,
  },
]

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
.toolbar-wrap {
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  z-index: 100;
}

.toolbar {
  height: 52px;
  background: #ffffff;
  border-bottom: 1px solid #e2e5e9;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 14px;
  gap: 12px;
}

.sub-bar {
  height: 38px;
  background: #fafbfc;
  border-bottom: 1px solid #e2e5e9;
  display: flex;
  align-items: center;
  padding: 0 10px;
  gap: 2px;
}

.toolbar-left,
.toolbar-right {
  display: flex;
  align-items: center;
  gap: 4px;
}

.toolbar-center {
  display: flex;
  gap: 2px;
  background: #f0f2f5;
  padding: 3px;
  border-radius: 8px;
}

.device-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px 12px;
  border-radius: 6px;
  color: #8a9ab0;
  display: flex;
  align-items: center;
  transition: background 0.15s, color 0.15s;
}
.device-btn:hover { background: #e2e5ea; color: #333; }
.device-btn.active { background: #ffffff; color: #333; box-shadow: 0 1px 3px rgba(0,0,0,0.12); }

.tb-btn {
  background: #f5f6f8;
  border: 1px solid #e2e5e9;
  color: #444;
  padding: 5px 11px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  font-family: inherit;
  transition: background 0.15s, color 0.15s, border-color 0.15s;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 4px;
}
.tb-btn:hover:not(:disabled) { background: #eaecf0; color: #111; border-color: #cdd0d5; }
.tb-btn:disabled { opacity: 0.38; cursor: not-allowed; }
.tb-btn.primary { background: #ff6b35; color: #fff; border-color: #ff6b35; font-weight: 600; }
.tb-btn.primary:hover { background: #e85c2a; border-color: #e85c2a; }

/* Bare icon buttons — no border/background */
.tb-btn.icon-btn {
  background: none;
  border: none;
  padding: 4px 8px;
  color: #666;
  font-size: 16px;
  border-radius: 6px;
  line-height: 1;
}
.tb-btn.icon-btn:hover:not(:disabled) { background: #f0f2f5; color: #111; }
.tb-btn.icon-btn:disabled { opacity: 0.3; }
.tb-btn.icon-btn.danger:hover:not(:disabled) { background: #fde8e8; color: #c0392b; }

.separator {
  width: 1px;
  height: 22px;
  background: #e2e5e9;
  margin: 0 4px;
}

.page-name-btn {
  background: none;
  border: 1px solid transparent;
  color: #333;
  font-size: 13px;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  white-space: nowrap;
  max-width: 220px;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: border-color 0.15s, background 0.15s;
}
.page-name-btn:hover {
  border-color: #d0d4da;
  background: #f5f6f8;
}

.page-name-input {
  background: #fff;
  border: 1px solid #a0b0e0;
  color: #333;
  font-size: 13px;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 6px;
  outline: none;
  width: 200px;
  box-shadow: 0 0 0 3px rgba(99,130,235,0.12);
}
</style>
