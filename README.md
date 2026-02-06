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

### Feature Comparison

| | Snap | HTML/CSS/JS | React/Next.js |
|---|---|---|---|
| Lines for a full showcase page | **221** | ~1,500+ | ~2,000+ |
| Source file size | **8 KB** | ~60 KB | ~80 KB+ |
| Tokens (LLM input) | **~800** | ~6,000+ | ~8,000+ |
| Files needed | **1** | 3+ | 10+ |
| Config files | **0** | 0 | 3-5 |
| Dependencies (node_modules) | **0** | 0 | 200+ |
| CSS required | ❌ | ✅ | ✅ |
| Responsive by default | ✅ | ❌ | ❌ |
| Professional styling | ✅ built-in | manual | manual |
| LLM can generate | ✅ trivially | ⚠️ verbose | ⚠️ error-prone |

### LLM Cost Comparison

Using Claude Sonnet (~$3/M input + $15/M output tokens):

| | Snap | HTML/CSS | React |
|--|------|----------|-------|
| Tokens to generate a page | **~1,000** | ~8,000 | ~12,000 |
| Cost per page | **$0.015** | $0.12 | $0.18 |
| 100 pages/day | **$1.50** | $12.00 | $18.00 |
| 1,000 pages/day | **$15** | $120 | $180 |

### Speed

| | Snap | HTML/CSS | React |
|--|------|----------|-------|
| LLM generation time | **~5 sec** | ~40 sec | ~60 sec |
| Build/compile time | **<100ms** | 0 | 10-30 sec |
| Total time to live site | **~5 sec** | ~40 sec | ~90 sec |

> **Snap is ~8-12x cheaper and ~8-12x faster for LLM-generated websites.**
>
> The showcase page has 40+ components, animations, charts, interactive elements — all from **221 lines, one file, zero config.**

## Getting Started

```bash
# Install globally
npm install -g snap-framework

# Create a new project
snap init my-site

# Start dev server
cd my-site && snap dev

# Build for production
snap build
```

## Syntax Reference

### Page Meta

```
@title My Page Title
@description SEO description
@theme dark
@font "Poppins"
@og-image https://example.com/image.png
@favicon /favicon.ico
```

### Template Variables

```
@var-name "World"
@var-count "42"

text "Hello {name}, you have {count} items"
```

### Data Binding

```
@data url=/api/data
text "Welcome {username}"
```

### Theming

Built-in themes: `default`, `dark`, `ocean`, `sunset`

```
@theme dark
```

Custom colors:

```
@theme custom
@color-primary #ff6600
@color-secondary #cc3300
@font "Poppins"
```

### Component Import & Reuse

```
@import "header.snap"

@define my-card
  card "Reusable Card"
    text "This is reusable"
@end

use "my-card"
use "my-card"
```

### Components

#### Layout & Structure
```
layout              — Full page wrapper
section "Title"     — Content section
row                 — Horizontal flex
column              — Flex column
grid cols=3         — Responsive grid
spacer              — Vertical space
divider             — Horizontal line
```

#### Navigation
```
nav "Brand Name"
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
text "Paragraph" muted
quote "Blockquote"
code "code snippet"
list
  item "First item"
  item "Second item"
```

#### Cards & Data
```
card "Title"
  text "Content"
  badge "Tag"

stat "Label" value="$1,234" trend="+5%"
table headers="Name,Email,Role"
```

#### Charts
```
chart "Revenue" type=bar labels="Q1,Q2,Q3" values="10,20,30"
chart "Growth" type=line labels="Jan,Feb,Mar" values="100,200,150"
chart "Split" type=pie labels="A,B,C" values="40,35,25"
```

#### Forms
```
form "Contact Us"
  input "Name"
  input "Email" type=email
  button "Send"
```

#### Media
```
image src="/photo.jpg" alt="Description"
video src="/clip.mp4"
embed src="https://youtube.com/..."
```

### Interactive Components

#### Tabs
```
tabs "Overview,Features,Pricing"
  text "Overview content here"
  text "Features content here"
  text "Pricing content here"
```

#### Accordion
```
accordion "Click to expand"
  text "Hidden content revealed on click"
```

