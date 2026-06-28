# 提交到 Obsidian 官方插件市场

本文档说明如何把 Scientific Translator 提交到 Obsidian 官方插件市场。

---

## 📋 前置条件

- ✅ GitHub 仓库已存在：`R-xGc/obsidian-scientific-translator`
- ✅ 插件已发布至少一个 release（可选但推荐）
- ✅ README 完整
- ✅ manifest.json 和 versions.json 格式正确

---

## 🚀 提交步骤

### 步骤 1：Fork 官方仓库

访问 https://github.com/obsidianmd/obsidian-releases

点右上角 **Fork** 按钮。

你会得到一个自己的副本：`https://github.com/<你的用户名>/obsidian-releases`

### 步骤 2：把本地仓库加到你的 fork

在 fork 后的仓库的 **community-plugins.json** 文件里，**按字母顺序** 添加这一段：

```json
{
  "id": "scientific-translator",
  "name": "Scientific Translator",
  "author": "R-xGc",
  "description": "右键选中翻译，附带音标和科研术语备注，支持任意 OpenAI 兼容 API。专为科研论文（深度学习/AI/CV/NLP）优化。",
  "repo": "R-xGc/obsidian-scientific-translator",
  "branch": "main"
}
```

⚠️ **顺序很重要**：按 id 的字母顺序插到合适位置。`scientific-translator` 应该排在 `scientific-...` 附近的中间位置。

### 步骤 3：添加 versions.json

在 fork 后仓库的根目录创建文件：

```
plugins/scientific-translator/versions.json
```

内容：

```json
{
  "1.0.0": {
    "minAppVersion": "1.4.0",
    "obsidian": {
      "isDesktopOnly": true
    }
  }
}
```

⚠️ **目录名必须是插件 id**：`plugins/scientific-translator/`（不是 plugin name，不是仓库名）。

### 步骤 4：Commit & Push 到 fork

在你的 fork 仓库下：

```bash
cd <你的 fork 目录>
git add community-plugins.json
git add plugins/scientific-translator/versions.json
git commit -m "Add Scientific Translator to community plugins"
git push origin main
```

### 步骤 5：在 fork 仓库页面提交 PR

1. 访问 `https://github.com/<你的用户名>/obsidian-releases`
2. 应该会自动弹出 **"Compare & pull request"** 按钮，点它
3. 标题：`Add Scientific Translator plugin`
4. 描述参考以下模板
5. 点 **Create pull request**

**PR 描述模板**：

```markdown
## Plugin Information

- **Plugin Name**: Scientific Translator
- **Plugin ID**: scientific-translator
- **Author**: R-xGc
- **Repository**: https://github.com/R-xGc/obsidian-scientific-translator
- **Description**: Right-click selected text translation with IPA phonetic notation and scientific terminology notes. Supports any OpenAI-compatible API. Optimized for scientific papers (ML/AI/CV/NLP).
- **License**: MIT

## Self-Check

- [x] Plugin follows Obsidian plugin guidelines
- [x] manifest.json is valid (id, name, version, minAppVersion, description, author, isDesktopOnly)
- [x] Plugin has been tested locally
- [x] Repository is public
- [x] README explains installation and usage
- [x] No paid services or required API keys that aren't user's own

## Notes

This plugin is "bring your own API" — no paid services bundled. Users must configure their own OpenAI-compatible API (OpenAI, DeepSeek, Ollama, etc.).
```

---

## ⏰ 审核流程

- 通常 **1-3 周**会有官方人员 review
- 可能需要按反馈修改
- 审核通过后会自动出现在 Obsidian 的 Community plugins 浏览器里
- 之后每次发新版本，只要更新 versions.json 即可

---

## 🔄 发布新版本

发新版本时：

1. 在你 GitHub 仓库的 release 页创建一个新 tag：
   ```bash
   git tag 1.0.1
   git push origin 1.0.1
   ```
2. 在 https://github.com/R-xGc/obsidian-scientific-translator/releases 点 **Create release from tag**
3. 更新本仓库的 `versions.json`（加 1.0.1 条目）
4. PR 到 obsidian-releases 更新 `versions.json`

---

## 🎨 可选优化（让审核更容易通过）

### 加图标

Obsidian 插件市场显示一个图标。在你仓库根目录加一个 `icon.png`（建议 256×256 px）。

### 加 banner

README 顶部用 GitHub 仓库自带的 `social-preview.png`（1280×640）。

### 加 GitHub topics

在仓库页面点 `About` 齿轮 → topics：
- `obsidian`
- `obsidian-plugin`
- `translation`
- `scientific`
- `openai`
- `claude-code-skill`

---

## ❌ 审核被拒的常见原因

1. **manifest.json 格式不对** —— 用 https://jsonlint.com 验证
2. **没有 README** —— 必须有
3. **包含付费服务** —— 我们已经设计为「bring your own API」，没问题
4. **minAppVersion 太低** —— 我们写的 1.4.0，足够现代
5. **isDesktopOnly 漏标** —— 我们已经标了 true（因为 TTS 是桌面端特性）

我们这个插件应该审核友好，已经避免了所有常见雷区。

---

## 📚 参考资料

- 官方提交指南：https://docs.obsidian.md/Plugins/Getting+started/Submit+a+plugin+review
- community-plugins.json 示例：https://github.com/obsidianmd/obsidian-releases/blob/master/community-plugins.json
- 格式参考：https://github.com/obsidianmd/obsidian-releases/blob/master/plugins/obsidian-tasks/versions.json