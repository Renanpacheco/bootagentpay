# AgentPay

**Autores**
**Renan Bitencourt Pacheco,**
**Letícia Amélia Schiavon Silva**

**AgentPay** é um protótipo de aplicação de pagamentos conversacionais, no qual um usuário pode interagir com um agente de inteligência artificial através de um chat para consultar produtos e realizar operações relacionadas a compras.

O projeto combina uma aplicação **React/Vite** no frontend com uma API **Node.js/Express** no backend e um agente de IA integrado ao fluxo de compras.

## Visão geral

A aplicação segue o seguinte fluxo:


┌──────────────────────┐
│       Frontend       │
│    React + Vite      │
└──────────┬───────────┘
           │
           │ HTTP / Axios
           ▼
┌──────────────────────┐
│       Backend        │
│   Node.js + Express  │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│      AI Agent        │
│       Ollama         │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│         Tools        │
│ Catálogo / Compra    │
└──────────────────────┘


O agente pode utilizar ferramentas disponíveis no backend para executar ações relacionadas ao processo de compra.

## Estrutura do projeto


bootagentpay/
│
├── backend/
│   ├── agents/
│   │   └── agent.js
│   │
│   ├── controllers/
│   │
│   ├── database/
│   │   └── database.js
│   │
│   ├── schemas/
│   │
│   ├── tests/
│   │
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── Chat.jsx
│   │   ├── Login.jsx
│   │   ├── api.js
│   │   └── ...
│   │
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── README.md


## Tecnologias

### Backend

* Node.js
* Express 5
* JavaScript / ES Modules
* CORS
* Socket.IO
* Ollama
* Qwen
* Nodemon

O backend está configurado para executar na porta `3000`.

### Frontend

* React
* Vite
* Axios
* JavaScript

O frontend é responsável pela interface de login e pelo chat utilizado para interação com o agente.

## Pré-requisitos

Antes de executar o projeto, tenha instalado:

* Node.js
* npm
* Ollama

Caso o agente utilize um modelo local através do Ollama, o modelo configurado no projeto também deverá estar disponível localmente.

## Instalação

Clone o repositório:

```bash
git clone https://github.com/Renanpacheco/bootagentpay.git
```

Entre na pasta:

```bash
cd bootagentpay
```

### Backend

```bash
cd backend
npm install
```

### Frontend

Em outro terminal:

```bash
cd frontend
npm install
```

## Executando o projeto

O frontend e o backend são executados separadamente.

### 1. Backend

Entre em:

```bash
cd backend
```

Execute:

```bash
npm run devstart
```

O servidor será iniciado em:


http://localhost:3000


O projeto também possui um comando `start` configurado para executar o servidor em ambiente de execução.

### 2. Frontend

Em outro terminal:

```bash
cd frontend
npm run dev
```

O Vite disponibilizará a aplicação normalmente em:


http://localhost:5173


O backend já possui CORS configurado para permitir requisições provenientes do frontend nessa origem.

## Autenticação

O acesso à aplicação utiliza autenticação baseada em token.

O login é realizado através de:

```http
POST /api/login
```

Corpo da requisição:

```json
{
  "userId": "user_1",
  "senha": "..."
}
```

Em caso de sucesso, a API retorna um token:

```json
{
  "mensagem": "Login realizado com sucesso!",
  "token": "token_...",
  "usuario": {
    "id": "user_1",
    "nome": "...",
    "limite": 300
  }
}
```

O frontend armazena o token e o utiliza nas requisições protegidas.

## 💬 Chat

Depois da autenticação, o frontend utiliza:

```http
POST /api/chat
```

O endpoint exige um token no header:

```http
Authorization: Bearer <token>
```

E recebe o histórico da conversa:

```json
{
  "history": [
    {
      "role": "user",
      "content": "Quais produtos estão disponíveis?"
    }
  ]
}
```

A API encaminha o histórico para o agente e retorna a resposta e o histórico atualizado.

## Agente de IA

O agente é responsável por interpretar as mensagens do usuário e, quando necessário, utilizar ferramentas disponíveis no backend.

O fluxo pode ser representado assim:


Usuário
   │
   ▼
Chat
   │
   ▼
POST /api/chat
   │
   ▼
Agente de IA
   │
   ├── Consulta informações
   │
   ├── Utiliza ferramentas
   │
   └── Processa a operação solicitada
   │
   ▼
Resposta
   │
   ▼
Frontend
```

Essa abordagem permite que a IA não fique limitada à geração de texto, podendo interagir com funcionalidades da aplicação através de ferramentas controladas pelo backend.

## Fluxo de pagamento

O projeto foi estruturado para representar um fluxo de **pagamento orientado por agente**.

De forma simplificada:


1. Usuário realiza login
          ↓
2. Usuário conversa com o agente
          ↓
3. Agente entende a solicitação
          ↓
4. Agente consulta informações necessárias
          ↓
5. Agente utiliza as ferramentas disponíveis
          ↓
6. Sistema valida a operação
          ↓
7. Compra/pagamento é processado


## Testes

Os testes relacionados ao backend estão organizados em:


backend/tests/


A separação dos testes dentro do backend permite testar as funcionalidades da aplicação de forma independente da interface React.

## API

### Login

```http
POST /api/login
```

Exemplo:

```json
{
  "userId": "user_1",
  "senha": "..."
}
```

### Chat

```http
POST /api/chat
```

Header:

```http
Authorization: Bearer <token>
```

Body:

```json
{
  "history": [
    {
      "role": "user",
      "content": "Olá"
    }
  ]
}
```

### Resposta

A API retorna uma estrutura contendo a resposta do agente e o histórico atualizado da conversa:

```json
{
  "resposta": "...",
  "historico": []
}
```

### Implementado

* [x] Estrutura separada entre frontend e backend
* [x] Frontend em React + Vite
* [x] API REST com Express
* [x] Endpoint de login
* [x] Autenticação por Bearer Token
* [x] Endpoint de chat
* [x] Interface de login
* [x] Interface de chat
* [x] Comunicação frontend ↔ backend via Axios
* [x] Estrutura de agente de IA
* [x] Estrutura de ferramentas (*tools*)
* [x] Estrutura de banco de dados em memória
* [x] Estrutura de testes

