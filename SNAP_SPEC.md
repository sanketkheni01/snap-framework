# Snap DSL Specification v0.2

## Syntax Rules

- **Indentation**: 2 spaces for nesting. Children are indented under parents.
- **Comments**: Lines starting with `//` or `#` are ignored. Blank lines are ignored.
- **Meta directives**: Lines starting with `@` set page-level configuration.
- **Components**: `componentname "content" style-keywords prop=value animations`
- **Quoted strings**: First `"quoted string"` after component name = content. Props use `key=value` or `key="value with spaces"`.
- **Order**: Meta directives first, then component tree.

## Meta Directives

| Directive | Example | Purpose |
|---|---|---|
| `@title` | `@title My Page` | Page title + og:title |
| `@description` | `@description SEO text` | Meta description + og:description |
| `@theme` | `@theme dark` | Theme preset: `default`, `dark`, `ocean`, `sunset` |
| `@font` | `@font Poppins` | Google Font override |
| `@favicon` | `@favicon /icon.png` | Favicon |
| `@og-image` | `@og-image /preview.jpg` | Open Graph image |
| `@color-primary` | `@color-primary #ff6600` | Override any CSS variable |
| `@import` | `@import "shared/nav.snap"` | Include another .snap file |
| `@define`/`@end` | See below | Define reusable component |
| `@var-NAME` | `@var-appname "My App"` | Template variable (use `{appname}` in content) |
| `@data` | `@data url=/api/data.json` | Fetch JSON for data binding |

## Components

### Structure
| Component | Content | Props | Notes |
|---|---|---|---|
| `layout` | — | — | Full-page flex wrapper, always use as root |
| `page` | `"Title"` | — | Max-width container (alternative to layout) |
| `section` | `"Title"` | — | Content section with max-width, auto h2 title |
| `row` | — | — | Horizontal flex container |
| `column` | — | — | Flex child |
| `grid` | — | `cols=N` `gap=Xrem` | Responsive grid, collapses on mobile |
| `spacer` | — | `size=Xrem` | Vertical space (default 2rem) |
| `divider` | — | — | Horizontal line |

### Navigation & Hero
| Component | Content | Props | Notes |
|---|---|---|---|
| `nav` | `"Brand"` | — | Sticky top navbar. Children = nav links |
| `hero` | `"Headline"` | — | Large hero section. Add `bg-gradient` for gradient |
| `footer` | `"Text"` | — | Page footer, sticks to bottom in layout |

### Content
| Component | Content | Props | Notes |
|---|---|---|---|
| `heading` | `"Text"` | `level=1..6` | Heading (default h2) |
| `text` | `"Text"` | — | Paragraph |
| `quote` | `"Text"` | — | Blockquote with left border |
| `code` | `"code here"` | — | Monospace code block |
| `list` | — | — | Unordered list wrapper |
| `item` | `"Text"` | — | List item |
| `badge` | `"Label"` | — | Small pill badge |
| `icon` | `"Text"` | — | Icon placeholder |
| `avatar` | — | — | Avatar placeholder |

### Data Display
| Component | Content | Props | Notes |
|---|---|---|---|
| `card` | `"Title"` | — | Elevated card with hover effect |
| `stat` | `"Label"` | `value="X"` `trend="+X%"` | Metric display. Trend auto-colors green/red |
| `table` | — | `headers="A,B,C"` | Data table |
| `chart` | `"Title"` | `type=bar\|line\|pie` `labels="A,B"` `values="1,2"` `height=N` | Canvas chart, zero deps |
| `progress` | `"Label"` | `value=0..100` | Progress bar |

### Interactive
| Component | Content | Props | Notes |
|---|---|---|---|
| `tabs` | `"Tab1,Tab2,Tab3"` | — | Tab container. Each child = one tab panel |
| `accordion` | `"Header"` | — | Collapsible section. Children = body |
| `modal` | `"Button Label"` | — | Button that opens a modal. Children = modal body |
| `dropdown` | `"Label"` | — | Dropdown menu. Children = menu items |
| `toggle` | `"Label"` | — | Toggle switch |
| `counter` | — | `value=N` | +/- counter |
| `toast` | `"Message"` | `trigger="Button Text"` | Toast notification |
| `carousel` | — | — | Carousel. Each child = one slide |
| `countdown` | — | `to="2026-12-31"` | Live countdown timer |

### Marketing
| Component | Content | Props | Notes |
|---|---|---|---|
| `pricing` | `"Plan Name"` | `price="$X"` `period="/mo"` `features="A,B,C"` | Pricing card |
| `testimonial` | `"Quote text"` | `author="Name"` `role="Title"` `avatar="url"` | Testimonial card |
| `timeline` | — | — | Vertical timeline. Each child = timeline entry |
| `alert` | `"Message"` | `type=info\|success\|warning\|danger` | Alert box |

