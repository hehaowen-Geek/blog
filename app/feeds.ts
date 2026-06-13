import type { FeedGroup } from '../app/types/feed'
// 友链检测 CLI 需要使用显式导入和相对路径
import { myFeed } from '../blog.config'
// eslint-disable-next-line unused-imports/no-unused-imports
import { getFavicon, getGithubAvatar, getGithubIcon, getOciqGroupAvatar, getOicqAvatar, OicqAvatarSize } from './utils/img'

export default [
	// #region Clarity
	{
		name: '欢迎光临',
		desc: '使用 Clarity 博客主题构建的网站。',
		// @keep-sorted { "keys": ["date"] }
		entries: [
			myFeed,
			{
				author: '翞~涵',
				sitenick: '杂记本',
				title: '想到什么写什么',
				desc: '一个什么都可能会写的博客',
				link: 'https://blog.han1130.top/',
				feed: 'https://blog.han1130.top/atom.xml',
				icon: 'https://img.han1130.top/img/touxiang.png',
				avatar: 'https://img.han1130.top/img/touxiang.png',
				archs: ['Nuxt', 'Netlify'],
				date: '2025-05-23',
				comment: '',
			},

		],
	},
	// #endregion
	// #region 网上邻居 since 2024
	{
		name: '好友',
		desc: '哔——啵——电波通讯中，欢迎常来串门。',
		// @keep-sorted { "keys": ["date"] }
		entries: [
			{
				author: 'Expl0rer.Ct',
				sitenick: '并非全栈',      // 可选
				title: 'Expl0rer.Ct',         // 可选
				desc: '吾将上下而求索',
				link: 'https://expl0rer.top/',
				icon: 'https://expl0rer.top/img/avatar_hu_186ba3d0d8bfb6a0.png',
				avatar: 'https://expl0rer.top/img/avatar_hu_186ba3d0d8bfb6a0.png',
				archs: ['CTF-PWN', '二进制漏洞利用'],  // 技术栈，如 Vue、Next.js、Hugo 等
				date: '2026-06-04',         // 添加友链的日期
				comment: '纯属是二进制安全领域的好奇',         // 可选，对你的备注
			},

			{
				author: '康可',
				sitenick: '康可ing',
				title: '康可ing',
				desc: 'conquer,conquer,conquer...',
				link: 'https://blog.yanxisishi.top/',
				icon: 'https://q1.qlogo.cn/g?b=qq&nk=3497863696&s=640',
				avatar: 'https://q1.qlogo.cn/g?b=qq&nk=3497863696&s=640',
				date: '2026-06-13',
				comment: '',
			},
			/* ========从此处新增友链======== */
		],
	},
	// #endregion
	// #region 网络空间安全技术协会
	{
		name: 'LFEVU-CSTA',
		desc: '网络空间安全技术协会的会友们',
		// @keep-sorted { "keys": ["date"] }
		entries: [


			{
				author: '郭雨博',
				sitenick: '你好世界',
				title: '想到什么写什么',
				desc: '一个什么都可能会写的博客',
				link: 'https://blog.guoyubo.cn/',
				feed: 'https://blog.guoyubo.cn',
				icon: 'https://cravatar.cn',
				avatar: 'https://blog.guoyubo.cn/avatar.jpg',
				archs: ['Nuxt', 'Netlify'],
				date: '2025-05-25',
				comment: '',
			},

		],
	},
	// #endregion
	// #region 知识分享
	{
		name: '知识分享',
		desc: '“AI时代”创作分享/知识内容收集。',
		// @keep-sorted { "keys": ["date"] }
		entries: [
			{
				author: '茂茂物语',
				desc: '茂茂的成长之路，包含前端常用知识、源码阅读笔记、各种奇淫技巧、日常提效工具等',
				link: 'https://notes.fe-mm.com/',
				icon: getGithubIcon('maomao1996'),
				avatar: getGithubAvatar('maomao1996'),
				archs: ['VitePress', 'Cloudflare'],
				date: '2024-02-17',
				comment: '前端开发笔记。',
			},

		],
	},
	// #endregion
	// #region 漫游
	{
		name: '漫游',
		desc: '网上冲浪时发现的精彩内容与常读订阅，与君共享。',
		// @keep-sorted { "keys": ["date"] }
		entries: [
			{
				author: '风记星辰',
				desc: '热爱你来过的每度温暖',
				feed: 'https://www.thyuu.com/feed',
				link: 'https://www.thyuu.com/',
				icon: 'https://std.thyuu.com/logo.svg',
				avatar: 'https://std.thyuu.com/logo.svg',
				archs: ['WordPress', '服务器'],
				date: '2024-02-01',
			},

		],
	},
	// #endregion
] satisfies FeedGroup[]
