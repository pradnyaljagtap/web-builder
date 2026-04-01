<template>
  <div class="trait-panel">
    <div v-if="!selected" class="no-selection">
      <p>Select a component to edit its attributes</p>
    </div>

    <template v-else>
      <div class="component-info">
        <span class="comp-tag">{{ selected.tag }}</span>
        <span class="comp-name">{{ selected.label }}</span>
      </div>

      <div class="traits-scroll">
        <!-- Content editing -->
        <div v-if="hasContent" class="trait-section">
          <div class="section-title">Content</div>
          <div class="trait-row">
            <label class="trait-label">Text</label>
            <textarea
              class="trait-textarea"
              :value="selected.content"
              rows="3"
              @input="store.updateContent(selected!.id, ($event.target as HTMLTextAreaElement).value)"
            />
          </div>
        </div>

        <!-- Attributes -->
        <div class="trait-section">
          <div class="section-title">Attributes</div>

          <div v-if="visibleAttrs.length === 0" class="no-attrs">
            No editable attributes
          </div>

          <div v-for="attr in visibleAttrs" :key="attr.key" class="trait-row">
            <label class="trait-label">{{ attr.label }}</label>
            <input
              type="text"
              class="trait-input"
              :value="selected.attrs[attr.key] ?? ''"
              :placeholder="attr.placeholder"
              @input="store.updateAttr(selected!.id, attr.key, ($event.target as HTMLInputElement).value)"
            />
          </div>
        </div>

        <!-- CSS Classes -->
        <div class="trait-section">
          <div class="section-title">CSS Classes</div>
          <div class="trait-row">
            <label class="trait-label">Classes</label>
            <input
              type="text"
              class="trait-input"
              :value="selected.classes.join(' ')"
              placeholder="e.g. btn primary"
              @change="updateClasses(($event.target as HTMLInputElement).value)"
            />
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useEditorStore } from '../../stores/editor'

const store = useEditorStore()
const selected = computed(() => store.selectedComponent)

// Map tag → editable attributes
const ATTR_MAP: Record<string, Array<{ key: string; label: string; placeholder: string }>> = {
  a:      [{ key: 'href', label: 'Href', placeholder: 'https://...' }, { key: 'target', label: 'Target', placeholder: '_blank' }],
  img:    [{ key: 'src', label: 'Source', placeholder: 'https://...' }, { key: 'alt', label: 'Alt Text', placeholder: 'Description' }],
  video:  [{ key: 'src', label: 'Source', placeholder: 'https://...' }],
  input:  [{ key: 'type', label: 'Type', placeholder: 'text' }, { key: 'placeholder', label: 'Placeholder', placeholder: 'Enter text...' }, { key: 'name', label: 'Name', placeholder: 'field-name' }],
  button: [{ key: 'type', label: 'Type', placeholder: 'button' }],
}

const visibleAttrs = computed(() => {
  if (!selected.value) return []
  return ATTR_MAP[selected.value.tag] ?? []
})

const hasContent = computed(() => {
  if (!selected.value) return false
  const voids = new Set(['img', 'hr', 'br', 'input', 'video'])
  return !voids.has(selected.value.tag)
})

function updateClasses(value: string) {
  if (!selected.value) return
  const classes = value.trim().split(/\s+/).filter(Boolean)
  // Direct mutation via store — we treat classes as an attribute for MVP
  const node = store.findById(store.tree, selected.value.id)
  if (node) node.classes = classes
}
</script>

<style scoped>
.trait-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #fff;
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

.traits-scroll {
  flex: 1;
  overflow-y: auto;
  padding: 8px 0;
}
.traits-scroll::-webkit-scrollbar { width: 4px; }
.traits-scroll::-webkit-scrollbar-thumb { background: #d0d4da; border-radius: 2px; }

.trait-section { margin-bottom: 4px; }

.section-title {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #8a9ab0;
  padding: 8px 12px 4px;
}

.trait-row {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 4px 12px;
}

.trait-label {
  font-size: 10px;
  color: #8a9ab0;
  width: 80px;
  flex-shrink: 0;
  padding-top: 5px;
}

.trait-input {
  flex: 1;
  background: #f5f6f8;
  border: 1px solid #e2e5e9;
  color: #333;
  padding: 5px 8px;
  border-radius: 4px;
  font-size: 11px;
  outline: none;
  min-width: 0;
}
.trait-input:focus { border-color: #ff6b35; background: #fff; }
.trait-input::placeholder { color: #bdc5ce; }

.trait-textarea {
  flex: 1;
  background: #f5f6f8;
  border: 1px solid #e2e5e9;
  color: #333;
  padding: 6px 8px;
  border-radius: 4px;
  font-size: 11px;
  outline: none;
  resize: vertical;
  min-width: 0;
  font-family: inherit;
  line-height: 1.5;
}
.trait-textarea:focus { border-color: #ff6b35; background: #fff; }

.no-attrs {
  font-size: 11px;
  color: #bdc5ce;
  padding: 4px 12px 8px;
}
</style>
