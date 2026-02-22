// OpenCode Mobile - Main App

// OpenRouter Models (Free)
const OPENROUTER_MODELS = [
    { id: 'deepseek/deepseek-r1:free', name: 'DeepSeek R1', params: '671B', context: '164K', desc: 'Excelente reasoning' },
    { id: 'arcee-ai/trinity-large-preview:free', name: 'Trinity Large', params: '400B', context: '131K', desc: 'Muito potente' },
    { id: 'qwen/qwen3-next-80b-a3b-instruct:free', name: 'Qwen3 Next 80B', params: '80B', context: '262K', desc: 'Maior contexto' },
    { id: 'nvidia/nemotron-3-nano-30b-a3b:free', name: 'Nemotron 30B', params: '30B', context: '256K', desc: 'NVIDIA' },
    { id: 'google/gemma-3-27b-it:free', name: 'Gemma 3 27B', params: '27B', context: '131K', desc: 'Google' },
    { id: 'meta-llama/llama-3.3-70b-instruct:free', name: 'Llama 3.3 70B', params: '70B', context: '128K', desc: 'Meta' },
    { id: 'mistralai/mistral-small-3.1-24b-instruct:free', name: 'Mistral 3.1 24B', params: '24B', context: '128K', desc: 'Multimodal' },
    { id: 'stepfun/step-3.5-flash:free', name: 'Step 3.5 Flash', params: '196B', context: '256K', desc: 'StepFun' },
    { id: 'qwen/qwen3-coder:free', name: 'Qwen3 Coder', params: '480B', context: '262K', desc: 'Especialista em código' },
    { id: 'liquid/lfm-2.5-1.2b-thinking:free', name: 'LFM Thinking', params: '1.2B', context: '32K', desc: 'Leve e rápido' }
];

class OpenCodeApp {
    constructor() {
        this.messages = [];
        this.model = null;
        this.modelLoaded = false;
        this.isGenerating = false;
        this.currentMode = localStorage.getItem('currentMode') || 'local'; // local, openrouter, antigravity
        this.settings = {
            theme: localStorage.getItem('theme') || 'dark',
            model: localStorage.getItem('model') || 'deepseek/deepseek-r1:free',
            openrouterKey: localStorage.getItem('openrouterKey') || '',
            useAntigravity: localStorage.getItem('useAntigravity') === 'true',
            antigravityKey: localStorage.getItem('antigravityKey') || ''
        };
        
        this.init();
    }

    async init() {
        this.loadMessages();
        this.setupEventListeners();
        this.applyTheme();
        await this.loadModel();
        this.updateModelStatus();
    }

