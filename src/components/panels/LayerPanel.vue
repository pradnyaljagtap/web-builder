<template>
  <div class="layer-panel">
    <div class="panel-header">Layers</div>
    <div class="layers-scroll">
      <div v-if="store.tree.length === 0" class="no-layers">No components yet</div>
      <LayerNode
        v-for="node in store.tree"
        :key="node.id"
        :node="node"
        :depth="0"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useEditorStore } from '../../stores/editor'
import LayerNode from './LayerNode.vue'

const store = useEditorStore()
</script>

<style scoped>
.layer-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #0d1b2a;
}
.panel-header {
  padding: 10px 12px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #4cc9f0;
  border-bottom: 1px solid #1e3a5f;
}
.layers-scroll {
  flex: 1;
  overflow-y: auto;
  padding: 6px 0;
}
.layers-scroll::-webkit-scrollbar { width: 4px; }
.layers-scroll::-webkit-scrollbar-thumb { background: #2a4a6a; border-radius: 2px; }
.no-layers {
  text-align: center;
  color: #5a7a9a;
  font-size: 12px;
  padding: 20px;
}
</style>
