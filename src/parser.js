// Snap DSL Parser v0.2
// Parses .snap files into an AST

import fs from 'fs';
import path from 'path';

const COMPONENT_TYPES = new Set([
  'page', 'layout', 'nav', 'card', 'grid', 'chart', 'form', 'table',
  'heading', 'text', 'button', 'image', 'link', 'hero', 'footer',
  'section', 'row', 'column', 'input', 'spacer', 'divider', 'list', 'item',
  'stat', 'badge', 'avatar', 'icon', 'code', 'quote', 'video', 'embed',
  // Interactive components
  'tabs', 'accordion', 'modal', 'dropdown', 'toggle', 'counter', 'toast',
  // New components
  'carousel', 'pricing', 'testimonial', 'timeline', 'progress', 'alert', 'countdown',
  // Component reuse
  'use',
]);

const ANIMATION_KEYWORDS = new Set([
  'fade-in', 'slide-up', 'slide-left', 'slide-right',
  'bounce', 'pulse', 'shake',
  'hover-grow', 'hover-glow', 'hover-lift',
]);

const STYLE_KEYWORDS = {
  // Colors
  primary: { color: 'var(--primary)' },
  secondary: { color: 'var(--secondary)' },
  accent: { color: 'var(--accent)' },
  muted: { color: 'var(--muted)' },
  danger: { color: 'var(--danger)' },
  success: { color: 'var(--success)' },
  warning: { color: 'var(--warning)' },
  dark: { color: 'var(--dark)' },
  light: { color: 'var(--light)' },
  white: { color: '#ffffff' },
  // Background colors
  'bg-primary': { backgroundColor: 'var(--primary)' },
  'bg-secondary': { backgroundColor: 'var(--secondary)' },
  'bg-accent': { backgroundColor: 'var(--accent)' },
  'bg-dark': { backgroundColor: 'var(--dark)' },
  'bg-light': { backgroundColor: 'var(--bg-light)' },
  'bg-white': { backgroundColor: '#ffffff' },
  'bg-muted': { backgroundColor: 'var(--bg-muted)' },
  'bg-gradient': { background: 'linear-gradient(135deg, var(--primary), var(--accent))' },
  // Sizing
  small: { fontSize: '0.875rem' },
  large: { fontSize: '1.25rem' },
  xl: { fontSize: '1.5rem' },
  xxl: { fontSize: '2rem' },
  huge: { fontSize: '3rem' },
  full: { width: '100%' },
  half: { width: '50%' },
  third: { width: '33.333%' },
  // Spacing
  tight: { padding: '0.5rem' },
  cozy: { padding: '1rem' },
  spacious: { padding: '2rem' },
  roomy: { padding: '3rem' },
  // Layout
  center: { textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' },
  left: { textAlign: 'left' },
  right: { textAlign: 'right' },
  inline: { display: 'inline-flex', gap: '0.5rem', alignItems: 'center' },
  stack: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  row: { display: 'flex', flexDirection: 'row', gap: '1rem', alignItems: 'center' },
  wrap: { flexWrap: 'wrap' },
  // Effects
  rounded: { borderRadius: 'var(--radius)' },
  pill: { borderRadius: '999px' },
  shadow: { boxShadow: 'var(--shadow)' },
  'shadow-lg': { boxShadow: 'var(--shadow-lg)' },
  border: { border: '1px solid var(--border)' },
  bold: { fontWeight: '700' },
  italic: { fontStyle: 'italic' },
  uppercase: { textTransform: 'uppercase', letterSpacing: '0.05em' },
  underline: { textDecoration: 'underline' },
  clickable: { cursor: 'pointer' },
  'no-wrap': { whiteSpace: 'nowrap' },
  truncate: { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  // Visibility
  hidden: { display: 'none' },
  'mobile-only': { '@media': '(min-width: 768px)', display: 'none' },
  'desktop-only': { '@media': '(max-width: 767px)', display: 'none' },
};

export function parse(source, baseDir = '.') {
  // Process @import directives
  source = processImports(source, baseDir);

  const lines = source.split('\n');
  const root = { type: 'root', children: [], meta: {}, components: {} };
  const stack = [{ node: root, indent: -1 }];
  let definingComponent = null;
  let defLines = [];
  let defIndent = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith('//') || trimmed.startsWith('#')) continue;

    // Component definition
    if (trimmed.startsWith('@define ')) {
      definingComponent = trimmed.slice(8).trim();
      defLines = [];
      defIndent = line.search(/\S/);
      continue;
    }
    if (trimmed === '@end' && definingComponent) {
      root.components[definingComponent] = defLines.join('\n');
      definingComponent = null;
      continue;
    }
    if (definingComponent) {
      defLines.push(line);
      continue;
    }

    // Meta declarations
    if (trimmed.startsWith('@')) {
      const match = trimmed.match(/^@([\w-]+)\s*(.*)/);
      if (match) {
        root.meta[match[1]] = match[2].trim() || true;
      }
      continue;
    }

    const indent = line.search(/\S/);
    const node = parseLine(trimmed);

    // Pop stack to find parent
    while (stack.length > 1 && stack[stack.length - 1].indent >= indent) {
      stack.pop();
    }

    const parent = stack[stack.length - 1].node;
    if (!parent.children) parent.children = [];
    parent.children.push(node);

    stack.push({ node, indent });
  }

  return root;
}

function processImports(source, baseDir) {
  return source.replace(/^@import\s+"([^"]+)"/gm, (match, file) => {
    const filePath = path.resolve(baseDir, file);
    try {
      return fs.readFileSync(filePath, 'utf-8');
    } catch {
      return `// Failed to import: ${file}`;
    }
  });
}

function parseLine(line) {
  const match = line.match(/^(\w[\w-]*)\s*(.*)/);
  if (!match) return { type: 'text', content: line };

  const keyword = match[1].toLowerCase();
  let rest = match[2].trim();

  if (!COMPONENT_TYPES.has(keyword)) {
    return { type: 'text', content: line };
  }

  const node = { type: keyword, props: {}, styles: [], animations: [], children: [] };

  // Extract quoted strings
  const quotedMatch = rest.match(/^"([^"]*)"(.*)/);
  if (quotedMatch) {
    node.content = quotedMatch[1];
    rest = quotedMatch[2].trim();
  }

  // Parse remaining tokens
  const tokens = tokenize(rest);
  for (const token of tokens) {
    if (token.includes('=')) {
      const [key, ...valParts] = token.split('=');
      let val = valParts.join('=').replace(/^["']|["']$/g, '');
      node.props[key] = val;
    } else if (ANIMATION_KEYWORDS.has(token)) {
      node.animations.push(token);
    } else if (STYLE_KEYWORDS[token]) {
      node.styles.push(token);
    } else if (token) {
      node.styles.push(token);
    }
  }

  return node;
}

function tokenize(str) {
  const tokens = [];
  let current = '';
  let inQuote = false;
  let quoteChar = '';

  for (let i = 0; i < str.length; i++) {
    const ch = str[i];
    if (inQuote) {
      if (ch === quoteChar) {
        inQuote = false;
        current += ch;
      } else {
        current += ch;
      }
    } else if (ch === '"' || ch === "'") {
      inQuote = true;
      quoteChar = ch;
      current += ch;
    } else if (ch === ' ' || ch === '\t') {
      if (current) tokens.push(current);
      current = '';
    } else {
      current += ch;
    }
  }
  if (current) tokens.push(current);
  return tokens;
}

export { STYLE_KEYWORDS, COMPONENT_TYPES, ANIMATION_KEYWORDS };
