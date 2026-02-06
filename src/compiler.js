// Snap Compiler v0.2 — AST to HTML+CSS+JS
import { STYLE_KEYWORDS } from './parser.js';

const THEME_PRESETS = {
  default: {
    '--primary': '#6366f1', '--secondary': '#8b5cf6', '--accent': '#06b6d4',
    '--dark': '#0f172a', '--light': '#f8fafc', '--bg-light': '#f1f5f9',
    '--bg-muted': '#e2e8f0', '--border': '#e2e8f0', '--text': '#1e293b', '--text-light': '#64748b',
  },
  dark: {
    '--primary': '#818cf8', '--secondary': '#a78bfa', '--accent': '#22d3ee',
    '--dark': '#f8fafc', '--light': '#0f172a', '--bg-light': '#1e293b',
    '--bg-muted': '#334155', '--border': '#334155', '--text': '#f1f5f9', '--text-light': '#94a3b8',
    '--card-bg': '#1e293b', '--nav-bg': '#0f172a',
  },
  ocean: {
    '--primary': '#0ea5e9', '--secondary': '#06b6d4', '--accent': '#14b8a6',
    '--dark': '#0c4a6e', '--light': '#f0f9ff', '--bg-light': '#e0f2fe',
    '--bg-muted': '#bae6fd', '--border': '#7dd3fc', '--text': '#0c4a6e', '--text-light': '#0369a1',
  },
  sunset: {
    '--primary': '#f97316', '--secondary': '#ef4444', '--accent': '#eab308',
    '--dark': '#431407', '--light': '#fff7ed', '--bg-light': '#ffedd5',
    '--bg-muted': '#fed7aa', '--border': '#fdba74', '--text': '#431407', '--text-light': '#9a3412',
  },
};

const BASE_THEME = `
:root {
  --primary: #6366f1;
  --secondary: #8b5cf6;
  --accent: #06b6d4;
  --muted: #94a3b8;
  --danger: #ef4444;
  --success: #22c55e;
  --warning: #f59e0b;
  --dark: #0f172a;
  --light: #f8fafc;
  --bg-light: #f1f5f9;
  --bg-muted: #e2e8f0;
  --border: #e2e8f0;
  --text: #1e293b;
  --text-light: #64748b;
  --radius: 0.75rem;
  --shadow: 0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06);
  --shadow-lg: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05);
  --font: 'Inter', system-ui, -apple-system, sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', monospace;
  --card-bg: white;
  --nav-bg: white;
}
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { font-size: 16px; scroll-behavior: smooth; }
body { font-family: var(--font); color: var(--text); background: var(--light); line-height: 1.6; -webkit-font-smoothing: antialiased; }
img { max-width: 100%; height: auto; display: block; }
a { color: var(--primary); text-decoration: none; }
a:hover { text-decoration: underline; }
`;

const ANIMATION_CSS = `
@keyframes snapFadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes snapSlideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
@keyframes snapSlideLeft { from { opacity: 0; transform: translateX(30px); } to { opacity: 1; transform: translateX(0); } }
@keyframes snapSlideRight { from { opacity: 0; transform: translateX(-30px); } to { opacity: 1; transform: translateX(0); } }
@keyframes snapBounce { 0%,20%,50%,80%,100% { transform: translateY(0); } 40% { transform: translateY(-20px); } 60% { transform: translateY(-10px); } }
@keyframes snapPulse { 0% { transform: scale(1); } 50% { transform: scale(1.05); } 100% { transform: scale(1); } }
@keyframes snapShake { 0%,100% { transform: translateX(0); } 10%,30%,50%,70%,90% { transform: translateX(-5px); } 20%,40%,60%,80% { transform: translateX(5px); } }
.snap-fade-in { animation: snapFadeIn 0.6s ease-out both; }
.snap-slide-up { animation: snapSlideUp 0.6s ease-out both; }
.snap-slide-left { animation: snapSlideLeft 0.6s ease-out both; }
.snap-slide-right { animation: snapSlideRight 0.6s ease-out both; }
.snap-bounce { animation: snapBounce 1s ease both; }
.snap-pulse { animation: snapPulse 2s ease-in-out infinite; }
.snap-shake { animation: snapShake 0.6s ease both; }
.snap-hover-grow { transition: transform 0.2s; }
.snap-hover-grow:hover { transform: scale(1.05); }
.snap-hover-glow { transition: box-shadow 0.2s; }
.snap-hover-glow:hover { box-shadow: 0 0 20px rgba(99,102,241,0.4); }
.snap-hover-lift { transition: transform 0.2s, box-shadow 0.2s; }
.snap-hover-lift:hover { transform: translateY(-4px); box-shadow: var(--shadow-lg); }
`;

