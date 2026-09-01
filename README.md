# AgentPay

## Autores

* **Renan Bitencourt Pacheco**
* **Letícia Amélia Schiavon Silva**

**AgentPay** é um protótipo de aplicação de pagamentos conversacionais, no qual um usuário pode interagir com um agente de inteligência artificial através de um chat para consultar produtos e realizar operações relacionadas a compras.

O projeto combina uma aplicação **React/Vite** no frontend com uma API **Node.js/Express** no backend e um agente de IA integrado ao fluxo de compras.

---

## Visão geral

A aplicação segue o seguinte fluxo:

```text
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
│        Tools         │
│   Catálogo / Compra  │
└──────────────────────┘
```

O agente pode utilizar ferramentas disponíveis no backend para executar ações relacionadas ao processo de compra.

---

## Estrutura do projeto

```text
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
├── run.sh
└── README.md
```

---

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

### Inteligência Artificial

* Ollama
* Qwen `qwen3:1.7b`

O modelo é executado localmente através do Ollama.

---

## Pré-requisitos

Antes de executar o projeto, certifique-se de ter instalado:

* Node.js
* npm
* Ollama

Também é necessário possuir o modelo `qwen3:1.7b` instalado no Ollama.

Caso o modelo ainda não esteja disponível, execute:

```bash
ollama pull qwen3:1.7b
```

---

## Instalação

Clone o repositório:

```bash
git clone https://github.com/Renanpacheco/bootagentpay.git
```

Entre na pasta do projeto:

```bash
cd bootagentpay
```

### Backend

Entre na pasta do backend e instale as dependências:

```bash
cd backend
npm install
```

### Frontend

Em outro terminal, entre na pasta do frontend e instale as dependências:

```bash
cd frontend
npm install
```

---

# Como executar

O projeto pode ser executado de duas formas:

1. **Execução automática**, utilizando o script `run.sh`;
2. **Execução manual**, iniciando Ollama, backend e frontend separadamente.

---

## Opção 1 — Execução automática com `run.sh`

O projeto possui um script de execução que automatiza a inicialização do Ollama, backend e frontend.

Na raiz do projeto, conceda permissão de execução ao script:

```bash
chmod +x run.sh
```

Depois execute:

```bash
./run.sh
```

O script irá:

1. Verificar se o Ollama já está em execução;
2. Iniciar o Ollama caso necessário;
3. Verificar se o modelo `qwen3:1.7b` está instalado;
4. Iniciar o backend;
5. Iniciar o frontend.

Após a inicialização, os serviços estarão disponíveis em:

* **Frontend:** `http://localhost:5173`
* **Backend:** `http://localhost:3000`
* **Ollama:** `http://localhost:11434`

### Encerrando os serviços

Para encerrar os serviços iniciados pelo script, pressione:

```text
CTRL + C
```

### Logs

Os logs dos serviços podem ser acompanhados individualmente através dos seguintes comandos:

#### Ollama

```bash
tail -f /tmp/agentpay-ollama.log
```

#### Backend

```bash
tail -f /tmp/agentpay-backend.log
```

#### Frontend

```bash
tail -f /tmp/agentpay-frontend.log
```

---

## Opção 2 — Execução manual

Também é possível executar cada componente separadamente.

Essa opção é especialmente útil durante o desenvolvimento, pois permite visualizar e acompanhar diretamente os logs de cada serviço.

### 1. Ollama

Em um terminal, execute:

```bash
ollama run qwen3:1.7b
```

Mantenha esse terminal aberto enquanto estiver utilizando a aplicação.

### 2. Backend

Em outro terminal, entre na pasta do backend:

```bash
cd backend
```

Caso ainda não tenha instalado as dependências:

```bash
npm install
```

Depois execute:

```bash
npm start
```

O backend será iniciado em:

```text
http://localhost:3000
```

### 3. Frontend

Em um terceiro terminal, entre na pasta do frontend:

```bash
cd frontend
```

Caso ainda não tenha instalado as dependências:

```bash
npm install
```

Depois execute:

```bash
npm run dev
```

O frontend será disponibilizado pelo Vite, normalmente em:

```text
http://localhost:5173
```

---

## Resumo da execução

### Execução automática

Na raiz do projeto:

```bash
chmod +x run.sh
./run.sh
```

### Execução manual

```text
Terminal 1 → ollama run qwen3:1.7b

Terminal 2 → cd backend
             npm start

Terminal 3 → cd frontend
             npm run dev
```

As duas formas produzem o mesmo ambiente de execução.

A principal diferença é que o `run.sh` automatiza a inicialização dos serviços, enquanto a execução manual permite maior controle individual durante o desenvolvimento.

---

## Autenticação

O acesso à aplicação utiliza autenticação baseada em token.

O login é realizado através do endpoint:

```http
POST /api/login
```

### Corpo da requisição

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

---

## 💬 Chat

Depois da autenticação, o frontend utiliza o endpoint:

```http
POST /api/chat
```

O endpoint exige um token no header:

```http
Authorization: Bearer <token>
```

### Corpo da requisição

O endpoint recebe o histórico da conversa:

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

A API encaminha o histórico para o agente e retorna a resposta juntamente com o histórico atualizado.

---

## Agente de IA

O agente é responsável por interpretar as mensagens do usuário e, quando necessário, utilizar ferramentas disponíveis no backend.

O fluxo pode ser representado da seguinte forma:

```text
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

---

## Fluxo de pagamento

O projeto foi estruturado para representar um fluxo de **pagamento orientado por agente**.

De forma simplificada:

```text
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
```

---

## Testes

Os testes relacionados ao backend estão organizados em:

```text
backend/tests/
```

A separação dos testes dentro do backend permite testar as funcionalidades da aplicação de forma independente da interface React.

---

# API

## Login

```http
POST /api/login
```

### Exemplo

```json
{
  "userId": "user_1",
  "senha": "..."
}
```

---

## Chat

```http
POST /api/chat
```

### Header

```http
Authorization: Bearer <token>
```

### Body

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

---

## Implementado

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
* [x] Integração com Ollama
* [x] Utilização do modelo Qwen `qwen3:1.7b`
* [x] Estrutura de banco de dados em memória
* [x] Estrutura de testes
* [x] Script `run.sh` para inicialização automatizada dos serviços
