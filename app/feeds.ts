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
			{
				author: "Cloudflare",
				desc: "构建更好的互联网",
				link: "https://www.cloudflare.com/",
				icon: "https://www.cloudflare.com/favicon.ico",
				avatar: "https://www.cloudflare.com/favicon.ico",
				date: "2026-06-23",
				comment: "",
			},
			{
				author: "GitHub",
				desc: "全球最大的代码托管平台",
				link: "https://github.com/",
				icon: "https://github.com/favicon.ico",
				avatar: "https://github.com/favicon.ico",
				date: "2026-06-23",
				comment: "",
			},
			{
				author: "Microsoft",
				desc: "赋能全球个人与组织成就更多",
				link: "https://www.microsoft.com/",
				icon: "https://icons.duckduckgo.com/ip3/microsoft.com.ico",
				avatar: "https://icons.duckduckgo.com/ip3/microsoft.com.ico",
				date: "2026-06-23",
				comment: "",
			},
			{
				author: "Google",
				desc: "整合全球信息，供大众使用",
				link: "https://www.google.com/",
				icon: "https://www.google.com/favicon.ico",
				avatar: "https://www.google.com/favicon.ico",
				date: "2026-06-23",
				comment: "",
			},
			{
				author: "阿里云",
				desc: "全球领先的云计算服务平台",
				link: "https://www.aliyun.com/",
				icon: "https://cdn.jsdmirror.com/npm/@lobehub/icons-static-svg@1.91.0/icons/alibabacloud-color.svg",
				avatar:
					"https://cdn.jsdmirror.com/npm/@lobehub/icons-static-svg@1.91.0/icons/alibabacloud-color.svg",
				date: "2026-06-23",
				comment: "",
			},
			{
				author: "Vercel",
				desc: "极致的前端部署与边缘计算平台",
				link: "https://vercel.com/",
				icon: "https://vercel.com/favicon.ico",
				avatar: "https://vercel.com/favicon.ico",
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
				avatar: "https://shop.10086.cn/favicon.ico",
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
				avatar: "https://www.189.cn/favicon.ico",
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
			{
				author: "锐捷",
				desc: "场景创新，网络基石",
				link: "https://www.ruijie.com.cn/",
				icon: "https://www.google.com/s2/favicons?domain=ruijie.com.cn&sz=128",
				avatar:
					"https://www.google.com/s2/favicons?domain=ruijie.com.cn&sz=128",
				date: "2026-06-23",
				comment: "",
			},
			{
				author: "H3C",
				desc: "数字化解决方案领导者",
				link: "https://www.h3c.com/",
				icon: "https://www.h3c.com/favicon.ico",
				avatar: "https://www.h3c.com/favicon.ico",
				date: "2026-06-23",
				comment: "",
			},
			{
				author: "华为",
				desc: "构建万物互联的智能世界",
				link: "https://www.huawei.com/",
				icon: "https://www.huawei.com/favicon.ico",
				avatar: "https://www.huawei.com/favicon.ico",
				date: "2026-06-23",
				comment: "",
			},
			{
				author: "Juniper",
				desc: "体验至上的网络先锋",
				link: "https://www.juniper.net/",
				icon: "https://www.juniper.net/favicon.ico",
				avatar: "https://www.juniper.net/favicon.ico",
				date: "2026-06-23",
				comment: "",
			},
			{
				author: "Cisco",
				desc: "全球网络技术领导者",
				link: "https://www.cisco.com/",
				icon: "https://icons.duckduckgo.com/ip3/cisco.com.ico",
				avatar: "https://icons.duckduckgo.com/ip3/cisco.com.ico",
				date: "2026-06-23",
				comment: "",
			},
			{
				author: "AWS",
				desc: "全球领先的云计算平台",
				link: "https://aws.amazon.com/",
				icon: "https://aws.amazon.com/favicon.ico",
				avatar: "https://aws.amazon.com/favicon.ico",
				date: "2026-06-23",
				comment: "",
			},
			{
				author: "Google Cloud",
				desc: "谷歌云端创新引擎",
				link: "https://cloud.google.com/",
				icon: "https://www.google.com/s2/favicons?domain=cloud.google.com&sz=128",
				avatar:
					"https://www.google.com/s2/favicons?domain=cloud.google.com&sz=128",
				date: "2026-06-23",
				comment: "",
			},
			{
				author: "腾讯云",
				desc: "产业互联网的基础设施",
				link: "https://cloud.tencent.com/",
				icon: "https://cloud.tencent.com/favicon.ico",
				avatar: "https://cloud.tencent.com/favicon.ico",
				date: "2026-06-23",
				comment: "",
			},
			{
				author: "奇安信",
				desc: "网络安全国家队",
				link: "https://www.qianxin.com/",
				icon: "https://www.qianxin.com/favicon.ico",
				avatar: "https://www.qianxin.com/favicon.ico",
				date: "2026-06-23",
				comment: "",
			},
			{
				author: "深信服",
				desc: "让用户的数字化更简单更安全",
				link: "https://www.sangfor.com.cn/",
				icon: "https://www.google.com/s2/favicons?domain=sangfor.com.cn&sz=128",
				avatar:
					"https://www.google.com/s2/favicons?domain=sangfor.com.cn&sz=128",
				date: "2026-06-23",
				comment: "",
			},
			{
				author: "Fortinet",
				desc: "全球网络安全领导者",
				link: "https://www.fortinet.com/",
				icon: "https://www.fortinet.com/favicon.ico",
				avatar: "https://www.fortinet.com/favicon.ico",
				date: "2026-06-23",
				comment: "",
			},
			{
				author: "Palo Alto Networks",
				desc: "引领网络安全新范式",
				link: "https://www.paloaltonetworks.com/",
				icon: "https://www.paloaltonetworks.com/favicon.ico",
				avatar: "https://www.paloaltonetworks.com/favicon.ico",
				date: "2026-06-23",
				comment: "",
			},
			{
				author: "NVIDIA",
				desc: "加速计算的引擎",
				link: "https://www.nvidia.com/",
				icon: "https://www.nvidia.com/favicon.ico",
				avatar: "https://www.nvidia.com/favicon.ico",
				date: "2026-06-23",
				comment: "",
			},
			{
				author: "Intel",
				desc: "摩尔定律的践行者",
				link: "https://www.intel.com/",
				icon: "https://www.intel.com/favicon.ico",
				avatar: "https://www.intel.com/favicon.ico",
				date: "2026-06-23",
				comment: "",
			},
			{
				author: "AMD",
				desc: "YES！高性能计算先锋",
				link: "https://www.amd.com/",
				icon: "https://www.google.com/s2/favicons?domain=amd.com&sz=128",
				avatar: "https://www.google.com/s2/favicons?domain=amd.com&sz=128",
				date: "2026-06-23",
				comment: "",
			},
			{
				author: "百度",
				desc: "全球最大的中文搜索引擎",
				link: "https://www.baidu.com/",
				icon: "https://www.baidu.com/favicon.ico",
				avatar: "https://www.baidu.com/favicon.ico",
				date: "2026-06-23",
				comment: "",
			},
			{
				author: "网易",
				desc: "网聚人的力量",
				link: "https://www.163.com/",
				icon: "https://www.google.com/s2/favicons?domain=163.com&sz=128",
				avatar: "https://www.google.com/s2/favicons?domain=163.com&sz=128",
				date: "2026-06-23",
				comment: "",
			},
			{
				author: "京东",
				desc: "不负每一份热爱",
				link: "https://www.jd.com/",
				icon: "https://www.jd.com/favicon.ico",
				avatar: "https://www.jd.com/favicon.ico",
				date: "2026-06-23",
				comment: "",
			},
		],
	},
	// #endregion
] satisfies FeedGroup[];
