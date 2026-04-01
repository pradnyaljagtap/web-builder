<template>
  <div class="block-panel">
    <div class="blocks-scroll">
      <div class="block-grid">
        <div
          v-for="block in defaultBlocks"
          :key="block.id"
          class="block-item"
          draggable="true"
          :title="block.label"
          @dragstart="onDragStart($event, block)"
          @dragend="onDragEnd"
        >
          <span class="block-icon" v-html="iconFor(block)" />
          <span class="block-label">{{ block.label }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defaultBlocks } from '../../blocks/defaultBlocks'
import type { Block } from '../../types'

const blockIcons: Record<string, string> = {
  section: `<svg width="32" height="32" viewBox="0 0 32 32" fill="none"><rect x="3" y="7" width="26" height="18" rx="2.5" stroke="currentColor" stroke-width="1.8" fill="none"/><line x1="3" y1="13" x2="29" y2="13" stroke="currentColor" stroke-width="1.2"/></svg>`,
  container: `<svg width="32" height="32" viewBox="0 0 32 32" fill="none"><rect x="4" y="4" width="24" height="24" rx="2.5" stroke="currentColor" stroke-width="1.8" fill="none"/></svg>`,
  'columns-2': `<svg width="32" height="32" viewBox="0 0 32 32" fill="none"><rect x="2" y="6" width="12" height="20" rx="2" stroke="currentColor" stroke-width="1.8" fill="none"/><rect x="18" y="6" width="12" height="20" rx="2" stroke="currentColor" stroke-width="1.8" fill="none"/></svg>`,
  'columns-3': `<svg width="32" height="32" viewBox="0 0 32 32" fill="none"><rect x="1" y="6" width="8" height="20" rx="1.5" stroke="currentColor" stroke-width="1.6" fill="none"/><rect x="12" y="6" width="8" height="20" rx="1.5" stroke="currentColor" stroke-width="1.6" fill="none"/><rect x="23" y="6" width="8" height="20" rx="1.5" stroke="currentColor" stroke-width="1.6" fill="none"/></svg>`,
  heading: `<svg width="32" height="32" viewBox="0 0 32 32" fill="none"><path d="M6 8v16M26 8v16M6 16h20" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>`,
  text: `<svg width="32" height="32" viewBox="0 0 32 32" fill="none"><line x1="4" y1="10" x2="28" y2="10" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><line x1="4" y1="16" x2="28" y2="16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><line x1="4" y1="22" x2="18" y2="22" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`,
  button: `<svg width="32" height="32" viewBox="0 0 32 32" fill="none"><rect x="3" y="10" width="26" height="12" rx="4" stroke="currentColor" stroke-width="1.8" fill="none"/><line x1="11" y1="16" x2="21" y2="16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
  image: `<svg width="32" height="32" viewBox="0 0 32 32" fill="none"><rect x="3" y="5" width="26" height="22" rx="2.5" stroke="currentColor" stroke-width="1.8" fill="none"/><circle cx="10" cy="12" r="2.5" fill="currentColor"/><path d="M3 22l7-6 5 4 4-3 8 6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  link: `<svg width="32" height="32" viewBox="0 0 32 32" fill="none"><path d="M13 19a7 7 0 009.9.1l3-3a7 7 0 00-9.9-9.9l-1.5 1.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M19 13a7 7 0 00-9.9-.1l-3 3a7 7 0 009.9 9.9l1.5-1.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`,
  divider: `<svg width="32" height="32" viewBox="0 0 32 32" fill="none"><line x1="3" y1="10" x2="29" y2="10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="3" y1="16" x2="29" y2="16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-dasharray="3 3"/><line x1="3" y1="22" x2="29" y2="22" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
  video: `<svg width="32" height="32" viewBox="0 0 32 32" fill="none"><rect x="2" y="7" width="20" height="18" rx="2.5" stroke="currentColor" stroke-width="1.8" fill="none"/><path d="M22 13l8-5v16l-8-5V13z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" fill="none"/></svg>`,
  input: `<svg width="32" height="32" viewBox="0 0 32 32" fill="none"><rect x="3" y="10" width="26" height="12" rx="2.5" stroke="currentColor" stroke-width="1.8" fill="none"/><line x1="8" y1="14" x2="8" y2="18" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>`,
}

function iconFor(block: Block): string {
  return blockIcons[block.id] ?? `<span style="font-size:16px">${block.icon}</span>`
}

function onDragStart(e: DragEvent, block: Block) {
  if (!e.dataTransfer) return
  e.dataTransfer.setData('text/plain', block.id)
  e.dataTransfer.effectAllowed = 'copy'
}

function onDragEnd() {}
</script>

<style scoped>
.block-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #fff;
}

.blocks-scroll {
  overflow-y: auto;
  flex: 1;
  padding: 10px;
}
.blocks-scroll::-webkit-scrollbar { width: 4px; }
.blocks-scroll::-webkit-scrollbar-thumb { background: #d0d4da; border-radius: 2px; }

.block-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
  width: 100%;
  min-width: 0;
}

.block-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 18px 6px 14px;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  cursor: grab;
  transition: border-color 0.15s, box-shadow 0.15s, transform 0.1s;
  user-select: none;
  color: #374151;
  min-height: 90px;
}
.block-item:hover {
  border-color: #ff6b35;
  box-shadow: 0 0 0 2px rgba(255,107,53,0.15);
  transform: translateY(-1px);
}
.block-item:active {
  cursor: grabbing;
  transform: scale(0.97);
}

.block-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  color: #374151;
}

.block-label {
  font-size: 11px;
  font-weight: 500;
  color: #6b7280;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
  line-height: 1;
}
</style>
