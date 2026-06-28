# API 配置详解

本插件支持**任意 OpenAI 兼容的 chat completions 接口**。下面给出多种厂商的最新配置示例。

> 📌 **文档校对方式**：本项目用 [Context7](https://context7.com) 校对各厂商最新 API 调用方式。如果你发现某条配置过期，欢迎提 Issue。

---

## 配置入口

Obsidian → Settings → Scientific Translator

需要填写的字段：

| 字段 | 必填 | 说明 |
|---|---|---|
| API URL | ✅ | 接口基础地址（不含 `/chat/completions`） |
| API Key | ✅ | 你的密钥 |
| 模型 | ✅ | 模型名称 |

⚠️ 默认值是占位符（`<YOUR_API_KEY>` 等），**必须替换**才能用。

---

## 配置 1：OpenAI（最常见）

```yaml
API URL:  https://api.openai.com/v1
API Key:  sk-proj-xxxxxxxxxxxxxxxx
模型:     gpt-4o-mini     # 或 gpt-4o / gpt-3.5-turbo
```

**官方文档**：https://platform.openai.com/docs/api-reference/chat/create

**典型请求体**：
```json
{
  "model": "gpt-4o-mini",
  "messages": [
    {"role": "system", "content": "你是科研翻译助手..."},
    {"role": "user", "content": "residual learning"}
  ],
  "temperature": 0.3
}
```

**成本参考（2026 年）**：
- gpt-4o-mini 输入：~$0.15 / 1M tokens
- 一次论文术语翻译 ≈ 100-500 tokens，**单次成本极低**

---

## 配置 2：MiniMax-M3（默认推荐）

⚠️ **MiniMax 真实 endpoint 需要去 MiniMax 官方控制台 / 文档查**——本 README 不假定。

```yaml
API URL:  <YOUR_MINIMAX_ENDPOINT>      # 例如 https://api.minimaxi.com/v1
API Key:  <YOUR_MINIMAX_KEY>
模型:     MiniMax-M3
```

**典型调用**（参考 OpenAI 格式）：
```bash
curl <YOUR_MINIMAX_ENDPOINT>/chat/completions \
  -H "Authorization: Bearer <YOUR_MINIMAX_KEY>" \
  -H "Content-Type: application/json" \
  -d '{"model":"MiniMax-M3","messages":[{"role":"user","content":"..."}]}'
```

---

## 配置 3：DeepSeek

DeepSeek 的 API 也是 OpenAI 兼容格式，国内访问稳定。

```yaml
API URL:  https://api.deepseek.com/v1
API Key:  sk-...
模型:     deepseek-chat       # 或 deepseek-reasoner（带推理）
```

**官方文档**：https://api-docs.deepseek.com/

**优势**：
- 中文能力强（训练数据包含大量中文）
- 价格极低（≈ 1 元 / 1M tokens）
- 支持 reasoning 模型（翻译时可以解释为什么这么译）

---

## 配置 4：本地 Ollama

如果你本地跑着 Ollama：

```yaml
API URL:  http://localhost:11434/v1
API Key:  ollama           # Ollama 不校验 key，随便填
模型:     llama3.2         # 或 qwen2.5, deepseek-r1, gemma2 等
```

**官方文档**：https://github.com/ollama/ollama/blob/main/docs/api.md

**典型调用**（Ollama 兼容 OpenAI 格式）：
```bash
curl http://localhost:11434/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{"model":"llama3.2","messages":[{"role":"user","content":"..."}]}'
```

⚠️ 本地模型科研翻译质量可能不如云端大模型，但**完全免费 + 隐私**。推荐 `qwen2.5:7b` 或 `deepseek-r1:7b`。

---

## 配置 5：Azure OpenAI

```yaml
API URL:  https://<your-resource>.openai.azure.com/openai/deployments/<your-deployment>
API Key:  <your-azure-key>
模型:     <your-deployment-name>
```

**官方文档**：https://learn.microsoft.com/azure/ai-services/openai/reference

⚠️ Azure 路径特殊：
- 必须含 `/openai/deployments/<deployment-name>`
- 不需要末尾 `/v1`
- API Key 是 Azure 的 key，不是 OpenAI 的

**典型调用**：
```bash
curl "https://<resource>.openai.azure.com/openai/deployments/<dep>/chat/completions?api-version=2024-08-01-preview" \
  -H "api-key: <your-azure-key>" \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"..."}]}'
```

---

## 配置 6：通义千问（Qwen）

```yaml
API URL:  https://dashscope.aliyuncs.com/compatible-mode/v1
API Key:  sk-...
模型:     qwen-plus       # 或 qwen-turbo, qwen-max, qwen-long
```

**官方文档**：https://help.aliyun.com/zh/model-studio/developer-reference/use-qwen-by-calling-api

---

## 配置 7：智谱 GLM

```yaml
API URL:  https://open.bigmodel.cn/api/paas/v4
API Key:  <your-zhipu-key>
模型:     glm-4-plus      # 或 glm-4-flash, glm-4-air
```

**官方文档**：https://bigmodel.cn/dev/api/normal-model/glm-4

---

## 配置 8：自定义 OpenAI 兼容服务

如果你自己部署了 vLLM、TGI、LM Studio、LocalAI 等：

```yaml
API URL:  http://localhost:8000/v1     # 或你的服务地址
API Key:  <your-key>                    # 没设就填任意值
模型:     <your-model-name>
```

只要服务实现了 `/v1/chat/completions` 端点（OpenAI 兼容），就能用。

---

## 🔐 安全建议

1. **不要把 API Key 提交到 Git 仓库**
   - 本插件把 API Key 存在 `.obsidian/plugins/scientific-translator/data.json`
   - `.gitignore` 已包含 `data.json`
   - 但如果你 commit 了整个 vault，请手动检查

2. **使用最小权限的 Key**
   - 大多数 API 允许你为单个应用生成独立 key
   - 用完可以单独 revoke

3. **考虑设置消费上限**
   - OpenAI / DeepSeek / Qwen 等都允许设置月度上限
   - 避免意外超额

---

## 🔧 故障排查

### 报错 "401 Unauthorized"
- API Key 错误或已过期
- 检查 key 是否带空格、换行

### 报错 "404 Not Found"
- API URL 错误或模型名拼错
- 检查是否漏了 `/v1`
- 检查模型是否在该 endpoint 下可用

### 报错 "429 Too Many Requests"
- 触发速率限制
- 等几秒再试，或升级套餐

### 报错 "CORS"
- 浏览器策略问题
- 几乎所有正规 API 都已配置 CORS
- 如果遇到，多半是自建 API 没配 CORS 头

### 弹窗显示"API 返回内容为空"
- 模型返回了空字符串
- 检查 prompt 是否太长（超过模型 context）
- 试试把 Temperature 调到 0

---

## 🧪 用 Context7 校对最新文档

如果你想确认某个厂商最新的 API 调用方式（路径、参数、错误码等）：

1. 安装 Context7（VSCode、Cursor 等都有插件）
2. 在编辑器里调用：
   ```
   @context7 /openai/openai-node chat completions
   @context7 /ollama/ollama api
   @context7 /deepseek-ai/deepseek api
   ```
3. Context7 会返回最新的官方代码示例

或者在 Claude Code 里直接说"用 context7 查 MiniMax 最新 API"，AI 会调用 context7 MCP 工具拿最新文档。