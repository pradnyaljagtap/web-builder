<template>
  <div class="block-panel">
    <div class="panel-search">
      <input v-model="search" type="text" placeholder="Search blocks..." class="search-input" />
    </div>

    <div class="blocks-scroll">
      <div v-for="cat in filteredCategories" :key="cat" class="category">
        <div class="category-title">{{ cat }}</div>
        <div class="block-grid">
          <div
            v-for="block in blocksByCategory(cat)"
            :key="block.id"
            class="block-item"
            draggable="true"
            :title="block.label"
            @dragstart="onDragStart($event, block)"
            @dragend="onDragEnd"
          >
            <span class="block-icon">{{ block.icon }}</span>
            <span class="block-label">{{ block.label }}</span>
          </div>
        </div>
      </div>

      <div v-if="filteredCategories.length === 0" class="no-results">
        No blocks match "{{ search }}"
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { defaultBlocks, blockCategories } from '../../blocks/defaultBlocks'
import type { Block } from '../../types'

const search = ref('')

const filteredCategories = computed(() => {
  if (!search.value) return blockCategories
  return blockCategories.filter((cat) =>
    blocksByCategory(cat).length > 0
  )
})

function blocksByCategory(cat: string): Block[] {
  const q = search.value.toLowerCase()
  return defaultBlocks.filter(
    (b) => b.category === cat && (!q || b.label.toLowerCase().includes(q))
  )
}

function onDragStart(e: DragEvent, block: Block) {
  if (!e.dataTransfer) return
  e.dataTransfer.setData('text/plain', block.id)
  e.dataTransfer.effectAllowed = 'copy'
}

function onDragEnd() {
  // cleanup if needed
}
</script>

<style scoped>
.block-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #0d1b2a;
}

.panel-search {
  padding: 10px;
  border-bottom: 1px solid #1e3a5f;
}

.search-input {
  width: 100%;
  background: #1a2a3a;
  border: 1px solid #2a4a6a;
  color: #cdd;
  padding: 6px 10px;
  border-radius: 5px;
  font-size: 12px;
  outline: none;
}
.search-input:focus { border-color: #4cc9f0; }
.search-input::placeholder { color: #5a7a9a; }

.blocks-scroll {
  overflow-y: auto;
  flex: 1;
  padding: 8px;
}
.blocks-scroll::-webkit-scrollbar { width: 4px; }
.blocks-scroll::-webkit-scrollbar-thumb { background: #2a4a6a; border-radius: 2px; }

.category { margin-bottom: 12px; }

.category-title {
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #4cc9f0;
  padding: 4px 4px 8px;
}

.block-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
}

.block-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 10px 6px;
  background: #1a2a3a;
  border: 1px solid #2a4a6a;
  border-radius: 6px;
  cursor: grab;
  transition: background 0.15s, border-color 0.15s, transform 0.1s;
  user-select: none;
}
.block-item:hover {
  background: #1e3a5f;
  border-color: #4cc9f0;
  transform: translateY(-1px);
}
.block-item:active { cursor: grabbing; transform: scale(0.96); }

.block-icon {
  font-size: 18px;
  line-height: 1;
}

.block-label {
  font-size: 10px;
  color: #8ab0cc;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

.no-results {
  text-align: center;
  color: #5a7a9a;
  font-size: 12px;
  padding: 20px;
}
</style>
