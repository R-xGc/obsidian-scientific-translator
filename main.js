/*
 * Scientific Translator for Obsidian
 * 专为科研论文（深度学习/AI/CV/NLP）设计的翻译插件
 * 右键选中翻译，附带音标和术语备注 + TTS 读音
 * 必须接入用户自己的 OpenAI 兼容 API（OpenAI、MiniMax、DeepSeek、Ollama、Azure 等）
 * GitHub: https://github.com/<your-repo>/obsidian-scientific-translator
 */

'use strict';

const { Plugin, PluginSettingTab, Setting, Menu, Notice } = require('obsidian');

// =====================
// 默认设置（占位符 - 用户必须填入自己的 API）
// =====================

const DEFAULT_SETTINGS = {
    apiUrl: '<API_BASE_URL>',                // 例如: https://api.openai.com/v1
    apiKey: '<API_KEY>',                      // 你的 API 密钥（必填）
    model: '<MODEL_NAME>',                    // 例如: gpt-4o-mini / MiniMax-M3 / deepseek-chat
    temperature: 0.3,
    showPhonetic: true,
    showTerms: true,
    ttsEnabled: true,
    ttsLangOriginal: 'en-US',
    ttsLangTranslation: 'zh-CN',
    maxInputLength: 2000,
    prompt: `你是一名科研论文翻译助手，专门翻译深度学习、计算机视觉、人工智能、自然语言处理等领域的英文文本。

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

5. 仅返回 JSON，不要包含任何 markdown 代码块标记或额外说明。`
};

// =====================
// 插件主体
// =====================

class ScientificTranslator extends Plugin {
    async onload() {
        await this.loadSettings();
        this.addSettingTab(new TranslatorSettingTab(this.app, this));

        // 注册右键菜单（编辑器）
        this.registerEvent(
            this.app.workspace.on('editor-menu', (menu, editor) => {
                const selection = editor.getSelection();
                if (selection && selection.trim().length > 0) {
                    menu.addItem((item) =>
                        item
                            .setTitle('🔬 科研翻译')
                            .setIcon('languages')
                            .onClick(async () => {
                                await this.handleTranslate(selection);
                            })
                    );
                }
            })
        );

        // 命令面板
        this.addCommand({
            id: 'translate-selection',
            name: 'Scientific Translator: Translate selection',
            editorCallback: async (editor) => {
                const selection = editor.getSelection();
                if (!selection || selection.trim().length === 0) {
                    new Notice('⚠️ 请先选中要翻译的文字');
                    return;
                }
                await this.handleTranslate(selection);
            },
            hotkeys: [
                {
                    modifiers: ['Mod', 'Shift'],
                    key: 't',
                },
            ],
        });

        // 当前选中文本翻译（无编辑器时）
        this.addCommand({
            id: 'translate-from-clipboard',
            name: 'Scientific Translator: Translate clipboard',
            callback: async () => {
                const text = await navigator.clipboard.readText();
                if (!text || text.trim().length === 0) {
                    new Notice('⚠️ 剪贴板为空');
                    return;
                }
                await this.handleTranslate(text);
            },
        });
    }