const INTERACTIVE_CSS = `
.snap-tabs-nav { display: flex; gap: 0; border-bottom: 2px solid var(--border); margin-bottom: 1rem; }
.snap-tabs-nav button { padding: 0.75rem 1.5rem; border: none; background: none; cursor: pointer; font-family: var(--font); font-weight: 500; color: var(--text-light); border-bottom: 2px solid transparent; margin-bottom: -2px; transition: all 0.2s; }
.snap-tabs-nav button.active { color: var(--primary); border-bottom-color: var(--primary); }
.snap-tab-panel { display: none; }
.snap-tab-panel.active { display: block; }
.snap-accordion { border: 1px solid var(--border); border-radius: var(--radius); margin-bottom: 0.5rem; overflow: hidden; }
.snap-accordion-header { padding: 1rem 1.25rem; cursor: pointer; font-weight: 600; display: flex; justify-content: space-between; align-items: center; background: var(--bg-light); user-select: none; }
.snap-accordion-header::after { content: '+'; font-size: 1.25rem; transition: transform 0.2s; }
.snap-accordion.open .snap-accordion-header::after { content: '−'; }
.snap-accordion-body { max-height: 0; overflow: hidden; transition: max-height 0.3s ease; }
.snap-accordion.open .snap-accordion-body { max-height: 1000px; }
.snap-accordion-body-inner { padding: 1rem 1.25rem; }
.snap-modal-overlay { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 1000; align-items: center; justify-content: center; }
.snap-modal-overlay.open { display: flex; }
.snap-modal-content { background: var(--card-bg, white); border-radius: var(--radius); padding: 2rem; max-width: 500px; width: 90%; position: relative; box-shadow: var(--shadow-lg); }
.snap-modal-close { position: absolute; top: 0.75rem; right: 1rem; border: none; background: none; font-size: 1.5rem; cursor: pointer; color: var(--text-light); }
.snap-dropdown { position: relative; display: inline-block; }
.snap-dropdown-btn { padding: 0.625rem 1rem; border: 1px solid var(--border); border-radius: var(--radius); background: var(--card-bg, white); cursor: pointer; font-family: var(--font); display: flex; align-items: center; gap: 0.5rem; }
.snap-dropdown-btn::after { content: '▾'; }
.snap-dropdown-menu { display: none; position: absolute; top: 100%; left: 0; min-width: 180px; background: var(--card-bg, white); border: 1px solid var(--border); border-radius: var(--radius); box-shadow: var(--shadow-lg); z-index: 100; margin-top: 0.25rem; }
.snap-dropdown.open .snap-dropdown-menu { display: block; }
.snap-dropdown-menu a, .snap-dropdown-menu div { display: block; padding: 0.5rem 1rem; color: var(--text); text-decoration: none; cursor: pointer; }
.snap-dropdown-menu a:hover, .snap-dropdown-menu div:hover { background: var(--bg-light); }
.snap-toggle { display: flex; align-items: center; gap: 0.75rem; cursor: pointer; user-select: none; }
.snap-toggle-track { width: 44px; height: 24px; background: var(--bg-muted); border-radius: 12px; position: relative; transition: background 0.2s; }
.snap-toggle.on .snap-toggle-track { background: var(--primary); }
.snap-toggle-thumb { width: 20px; height: 20px; background: white; border-radius: 50%; position: absolute; top: 2px; left: 2px; transition: transform 0.2s; box-shadow: var(--shadow); }
.snap-toggle.on .snap-toggle-thumb { transform: translateX(20px); }
.snap-counter { display: inline-flex; align-items: center; gap: 0.75rem; }
.snap-counter button { width: 32px; height: 32px; border-radius: 50%; border: 1px solid var(--border); background: var(--bg-light); cursor: pointer; font-size: 1.125rem; display: flex; align-items: center; justify-content: center; }
.snap-counter-value { font-size: 1.25rem; font-weight: 700; min-width: 2rem; text-align: center; }
.snap-toast { position: fixed; bottom: 2rem; right: 2rem; padding: 1rem 1.5rem; background: var(--dark); color: var(--light); border-radius: var(--radius); box-shadow: var(--shadow-lg); z-index: 2000; transform: translateY(100px); opacity: 0; transition: all 0.3s ease; }
.snap-toast.show { transform: translateY(0); opacity: 1; }
.snap-carousel { position: relative; overflow: hidden; border-radius: var(--radius); }
.snap-carousel-track { display: flex; transition: transform 0.4s ease; }
.snap-carousel-track > * { min-width: 100%; }
.snap-carousel-btn { position: absolute; top: 50%; transform: translateY(-50%); background: rgba(255,255,255,0.9); border: none; width: 40px; height: 40px; border-radius: 50%; cursor: pointer; font-size: 1.25rem; z-index: 10; box-shadow: var(--shadow); }
.snap-carousel-prev { left: 0.75rem; }
.snap-carousel-next { right: 0.75rem; }
.snap-pricing { background: var(--card-bg, white); border-radius: var(--radius); padding: 2rem; text-align: center; box-shadow: var(--shadow); border: 1px solid var(--border); transition: transform 0.2s, box-shadow 0.2s; }
.snap-pricing:hover { transform: translateY(-4px); box-shadow: var(--shadow-lg); }
.snap-pricing-price { font-size: 2.5rem; font-weight: 800; color: var(--primary); margin: 1rem 0; }
.snap-pricing-title { font-size: 1.25rem; font-weight: 700; }
.snap-pricing-features { list-style: none; padding: 0; margin: 1.5rem 0; text-align: left; }
.snap-pricing-features li { padding: 0.5rem 0; border-bottom: 1px solid var(--border); }
.snap-pricing-features li::before { content: '✓ '; color: var(--success); font-weight: 700; }
.snap-testimonial { background: var(--card-bg, white); border-radius: var(--radius); padding: 2rem; box-shadow: var(--shadow); }
.snap-testimonial-text { font-style: italic; color: var(--text-light); margin-bottom: 1rem; font-size: 1.05rem; line-height: 1.7; }
.snap-testimonial-text::before { content: '"'; font-size: 2rem; color: var(--primary); line-height: 0; vertical-align: -0.5rem; margin-right: 0.25rem; }
.snap-testimonial-author { display: flex; align-items: center; gap: 0.75rem; }
.snap-testimonial-avatar { width: 44px; height: 44px; border-radius: 50%; background: var(--bg-muted); object-fit: cover; }
.snap-testimonial-name { font-weight: 600; }
.snap-testimonial-role { font-size: 0.85rem; color: var(--text-light); }
.snap-timeline { position: relative; padding-left: 2rem; }
.snap-timeline::before { content: ''; position: absolute; left: 0.5rem; top: 0; bottom: 0; width: 2px; background: var(--border); }
.snap-timeline-item { position: relative; padding-bottom: 2rem; }
.snap-timeline-item::before { content: ''; position: absolute; left: -1.65rem; top: 0.25rem; width: 12px; height: 12px; border-radius: 50%; background: var(--primary); border: 2px solid var(--light); }
.snap-progress { width: 100%; margin: 0.5rem 0; }
.snap-progress-bar { height: 8px; background: var(--bg-muted); border-radius: 4px; overflow: hidden; }
.snap-progress-fill { height: 100%; background: var(--primary); border-radius: 4px; transition: width 0.6s ease; }
.snap-progress-label { display: flex; justify-content: space-between; margin-bottom: 0.25rem; font-size: 0.875rem; }
.snap-alert { padding: 1rem 1.25rem; border-radius: var(--radius); margin-bottom: 1rem; display: flex; align-items: flex-start; gap: 0.75rem; }
.snap-alert-info { background: #eff6ff; border: 1px solid #bfdbfe; color: #1e40af; }
.snap-alert-success { background: #f0fdf4; border: 1px solid #bbf7d0; color: #166534; }
.snap-alert-warning { background: #fffbeb; border: 1px solid #fde68a; color: #92400e; }
.snap-alert-danger { background: #fef2f2; border: 1px solid #fecaca; color: #991b1b; }
.snap-countdown { display: flex; gap: 1rem; justify-content: center; }
.snap-countdown-unit { text-align: center; }
.snap-countdown-value { font-size: 2.5rem; font-weight: 800; color: var(--primary); background: var(--bg-light); border-radius: var(--radius); padding: 0.5rem 1rem; min-width: 4rem; display: block; }
.snap-countdown-label { font-size: 0.75rem; text-transform: uppercase; color: var(--text-light); margin-top: 0.25rem; letter-spacing: 0.05em; }
`;

