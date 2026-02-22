# OpenCode Mobile - PRD (Product Requirements Document)

## 1. Visão Geral do Projeto

**Nome do Projeto:** OpenCode Mobile iOS
**Tipo:** Progressive Web App (PWA) - instala no iPhone pelo Safari
**Resumo:** App de coding assistant com IA rodando offline no iPhone 13
**Dispositivo Inicial:** iPhone 13 (A15 Bionic, ~4GB RAM)
**Expansão:** Samsung, LG, Motorola e outros Android/iOS

---

## 2. Decisões Tomadas

### ✅ Arquitetura
- **Tipo:** PWA (Web App que instala no iPhone)
- **Instalação:** Via Safari - "Adicionar à Tela de Início"
- **Offline:** Sim - IA roda local após primeiro download
- **Backend:** None (totalmente client-side)

### ✅ Modelo de IA
- **Primário:** Phi-3 Mini ou Gemma 3n 2B (leves, ~1.5-2GB RAM)
- **Opcional:** Antigravity via API (para quando tiver internet)

### ✅ Interface
- Estilo ChatGPT
- Tema claro/escuro
- Histórico local

### ✅ Login
- Sem necessidade - app direto

### ✅ Nome
- Repositório: `opencode-ios`
- App: "OpenCode Mobile"

---

## 3. Funcionalidades MVP

### Core:
- [ ] Chat com IA local
- [ ] Sugestão de código em tempo real
- [ ] Explicação de código
- [ ] Suporte a múltiplas linguagens
- [ ] Histórico de conversas (localStorage)
- [ ] Exportar código
- [ ] Tema claro/escuro
- [ ] Instalação PWA no iOS

### Futuro (Fase 2):
- [ ] Execução de código
- [ ] Autenticação cloud
- [ ] Sincronização
- [ ] Mais modelos
- [ ] Integração com apps do usuário

---

## 4. Tech Stack

- HTML5 + CSS3 + Vanilla JS
- Transformers.js (WASM) para IA local
- Service Worker para offline
- Web App Manifest para instalação PWA

---

## 5. Histórico de Versões

| Versão | Data | Descrição |
|--------|------|-----------|
| 0.1 | 2026-02-21 | Draft inicial |
| 0.2 | 2026-02-21 | Atualizado para Offline |
| 0.3 | 2026-02-21 | Decisões finais definidas |
| 0.4 | 2026-02-21 | MVP iniciado |

---

**Status:** Em Desenvolvimento
**Última Atualização:** 2026-02-21

### 2.1 Autenticação & Conta
- [ ] Você quer login/login social (Google, GitHub, email)?
- [ ] Precisa de autenticação via API key (OpenRouter, Antigravity)?
- [ ] Usuários precisam de conta própria ou só usam a API key?

### 2.2 Modelos de IA
- [ ] Quais modelos devem estar disponíveis? (Todos os gratuitos do OpenRouter que configuramos, ou selecionar alguns?)
- [ ] Usuário pode adicionar próprias API keys?
- [ ] Quer incluir os modelos do Antigravity também?

### 2.3 Interface & UX
- [ ] Como deve ser a tela principal?
  - Chat simples como ChatGPT?
  - Terminal/IDE simplificado?
  - Listagem de ferramentas/actions?
- [ ] O app deve ter:
  - [ ] Chat de conversa
  - [ ] Editor de código simples
  - [ ] Histórico de conversas
  - [ ] Favoritos/Salvar prompts
  - [ ] Compartilhar código
- [ ] Modo offline? (cache de últimas conversas)
- [ ] Notificações push?

### 2.4 Funcionalidades de Coding
- [ ] Ejecutar código no celular? (simular terminal)
- [ ] Syntax highlighting?
- [ ] Suporte a múltiplas linguagens?
- [ ] Arquivos e projetos (como no OpenCode desktop)?

### 2.5 Integrações
- [ ] GitHub integration (commits, repos)?
- [ ] Webhooks para triggers?
- [ ] Conexão com APIs externas?

### 2.6 Monetização (opcional)
- [ ] Versão gratuita com limites?
- [ ] Assinatura premium?
- [ ] Pay-per-use com créditos?

### 2.7 Deployment
- [ ] Hospedagem estática no GitHub Pages?
- [ ] Ou API backend + frontend分开?
- [ ] Nome do repositório: `opencode-ios` ou outro?

### 2.8 Tech Stack
- [ ] Backend: Rails (como você pediu) ou prefere outra coisa?
- [ ] Frontend: HTML/JS puro, React, Vue?
- [ ] PWA (Progressive Web App) para install no iPhone?

---

## 3. Funcionalidades Offline

### O que o app deve fazer (sem internet):

- [ ] Chat com IA local
- [ ] Sugestão de código em tempo real
- [ ] Explicação de código
- [ ] Refatoração de código
- [ ] Detecção de bugs
- [ ] Gerar código a partir de descrição
- [ ] Suporte a múltiplas linguagens (Python, JS, Ruby, etc)
- [ ] Histórico de conversas (salvo localmente)
- [ ] Exportar código gerado
- [ ] Favoritos/Salvar prompts úteis

### 2.4 Interface & UX
- [ ] Tela principal estilo ChatGPT?
- [ ] Editor de código integrado?
- [ ] Syntax highlighting?
- [ ] Temas (claro/escuro)?

### 2.5 Limitações do iPhone 13
- RAM limitada (~4GB)
- Sem GPU poderosa
- Bateria limitada
-Modelo precisa ser leve (~1-3B params)

---

## 4. Tech Stack Recomendado

### Opção 1: App Nativo Swift
- Xcode + Swift
- Core ML para rodar modelo
- UIKit ou SwiftUI
- ⚠️ Precisa Mac para compilar

### Opção 2: PWA com WASM (Recomendado)
- HTML/JS/CSS
- Transformers.js (WASM)
- Download do modelo uma vez
- Funciona no Safari do iPhone
- ✅ Mais fácil de distribuir

### Opção 3: Electron-like (Tauri)
- Rust backend
- WebView frontend
- Mais complexo

---

## 5. Próximos Passos

1. ✅ Você responder quais opções acima prefere
2. ⏳ Definir modelo de IA final
3. ⏳ Definir método de instalação
4. ⏳ Desenvolver MVP
5. ⏳ Criar arquivo de download
6. ⏳ Hospedar no GitHub

---

**Data de Criação:** 2026-02-21
**Versão:** 0.2 (Atualizado para Offline)
**Status:** Aguardando respostas
