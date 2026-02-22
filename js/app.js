// OpenCode Mobile - App Simples para Todos

class OpenCodeApp {
    constructor() {
        this.messages = [];
        this.isGenerating = false;
        this.init();
    }

    init() {
        this.loadMessages();
        this.setupEventListeners();
    }

    loadMessages() {
        const saved = localStorage.getItem('opencode-messages');
        if (saved) {
            try {
                this.messages = JSON.parse(saved);
                if (this.messages.length > 0) {
                    document.getElementById('welcomeMessage').style.display = 'none';
                    this.messages.forEach(msg => {
                        this.addMessage(msg.content, msg.role);
                    });
                }
            } catch (e) {
                this.messages = [];
            }
        }
    }

    saveMessages() {
        const toSave = this.messages.slice(-100);
        localStorage.setItem('opencode-messages', JSON.stringify(toSave));
    }

    setupEventListeners() {
        document.getElementById('sendBtn').addEventListener('click', () => this.sendMessage());
        
        document.getElementById('userInput').addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        document.getElementById('userInput').addEventListener('input', (e) => {
            e.target.style.height = 'auto';
            e.target.style.height = Math.min(e.target.scrollHeight, 100) + 'px';
            document.getElementById('sendBtn').disabled = !e.target.value.trim();
        });
    }

    async sendMessage() {
        const input = document.getElementById('userInput');
        const message = input.value.trim();
        
        if (!message || this.isGenerating) return;
        
        input.value = '';
        input.style.height = 'auto';
        document.getElementById('sendBtn').disabled = true;
        
        document.getElementById('welcomeMessage').style.display = 'none';
        
        this.addMessage(message, 'user');
        this.messages.push({ role: 'user', content: message });
        
        const typingId = this.showTyping();
        
        this.isGenerating = true;
        
        try {
            // Usar API de IA real - múltiplas tentativas
            const apis = [
                {
                    url: 'https://api.chatanywhere.com.cn/v1/chat/completions',
                    body: {
                        model: 'gpt-3.5-turbo',
                        messages: [
                            {role: 'system', content: 'Você é um assistente prestativo. Responda de forma clara e útil em português.'},
                            {role: 'user', content: message}
                        ],
                        max_tokens: 400
                    }
                },
                {
                    url: 'https://api.wlai.vip/v1/chat/completions',
                    body: {
                        model: 'gpt-3.5-turbo',
                        messages: [
                            {role: 'system', content: 'Você é um assistente prestativo. Responda de forma clara e útil em português.'},
                            {role: 'user', content: message}
                        ],
                        max_tokens: 400
                    }
                }
            ];
            
            for (const api of apis) {
                try {
                    const response = await fetch(api.url, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(api.body)
                    });
                    
                    if (response.ok) {
                        const data = await response.json();
                        if (data.choices && data.choices[0]) {
                            const aiResponse = data.choices[0].message.content;
                            this.removeTyping(typingId);
                            this.addMessage(aiResponse, 'assistant');
                            this.messages.push({ role: 'assistant', content: aiResponse });
                            this.saveMessages();
                            this.isGenerating = false;
                            return;
                        }
                    }
                } catch(e) {
                    console.log('API attempt failed');
                }
            }
            
            throw new Error('All APIs failed');
            
        } catch (error) {
            console.error('Error:', error);
            this.removeTyping(typingId);
            this.addMessage('Desculpe, tive um problema. Tente novamente!', 'assistant');
            this.saveMessages();
        }
        
        this.isGenerating = false;
    }

    addMessage(content, role) {
        const container = document.getElementById('messagesContainer');
        
        const div = document.createElement('div');
        div.className = 'message ' + role;
        
        const avatar = role === 'user' ? '👤' : '🤖';
        
        div.innerHTML = '<div class="message-avatar">' + avatar + '</div><div class="message-content">' + content.replace(/\n/g, '<br>') + '</div>';
        
        container.appendChild(div);
        document.getElementById('chatContainer').scrollTop = document.getElementById('chatContainer').scrollHeight;
    }

    showTyping() {
        const container = document.getElementById('messagesContainer');
        const id = 'typing-' + Date.now();
        
        const div = document.createElement('div');
        div.className = 'message assistant';
        div.id = id;
        div.innerHTML = '<div class="message-avatar">🤖</div><div class="typing-indicator"><span></span><span></span><span></span></div>';
        
        container.appendChild(div);
        document.getElementById('chatContainer').scrollTop = document.getElementById('chatContainer').scrollHeight;
        
        return id;
    }

    removeTyping(id) {
        const el = document.getElementById(id);
        if (el) el.remove();
    }
}

// Iniciar app
document.addEventListener('DOMContentLoaded', () => {
    window.app = new OpenCodeApp();
});

// Service Worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(() => {});
}
