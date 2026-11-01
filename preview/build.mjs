// Builds dist/athenaeum.html: the whole site as one self-contained page that
// can be opened from a link (no server, no install). Run: npm run build:preview
import { build } from "esbuild";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const shim = (f) => path.join(here, "shims", f);

const result = await build({
  entryPoints: [path.join(here, "main.tsx")],
  bundle: true,
  minify: true,
  write: false,
  format: "iife",
  target: "es2020",
  jsx: "automatic",
  tsconfig: path.join(root, "tsconfig.json"),
  alias: {
    "next/link": shim("next-link.tsx"),
    "next/navigation": shim("next-navigation.ts"),
    "react/jsx-runtime": shim("react-jsx-runtime.js"),
    react: shim("react.js"),
    "react-dom/client": shim("react-dom-client.js"),
  },
  define: { "process.env.NODE_ENV": '"production"' },
  logLevel: "error",
});

const js = result.outputFiles[0].text.replace(/<\/script/gi, "<\\/script");
const css = readFileSync(path.join(root, "src/app/globals.css"), "utf8");

const extraCss = `
:root {
  --font-newsreader: "Newsreader";
  --font-franklin: "Libre Franklin";
  --font-plex-mono: "IBM Plex Mono";
}
.site-header { top: env(safe-area-inset-top, 0px); }
body::before { content: ""; position: fixed; inset: 0 0 auto; height: env(safe-area-inset-top, 0px); z-index: 41; background: var(--bg-surface); }
@media (prefers-reduced-motion: reduce) { * { transition: none !important; scroll-behavior: auto !important; } }
`;

const html = `<title>Athenaeum</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,300..600;1,6..72,300..500&family=Libre+Franklin:wght@300..600&family=IBM+Plex+Mono:wght@400;500&display=swap">
<style>
${css}
${extraCss}
</style>
<div id="root"></div>
<script src="https://cdnjs.cloudflare.com/ajax/libs/react/18.3.1/umd/react.production.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.3.1/umd/react-dom.production.min.js"></script>
<script>
${js}
</script>
`;

mkdirSync(path.join(root, "dist"), { recursive: true });
writeFileSync(path.join(root, "dist", "athenaeum.html"), html);
console.log(`dist/athenaeum.html  ${(html.length / 1024).toFixed(0)} KB`);
