---
title: 给博客接入 Giscus：用 GitHub Discussions 管理评论
description: 记录为 Nuxt 博客接入 Giscus 评论系统的过程，包括 GitHub 授权、仓库与分类配置、Vue 组件接入、明暗主题同步，以及评论加载和文章关联的排查方法。
date: 2026-10-29 00:00:00
updated: 2026-10-29 00:00:00
type: tech
categories: [技术]
tags: [博客, Giscus, GitHub, Nuxt, Vue]
permalink: /2026/giscus-comments
draft: false
---

写博客时，经常会遇到这样的情况：教程中的命令需要补充说明，读者在不同环境里遇到了新的问题，或者有人想分享另一种解决方法。有了评论区，这些反馈就能留在文章下面，方便后来的读者一起参考。

这次我给博客接入了 **Giscus**，使用 GitHub Discussions 存储和管理评论。本文记录实际配置过程，也说明几个容易遗漏的细节，方便以后维护，或者给使用相似技术栈的朋友参考。

## 为什么选择 Giscus

博客主题原本预留了 Twikoo 评论组件，但配置中使用的还是示例服务地址。如果继续使用 Twikoo，需要先准备自己的评论后端，再把地址填回博客。

我希望少维护一套服务，而博客的内容又以技术文章为主，因此选择了 Giscus。它将评论保存在 GitHub Discussions 中，站点维护者无需另建评论数据库，可以直接在 GitHub 中查看和管理讨论。[Giscus 官方介绍](https://giscus.app/zh-CN)说明了它的工作方式和仓库要求。

使用它也有需要接受的条件：**发表评论需要 GitHub 账号，并完成相应授权**。评论区的加载还依赖访问 GitHub 和 Giscus 服务的网络情况。对于技术博客，我可以接受这样的使用门槛；如果主要面向没有 GitHub 账号的读者，选型时就需要重新考虑。

## 一篇文章怎样对应一组评论

接入时要先确定：用什么标识把网页和 GitHub 上的讨论关联起来？

这个博客使用文章路径作为标识。例如，本文的路径固定为：

```text
/2026/giscus-comments
```

评论组件把这段路径传给 Giscus，再由它查找对应讨论。没有找到时，第一次有人发表评论或回应，才会自动创建讨论。因此，**刚配置好时，仓库里还没有每篇文章对应的讨论是正常现象**。[官方配置说明](https://giscus.app/zh-CN)中也介绍了这种创建机制。

路径标识还有一个实际好处：修改文章标题不会改变关联的评论，切换域名时也能沿用原来的路径。但如果把文章从一个路径移动到另一个路径，就需要考虑旧讨论如何继续关联。

## 先完成 GitHub 侧的配置

### 1. 准备公开仓库并开启 Discussions

我使用的仓库是 `hehaowen-Geek/blog`。评论也可以放在单独建立的公开仓库中，不要求一定和博客源码放在一起。

进入目标仓库，打开：

```text
Settings → General → Features → Discussions
```

勾选 Discussions 后，再回到仓库确认讨论入口已经出现。

### 2. 安装 Giscus，并授权目标仓库

打开 [Giscus GitHub App](https://github.com/apps/giscus)，选择安装到对应账号，再授权准备用于存放评论的仓库。

这一步很容易和“开启 Discussions”混在一起。实际上两项都需要完成：仓库有讨论功能，还要让 Giscus 能够访问这个仓库。

这次配置时，我就遇到了 Discussions 已经开启，但接口仍提示：

```text
giscus is not installed on this repository
```

检查应用安装设置，将 `hehaowen-Geek/blog` 加入授权范围并保存后，才正常获取到评论分类。遇到相同提示时，应先检查 Giscus 是否授权到了当前仓库。

### 3. 获取仓库和分类配置

打开 [Giscus 配置页](https://giscus.app/zh-CN)，填写仓库名称，选择用于存放评论的分类。

我选择了 `Announcements`。官方建议使用公告类型的分类，限制普通用户直接创建新的讨论主题，同时保留文章下方的评论功能。

配置页生成的代码中有四个重要字段：

| 生成代码中的字段 | 在本项目中的配置项 |
| --- | --- |
| `data-repo` | `repo`，仓库名称 |
| `data-repo-id` | `repoId`，仓库 ID |
| `data-category` | `category`，分类名称 |
| `data-category-id` | `categoryId`，分类 ID |

仓库名称和仓库 ID 是不同的字段，分类名称和分类 ID 也需要分别填写。复制配置时，四项应来自同一个目标仓库。

## 在 Nuxt 博客中接入组件

下面的示例针对当前博客使用的 Nuxt 和 Vue 3 环境。普通 HTML 站点可以使用配置页生成的脚本；Vue 项目也可以使用官方维护的 [Giscus 组件库](https://github.com/giscus/giscus-component)。

### 安装依赖并填写配置

安装 Vue 组件：

```sh
pnpm add @giscus/vue
```

这个项目统一使用 pnpm catalog 管理依赖，因此实际项目中的版本记录在 `pnpm-workspace.yaml` 的 `catalogs.ui` 下，`package.json` 中使用 `catalog:ui` 引用。其他项目按自己的依赖管理方式安装即可。

在 `blog.config.ts` 中添加评论配置。本博客目前使用的值如下；接入自己的站点时，需要替换成自己的仓库和分类信息：

```ts
giscus: {
  repo: 'hehaowen-Geek/blog',
  repoId: 'R_kgDOSk84yg',
  category: 'Announcements',
  categoryId: 'DIC_kwDOSk84ys4DJ5N0',
},
```

本项目的 `app/app.config.ts` 已经合并了 `blog.config.ts`，所以页面组件可以通过 `useAppConfig()` 读取这些配置。

### 编写评论组件

评论组件位于 `app/components/post/Comment.vue`。省略样式和配置缺失时的提示后，核心代码如下：

```vue
<script setup lang="ts">
import type { Repo } from '@giscus/vue'
import Giscus from '@giscus/vue'

const appConfig = useAppConfig()
const route = useRoute()
const colorMode = useColorMode()
const repo = appConfig.giscus.repo as Repo
const theme = computed(() => colorMode.value === 'dark' ? 'dark' : 'light')
</script>

<template>
  <section id="comments">
    <h3>评论区</h3>
    <p>使用 GitHub 账号登录后即可评论。</p>
    <ClientOnly>
      <Giscus
        :key="route.path"
        :repo="repo"
        :repo-id="appConfig.giscus.repoId"
        :category="appConfig.giscus.category"
        :category-id="appConfig.giscus.categoryId"
        mapping="specific"
        :term="route.path"
        strict="1"
        reactions-enabled="1"
        emit-metadata="0"
        input-position="top"
        :theme="theme"
        lang="zh-CN"
        loading="lazy"
      />
      <template #fallback>
        <p>评论加载中…</p>
      </template>
    </ClientOnly>
  </section>
</template>
```

这里使用了 Nuxt 的自动导入，以及项目已经安装的 `@nuxtjs/color-mode`。如果复制到普通 Vue 项目，需要自行处理对应的导入、路由和主题状态。

## 几个值得保留的配置细节

### 使用完整路径作为明确的关联标识

当前实现选择 `mapping="specific"`，并把 `route.path` 传给 `term`。这是明确指定关联字符串的方式，并非直接启用 Giscus 的 `pathname` 映射模式。

使用 `route.path` 可以避免把查询参数或页面锚点混进标识。例如，打开文章目录里的某个小节，仍然应当看到同一组评论。

`strict="1"` 则启用严格匹配，减少相似讨论标题被模糊匹配到的可能。它的匹配机制，以及旧讨论启用严格匹配时的注意事项，可以参考 [Giscus 高级用法](https://github.com/giscus/giscus/blob/main/ADVANCED-USAGE.md)。新接入的站点可以从一开始就保持这个设置。

### 处理站内导航

Nuxt 的站内跳转通常不会整页刷新。组件上的 `:key="route.path"` 会在文章路径变化时重新创建评论组件，让新页面使用自己的讨论标识。

实际检查时，不能只打开一篇文章确认评论区出现，还应当连续访问两篇文章，再切换到友链页面，确认评论关联随页面变化。

### 跟随博客切换明暗主题

`useColorMode()` 提供博客当前的主题状态，再通过计算属性转换成 Giscus 使用的 `light` 或 `dark`。

测试时也要实际点击主题按钮：页面初次加载时颜色正确，并不能说明手动切换主题后评论区仍会同步。

### 更新入口并移除旧资源

这次切换还处理了三个位置：

- 移除原来的 Twikoo 脚本、组件专属样式和全局类型声明。
- 将文章目录中的评论跳转入口改为 `#comments`，与新组件的 ID 保持一致。
- 将评论服务的预连接地址改为 `https://giscus.app`。

这些地方容易被忽略。尤其是目录按钮，如果仍指向旧组件的锚点，即使评论区已经正常显示，点击按钮也无法定位过去。

## 评论没有出现时，怎么排查

| 现象 | 优先检查 |
| --- | --- |
| 提示未安装 Giscus | 应用是否安装到正确账号，并授权了目标仓库 |
| 无法获取分类 | 仓库是否公开、是否开启 Discussions，应用授权是否完整 |
| 显示“评论暂未开放” | 本项目的仓库名称、仓库 ID、分类 ID 是否已填写 |
| 一直停留在加载状态 | 浏览器网络请求、Giscus 与 GitHub 的访问情况，以及脚本拦截情况 |
| 不同文章出现同一组评论 | `term` 是否写成固定值，站内切换时是否正确更新组件 |
| 修改文章链接后看不到旧评论 | 新路径是否已经改变讨论关联标识，旧讨论是否仍保存在 GitHub 中 |
| 页面正常但仓库里没有新讨论 | 是否还没有提交过第一条评论或回应 |

排查时可以直接打开 GitHub 上对应的讨论，判断是数据仍在但网页没有加载出来，还是当前页面关联到了另一个标识。这样比一开始就重建评论系统更容易找到原因。

## 这次验证到了哪一步

本次接入完成后，生产构建通过；在本地生产版本中，也检查了评论区加载、明暗主题切换，以及文章页面和友链页面之间的评论关联。

浏览器中已经能看到评论输入区和“使用 GitHub 登录”按钮。**这次验证没有代替读者提交测试评论**；部署上线后，还需要由站点维护者登录并实际提交一条评论，检查发布和后续管理是否正常。

构建过程中还发现一个原有问题：部分内容没有阅读字数信息，统计接口直接读取 `readingTime.words` 会报错。修复时给缺失值提供了默认值，让文章统计能够继续执行。这是独立于评论系统的构建问题，排查部署失败时也需要把错误来源分清楚。

如果你在本站的教程里遇到了问题，可以在对应文章下说明操作环境、执行步骤和报错信息。代码或日志中涉及账号凭据时，记得先去掉相关内容。把问题留在文章下，也方便后来遇到同样情况的人查阅。
