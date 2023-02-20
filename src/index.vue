<script setup lang="ts">
import { useData, useRoute, useRouter } from 'vitepress';
import { ref, onBeforeMount, onUnmounted, computed } from 'vue'
import { useScrollToBottom } from './utils'

const PageDisplayNum = 10

interface Article {
    text: string
    link: string
    createTime?: string
    preview?: string
}

const articles = ref<Article[]>([])
const dirTitle = ref('')
const pageIdx = ref(1)

const viewedArticles = computed(() => articles.value.slice(0, PageDisplayNum * pageIdx.value))
const onScrollToBottom = useScrollToBottom(() => {
    pageIdx.value++
})
onBeforeMount(() => {
    window.addEventListener('scroll', onScrollToBottom);


    const { theme } = useData()
    const { path } = useRoute()

    // console.log('theme:',theme.value)
    // console.log('path:',path)

    //  首页
    if (path === '/') {
        const sidebar: object = theme.value.sidebar

        for (const sideKey in sidebar) {
            articles.value.push(...sidebar[sideKey][0]['items'].map(val => {
                return {
                    ...val,
                    archive: sidebar[sideKey][0]['text']
                }
            }))
        }
        articles.value = articles.value.sort((a, b) => a.createTime! > b.createTime! ? -1 : 1)
    } else {
        const nav = theme.value.nav as { text: string, link: string }[]

        dirTitle.value = nav.find(val => val.link == path)?.text!
        articles.value.push(...theme.value.sidebar[path][0]['items'])
    }
})


onUnmounted(() => {
    window.removeEventListener('scroll', onScrollToBottom)
})


</script>

<template>
    <div id="custom-container" class="container">
        <div class="title">
            {{ `${dirTitle}` || "山野沉雾" }}
        </div>
        <a class="article pager-link" v-for="article, i in viewedArticles" :key="i" :href="article.link">
            <p>{{ article.text }}</p>
            <div v-if="article.preview" class="preview-time">
                <div class="preview">
                    {{ article.preview }}
                </div>
                <div class="time">
                    {{ article.createTime }}
                </div>
            </div>
        </a>
    </div>
</template>

<style scoped lang="scss">
#custom-container {
    margin: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.title {
    $font-size: 32px;
    font-size: $font-size;
    line-height: $font-size;
    margin: 6vw 0 4vw;
}

@media (min-width: 768px) {
    .title {
        $font-size: 4vw;
        font-size: $font-size;
        line-height: $font-size;
        margin: 6vw 0 4vw;
    }
}

.article {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;

    width: 90%;
    height: 50px;
    margin: 6px 0;
    border-radius: 8px;

    padding: 0 5px;

    font-size: 12px;

    p {
        font-size: 15px;
        line-height: 15px;
        // margin: 0.3vw 0 0vw;
    }

    .preview-time {
        display: flex;
        justify-content: space-between;
    }

    border: 1px dashed var(--vp-c-border);
    transition: border-color 0.25s;

    &:hover {
        border-color: var(--vp-c-border-hover);
    }
}

@media (min-width: 768px) {
    .article {
        width: 45vw;
        height: 6vw;
        margin: 0.5vw 0;
        border-radius: 0.8vw;

        padding: 0 1.5vw;

        font-size: 1.2vw;

        p {
            font-size: 1.6vw;
            line-height: 1.6vw;
            // margin: 0.3vw 0 0vw;
        }
    }
}
</style>