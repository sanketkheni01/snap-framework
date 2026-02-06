// Snap Compiler — AST to HTML+CSS+JS
import { STYLE_KEYWORDS } from './parser.js';

const DEFAULT_THEME = `
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
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

html { font-size: 16px; scroll-behavior: smooth; }

body {
  font-family: var(--font);
  color: var(--text);
  background: var(--light);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}

img { max-width: 100%; height: auto; display: block; }
a { color: var(--primary); text-decoration: none; }
a:hover { text-decoration: underline; }
`;

export function compile(ast) {
  const meta = ast.meta || {};
  const title = meta.title || 'Snap App';
  const description = meta.description || '';
  const theme = meta.theme || 'light';

  let styles = '';
  let scripts = '';
  let styleCounter = 0;

  function genClass() {
    return `b${++styleCounter}`;
  }

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

  function renderNode(node) {
    if (!node) return '';
    if (typeof node === 'string') return escapeHtml(node);

    const { type, content, props, styles: styleNames = [], children = [] } = node;
    const inlineStyle = cssObjToString(resolveStyles(styleNames));
    const styleAttr = inlineStyle ? ` style="${inlineStyle}"` : '';
    const childHtml = children.map(renderNode).join('\n');

    switch (type) {
      case 'root':
        return childHtml;

      case 'page':
        return `<main class="snap-page"${styleAttr}>${content ? `<h1>${content}</h1>` : ''}${childHtml}</main>`;

      case 'layout':
        return `<div class="snap-layout"${styleAttr}>${childHtml}</div>`;

      case 'nav': {
        const brand = content || props.brand || 'App';
        return `<nav class="snap-nav"${styleAttr}>
          <div class="snap-nav-inner">
            <a class="snap-nav-brand" href="/">${brand}</a>
            <div class="snap-nav-links">${childHtml}</div>
          </div>
        </nav>`;
      }

      case 'hero': {
        const cls = styleNames.includes('bg-gradient') ? 'snap-hero snap-hero-gradient' : 'snap-hero';
        return `<section class="${cls}"${styleAttr}>
          <div class="snap-hero-inner">${content ? `<h1 class="snap-hero-title">${content}</h1>` : ''}${childHtml}</div>
        </section>`;
      }

      case 'section':
        return `<section class="snap-section"${styleAttr}>${content ? `<h2 class="snap-section-title">${content}</h2>` : ''}${childHtml}</section>`;

      case 'heading': {
        const level = props.level || '2';
        return `<h${level} class="snap-heading"${styleAttr}>${content || ''}${childHtml}</h${level}>`;
      }

      case 'text':
        return `<p class="snap-text"${styleAttr}>${content || ''}${childHtml}</p>`;

      case 'card': {
        const cls = genClass();
        return `<div class="snap-card ${cls}"${styleAttr}>
          ${content ? `<h3 class="snap-card-title">${content}</h3>` : ''}
          ${childHtml}
        </div>`;
      }

      case 'grid': {
        const cols = props.cols || '3';
        const gap = props.gap || '1.5rem';
        return `<div class="snap-grid" style="--cols:${cols};--gap:${gap};${inlineStyle}">${childHtml}</div>`;
      }

      case 'row':
        return `<div class="snap-row"${styleAttr}>${childHtml}</div>`;

      case 'column':
        return `<div class="snap-column"${styleAttr}>${childHtml}</div>`;

      case 'button': {
        const href = props.href || props.to || '';
        const variant = styleNames.includes('secondary') ? 'snap-btn-secondary' :
                       styleNames.includes('accent') ? 'snap-btn-accent' :
                       styleNames.includes('danger') ? 'snap-btn-danger' : '';
        if (href) {
          return `<a href="${href}" class="snap-btn ${variant}"${styleAttr}>${content || 'Click'}${childHtml}</a>`;
        }
        return `<button class="snap-btn ${variant}"${styleAttr}>${content || 'Click'}${childHtml}</button>`;
      }

      case 'link':
        return `<a href="${props.href || props.to || '#'}" class="snap-link"${styleAttr}>${content || props.href || 'Link'}${childHtml}</a>`;

      case 'image':
        return `<img src="${props.src || content || ''}" alt="${props.alt || content || ''}" class="snap-image"${styleAttr} />`;

      case 'form':
        return `<form class="snap-form"${styleAttr} onsubmit="event.preventDefault()">
          ${content ? `<h3>${content}</h3>` : ''}${childHtml}
          ${children.some(c => c.type === 'button') ? '' : '<button class="snap-btn" type="submit">Submit</button>'}
        </form>`;

      case 'input': {
        const inputType = props.type || 'text';
        const label = content || props.label || props.name || '';
        const name = props.name || label.toLowerCase().replace(/\s+/g, '_');
        const placeholder = props.placeholder || label;
        return `<div class="snap-field">
          ${label ? `<label class="snap-label">${label}</label>` : ''}
          <input type="${inputType}" name="${name}" placeholder="${placeholder}" class="snap-input"${styleAttr} />
        </div>`;
      }

      case 'table': {
        const headers = (props.headers || '').split(',').map(h => h.trim()).filter(Boolean);
        let tableHtml = '';
        if (headers.length) {
          tableHtml = `<thead><tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr></thead>`;
        }
        return `<div class="snap-table-wrap"><table class="snap-table"${styleAttr}>${tableHtml}<tbody>${childHtml}</tbody></table></div>`;
      }

      case 'stat': {
        const value = props.value || '';
        const label = content || props.label || '';
        const trend = props.trend || '';
        const trendClass = trend.startsWith('+') ? 'up' : trend.startsWith('-') ? 'down' : '';
        return `<div class="snap-stat"${styleAttr}>
          <div class="snap-stat-value">${value}</div>
          <div class="snap-stat-label">${label}</div>
          ${trend ? `<div class="snap-stat-trend ${trendClass}">${trend}</div>` : ''}
        </div>`;
      }

      case 'badge':
        return `<span class="snap-badge"${styleAttr}>${content || ''}${childHtml}</span>`;

      case 'divider':
        return `<hr class="snap-divider"${styleAttr} />`;

      case 'spacer':
        return `<div class="snap-spacer" style="height:${props.size || '2rem'}"${styleAttr}></div>`;

      case 'footer':
        return `<footer class="snap-footer"${styleAttr}>${content ? `<p>${content}</p>` : ''}${childHtml}</footer>`;

      case 'list':
        return `<ul class="snap-list"${styleAttr}>${childHtml}</ul>`;

      case 'item':
        return `<li class="snap-item"${styleAttr}>${content || ''}${childHtml}</li>`;

      case 'quote':
        return `<blockquote class="snap-quote"${styleAttr}>${content || ''}${childHtml}</blockquote>`;

      case 'code':
        return `<pre class="snap-code"${styleAttr}><code>${escapeHtml(content || '')}${childHtml}</code></pre>`;

      case 'chart': {
        const chartId = `chart_${genClass()}`;
        const chartType = props.type || 'bar';
        const labels = (props.labels || '').split(',').map(s => s.trim());
        const values = (props.values || '').split(',').map(s => parseFloat(s.trim()));
        scripts += generateChartScript(chartId, chartType, labels, values, content);
        return `<div class="snap-chart"${styleAttr}>${content ? `<h3>${content}</h3>` : ''}<canvas id="${chartId}" height="${props.height || '300'}"></canvas></div>`;
      }

      case 'video':
        return `<video class="snap-video" src="${props.src || ''}" controls${styleAttr}></video>`;

      case 'embed':
        return `<iframe class="snap-embed" src="${props.src || ''}" frameborder="0"${styleAttr}></iframe>`;

      default:
        return `<div${styleAttr}>${content || ''}${childHtml}</div>`;
    }
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
      const total = values.reduce((a,b)=>a+b,0);
      let angle = -Math.PI/2;
      const cx=W/2, cy=H/2, r=Math.min(cx,cy)-40;
      values.forEach((v,i)=>{
        const slice = (v/total)*Math.PI*2;
        ctx.beginPath(); ctx.moveTo(cx,cy);
        ctx.arc(cx,cy,r,angle,angle+slice);
        ctx.fillStyle=colors[i%colors.length]; ctx.fill();
        const mid=angle+slice/2;
        ctx.fillStyle='#1e293b'; ctx.fillText(labels[i],cx+Math.cos(mid)*(r+20),cy+Math.sin(mid)*(r+20));
        angle+=slice;
      });
      ` : type === 'line' ? `
      const pad={t:20,r:20,b:40,l:50};
      const gW=W-pad.l-pad.r, gH=H-pad.t-pad.b;
      ctx.strokeStyle='#e2e8f0'; ctx.lineWidth=1;
      for(let i=0;i<=4;i++){
        const y=pad.t+gH*(1-i/4);
        ctx.beginPath();ctx.moveTo(pad.l,y);ctx.lineTo(W-pad.r,y);ctx.stroke();
        ctx.fillStyle='#94a3b8';ctx.fillText(Math.round(max*i/4),5,y+4);
      }
      ctx.beginPath(); ctx.strokeStyle=colors[0]; ctx.lineWidth=3;
      values.forEach((v,i)=>{
        const x=pad.l+i*(gW/(values.length-1||1));
        const y=pad.t+gH*(1-v/max);
        i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);
        ctx.fillStyle='#64748b';ctx.fillText(labels[i]||'',x-10,H-10);
      });
      ctx.stroke();
      values.forEach((v,i)=>{
        const x=pad.l+i*(gW/(values.length-1||1));
        const y=pad.t+gH*(1-v/max);
        ctx.beginPath();ctx.arc(x,y,5,0,Math.PI*2);ctx.fillStyle=colors[0];ctx.fill();
        ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(x,y,2,0,Math.PI*2);ctx.fill();
      });
      ` : `
      const pad={t:20,r:20,b:40,l:50};
      const gW=W-pad.l-pad.r, gH=H-pad.t-pad.b;
      const bW=Math.min(60, gW/values.length*0.7);
      ctx.strokeStyle='#e2e8f0'; ctx.lineWidth=1;
      for(let i=0;i<=4;i++){
        const y=pad.t+gH*(1-i/4);
        ctx.beginPath();ctx.moveTo(pad.l,y);ctx.lineTo(W-pad.r,y);ctx.stroke();
        ctx.fillStyle='#94a3b8';ctx.fillText(Math.round(max*i/4),5,y+4);
      }
      values.forEach((v,i)=>{
        const x=pad.l+(i+0.5)*(gW/values.length)-bW/2;
        const h=gH*(v/max);
        const y=pad.t+gH-h;
        ctx.fillStyle=colors[i%colors.length];
        ctx.beginPath();
        ctx.roundRect?ctx.roundRect(x,y,bW,h,4):ctx.fillRect(x,y,bW,h);
        ctx.fill();
        ctx.fillStyle='#64748b';ctx.fillText(labels[i]||'',x,H-10);
      });
      `}
    })();
    `;
  }

  const body = renderNode(ast);

  const componentStyles = `
.snap-page { max-width: 1200px; margin: 0 auto; padding: 2rem; }
.snap-layout { min-height: 100vh; display: flex; flex-direction: column; }

.snap-nav { background: white; border-bottom: 1px solid var(--border); position: sticky; top: 0; z-index: 100; backdrop-filter: blur(10px); }
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
h1.snap-heading { font-size: 2.5rem; }
h2.snap-heading { font-size: 2rem; }
h3.snap-heading { font-size: 1.5rem; }

.snap-text { color: var(--text-light); line-height: 1.7; margin-bottom: 1rem; max-width: 65ch; }

.snap-card { background: white; border-radius: var(--radius); padding: 1.5rem; box-shadow: var(--shadow); transition: box-shadow 0.2s, transform 0.2s; }
.snap-card:hover { box-shadow: var(--shadow-lg); transform: translateY(-2px); }
.snap-card-title { font-size: 1.125rem; font-weight: 600; margin-bottom: 0.5rem; }

.snap-grid { display: grid; grid-template-columns: repeat(var(--cols, 3), 1fr); gap: var(--gap, 1.5rem); }
@media (max-width: 768px) { .snap-grid { grid-template-columns: 1fr; } }
@media (min-width: 769px) and (max-width: 1024px) { .snap-grid { grid-template-columns: repeat(min(var(--cols, 3), 2), 1fr); } }

.snap-row { display: flex; gap: 1rem; align-items: center; flex-wrap: wrap; }
.snap-column { flex: 1; min-width: 0; }

.snap-btn { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.625rem 1.5rem; background: var(--primary); color: white; border: none; border-radius: var(--radius); font-weight: 600; font-size: 0.9375rem; cursor: pointer; transition: all 0.2s; text-decoration: none; font-family: var(--font); }
.snap-btn:hover { opacity: 0.9; transform: translateY(-1px); text-decoration: none; }
.snap-btn-secondary { background: var(--secondary); }
.snap-btn-accent { background: var(--accent); }
.snap-btn-danger { background: var(--danger); }

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
.snap-stat-trend.up { color: var(--success); }
.snap-stat-trend.down { color: var(--danger); }

.snap-badge { display: inline-flex; padding: 0.25rem 0.75rem; border-radius: 999px; font-size: 0.75rem; font-weight: 600; background: var(--bg-light); color: var(--text-light); }
.snap-divider { border: none; border-top: 1px solid var(--border); margin: 1.5rem 0; }
.snap-spacer { }

.snap-footer { padding: 2rem; text-align: center; color: var(--text-light); font-size: 0.875rem; border-top: 1px solid var(--border); margin-top: auto; }

.snap-list { list-style: none; display: flex; flex-direction: column; gap: 0.5rem; }
.snap-item { padding: 0.5rem 0; }
.snap-item::before { content: '→ '; color: var(--primary); font-weight: 600; }

.snap-quote { border-left: 4px solid var(--primary); padding: 1rem 1.5rem; background: var(--bg-light); border-radius: 0 var(--radius) var(--radius) 0; font-style: italic; color: var(--text-light); }

.snap-code { background: var(--dark); color: #e2e8f0; padding: 1.5rem; border-radius: var(--radius); overflow-x: auto; font-family: var(--font-mono); font-size: 0.875rem; line-height: 1.6; }

.snap-chart { padding: 1rem 0; }
.snap-chart h3 { margin-bottom: 1rem; }
.snap-chart canvas { width: 100%; }

.snap-image { border-radius: var(--radius); }
.snap-video { width: 100%; border-radius: var(--radius); }
.snap-embed { width: 100%; min-height: 400px; border-radius: var(--radius); }

.snap-link { color: var(--primary); font-weight: 500; }
`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)}</title>
  ${description ? `<meta name="description" content="${escapeHtml(description)}">` : ''}
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>${DEFAULT_THEME}${componentStyles}${styles}</style>
</head>
<body>
${body}
${scripts ? `<script>${scripts}</script>` : ''}
</body>
</html>`;

  return html;
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
