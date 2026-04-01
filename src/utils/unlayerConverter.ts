import type { ComponentNode } from '../types'

// ── Helpers ────────────────────────────────────────────────────────────────

let _counter = 1
function uid(): string {
  return Math.random().toString(36).slice(2, 10) + (_counter++)
}

function stylesToCss(styles: Record<string, string>): string {
  return Object.entries(styles).map(([k, v]) => `${k}:${v}`).join(';')
}

// ── Our node → Unlayer content ─────────────────────────────────────────────

function nodeToContent(node: ComponentNode): object {
  const base = {
    id: uid(),
    values: {
      containerPadding: '10px',
      anchor: '',
      hideDesktop: false,
      displayCondition: null,
      _meta: { htmlID: uid(), htmlClassNames: '' },
      selectable: true,
      draggable: true,
      duplicatable: true,
      deletable: true,
      hideable: true,
      locked: false,
    } as Record<string, unknown>,
  }

  if (node.type === 'heading') {
    return {
      ...base,
      type: 'heading',
      values: {
        ...base.values,
        headingType: node.tag,
        text: node.content,
        fontSize: node.styles['font-size'] || '36px',
        textAlign: node.styles['text-align'] || 'left',
        lineHeight: node.styles['line-height'] ? `${node.styles['line-height']}` : '140%',
        fontFamily: { label: 'Inter', value: 'Inter,sans-serif' },
        customStyles: { ...node.styles },
      },
    }
  }

  if (node.type === 'text') {
    return {
      ...base,
      type: 'paragraph',
      values: {
        ...base.values,
        text: node.content,
        fontSize: node.styles['font-size'] || '16px',
        textAlign: node.styles['text-align'] || 'left',
        lineHeight: node.styles['line-height'] ? `${node.styles['line-height']}` : '140%',
        fontFamily: { label: 'Inter', value: 'Inter,sans-serif' },
        customStyles: { ...node.styles },
      },
    }
  }

  if (node.type === 'image') {
    return {
      ...base,
      type: 'image',
      values: {
        ...base.values,
        src: { url: node.attrs['src'] || '', width: 600, height: 300 },
        altText: node.attrs['alt'] || '',
        textAlign: node.styles['text-align'] || 'center',
        action: { name: 'web', values: { href: '', target: '_blank' } },
        customStyles: { ...node.styles },
        customAttrs: { ...node.attrs },
      },
    }
  }

  if (node.type === 'button') {
    return {
      ...base,
      type: 'button',
      values: {
        ...base.values,
        text: node.content,
        backgroundColor: node.styles['background-color'] || '#007bff',
        color: node.styles['color'] || '#ffffff',
        fontSize: node.styles['font-size'] || '16px',
        textAlign: 'center',
        padding: node.styles['padding'] || '12px 24px',
        borderRadius: node.styles['border-radius'] || '4px',
        action: { name: 'web', values: { href: '#', target: '_blank' } },
        customStyles: { ...node.styles },
      },
    }
  }

  if (node.type === 'divider') {
    return {
      ...base,
      type: 'divider',
      values: {
        ...base.values,
        width: '100%',
        border: { borderTopWidth: '1px', borderTopStyle: 'solid', borderTopColor: '#e0e0e0' },
      },
    }
  }

  if (node.type === 'video') {
    return {
      ...base,
      type: 'video',
      values: {
        ...base.values,
        video: { url: node.attrs['src'] || '', type: 'other' },
      },
    }
  }

  if (node.type === 'link') {
    return {
      ...base,
      type: 'paragraph',
      values: {
        ...base.values,
        text: `<a href="${node.attrs['href'] || '#'}">${node.content}</a>`,
        fontSize: node.styles['font-size'] || '16px',
        textAlign: 'left',
      },
    }
  }

  if (node.type === 'input') {
    return {
      ...base,
      type: 'input',
      values: {
        ...base.values,
        inputType: node.attrs['type'] || 'text',
        placeholder: node.attrs['placeholder'] || '',
        name: node.attrs['name'] || '',
        styles: stylesToCss(node.styles),
      },
    }
  }

  // Fallback: void tags need self-closing, others get open/close
  const VOID_TAGS = new Set(['img', 'hr', 'br', 'input'])
  const html = VOID_TAGS.has(node.tag)
    ? `<${node.tag} style="${stylesToCss(node.styles)}" />`
    : `<${node.tag} style="${stylesToCss(node.styles)}">${node.content}</${node.tag}>`

  return {
    ...base,
    type: 'html',
    values: {
      ...base.values,
      html,
    },
  }
}

// ── Our tree → Unlayer rows ────────────────────────────────────────────────

