import { computed, onMounted, onUnmounted, ref, watchEffect } from 'vue'
import { useMediaQuery } from '@vueuse/core'
import { useRoute, useData } from 'vitepress'
import { isActive } from '../support/utils.js'
import {
	hasActiveLink as containsActiveLink,
	getSidebar,
	getSidebarGroups
} from '../support/sidebar.js'

const IsRunInWindow = typeof window !== 'undefined'

export function useSidebar() {

	const route = useRoute()
	const { theme, frontmatter } = useData()
	const is960 = useMediaQuery('(min-width: 960px)')
	const isOpen = ref(false)
	const sidebar = computed(() => {
		const sidebarConfig = theme.value.sidebar
		const relativePath = route.data.relativePath
		return sidebarConfig ? getSidebar(sidebarConfig, relativePath) : []
	})
	const hasSidebar = computed(() => {
		// TODO: hasSidebar
		// console.log('sidebar js is960:', is960.value !== true)
		const ret =
			IsRunInWindow &&
			frontmatter.value.sidebar !== false &&
			sidebar.value.length > 0 &&
			frontmatter.value.layout !== 'home' &&
			is960.value !== true

		// console.log('IsRunInWindow:', IsRunInWindow)

		// console.log(
		// 	'🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟\nsidebar js hasSidebar',
		// 	ret,
		// 	'path:',
		// 	route.path,
		// 	'\nfrontmatter.value.sidebar:',
		// 	frontmatter.value.sidebar,
		// 	'\nsidebar.value.length:',
		// 	sidebar.value.length,
		// 	'frontmatter.value.layout:',
		// 	frontmatter.value.layout,
		// 	'\nis960.value:',
		// 	is960.value,
		// 	'\n🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟\n\n'
		// )
		return ret
	})
	const hasAside = computed(() => {
		if (frontmatter.value.layout === 'home') return false
		if (frontmatter.value.aside != null) return !!frontmatter.value.aside
		if (theme.value.aside === false) return false
		return true
	})
	const isSidebarEnabled = computed(() => hasSidebar.value && is960.value)
	const sidebarGroups = computed(() => {
		return hasSidebar.value ? getSidebarGroups(sidebar.value) : []
	})
	function open() {
		isOpen.value = true
	}
	function close() {
		isOpen.value = false
	}
	function toggle() {
		isOpen.value ? close() : open()
	}
	const ret = {
		is960,
		isOpen,
		sidebar,
		sidebarGroups,
		hasSidebar,
		hasAside,
		isSidebarEnabled,
		open,
		close,
		toggle
	}
	// console.log('sidebar ret:', ret)
	return ret
}
/**
 * a11y: cache the element that opened the Sidebar (the menu button) then
 * focus that button again when Menu is closed with Escape key.
 */
export function useCloseSidebarOnEscape(isOpen, close) {
	let triggerElement
	watchEffect(() => {
		triggerElement = isOpen.value ? document.activeElement : undefined
	})
	onMounted(() => {
		window.addEventListener('keyup', onEscape)
	})
	onUnmounted(() => {
		window.removeEventListener('keyup', onEscape)
	})
	function onEscape(e) {
		if (e.key === 'Escape' && isOpen.value) {
			close()
			triggerElement?.focus()
		}
	}
}
export function useSidebarControl(item) {
	const { page } = useData()
	const collapsed = ref(false)
	const collapsible = computed(() => {
		return item.value.collapsed != null
	})
	const isLink = computed(() => {
		return !!item.value.link
	})
	const isActiveLink = computed(() => {
		return isActive(page.value.relativePath, item.value.link)
	})
	const hasActiveLink = computed(() => {
		if (isActiveLink.value) {
			return true
		}
		return item.value.items
			? containsActiveLink(page.value.relativePath, item.value.items)
			: false
	})
	const hasChildren = computed(() => {
		return !!(item.value.items && item.value.items.length)
	})
	watchEffect(() => {
		collapsed.value = !!(collapsible.value && item.value.collapsed)
	})
	watchEffect(() => {
		;(isActiveLink.value || hasActiveLink.value) &&
			(collapsed.value = false)
	})
	function toggle() {
		if (collapsible.value) {
			collapsed.value = !collapsed.value
		}
	}
	return {
		collapsed,
		collapsible,
		isLink,
		isActiveLink,
		hasActiveLink,
		hasChildren,
		toggle
	}
}
