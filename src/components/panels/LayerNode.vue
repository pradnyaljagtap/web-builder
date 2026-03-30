<template>
  <div class="layer-node">
    <div
      class="layer-row"
      :class="{ selected: isSelected, hovered: isHovered }"
      :style="{ paddingLeft: `${depth * 14 + 8}px` }"
      @click="store.select(node.id)"
      @mouseenter="store.setHovered(node.id)"
      @mouseleave="store.setHovered(null)"
    >
      <!-- Toggle arrow for nodes with children -->
      <span
        v-if="node.children.length"
        class="toggle-arrow"
        :class="{ open: expanded }"
        @click.stop="expanded = !expanded"
      >›</span>
      <span v-else class="toggle-spacer" />

      <span class="layer-tag">{{ node.tag }}</span>
      <span class="layer-name">{{ node.label }}</span>
      <span class="layer-actions">
        <button class="la-btn" title="Delete" @click.stop="store.removeComponent(node.id)">✕</button>
      </span>
    </div>

    <!-- Children (recursive) -->
    <div v-if="expanded && node.children.length" class="layer-children">
      <LayerNode
        v-for="child in node.children"
        :key="child.id"
        :node="child"
        :depth="depth + 1"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useEditorStore } from '../../stores/editor'
import type { ComponentNode } from '../../types'

const props = defineProps<{ node: ComponentNode; depth: number }>()

const store = useEditorStore()
const expanded = ref(true)

const isSelected = computed(() => store.selectedId === props.node.id)
const isHovered = computed(() => store.hoveredId === props.node.id && !isSelected.value)
</script>

<style scoped>
.layer-node { width: 100%; }

.layer-row {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 5px 8px;
  cursor: pointer;
  transition: background 0.1s;
  user-select: none;
}
.layer-row:hover { background: #1a2a3a; }
.layer-row.hovered { background: #162030; }
.layer-row.selected { background: #1e3a5f; }

.toggle-arrow {
  display: inline-block;
  width: 14px;
  font-size: 12px;
  color: #6a9aba;
  transition: transform 0.15s;
  cursor: pointer;
  text-align: center;
  flex-shrink: 0;
}
.toggle-arrow.open { transform: rotate(90deg); }
.toggle-spacer { display: inline-block; width: 14px; flex-shrink: 0; }

.layer-tag {
  font-size: 10px;
  font-family: monospace;
  color: #4cc9f0;
  background: #0f2a3f;
  padding: 1px 4px;
  border-radius: 3px;
  flex-shrink: 0;
}

.layer-name {
  font-size: 11px;
  color: #9ab9cc;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.layer-actions {
  display: none;
  gap: 3px;
}
.layer-row:hover .layer-actions { display: flex; }
.layer-row.selected .layer-actions { display: flex; }

.la-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #7a9ab0;
  font-size: 10px;
  padding: 1px 4px;
  border-radius: 3px;
  transition: background 0.1s, color 0.1s;
}
.la-btn:hover { background: #c0392b; color: #fff; }
</style>