function nodesToRows(nodes: ComponentNode[]): object[] {
  const rows: object[] = []

  for (const node of nodes) {
    // Multi-column layout node
    if (node.type === 'columns' && node.children.length > 0) {
      const cells = node.children.map(() => 1)
      const columns = node.children.map((col) => ({
        id: uid(),
        contents: col.children.map(nodeToContent),
        values: {
          backgroundColor: col.styles['background-color'] || '',
          padding: col.styles['padding'] || '0px',
          border: {},
          borderRadius: '0px',
          _meta: { htmlID: uid(), htmlClassNames: 'u_column' },
          deletable: true,
          locked: false,
        },
      }))
      rows.push({
        id: uid(),
        cells,
        columns,
        values: unlayerRowValues(),
      })
      continue
    }

    // Section/container with children → wrap children in one column
    if ((node.type === 'section' || node.type === 'container') && node.children.length > 0) {
      rows.push({
        id: uid(),
        cells: [1],
        columns: [{
          id: uid(),
          contents: node.children.map(nodeToContent),
          values: {
            backgroundColor: node.styles['background-color'] || '',
            padding: node.styles['padding'] || '0px',
            border: {},
            borderRadius: '0px',
            _meta: { htmlID: uid(), htmlClassNames: 'u_column' },
            deletable: true,
            locked: false,
          },
        }],
        values: unlayerRowValues(),
      })
      continue
    }

    // Leaf node → single column row
    rows.push({
      id: uid(),
      cells: [1],
      columns: [{
        id: uid(),
        contents: [nodeToContent(node)],
        values: {
          backgroundColor: '',
          padding: '0px',
          border: {},
          borderRadius: '0px',
          _meta: { htmlID: uid(), htmlClassNames: 'u_column' },
          deletable: true,
          locked: false,
        },
      }],
      values: unlayerRowValues(),
    })
  }

  return rows
}

function unlayerRowValues(): object {
  return {
    displayCondition: null,
    columns: false,
    backgroundColor: '',
    columnsBackgroundColor: '',
    backgroundImage: { url: '', fullWidth: true, repeat: 'no-repeat', size: 'custom', position: 'center' },
    padding: '0px',
    anchor: '',
    hideDesktop: false,
    _meta: { htmlID: uid(), htmlClassNames: 'u_row' },
    selectable: true,
    draggable: true,
    duplicatable: true,
    deletable: true,
    hideable: true,
    locked: false,
  }
}

// ── Public: Our format → Unlayer ───────────────────────────────────────────

export function toUnlayer(tree: ComponentNode[], pageName: string): object {
  return {
    schemaVersion: 23,
    pageName,
    counters: {
      u_column: tree.length,
      u_row: tree.length,
    },
    body: {
      id: uid(),
      rows: nodesToRows(tree),
      headers: [],
      footers: [],
      values: {
        backgroundColor: '#ffffff',
        contentWidth: '600px',
        contentAlign: 'center',
        fontFamily: { label: 'Inter', value: 'Inter,sans-serif' },
        textColor: '#000000',
        linkStyle: {
          body: true,
          linkColor: '#0000ee',
          linkHoverColor: '#0000ee',
          linkUnderline: true,
          linkHoverUnderline: true,
        },
        _meta: { htmlID: 'u_body', htmlClassNames: 'u_body' },
      },
    },
  }
}

// ── Unlayer content → Our node ─────────────────────────────────────────────