export function compile(ast) {
  const meta = ast.meta || {};
  const components = ast.components || {};
  const title = meta.title || 'Snap App';
  const description = meta.description || '';
  const themeName = meta.theme || 'default';

  // Process variables
  const vars = {};
  for (const [k, v] of Object.entries(meta)) {
    if (k === 'var' || k.startsWith('var-')) {
      // @var name="value" format — parse from the value
    }
  }
  // Parse @var directives: stored as meta.var -> 'name="value"'
  // We handle them differently — collected during meta parsing
  const varEntries = Object.entries(meta).filter(([k]) => k === 'var');
  // Actually, let's handle vars inline in the meta parsing — they come as: @var name="value"
  // Since meta stores @var -> 'name="value"', we need to parse all vars from meta
  const templateVars = {};
  if (meta.var) {
    const varStr = typeof meta.var === 'string' ? meta.var : '';
    const vm = varStr.match(/^(\w+)\s*=\s*"([^"]*)"/);
    if (vm) templateVars[vm[1]] = vm[2];
  }
  // Also check for individual @var-xxx entries
  for (const [k, v] of Object.entries(meta)) {
    if (k.startsWith('var-')) {
      templateVars[k.slice(4)] = String(v).replace(/^["']|["']$/g, '');
    }
  }

  let styles = '';
  let scripts = '';
  let styleCounter = 0;
  let modalCounter = 0;
  let carouselCounter = 0;
  let toastCounter = 0;
  let countdownCounter = 0;

  function genClass() { return `b${++styleCounter}`; }
  function genId(prefix) { return `${prefix}_${++styleCounter}`; }

  function resolveStyles(styleNames) {
    const css = {};
    for (const name of styleNames) {
      const s = STYLE_KEYWORDS[name];
      if (s) Object.assign(css, s);
    }
    return css;
  }

  function cssObjToString(obj) {
    return Object.entries(obj)
      .filter(([k]) => k !== '@media')
      .map(([k, v]) => `${camelToKebab(k)}: ${v}`)
      .join('; ');
  }

  function camelToKebab(str) {
    return str.replace(/([A-Z])/g, '-$1').toLowerCase();
  }

  function animClasses(anims) {
    return anims.map(a => `snap-${a}`).join(' ');
  }

  function replaceVars(text) {
    if (!text) return text;
    return text.replace(/\{(\w+)\}/g, (m, name) => {
      if (templateVars[name] !== undefined) return templateVars[name];
      return m; // keep as-is for runtime data binding
    });
  }

  function renderNode(node) {
    if (!node) return '';
    if (typeof node === 'string') return escapeHtml(node);

    const { type, content, props, styles: styleNames = [], animations = [], children = [] } = node;
    const inlineStyle = cssObjToString(resolveStyles(styleNames));
    const styleAttr = inlineStyle ? ` style="${inlineStyle}"` : '';
    const ac = animations.length ? ' ' + animClasses(animations) : '';
    const childHtml = children.map(renderNode).join('\n');
    const displayContent = replaceVars(content);

    switch (type) {
      case 'root': return childHtml;
      case 'page': return `<main class="snap-page${ac}"${styleAttr}>${displayContent ? `<h1>${displayContent}</h1>` : ''}${childHtml}</main>`;
      case 'layout': return `<div class="snap-layout${ac}"${styleAttr}>${childHtml}</div>`;

      case 'nav': {
        const brand = displayContent || props.brand || 'App';
        return `<nav class="snap-nav${ac}"${styleAttr}><div class="snap-nav-inner"><a class="snap-nav-brand" href="/">${brand}</a><div class="snap-nav-links">${childHtml}</div></div></nav>`;
      }

      case 'hero': {
        const cls = styleNames.includes('bg-gradient') ? 'snap-hero snap-hero-gradient' : 'snap-hero';
        return `<section class="${cls}${ac}"${styleAttr}><div class="snap-hero-inner">${displayContent ? `<h1 class="snap-hero-title">${displayContent}</h1>` : ''}${childHtml}</div></section>`;
      }

      case 'section':
        return `<section class="snap-section${ac}"${styleAttr}>${displayContent ? `<h2 class="snap-section-title">${displayContent}</h2>` : ''}${childHtml}</section>`;

      case 'heading': {
        const level = props.level || '2';
        return `<h${level} class="snap-heading${ac}"${styleAttr}>${displayContent || ''}${childHtml}</h${level}>`;
      }

      case 'text':
        return `<p class="snap-text${ac}"${styleAttr}>${displayContent || ''}${childHtml}</p>`;

      case 'card': {
        return `<div class="snap-card${ac}"${styleAttr}>${displayContent ? `<h3 class="snap-card-title">${displayContent}</h3>` : ''}${childHtml}</div>`;
      }

      case 'grid': {
        const cols = props.cols || '3';
        const gap = props.gap || '1.5rem';
        return `<div class="snap-grid${ac}" style="--cols:${cols};--gap:${gap};${inlineStyle}">${childHtml}</div>`;
      }

      case 'row': return `<div class="snap-row${ac}"${styleAttr}>${childHtml}</div>`;
      case 'column': return `<div class="snap-column${ac}"${styleAttr}>${childHtml}</div>`;

      case 'button': {
        const href = props.href || props.to || '';
        const variant = styleNames.includes('secondary') ? 'snap-btn-secondary' :
                       styleNames.includes('accent') ? 'snap-btn-accent' :
                       styleNames.includes('danger') ? 'snap-btn-danger' : '';
        if (href) return `<a href="${href}" class="snap-btn ${variant}${ac}"${styleAttr}>${displayContent || 'Click'}${childHtml}</a>`;
        return `<button class="snap-btn ${variant}${ac}"${styleAttr}>${displayContent || 'Click'}${childHtml}</button>`;
      }

      case 'link':
        return `<a href="${props.href || props.to || '#'}" class="snap-link${ac}"${styleAttr}>${displayContent || props.href || 'Link'}${childHtml}</a>`;

      case 'image':
        return `<img src="${props.src || displayContent || ''}" alt="${props.alt || displayContent || ''}" class="snap-image${ac}"${styleAttr} />`;

      case 'form':
        return `<form class="snap-form${ac}"${styleAttr} onsubmit="event.preventDefault()">${displayContent ? `<h3>${displayContent}</h3>` : ''}${childHtml}${children.some(c => c.type === 'button') ? '' : '<button class="snap-btn" type="submit">Submit</button>'}</form>`;

      case 'input': {
        const inputType = props.type || 'text';
        const label = displayContent || props.label || props.name || '';
        const name = props.name || label.toLowerCase().replace(/\s+/g, '_');
        const placeholder = props.placeholder || label;
        return `<div class="snap-field"><label class="snap-label">${label}</label><input type="${inputType}" name="${name}" placeholder="${placeholder}" class="snap-input"${styleAttr} /></div>`;
      }

      case 'table': {
        const headers = (props.headers || '').split(',').map(h => h.trim()).filter(Boolean);
        let tableHtml = '';
        if (headers.length) tableHtml = `<thead><tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr></thead>`;
        return `<div class="snap-table-wrap"><table class="snap-table"${styleAttr}>${tableHtml}<tbody>${childHtml}</tbody></table></div>`;
      }

      case 'stat': {
        const value = props.value || '';
        const label = displayContent || props.label || '';
        const trend = props.trend || '';
        const trendClass = trend.startsWith('+') ? 'up' : trend.startsWith('-') ? 'down' : '';
        return `<div class="snap-stat${ac}"${styleAttr}><div class="snap-stat-value">${value}</div><div class="snap-stat-label">${label}</div>${trend ? `<div class="snap-stat-trend ${trendClass}">${trend}</div>` : ''}</div>`;
      }

      case 'badge': return `<span class="snap-badge${ac}"${styleAttr}>${displayContent || ''}${childHtml}</span>`;
      case 'divider': return `<hr class="snap-divider"${styleAttr} />`;
      case 'spacer': return `<div class="snap-spacer" style="height:${props.size || '2rem'}"></div>`;
      case 'footer': return `<footer class="snap-footer${ac}"${styleAttr}>${displayContent ? `<p>${displayContent}</p>` : ''}${childHtml}</footer>`;
      case 'list': return `<ul class="snap-list${ac}"${styleAttr}>${childHtml}</ul>`;
      case 'item': return `<li class="snap-item${ac}"${styleAttr}>${displayContent || ''}${childHtml}</li>`;
      case 'quote': return `<blockquote class="snap-quote${ac}"${styleAttr}>${displayContent || ''}${childHtml}</blockquote>`;
      case 'code': return `<pre class="snap-code${ac}"${styleAttr}><code>${escapeHtml(displayContent || '')}${childHtml}</code></pre>`;
      case 'video': return `<video class="snap-video" src="${props.src || ''}" controls${styleAttr}></video>`;
      case 'embed': return `<iframe class="snap-embed" src="${props.src || ''}" frameborder="0"${styleAttr}></iframe>`;

      case 'chart': {
        const chartId = genId('chart');
        const chartType = props.type || 'bar';
        const labels = (props.labels || '').split(',').map(s => s.trim());
        const values = (props.values || '').split(',').map(s => parseFloat(s.trim()));
        scripts += generateChartScript(chartId, chartType, labels, values, displayContent);
        return `<div class="snap-chart${ac}"${styleAttr}>${displayContent ? `<h3>${displayContent}</h3>` : ''}<canvas id="${chartId}" height="${props.height || '300'}"></canvas></div>`;
      }

      // --- INTERACTIVE COMPONENTS ---

      case 'tabs': {
        const tabNames = (displayContent || '').split(',').map(s => s.trim());
        const tabId = genId('tabs');
        let tabsHtml = `<div class="snap-tabs${ac}" id="${tabId}"><div class="snap-tabs-nav">`;
        tabNames.forEach((name, i) => {
          tabsHtml += `<button class="${i === 0 ? 'active' : ''}" onclick="snapTabs('${tabId}',${i})">${name}</button>`;
        });
        tabsHtml += '</div>';
        // Each child maps to a tab panel
        children.forEach((child, i) => {
          tabsHtml += `<div class="snap-tab-panel${i === 0 ? ' active' : ''}">${renderNode(child)}</div>`;
        });
        tabsHtml += '</div>';
        return tabsHtml;
      }

      case 'accordion': {
        const accId = genId('acc');
        return `<div class="snap-accordion${ac}" id="${accId}"><div class="snap-accordion-header" onclick="this.parentElement.classList.toggle('open')">${displayContent || 'Toggle'}</div><div class="snap-accordion-body"><div class="snap-accordion-body-inner">${childHtml}</div></div></div>`;
      }

      case 'modal': {
        const modalId = genId('modal');
        return `<button class="snap-btn${ac}" onclick="document.getElementById('${modalId}').classList.add('open')">${displayContent || 'Open'}</button><div class="snap-modal-overlay" id="${modalId}" onclick="if(event.target===this)this.classList.remove('open')"><div class="snap-modal-content"><button class="snap-modal-close" onclick="this.closest('.snap-modal-overlay').classList.remove('open')">&times;</button>${childHtml}</div></div>`;
      }

      case 'dropdown': {
        const ddId = genId('dd');
        return `<div class="snap-dropdown${ac}" id="${ddId}"><button class="snap-dropdown-btn" onclick="this.parentElement.classList.toggle('open')">${displayContent || 'Select'}</button><div class="snap-dropdown-menu">${childHtml}</div></div>`;
      }

      case 'toggle': {
        const toggleId = genId('toggle');
        return `<div class="snap-toggle${ac}" id="${toggleId}" onclick="this.classList.toggle('on')"><span class="snap-toggle-label">${displayContent || ''}</span><div class="snap-toggle-track"><div class="snap-toggle-thumb"></div></div></div>`;
      }

      case 'counter': {
        const counterId = genId('cnt');
        const initial = props.value || '0';
        scripts += `window['${counterId}']=` + initial + `;`;
        return `<div class="snap-counter${ac}" id="${counterId}"><button onclick="document.querySelector('#${counterId} .snap-counter-value').textContent=--window['${counterId}']">−</button><span class="snap-counter-value">${initial}</span><button onclick="document.querySelector('#${counterId} .snap-counter-value').textContent=++window['${counterId}']">+</button></div>`;
      }

      case 'toast': {
        const toastId = genId('toast');
        scripts += `window.snapToast_${toastId}=function(){var t=document.getElementById('${toastId}');t.classList.add('show');setTimeout(function(){t.classList.remove('show')},3000)};`;
        return `<button class="snap-btn${ac}" onclick="snapToast_${toastId}()">${props.trigger || 'Show Toast'}</button><div class="snap-toast" id="${toastId}">${displayContent || 'Notification'}</div>`;
      }

      // --- MORE COMPONENTS ---

      case 'carousel': {
        const cId = genId('car');
        scripts += `window.snapCarousel_${cId}={idx:0,len:${children.length}};function snapCarNav_${cId}(d){var c=window.snapCarousel_${cId};c.idx=Math.max(0,Math.min(c.len-1,c.idx+d));document.querySelector('#${cId} .snap-carousel-track').style.transform='translateX(-'+c.idx*100+'%)';}`;
        return `<div class="snap-carousel${ac}" id="${cId}"><div class="snap-carousel-track">${childHtml}</div><button class="snap-carousel-btn snap-carousel-prev" onclick="snapCarNav_${cId}(-1)">‹</button><button class="snap-carousel-btn snap-carousel-next" onclick="snapCarNav_${cId}(1)">›</button></div>`;
      }

      case 'pricing': {
        const price = props.price || '';
        const period = props.period || '/mo';
        const features = (props.features || '').split(',').map(s => s.trim()).filter(Boolean);
        return `<div class="snap-pricing${ac}"${styleAttr}><div class="snap-pricing-title">${displayContent || ''}</div><div class="snap-pricing-price">${price}<small style="font-size:0.4em;color:var(--text-light)">${period}</small></div>${features.length ? `<ul class="snap-pricing-features">${features.map(f => `<li>${f}</li>`).join('')}</ul>` : ''}${childHtml}</div>`;
      }

      case 'testimonial': {
        const author = props.author || '';
        const role = props.role || '';
        const avatar = props.avatar || '';
        return `<div class="snap-testimonial${ac}"${styleAttr}><div class="snap-testimonial-text">${displayContent || ''}${childHtml}</div><div class="snap-testimonial-author">${avatar ? `<img class="snap-testimonial-avatar" src="${avatar}" alt="${author}" />` : ''}<div><div class="snap-testimonial-name">${author}</div><div class="snap-testimonial-role">${role}</div></div></div></div>`;
      }

      case 'timeline': {
        return `<div class="snap-timeline${ac}"${styleAttr}>${children.map(c => `<div class="snap-timeline-item">${renderNode(c)}</div>`).join('')}</div>`;
      }

      case 'progress': {
        const value = props.value || '0';
        const label = displayContent || '';
        return `<div class="snap-progress${ac}"${styleAttr}>${label ? `<div class="snap-progress-label"><span>${label}</span><span>${value}%</span></div>` : ''}<div class="snap-progress-bar"><div class="snap-progress-fill" style="width:${value}%"></div></div></div>`;
      }

      case 'alert': {
        const alertType = props.type || 'info';
        return `<div class="snap-alert snap-alert-${alertType}${ac}"${styleAttr}>${displayContent || ''}${childHtml}</div>`;
      }

      case 'countdown': {
        const cdId = genId('cd');
        const target = props.to || '';
        scripts += `(function(){var t=new Date('${target}').getTime();function u(){var n=Date.now(),d=Math.max(0,t-n),dd=Math.floor(d/86400000),hh=Math.floor(d%86400000/3600000),mm=Math.floor(d%3600000/60000),ss=Math.floor(d%60000/1000);var e=document.getElementById('${cdId}');if(!e)return;e.innerHTML='<div class="snap-countdown-unit"><span class="snap-countdown-value">'+dd+'</span><span class="snap-countdown-label">Days</span></div><div class="snap-countdown-unit"><span class="snap-countdown-value">'+hh+'</span><span class="snap-countdown-label">Hours</span></div><div class="snap-countdown-unit"><span class="snap-countdown-value">'+mm+'</span><span class="snap-countdown-label">Min</span></div><div class="snap-countdown-unit"><span class="snap-countdown-value">'+ss+'</span><span class="snap-countdown-label">Sec</span></div>';if(d>0)requestAnimationFrame(u);}u()})();`;
        return `<div class="snap-countdown${ac}" id="${cdId}"${styleAttr}></div>`;
      }

      case 'use': {
        const compName = displayContent || '';
        if (components[compName]) {
          return `<!-- component: ${compName} -->${renderComponentSource(components[compName])}`;
        }
        return `<!-- unknown component: ${compName} -->`;
      }

      default:
        return `<div class="${ac.trim()}"${styleAttr}>${displayContent || ''}${childHtml}</div>`;
    }
  }

  function renderComponentSource(source) {
    // Mini-parse the stored component lines
    // For simplicity, we treat them as additional nodes under a wrapper
    try {
      const { parse: parseFn } = { parse: (() => { throw new Error('circular'); })() };
    } catch {}
    // Inline approach: just wrap each line
    return `<div class="snap-component">${source}</div>`;
  }

  function generateChartScript(id, type, labels, values, title) {
    const colors = ['#6366f1','#8b5cf6','#06b6d4','#22c55e','#f59e0b','#ef4444','#ec4899','#14b8a6'];
    return `
    (function(){
      const canvas = document.getElementById('${id}');
      if(!canvas) return;
      const ctx = canvas.getContext('2d');
      const W = canvas.width = canvas.parentElement.offsetWidth;
      const H = canvas.height = ${type === 'pie' ? 'Math.min(300, W)' : '300'};
      const labels = ${JSON.stringify(labels)};
      const values = ${JSON.stringify(values)};
      const colors = ${JSON.stringify(colors)};
      const max = Math.max(...values, 1);
      ctx.font = '12px Inter, system-ui, sans-serif';
      ${type === 'pie' ? `
      const total = values.reduce((a,b)=>a+b,0);let angle=-Math.PI/2;const cx=W/2,cy=H/2,r=Math.min(cx,cy)-40;
      values.forEach((v,i)=>{const slice=(v/total)*Math.PI*2;ctx.beginPath();ctx.moveTo(cx,cy);ctx.arc(cx,cy,r,angle,angle+slice);ctx.fillStyle=colors[i%colors.length];ctx.fill();const mid=angle+slice/2;ctx.fillStyle='#1e293b';ctx.fillText(labels[i],cx+Math.cos(mid)*(r+20),cy+Math.sin(mid)*(r+20));angle+=slice;});
      ` : type === 'line' ? `
      const pad={t:20,r:20,b:40,l:50};const gW=W-pad.l-pad.r,gH=H-pad.t-pad.b;
      ctx.strokeStyle='#e2e8f0';ctx.lineWidth=1;for(let i=0;i<=4;i++){const y=pad.t+gH*(1-i/4);ctx.beginPath();ctx.moveTo(pad.l,y);ctx.lineTo(W-pad.r,y);ctx.stroke();ctx.fillStyle='#94a3b8';ctx.fillText(Math.round(max*i/4),5,y+4);}
      ctx.beginPath();ctx.strokeStyle=colors[0];ctx.lineWidth=3;values.forEach((v,i)=>{const x=pad.l+i*(gW/(values.length-1||1));const y=pad.t+gH*(1-v/max);i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);ctx.fillStyle='#64748b';ctx.fillText(labels[i]||'',x-10,H-10);});ctx.stroke();
      values.forEach((v,i)=>{const x=pad.l+i*(gW/(values.length-1||1));const y=pad.t+gH*(1-v/max);ctx.beginPath();ctx.arc(x,y,5,0,Math.PI*2);ctx.fillStyle=colors[0];ctx.fill();ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(x,y,2,0,Math.PI*2);ctx.fill();});
      ` : `
      const pad={t:20,r:20,b:40,l:50};const gW=W-pad.l-pad.r,gH=H-pad.t-pad.b;const bW=Math.min(60,gW/values.length*0.7);
      ctx.strokeStyle='#e2e8f0';ctx.lineWidth=1;for(let i=0;i<=4;i++){const y=pad.t+gH*(1-i/4);ctx.beginPath();ctx.moveTo(pad.l,y);ctx.lineTo(W-pad.r,y);ctx.stroke();ctx.fillStyle='#94a3b8';ctx.fillText(Math.round(max*i/4),5,y+4);}
      values.forEach((v,i)=>{const x=pad.l+(i+0.5)*(gW/values.length)-bW/2;const h=gH*(v/max);const y=pad.t+gH-h;ctx.fillStyle=colors[i%colors.length];ctx.beginPath();ctx.roundRect?ctx.roundRect(x,y,bW,h,4):ctx.fillRect(x,y,bW,h);ctx.fill();ctx.fillStyle='#64748b';ctx.fillText(labels[i]||'',x,H-10);});
      `}
    })();`;
  }

  // Build theme CSS overrides
  let themeCSS = '';
  const preset = THEME_PRESETS[themeName];
  if (preset) {
    themeCSS = ':root {\n' + Object.entries(preset).map(([k, v]) => `  ${k}: ${v};`).join('\n') + '\n}';
  }
  // Custom color overrides
  const colorOverrides = Object.entries(meta)
    .filter(([k]) => k.startsWith('color-'))
    .map(([k, v]) => `  --${k.replace('color-', '')}: ${v};`);
  if (colorOverrides.length) {
    themeCSS += '\n:root {\n' + colorOverrides.join('\n') + '\n}';
  }

  // Custom font
  let fontLink = '<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">';
  if (meta.font) {
    const fontName = meta.font.replace(/["']/g, '');
    fontLink = `<link href="https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontName)}:wght@400;500;600;700;800&display=swap" rel="stylesheet">`;
    themeCSS += `\n:root { --font: '${fontName}', system-ui, sans-serif; }`;
  }

  // Dark theme body overrides
  const darkBody = themeName === 'dark' ? `
body { background: #0f172a; }
.snap-nav { background: var(--nav-bg); border-bottom-color: var(--border); }
.snap-card, .snap-form, .snap-pricing, .snap-testimonial { background: var(--card-bg); }
.snap-input { background: var(--bg-light); border-color: var(--border); color: var(--text); }
.snap-code { background: #1e293b; }
` : '';

  const body = renderNode(ast);

  // Global interactive scripts
  const globalScripts = `
function snapTabs(id,idx){var el=document.getElementById(id);var btns=el.querySelectorAll('.snap-tabs-nav button');var panels=el.querySelectorAll('.snap-tab-panel');btns.forEach(function(b,i){b.classList.toggle('active',i===idx)});panels.forEach(function(p,i){p.classList.toggle('active',i===idx)});}
document.addEventListener('click',function(e){document.querySelectorAll('.snap-dropdown.open').forEach(function(d){if(!d.contains(e.target))d.classList.remove('open')})});
`;

  // SEO meta
  const ogImage = meta['og-image'] ? `<meta property="og:image" content="${meta['og-image']}">` : '';
  const favicon = meta.favicon ? `<link rel="icon" href="${meta.favicon}">` : '';
  const ogMeta = `<meta property="og:title" content="${escapeHtml(title)}">${description ? `\n  <meta property="og:description" content="${escapeHtml(description)}">` : ''}${ogImage ? '\n  ' + ogImage : ''}`;

  // Data binding script
  let dataScript = '';
  if (meta.data) {
    const dataUrl = meta.data.replace(/^url=/, '');
    dataScript = `
fetch('${dataUrl}').then(r=>r.json()).then(function(data){
  document.querySelectorAll('[data-bind]').forEach(function(el){
    var k=el.getAttribute('data-bind');
    if(data[k]!==undefined)el.textContent=data[k];
  });
}).catch(function(){});`;
  }

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)}</title>
  ${description ? `<meta name="description" content="${escapeHtml(description)}">` : ''}
  ${ogMeta}
  ${favicon}
  <link rel="preconnect" href="https://fonts.googleapis.com">
  ${fontLink}
  <style>${BASE_THEME}${themeCSS}${darkBody}${COMPONENT_STYLES}${ANIMATION_CSS}${INTERACTIVE_CSS}${styles}</style>
</head>
<body>
${body}
<script>${globalScripts}${scripts}${dataScript}</script>
</body>
</html>`;

  return html;
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

const COMPONENT_STYLES = `
.snap-page { max-width: 1200px; margin: 0 auto; padding: 2rem; }
.snap-layout { min-height: 100vh; display: flex; flex-direction: column; }
.snap-nav { background: var(--nav-bg, white); border-bottom: 1px solid var(--border); position: sticky; top: 0; z-index: 100; backdrop-filter: blur(10px); }
.snap-nav-inner { max-width: 1200px; margin: 0 auto; padding: 0.75rem 2rem; display: flex; align-items: center; justify-content: space-between; }
.snap-nav-brand { font-weight: 700; font-size: 1.25rem; color: var(--dark); text-decoration: none; }
.snap-nav-links { display: flex; gap: 1.5rem; align-items: center; }
.snap-nav-links a { color: var(--text-light); text-decoration: none; font-weight: 500; transition: color 0.2s; }
.snap-nav-links a:hover { color: var(--primary); }
.snap-hero { padding: 6rem 2rem; text-align: center; background: var(--light); }
.snap-hero-gradient { background: linear-gradient(135deg, var(--primary), var(--accent)); color: white; }
.snap-hero-gradient .snap-text { color: rgba(255,255,255,0.9); }
.snap-hero-gradient .snap-btn { background: white; color: var(--primary); }
.snap-hero-gradient .snap-btn:hover { background: rgba(255,255,255,0.9); }
.snap-hero-inner { max-width: 800px; margin: 0 auto; }
.snap-hero-title { font-size: clamp(2rem, 5vw, 3.5rem); font-weight: 800; line-height: 1.1; margin-bottom: 1.5rem; letter-spacing: -0.02em; }
.snap-section { padding: 4rem 2rem; max-width: 1200px; margin: 0 auto; }
.snap-section-title { font-size: 1.75rem; font-weight: 700; margin-bottom: 2rem; }
.snap-heading { font-weight: 700; line-height: 1.2; margin-bottom: 0.75rem; letter-spacing: -0.01em; }
h1.snap-heading { font-size: 2.5rem; } h2.snap-heading { font-size: 2rem; } h3.snap-heading { font-size: 1.5rem; }
.snap-text { color: var(--text-light); line-height: 1.7; margin-bottom: 1rem; max-width: 65ch; }
.snap-card { background: var(--card-bg, white); border-radius: var(--radius); padding: 1.5rem; box-shadow: var(--shadow); transition: box-shadow 0.2s, transform 0.2s; }
.snap-card:hover { box-shadow: var(--shadow-lg); transform: translateY(-2px); }
.snap-card-title { font-size: 1.125rem; font-weight: 600; margin-bottom: 0.5rem; }
.snap-grid { display: grid; grid-template-columns: repeat(var(--cols, 3), 1fr); gap: var(--gap, 1.5rem); }
@media (max-width: 768px) { .snap-grid { grid-template-columns: 1fr; } }
@media (min-width: 769px) and (max-width: 1024px) { .snap-grid { grid-template-columns: repeat(min(var(--cols, 3), 2), 1fr); } }
.snap-row { display: flex; gap: 1rem; align-items: center; flex-wrap: wrap; }
.snap-column { flex: 1; min-width: 0; }
.snap-btn { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.625rem 1.5rem; background: var(--primary); color: white; border: none; border-radius: var(--radius); font-weight: 600; font-size: 0.9375rem; cursor: pointer; transition: all 0.2s; text-decoration: none; font-family: var(--font); }
.snap-btn:hover { opacity: 0.9; transform: translateY(-1px); text-decoration: none; }
.snap-btn-secondary { background: var(--secondary); } .snap-btn-accent { background: var(--accent); } .snap-btn-danger { background: var(--danger); }
.snap-form { display: flex; flex-direction: column; gap: 1rem; max-width: 500px; }
.snap-field { display: flex; flex-direction: column; gap: 0.375rem; }
.snap-label { font-weight: 600; font-size: 0.875rem; color: var(--text); }
.snap-input { padding: 0.625rem 0.875rem; border: 1px solid var(--border); border-radius: var(--radius); font-size: 1rem; font-family: var(--font); transition: border-color 0.2s, box-shadow 0.2s; }
.snap-input:focus { outline: none; border-color: var(--primary); box-shadow: 0 0 0 3px rgba(99,102,241,0.1); }
.snap-table-wrap { overflow-x: auto; border-radius: var(--radius); border: 1px solid var(--border); }
.snap-table { width: 100%; border-collapse: collapse; }
.snap-table th { background: var(--bg-light); font-weight: 600; text-align: left; padding: 0.75rem 1rem; font-size: 0.875rem; color: var(--text-light); text-transform: uppercase; letter-spacing: 0.05em; }
.snap-table td { padding: 0.75rem 1rem; border-top: 1px solid var(--border); }
.snap-table tr:hover td { background: var(--bg-light); }
.snap-stat { text-align: center; padding: 1rem; }
.snap-stat-value { font-size: 2rem; font-weight: 800; color: var(--dark); letter-spacing: -0.02em; }
.snap-stat-label { font-size: 0.875rem; color: var(--text-light); margin-top: 0.25rem; }
.snap-stat-trend { font-size: 0.875rem; font-weight: 600; margin-top: 0.25rem; }
.snap-stat-trend.up { color: var(--success); } .snap-stat-trend.down { color: var(--danger); }
.snap-badge { display: inline-flex; padding: 0.25rem 0.75rem; border-radius: 999px; font-size: 0.75rem; font-weight: 600; background: var(--bg-light); color: var(--text-light); }
.snap-divider { border: none; border-top: 1px solid var(--border); margin: 1.5rem 0; }
.snap-footer { padding: 2rem; text-align: center; color: var(--text-light); font-size: 0.875rem; border-top: 1px solid var(--border); margin-top: auto; }
.snap-list { list-style: none; display: flex; flex-direction: column; gap: 0.5rem; }
.snap-item { padding: 0.5rem 0; } .snap-item::before { content: '→ '; color: var(--primary); font-weight: 600; }
.snap-quote { border-left: 4px solid var(--primary); padding: 1rem 1.5rem; background: var(--bg-light); border-radius: 0 var(--radius) var(--radius) 0; font-style: italic; color: var(--text-light); }
.snap-code { background: var(--dark); color: #e2e8f0; padding: 1.5rem; border-radius: var(--radius); overflow-x: auto; font-family: var(--font-mono); font-size: 0.875rem; line-height: 1.6; }
.snap-chart { padding: 1rem 0; } .snap-chart h3 { margin-bottom: 1rem; } .snap-chart canvas { width: 100%; }
.snap-image { border-radius: var(--radius); }
.snap-video { width: 100%; border-radius: var(--radius); }
.snap-embed { width: 100%; min-height: 400px; border-radius: var(--radius); }
.snap-link { color: var(--primary); font-weight: 500; }
.snap-component { }
`;
