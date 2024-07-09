import { defineConfig } from "umi";

export default defineConfig({
  routes: [
    {path:"/",
    component:"@/layouts/index",
        routes:[{ path: "/", component: "index" },
          { path: "/docs", component: "docs" },
          { path: "/test", component: "test" },
          { path: "/login", component: "login" },
          { path: "/register", component: "register"},]},

    {path:"/plat",
    component:"@/layouts/sidebar",
      routes:[{ path: "/plat/text", component: "text" },
        { path: "/plat/document", component: "document" },
        { path: "/plat/bbs", component: "bbs" },
        { path: "/plat/message", component: "messager"},],},

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
