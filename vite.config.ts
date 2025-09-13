import vercel from "vite-plugin-vercel";
import tailwindcss from "@tailwindcss/vite";
import vikeSolid from "vike-solid/vite";
import devServer from "@hono/vite-dev-server";
import vike from "vike/plugin";
import { defineConfig } from "vite";
import inject from "@rollup/plugin-inject";
import compileTime from "vite-plugin-compile-time";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
// Resolve to the ESM file on disk to bypass package exports

// Load Node stdlib browser shims and set up fs alias to our OPFS-backed shim
const { default: stdLibBrowser } = await import("node-stdlib-browser");
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ourFs = path.resolve(__dirname, "node/FS.ts");

export default defineConfig({
  resolve: {
    alias: {
      ...(stdLibBrowser as Record<string, string>),
      fs: ourFs,
      "node:fs": ourFs,
      "fs/promises": ourFs,
      "node:fs/promises": ourFs,
    },
  },

  optimizeDeps: {
    include: ["buffer", "process"],
    esbuildOptions: {
      // Ensure esbuild also injects the node stdlib shims during pre-bundling
      // inject: ['node-stdlib-browser/helpers/esbuild/shim']
    },
  },

  plugins: [
    vike(),
    devServer({
      entry: "hono-entry.ts",

      exclude: [
        /^\/@.+$/,
        /.*\.(ts|tsx|vue)($|\?)/,
        /.*\.(s?css|less)($|\?)/,
        /^\/favicon\.ico$/,
        /.*\.(svg|png)($|\?)/,
        /^\/(public|assets|static)\/.+/,
        /^\/node_modules\/.*/,
      ],

      injectClientScript: false,
    }),
    vikeSolid(),
    tailwindcss(),
    compileTime(),
    vercel(),
    // Inject Node globals for browser builds
    {
      ...inject({
        global: ["node-stdlib-browser/helpers/esbuild/shim", "global"],
        process: ["node-stdlib-browser/helpers/esbuild/shim", "process"],
        Buffer: ["node-stdlib-browser/helpers/esbuild/shim", "Buffer"],
      }),
      enforce: "post",
    },
  ],

  server: {
    headers: {
      "Cross-Origin-Opener-Policy": "same-origin",
      "Cross-Origin-Embedder-Policy": "require-corp",
    },
  },

  build: {
    target: "esnext",
    minify: false,
    rollupOptions: {
      output: {
        format: "esm",
        entryFileNames: "app.js",
      },
    },
  },

  vercel: {
    additionalEndpoints: [
      {
        // entry file to the server. Default export must be a node server or a function
        source: "hono-entry.ts",
        // replaces default Vike target
        destination: "ssr_",
        // already added by default Vike route
        route: false,
      },
    ],
  },
});