#### Modal
```
modal "Open Dialog"
  heading "Modal Title" level=3
  text "Modal body content"
  button "Close"
```

#### Dropdown
```
dropdown "Select Option"
  link "Option 1" href=#
  link "Option 2" href=#
  link "Option 3" href=#
```

#### Toggle
```
toggle "Enable notifications"
```

#### Counter
```
counter value=0
```

#### Toast
```
toast "Item saved successfully!" trigger="Save Item"
```

### More Components

#### Carousel
```
carousel
  image src="/slide1.jpg"
  image src="/slide2.jpg"
  image src="/slide3.jpg"
```

#### Pricing Card
```
pricing "Pro Plan" price="$29" period="/mo" features="Unlimited projects,Priority support,API access"
  button "Get Started" href=/signup
```

#### Testimonial
```
testimonial "Amazing product, changed everything!" author="Jane Doe" role="CEO, Acme" avatar="/jane.jpg"
```

#### Timeline
```
timeline
  text "2024 — Company founded"
  text "2025 — Series A raised"
  text "2026 — Global launch"
```

#### Progress Bar
```
progress "Upload" value=75
```

#### Alert
```
alert "Action completed successfully" type=success
alert "Please review your input" type=warning
alert "Something went wrong" type=danger
```

#### Countdown
```
countdown to="2026-12-31"
```

### Animations

Add animation keywords to any component:

#### Entrance Animations
`fade-in` `slide-up` `slide-left` `slide-right`

#### Attention Animations
`bounce` `pulse` `shake`

#### Hover Effects
`hover-grow` `hover-glow` `hover-lift`

```
card "Feature" fade-in hover-lift
  text "Animated card"

hero "Welcome" slide-up
  button "CTA" pulse
```

### Style Keywords

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

## SEO & Build

Build generates:
- Static HTML files
- `sitemap.xml` — auto-generated from all pages
- `robots.txt` — search engine friendly defaults

Meta directives:
```
@title Page Title
@description Meta description for SEO
@og-image https://example.com/og.png
@favicon /favicon.ico
```

## CLI Commands

| Command | Description |
|---|---|
| `snap init [name]` | Create new project |
| `snap dev [port]` | Dev server with hot reload |
| `snap build [dir]` | Build static HTML + sitemap + robots.txt |
| `snap serve [dir]` | Serve built files |

## Examples

### Landing Page (~25 lines)

```
@title My SaaS
@theme default

layout
  nav "Acme"
    link "Features" href=#f
    button "Sign Up" href=/signup

  hero "Ship 10x faster" bg-gradient slide-up
    text "The modern platform for building products."
    button "Start Free" pulse

  section "Features"
    grid cols=3
      card "⚡ Fast" fade-in hover-lift
        text "Deploy in seconds."
      card "🔒 Secure" fade-in hover-lift
        text "Enterprise-grade security."
      card "📊 Analytics" fade-in hover-lift
        text "Built-in insights."

  section "Pricing"
    grid cols=3
      pricing "Free" price="$0" features="1 project,Community support"
        button "Start Free"
      pricing "Pro" price="$29" period="/mo" features="Unlimited projects,Priority support,API access"
        button "Get Started"
      pricing "Enterprise" price="Custom" features="Everything in Pro,SLA,Dedicated support"
        button "Contact Us"

  footer "© 2026 Acme"
```

### Dark Dashboard

```
@title Dashboard
@theme dark

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

    accordion "Revenue Details"
      chart type=line labels="Jan,Feb,Mar,Apr" values="12,19,15,28"

    accordion "Categories"
      chart type=pie labels="A,B,C" values="45,28,18"

  footer "© 2026"
```

## Architecture

```
.snap file → Parser (AST) → Compiler (HTML+CSS+JS) → Browser
```

- **Parser**: Line-by-line, indent-based. Supports imports, defines, variables.
- **Compiler**: AST → semantic HTML with themed CSS + vanilla JS interactivity.
- **Server**: Zero-config dev server with SSE hot reload.
- **Build**: Static HTML + sitemap.xml + robots.txt. Zero dependencies.

## License

MIT
