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
                    document.getElementById('quickHelp').style.display = 'none';
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
        
        document.getElementById('quickHelp').style.display = 'none';
        
        this.addMessage(message, 'user');
        this.messages.push({ role: 'user', content: message });
        this.saveMessages();
        
        const typingId = this.showTyping();
        
        this.isGenerating = true;
        
        try {
            const response = await this.generateResponse(message);
            this.removeTyping(typingId);
            this.addMessage(response, 'ai');
            this.messages.push({ role: 'assistant', content: response });
            this.saveMessages();
        } catch (error) {
            console.error('Error:', error);
            this.removeTyping(typingId);
            this.addMessage('Desculpe, tive um problema. Tente novamente!', 'ai');
        }
        
        this.isGenerating = false;
    }

    generateResponse(message) {
        const text = message.toLowerCase();
        
        // Saudações
        if (text.includes('oi') || text.includes('ola') || text.includes('olá') || text.includes('bom dia') || text.includes('boa tarde') || text.includes('boa noite')) {
            return "👋 Olá! Que bom te ver!\n\nSou seu amigo digital e posso te ajudar com muitas coisas!\n\n💻 Computador e internet\n📱 Apps do celular\n📷 Fotos e vídeos\n🎵 Músicas\n🔢 Matemática\n❓ Perguntas em geral\n\nO que você precisa?";
        }
        
        // Morumbi / São Paulo
        if (text.includes('morumbi') || text.includes('onde fica') || text.includes('localização')) {
            return "📍 O Morumbi é um bairro na zona oeste de São Paulo!\n\nÉ famoso pelo:\n• Estádio do São Paulo (Morumbi)\n• Shopping Morumbi\n• Uma das áreas mais nobres da cidade\n\nÉ um lugar bonito, com muitos prédios e árvores!";
        }
        
        // WhatsApp
        if (text.includes('whatsapp') || text.includes('mandar msg')) {
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
        if (text.includes('videochamada') || text.includes('ligação') || text.includes('zoom') || text.includes('meet')) {
            return "📹 Fazer videochamada:\n\n**WhatsApp:**\n1. Abra a conversa\n2. Toque no ícone de câmera\n3. Aguarde atender\n\n**Zoom/Meet:**\n1. Abra o app\n2. Toque em 'Nova Reunião'\n3. Compartilhe o link\n\nQuer mais ajuda?";
        }
        
        // Computador / PC
        if (text.includes('computador') || text.includes('pc') || text.includes('laptop') || text.includes('notebook') || text.includes('windows') || text.includes('mac')) {
            return "💻 Posso ajudar com computador!\n\nDiga o que você quer fazer:\n• Ligar/desligar\n• Acessar internet\n• Mandar email\n• Usar programas\n• Problemas gerais\n\nQual é sua dúvida?";
        }
        
        // Email
        if (text.includes('email') || text.includes('gmail')) {
            return "📧 Mandar email:\n\n1. Abra o Gmail (ou seu app de email)\n2. Toque no ícone de escrever (+)\n3. Digite o email do destinatário\n4. Escreva o assunto\n5. Escreva a mensagem\n6. Toque em enviar\n\nPronto! 📨";
        }
        
        // Tradução
        if (text.includes('traduz') || text.includes('ingles') || text.includes('tradução') || text.includes('espanhol')) {
            return "🌍 Para traduzir:\n\n1. Abra o Google Tradutor\n2. Digite a palavra ou frase\n3. Escolha os idiomas\n4. Veja a tradução\n\nQuer que eu traduza algo agora? É só escrever!";
        }
        
        // Matemática
        if (text.includes('matemática') || text.includes('conta') || text.includes('soma') || text.includes('vezes') || text.includes('dividir') || text.includes('menos') || text.includes('mais')) {
            const nums = message.match(/\d+/g);
            if (nums && nums.length >= 2) {
                const n1 = parseInt(nums[0]);
                const n2 = parseInt(nums[1]);
                if (text.includes('mais') || text.includes('soma') || text.includes('+')) {
                    return "🔢 " + n1 + " + " + n2 + " = " + (n1 + n2) + "\n\nFácil! Quer fazer outra conta?";
                }
                if (text.includes('vezes') || text.includes('multiplic') || text.includes('x')) {
                    return "🔢 " + n1 + " × " + n2 + " = " + (n1 * n2) + "\n\nFácil! Quer fazer outra conta?";
                }
                if (text.includes('menos') || text.includes('-')) {
                    return "🔢 " + n1 + " - " + n2 + " = " + (n1 - n2) + "\n\nFácil! Quer fazer outra conta?";
                }
                if (text.includes('divi')) {
                    return "🔢 " + n1 + " ÷ " + n2 + " = " + (n1/n2).toFixed(2) + "\n\nFácil! Quer fazer outra conta?";
                }
            }
            return "🔢 Para fazer contas, me diga assim:\n• 'quanto é 5 mais 3'\n• 'quanto é 10 vezes 4'\n• 'quanto é 100 dividido por 2'\n\nQual conta você quer?";
        }
        
        // Obrigado
        if (text.includes('obrigado') || text.includes('obrigada') || text.includes('thanks') || text.includes('agradeço')) {
            return "😊 De nada! Fico feliz em ajudar!\n\nPode me perguntar sempre que precisar!\n\n💻 Computador\n📱 Apps\n❓ Dúvidas\n\nEstou aqui! 🙋";
        }
        
        // Quem é / O que é
        if (text.includes('quem é') || text.includes('o que é') || text.includes('me explique') || text.includes('explique')) {
            return "📚 Para explicar, preciso saber o que você quer aprender!\n\nMe pergunte sobre:\n• Como usar tecnologia\n• Coisas do dia a dia\n• Palavras difíceis\n• História\n\nO que quer saber?";
        }
        
        // Resposta padrão
        return "🤖 Entendi: \"" + message + "\"\n\nSou seu amigo digital! Posso ajudar com:\n\n💻 Computador e internet\n📱 Apps (WhatsApp, Spotify, etc)\n📷 Fotos e vídeos\n🌐 WiFi\n🔢 Contas de matemática\n❓ Perguntas gerais\n\nMe diga o que você precisa! 😊";
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
        div.className = 'message ai';
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
