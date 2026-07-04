---
title: 部署 Claude Code + CC Switch + DeepSeek 教程
description: 从零开始配置 Claude Code，通过 CC Switch 接入 DeepSeek 模型，打造高性价比的 AI 编程助手。
date: 2026-07-02 12:00:00
updated: 2026-07-04 12:00:00
type: tech
categories: [教程, AI]
tags: [Claude Code, CC Switch, DeepSeek, AI, 开发工具]
draft: false
---
## 前言

[Claude Code](https://docs.anthropic.com/zh-CN/docs/claude-code/overview) 是 Anthropic 推出的命令行 AI 编程助手。通过 [CC Switch](https://github.com/farion1231/cc-switch) + DeepSeek 的组合，可以用不到 1/10 的成本获得高质量的 AI 编程辅助体验。

本教程的**三个核心组件**：

| 组件 | 作用 |
| ---- | ---- |
| **Claude Code** | AI 编程助手本体，负责自主读写文件、执行命令 |
| **CC Switch** | 图形化管理工具，一键切换模型提供商，告别手改环境变量 |
| **DeepSeek** | 后端模型，提供高性价比的代码生成与理解能力 |

## 为什么选择这个组合？

- **成本优势**：DeepSeek API 定价远低于 Claude 官方模型，个人开发者友好
- **编程能力**：DeepSeek-V4 / V4-Pro 在代码生成和理解方面表现出色
- **切换方便**：CC Switch 提供 GUI 界面，随时在 Anthropic 官方、DeepSeek、OpenAI 等提供商之间一键切换
- **中文友好**：DeepSeek 对中文注释和文档的理解更自然

## 第一步：安装 Claude Code

### 方式一：winget 安装（Windows 推荐）

```powershell
winget install Anthropic.ClaudeCode
```

> 安装后会自动配置环境变量，无需手动操作。

### 方式二：npm 全局安装

```bash
npm install -g @anthropic-ai/claude-code
```

### 方式三：直接使用 npx（无需安装）

```bash
npx @anthropic-ai/claude-code
```

> ⚠️ Windows 用户需先安装 [Git](https://git-scm.com/)，Claude Code 底层依赖 Git Bash 执行命令。可通过 `winget install Git.Git` 快速安装。

## 第二步：获取 DeepSeek API Key

1. 访问 [DeepSeek 开放平台](https://platform.deepseek.com/)
2. 注册 / 登录账号
3. **完成实名认证**（平台要求）
4. 进入「API Keys」页面，点击「创建 API Key」
5. 复制保存生成的 Key（仅显示一次）

## 第三步：安装 CC Switch

[CC Switch](https://github.com/farion1231/cc-switch) 是一个带 GUI 界面的模型提供商快速切换工具——不再需要手动编辑环境变量或配置文件。

1. 前往 [Releases 页面](https://github.com/farion1231/cc-switch/releases) 下载对应系统版本
2. 双击安装，一路 Next 即可
3. 安装完成后启动 CC Switch

### 配置 DeepSeek

1. 点击右上角的 **+** 号添加新配置
2. 选择 **DeepSeek** 作为提供商
3. 填入上一步获取的 API Key
4. ⚠️ **关键步骤**：将模型映射改为 **V4 版本**（默认是 V3），推荐 `deepseek-v4-pro`
5. 点击「添加」保存

> 配置界面截图及详细图文指引见：[Claude Code + CC Switch + DeepSeek 配置详解](https://dev.codenice.cn/articles/claude-desktop-cc-switch-deepseek)

配置完成后，CC Switch 会作为托盘程序运行，自动接管 Claude Code 的模型路由。

## 第四步：启动使用

打开终端（CMD / PowerShell），进入你的项目目录：

```bash
cd your-project
claude
```

首次启动会引导你选择界面风格，一路 Enter 即可。之后 CC Switch 会在后台自动将请求路由到 DeepSeek。

常见用法：

- 直接描述需求，Claude Code 会自主读写文件、执行命令
- `claude "修复这个 bug"` —— 单次问答模式
- `claude --resume` —— 恢复上次会话
- `/help` —— 查看内置帮助

### 切换模型

想临时用回 Anthropic 官方或其他模型？点击系统托盘中的 CC Switch 图标，切换到对应配置即可，**无需重启终端**。

## 附：个性化配置（可选）

在用户目录下的 `.claude/` 文件夹中创建 `CLAUDE.md`，自定义 Claude Code 的行为：

```markdown
## 关于我
[你的身份/职业]。我用 Claude Code 做[用途1]和[用途2]。

## 思维原则
- 所有决策从问题本质出发，不因"惯例如此"照搬
- 给我真实判断，方案有问题直接指出来

## 沟通方式
- 默认中文，代码、命令、变量名用英文
- 结论先行，再给理由

## 自主边界（红线，必须先问我）
- 删除文件、目录或 git 历史
- 修改 .env、密钥、token、CI/CD 配置
- 数据库 schema 变更或数据迁移
- git push、git rebase、git reset --hard、强制推送
- 安装新的全局依赖或修改系统配置
- 公开发布（npm publish、部署到生产、发文章等）
```

按自己的需求调整后，Claude Code 会更贴合你的工作方式。

## 常见问题

### Q: CC Switch 连接 DeepSeek 失败？

检查：

1. DeepSeek API Key 是否正确填写
2. **模型映射是否已改为 V4**（默认 V3 已不可用）
3. 网络是否能访问 `api.deepseek.com`

### Q: 某些功能不可用？

第三方模型可能不支持 Claude 的全部特性（如 extended thinking）。如遇到问题，在 CC Switch 中一键切回 Anthropic 官方 API 即可。

### Q: DeepSeek 额度消耗快？

- 简单问题选便宜的模型
- 复杂重构用 DeepSeek-V4-Pro
- 善用 `/compact` 压缩上下文

### Q: 我是 macOS / Linux 用户，没有 winget？

winget 仅用于安装 Claude Code，macOS/Linux 用户请使用 npm 安装方式。CC Switch 提供了各平台的安装包，功能完全一致。

## 小结

通过 **Claude Code + CC Switch + DeepSeek** 三件套的组合，你可以用极低的成本获得顶级的 AI 编程辅助体验。CC Switch 的图形化管理让你告别手动配置环境变量的繁琐，随时在不同模型提供商之间切换。

如果你在配置过程中遇到任何问题，欢迎在评论区留言交流。
