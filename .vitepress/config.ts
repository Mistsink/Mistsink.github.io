import {navDirStates, sidebarState} from "./index";

import { defineConfig } from "vitepress";

export default defineConfig({
  title: "山野沉雾",
  description: "Mistsink",
  lastUpdated: true,
  base: "/",
  lang: 'zh-CN',
  cleanUrls: 'with-subfolders',
  outDir: './dist',
  

  themeConfig: {
    // logo: "/pure-logo.svg",
    nav: navDirStates,
    sidebar: sidebarState,
    socialLinks: [{ icon: "github", link: "https://github.com/Mistsink" }],
    outlineTitle: "当前文章",
    outline: [1, 6],
    docFooter: {
      prev: '上一篇',
      next: '下一篇'
    },
    footer: {
      message: '',  // Released under the MIT License.
      copyright: 'Copyright © 2022-present Mistsink'
    }
  },
});
