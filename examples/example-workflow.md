# 使用示例

## 场景 1：读 ResNet 论文

### 准备
- Obsidian 已装 Scientific Translator
- API 已配置（OpenAI / MiniMax / DeepSeek / 其他）

### 步骤

1. 打开 ResNet 论文笔记（`Deep Residual Learning for Image Recognition.md`）

2. 看到一段不熟悉的术语：
   ```
   When deeper networks are able to start converging, a degradation
   problem has been exposed: with the network depth increasing,
   accuracy gets saturated and then degrades rapidly.
   ```

3. 选中第一句 `degradation problem has been exposed`

4. `Ctrl/Cmd + Shift + T`

5. 弹窗出现：
   ```
   译文：退化问题已被暴露
   音标：/ˌdɛɡrəˈdeɪʃn ˈprɒbləm həz bɪn ɪkˈspoʊzd/
   术语备注：
   • 退化问题 (degradation problem)
     ResNet 论文中提出的核心问题：当网络深度增加时，
     训练误差反而上升的现象。
   ```

6. 你现在知道：这是一个**专有名词**，应该读 `/degradation/`、记成「退化问题」

7. 不放心发音？点 🔊 原文 听一遍

8. 想把术语解释加到笔记？点 📋 复制，粘到 `02_Concepts/Degradation Problem.md` 末尾

---

## 场景 2：批量翻译一段摘要

### 步骤

1. 选中整段 abstract：
   ```
   Deeper neural networks are more difficult to train. We present
   a residual learning framework to ease the training of networks
   that are substantially deeper than those used previously.
   ```

2. `Ctrl/Cmd + Shift + T`

3. 弹窗：
   ```
   译文：更深的神经网络更难训练。我们提出了一个残差学习框架，
         以简化比以往使用的网络明显更深的网络的训练过程。

   术语备注：
   • 残差学习框架 (residual learning framework)
     让网络学习残差 F(x)=H(x)-x 而非完整映射 H(x) 的方法。
   ```

4. 一键复制译文，粘到笔记里作为参考

---

## 场景 3：术语对照表（写进笔记）

### 步骤

1. 选中 `bottleneck`

2. `Ctrl/Cmd + Shift + T`

3. 看到：
   ```
   译文：瓶颈（结构）
   音标：/ˈbɒtlnɛk/
   术语备注：
   • 瓶颈结构 (bottleneck)
     ResNet 中用 1x1 conv 降维 → 3x3 conv → 1x1 conv 升维
     的结构，用于减少计算量。
   ```

4. 把这条术语 + 备注加到 `03_Models/ResNet.md` 的术语表里

---

## 场景 4：复制即翻译（推荐 ⭐）

### 场景
你在 Obsidian 里打开 PDF 读论文，**最快**的翻译方式。

### 步骤

1. 在 PDF 里选中一段英文（比如 "residual learning"）
2. 按 `Ctrl+C` 复制
3. **弹窗自动出现**——显示译文 + 音标 + 术语备注

不用右键，不用命令面板，不用切窗口——**复制即翻译**。

> 这个功能默认开启。如要关闭：Settings → Scientific Translator → 「复制后自动翻译」。

---

## 场景 5：和 Claude Code skill 联动

如果你在 Claude Code 里用 scientific-translator skill（见 [skill/README.md](../skill/README.md)），可以这样：

1. 在 Claude Code 里说："用 scientific-translator 翻译 residual learning"
2. Claude 调 skill → 调你的 API → 翻译 → 输出
3. 同样的 API 配置在 Obsidian 和 Claude Code 里复用

---

## 场景 6：定制 Prompt 给特定论文

### 场景
你在读一篇**量子物理**论文，默认 Prompt 不够用。

### 步骤

1. Settings → Scientific Translator

2. 把 Prompt 替换为：
```
你是量子物理论文翻译助手。术语使用标准中译名。
公式符号（如 |ψ⟩, ⟨ϕ|, Ĥ）保留原样，不翻译。
返回 JSON: {"translation":"...","phonetic":"...","terms":[...]}
```

3. 翻译这篇论文

4. 论文读完后，把 Prompt 改回默认（点「恢复默认 Prompt」按钮）

---

## 场景 7：和 Codex / Claude 协作

### 思路

1. 用本插件翻译论文，建立**术语库**
2. 把术语库喂给 Codex / Claude，让它帮你写综述
3. 写论文时反过来用术语库校准用词

---

## 场景 8：学习发音

### 适用人群

读英文论文不顺手，想顺便练口语。

### 步骤

1. 选中一个长难句：`We hypothesize that the optimization difficulty`
2. `Ctrl/Cmd + Shift + T`
3. 看音标，自己默读一遍
4. 点 🔊 原文，对比系统朗读
5. 反复 3-5 次直到发音一致
6. 一周后你会发现读英文论文顺多了