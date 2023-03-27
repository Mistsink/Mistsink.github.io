import { navDirStates, sidebarState } from './index'

import { defineConfig } from 'vitepress'

export default defineConfig({
	head: [],
	title: '山野沉雾',
	description: 'Mistsink',
	lastUpdated: true,
	base: '/',
	lang: 'zh-CN',
	cleanUrls: true,
	outDir: './dist',

	themeConfig: {
		// logo: "/pure-logo.svg",
		nav: navDirStates,
		sidebar: sidebarState,
		socialLinks: [{ icon: 'github', link: 'https://github.com/Mistsink' }],
		outline: {
			level: [1, 6],
			label: '回到顶部⬆️'
		},
		docFooter: {
			prev: '上一篇',
			next: '下一篇'
		},
		footer: {
			message: '', // Released under the MIT License.
			copyright: 'Copyright © 2022-present Mistsink'
		},
		lastUpdatedText: '最近更新时间',
		sidebarMenuLabel: '文章列表',
		returnToTopLabel: '回到顶部'

		// custom variables
	},
	markdown: {
		theme: {
			light: 'one-dark-pro',
			dark: 'one-dark-pro'
		},
		defaultHighlightLang: 'bash',
		config: md => {
			md.use(require('markdown-it-sub'))
			md.use(require('markdown-it-sup'))
			md.use(require('markdown-it-ins'))
			md.use(require('markdown-it-mark'))
			// md.use(require('markdown-it-katex'))
			md.use(require('markdown-it-texmath'), {
				engine: require('katex'),
				delimiters: 'dollars',
				katexOptions: { macros: { '\\RR': '\\mathbb{R}' } }
			})
			md.use(require('markdown-it-deflist'))
			md.use(require('markdown-it-footnote'))
			// md.use(require('markdown-it-img-lazy'))
			md.use(require('markdown-it-task-lists'))
			md.use(require('markdown-it-html5-media').html5Media, {
				messages: {
					en: {
						'html5 video not supported': '你的设备不支持播放该视频',
						'html5 audio not supported': '你的设备不支持播放该音频',
						'html5 media fallback link':
							'<a href="%s" download>下载该文件</a>',
						'html5 media description': '%s'
					}
				}
			})
		}
	}
})
