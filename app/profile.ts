/** 个人主页资料；经历、项目与成果可在这里继续补充。 */
export default {
	name: '赫浩文（hehaowen）',
	avatar: 'https://img.hehaowen.com.cn/image/avatar/%E4%B8%AA%E4%BA%BA%E7%94%9F%E6%B4%BB%E7%85%A7.jpg',
	affiliation: '漯河食品工程职业大学',
	major: '计算机网络专业',
	intro: '我叫赫浩文（hehaowen），来自漯河食品工程职业大学计算机网络专业，关注网络安全与人工智能。这个博客记录我的学习、技术实践与探索，也作为整理项目和研究成果的个人空间。',
	interests: [
		{ title: '网络安全', description: '关注网络与系统安全，记录安全学习、CTF 竞赛与攻防实践。' },
		{ title: '人工智能', description: '探索人工智能技术及其应用，关注人工智能与网络安全的交叉方向。' },
	],
	education: [
		{ institution: '漯河食品工程职业大学', detail: '计算机网络专业', period: '' },
		{ institution: '河南新华电脑学院', detail: '网络安全专业 · 中专', period: '' },
	],
	projects: [] as { title: string, description: string, url?: string }[],
	publications: [] as { title: string, detail: string, url?: string }[],
	certifications: [
		{
			title: '阿里云 ACA 大模型认证（LLM）',
			detail: 'Alibaba Cloud Certified Associate · LLM｜阿里云｜有效期至 2028 年 4 月 8 日',
		},
		{
			title: 'Red Hat Linux Operating System Administrator',
			detail: 'Red Hat Academy｜Red Hat Enterprise Linux 6｜2023 年 4 月 23 日',
		},
		{
			title: '国家信息安全水平证书（一级）NISP-1',
			detail: '中国信息安全测评中心｜2022 年 12 月 30 日',
		},
		{
			title: '中国软件行业协会专业人员技术认定 · 物联网技术工程师',
			detail: '中国软件行业协会｜2023 年 5 月 24 日',
		},
	],
	training: [
		{ title: 'CISO 职业能力认证 · 网络应用工程师（高级）', detail: 'CISO 信息化培训评价职业能力认证｜2023 年 7 月 27 日' },
		{ title: 'CISO 职业能力认证 · 数据库管理工程师', detail: 'CISO 信息化培训评价职业能力认证｜2023 年 7 月 27 日' },
		{ title: 'CISO 职业能力认证 · 网络安全工程师', detail: 'CISO 信息化培训评价职业能力认证｜2023 年 4 月 23 日' },
		{ title: 'CISO 职业能力认证 · 网络系统管理工程师', detail: 'CISO 信息化培训评价职业能力认证｜2023 年 4 月 23 日' },
		{ title: 'CISO 职业能力认证 · 网络技术工程师', detail: 'CISO 信息化培训评价职业能力认证｜2023 年 4 月 23 日' },
		{ title: 'CISO 职业能力认证 · 计算机辅助设计师（AutoCAD）', detail: 'CISO 信息化培训评价职业能力认证｜2023 年 4 月 23 日' },
		{ title: 'CISO 职业能力认证 · 平面制作专家', detail: 'CISO 信息化培训评价职业能力认证｜2023 年 4 月 23 日' },
		{ title: 'CISO 职业能力认证 · 计算机维修与维护工程师', detail: 'CISO 信息化培训评价职业能力认证｜2022 年 9 月 10 日' },
		{ title: 'CISO 职业能力认证 · 办公自动化工程师', detail: 'CISO 信息化培训评价职业能力认证｜2022 年 6 月 29 日' },
	],
	awards: [
		{
			title: '第十届御网杯网络安全大赛 · 一等奖',
			detail: '线上挑战赛网络安全高职组｜2026 年 9 月',
		},
		{
			title: '第十届御网杯网络安全大赛 · 二等奖',
			detail: '线下精英赛网络安全高职组｜2026 年 9 月',
		},
		{
			title: '2026 年“新华三杯”全国大学生数字技术大赛河南省级赛 · 二等奖',
			detail: '安全赛道｜2026 年 7 月',
		},
		{
			title: '2025 一带一路暨金砖国家技能发展与技术创新大赛 · 一等奖',
			detail: '首届信创适配及安全管理赛项南部赛区选拔赛（高职组）｜2025 年 9 月｜晋级全国决赛',
		},
		{
			title: '2025 一带一路暨金砖国家技能发展与技术创新大赛 · 三等奖',
			detail: '第一届信创适配及安全管理赛项决赛（高职组）｜2025 年 11 月',
		},
		{
			title: '河南省第七届“金盾信安杯”网络与数据安全大赛 · 二等奖',
			detail: '战队：LSGD_CSTAONE｜2025 年 12 月',
		},
		{
			title: '第九届御网杯网络安全大赛 · 三等奖',
			detail: '御网信安俱乐部组团体赛｜2025 年 7 月',
		},
	],
}
