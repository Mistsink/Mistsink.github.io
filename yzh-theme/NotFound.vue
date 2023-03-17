<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { withBase, useData } from 'vitepress'
import CHomeContent from './components/CHomeContent.vue'
import { useLangs } from './composables/langs.js'

const { site, theme } = useData()
const { localeLinks } = useLangs({ removeCurrent: false })

const root = ref('/')
let RealNotFound = ref(true)

onMounted(() => {
  const path = window.location.pathname
    .replace(site.value.base, '')
    .replace(/(^.*?\/).*$/, '/$1')
  if (localeLinks.value.length) {
    root.value =
      localeLinks.value.find(({ link }) => link.startsWith(path))?.link ||
      localeLinks.value[0].link
  }

  if (path === '' || theme.value.nav.findIndex(({link}) => link === path) != -1) {
    RealNotFound.value = false
  }
})
</script>

<template>
  <div class="NotFound" v-if="RealNotFound">
    <p class="code">404</p>
    <h1 class="title">PAGE NOT FOUND</h1>
    <div class="divider" />
    <blockquote class="quote">
      But if you don't change your direction, and if you keep looking, you may end up where you are heading.
    </blockquote>

    <div class="action">
      <a class="link" :href="withBase(root)" aria-label="go to home">
        Take me home
      </a>
    </div>
  </div>
  <CHomeContent v-else />
</template>

<style scoped>
.NotFound {
  padding: 64px 24px 96px;
  text-align: center;
}

@media (min-width: 768px) {
  .NotFound {
    padding: 96px 32px 168px;
  }
}

.code {
  line-height: 64px;
  font-size: 64px;
  font-weight: 600;
}

.title {
  padding-top: 12px;
  letter-spacing: 2px;
  line-height: 20px;
  font-size: 20px;
  font-weight: 700;
}

.divider {
  margin: 24px auto 18px;
  width: 64px;
  height: 1px;
  background-color: var(--vp-c-divider);
}

.quote {
  margin: 0 auto;
  max-width: 256px;
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-text-2);
}

.action {
  padding-top: 20px;
}

.link {
  display: inline-block;
  border: 1px solid var(--vp-c-brand);
  border-radius: 16px;
  padding: 3px 16px;
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-brand);
  transition: border-color 0.25s, color 0.25s;
}

.link:hover {
  border-color: var(--vp-c-brand-dark);
  color: var(--vp-c-brand-dark);
}
</style>
