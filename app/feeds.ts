import type { FeedGroup } from "../app/types/feed";
// 友链检测 CLI 需要使用显式导入和相对路径
import { myFeed } from "../blog.config";
// eslint-disable-next-line unused-imports/no-unused-imports
import {
	getFavicon,
	getGithubAvatar,
	getGithubIcon,
	getOciqGroupAvatar,
	getOicqAvatar,
	OicqAvatarSize,
} from "./utils/img";

export default [
	// #region Clarity
	{
		name: "欢迎光临",
		desc: "使用 Clarity 博客主题构建的网站。",
		// @keep-sorted { "keys": ["date"] }
		entries: [
			myFeed,
			{
				author: "翞~涵",
				sitenick: "杂记本",
				title: "想到什么写什么",
				desc: "一个什么都可能会写的博客",
				link: "https://blog.han1130.top/",
				feed: "https://blog.han1130.top/atom.xml",
				icon: "https://img.han1130.top/img/touxiang.png",
				avatar: "https://img.han1130.top/img/touxiang.png",
				archs: ["Nuxt", "Netlify"],
				date: "2025-05-23",
				comment: "",
			},
		],
	},
	// #endregion
	// #region 网上邻居 since 2024
	{
		name: "好友",
		desc: "哔——啵——电波通讯中，欢迎常来串门。",
		// @keep-sorted { "keys": ["date"] }
		entries: [
			{
				author: "Expl0rer.Ct",
				sitenick: "并非全栈", // 可选
				title: "Expl0rer.Ct", // 可选
				desc: "吾将上下而求索",
				link: "https://expl0rer.top/",
				icon: "https://expl0rer.top/img/avatar_hu_186ba3d0d8bfb6a0.png",
				avatar: "https://expl0rer.top/img/avatar_hu_186ba3d0d8bfb6a0.png",
				date: "2026-06-04", // 添加友链的日期
				comment: "纯属是二进制安全领域的好奇", // 可选，对你的备注
			},

			{
				author: "康可",
				sitenick: "康可ing",
				title: "康可ing",
				desc: "conquer,conquer,conquer...",
				link: "https://blog.yanxisishi.top/",
				icon: "https://q1.qlogo.cn/g?b=qq&nk=3497863696&s=640",
				avatar: "https://q1.qlogo.cn/g?b=qq&nk=3497863696&s=640",
				date: "2026-06-13",
				comment: "",
			},
			{
				author: "chen7chen",
				title: "小chen妙妙屋",
				desc: "一个菜鸡的小屋",
				link: "https://blog.xchstudy.org",
				icon: "https://blog.xchstudy.org/img/images.webp",
				avatar: "https://blog.xchstudy.org/img/images.webp",
				date: "2026-06-18",
				comment: "",
			},
			/* ========从此处新增友链======== */
		],
	},
	// #endregion
	// #region 网络空间安全技术协会
	{
		name: "LFEVU-CSTA",
		desc: "网络空间安全技术协会的会友们",
		// @keep-sorted { "keys": ["date"] }
		entries: [
			{
				author: "郭雨博",
				sitenick: "你好世界",
				title: "想到什么写什么",
				desc: "一个什么都可能会写的博客",
				link: "https://blog.guoyubo.cn/",
				feed: "https://blog.guoyubo.cn",
				icon: "https://blog.guoyubo.cn/avatar.jpg",
				avatar: "https://blog.guoyubo.cn/avatar.jpg",
				archs: ["Nuxt", "Netlify"],
				date: "2025-05-25",
				comment: "",
			},
		],
	},
	// #endregion
	// #region 知识分享
	{
		name: "知识分享",
		desc: '"AI时代"创作分享/知识内容收集。',
		// @keep-sorted { "keys": ["date"] }
		entries: [
			{
				author: "茂茂物语",
				desc: "茂茂的成长之路，包含前端常用知识、源码阅读笔记、各种奇淫技巧、日常提效工具等",
				link: "https://notes.fe-mm.com/",
				icon: getGithubIcon("maomao1996"),
				avatar: getGithubAvatar("maomao1996"),
				archs: ["VitePress", "Cloudflare"],
				date: "2024-02-17",
				comment: "前端开发笔记。",
			},
		],
	},
	// #endregion
	// #region 漫游
	{
		name: "漫游",
		desc: "网上冲浪时发现的精彩内容与常读订阅，与君共享。",
		// @keep-sorted { "keys": ["date"] }
		entries: [
			{
				author: "风记星辰",
				desc: "热爱你来过的每度温暖",
				feed: "https://www.thyuu.com/feed",
				link: "https://www.thyuu.com/",
				icon: "https://std.thyuu.com/logo.svg",
				avatar: "https://std.thyuu.com/logo.svg",
				archs: ["WordPress", "服务器"],
				date: "2024-02-01",
			},
		],
	},
	// #endregion
	// #region 技术链接
	{
		name: "技术链接",
		desc: "常用的技术平台与工具。",
		// @keep-sorted { "keys": ["date"] }
		entries: [
			{
				author: "DeepSeek",
				desc: "深度求索AI大语言模型",
				link: "https://chat.deepseek.com/",
				icon: "https://www.deepseek.com/favicon.ico",
				avatar: "https://www.deepseek.com/favicon.ico",
				date: "2026-06-23",
				comment: "",
			},
			{
				author: "菜鸟教程",
				desc: "学的不仅是技术，更是梦想！",
				link: "https://www.runoob.com/",
				icon: "https://www.runoob.com/favicon.ico",
				avatar: "https://www.runoob.com/favicon.ico",
				date: "2026-06-23",
				comment: "",
			},
			{
				author: "ChatGPT",
				desc: "OpenAI 人工智能对话助手",
				link: "https://chatgpt.com/",
				icon: "https://icons.duckduckgo.com/ip3/openai.com.ico",
				avatar: "https://icons.duckduckgo.com/ip3/openai.com.ico",
				date: "2026-06-23",
				comment: "",
			},
			{
				author: "CSDN",
				desc: "专业开发者社区",
				link: "https://www.csdn.net/",
				icon: "https://www.csdn.net/favicon.ico",
				avatar: "https://www.csdn.net/favicon.ico",
				date: "2026-06-23",
				comment: "",
			},
		],
	},
	// #endregion
	// #region 公司
	{
		name: "企业观",
		desc: "观潮起潮落，见时代锋芒。",
		// @keep-sorted { "keys": ["date"] }
		entries: [
			{
				author: "腾讯",
				desc: "用户为本，科技向善",
				link: "https://www.tencent.com/",
				icon: "https://cdn.jsdmirror.com/npm/@lobehub/icons-static-svg@1.91.0/icons/tencent-color.svg",
				avatar:
					"https://cdn.jsdmirror.com/npm/@lobehub/icons-static-svg@1.91.0/icons/tencent-color.svg",
				date: "2026-06-23",
				comment: "",
			},
			{
				author: "阿里巴巴",
				desc: "让天下没有难做的生意",
				link: "https://www.alibaba.com/",
				icon: "https://cdn.jsdmirror.com/npm/@lobehub/icons-static-svg@1.91.0/icons/alibaba-color.svg",
				avatar:
					"https://cdn.jsdmirror.com/npm/@lobehub/icons-static-svg@1.91.0/icons/alibaba-color.svg",
				date: "2026-06-23",
				comment: "",
			},
			{
				author: "字节跳动",
				desc: "激发创造，丰富生活",
				link: "https://www.bytedance.com/",
				icon: "https://cdn.jsdmirror.com/npm/@lobehub/icons-static-svg@1.91.0/icons/bytedance-color.svg",
				avatar:
					"https://cdn.jsdmirror.com/npm/@lobehub/icons-static-svg@1.91.0/icons/bytedance-color.svg",
				date: "2026-06-23",
				comment: "",
			},
			{
				author: "影视飓风",
				desc: "无限进步",
				link: "https://www.ysjf.com/",
				icon: "https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://ysjf.com&size=64",
				avatar:
					"https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://ysjf.com&size=64",
				date: "2026-06-23",
				comment: "",
			},
			{
				author: "中国移动",
				desc: "移动改变生活",
				link: "https://www.10086.cn/",
				icon: "https://shop.10086.cn/favicon.ico",
				avatar:
					"https://shop.10086.cn/favicon.ico",
				date: "2026-06-23",
				comment: "",
			},
			{
				author: "中国联通",
				desc: "创新改变世界",
				link: "https://www.chinaunicom.com.cn/",
				icon: "https://www.google.com/s2/favicons?domain=www.chinaunicom.cn&sz=128",
				avatar:
					"https://www.google.com/s2/favicons?domain=www.chinaunicom.cn&sz=128",
				date: "2026-06-23",
				comment: "",
			},
			{
				author: "中国电信",
				desc: "用户至上，用心服务",
				link: "https://www.189.cn/",
				icon: "https://www.189.cn/favicon.ico",
				avatar:
					"https://www.189.cn/favicon.ico",
				date: "2026-06-23",
				comment: "",
			},
			{
				author: "中国广电",
				desc: "致广大，极视听",
				link: "https://www.cbn.cn/",
				icon: "https://www.cbn.cn/favicon.ico",
				avatar: "https://www.cbn.cn/favicon.ico",
				date: "2026-06-23",
				comment: "",
			},
		],
	},
	// #endregion
] satisfies FeedGroup[];
