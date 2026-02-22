// OpenCode Mobile - IA Embutida

class OpenCodeApp {
    constructor() {
        this.messages = [];
        this.pipeline = null;
        this.isReady = false;
        this.isGenerating = false;
        
        this.init();
    }

    async init() {
        this.setupEventListeners();
        await this.loadAI();
    }

    setupEventListeners() {
        // Botão enviar
        document.getElementById('sendBtn').addEventListener('click', () => this.sendMessage());
        
        // Enter para enviar
        document.getElementById('userInput').addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // Auto-resize textarea
        document.getElementById('userInput').addEventListener('input', (e) => {
            e.target.style.height = 'auto';
            e.target.style.height = Math.min(e.target.scrollHeight, 100) + 'px';
            document.getElementById('sendBtn').disabled = !e.target.value.trim();
        });

        // Botões de ajuda rápida
        document.querySelectorAll('.help-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const action = btn.dataset.action;
                this.handleQuickAction(action);
            });
        });
    }

    handleQuickAction(action) {
        const prompts = {
            code: 'Me ajude com computador. Como fazer...',
            explain: 'Explique de forma simples o que é...',
            write: 'Escreva um texto sobre...',
            translate: 'Traduza para o português: ',
            math: 'Calcule e explique de forma simples: ',
            answer: 'Responda de forma simples: '
        };
        
        document.getElementById('userInput').value = prompts[action];
        document.getElementById('sendBtn').disabled = false;
        document.getElementById('userInput').focus();
    }

    async loadAI() {
        const statusDot = document.querySelector('.status-dot');
        const statusText = document.querySelector('.status-text');
        const loadingOverlay = document.getElementById('loadingOverlay');
        
        loadingOverlay.classList.remove('hidden');
        
        try {
            statusText.textContent = '🤖 Carregando inteligência...';
            
            // Import Transformers.js
            const { pipeline, env } = await import('https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.2/+esm');
            
            env.allowLocalModels = true;
            env.useBrowserCache = true;
            
            statusText.textContent = '📥 Baixando IA (primeira vez)...';
            
            // Usar modelo pequeno T5-small para funcionar no mobile
            this.pipeline = await pipeline('text2text-generation', 'Xenova/t5-small', {
                progress_callback: (progress) => {
                    if (progress.total) {
                        const percent = Math.round((progress.loaded / progress.total) * 100);
                        statusText.textContent = `📥 Baixando IA... ${percent}%`;
                    }
                }
            });
            
            this.isReady = true;
            statusDot.classList.add('ready');
            statusText.textContent = '✅ Pronto para ajudar!';
            
            setTimeout(() => {
                loadingOverlay.classList.add('hidden');
            }, 1000);
            
            console.log('AI loaded successfully!');
            
        } catch (error) {
            console.error('Error loading AI:', error);
            statusText.textContent = '⚠️ Modo simples ativo';
            this.isReady = true; // Still allow basic use
            loadingOverlay.classList.add('hidden');
        }
    }

    async sendMessage() {
        const input = document.getElementById('userInput');
        const message = input.value.trim();
        
        if (!message || this.isGenerating) return;
        
        input.value = '';
        input.style.height = 'auto';
        document.getElementById('sendBtn').disabled = true;
        
        // Esconder ajuda rápida
        document.getElementById('quickHelp').style.display = 'none';
        
        // Adicionar mensagem do usuário
        this.addMessage(message, 'user');
        
        // Mostrar que está pensando
        const typingId = this.showTyping();
        
        this.isGenerating = true;
        
        try {
            // Gerar resposta
            const response = await this.generateResponse(message);
            
            this.removeTyping(typingId);
            this.addMessage(response, 'ai');
            
        } catch (error) {
            console.error('Error:', error);
            this.removeTyping(typingId);
            this.addMessage('Desculpe, tive um problema. Tente novamente!', 'ai');
        }
        
        this.isGenerating = false;
    }

    async generateResponse(message) {
        // URLs de APIs gratuitas públicas (podem variar)
        const apis = [
            { url: 'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2', body: { inputs: `<s>[INST] Responda em português de forma simples: ${message} [/INST]`, parameters: { max_new_tokens: 150 } } },
            { url: 'https://api-inference.huggingface.co/models/meta-llama/Llama-3.2-1B-Instruct', body: { inputs: `<|begin_of_text|>Responda em português de forma simples: ${message}<|end_of_text|>`, parameters: { max_new_tokens: 150 } } }
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
                    if (data && data[0] && data[0].generated_text) {
                        let answer = data[0].generated_text;
                        answer = answer.replace(/<.*?>/g, '').trim();
                        if (answer.length > 20) return answer.substring(0, 300);
                    }
                }
            } catch (e) {}
        }
        
        // Respostas predefinidas para perguntas comuns
        
        // Respostas simples para tarefas comuns
        if (lowerMessage.includes('oi') || lowerMessage.includes('olá') || lowerMessage.includes('ola')) {
            return `👋 Olá! Que bom te ver por aqui!\n\nSou seu amigo digital. Posso te ajudar com:\n\n💻 Computador\n📚 Explicações\n✍️ Escrever textos\n🌍 Traduzir\n🔢 Contas de matemática\n❓ Responder perguntas\n\nÉ só me dizer o que você precisa!`;
        }
        
        if (lowerMessage.includes('computador') || lowerMessage.includes('pc') || lowerMessage.includes('laptop')) {
            return `💻 Com prazer!\n\nMe diga o que você quer fazer:\n\n• Como usar a internet\n• Como mandar mensagem\n• Como fazer uma videochamada\n• Como tirar foto\n• Como ouvir música\n• Problemas com o computador\n\nO que você precisa?`;
        }
        
        if (lowerMessage.includes('internet') || lowerMessage.includes('wifi')) {
            return `🌐 Vamos resolver isso!\n\n1. Verifique se o WiFi está ligado\n2.看看 se outras pessoas têm internet\n3. Desligue e religue o roteador\n\nSe não resolver, me explique o que acontece quando você tenta acessar a internet.`;
        }
        
        if (lowerMessage.includes('whatsapp') || lowerMessage.includes('mensagem')) {
            return `💬 WhatsApp é fácil!\n\n📱 Para mandar mensagem:\n1. Abra o WhatsApp\n2. Toque no ícone de nova mensagem\n3. Escolha o contato\n4. Digite e toque em enviar\n\nQuer que eu explique outra coisa?`;
        }
        
        if (lowerMessage.includes('videochamada') || lowerMessage.includes('ligação')) {
            return `📹 Para fazer videochamada:\n\n1. Abra o WhatsApp\n2. Escolha o contato\n3. Toque no ícone de câmera\n\nSe for pelo Zoom/Google Meet:\n1. Abra o app\n2. Toque em "Nova Reunão" ou "Entrar"\n3. Compartilhe o link com a pessoa\n\nQuer mais alguma ajuda?`;
        }
        
        if (lowerMessage.includes('foto') || lowerMessage.includes('câmera')) {
            return `📷 Para tirar foto:\n\n1. Abra o app "Câmera"\n2. Aponte para o que quer fotografar\n3. Toque no botão grande\n\nPara ver a foto depois:\n1. Abra o app "Fotos"\n2. Procure a imagem\n\nQuer aprender mais?`;
        }
        
        if (lowerMessage.includes('música') || lowerMessage.includes('spotify')) {
            return `🎵 Para ouvir música:\n\n**Spotify:**\n1. Abra o app\n2. Procure a música\n3. Toque para tocar\n\n**YouTube:**\n1. Abra o YouTube\n2. Busque a música\n3. Toque no vídeo\n\nPrecisa de mais alguma coisa?`;
        }
        
        if (lowerMessage.includes('matemática') || lowerMessage.includes('conta') || lowerMessage.includes('soma') || lowerMessage.includes('vezes')) {
            // Extrair números da mensagem
            const numbers = message.match(/\d+/g);
            if (numbers && numbers.length >= 2) {
                const n1 = parseInt(numbers[0]);
                const n2 = parseInt(numbers[1]);
                if (lowerMessage.includes('soma') || lowerMessage.includes('mais') || lowerMessage.includes('+')) {
                    return `🔢 Vamos fazer a conta!\n\n${n1} + ${n2} = ${n1 + n2}\n\nFácil, né? Quer outra conta?`;
                }
                if (lowerMessage.includes('vezes') || lowerMessage.includes('multiplic') || lowerMessage.includes('x')) {
                    return `🔢 Vamos fazer a conta!\n\n${n1} × ${n2} = ${n1 * n2}\n\nFácil, né? Quer outra conta?`;
                }
                if (lowerMessage.includes('menos') || lowerMessage.includes('-')) {
                    return `🔢 Vamos fazer a conta!\n\n${n1} - ${n2} = ${n1 - n2}\n\nFácil, né? Quer outra conta?`;
                }
            }
            return `🔢 Me diga a conta!\n\nPor exemplo: "quanto é 5 mais 3" ou "quanto é 10 vezes 4"\n\nEu calculo e explico passo a passo!`;
        }
        
        if (lowerMessage.includes('traduz')) {
            return `🌍 Para traduzir:\n\n1. Abra o Google Tradutor\n2. Digite ou cole o texto\n3. Escolha o idioma\n4. Veja a tradução\n\nQuer que eu traduza algo agora? É só me mandar o texto!`;
        }
        
        // Se tem o pipeline, usa ele
        if (this.pipeline) {
            try {
                // Formatar prompt para respostas simples
                const prompt = `Responda de forma simples e amigável em português: ${message}`;
                
                const result = await this.pipeline(prompt, {
                    max_new_tokens: 150,
                    temperature: 0.7,
                    do_sample: true
                });
                
                let response = result[0].generated_text;
                
                // Limpar resposta
                if (response.includes('Responda de forma simples')) {
                    response = response.split('Responda de forma simples')[1] || response;
                }
                
                return response.substring(0, 500);
                
            } catch (e) {
                // Fallback para respostas predefinidas
            }
        }
        
        // Resposta genérica amigável
        return `🤖 Entendi! "${message}"\n\nDesculpe, às vezes tenho dificuldade de entender. Tente me dizer de outra forma!\n\nPosso te ajudar com:\n\n💻 Problemas de computador\n📱 Como usar apps\n🌍 Internet e WiFi\n📷 Fotos e vídeos\n🎵 Músicas\n🔢 Contas de matemática\n❓ Perguntas em geral\n\nO que você precisa?`;
    }

    addMessage(content, role) {
        const container = document.getElementById('messagesContainer');
        
        const div = document.createElement('div');
        div.className = `message ${role}`;
        
        const avatar = role === 'user' ? '👤' : '🤖';
        
        // Formatar quebras de linha
        const formatted = content.replace(/\n/g, '<br>');
        
        div.innerHTML = `
            <div class="message-avatar">${avatar}</div>
            <div class="message-content">${formatted}</div>
        `;
        
        container.appendChild(div);
        
        // Scroll para baixo
        document.getElementById('chatContainer').scrollTop = document.getElementById('chatContainer').scrollHeight;
    }

    showTyping() {
        const container = document.getElementById('messagesContainer');
        const id = 'typing-' + Date.now();
        
        const div = document.createElement('div');
        div.className = 'message ai';
        div.id = id;
        div.innerHTML = `
            <div class="message-avatar">🤖</div>
            <div class="typing-indicator">
                <span></span><span></span><span></span>
            </div>
        `;
        
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
