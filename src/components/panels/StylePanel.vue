<template>
  <div class="style-panel">
    <div v-if="!selected" class="no-selection">
      <p>Select a component to edit its styles</p>
    </div>

    <template v-else>
      <div class="component-info">
        <span class="comp-tag">{{ selected.tag }}</span>
        <span class="comp-name">{{ selected.label }}</span>
      </div>

      <div class="sectors-scroll">
        <div v-for="sector in sectors" :key="sector.name" class="sector">
          <div class="sector-header" @click="sector.open = !sector.open">
            <span class="sector-arrow" :class="{ open: sector.open }">›</span>
            <span class="sector-name">{{ sector.name }}</span>
          </div>

          <div v-if="sector.open" class="sector-body">
            <div v-for="prop in sector.properties" :key="prop.property" class="prop-row">
              <label class="prop-label">{{ prop.label }}</label>

              <!-- Color picker -->
              <div v-if="prop.type === 'color'" class="prop-color">
                <input
                  type="color"
                  :value="getStyle(prop.property) || prop.default || '#000000'"
                  class="color-swatch"
                  @input="setStyle(prop.property, ($event.target as HTMLInputElement).value)"
                />
                <input
                  type="text"
                  :value="getStyle(prop.property)"
                  class="prop-input color-text"
                  :placeholder="prop.default || '#000000'"
                  @change="setStyle(prop.property, ($event.target as HTMLInputElement).value)"
                />
              </div>

              <!-- Select -->
              <select
                v-else-if="prop.type === 'select'"
                class="prop-select"
                :value="getStyle(prop.property)"
                @change="setStyle(prop.property, ($event.target as HTMLSelectElement).value)"
              >
                <option v-for="opt in prop.options" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
              </select>

              <!-- Range -->
              <div v-else-if="prop.type === 'range'" class="prop-range">
                <input
                  type="range"
                  :min="prop.min ?? 0"
                  :max="prop.max ?? 1"
                  :step="0.01"
                  :value="getStyle(prop.property) || prop.default || '1'"
                  class="range-input"
                  @input="setStyle(prop.property, ($event.target as HTMLInputElement).value)"
                />
                <span class="range-val">{{ getStyle(prop.property) || prop.default || '1' }}</span>
              </div>

              <!-- Text / Number -->
              <input
                v-else
                type="text"
                class="prop-input"
                :value="getStyle(prop.property)"
                :placeholder="prop.placeholder || ''"
                @change="setStyle(prop.property, ($event.target as HTMLInputElement).value)"
              />
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useEditorStore } from '../../stores/editor'
import { styleSectors } from '../../blocks/styleSectors'
import type { StyleSector } from '../../types'

const store = useEditorStore()
const selected = computed(() => store.selectedComponent)

// Deep-clone sectors so open state is local
const sectors = ref<StyleSector[]>(JSON.parse(JSON.stringify(styleSectors)))

function getStyle(property: string): string {
  return selected.value?.styles[property] ?? ''
}

function setStyle(property: string, value: string) {
  if (!store.selectedId) return
  store.updateStyle(store.selectedId, property, value)
}
</script>

<style scoped>
.style-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #fff;
  overflow: hidden;
}

.no-selection {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #aab4c0;
  font-size: 12px;
  text-align: center;
  padding: 20px;
}

.component-info {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border-bottom: 1px solid #e8eaed;
  background: #fafbfc;
}
.comp-tag {
  font-size: 10px;
  font-family: monospace;
  color: #ff6b35;
  background: #fff3ee;
  padding: 2px 6px;
  border-radius: 3px;
  border: 1px solid #ffd0bc;
}
.comp-name { font-size: 12px; color: #666; }

.sectors-scroll {
  flex: 1;
  overflow-y: auto;
}
.sectors-scroll::-webkit-scrollbar { width: 4px; }
.sectors-scroll::-webkit-scrollbar-thumb { background: #d0d4da; border-radius: 2px; }

.sector { border-bottom: 1px solid #f0f2f5; }

.sector-header {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 9px 12px;
  cursor: pointer;
  user-select: none;
  transition: background 0.1s;
}
.sector-header:hover { background: #f8f9fa; }

.sector-arrow {
  display: inline-block;
  font-size: 13px;
  color: #aab4c0;
  transition: transform 0.15s;
}
.sector-arrow.open { transform: rotate(90deg); }

.sector-name {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  color: #555;
}

.sector-body { padding: 6px 12px 10px; }

.prop-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 0;
}

.prop-label {
  font-size: 10px;
  color: #8a9ab0;
  width: 96px;
  flex-shrink: 0;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

.prop-input {
  flex: 1;
  background: #f5f6f8;
  border: 1px solid #e2e5e9;
  color: #333;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 11px;
  outline: none;
  min-width: 0;
}
.prop-input:focus { border-color: #ff6b35; background: #fff; }
.prop-input::placeholder { color: #bdc5ce; }

.prop-select {
  flex: 1;
  background: #f5f6f8;
  border: 1px solid #e2e5e9;
  color: #333;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 11px;
  outline: none;
  cursor: pointer;
}
.prop-select:focus { border-color: #ff6b35; }

.prop-color {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 6px;
}
.color-swatch {
  width: 28px;
  height: 24px;
  border: 1px solid #e2e5e9;
  border-radius: 4px;
  cursor: pointer;
  padding: 1px;
  background: none;
  flex-shrink: 0;
}
.color-text { flex: 1; min-width: 0; }

.prop-range {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
}
.range-input {
  flex: 1;
  accent-color: #ff6b35;
  cursor: pointer;
}
.range-val {
  font-size: 10px;
  color: #8a9ab0;
  width: 28px;
  text-align: right;
}
</style>
