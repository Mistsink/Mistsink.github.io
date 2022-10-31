<script setup lang="ts">
import { log } from 'console';
import { useData, useRoute, useRouter } from 'vitepress';
import { ref, onBeforeMount, onUnmounted, computed } from 'vue'
import { useScrollToBottom } from './utils'

const PageDisplayNum = 10

interface Article {
    text: string
    link: string
    archive: string
    createTime?: string
    preview?: string
}

const articles = ref<Article[]>([])
const pageIdx = ref(1)

const viewedArticles = computed(() => articles.value.slice(0, PageDisplayNum * pageIdx.value))
const onScrollToBottom = useScrollToBottom(() => {
    pageIdx.value++
})
onBeforeMount(() => {
    window.addEventListener('scroll', onScrollToBottom);


    const { theme } = useData()
    const sidebar: object = theme.value.sidebar

    for (const sideKey in sidebar) {
        console.log(sidebar[sideKey])
        articles.value.push(...sidebar[sideKey][0]['items'].map(val => {
            return {
                ...val,
                archive: sidebar[sideKey][0]['text']
            }
        }))
    }
    articles.value = articles.value.sort((a, b) => a.createTime! > b.createTime! ? -1 : 1)
})

onUnmounted(() => {
    window.removeEventListener('scroll', onScrollToBottom)
})


</script>

<template>
    <div id="custom-container" class="container">
        <div class="title">
            山野
        </div>
        <a class="article pager-link" v-for="article, i in viewedArticles" :key="i" :href="article.link">
            <div class="header">
                <p>{{ article.text }}</p>
                <div class="tag">
                    #{{article.archive}}
                </div>
            </div>
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
    $font-size: 6vw;
    font-size: $font-size;
    line-height: $font-size;
    margin: 6vw 0 4vw;
}

.article {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;

    width: 40vw;
    height: 5vw;
    margin: 0.5vw 0;
    border-radius: 0.8vw;

    padding: 0 0.8vw;

    font-size: 1.1vw;

    p {
        font-size: 1.6vw;
        line-height: 1.6vw;
        // margin: 0.3vw 0 0vw;
    }

    .header {
        display: flex;
        justify-content: space-between;
    }
    .preview-time {
        display: flex;
        justify-content: space-between;
    }

    border: 1px dashed var(--vp-c-brand);
    transition: border-color 0.25s;

    &:hover {
        border-color: var(--vp-c-brand-lighter);
    }
}
</style>