    setupEventListeners() {
        // Mode tabs
        document.querySelectorAll('.mode-tab').forEach(tab => {
            tab.addEventListener('click', () => this.switchMode(tab.dataset.mode));
        });

        // Send button
        document.getElementById('sendBtn').addEventListener('click', () => this.sendMessage());
        
        // Enter to send
        document.getElementById('userInput').addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // Auto-resize textarea
        document.getElementById('userInput').addEventListener('input', (e) => {
            e.target.style.height = 'auto';
            e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
            this.updateSendButton();
        });

        // Theme toggle
        document.getElementById('themeToggle').addEventListener('click', () => this.toggleTheme());

        // Settings
        document.getElementById('settingsBtn').addEventListener('click', () => this.openSettings());
        document.getElementById('closeSettings').addEventListener('click', () => this.closeSettings());
        
        // Model select
        document.getElementById('modelSelect').addEventListener('change', (e) => {
            this.settings.model = e.target.value;
            localStorage.setItem('model', e.target.value);
        });

        // OpenRouter key
        document.getElementById('openrouterKey').addEventListener('input', (e) => {
            this.settings.openrouterKey = e.target.value;
            localStorage.setItem('openrouterKey', e.target.value);
        });

        // Antigravity toggle
        document.getElementById('antigravityToggle').addEventListener('change', (e) => {
            this.settings.useAntigravity = e.target.checked;
            localStorage.setItem('useAntigravity', e.target.checked);
            document.getElementById('antigravityKeyGroup').classList.toggle('hidden', !e.target.checked);
        });

        // Antigravity key
        document.getElementById('antigravityKey').addEventListener('input', (e) => {
            this.settings.antigravityKey = e.target.value;
            localStorage.setItem('antigravityKey', e.target.value);
        });

        // Clear history
        document.getElementById('clearHistory').addEventListener('click', () => this.clearHistory());

        // Download model
        document.getElementById('downloadModel').addEventListener('click', () => this.downloadModel());

        // Quick actions
        document.querySelectorAll('.quick-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const prompt = btn.dataset.prompt;
                document.getElementById('userInput').value = prompt;
                this.updateSendButton();
            });
        });

        // Close modal on outside click
        document.getElementById('settingsModal').addEventListener('click', (e) => {
            if (e.target.id === 'settingsModal') this.closeSettings();
        });
    }

    switchMode(mode) {
        this.currentMode = mode;
        localStorage.setItem('currentMode', mode);
        
        document.querySelectorAll('.mode-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.mode === mode);
        });

        document.getElementById('openrouterSettings').classList.toggle('hidden', mode !== 'openrouter');
        document.getElementById('antigravitySettings').classList.toggle('hidden', mode !== 'antigravity');
        
        this.updateModelStatus();
    }

    updateSendButton() {
        const input = document.getElementById('userInput');
        const btn = document.getElementById('sendBtn');
        btn.disabled = !input.value.trim() || this.isGenerating;
    }

    applyTheme() {
        document.documentElement.setAttribute('data-theme', this.settings.theme);
        document.getElementById('themeIcon').textContent = this.settings.theme === 'dark' ? '🌙' : '☀️';
    }

    toggleTheme() {
        this.settings.theme = this.settings.theme === 'dark' ? 'light' : 'dark';
        localStorage.setItem('theme', this.settings.theme);
        this.applyTheme();
    }

    openSettings() {
        document.getElementById('settingsModal').classList.remove('hidden');
        
        // Populate OpenRouter models
        const modelSelect = document.getElementById('modelSelect');
        modelSelect.innerHTML = OPENROUTER_MODELS.map(m => 
            `<option value="${m.id}">${m.name} (${m.params})</option>`
        ).join('');
        
        modelSelect.value = this.settings.model;
        document.getElementById('openrouterKey').value = this.settings.openrouterKey;
        document.getElementById('antigravityToggle').checked = this.settings.useAntigravity;
        document.getElementById('antigravityKey').value = this.settings.antigravityKey;
        document.getElementById('antigravityKeyGroup').classList.toggle('hidden', !this.settings.useAntigravity);
        
        // Set current mode
        document.querySelectorAll('.mode-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.mode === this.currentMode);
        });
        document.getElementById('openrouterSettings').classList.toggle('hidden', this.currentMode !== 'openrouter');
        document.getElementById('antigravitySettings').classList.toggle('hidden', this.currentMode !== 'antigravity');
    }

    closeSettings() {
        document.getElementById('settingsModal').classList.add('hidden');
    }

    async loadModel() {
        const loadingOverlay = document.getElementById('loadingOverlay');
        const loadingText = document.getElementById('loadingText');
        const loadingProgress = document.getElementById('loadingProgress');

        loadingOverlay.classList.remove('hidden');
        loadingText.textContent = 'Verificando modelo...';

        try {
            // Check if model is cached
            loadingProgress.style.width = '20%';
            loadingText.textContent = 'Carregando Transformers.js...';

            const { pipeline, env } = await import('https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.2/+esm');
            
            // Use WASM backend for better mobile support
            env.allowLocalModels = true;
            env.useBrowserCache = true;

            loadingProgress.style.width = '40%';
            loadingText.textContent = 'Baixando modelo de IA...';

            // For now, use a lighter model
            // In production, you'd use phi3-mini or gemma-2b
            // Using text2text-generation for coding assistance
            this.pipeline = await pipeline('text2text-generation', 'Xenova/LaMini-Flan-T5-783M', {
                progress_callback: (progress) => {
                    if (progress.total) {
                        const percent = 40 + (progress.loaded / progress.total) * 50;
                        loadingProgress.style.width = percent + '%';
                        loadingText.textContent = `Baixando... ${Math.round(percent)}%`;
                    }
                }
            });

            this.modelLoaded = true;
            loadingProgress.style.width = '100%';
            loadingText.textContent = 'Modelo pronto!';
            
            setTimeout(() => {
                loadingOverlay.classList.add('hidden');
            }, 500);

            console.log('Model loaded successfully');

        } catch (error) {
            console.error('Error loading model:', error);
            loadingText.textContent = 'Erro ao carregar modelo';
            loadingText.style.color = '#ef4444';
            
            // Try fallback after 3 seconds
            setTimeout(() => {
                this.loadFallback();
            }, 3000);
        }
    }

    async loadFallback() {
        const loadingText = document.getElementById('loadingText');
        
        try {
            loadingText.textContent = 'Tentando modelo alternativo...';
            
            const { pipeline, env } = await import('https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.2/+esm');
            env.allowLocalModels = true;
            env.useBrowserCache = true;

            this.pipeline = await pipeline('text2text-generation', 'Xenova/t5-small', {});
            this.modelLoaded = true;
            
            document.getElementById('loadingOverlay').classList.add('hidden');
            console.log('Fallback model loaded');
            
        } catch (error) {
            console.error('Fallback also failed:', error);
            loadingText.textContent = 'Use a versão online quando conectado à internet';
            
            // Allow using online mode
            setTimeout(() => {
                document.getElementById('loadingOverlay').classList.add('hidden');
            }, 2000);
        }
    }

    async downloadModel() {
        if (this.modelLoaded) {
            alert('Modelo já está disponível!');
            return;
        }
        
        localStorage.removeItem('transformers-cache');
        await this.loadModel();
    }

    updateModelStatus() {
        const statusEl = document.getElementById('modelStatus');
        const statusText = statusEl.querySelector('.status-text');
        const indicator = statusEl.querySelector('.status-indicator');

        if (this.currentMode === 'openrouter' && this.settings.openrouterKey) {
            const modelInfo = OPENROUTER_MODELS.find(m => m.id === this.settings.model);
            statusText.textContent = `OpenRouter: ${modelInfo?.name || 'Modelo'}`;
            indicator.classList.add('ready');
        } else if (this.currentMode === 'antigravity' && this.settings.antigravityKey) {
            statusText.textContent = 'Antigravity Online';
            indicator.classList.add('ready');
        } else if (this.modelLoaded) {
            statusText.textContent = 'Modelo Local Pronto';
            indicator.classList.add('ready');
        } else {
            statusText.textContent = 'Modo Offline - Use API Key';
            indicator.classList.remove('ready');
        }
    }

    async sendMessage() {
        const input = document.getElementById('userInput');
        const message = input.value.trim();
        
        if (!message || this.isGenerating) return;

        // Route to appropriate service
        if (this.currentMode === 'openrouter' && this.settings.openrouterKey) {
            await this.sendToOpenRouter(message);
        } else if (this.currentMode === 'antigravity' && this.settings.useAntigravity && this.settings.antigravityKey) {
            await this.sendToAntigravity(message);
        } else {
            await this.sendToLocalModel(message);
        }
    }

    async sendToOpenRouter(message) {
        const input = document.getElementById('userInput');
        input.value = '';
        this.updateSendButton();

        document.getElementById('welcomeScreen').style.display = 'none';
        
        this.addMessage(message, 'user');
        this.messages.push({ role: 'user', content: message });
        this.saveMessages();

        const typingId = this.showTyping();
        this.isGenerating = true;
        this.updateSendButton();

        try {
            const modelInfo = OPENROUTER_MODELS.find(m => m.id === this.settings.model) || OPENROUTER_MODELS[0];
            
            const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.settings.openrouterKey}`,
                    'HTTP-Referer': 'https://osamuelnovaes.github.io/opencode-ios',
                    'X-Title': 'OpenCode Mobile'
                },
                body: JSON.stringify({
                    model: this.settings.model,
                    messages: this.messages,
                    max_tokens: 8192
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error?.message || 'API error');
            }

            const data = await response.json();
            const assistantMessage = data.choices[0].message.content;

            this.removeTyping(typingId);
            this.addMessage(assistantMessage, 'ai');
            this.messages.push({ role: 'assistant', content: assistantMessage });
            this.saveMessages();

        } catch (error) {
            console.error('OpenRouter error:', error);
            this.removeTyping(typingId);
            this.addMessage(`Erro: ${error.message}`, 'ai');
        }

        this.isGenerating = false;
        this.updateSendButton();
    }

    async sendToLocalModel(message) {
        const input = document.getElementById('userInput');
        input.value = '';
        this.updateSendButton();

        // Hide welcome screen
        document.getElementById('welcomeScreen').style.display = 'none';

        // Add user message
        this.addMessage(message, 'user');
        this.messages.push({ role: 'user', content: message });
        this.saveMessages();

        // Show typing indicator
        const typingId = this.showTyping();

        this.isGenerating = true;
        this.updateSendButton();

        try {
            // Format prompt for code assistance
            const prompt = this.formatPrompt(message);
            
            const result = await this.pipeline(prompt, {
                max_new_tokens: 512,
                temperature: this.getTemperature(),
                do_sample: true
            });

            const response = result[0].generated_text;
            this.removeTyping(typingId);
            this.addMessage(response, 'ai');
            this.messages.push({ role: 'ai', content: response });
            this.saveMessages();

        } catch (error) {
            console.error('Generation error:', error);
            this.removeTyping(typingId);
            this.addMessage('Desculpe, houve um erro ao processar sua solicitação. Tente novamente.', 'ai');
        }

        this.isGenerating = false;
        this.updateSendButton();
    }

    async sendToAntigravity(message) {
        const input = document.getElementById('userInput');
        input.value = '';
        this.updateSendButton();

        document.getElementById('welcomeScreen').style.display = 'none';
        
        this.addMessage(message, 'user');
        this.messages.push({ role: 'user', content: message });
        this.saveMessages();

        const typingId = this.showTyping();
        this.isGenerating = true;
        this.updateSendButton();

        try {
            const response = await fetch('https://antigravity.sh/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.settings.antigravityKey}`
                },
                body: JSON.stringify({
                    model: 'gemini-3-flash',
                    messages: this.messages,
                    max_tokens: 4096
                })
            });

            if (!response.ok) throw new Error('API error');

            const data = await response.json();
            const assistantMessage = data.choices[0].message.content;

            this.removeTyping(typingId);
            this.addMessage(assistantMessage, 'ai');
            this.messages.push({ role: 'ai', content: assistantMessage });
            this.saveMessages();

        } catch (error) {
            console.error('Antigravity error:', error);
            this.removeTyping(typingId);
            this.addMessage('Erro ao conectar com Antigravity. Verifique sua API key e conexão.', 'ai');
        }

        this.isGenerating = false;
        this.updateSendButton();
    }

    formatPrompt(message) {
        const modeInstructions = {
            balanced: '',
            creative: 'Be creative and innovative in your solutions.',
            precise: 'Be precise and detailed in your explanations.'
        };

        return `You are a helpful coding assistant. ${modeInstructions[this.settings.responseMode]}\n\nUser: ${message}\n\nAssistant:`;
    }

    getTemperature() {
        const temps = { balanced: 0.7, creative: 0.9, precise: 0.3 };
        return temps[this.settings.responseMode] || 0.7;
    }

    addMessage(content, role) {
        const container = document.getElementById('messagesContainer');
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${role}`;
        
        const avatar = role === 'user' ? '👤' : '⚡';
        
        // Process content for code blocks
        const formattedContent = this.formatContent(content);
        
        messageDiv.innerHTML = `
            <div class="message-avatar">${avatar}</div>
            <div class="message-content">${formattedContent}</div>
        `;
        
        container.appendChild(messageDiv);
        
        // Scroll to bottom
        const chatContainer = document.getElementById('chatContainer');
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    formatContent(content) {
        // Escape HTML
        let formatted = content.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        
        // Convert code blocks
        formatted = formatted.replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>');
        
        // Convert inline code
        formatted = formatted.replace(/`([^`]+)`/g, '<code>$1</code>');
        
        // Convert line breaks
        formatted = formatted.split('\n').map(p => `<p>${p}</p>`).join('');
        
        return formatted;
    }

    showTyping() {
        const container = document.getElementById('messagesContainer');
        const id = 'typing-' + Date.now();
        
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message ai';
        typingDiv.id = id;
        typingDiv.innerHTML = `
            <div class="message-avatar">⚡</div>
            <div class="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
            </div>
        `;
        
        container.appendChild(typingDiv);
        
        const chatContainer = document.getElementById('chatContainer');
        chatContainer.scrollTop = chatContainer.scrollHeight;
        
        return id;
    }

    removeTyping(id) {
        const el = document.getElementById(id);
        if (el) el.remove();
    }

    loadMessages() {
        const saved = localStorage.getItem('opencode-messages');
        if (saved) {
            try {
                this.messages = JSON.parse(saved);
                document.getElementById('welcomeScreen').style.display = 'none';
                
                this.messages.forEach(msg => {
                    this.addMessage(msg.content, msg.role);
                });
            } catch (e) {
                this.messages = [];
            }
        }
    }

    saveMessages() {
        // Keep only last 50 messages
        const toSave = this.messages.slice(-50);
        localStorage.setItem('opencode-messages', JSON.stringify(toSave));
    }

    clearHistory() {
        if (confirm('Tem certeza que deseja limpar o histórico?')) {
            this.messages = [];
            localStorage.removeItem('opencode-messages');
            document.getElementById('messagesContainer').innerHTML = '';
            document.getElementById('welcomeScreen').style.display = 'block';
            this.closeSettings();
        }
    }
}
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.app = new OpenCodeApp();
});

// Register service worker for PWA
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(err => {
        console.log('SW registration failed:', err);
    });
}
