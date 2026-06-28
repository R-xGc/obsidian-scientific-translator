# Scientific Translator Skill (Claude Code)

这是 `obsidian-scientific-translator` 项目配套的 **Claude Code skill** 版本。

Obsidian 插件和 Claude Code skill **共用同一份 API 配置**，你只需要在两个地方用同一个 key 即可。

---

## 📦 安装到 Claude Code

### 方式 1：复制 skill 文件夹（推荐）

```bash
# Windows (Git Bash)
cp -r "C:/Users/zm415/obsidian-scientific-translator/skill" \
      "C:/Users/zm415/.claude/skills/scientific-translator"
```

```bash
# macOS / Linux
cp -r ~/projects/obsidian-scientific-translator/skill \
      ~/.claude/skills/scientific-translator
```

重启 Claude Code，skill 就生效了。

### 方式 2：符号链接（开发用，改了能立刻生效）

```bash
# Windows (Git Bash)
ln -s "C:/Users/zm415/obsidian-scientific-translator/skill" \
      "C:/Users/zm415/.claude/skills/scientific-translator"
```

```bash
# macOS / Linux
ln -s ~/projects/obsidian-scientific-translator/skill \
      ~/.claude/skills/scientific-translator
```

---

## ⚙️ 配置环境变量

skill 在调用时会读这 3 个环境变量：

```bash
# Windows PowerShell
$env:SCIENTIFIC_TRANSLATOR_API_URL = "https://api.openai.com/v1"
$env:SCIENTIFIC_TRANSLATOR_API_KEY = "sk-..."
$env:SCIENTIFIC_TRANSLATOR_MODEL = "gpt-4o-mini"

# Windows Git Bash
export SCIENTIFIC_TRANSLATOR_API_URL="https://api.openai.com/v1"
export SCIENTIFIC_TRANSLATOR_API_KEY="sk-..."
export SCIENTIFIC_TRANSLATOR_MODEL="gpt-4o-mini"

# macOS / Linux (加到 ~/.bashrc 或 ~/.zshrc)
export SCIENTIFIC_TRANSLATOR_API_URL="https://api.openai.com/v1"
export SCIENTIFIC_TRANSLATOR_API_KEY="sk-..."
export SCIENTIFIC_TRANSLATOR_MODEL="gpt-4o-mini"
```

支持的厂商：参考 [../docs/API-CONFIGURATION.md](../docs/API-CONFIGURATION.md)
- OpenAI
- MiniMax-M3
- DeepSeek
- Ollama（本地）
- Azure OpenAI
- 智谱 GLM
- 通义千问 Qwen
- 自定义 OpenAI 兼容服务

---

## 🚀 使用方法

在 Claude Code 里直接说：

```
用 scientific-translator 翻译这段：residual learning for image recognition
```

或者：

```
帮我翻译这句论文术语：shortcut connection
```

skill 会自动调用你的 API，返回带音标 + 术语备注的翻译。

---

## 🔄 和 Obsidian 插件的关系

| 工具 | 用途 | 调用方式 |
|---|---|---|
| **Obsidian 插件** | 笔记里选中 → 右键翻译 | GUI 弹窗 |
| **Claude Code skill** | 在 Claude Code 里说"翻译 xxx" | 对话式 |

两者用同一个 API key，输出格式一致（JSON: translation + phonetic + terms）。

你可以一边在 Obsidian 里读论文，一边在 Claude Code 里用 skill 翻译大段文字。

---

## 🧪 测试

```bash
# 在 Claude Code 里输入：
用 scientific-translator 翻译：deep residual learning
```

应该返回：

```
## 🔬 翻译结果

**原文**：deep residual learning

**译文**：深度残差学习

**音标**：/diːp rɪˈzɪdjuəl ˈlɜːnɪŋ/

**术语备注**：
- 深度残差学习 (deep residual learning)：...
```

如果返回 `⚠️ 环境变量未配置`，说明配置有问题，参考上方「配置环境变量」一节。

---

## 📝 自定义 Prompt

如果默认 Prompt（深度学习方向）不够用，可以：

1. 编辑 `~/.claude/skills/scientific-translator/SKILL.md`
2. 找到 `## 📋 SYSTEM PROMPT` 段落
3. 替换成你学科的版本（生物医学、量子物理、法学等）

参考 [../docs/SCIENTIFIC-PROMPT.md](../docs/SCIENTIFIC-PROMPT.md) 里的模板。

---

## 🔧 故障排查

### skill 没被 Claude 识别

- 确认 `~/.claude/skills/scientific-translator/SKILL.md` 存在
- 确认文件 frontmatter 有 `name: scientific-translator`
- 重启 Claude Code

### 翻译返回空

- 检查 3 个环境变量都设置了
- 在终端里手动跑一下 curl 测试 API 是否通
- 温度不要设成 0（部分 API 会卡）

### 翻译质量差

- 换个更强的模型（如从 `gpt-4o-mini` 升到 `gpt-4o`）
- 编辑 SYSTEM PROMPT 加自定义术语表

---

## 🆚 跟 Obsidian 插件的功能对比

| 功能 | Obsidian 插件 | Claude Code skill |
|---|---|---|
| 右键翻译 | ✅ | ❌ |
| 弹窗 UI | ✅ | ❌（对话式） |
| 批量翻译 | ⚠️（手动多次） | ✅（一次给长文本） |
| TTS 读音 | ✅ | ⚠️（需手动复制到浏览器） |
| 自定义 Prompt | ✅ | ✅ |
| 多 API 支持 | ✅ | ✅ |
| API 配置方式 | 图形界面 | 环境变量 |

两者互补，按场景选用。