function contentToNode(content: Record<string, any>): ComponentNode {
  const v = content.values || {}
  const base: Omit<ComponentNode, 'id'> = {
    type: '',
    tag: 'div',
    label: '',
    attrs: {},
    styles: {},
    classes: [],
    content: '',
    children: [],
    draggable: true,
    selectable: true,
    droppable: false,
    locked: false,
  }

  switch (content.type) {
    case 'heading':
      return {
        ...base,
        id: uid(),
        type: 'heading',
        tag: v.headingType || 'h1',
        label: 'Heading',
        content: stripHtml(v.text || 'Heading'),
        styles: v.customStyles || {
          'font-size': v.fontSize || '36px',
          'font-weight': 'bold',
          color: '#1a1a1a',
          'text-align': v.textAlign || 'left',
          'line-height': v.lineHeight || '1.2',
          'margin-bottom': '16px',
        },
      }

    case 'paragraph': {
      // SuperAGI stores text in textJson, plain Unlayer stores it in text
      let paraText = v.text || ''
      if (!paraText && v.textJson) {
        try {
          const tj = JSON.parse(v.textJson)
          paraText = tj?.root?.children?.[0]?.children?.[0]?.text ?? ''
        } catch {}
      }
      return {
        ...base,
        id: uid(),
        type: 'text',
        tag: 'p',
        label: 'Text',
        content: stripHtml(paraText),
        styles: v.customStyles || {
          'font-size': v.fontSize || '16px',
          color: '#4a4a4a',
          'line-height': v.lineHeight || '1.6',
          'text-align': v.textAlign || 'left',
          'margin-bottom': '12px',
        },
      }
    }

    case 'image':
      return {
        ...base,
        id: uid(),
        type: 'image',
        tag: 'img',
        label: 'Image',
        attrs: v.customAttrs || {
          src: v.src?.url || '',
          alt: v.altText || 'Image',
        },
        styles: v.customStyles || { width: '100%', height: 'auto', display: 'block' },
      }

    case 'button':
      return {
        ...base,
        id: uid(),
        type: 'button',
        tag: 'button',
        label: 'Button',
        attrs: { type: 'button' },
        content: stripHtml(v.text || 'Click Me'),
        styles: v.customStyles || {
          'background-color': v.backgroundColor || '#007bff',
          color: v.color || '#ffffff',
          padding: v.padding || '12px 24px',
          border: 'none',
          'border-radius': v.borderRadius || '4px',
          'font-size': v.fontSize || '16px',
          cursor: 'pointer',
          display: 'inline-block',
        },
      }

    case 'divider':
      return {
        ...base,
        id: uid(),
        type: 'divider',
        tag: 'hr',
        label: 'Divider',
        styles: { border: 'none', 'border-top': '1px solid #e0e0e0', margin: '20px 0', width: '100%' },
      }

    case 'video':
      return {
        ...base,
        id: uid(),
        type: 'video',
        tag: 'video',
        label: 'Video',
        attrs: { controls: 'true', src: v.video?.url || '' },
        styles: { width: '100%', height: 'auto', display: 'block' },
      }

    case 'input':
      return {
        ...base,
        id: uid(),
        type: 'input',
        tag: 'input',
        label: 'Input',
        attrs: {
          type: v.inputType || 'text',
          placeholder: v.placeholder || '',
          ...(v.name ? { name: v.name } : {}),
        },
        styles: {
          width: '100%',
          padding: '10px 14px',
          border: '1px solid #ccc',
          'border-radius': '4px',
          'font-size': '16px',
          outline: 'none',
        },
      }

    case 'html':
      return {
        ...base,
        id: uid(),
        type: 'text',
        tag: 'div',
        label: 'HTML',
        content: v.html || '',
        styles: {},
      }

    default:
      return {
        ...base,
        id: uid(),
        type: 'text',
        tag: 'p',
        label: 'Text',
        content: stripHtml(v.text || ''),
        styles: { 'font-size': '16px', color: '#4a4a4a' },
      }
  }
}

// ── Unlayer rows → Our tree ────────────────────────────────────────────────

function rowsToTree(rows: any[]): ComponentNode[] {
  const tree: ComponentNode[] = []

  for (const row of rows) {
    if (!row || typeof row !== 'object') continue
    const columns: any[] = row.columns || []
    if (columns.length === 0) continue

    if (columns.length === 1) {
      // Single column — flatten contents directly into tree
      const contents: ComponentNode[] = (columns[0]?.contents || []).map(contentToNode)
      tree.push(...contents)
    } else {
      // Multi-column — create a columns node
      const colNodes: ComponentNode[] = columns.map((col: any) => ({
        id: uid(),
        type: 'column',
        tag: 'div',
        label: 'Column',
        attrs: {},
        styles: {
          flex: '1',
          'min-height': '60px',
          padding: col.values?.padding || '10px',
          'background-color': col.values?.backgroundColor || '#f5f5f5',
        },
        classes: [],
        content: '',
        children: (col.contents || []).map(contentToNode),
        draggable: true,
        selectable: true,
        droppable: true,
        locked: false,
      }))

      tree.push({
        id: uid(),
        type: 'columns',
        tag: 'div',
        label: `${columns.length} Columns`,
        attrs: {},
        styles: { display: 'flex', gap: '20px', width: '100%', 'min-height': '60px' },
        classes: [],
        content: '',
        children: colNodes,
        draggable: true,
        selectable: true,
        droppable: false,
        locked: false,
      })
    }
  }

  return tree
}

// ── Public: Unlayer → Our format ───────────────────────────────────────────

export function fromUnlayer(json: Record<string, any>): { tree: ComponentNode[]; pageName: string } {
  const rows: any[] = json.body?.rows || []
  return {
    tree: rowsToTree(rows),
    pageName: json.pageName || 'Untitled Page',
  }
}

// ── Strip HTML tags from text ──────────────────────────────────────────────

function stripHtml(html: string): string {
  // Use DOMParser to properly decode HTML entities and strip tags
  try {
    const doc = new DOMParser().parseFromString(html, 'text/html')
    return doc.body.textContent?.trim() ?? html.replace(/<[^>]*>/g, '').trim()
  } catch {
    return html.replace(/<[^>]*>/g, '').trim()
  }
}
