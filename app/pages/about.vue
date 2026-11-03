<script setup lang="ts">
import profile from '~/profile'

const appConfig = useAppConfig()
useLayoutStore().setAside([])

const profileUrl = new URL('/about', appConfig.url).href

useSeoMeta({
	title: `${profile.name} · 个人主页 · 网络安全与人工智能`,
	description: profile.intro,
	robots: 'index, follow',
	ogTitle: `${profile.name} · 个人主页`,
	ogDescription: profile.intro,
	ogUrl: profileUrl,
	ogType: 'profile',
	ogImage: profile.avatar,
})

useHead({
	link: [{ rel: 'canonical', href: profileUrl }],
	script: [{
		type: 'application/ld+json',
		innerHTML: JSON.stringify({
			'@context': 'https://schema.org',
			'@type': 'ProfilePage',
			'@id': `${profileUrl}#webpage`,
			'url': profileUrl,
			'name': `${profile.name} · 个人主页`,
			'inLanguage': 'zh-CN',
			'mainEntity': {
				'@type': 'Person',
				'@id': `${profileUrl}#person`,
				'name': '赫浩文',
				'alternateName': ['hehaowen', 'Haowen He', appConfig.author.name],
				'url': profileUrl,
				'image': profile.avatar,
				'description': profile.intro,
				'affiliation': { '@type': 'EducationalOrganization', 'name': profile.affiliation },
				'knowsAbout': profile.interests.map(interest => interest.title),
				'sameAs': ['https://github.com/hehaowen-Geek'],
			},
		}).replace(/</g, '\\u003c'),
	}],
})
</script>

<template>
<article class="academic-profile">
	<header class="profile-header">
		<div>
			<p class="eyebrow">
				PERSONAL HOMEPAGE
			</p>
			<h1>{{ profile.name }}</h1>
			<p class="affiliation">
				{{ profile.affiliation }}<br>{{ profile.major }}
			</p>
			<p class="research-label">
				网络安全 · 人工智能
			</p>
			<div class="profile-links">
				<UtilLink :to="`mailto:${appConfig.author.email}`">
					<Icon name="tabler:mail" /> 邮箱
				</UtilLink>
				<UtilLink to="https://github.com/hehaowen-Geek">
					<Icon name="tabler:brand-github" /> GitHub
				</UtilLink>
				<UtilLink to="/">
					<Icon name="tabler:notes" /> 博客文章
				</UtilLink>
			</div>
		</div>
		<img class="portrait" :src="profile.avatar" :alt="`${profile.name}的头像`" width="144" height="144">
	</header>

	<nav class="section-nav" aria-label="个人简介目录">
		<a href="#biography">关于我</a>
		<a href="#interests">关注方向</a>
		<a href="#education">教育经历</a>
		<a href="#work">项目与成果</a>
		<a href="#awards">荣誉与奖项</a>
		<a href="#certifications">职业认证</a>
		<a href="#training">培训与能力评价</a>
		<a href="#contact">联系我</a>
	</nav>

	<section id="biography">
		<h2>关于我 <span>Biography</span></h2>
		<p>{{ profile.intro }}</p>
	</section>

	<section id="interests">
		<h2>关注方向 <span>Interests</span></h2>
		<div class="interests">
			<div v-for="interest in profile.interests" :key="interest.title" class="interest">
				<h3>{{ interest.title }}</h3>
				<p>{{ interest.description }}</p>
			</div>
		</div>
	</section>

	<section id="education">
		<h2>教育经历 <span>Education</span></h2>
		<div v-for="entry in profile.education" :key="entry.institution" class="entry">
			<h3>{{ entry.institution }}</h3>
			<p>{{ entry.detail }}<span v-if="entry.period"> · {{ entry.period }}</span></p>
		</div>
	</section>

	<section id="work">
		<h2>项目与成果 <span>Selected work</span></h2>
		<template v-if="profile.projects.length">
			<h3 class="subheading">
				项目
			</h3>
			<div v-for="project in profile.projects" :key="project.title" class="entry">
				<h3>
					<UtilLink :to="project.url">
						{{ project.title }}
					</UtilLink>
				</h3>
				<p>{{ project.description }}</p>
			</div>
		</template>
		<template v-if="profile.publications.length">
			<h3 class="subheading">
				论文与发表
			</h3>
			<div v-for="publication in profile.publications" :key="publication.title" class="entry">
				<h3>
					<UtilLink :to="publication.url">
						{{ publication.title }}
					</UtilLink>
				</h3>
				<p>{{ publication.detail }}</p>
			</div>
		</template>
		<p v-if="!profile.projects.length && !profile.publications.length" class="muted">
			持续学习与探索中，项目和成果将在这里陆续更新。
		</p>
		<UtilLink class="text-link" to="/archive">
			阅读我的技术文章 <span aria-hidden="true">↗</span>
		</UtilLink>
	</section>

	<section v-if="profile.awards.length" id="awards">
		<h2>荣誉与奖项 <span>Honors &amp; Awards</span></h2>
		<div v-for="award in profile.awards" :key="award.title" class="entry">
			<h3>{{ award.title }}</h3>
			<p>{{ award.detail }}</p>
		</div>
	</section>

	<section v-if="profile.certifications.length" id="certifications">
		<h2>职业认证 <span>Certifications</span></h2>
		<div v-for="certification in profile.certifications" :key="certification.title" class="entry">
			<h3>{{ certification.title }}</h3>
			<p>{{ certification.detail }}</p>
		</div>
	</section>

	<section v-if="profile.training.length" id="training">
		<h2>培训与能力评价 <span>Training &amp; Assessments</span></h2>
		<div v-for="entry in profile.training" :key="entry.title" class="entry">
			<h3>{{ entry.title }}</h3>
			<p>{{ entry.detail }}</p>
		</div>
	</section>

	<section id="contact">
		<h2>联系我 <span>Contact</span></h2>
		<p>欢迎围绕网络安全、人工智能与技术学习交流。</p>
		<UtilLink class="text-link email" :to="`mailto:${appConfig.author.email}`">
			{{ appConfig.author.email }}
		</UtilLink>
	</section>