### Media & Links
| Component | Content | Props | Notes |
|---|---|---|---|
| `image` | — | `src="url"` `alt="text"` | Responsive image |
| `video` | — | `src="url"` | HTML5 video |
| `embed` | — | `src="url"` | Iframe embed |
| `link` | `"Label"` | `href=url` (or `to=url`) | Hyperlink |
| `button` | `"Label"` | `href=url` (or `to=url`) | Button. With href = link styled as button |

### Forms
| Component | Content | Props | Notes |
|---|---|---|---|
| `form` | `"Title"` | — | Form wrapper. Auto-adds submit button if none |
| `input` | `"Label"` | `type=text\|email\|password\|textarea` `name=x` `placeholder=x` | Form field with label |

### Reuse
| Component | Content | Props | Notes |
|---|---|---|---|
| `use` | `"ComponentName"` | — | Insert a `@define`d component |

## Style Keywords

Apply by adding after component name: `text "Hello" primary bold center`

**Colors** (text): `primary` `secondary` `accent` `muted` `danger` `success` `warning` `dark` `light` `white`

**Backgrounds**: `bg-primary` `bg-secondary` `bg-accent` `bg-dark` `bg-light` `bg-white` `bg-muted` `bg-gradient`

**Sizing**: `small` `large` `xl` `xxl` `huge` (font size) · `full` `half` `third` (width)

**Spacing** (padding): `tight` (0.5rem) `cozy` (1rem) `spacious` (2rem) `roomy` (3rem)

**Layout**: `center` `left` `right` `inline` `stack` `row` `wrap`

**Effects**: `rounded` `pill` `shadow` `shadow-lg` `border` `bold` `italic` `uppercase` `underline` `clickable` `no-wrap` `truncate`

**Visibility**: `hidden` `mobile-only` `desktop-only`

## Animations

Add after style keywords: `card "Title" shadow hover-lift fade-in`

**Enter**: `fade-in` `slide-up` `slide-left` `slide-right` `bounce` `pulse` `shake`

**Hover**: `hover-grow` `hover-glow` `hover-lift`

## Complete Examples

### 1. SaaS Landing Page

```
@title Acme — Ship Faster
@description The modern developer platform

layout
  nav "Acme"
    link "Features" href=#features
    link "Pricing" href=#pricing
    button "Sign Up" href=/signup

  hero "Ship products 10x faster" bg-gradient
    text "Eliminate boilerplate. Focus on what matters."
    row center
      button "Start Free" href=/signup
      button "See Demo" href=/demo secondary

  section "Features"
    grid cols=3
      card "⚡ Fast"
        text "Deploy in seconds, not hours."
      card "🔒 Secure"
        text "Enterprise-grade security baked in."
      card "📊 Analytics"
        text "Real-time insights without third-party tools."

  section "Pricing"
    grid cols=3
      pricing "Starter" price="Free" features="1k requests/day,1 member,Community support"
        button "Get Started"
      pricing "Pro" price="$29" features="Unlimited requests,10 members,Priority support"
        button "Start Trial"
      pricing "Enterprise" price="Custom" features="Everything in Pro,Unlimited team,24/7 support"
        button "Contact Sales" secondary

  footer "© 2026 Acme Inc."
```

### 2. Analytics Dashboard

```
@title Dashboard

layout
  nav "Analytics"
    link "Overview" href=/
    link "Reports" href=/reports
    link "Settings" href=/settings

  section "Overview"
    grid cols=4
      card
        stat "Revenue" value="$48,290" trend="+12.5%"
      card
        stat "Users" value="2,847" trend="+8.2%"
      card
        stat "Orders" value="1,024" trend="-2.4%"
      card
        stat "Conversion" value="3.6%" trend="+0.8%"

    grid cols=2
      card "Revenue Trend"
        chart type=line labels="Jan,Feb,Mar,Apr,May,Jun" values="12,19,15,22,28,48"
      card "Categories"
        chart type=pie labels="Electronics,Clothing,Food" values="45,28,18"

  footer "© 2026"
```

### 3. Blog

```
@title My Blog

layout
  nav "Blog"
    link "Home" href=/
    link "Archive" href=/archive
    link "About" href=/about

  section "Latest Posts"
    card "Why LLMs Need New Frameworks"
      badge "Featured"
      text "Traditional frameworks waste tokens on boilerplate." muted
      row
        text "Jan 15, 2026" small muted
        text "5 min read" small muted

    grid cols=2
      card "Convention Over Configuration"
        text "Zero-config is the future of web development." muted
        text "Jan 12, 2026" small muted
      card "The Token Economy"
        text "Optimizing for the LLM era." muted
        text "Jan 10, 2026" small muted

  footer "© 2026 My Blog"
```

