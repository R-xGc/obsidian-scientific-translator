# 故障排查

## 安装问题

### 启用插件后没看到菜单项

**症状**：右键看不到「🔬 科研翻译」

**排查步骤**：
1. 确认插件已启用：Settings → Community plugins → Scientific Translator 右侧开关是开的
2. 确认文件位置正确：
   ```
   .obsidian/plugins/scientific-translator/
     ├── main.js
     ├── manifest.json
     └── styles.css
   ```
3. 重启 Obsidian（完全退出再打开）
4. 查看 Console 报错：View → Toggle Developer Tools → Console

---

### 报错 "Cannot find module 'obsidian'"

**原因**：main.js 缺少 obsidian 模块引用

**解决**：本插件的 main.js 已经内置 obsidian 模块引用（通过 `require('obsidian')`），如果仍然报错：
- 检查 manifest.json 的 `minAppVersion` 是否满足（1.4.0+）
- 完全卸载插件再重装

---

## 配置问题

### 弹窗提示「请先在设置中配置 API（占位符必须替换）」

**原因**：默认设置里都是占位符（`<YOUR_API_KEY>` 等），必须填入真实值。

**解决**：
1. Settings → Scientific Translator
2. 把 `<YOUR_API_BASE_URL>` 改成实际 API 地址（如 `https://api.openai.com/v1`）
3. 把 `<YOUR_API_KEY>` 改成你的真实密钥
4. 把 `<YOUR_MODEL_NAME>` 改成实际模型名（如 `gpt-4o-mini`）
5. 关闭再打开一次设置确保保存

---

## API 问题

### 401 Unauthorized

```json
{"error": {"message": "Incorrect API key provided"}}
```

**原因**：API Key 错误或过期

**解决**：
- 重新生成 API Key
- 复制时**不要带空格或换行**
- 部分 API Key 大小写敏感

---

### 404 Not Found

```json
{"error": {"message": "model not found"}}
```

**原因**：API URL 或模型名错误

**解决**：
- 检查 API URL 是否漏了 `/v1`
- 检查模型名拼写
- 不同厂商模型名不一样：OpenAI 用 `gpt-4o-mini`，DeepSeek 用 `deepseek-chat`，Ollama 用 `llama3.2`

---

### 429 Too Many Requests

**原因**：触发速率限制

**解决**：
- 等几秒再试
- 升级 API 套餐
- 减少调用频率

---

### 500 / 502 / 503 服务端错误

**原因**：API 服务端问题

**解决**：
- 等几分钟再试
- 查看 API 状态页
- 切换到备用模型

---

## 显示问题

### 弹窗位置不对（看不到）

**原因**：弹窗定位逻辑在你的屏幕分辨率下偏移

**解决**：
- 暂时：可以拖动窗口（如果你修改了 CSS）
- 永久：编辑 `styles.css` 里的 `top` 和 `left`，改成更合理的值

---

### 音标没显示

**可能原因**：
1. 模型没返回音标
2. 设置里「显示音标」被关了

**解决**：
1. Settings → Scientific Translator → 确认「显示音标」开关开着
2. 检查 Prompt：是否明确要求模型返回音标
3. 试试换个更强的模型（mini 模型可能不会拼 IPA）

---

### 术语备注没显示

**同上**，检查设置里「显示术语备注」开关 + Prompt 提示。

---

### 弹窗里出现奇怪字符

**原因**：HTML 转义问题

**解决**：在 Console 里看实际响应，可能是 Prompt 写的不规范导致模型返回 markdown 包裹的 JSON。

---

## 性能问题

### 翻译很慢

**可能原因**：
1. 模型本身慢（大模型、长 context）
2. 网络延迟
3. 选中文本太长

**优化**：
- 用更小的模型（如 gpt-4o-mini）
- 设置里调小 `最大输入长度`
- 检查网络

---

### 弹窗卡住不动

**症状**：弹窗一直显示「⏳ 翻译中…」

**排查**：
- 打开 Console 看请求是否发出
- 检查 API 是否超时
- 设置里 Temperature 不要调到 0（部分 API 在 0 温度下会卡）

---

## TTS 读音问题

### 朗读没声音

**可能原因**：
1. 系统没装对应语言的语音包
2. 浏览器策略阻止了自动播放（部分 Obsidian 版本）

**解决**：
- Windows：设置 → 时间和语言 → 语言 → 添加英语/中文语音
- macOS：系统偏好设置 → 辅助功能 → 语音 → 自定义
- Linux：安装 `espeak` 或 `festival`

---

### 音质差

**原因**：系统 TTS 是机械合成音

**解决**：
- 安装更好的语音包（Microsoft 自然语音、Google Noto 语音）
- 或使用云端 TTS 服务（Azure / Google Cloud TTS）

---

## 数据问题

### 我换电脑后配置没了

**原因**：插件配置存在 vault 的 `.obsidian/plugins/scientific-translator/data.json`

**解决**：
- 用 Obsidian Sync 自动同步
- 或手动备份这个文件
- **注意**：API Key 也会被同步，请确保 vault 不会被泄露到公开仓库

---

### Prompt 改回去默认

**操作**：Settings → Scientific Translator → 滚到底部 → 点 **恢复默认 Prompt**

---

## 反馈问题

遇到上面没列出的问题？

请开 Issue 并附上：
1. Obsidian 版本（Help → About）
2. 插件版本（Settings → Community plugins）
3. 模型和 API 服务
4. 复现步骤
5. Console 截图

---

## 调试技巧

### 打开 Console

Obsidian → View → Toggle Developer Tools → Console

### 看实际请求/响应

在 `main.js` 的 `callAPI` 函数里加 `console.log(resp)`，重新加载插件后看 Console。

### 单测 API

直接用 curl 测试你的 API：

```bash
# OpenAI 示例
curl https://api.openai.com/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer sk-..." \
  -d '{
    "model": "gpt-4o-mini",
    "messages": [{"role":"user","content":"translate: residual learning"}]
  }'

# DeepSeek 示例
curl https://api.deepseek.com/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer sk-..." \
  -d '{
    "model": "deepseek-chat",
    "messages": [{"role":"user","content":"translate: residual learning"}]
  }'
```

### 用 Context7 查最新文档

如果你发现 API 文档可能过期，用 Context7 查询：

```
@context7 /openai/openai-node chat completions
@context7 /deepseek-ai/deepseek api reference
@context7 /ollama/ollama rest api
```