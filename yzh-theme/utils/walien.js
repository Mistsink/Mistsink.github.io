import { computed } from 'vue'
import { pageviewCount } from '@waline/client/pageview'
import { useRoute } from 'vitepress'

export const WalineServerURL =
	'https://blog-comments-bl3xaqviu-piedmontmist.vercel.app/'
export const WalinePath = computed(() => useRoute().path)

export const usePageviewCount = () => {
	const route = useRoute()
	if (
		!route.data.frontmatter.value?.layout ||
		route.data.frontmatter.value.layout === 'doc'
	) {
		pageviewCount({
			serverURL: WalineServerURL,
			path: WalinePath.value
		})
	}
}
