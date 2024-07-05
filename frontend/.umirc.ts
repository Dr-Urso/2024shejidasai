import { defineConfig } from "umi";

export default defineConfig({
  routes: [
    { path: "/", component: "index" },
    { path: "/docs", component: "docs" },
    { path: "/test", component: "test" },
    { path: "/login", component: "login" },
  ],
  proxy: {
    '/api': {
      'target': 'http://127.0.0.1:8000/',
      'changeOrigin': true,
      'pathRewrite': { '^/api' : '' },
    },
  },
  npmClient: "pnpm",
  tailwindcss: {},
  plugins: ["@umijs/plugins/dist/tailwindcss"],
});