    onunload() {
        // 关闭所有弹窗
        document.querySelectorAll('.scientific-translator-popup').forEach((el) => el.remove());
    }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }

    async handleTranslate(text) {
        if (!this.settings.apiKey ||
            this.settings.apiKey === '<API_KEY>' ||
            this.settings.apiUrl === '<API_BASE_URL>' ||
            this.settings.model === '<MODEL_NAME>') {
            new Notice('⚠️ 请先在设置中配置 API（占位符必须替换）');
            return;
        }

        if (text.length > this.settings.maxInputLength) {
            new Notice(`⚠️ 文本过长（${text.length} 字符），最大支持 ${this.settings.maxInputLength}`);
            text = text.substring(0, this.settings.maxInputLength);
        }

        const popup = new TranslatorPopup(this.app, text, this.settings);
        popup.open();

        try {
            const result = await this.callAPI(text);
            popup.setResult(result);
        } catch (e) {
            popup.setError(e.message || String(e));
        }
    }

    async callAPI(text) {
        const url = `${this.settings.apiUrl.replace(/\/$/, '')}/chat/completions`;

        // 使用 Obsidian 全局 requestUrl（更稳定，避免 CORS）
        const resp = await requestUrl({
            url: url,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.settings.apiKey}`,
            },
            body: JSON.stringify({
                model: this.settings.model,
                temperature: this.settings.temperature,
                messages: [
                    { role: 'system', content: this.settings.prompt },
                    { role: 'user', content: text },
                ],
            }),
            throw: false,
        });

        if (resp.status >= 400) {
            throw new Error(`API 错误 ${resp.status}: ${resp.text.substring(0, 200)}`);
        }

        const data = typeof resp.json === 'function' ? resp.json : JSON.parse(resp.text);
        const content = data.choices?.[0]?.message?.content;
        if (!content) {
            throw new Error('API 返回内容为空');
        }

        return this.parseResult(content);
    }

    parseResult(content) {
        let jsonStr = content.trim();
        const jsonMatch = jsonStr.match(/```(?:json)?\s*([\s\S]+?)\s*```/);
        if (jsonMatch) jsonStr = jsonMatch[1];
        const braceMatch = jsonStr.match(/\{[\s\S]*\}/);
        if (braceMatch) jsonStr = braceMatch[0];

        try {
            const parsed = JSON.parse(jsonStr);
            return {
                translation: parsed.translation || '',
                phonetic: parsed.phonetic || '',
                terms: Array.isArray(parsed.terms) ? parsed.terms : [],
            };
        } catch (e) {
            return {
                translation: content,
                phonetic: '',
                terms: [],
            };
        }
    }
}

// =====================
// 弹窗组件
// =====================

class TranslatorPopup {
    constructor(app, text, settings) {
        this.app = app;
        this.text = text;
        this.settings = settings;
        this.popupEl = null;
    }

    open() {
        this.popupEl = document.createElement('div');
        this.popupEl.className = 'scientific-translator-popup';
        this.popupEl.innerHTML = `
            <div class="st-header">
                <span class="st-title">🔬 Scientific Translator</span>
                <button class="st-close" aria-label="关闭">×</button>
            </div>
            <div class="st-body">
                <div class="st-original">
                    <div class="st-label">原文</div>
                    <div class="st-original-text"></div>
                </div>
                <div class="st-loading">⏳ 翻译中…</div>
            </div>
            <div class="st-footer">
                <button class="st-btn st-tts-original" title="朗读原文">🔊 原文</button>
                <button class="st-btn st-tts-translation" title="朗读译文">🔊 译文</button>
                <button class="st-btn st-copy" title="复制译文">📋 复制</button>
            </div>
        `;

        const rect = document.body.getBoundingClientRect();
        this.popupEl.style.top = `${rect.height / 2 - 200}px`;
        this.popupEl.style.left = `${rect.width / 2 - 280}px`;

        document.body.appendChild(this.popupEl);

        this.popupEl.querySelector('.st-original-text').textContent = this.text;

        this.popupEl.querySelector('.st-close').addEventListener('click', () => this.close());
        this.popupEl.querySelector('.st-tts-original').addEventListener('click', () =>
            this.speak(this.text, this.settings.ttsLangOriginal)
        );
        this.popupEl.querySelector('.st-tts-translation').addEventListener('click', () => {
            const transEl = this.popupEl.querySelector('.st-translation-text');
            if (transEl) this.speak(transEl.textContent, this.settings.ttsLangTranslation);
        });
        this.popupEl.querySelector('.st-copy').addEventListener('click', () => {
            const transEl = this.popupEl.querySelector('.st-translation-text');
            if (transEl) {
                navigator.clipboard.writeText(transEl.textContent);
                new Notice('✓ 已复制译文');
            }
        });

        this.escHandler = (e) => {
            if (e.key === 'Escape') this.close();
        };
        document.addEventListener('keydown', this.escHandler);
    }

    setResult(result) {
        const body = this.popupEl.querySelector('.st-body');
        const loading = body.querySelector('.st-loading');
        if (loading) loading.remove();

        const resultEl = document.createElement('div');
        resultEl.className = 'st-result';
        resultEl.innerHTML = this.renderResult(result);
        body.appendChild(resultEl);

        this.lastTranslation = result.translation;
    }

    setError(msg) {
        const body = this.popupEl.querySelector('.st-body');
        const loading = body.querySelector('.st-loading');
        if (loading) loading.remove();

        const errEl = document.createElement('div');
        errEl.className = 'st-error';
        errEl.textContent = `❌ ${msg}`;
        body.appendChild(errEl);
    }

    renderResult(result) {
        let html = '';

        if (result.translation) {
            html += `
                <div class="st-section">
                    <div class="st-label">译文</div>
                    <div class="st-translation-text">${this.escapeHtml(result.translation)}</div>
                </div>
            `;
        }

        if (this.settings.showPhonetic && result.phonetic) {
            html += `
                <div class="st-section">
                    <div class="st-label">音标</div>
                    <div class="st-phonetic">${this.escapeHtml(result.phonetic)}</div>
                </div>
            `;
        }

        if (this.settings.showTerms && result.terms && result.terms.length > 0) {
            html += `
                <div class="st-section">
                    <div class="st-label">术语备注</div>
                    <ul class="st-terms">
                        ${result.terms
                            .map(
                                (t) => `
                            <li>
                                <span class="st-term-zh">${this.escapeHtml(t.zh || '')}</span>
                                <span class="st-term-en">(${this.escapeHtml(t.en || '')})</span>
                                ${t.note ? `<div class="st-term-note">${this.escapeHtml(t.note)}</div>` : ''}
                            </li>
                        `
                            )
                            .join('')}
                    </ul>
                </div>
            `;
        }

        return html;
    }

    speak(text, lang) {
        if (!this.settings.ttsEnabled) return;
        if (!('speechSynthesis' in window)) {
            new Notice('⚠️ 当前环境不支持语音合成');
            return;
        }
        window.speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance(text);
        utter.lang = lang;
        utter.rate = 0.9;
        window.speechSynthesis.speak(utter);
    }

    close() {
        if (this.popupEl) {
            this.popupEl.remove();
            this.popupEl = null;
        }
        if (this.escHandler) {
            document.removeEventListener('keydown', this.escHandler);
        }
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
        }
    }

    escapeHtml(s) {
        return String(s)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }
}

// =====================
// 设置面板
// =====================

class TranslatorSettingTab extends PluginSettingTab {
    constructor(app, plugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    updateStatusBox(box) {
        const s = this.plugin.settings;
        const isPlaceholder = (v) => !v || v.startsWith('<') && v.endsWith('>');
        const isConfigured =
            !isPlaceholder(s.apiUrl) &&
            !isPlaceholder(s.apiKey) &&
            !isPlaceholder(s.model);

        if (isConfigured) {
            box.style.background = 'rgba(0, 200, 100, 0.15)';
            box.style.color = 'var(--text-success, #4caf50)';
            box.style.border = '1px solid rgba(0, 200, 100, 0.4)';
            box.innerHTML = '✅ <strong>已就绪</strong> — API 已配置好，可以开始翻译。<br>' +
                `<small>API: ${s.apiUrl} · 模型: ${s.model}</small>`;
        } else {
            box.style.background = 'rgba(255, 100, 100, 0.12)';
            box.style.color = 'var(--text-error, #ff6b6b)';
            box.style.border = '1px solid rgba(255, 100, 100, 0.4)';
            const missing = [];
            if (isPlaceholder(s.apiUrl)) missing.push('API URL');
            if (isPlaceholder(s.apiKey)) missing.push('API Key');
            if (isPlaceholder(s.model)) missing.push('模型');
            box.innerHTML = '⚠️ <strong>还需要配置</strong>：' + missing.join('、') + '<br>' +
                '<small>填入 3 个字段后会自动变绿。</small>';
        }
    }

    display() {
        const { containerEl } = this;
        containerEl.empty();

        containerEl.createEl('h2', { text: '🔬 Scientific Translator 设置' });

        // API 配置分组
        containerEl.createEl('h3', { text: 'API 配置' });

        // 状态指示框（根据配置状态自动变色）
        const statusBox = containerEl.createEl('div');
        statusBox.id = 'st-status-box';
        statusBox.style.padding = '10px';
        statusBox.style.marginBottom = '16px';
        statusBox.style.borderRadius = '4px';
        statusBox.style.fontSize = '13px';
        statusBox.style.lineHeight = '1.5';
        this.updateStatusBox(statusBox);

        new Setting(containerEl)
            .setName('API URL')
            .setDesc('OpenAI 兼容接口的基础 URL（不含 /chat/completions）。例如 https://api.openai.com/v1，或 MiniMax/DeepSeek/Ollama/Azure 提供的 endpoint。')
            .addText((text) =>
                text
                    .setPlaceholder('https://api.openai.com/v1')
                    .setValue(this.plugin.settings.apiUrl)
                    .onChange(async (value) => {
                        this.plugin.settings.apiUrl = value;
                        await this.plugin.saveSettings();
                        this.updateStatusBox(statusBox);
                    })
            );

        new Setting(containerEl)
            .setName('API Key')
            .setDesc('你的 API 密钥。点击右侧眼睛图标可显示明文。')
            .addText((text) => {
                text.inputEl.type = 'password';
                text.setPlaceholder('<API_KEY>')
                    .setValue(this.plugin.settings.apiKey)
                    .onChange(async (value) => {
                        this.plugin.settings.apiKey = value;
                        await this.plugin.saveSettings();
                        this.updateStatusBox(statusBox);
                    });
            });

        new Setting(containerEl)
            .setName('模型')
            .setDesc('模型名称。例如 gpt-4o-mini / gpt-4o / MiniMax-M3 / deepseek-chat / llama3.2。')
            .addText((text) =>
                text
                    .setPlaceholder('gpt-4o-mini')
                    .setValue(this.plugin.settings.model)
                    .onChange(async (value) => {
                        this.plugin.settings.model = value;
                        await this.plugin.saveSettings();
                        this.updateStatusBox(statusBox);
                    })
            );

        new Setting(containerEl)
            .setName('Temperature')
            .setDesc('生成温度，越低越稳定。科研翻译建议 0.2–0.4。')
            .addSlider((slider) =>
                slider
                    .setLimits(0, 1, 0.1)
                    .setValue(this.plugin.settings.temperature)
                    .setDynamicTooltip()
                    .onChange(async (value) => {
                        this.plugin.settings.temperature = value;
                        await this.plugin.saveSettings();
                    })
            );

        // 显示选项
        containerEl.createEl('h3', { text: '显示选项' });

        new Setting(containerEl)
            .setName('显示音标')
            .addToggle((toggle) =>
                toggle
                    .setValue(this.plugin.settings.showPhonetic)
                    .onChange(async (value) => {
                        this.plugin.settings.showPhonetic = value;
                        await this.plugin.saveSettings();
                    })
            );

        new Setting(containerEl)
            .setName('显示术语备注')
            .addToggle((toggle) =>
                toggle
                    .setValue(this.plugin.settings.showTerms)
                    .onChange(async (value) => {
                        this.plugin.settings.showTerms = value;
                        await this.plugin.saveSettings();
                    })
            );

        new Setting(containerEl)
            .setName('启用读音 (TTS)')
            .addToggle((toggle) =>
                toggle
                    .setValue(this.plugin.settings.ttsEnabled)
                    .onChange(async (value) => {
                        this.plugin.settings.ttsEnabled = value;
                        await this.plugin.saveSettings();
                    })
            );

        // 高级
        containerEl.createEl('h3', { text: '高级' });

        new Setting(containerEl)
            .setName('最大输入长度')
            .setDesc('超过此长度的文本会被截断。')
            .addText((text) =>
                text
                    .setPlaceholder('2000')
                    .setValue(String(this.plugin.settings.maxInputLength))
                    .onChange(async (value) => {
                        const n = parseInt(value, 10);
                        if (!isNaN(n) && n > 0) {
                            this.plugin.settings.maxInputLength = n;
                            await this.plugin.saveSettings();
                        }
                    })
            );

        new Setting(containerEl)
            .setName('System Prompt')
            .setDesc('自定义发送给模型的 system prompt。详见 docs/SCIENTIFIC-PROMPT.md。')
            .addTextArea((text) => {
                text.inputEl.rows = 10;
                text.inputEl.style.width = '100%';
                text.inputEl.style.fontFamily = 'monospace';
                text.setValue(this.plugin.settings.prompt)
                    .onChange(async (value) => {
                        this.plugin.settings.prompt = value;
                        await this.plugin.saveSettings();
                    });
            });

        // 恢复默认
        new Setting(containerEl)
            .setName('恢复默认 Prompt')
            .setDesc('一键恢复默认的科研翻译 prompt。')
            .addButton((button) =>
                button
                    .setButtonText('恢复')
                    .setWarning()
                    .onClick(async () => {
                        this.plugin.settings.prompt = DEFAULT_SETTINGS.prompt;
                        await this.plugin.saveSettings();
                        this.display();
                        new Notice('✓ 已恢复默认 Prompt');
                    })
            );
    }
}

module.exports = ScientificTranslator;