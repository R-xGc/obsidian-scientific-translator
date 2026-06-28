# Scientific Translator for Obsidian

> 🔬 专为**科研论文**阅读设计的 Obsidian 翻译插件。
> 选中术语 → 右键 → 弹窗显示「**译文 + IPA 音标 + 术语备注 + 读音**」，针对深度学习 / AI / CV / NLP 领域深度优化。
> **必须接入用户自己的 API**（OpenAI、MiniMax、DeepSeek、Ollama、Azure 等任意 OpenAI 兼容服务）。

![obsidian](https://img.shields.io/badge/Obsidian-1.4%2B-purple) ![platform](https://img.shields.io/badge/Platform-Desktop-blue) ![license](https://img.shields.io/badge/License-MIT-green)

---

## ✨ 核心特性

| 特性 | 说明 |
|---|---|
| 🖱️ **右键翻译** | 选中文字 → 右键 → 「🔬 科研翻译」，弹窗显示结果 |
| 🔤 **IPA 音标** | 自动附带国际音标，方便学习术语发音 |
| 📚 **术语备注** | 模型识别专业术语时附带简短解释（针对深度学习术语） |
| 🔊 **朗读原文 / 译文** | 用浏览器 TTS 朗读，按钮一键发音 |
| 🔌 **接入自己的 API** | 支持任意 OpenAI 兼容 API（OpenAI、MiniMax、DeepSeek、Ollama、Azure 等） |
| 🎯 **科研深度优化** | 内置科研翻译 system prompt，术语精确、语体客观 |
| 🎨 **主题适配** | 完全跟随 Obsidian 主题（亮 / 暗 / 自定义） |

---

## 📦 安装

### 方式 1：从 Release 下载（推荐新手）

1. 打开 [Releases](../../releases) 页面，下载最新版本的 `scientific-translator.zip`
2. 解压到你的 vault 的 `.obsidian/plugins/scientific-translator/` 文件夹下：
   ```
   .obsidian/
   └── plugins/
       └── scientific-translator/
           ├── main.js
           ├── manifest.json
           └── styles.css
   ```
3. 重启 Obsidian → Settings → Community plugins → 开启 **Scientific Translator**

### 方式 2：从源码构建

```bash
git clone https://github.com/<your-repo>/obsidian-scientific-translator.git
cd obsidian-scientific-translator
npm install
npm run build
cp main.js manifest.json styles.css /path/to/vault/.obsidian/plugins/scientific-translator/
```

---

## ⚙️ 配置 API

打开 Obsidian → Settings → Scientific Translator：

| 字段 | 示例值 | 说明 |
|---|---|---|
| **API URL** | `https://api.openai.com/v1` | OpenAI 兼容接口，不含 `/chat/completions` |
| **API Key** | 你的 API 密钥 | 必填，从你的 API 提供商获取 |
| **模型** | `gpt-4o-mini` / `MiniMax-M3` / `deepseek-chat` 等 | 模型名称 |

⚠️ **重要**：本插件**不内置任何公共服务**，必须在设置里填入你自己的 API 才能使用。

📖 详细配置（多个厂商）：[docs/API-CONFIGURATION.md](docs/API-CONFIGURATION.md)

---

## 🚀 使用方法

### 方式 1：右键菜单

1. 在编辑器里选中要翻译的文字
2. 右键 → **🔬 科研翻译**
3. 弹窗显示：原文 → 译文 → 音标 → 术语备注

### 方式 2：快捷键

`Ctrl/Cmd + Shift + T` —— 翻译当前选中文本

### 方式 3：命令面板

`Ctrl/Cmd + P` → 输入「Translate」 → 回车

### 方式 4：从剪贴板翻译

命令面板 → 「Translate clipboard」

---

## 📸 效果示例

选中：`deep residual learning for image recognition`

弹窗：

```
┌─────────────────────────────────────────────┐
│ 🔬 Scientific Translator                ×  │
├─────────────────────────────────────────────┤
│ 原文                                        │
│ deep residual learning for image recognition│
├─────────────────────────────────────────────┤
│ 译文                                        │
│ 用于图像识别的深度残差学习                  │
├─────────────────────────────────────────────┤
│ 音标                                        │
│ /diːp rɪˈzɪdjuəl ˈlɜːnɪŋ fər ˈɪmɪdʒ ˌrekəɡˈnɪʃn/│
├─────────────────────────────────────────────┤
│ 术语备注                                    │
│ • 残差学习 (residual learning)              │
│   ResNet 提出的核心学习范式，将目标 H(x)    │
│   改为 F(x)+x                               │
├─────────────────────────────────────────────┤
│ [🔊 原文] [🔊 译文] [📋 复制]              │
└─────────────────────────────────────────────┘
```

---

## 📂 项目结构

```
obsidian-scientific-translator/
├── README.md                          ← 你正在看的
├── LICENSE                            ← MIT 协议
├── manifest.json                      ← Obsidian 插件清单
├── main.js                            ← 插件主代码
├── styles.css                         ← 弹窗样式
├── skill/                             ← Claude Code skill 版本（可选）
│   └── SKILL.md                       ← 在 Claude Code 里用
├── docs/
│   ├── INSTALLATION.md                ← 安装指南
│   ├── API-CONFIGURATION.md           ← API 配置详解（含最新厂商）
│   ├── SCIENTIFIC-PROMPT.md           ← Prompt 模板详解
│   ├── KEYBOARD-SHORTCUTS.md          ← 快捷键说明
│   └── TROUBLESHOOTING.md             ← 常见问题
└── examples/
    └── example-workflow.md            ← 使用示例
```

---

## 🔬 Claude Code Skill 版本

本项目同时提供 **Claude Code skill** 版本，放在 `skill/SKILL.md`。

使用方法：
1. 把 `skill/` 目录软链接或复制到 `~/.claude/skills/scientific-translator/`
2. 在 Claude Code 里直接说："用 scientific-translator 翻译这段：xxx"
3. Skill 会调用你配置的同一个 API（环境变量方式）来翻译

📖 详见 [skill/README.md](skill/README.md)

---

## 🛠 常见问题

**Q：弹窗里没显示音标？**
A：模型不一定每次都返回音标。检查设置里「显示音标」是否开启，或在 Prompt 里强调必须输出音标。

**Q：术语翻译不准确？**
A：编辑设置里的 System Prompt，加入你的领域术语对照表。

**Q：API 报错？**
A：参考 [docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md)

**Q：怎么确认我用的 API 调用方式是对的？**
A：本项目用 [Context7](https://context7.com) 校对各厂商最新 API 文档。如果你发现文档过期，可以提 Issue 或直接看：
- OpenAI: https://platform.openai.com/docs/api-reference/chat
- DeepSeek: https://api-docs.deepseek.com/
- Ollama: https://github.com/ollama/ollama/blob/main/docs/api.md

---

## 🤝 贡献

欢迎提交 Issue 和 PR！

特别欢迎：
- 更好的科研翻译 Prompt
- 不同学科的术语表（生物医学、量子物理、法律等）
- TTS 优化（更好的语音）
- Context7 校对后的 API 配置示例

---

## 📜 协议

MIT © 2026 Eitan

---

## 🙏 致谢

- Inspired by [Easy Translator](https://github.com/fargofil/obsidian-easy-translator) and [Chinese Translate](https://github.com/qawatake/obsidian-chinese-translate)
- 用户可配置任意 OpenAI 兼容 API（如 MiniMax-M3、OpenAI、DeepSeek 等）
