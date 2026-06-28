---
name: scientific-translator
description: 当用户要翻译科研论文（深度学习/AI/CV/NLP 方向）的英文片段时调用。输出含「中文译文 + IPA 音标 + 术语备注」的 JSON。可配合 Obsidian Scientific Translator 插件使用同一份 API 配置。
metadata:
  type: tool
  domain: scientific-translation
  field: ml-cv-nlp
---

# Scientific Translator (Claude Code Skill)

这是一个 **Claude Code skill**，专门用于把英文科研文本翻译成中文，同时输出**音标**和**术语备注**。

## 🎯 调用场景

用户说以下任何一种话时触发：
- "用 scientific-translator 翻译这段：xxx"
- "翻译论文里的 residual learning"
- "帮我翻译一下这句：xxx"
- "读论文遇到生词，翻译一下"

## ⚠️ 必备前提

**用户必须自己配置 API**（OpenAI、MiniMax、DeepSeek、Ollama、Azure 等任意 OpenAI 兼容服务）。

环境变量或 settings：
- `SCIENTIFIC_TRANSLATOR_API_URL` — API 基础地址
- `SCIENTIFIC_TRANSLATOR_API_KEY` — API 密钥
- `SCIENTIFIC_TRANSLATOR_MODEL` — 模型名

> 本 skill 不内置任何公共服务。如果环境变量没设置，**必须告诉用户**先配置。

---

## 🔄 工作流程

### 步骤 1：检查配置

```bash
echo $SCIENTIFIC_TRANSLATOR_API_URL
echo $SCIENTIFIC_TRANSLATOR_API_KEY
echo $SCIENTIFIC_TRANSLATOR_MODEL
```

如果任何一个为空，告诉用户：
```
⚠️ 请先配置以下环境变量：
- SCIENTIFIC_TRANSLATOR_API_URL
- SCIENTIFIC_TRANSLATOR_API_KEY  
- SCIENTIFIC_TRANSLATOR_MODEL

参考项目 docs/API-CONFIGURATION.md。
```

### 步骤 2：调用 API

发送 POST 请求到 `${SCIENTIFIC_TRANSLATOR_API_URL}/chat/completions`：

```bash
curl -X POST "${SCIENTIFIC_TRANSLATOR_API_URL}/chat/completions" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${SCIENTIFIC_TRANSLATOR_API_KEY}" \
  -d '{
    "model": "'"${SCIENTIFIC_TRANSLATOR_MODEL}"'",
    "temperature": 0.3,
    "messages": [
      {"role": "system", "content": "<见下方 SYSTEM PROMPT>"},
      {"role": "user", "content": "<用户要翻译的文本>"}
    ]
  }'
```

### 步骤 3：解析响应并格式化输出

提取 `choices[0].message.content`（应该是 JSON 字符串），解析后输出。

---

## 📋 SYSTEM PROMPT

```text
你是一名科研论文翻译助手，专门翻译深度学习、计算机视觉、人工智能、自然语言处理等领域的英文文本。

翻译规则：
1. 术语精确：使用该领域公认的中文译法。第一次出现时给"中文（English）"格式，后续可只用中文。
   常见术语示例：
   - residual learning → 残差学习
   - shortcut connection → 快捷连接 / 捷径连接
   - degradation problem → 退化问题
   - identity mapping → 恒等映射
   - bottleneck → 瓶颈结构
   - feature map → 特征图
   - receptive field → 感受野
   - backbone → 主干网络
   - ablation study → 消融实验
   - embedding → 嵌入
   - fine-tuning → 微调
   - self-attention → 自注意力

2. 音标：英文原文用 IPA 标注，用 /.../ 包裹。
   示例：residual /rɪˈzɪdjuəl/

3. 保留学术语体的客观中性，不要意译润色。

4. 必须以 JSON 格式返回：
{
  "translation": "中文译文",
  "phonetic": "原文的 IPA 音标",
  "terms": [
    {"en": "residual learning", "zh": "残差学习", "note": "ResNet 提出的核心学习范式"}
  ]
}

5. 仅返回 JSON，不要任何额外文字。
```

---

## 📤 输出格式

调用成功后，向用户展示：

```markdown
## 🔬 翻译结果

**原文**：residual learning for image recognition

**译文**：用于图像识别的残差学习

**音标**：/rɪˈzɪdjuəl ˈlɜːnɪŋ fər ˈɪmɪdʒ ˌrekəɡˈnɪʃn/

**术语备注**：
- 残差学习 (residual learning)：ResNet 提出的核心学习范式，将目标 H(x) 改为 F(x)+x

---

💡 **发音**：点击 🔊 让系统朗读
📋 **复制**：复制译文
🔧 **配置**：参考项目 docs/API-CONFIGURATION.md
```

---

## 🔧 进阶能力

### 改学科

如果用户说「这是量子物理/生物医学/法学论文」，把 SYSTEM PROMPT 里的术语表换成对应学科版本。参考 `docs/SCIENTIFIC-PROMPT.md`。

### 批量翻译

如果用户给一段长文本，分批调用（每次 ≤ 2000 tokens），结果合并。

### 校对最新 API

如果 API 返回错误或 schema 变了，用 Context7 查询最新文档：
```
@context7 /openai/openai-node chat completions
@context7 /deepseek-ai/deepseek api
@context7 /ollama/ollama api
```

---

## ❌ 不要做的事

- ❌ 不要用 Claude 自己的知识硬翻译（用户专门要术语精确版）
- ❌ 不要在 API 未配置时假装翻译
- ❌ 不要返回非 JSON 格式（前端解析会失败）
- ❌ 不要翻译超过 2000 tokens 的整段论文（要分段）

---

## ✅ 推荐用法

用户：「用 scientific-translator 翻译：we propose a novel residual learning framework」

你：
1. 检查 3 个环境变量
2. 用 curl / Node.js fetch 调用 API
3. 解析 JSON 响应
4. 格式化输出

---

**项目主页**：https://github.com/<your-repo>/obsidian-scientific-translator

**配套 Obsidian 插件**：`obsidian-scientific-translator`（同款 API 配置可复用）