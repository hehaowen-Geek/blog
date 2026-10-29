<script setup lang="ts">
import type { Repo } from '@giscus/vue'
import Giscus from '@giscus/vue'

const appConfig = useAppConfig()
const route = useRoute()
const colorMode = useColorMode()
const repo = appConfig.giscus.repo as Repo
const configured = computed(() => !!(appConfig.giscus.repo && appConfig.giscus.repoId && appConfig.giscus.categoryId))
const theme = computed(() => colorMode.value === 'dark' ? 'dark' : 'light')
</script>

<template>
<section id="comments" class="z-comment">
	<h3 class="text-creative">
		评论区
	</h3>
	<p v-if="!configured" class="comment-notice">
		评论暂未开放。
	</p>
	<template v-else>
		<p class="comment-notice">
			使用 GitHub 账号登录后即可评论。
		</p>
		<ClientOnly>
			<Giscus
				:key="route.path"
				:repo
				:repo-id="appConfig.giscus.repoId"
				:category="appConfig.giscus.category"
				:category-id="appConfig.giscus.categoryId"
				mapping="specific"
				:term="route.path"
				strict="1"
				reactions-enabled="1"
				emit-metadata="0"
				input-position="top"
				:theme
				lang="zh-CN"
				loading="lazy"
			/>
			<template #fallback>
				<p class="comment-notice">
					评论加载中…
				</p>
			</template>
		</ClientOnly>
	</template>
</section>
</template>

<style lang="scss" scoped>
.z-comment {
	margin: 3rem 1rem;
	scroll-margin-top: 5rem;

	> h3 {
		margin-top: 3rem;
		font-size: 1.25rem;
	}
}

.comment-notice {
	margin: 1rem 0;
	font-size: 0.9em;
	color: var(--c-text-3);
}
</style>
