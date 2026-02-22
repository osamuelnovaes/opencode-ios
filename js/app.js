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
        
        // Esconder overlay de loading
        loadingOverlay.classList.add('hidden');
        
        statusText.textContent = '✅ Pronto!';
        statusDot.classList.add('ready');
        this.isReady = true;
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
        // Respostas dinâmicas baseadas em palavras-chave
        const text = message.toLowerCase();
        
        // Saudações
        if (text.includes('oi') || text.includes('ola') || text.includes('olá') || text.includes('bom dia') || text.includes('boa tarde') || text.includes('boa noite')) {
            return "👋 Olá! Que bom te ver!\n\nSou seu amigo digital e posso te ajudar com muitas coisas!\n\n💻 Computador e internet\n📱 Apps do celular\n📷 Fotos e vídeos\n🎵 Músicas\n🔢 Matemática\n❓ Perguntas em geral\n\nO que você precisa?";
        }
        
        // Morumbi / São Paulo
        if (text.includes('morumbi') || text.includes('onde fica') || text.includes('localização')) {
            return "📍 O Morumbi é um bairro na zona oeste de São Paulo!\n\nÉ famoso pelo:\n• Estádio do São Paulo (Morumbi)\n•shopping Morumbi\n•Uma das áreas mais nobres da cidade\n\nÉ um lugar bonito, com muitos prédios e árvores!";
        }
        
        // WhatsApp
        if (text.includes('whatsapp') || text.includes('mensagem') || text.includes('mandar msg')) {
            return "💬 WhatsApp - Mandar mensagem:\n\n1. Abra o WhatsApp (ícone verde)\n2. Toque no ícone de conversa (+)\n3. Escolha o contato\n4. Digite a mensagem\n5. Toque no botão verde de enviar\n\nFácil, né? 😊";
        }
        
        // Internet / WiFi
        if (text.includes('internet') || text.includes('wifi') || text.includes('conectar') || text.includes('sem internet')) {
            return "🌐 Problemas com internet?\n\n1. Verifique se o WiFi está LIGADO\n2. Veja se o roteador tem luz piscando\n3. Desligue e religue o roteador\n4. Tente novamente\n\nSe ainda não funcionar, entre em contato com sua operadora!";
        }
        
        // Fotos
        if (text.includes('foto') || text.includes('câmera') || text.includes('tirar foto') || text.includes('camera')) {
            return "📷 Tirar foto no celular:\n\n1. Abra o app 'Câmera'\n2. Aponte o celular para o que quer fotografar\n3. Toque no botão grande (círculo branco)\n4. A foto salva automaticamente!\n\nPara ver: abra o app 'Fotos'";
        }
        
        // Música
        if (text.includes('música') || text.includes('musica') || text.includes('spotify') || text.includes('youtube') || text.includes('ouvir')) {
            return "🎵 Ouvir música:\n\n**No Spotify:**\n1. Abra o app Spotify\n2. Busque a música\n3. Toque para tocar\n\n**No YouTube:**\n1. Abra o YouTube\n2. Busque a música\n3. Toque no vídeo\n\nDeseja mais alguma ajuda?";
        }
        
        // Videochamada
        if (text.includes('videochamada') || text.includes('ligação') || text.includes('zoom') || text.includes('google meet')) {
            return "📹 Fazer videochamada:\n\n**WhatsApp:**\n1. Abra a conversa\n2. Toque no ícone de câmera\n3. Aguarde atender\n\n**Zoom/Meet:**\n1. Abra o app\n2. Toque em 'Nova Reunião'\n3. Compartilhe o link\n\nQuer mais ajuda?";
        }
        
        // Computador / PC
        if (text.includes('computador') || text.includes('pc') || text.includes('laptop') || text.includes('notebook') || text.includes('windows') || text.includes('mac')) {
            return "💻 Posso ajudar com computador!\n\nDiga o que você quer fazer:\n• Ligar/desligar\n• Acessar internet\n• Mandar email\n• Usar programas\n• Problemas gerais\n\nQual é sua dúvida?";
        }
        
        // Email
        if (text.includes('email') || text.includes('gmail') || text.includes('Outlook') || text.includes('mensagem')) {
            return "📧 Mandar email:\n\n1. Abra o Gmail (ou seu app de email)\n2. Toque no ícone de escrever (+)\n3. Digite o email do destinatário\n4. Escreva o assunto\n5. Escreva a mensagem\n6. Toque em enviar\n\nPronto! 📨";
        }
        
        // Tradução
        if (text.includes('traduz') || text.includes('ingles') || text.includes('tradução') || text.includes('espanhol')) {
            return "🌍 Para traduzir:\n\n1. Abra o Google Tradutor (ou consulte)\n2. Digite a palavra ou frase\n3. Escolha os idiomas\n4. Veja a tradução\n\nQuer que eu traduza algo agora? É só escrever!";
        }
        
        // Matemática
        if (text.includes('matemática') || text.includes('conta') || text.includes('soma') || text.includes('vezes') || text.includes('dividir') || text.includes('menos') || text.includes('mais')) {
            const nums = message.match(/\d+/g);
            if (nums && nums.length >= 2) {
                const n1 = parseInt(nums[0]);
                const n2 = parseInt(nums[1]);
                if (text.includes('mais') || text.includes('soma') || text.includes('+')) {
                    return `🔢 ${n1} + ${n2} = ${n1 + n2}\n\nFácil! Quer fazer outra conta?`;
                }
                if (text.includes('vezes') || text.includes('multiplic') || text.includes('x')) {
                    return `🔢 ${n1} × ${n2} = ${n1 * n2}\n\nFácil! Quer fazer outra conta?`;
                }
                if (text.includes('menos') || text.includes('-')) {
                    return `🔢 ${n1} - ${n2} = ${n1 - n2}\n\nFácil! Quer fazer outra conta?`;
                }
                if (text.includes('divi')) {
                    return `🔢 ${n1} ÷ ${n2} = ${(n1/n2).toFixed(2)}\n\nFácil! Quer fazer outra conta?`;
                }
            }
            return "🔢 Para fazer contas, me diga assim:\n• 'quanto é 5 mais 3'\n• 'quanto é 10 vezes 4'\n• 'quanto é 100 dividido por 2'\n\nQual conta você quer?";
        }
        
        // Quem é / O que é
        if (text.includes('quem é') || text.includes('o que é') || text.includes('me explique') || text.includes('explique')) {
            return "📚 Para explicar, preciso saber o que você quer aprender!\n\nMe pergunte sobre:\n• Como usar tecnologia\n• Coisas do dia a dia\n• Palavras difíceis\n• História\n\nO que quer saber?";
        }
        
        // Dizer "obrigado" / "thanks"
        if (text.includes('obrigado') || text.includes('obrigada') || text.includes('thanks') || text.includes('agradeço')) {
            return "😊 De nada! Fico feliz em ajudar!\n\nPode me perguntar sempre que precisar!\n\n💻 Computador\n📱 Apps\n❓ Dúvidas\n\nEstou aqui! 🙋";
        }
        
        // Resposta padrão
        return "🤖 Entendi: \"" + message + "\"\n\nSou seu amigo digital! Posso ajudar com:\n\n💻 Computador e internet\n📱 Apps (WhatsApp, Spotify, etc)\n📷 Fotos e vídeos\n🌐 WiFi\n🔢 Contas de matemática\n❓ Perguntas gerais\n\nMe diga o que você precisa! 😊";
    }
        
        if (text.includes('oi') || text.includes('ola') || text.includes('olá')) {
            return "👋 Olá! Que bom te ver!\n\nSou seu amigo digital. Posso ajudar com:\n\n💻 Computador\n📱 Apps\n🌐 Internet\n📷 Fotos\n🎵 Músicas\n\nO que você precisa?";
        }
        
        if (text.includes('internet') || text.includes('wifi')) {
            return "🌐 Vamos resolver!\n\n1. Verifique se WiFi está ligado\n2. Reinicie o roteador\n3. Tente novamente\n\nNão resolveu? Me explique o problema.";
        }
        
        if (text.includes('foto') || text.includes('câmera')) {
            return "📷 Tirar foto:\n\n1. Abra a Câmera\n2. Aponte para o objetivo\n3. Toque no botão\n\nVer depois: abra o app Fotos";
        }
        
        // Default response
        return "🤖 Entendi: \"" + message + "\"\n\nPosso ajudar com computador, WhatsApp, internet, fotos, músicas e muito mais!\n\nMe diga o que precisa.";
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
