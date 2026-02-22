# OpenCode Mobile - PRD (Product Requirements Document)

## 1. Visão Geral do Projeto

**Nome do Projeto:** OpenCode Mobile (iOS)
**Tipo:** Aplicativo iOS Offline (IPA)
**Resumo:** Versão mobile do OpenCode que roda IA offline no iPhone 13 - sem necessidade de internet
**Usuários Alvo:** Desenvolvedores que precisam de coding assistant offline
**Dispositivo:** iPhone 13 (A15 Bionic, ~4GB RAM disponível)

---

## 2. Arquitetura do App Offline

### 2.1 Modelo de IA Local
O iPhone 13 tem limitação de RAM (~4GB disponíveis para apps). Opções:

| Modelo | Params | RAM Neces. | Adequado? |
|--------|--------|------------|-----------|
| Gemma 3n 2B | 2B | ~1.5GB | ✅ Recomendado |
| Gemma 3n 4B | 4B | ~3GB | ✅ Possível |
| Phi-3 Mini | 3.8B | ~2.5GB | ✅ Possível |
| Llama 3.2 1B | 1B | ~800MB | ✅ Rápido |
| Mistral 7B | 7B | ~6GB+ | ❌ Muita RAM |

- [ ] Qual modelo você prefere usar?
  - **Gemma 3n** (Google, multimodal)
  - **Phi-3** (Microsoft, otimizado mobile)
  - **Llama 3.2 1B** (Meta, leve)
  - Ou outro?

### 2.2 Formato do App
- [ ] Quer um arquivo `.ipa` (precisa jailbreak ou Xcode)?
- [ ] Ou prefere um app web que baixa o modelo uma vez e roda localmente?
- [ ] O app deve ser um "wrapper" que roda o modelo via WebGPU/WASM no navegador?

### 2.3 Como o usuário instala?
- [ ] Via Xcode (precisa Mac)?
- [ ] Via altStore/jailbreak?
- [ ] Ou um web app PWA que faz download do modelo e roda no Safari?

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
