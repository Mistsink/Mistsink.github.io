import './styles/fonts.css'
import './styles/vars.css'
import './styles/base.css'
import './styles/utils.css'
import './styles/components/custom-block.css'
import './styles/components/vp-code.css'
import './styles/components/vp-code-group.css'
import './styles/components/vp-doc.css'
import './styles/components/vp-sponsor.css'
import '@waline/client/waline.css'
import '@waline/client/waline-meta.css'
import './styles/waline-vars.css'
import 'katex/dist/katex.min.css'
import 'markdown-it-texmath/css/texmath.css'

import Layout from './Layout.vue'
import NotFound from './NotFound.vue'
const theme = {
	Layout,
	NotFound,
	enhanceApp: ({ app, router, siteData }) => {
		// console.log('in enhanceApp')
		// // useSidebar()
		// console.log('router:', router.route)
		// console.log('out enhanceApp')
	}
}
export default theme
