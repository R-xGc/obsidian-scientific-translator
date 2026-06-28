## 🎉 v0.0.1 — 首发内测版

专为**科研论文阅读**设计的 Obsidian 翻译插件。选中术语 → 右键 → 弹窗显示「**译文 + IPA 音标 + 术语备注 + 读音**」，针对深度学习 / AI / CV / NLP 领域深度优化。

### ✨ 核心特性

| 特性 | 说明 |
|---|---|
| 🖱️ **右键翻译** | 选中文字 → 右键 → 「🔬 科研翻译」，弹窗显示结果 |
| 🔤 **IPA 音标** | 自动附带国际音标，方便学习术语发音 |
| 📚 **术语备注** | 模型识别专业术语时附带简短解释 |
| 🔊 **朗读原文 / 译文** | 浏览器 TTS 朗读，按钮一键发音 |
| 📄 **PDF 翻译** | PDF 阅读视图右键翻译（带剪贴板 fallback） |
| 🖱️ **可拖动弹窗** | 按住标题栏拖动，点击外部关闭 |
| 🎨 **玻璃磨砂 UI** | 现代化玻璃质感界面 |
| 🔌 **必须接入自己的 API** | 支持任意 OpenAI 兼容 API |

### 📥 安装

3 种压缩包可选：

| 文件 | 适用 |
|---|---|
| `scientific-translator-0.0.1.zip` | Windows |
| `scientific-translator-0.0.1.tar.gz` | Linux / macOS |
| `scientific-translator-0.0.1.tar` | 兼容老系统 |

解压得到 3 个文件（`main.js` / `manifest.json` / `styles.css`），复制到：

```
<你的 vault>/.obsidian/plugins/scientific-translator/
```

重启 Obsidian → Settings → Community plugins → 启用 **Scientific Translator**。

### ⚙️ 配置 API

⚠️ 插件**不内置任何公共服务**，需要接入你自己的 OpenAI 兼容 API（推荐 DeepSeek：便宜 + 中文强）：

| 字段 | 示例 |
|---|---|
| API URL | `https://api.deepseek.com/v1` |
| API Key | `sk-你的 key` |
| 模型 | `deepseek-chat` |

也支持：OpenAI / MiniMax / Ollama / Azure / 智谱 GLM / 通义千问 等。

详见 [API 配置文档](https://github.com/R-xGc/obsidian-scientific-translator/blob/main/docs/API-CONFIGURATION.md)

### 📚 完整文档

- [README](https://github.com/R-xGc/obsidian-scientific-translator)
- [安装指南](https://github.com/R-xGc/obsidian-scientific-translator/blob/main/docs/INSTALLATION.md)
- [API 配置](https://github.com/R-xGc/obsidian-scientific-translator/blob/main/docs/API-CONFIGURATION.md)
- [故障排查](https://github.com/R-xGc/obsidian-scientific-translator/blob/main/docs/TROUBLESHOOTING.md)

### 💡 为什么自建 API

- ✅ **隐私安全** — 你的论文内容不经过第三方
- ✅ **专业优化** — 科研翻译 Prompt 针对 ML/CV/NLP 领域调优
- ✅ **成本可控** — DeepSeek 约 1 元 / 100 万 tokens，几乎免费
- ✅ **灵活切换** — 任何 OpenAI 兼容服务都能用

### 🌟 项目状态

- 🎨 **UI**: 玻璃磨砂质感，圆角 18px，主题自适应
- 🖱️ **交互**: 可拖动 + 点击外部关闭 + ESC 关闭
- 📄 **PDF**: 右键菜单 + 剪贴板 fallback（两种方式）
- 🔧 **可扩展**: 内置科研翻译 Prompt，可自定义任意学科

欢迎试用，欢迎反馈！