### 4. E-commerce Product Page

```
@title Shop

layout
  nav "Store"
    link "Products" href=/
    link "Categories" href=/categories
    link "Cart" href=/cart
    button "Sign In" href=/login

  section "Featured Products"
    grid cols=4
      card "Wireless Headphones"
        image src="/products/headphones.jpg" alt="Headphones"
        text "$79.99" bold large
        text "Premium sound quality" muted small
        button "Add to Cart" full
      card "Smart Watch"
        image src="/products/watch.jpg" alt="Watch"
        text "$199.99" bold large
        text "Track your fitness goals" muted small
        button "Add to Cart" full
      card "Laptop Stand"
        image src="/products/stand.jpg" alt="Stand"
        text "$49.99" bold large
        text "Ergonomic aluminum design" muted small
        button "Add to Cart" full
      card "USB-C Hub"
        image src="/products/hub.jpg" alt="Hub"
        text "$34.99" bold large
        text "7-in-1 connectivity" muted small
        button "Add to Cart" full

  footer "© 2026 Store"
```

### 5. Portfolio

```
@title Jane Doe — Designer
@theme ocean

layout
  nav "Jane Doe"
    link "Work" href=#work
    link "About" href=#about
    link "Contact" href=#contact

  hero "I design delightful digital experiences" bg-gradient
    text "Product designer with 8 years of experience."
    button "View My Work" href=#work

  section "Selected Work"
    grid cols=2
      card "Fintech App Redesign"
        text "Increased conversion by 40% with a streamlined onboarding flow." muted
      card "E-commerce Platform"
        text "Designed a scalable design system for 200+ components." muted
      card "Health Dashboard"
        text "Made complex health data accessible and actionable." muted
      card "Brand Identity"
        text "Complete rebrand for a Series B startup." muted

  section "What Clients Say"
    grid cols=2
      testimonial "Jane transformed our product. Users love the new design." author="Alex Kim" role="CEO, Fintech Co"
      testimonial "Incredibly talented and a pleasure to work with." author="Sarah Lee" role="PM, Health App"

  footer "© 2026 Jane Doe"
```

### 6. Documentation Page

```
@title Snap Docs

layout
  nav "Snap Docs"
    link "Getting Started" href=/docs/start
    link "Components" href=/docs/components
    link "API" href=/docs/api

  section "Getting Started"
    text "Snap is a declarative web framework optimized for LLM generation." muted
    heading "Installation" level=3
    code "npm install snap-framework"
    heading "Your First Page" level=3
    code "layout\n  nav \"My App\"\n  hero \"Hello World\" bg-gradient\n  footer \"Done\""

  section "FAQ"
    accordion "How does indentation work?"
      text "Use 2 spaces. Children are indented under their parent component."
    accordion "Can I use custom CSS?"
      text "Style keywords cover most cases. For advanced use, override CSS variables with @color-primary etc."
    accordion "Is it responsive?"
      text "Yes. Grids auto-collapse on mobile. All components are responsive by default."

  footer "© 2026 Snap"
```

## Patterns & Best Practices

1. **Always start with `layout`** — it gives you sticky nav + footer pinning + flex column
2. **Use `section` for content blocks** — auto max-width + padding + optional title
3. **`hero` with `bg-gradient`** — instant professional hero section
4. **`grid cols=N` + `card`** — the most common pattern for features, products, team, etc.
5. **`stat` inside `card`** — dashboard metrics pattern
6. **`row center`** — horizontal button group
7. **`nav` children** — `link` for navigation, `button` for CTA
8. **`text "..." muted`** — secondary/descriptive text
9. **`text "..." small muted`** — metadata (dates, read time)
10. **`badge`** — status labels, tags on cards

## What NOT to Do (Common LLM Mistakes)

1. **Don't use HTML tags** — No `<div>`, `<p>`, `<h1>`. Use Snap components.
2. **Don't write CSS** — Use style keywords. No `style="color: red"`.
3. **Don't forget indentation** — Children MUST be indented 2 spaces under parent.
4. **Don't put meta directives inside components** — `@title` goes at top of file only.
5. **Don't use `page` and `layout` together** — Pick one. `layout` for full pages, `page` for simple content.
6. **Don't nest `section` inside `section`** — Use `heading` for sub-sections within a section.
7. **Don't add commas in `grid cols`** — It's `cols=3` not `cols="3"` (quotes optional but no commas).
8. **Don't forget quotes around content with spaces** — `button "Sign Up"` not `button Sign Up`.
9. **Don't use unknown component names** — Only components listed above work. Anything else becomes plain text.
10. **Don't put text directly in `grid`** — Grid children should be `card` or other block components.
