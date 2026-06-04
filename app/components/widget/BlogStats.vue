<script setup lang="ts">
import { UtilDate } from '#components'

const appConfig = useAppConfig()
const runtimeConfig = useRuntimeConfig()

// 响应头不正确时，stats.value 可能会是字符串，首次属性访问可能为 undefined
const { data: stats } = useFetch('/api/stats')

// 不蒜子统计数据（响应式，初始显示加载中）
const sitePv = ref<string>('...')
const siteUv = ref<string>('...')

// 注册不蒜子全局回调，更新响应式数据
if (import.meta.client) {
	;(globalThis as any).BusuanziCallback = (data: { site_pv: number, site_uv: number }) => {
		sitePv.value = formatNumber(data.site_pv)
		siteUv.value = formatNumber(data.site_uv)
	}

	// 组件挂载后加载不蒜子脚本，确保 DOM 已就绪
	onMounted(() => {
		const script = document.createElement('script')
		script.src = '//busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js'
		script.async = true
		document.head.appendChild(script)
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
	value: siteUv.value,
	tip: '不蒜子统计',
}, {
	label: '总访问量',
	value: sitePv.value,
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
</BlogWidget>
</template>
