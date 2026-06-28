# 安装指南

本文详细说明如何安装 Scientific Translator。

## 前置要求

- Obsidian **1.4.0** 或更高版本
- 桌面端（Windows / macOS / Linux）
- 一个 OpenAI 兼容的 API（**必须由你自己提供**）

---

## 方式 1：从 Release 安装（推荐新手）

### 步骤 1：下载插件

前往 [Releases](../../releases) 页面，下载最新版本的 ZIP 包，例如：
```
scientific-translator-1.0.0.zip
```

### 步骤 2：解压到正确位置

解压 ZIP，得到：
```
scientific-translator/
├── main.js
├── manifest.json
└── styles.css
```

把这 3 个文件复制到你的 Obsidian vault 的插件目录：
```
<你的 vault>/.obsidian/plugins/scientific-translator/
```

**如何找到 vault 目录？**
- Obsidian → 左下角齿轮 → About → 看到 "Vault path" 就是

**Windows 路径示例：**
```
C:\Users\YourName\Documents\MyVault\.obsidian\plugins\scientific-translator\
```

**macOS 路径示例：**
```
/Users/YourName/Documents/MyVault/.obsidian/plugins/scientific-translator/
```

### 步骤 3：重启 Obsidian

完全退出再重新打开（不是最小化）。

### 步骤 4：启用插件

1. Obsidian → Settings（左下角齿轮）
2. Community plugins → 关闭 Restricted mode（如果开着）
3. 在已安装插件列表里找到 **Scientific Translator**
4. 点右侧的开关启用

### 步骤 5：配置 API

⚠️ **必须填入你自己的 API**——参考 [API-CONFIGURATION.md](API-CONFIGURATION.md) 了解各厂商的配置方式。

默认设置里都是占位符：
- `<API_BASE_URL>`
- `<API_KEY>`
- `<MODEL_NAME>`

填好后才能用。

---

## 方式 2：从源码构建（适合开发者）

需要 Node.js 16+。

```bash
git clone https://github.com/<your-repo>/obsidian-scientific-translator.git
cd obsidian-scientific-translator

npm install
npm run build
```

构建产物在 `dist/` 或根目录的 `main.js` + `manifest.json` + `styles.css`。

把这 3 个文件复制到 vault 的插件目录（同方式 1）。

---

## 方式 3：手动安装（无构建工具）

如果你不想用 npm 构建，本仓库已经提供了**预编译的 `main.js`**，你只需要：

1. 直接克隆或下载本仓库
2. 复制 `main.js`、`manifest.json`、`styles.css` 三个文件到 vault 插件目录
3. 重启 Obsidian 启用

---

## 验证安装

### 方式 A：复制即翻译（推荐，PDF 也支持）

1. Obsidian 里打开一个笔记（或 PDF）
2. 选中一段英文（任意）
3. 按 `Ctrl+C` 复制
4. **弹窗应自动出现**「⏳ 翻译中…」→ 显示译文 + 音标 + 术语

### 方式 B：右键翻译

1. 在 markdown 笔记里选中一段英文
2. 右键 → 应该看到 **🔬 科研翻译** 菜单项
3. 点击后弹窗出现

### 方式 C：命令面板

1. `Ctrl/Cmd + P` → 输入 `clipboard`
2. 选 **Scientific Translator: Translate clipboard**
3. 弹窗出现

如果没看到任何反应：
- 检查 Community plugins 列表里 Scientific Translator 是否已启用
- 确认 `manifest.json` 在正确位置
- 重启 Obsidian
- 检查设置里「复制后自动翻译」开关是否开启

如果点了菜单但弹窗报错：
- 检查 API Key 是否配置（不能是 `<API_KEY>`）
- 参考 [TROUBLESHOOTING.md](TROUBLESHOOTING.md)