import type { ComponentNode } from '../types'

const VOID_TAGS = new Set(['img', 'hr', 'br', 'input', 'meta', 'link', 'area', 'base', 'col', 'embed', 'param', 'source', 'track', 'wbr'])

function styleToString(styles: Record<string, string>): string {
  return Object.entries(styles).map(([k, v]) => `${k}: ${v}`).join('; ')
}

function attrsToString(attrs: Record<string, string>): string {
  return Object.entries(attrs).map(([k, v]) => `${k}="${v}"`).join(' ')
}

function nodeToHtml(node: ComponentNode, indent = ''): string {
  const styleStr = Object.keys(node.styles).length ? ` style="${styleToString(node.styles)}"` : ''
  const attrsStr = Object.keys(node.attrs).length ? ` ${attrsToString(node.attrs)}` : ''
  const classStr = node.classes.length ? ` class="${node.classes.join(' ')}"` : ''

  if (VOID_TAGS.has(node.tag)) {
    return `${indent}<${node.tag}${attrsStr}${classStr}${styleStr} />`
  }

  const childrenHtml = node.children.map((c) => nodeToHtml(c, indent + '  ')).join('\n')
  const inner = node.content
    ? `${indent}  ${node.content}${childrenHtml ? '\n' + childrenHtml : ''}`
    : childrenHtml

  return `${indent}<${node.tag}${attrsStr}${classStr}${styleStr}>\n${inner}\n${indent}</${node.tag}>`
}

export function exportToHtml(tree: ComponentNode[]): string {
  const body = tree.map((n) => nodeToHtml(n, '  ')).join('\n')
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Page</title>
</head>
<body>
${body}
</body>
</html>`
}
