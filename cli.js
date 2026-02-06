#!/usr/bin/env node
// Snap CLI
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const command = args[0];
const cwd = process.cwd();

const INIT_FILES = {
  'index.snap': `@title My Snap App
@description Built with Snap 🫰

layout
  nav "My App"
    link "Home" href=/
    link "About" href=/about

  hero "Welcome to Snap 🫰" bg-gradient
    text "Build beautiful websites with minimal syntax. No CSS required."
    button "Get Started" href=/docs

  section "Features"
    grid cols=3
      card "Lightning Fast"
        text "Zero config, instant results. Just describe your page."
      card "LLM Native"
        text "Designed for AI. Generate full pages in ~100 tokens."
      card "Beautiful Defaults"
        text "Professional design out of the box. No styling needed."

  footer "Built with Snap 🫰"
`,
  'about.snap': `@title About

layout
  nav "My App"
    link "Home" href=/
    link "About" href=/about

  section "About"
    text "This site was built with Snap — the LLM-native web framework."
    text "Describe your website, don't code it."

  footer "Built with Snap 🫰"
`,
};

async function main() {
  switch (command) {
    case 'init': {
      const name = args[1] || 'my-snap-app';
      const dir = path.join(cwd, name);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      for (const [file, content] of Object.entries(INIT_FILES)) {
        fs.writeFileSync(path.join(dir, file), content);
      }
      console.log(`\n  🫰 Created Snap project in ./${name}\n`);
      console.log(`  cd ${name} && snap dev\n`);
      break;
    }

    case 'dev': {
      const port = parseInt(args[1]) || 3000;
      const { createDevServer } = await import('./src/server.js');
      createDevServer(cwd, port);
      break;
    }

    case 'build': {
      const outDir = path.join(cwd, args[1] || 'dist');
      const { buildProject } = await import('./src/server.js');
      const built = buildProject(cwd, outDir);
      console.log(`\n  🫰 Built ${built.length} page(s) to ${path.relative(cwd, outDir)}/\n`);
      built.forEach(f => console.log(`    → ${f}`));
      console.log();
      break;
    }

    case 'serve': {
      const dir = path.join(cwd, args[1] || 'dist');
      const port = parseInt(args[2]) || 3000;
      const { serveStatic } = await import('./src/server.js');
      serveStatic(dir, port);
      break;
    }

    default:
      console.log(`
  🫰 Snap — LLM-native web framework

  Usage:
    snap init [name]    Create a new Snap project
    snap dev [port]     Start dev server with hot reload
    snap build [dir]    Build for production
    snap serve [dir]    Serve built files

  Examples:
    snap init my-site
    snap dev 3000
    snap build
      `);
  }
}

main().catch(console.error);
