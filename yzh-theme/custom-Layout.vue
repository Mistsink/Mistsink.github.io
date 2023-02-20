<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import { useData } from 'vitepress'

const { Layout, NotFound } = DefaultTheme

</script>
<template>
  <div class="circle">
      circle box
  </div>
  <Layout id="layout" />
  <!-- <Content /> -->
</template>

<style scoped>
  /**
    component Nav
  */
  #layout:deep(.VPNavBar.has-sidebar .container .content) {
    background: none;
    backdrop-filter: saturate(100%) blur(10px);
    -webkit-backdrop-filter: saturate(100%) blur(10px);
  }
  #layout:deep(.VPNav.no-sidebar) {
    background: none;
    backdrop-filter: saturate(100%) blur(10px);
    -webkit-backdrop-filter: saturate(100%) blur(10px);
    border-bottom: 0.7px solid var(--vp-c-divider);
  }
  #layout:deep(.VPNavBarTitle.has-sidebar) {
    /* background-image: url('./images/background.png'); */
  }

  #layout:deep(.VPLocalNav) {
    background: none;
    background-image: url('./images/background.png');
  }
  #layout:deep(.VPNavBarTitle .title) {
    font-size: 1.2em;
    width: 20vw;
  }
  #layout:deep(.VPNavBarTitle .title .logo) {
    height: 1.2em;
  }

  #layout:deep(.VPNavBarMenuLink) {
    font-size: 1.2em;
  }
 #layout:deep(.VPNav .VPSocialLink>svg) {
    width: 25px;
    height: 25px;
  }
  

  /**
    component sideBar
  */
  #layout:deep(.VPSidebar) {
    display: none;
    /* background-image: url('./images/background.png'); */
  }
  #layout:deep(.VPSidebar .title-text) {
    font-size: 1.2em;
  }
  #layout:deep(.VPSidebar .VPLink .link-text) {
    font-size: 0.9em;
  }

  /**
    component docContent
  */
  #layout:deep(.header-anchor) {
    color: var(--vp-c-yzh-reed);
  }
  #layout:deep(.header-anchor):hover {
    color: var(--vp-c-brand);
  }

  /**
    component outline
  */
  #layout:deep(.outline-title) {
    font-size: 1.5em;
    line-height: 1.5em;
  }
  #layout:deep(.outline-link) {
    font-size: 1.2em;
    line-height: 1.2em;
    margin: 0.5vw 0;
  }










  /**
    component footer
  */
  #layout:deep(.pager-link .desc) {
    font-size: 0.85em;
    margin-bottom: 0.3em;
  }

  #layout:deep(.pager-link .title) {
    font-size: 0.95em;
    line-height: 0.95em;
    color: var(--vp-c-text-light-1);
  }
</style>
