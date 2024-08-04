import { defineConfig } from "umi";

export default defineConfig({
    favicons :['/favicon.ico'],
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
       { path: "/plat/audio", component: "audio" },
       { path: "/plat/analyse", component: "analyse" },
          { path: "/plat/documentQA", component: "documentQA" },
       { path: "/plat/diary", component: "diary" },
          { path: "/plat/correct", component: "correct" },
       { path: "/plat/to_do_list", component: "to_do_list" },
          { path: "/plat/teaching_plan", component: "teaching_plan" },
          { path: "/plat/composition", component: "composition" },
       { path: "/plat/message", component: "messager"},
      { path: "/plat/image", component: "image"}],},
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
