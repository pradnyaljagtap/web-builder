import type { StyleSector } from '../types'

export const styleSectors: StyleSector[] = [
  {
    name: 'Layout',
    open: true,
    properties: [
      {
        label: 'Display',
        property: 'display',
        type: 'select',
        options: [
          { value: '', label: '—' },
          { value: 'block', label: 'block' },
          { value: 'inline-block', label: 'inline-block' },
          { value: 'flex', label: 'flex' },
          { value: 'grid', label: 'grid' },
          { value: 'none', label: 'none' },
        ],
      },
      {
        label: 'Width',
        property: 'width',
        type: 'text',
        placeholder: 'e.g. 100% or 300px',
      },
      {
        label: 'Height',
        property: 'height',
        type: 'text',
        placeholder: 'e.g. auto or 200px',
      },
    ],
  },
  {
    name: 'Spacing',
    open: true,
    properties: [
      { label: 'Margin', property: 'margin', type: 'text', placeholder: 'e.g. 10px 20px' },
      { label: 'Margin Top', property: 'margin-top', type: 'text', placeholder: 'e.g. 10px' },
      { label: 'Margin Bottom', property: 'margin-bottom', type: 'text', placeholder: 'e.g. 10px' },
      { label: 'Margin Left', property: 'margin-left', type: 'text', placeholder: 'e.g. 10px' },
      { label: 'Margin Right', property: 'margin-right', type: 'text', placeholder: 'e.g. 10px' },
      { label: 'Padding', property: 'padding', type: 'text', placeholder: 'e.g. 20px' },
      { label: 'Padding Top', property: 'padding-top', type: 'text', placeholder: 'e.g. 10px' },
      { label: 'Padding Bottom', property: 'padding-bottom', type: 'text', placeholder: 'e.g. 10px' },
      { label: 'Padding Left', property: 'padding-left', type: 'text', placeholder: 'e.g. 10px' },
      { label: 'Padding Right', property: 'padding-right', type: 'text', placeholder: 'e.g. 10px' },
    ],
  },
  {
    name: 'Typography',
    open: false,
    properties: [
      {
        label: 'Font Size',
        property: 'font-size',
        type: 'text',
        placeholder: 'e.g. 16px or 1rem',
      },
      {
        label: 'Font Weight',
        property: 'font-weight',
        type: 'select',
        options: [
          { value: '', label: '—' },
          { value: '300', label: 'Light (300)' },
          { value: '400', label: 'Normal (400)' },
          { value: '500', label: 'Medium (500)' },
          { value: '600', label: 'Semi Bold (600)' },
          { value: '700', label: 'Bold (700)' },
          { value: '800', label: 'Extra Bold (800)' },
        ],
      },
      {
        label: 'Text Align',
        property: 'text-align',
        type: 'select',
        options: [
          { value: '', label: '—' },
          { value: 'left', label: 'Left' },
          { value: 'center', label: 'Center' },
          { value: 'right', label: 'Right' },
          { value: 'justify', label: 'Justify' },
        ],
      },
      { label: 'Line Height', property: 'line-height', type: 'text', placeholder: 'e.g. 1.5' },
      { label: 'Letter Spacing', property: 'letter-spacing', type: 'text', placeholder: 'e.g. 1px' },
      { label: 'Color', property: 'color', type: 'color', default: '#000000' },
    ],
  },
  {
    name: 'Background',
    open: false,
    properties: [
      { label: 'Background Color', property: 'background-color', type: 'color', default: '#ffffff' },
      { label: 'Background Image', property: 'background-image', type: 'text', placeholder: 'url(...)' },
      {
        label: 'Background Size',
        property: 'background-size',
        type: 'select',
        options: [
          { value: '', label: '—' },
          { value: 'cover', label: 'Cover' },
          { value: 'contain', label: 'Contain' },
          { value: 'auto', label: 'Auto' },
        ],
      },
    ],
  },
  {
    name: 'Border',
    open: false,
    properties: [
      { label: 'Border', property: 'border', type: 'text', placeholder: 'e.g. 1px solid #ccc' },
      { label: 'Border Radius', property: 'border-radius', type: 'text', placeholder: 'e.g. 4px' },
      {
        label: 'Border Style',
        property: 'border-style',
        type: 'select',
        options: [
          { value: '', label: '—' },
          { value: 'none', label: 'None' },
          { value: 'solid', label: 'Solid' },
          { value: 'dashed', label: 'Dashed' },
          { value: 'dotted', label: 'Dotted' },
        ],
      },
      { label: 'Border Color', property: 'border-color', type: 'color', default: '#cccccc' },
      { label: 'Border Width', property: 'border-width', type: 'text', placeholder: 'e.g. 1px' },
    ],
  },
  {
    name: 'Effects',
    open: false,
    properties: [
      {
        label: 'Opacity',
        property: 'opacity',
        type: 'range',
        min: 0,
        max: 1,
        default: '1',
      },
      { label: 'Box Shadow', property: 'box-shadow', type: 'text', placeholder: 'e.g. 0 2px 4px rgba(0,0,0,0.2)' },
      {
        label: 'Overflow',
        property: 'overflow',
        type: 'select',
        options: [
          { value: '', label: '—' },
          { value: 'visible', label: 'Visible' },
          { value: 'hidden', label: 'Hidden' },
          { value: 'scroll', label: 'Scroll' },
          { value: 'auto', label: 'Auto' },
        ],
      },
    ],
  },
]
