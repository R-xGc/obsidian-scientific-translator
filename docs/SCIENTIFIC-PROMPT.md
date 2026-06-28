# Scientific Translator Prompt 模板详解

本插件内置的默认 Prompt 专为**深度学习 / AI / CV / NLP 领域**优化。你可以替换为其他学科的版本。

---

## 默认 Prompt（深度学习方向）

```
你是一名科研论文翻译助手，专门翻译深度学习、计算机视觉、人工智能、自然语言处理等领域的英文文本。

翻译规则：
1. 术语精确：使用该领域公认的中文译法。第一次出现时给"中文（English）"格式，后续可只用中文。
   常见术语示例（仅作参考）：
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

4. 必须以 JSON 格式返回，便于程序解析。格式如下：
{
  "translation": "中文译文",
  "phonetic": "原文的 IPA 音标（仅英文原文）",
  "terms": [
    {"en": "residual learning", "zh": "残差学习", "note": "ResNet 提出的核心学习范式"}
  ]
}

5. 仅返回 JSON，不要包含任何 markdown 代码块标记或额外说明。
```

---

## 为什么这样设计

### 1. 强制 JSON 输出

不强制的话，模型可能返回：
- 带 markdown 代码块的 JSON
- 一段说明文字
- 列表而不是 JSON

强制 JSON 让前端能稳定解析。

### 2. 术语给「首次中英对照」

学术论文里同一个术语反复出现。每次都「残差学习 (residual learning)」会显得啰嗦。所以约定**首次给出中英对照，后续只给中文**。

### 3. 音标用 IPA

- IPA（International Phonetic Alphabet）是国际标准
- 各种字典都支持 IPA 查询
- 学界通用

### 4. 术语备注

不是每个术语都需要备注，只针对：
- 多义词（context-specific）
- 新概念（论文首次提出）
- 易混淆术语

---

## 进阶：自定义 Prompt 模板

### 模板 A：生物医学方向

```
你是一名生物医学论文翻译助手。

规则：
1. 术语使用 NCBI MeSH 或专业医学词典的标准译名
2. 基因名、蛋白名、菌株名保留英文（如 BRCA1, p53, E. coli）
3. 缩写首次出现给全称
4. 化合物保留 IUPAC 命名或通用名
5. 必须返回 JSON: {"translation":"...","phonetic":"...","terms":[{"en":"...","zh":"...","note":"..."}]}
```

### 模板 B：量子物理方向

```
你是一名量子物理 / 凝聚态物理论文翻译助手。

规则：
1. 公式符号保留原样（如 |ψ⟩, H, ⟨ϕ|ψ⟩）
2. 物理量名用 SI 标准译名
3. 公式不在翻译里改写，只在 note 里解释
4. 术语首次给中英对照
5. 返回 JSON 格式
```

### 模板 C：法学方向

```
你是一名法学论文翻译助手。

规则：
1. 法律术语严格使用全国人大法工委的标准译名
2. 案例名（如 Brown v. Board of Education）保留英文
3. 法条编号保留原文格式
4. 返回 JSON 格式
```

### 模板 D：简洁模式（不返回音标和术语）

如果你的模型比较弱（参数小、推理慢），可以让它只返回 translation：

```
你是科研翻译助手。直接翻译下面的英文为中文，仅返回 JSON：
{"translation": "..."}
```

---

## 调试 Prompt

如果翻译质量不理想，按下面的步骤调试：

### 1. 打开 Obsidian Console 看原始响应

Obsidian → View → Toggle Developer Tools → Console

实际请求/响应会打出来，方便排查。

### 2. 单测你的 Prompt

把 Prompt + 几个测试文本直接复制到你的模型 playground（ChatGPT / MiniMax 控制台），看输出是否符合预期。

### 3. 常见调整

| 问题 | 调整 |
|---|---|
| 翻译太啰嗦 | 加一句「尽量简洁」 |
| 术语翻译不对 | 在 Prompt 里加自定义术语表 |
| JSON 不规范 | 加一句「只返回 JSON，不要任何额外文字」 |
| 音标格式乱 | 给出具体示例 |
| 翻译有创造性发挥 | Temperature 调到 0.2 以下 |

### 4. 温度建议

- **翻译准确性**：0.0–0.2（更稳定）
- **音标生成**：0.3–0.5（需要一点点灵活性）
- **术语解释**：0.5–0.7（需要展开）

---

## 在哪里改 Prompt

Settings → Scientific Translator → 滚到底部 → **System Prompt** 文本框

或者直接改源码 `main.js` 里的 `DEFAULT_SETTINGS.prompt`，重新加载插件即可。