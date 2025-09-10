# PraJá - Sistema de Gestão de Tickets

## 📋 Descrição do Projeto

**PraJá** é um sistema web moderno de gestão de tickets e suporte técnico, desenvolvido com Angular 20+ e uma arquitetura limpa e escalável. O sistema permite gerenciar tickets de suporte, categorias, usuários e atividades de forma intuitiva e eficiente.

A aplicação frontend segue uma arquitetura modular baseada em componentes standalone do Angular, com separação clara entre camadas de apresentação, serviços e modelos. O sistema se comunica com uma API REST backend através de interceptors HTTP para autenticação e tratamento de erros, oferecendo uma experiência de usuário fluida com skeleton loaders, toasts informativos e validações em tempo real.

## 🏗️ Arquitetura

```
┌─────────────────┐    HTTP/REST    ┌──────────────────┐
│   Angular App   │ ◄──────────────► │   Backend API    │
│    (Frontend)   │                  │   (Separado)     │
└─────────────────┘                  └──────────────────┘
         │
         ▼
┌─────────────────┐
│   Estrutura     │
│                 │
│ ├── Pages       │ ◄── Componentes de página
│ ├── Shared      │ ◄── Componentes reutilizáveis  
│ ├── Core        │ ◄── Serviços e guards
│ └── Models      │ ◄── Interfaces e tipos
└─────────────────┘
```

**Principais funcionalidades:**
- 🎫 **Gestão de Tickets**: Criação, edição, visualização e exclusão
- 📂 **Categorias**: Organização de tickets por categorias
- 👥 **Gestão de Usuários**: Administração de usuários e perfis
- 🔐 **Autenticação**: Sistema de login e controle de acesso
- 📱 **Interface Responsiva**: Design moderno e adaptável
- 🔄 **Atualizações em Tempo Real**: Feedback imediato ao usuário

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+ 
- npm 9+
- Angular CLI 20+

### Passo a Passo

1. **Clone o repositório:**
```bash
git clone <url-do-repositorio>
cd praja
```

2. **Instale as dependências:**
```bash
npm install
```

3. **Configure as variáveis de ambiente:**
```bash
cp src/environments/environment.example.ts src/environments/environment.ts
```

4. **Inicie o servidor de desenvolvimento:**
```bash
npm start
# ou
ng serve
```

5. **Acesse a aplicação:**
```
http://localhost:4200
```

### Comandos Disponíveis

```bash
npm start          # Inicia o servidor de desenvolvimento
npm run build      # Build para produção
npm run watch      # Build em modo watch
npm test           # Executa os testes
npm run lint       # Verifica qualidade do código
```

## ⚙️ Variáveis de Ambiente

Crie o arquivo `src/environments/environment.ts` baseado no exemplo:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8000/',
  apiTimeout: 10000,
  enableDebugMode: true
};
```

### Configurações Disponíveis

| Variável | Descrição | Valor Padrão |
|----------|-----------|--------------|
| `apiUrl` | URL base da API backend | `http://localhost:8000/` |
| `production` | Modo de produção | `false` |
| `apiTimeout` | Timeout das requisições (ms) | `10000` |
| `enableDebugMode` | Logs de debug | `true` |

## 👤 Usuários de Teste

### Dados para Demonstração

O sistema utiliza dados mock quando a API backend não está disponível:

**Administrador:**
- **Email:** admin@praja.com
- **Senha:** admin123
- **Perfil:** Administrador completo

**Usuário Comum:**
- **Email:** user@praja.com  
- **Senha:** user123
- **Perfil:** Usuário padrão

### Fluxos de Demonstração

1. **Gestão de Tickets:**
   - Acesse `/tickets` para ver a lista
   - Clique em "Novo Ticket" para criar
   - Use filtros por status, prioridade e categoria
   - Visualize detalhes clicando em um ticket

2. **Categorias:**
   - Acesse `/categories` para gerenciar categorias
   - Crie novas categorias com cores personalizadas
   - Edite e exclua categorias existentes

3. **Usuários:**
   - Acesse `/users` para administração de usuários
   - Filtre por tipo (Admin/Usuário)
   - Gerencie perfis e permissões

## 🔌 API Endpoints (Backend Separado)

> **Nota:** O backend está em um repositório separado. Abaixo estão os endpoints esperados:

### Autenticação
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `POST` | `/auth/login` | Login do usuário |
| `POST` | `/auth/register` | Registro de novo usuário |
| `POST` | `/auth/logout` | Logout do usuário |
| `GET`  | `/auth/me` | Dados do usuário logado |

### Tickets
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET`    | `/tickets` | Lista todos os tickets |
| `GET`    | `/tickets/{id}` | Detalhes de um ticket |
| `POST`   | `/tickets` | Cria novo ticket |
| `PUT`    | `/tickets/{id}` | Atualiza ticket |
| `DELETE` | `/tickets/{id}` | Remove ticket |

### Categorias
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET`    | `/categories` | Lista categorias |
| `GET`    | `/categories/{id}` | Detalhes da categoria |
| `POST`   | `/categories` | Cria categoria |
| `PUT`    | `/categories/{id}` | Atualiza categoria |
| `DELETE` | `/categories/{id}` | Remove categoria |

### Usuários
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET`    | `/auth/users` | Lista usuários |
| `GET`    | `/auth/users/{id}` | Detalhes do usuário |
| `PUT`    | `/auth/users/{id}` | Atualiza usuário |
| `DELETE` | `/auth/users/{id}` | Remove usuário |

## 🔧 Tecnologias Utilizadas

- **Frontend:** Angular 20, TypeScript, RxJS
- **Styling:** SCSS, CSS Grid/Flexbox
- **HTTP:** Angular HTTP Client com Interceptors
- **Routing:** Angular Router com Guards
- **Forms:** Reactive Forms com validações
- **UI/UX:** Componentes skeleton, toasts, animações

## 📁 Estrutura do Projeto

```
src/
├── app/
│   ├── core/                 # Serviços principais e guards
│   │   ├── guards/          # Guards de autenticação
│   │   ├── interceptors/    # HTTP interceptors
│   │   └── services/        # Serviços de API
│   ├── shared/              # Componentes e serviços compartilhados
│   │   ├── components/      # Componentes reutilizáveis
│   │   ├── models/          # Interfaces e tipos
│   │   ├── services/        # Serviços utilitários
│   │   └── validators/      # Validadores customizados
│   └── pages/               # Páginas da aplicação
│       ├── auth/           # Autenticação
│       ├── tickets/        # Gestão de tickets
│       ├── categories/     # Gestão de categorias
│       └── users/          # Gestão de usuários
├── environments/           # Configurações de ambiente
└── assets/                # Recursos estáticos
```

## 📊 Arquitetura / System Design

Para diagramas detalhados da arquitetura, consulte a documentação em:

- **[Context Diagram](docs/system-design/context.png)** - Visão geral do sistema
- **[Container Diagram](docs/system-design/containers.png)** - Arquitetura de containers
- **[ERD](docs/system-design/erd.png)** - Modelo de dados
- **[Sequence Diagrams](docs/system-design/sequence.png)** - Fluxos de interação

> 📁 Todos os diagramas estão disponíveis na pasta `/docs/system-design/`

## 🛡️ Segurança

- Interceptors HTTP para autenticação automática
- Guards para proteção de rotas
- Validação de entrada em todos os formulários
- Sanitização de dados de usuário
- Tratamento seguro de erros