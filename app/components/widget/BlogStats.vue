<script setup lang="ts">
import { UtilDate } from '#components'

const appConfig = useAppConfig()
const runtimeConfig = useRuntimeConfig()

// 响应头不正确时，stats.value 可能会是字符串，首次属性访问可能为 undefined
const { data: stats } = useFetch('/api/stats')

// 不蒜子统计数据（响应式，初始为 null 表示加载中）
const sitePv = ref<string | null>(null)
const siteUv = ref<string | null>(null)

// 加载中时显示旋转图标，加载完成后显示数字
const busuanziLoading = computed(() => sitePv.value === null || siteUv.value === null)

// 组件挂载后加载不蒜子脚本，并通过轮询同步数据到响应式变量
if (import.meta.client) {
	onMounted(() => {
		// 动态加载不蒜子脚本（官方最新 CDN）
		const script = document.createElement('script')
		script.src = 'https://cdn.busuanzi.cc/busuanzi/3.6.9/busuanzi.min.js'
		script.defer = true
		document.head.appendChild(script)

		// 不蒜子通过 innerHTML 更新隐藏 span，轮询同步到响应式变量
		const pvEl = document.getElementById('busuanzi_site_pv') as HTMLSpanElement | null
		const uvEl = document.getElementById('busuanzi_site_uv') as HTMLSpanElement | null
		const timer = setInterval(() => {
			const pv = pvEl?.innerText
			const uv = uvEl?.innerText
			if (pv) {
				sitePv.value = pv
			}
			if (uv) {
				siteUv.value = uv
			}
			if (pv && uv) {
				clearInterval(timer)
			}
		}, 1000)
	})
}

const yearlyTip = computed(() => Object
	.entries(stats.value?.annual || {})
	.reverse()
	.map(([year, item]) => `${year}年：${item.posts}篇，${formatNumber(item.words)}字`)
	.join('\n') || '数据获取失败',
)

const blogStats = computed(() => [{
	label: '总字数',
	value: formatNumber(stats.value?.total?.words) || '--',
	tip: yearlyTip.value,
}, {
	label: '总访客数',
	value: busuanziLoading.value
		? () => h('i', { class: 'fa fa-spinner fa-spin' })
		: siteUv.value,
	tip: '不蒜子统计',
}, {
	label: '总访问量',
	value: busuanziLoading.value
		? () => h('i', { class: 'fa fa-spinner fa-spin' })
		: sitePv.value,
	tip: '不蒜子统计',
}, {
	label: '运营时长',
	value: timeElapse(appConfig.timeEstablished),
	tip: `博客于${appConfig.timeEstablished}上线`,
}, {
	label: '上次更新',
	value: () => h(UtilDate, {
		date: runtimeConfig.public.buildTime,
		relative: true,
		tipPrefix: '构建于',
	}),
}])
</script>

<template>
<BlogWidget card title="博客统计">
	<ZDlGroup :items="blogStats" size="small" />
	<!-- 不蒜子隐藏标签：新版通过 innerHTML 自动填充这些 span -->
	<span id="busuanzi_site_pv" style="display:none" />
	<span id="busuanzi_site_uv" style="display:none" />
</BlogWidget>
</template>
