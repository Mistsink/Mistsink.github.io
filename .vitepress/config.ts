import {navDirStates, sidebarState} from "./index";

import { defineConfig } from "vitepress";

export default defineConfig({
  head: [

  ],
  title: "山野沉雾",
  description: "Mistsink",
  lastUpdated: true,
  base: "/",
  lang: 'zh-CN',
  cleanUrls: true,
  outDir: './dist',
  

  themeConfig: {
    // logo: "/pure-logo.svg",
    nav: navDirStates,
    sidebar: sidebarState,
    socialLinks: [{ icon: "github", link: "https://github.com/Mistsink" }],
    outline: {
      level: [1, 6],
      label: "回到顶部⬆️"
    },
    outlineBadges: true,
    docFooter: {
      prev: '上一篇',
      next: '下一篇'
    },
    footer: {
      message: '',  // Released under the MIT License.
      copyright: 'Copyright © 2022-present Mistsink'
    },
    lastUpdatedText: '最近更新时间',
    sidebarMenuLabel: "文章列表",
    returnToTopLabel: "回到顶部"


    // custom variables
  },
  markdown: {
    theme: {
      "light": "one-dark-pro",
      "dark": "one-dark-pro"
    },
    defaultHighlightLang: "bash"
  },
});