</article>
</template>

<style lang="scss" scoped>
.academic-profile {
	max-width: 54rem;
	margin-inline: auto;
	padding: clamp(1.25rem, 5vw, 3.5rem);
	line-height: 1.85;

	section {
		padding-block: 1.8rem;
		border-bottom: 1px solid var(--c-border);
		scroll-margin-top: 2rem;
	}

	h1 {
		margin: 0.3rem 0 0.7rem;
		font-size: clamp(2rem, 5vw, 2.8rem);
		line-height: 1.3;
	}

	h2 {
		margin-bottom: 1rem;
		font-size: 1.25rem;

		span {
			margin-inline-start: 0.65rem;
			font-size: 0.8rem;
			font-weight: 400;
			color: var(--c-text-3);
		}
	}

	h3 {
		font-size: 1rem;
		font-weight: 600;
	}

	p {
		margin-block: 0.4rem;
	}
}

.profile-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 1.5rem;
	padding-bottom: 2rem;
}

.eyebrow {
	font-size: 0.7rem;
	letter-spacing: 0.18em;
	color: var(--c-text-3);
}

.affiliation, .muted, .entry p, .interest p {
	color: var(--c-text-2);
}

.research-label {
	font-size: 0.9rem;
	color: var(--c-text-2);
}

.portrait {
	flex-shrink: 0;
	width: clamp(5rem, 20vw, 9rem);
	height: auto;
	aspect-ratio: 1;
	border: 1px solid var(--c-border);
	border-radius: 0.75rem;
	object-fit: cover;
}

.profile-links, .section-nav {
	display: flex;
	flex-wrap: wrap;
	gap: 0.6rem 1.2rem;
	font-size: 0.85rem;

	a {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
	}
}

.profile-links {
	margin-top: 1.2rem;
}

.section-nav {
	padding-block: 1rem;
	border-block: 1px solid var(--c-border);
	color: var(--c-text-2);
}

.interests {
	display: grid;
	grid-template-columns: repeat(2, minmax(0, 1fr));
	gap: 1rem 2rem;
}

.interest {
	padding-inline-start: 1rem;
	border-inline-start: 2px solid var(--c-border);
}

.entry + .entry, .subheading {
	margin-top: 1.2rem;
}

.text-link {
	display: inline-block;
	margin-top: 0.6rem;
	text-decoration: underline;
	text-underline-offset: 0.25em;
}

.email {
	overflow-wrap: anywhere;
}

@media (max-width: 480px) {
	.profile-header {
		align-items: flex-start;
		gap: 0.75rem;
	}

	.interests {
		grid-template-columns: 1fr;
	}
}
</style>
