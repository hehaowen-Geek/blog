<script setup lang="ts">
const { timeEstablished } = useAppConfig()

const blogLog = [
	{ label: '2026-07-02', value: '发布御网杯线下赛 WP 与 Claude Code 部署教程' },
	{ label: '2026-06-16', value: '发布硬件杂谈，分享个人设备' },
	{ label: '2026-06-09', value: '发布博客草稿功能教程与技能大赛赛题解析' },
	{ label: '2026-05-27', value: '发布第一篇技术文章——御网杯网络安全大赛 WP' },
	{ label: timeEstablished, value: '博客正式上线' },
]
</script>

<template>
<BlogWidget card title="更新日志">
	<ZDlGroup size="large" :items="blogLog" />
</BlogWidget>
</template>
