---
title: 部署 Claude Code + DeepSeek 教程
description: 从零开始配置 Claude Code 并接入 DeepSeek 模型，打造高性价比的 AI 编程助手。
date: 2026-07-02 12:00:00
updated: 2026-07-02 12:00:00
type: tech
categories: [教程, AI]
tags: [Claude Code, DeepSeek, AI, 开发工具]
draft: false
---
## 前言

[Claude Code](https://docs.anthropic.com/zh-CN/docs/claude-code/overview) 是 Anthropic 推出的命令行 AI 编程助手，原生使用 Claude 系列模型。但通过其**第三方模型提供商**的支持，我们可以接入 DeepSeek 等模型，在保持强大编程能力的同时大幅降低成本。

本教程将带你从零开始完成配置。

## 为什么选择 DeepSeek？

- **成本优势**：DeepSeek API 定价远低于 Claude 官方模型
- **编程能力**：DeepSeek-V4 在代码生成和理解方面表现优异
- **中文友好**：对中文注释和文档的理解更自然

## 第一步：安装 Claude Code

### 方式一：npm 全局安装（推荐）

```bash
npm install -g @anthropic-ai/claude-code
```

### 方式二：直接使用 npx（无需安装）

```bash
npx @anthropic-ai/claude-code
```

## 第二步：获取 DeepSeek API Key

1. 访问 [DeepSeek 开放平台](https://platform.deepseek.com/)
2. 注册 / 登录账号
3. 进入「API Keys」页面，点击「创建 API Key」
4. 复制保存生成的 Key（仅显示一次）

## 第三步：配置 Claude Code 使用 DeepSeek

Claude Code 通过环境变量来指定第三方模型。在你的终端配置文件（`~/.bashrc`、`~/.zshrc` 或 PowerShell Profile）中添加：

```bash
# DeepSeek API 配置
export ANTHROPIC_BASE_URL="https://api.deepseek.com/anthropic"
export ANTHROPIC_API_KEY="你的DeepSeek-API-Key"
```

对于 Windows PowerShell 用户：

```powershell
$env:ANTHROPIC_BASE_URL = "https://api.deepseek.com/anthropic"
$env:ANTHROPIC_API_KEY = "你的DeepSeek-API-Key"
```

### 验证配置

在终端中运行：

```bash
claude --version
```

如果配置正确，`claude` 命令可以正常启动，并会使用 DeepSeek 作为后端模型。

## 第四步：指定使用的模型

在项目根目录的 `.claude/settings.json` 中，可以指定默认模型：

```json
{
  "model": "deepseek-v4-pro"
}
```

或在启动时通过参数指定：

```bash
claude --model deepseek-v4-pro
```

> 可用的 DeepSeek 模型 ID 请参考 [DeepSeek API 文档](https://platform.deepseek.com/api-docs/)。

## 第五步：开始使用

进入你的项目目录，启动 Claude Code：

```bash
cd your-project
claude
```

常见用法：

- 直接描述需求，Claude Code 会自主读写文件、执行命令
- `claude "修复这个 bug"` —— 单次问答模式
- `claude --resume` —— 恢复上次会话
- `/help` —— 查看内置帮助

## 常见问题

### Q: 连接超时怎么办？

检查网络是否能访问 `api.deepseek.com`，国内用户通常可以直连。如果仍有问题，尝试配置代理：

```bash
export HTTP_PROXY="http://127.0.0.1:7890"
export HTTPS_PROXY="http://127.0.0.1:7890"
```

### Q: 某些功能不可用？

第三方模型可能不支持 Claude 的全部特性（如 extended thinking、某些 tool 的特定行为）。如遇到问题，可临时切换回 Anthropic 官方 API。

### Q: DeepSeek 额度消耗快？

建议按需使用：

- 简单问题用 Haiku 级别小模型
- 复杂重构用 DeepSeek-V4-Pro
- 善用 `/compact` 压缩上下文

## 小结

通过 Claude Code + DeepSeek 的组合，你可以用不到 1/10 的成本获得高质量的 AI 编程辅助体验。对于个人开发者和小团队来说，这是一个极具性价比的方案。

如果你在配置过程中遇到任何问题，欢迎在评论区留言交流。
