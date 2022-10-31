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
    const nav = theme.value.nav as { text: string, link: string }[]

    dirTitle.value = nav.find(val => val.link == path)?.text!

    articles.value.push(...theme.value.sidebar[path][0]['items'])
})

onUnmounted(() => {
    window.removeEventListener('scroll', onScrollToBottom)
})


</script>

<template>
    <div id="custom-container" class="container">
        <div class="title">
            {{ dirTitle }}
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

    .preview-time {
        display: flex;
        justify-content: space-between;
    }

    border: 1px dashed var(--vp-c-brand-light);
    transition: border-color 0.25s;
    
    &:hover {
        border-color: var(--vp-c-brand-darker);
    }
}
</style>