# 🫰 Snap — The LLM-Native Web Framework

Build beautiful websites by **describing** them. No CSS, no config, no boilerplate.

```
layout
  nav "My App"
  hero "Welcome" bg-gradient
    text "Hello world"
    button "Get Started"
  footer "Made with Snap"
```

That's a complete, responsive, professionally-styled website. **~30 tokens.**

## Why Snap?

| | Snap | Next.js | HTML/CSS |
|---|---|---|---|
| Tokens for a landing page | ~100 | ~500+ | ~800+ |
| CSS required | ❌ | ✅ | ✅ |
| Config files | 0 | 3-5 | 0 |
| Responsive by default | ✅ | ❌ | ❌ |
| Professional styling | ✅ built-in | manual | manual |
| LLM can generate | ✅ trivially | ⚠️ with errors | ⚠️ verbose |

**LLMs waste tokens on boilerplate.** Snap eliminates it.

## Getting Started

```bash
# Create a new project
node cli.js init my-site

# Start dev server
cd my-site
node /path/to/snap/cli.js dev

# Build for production
node /path/to/snap/cli.js build
```

Or just create an `index.snap` file and run `node cli.js dev` in that directory.

## Syntax Reference

### Page Meta

```
@title My Page Title
@description SEO description
@theme dark
```

### Components

#### Layout & Structure
```
layout              — Full page wrapper (flex column, min-height 100vh)
section "Title"     — Content section with max-width
row                 — Horizontal flex container
column              — Flex column
grid cols=3         — Responsive grid (auto-collapses on mobile)
spacer              — Vertical space
divider             — Horizontal line
```

#### Navigation
```
nav "Brand Name"    — Sticky top nav
  link "Label" href=/path
  button "CTA" href=/signup
```

#### Hero
```
hero "Big Title" bg-gradient
  text "Subtitle"
  button "CTA"
```

#### Content
```
heading "Title" level=2
text "Paragraph content" muted
quote "Blockquote text"
code "code snippet here"
list
  item "First item"
  item "Second item"
```

#### Cards & Data
```
card "Card Title"
  text "Card content"
  badge "Tag"

stat "Label" value="$1,234" trend="+5%"

table headers="Name,Email,Role"
```

#### Charts (canvas-based, no dependencies)
```
chart "Title" type=bar labels="A,B,C" values="10,20,30"
chart "Title" type=line labels="Jan,Feb,Mar" values="100,200,150"
chart "Title" type=pie labels="X,Y,Z" values="40,35,25"
```

#### Forms
```
form "Contact Us"
  input "Name"
  input "Email" type=email
  input "Message" type=textarea
  button "Send"
```

#### Media
```
image src="/photo.jpg" alt="Description"
video src="/clip.mp4"
link "Click here" href=https://example.com
button "Action" href=/path
```

### Style Keywords

No CSS needed. Just add keywords after your component:

#### Colors
`primary` `secondary` `accent` `muted` `danger` `success` `warning` `dark` `light` `white`

#### Backgrounds
`bg-primary` `bg-secondary` `bg-accent` `bg-dark` `bg-light` `bg-white` `bg-muted` `bg-gradient`

#### Sizing
`small` `large` `xl` `xxl` `huge` `full` `half` `third`

#### Spacing
`tight` `cozy` `spacious` `roomy`

#### Layout
`center` `left` `right` `inline` `stack` `row` `wrap`

#### Effects
`rounded` `pill` `shadow` `shadow-lg` `border` `bold` `italic` `uppercase` `underline` `clickable` `truncate`

### Nesting

Indent with 2 spaces to nest components:

```
grid cols=2
  card "Left"
    text "Content"
  card "Right"
    text "Content"
```

## Examples

### Dashboard (~40 lines, ~150 tokens)

```
@title Dashboard

layout
  nav "Dashboard"
    link "Overview" href=/
    link "Settings" href=/settings

  section "Overview"
    grid cols=4
      card
        stat "Revenue" value="$48k" trend="+12%"
      card
        stat "Users" value="2.8k" trend="+8%"
      card
        stat "Orders" value="1024"
      card
        stat "Rate" value="3.6%"

    grid cols=2
      card "Revenue"
        chart type=line labels="Jan,Feb,Mar,Apr" values="12,19,15,28"
      card "Categories"
        chart type=pie labels="A,B,C" values="45,28,18"

  footer "© 2026"
```

### Landing Page (~25 lines, ~100 tokens)

```
@title My SaaS

layout
  nav "Acme"
    link "Features" href=#f
    button "Sign Up" href=/signup

  hero "Ship 10x faster" bg-gradient
    text "The modern platform for building products."
    button "Start Free"

  section "Features"
    grid cols=3
      card "⚡ Fast"
        text "Deploy in seconds."
      card "🔒 Secure"
        text "Enterprise-grade security."
      card "📊 Analytics"
        text "Built-in insights."

  footer "© 2026 Acme"
```

## Architecture

```
.snap file → Parser (AST) → Compiler (HTML+CSS+JS) → Browser
```

- **Parser**: Line-by-line, indent-based. No complex grammar needed.
- **Compiler**: AST → semantic HTML with scoped CSS classes.
- **Server**: Zero-config dev server with SSE hot reload.
- **Build**: Outputs static HTML files. Single-file, no dependencies.

## CLI Commands

| Command | Description |
|---|---|
| `snap init [name]` | Create new project with starter files |
| `snap dev [port]` | Dev server with hot reload (default: 3000) |
| `snap build [dir]` | Build to static HTML (default: dist/) |
| `snap serve [dir]` | Serve built files |

## Design Philosophy

1. **Describe, don't code** — If you can explain it, you can build it
2. **Convention over configuration** — Zero config files, sensible defaults
3. **Beautiful by default** — Professional design without any styling
4. **LLM-native** — Optimized for AI generation (minimal tokens, no ambiguity)
5. **Single-file pages** — One `.snap` file = one complete page

## License

MIT
