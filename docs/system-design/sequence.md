# Sequence Diagrams - PraJá

## Fluxos Principais

### 1. Autenticação de Usuário

```
Usuario -> Frontend: Acessa /login
Frontend -> Frontend: Exibe formulário
Usuario -> Frontend: Preenche credenciais
Frontend -> Backend: POST /auth/login
Backend -> Database: Valida credenciais
Database -> Backend: Retorna dados do usuário
Backend -> Frontend: Retorna JWT token
Frontend -> Frontend: Armazena token
Frontend -> Usuario: Redireciona para dashboard
```

### 2. Criação de Ticket

```
Usuario -> Frontend: Acessa /tickets/new
Frontend -> Backend: GET /categories (carrega opções)
Backend -> Database: Busca categorias
Database -> Backend: Retorna categorias
Backend -> Frontend: Lista de categorias
Frontend -> Usuario: Exibe formulário preenchido
Usuario -> Frontend: Preenche e submete formulário
Frontend -> Backend: POST /tickets (com token JWT)
Backend -> Backend: Valida dados e autenticação
Backend -> Database: Cria novo ticket
Database -> Backend: Confirma criação
Backend -> Frontend: Retorna ticket criado
Frontend -> Usuario: Exibe toast de sucesso
Frontend -> Usuario: Redireciona para lista
```

### 3. Listagem de Tickets com Filtros

```
Usuario -> Frontend: Acessa /tickets
Frontend -> Backend: GET /tickets
Backend -> Database: Busca tickets do usuário
Database -> Backend: Retorna lista
Backend -> Frontend: Lista de tickets
Frontend -> Usuario: Exibe lista com skeleton
Usuario -> Frontend: Aplica filtros (status/prioridade)
Frontend -> Frontend: Filtra lista localmente
Frontend -> Usuario: Atualiza exibição
```

### 4. Tratamento de Erro de API

```
Usuario -> Frontend: Ação qualquer
Frontend -> Backend: Requisição HTTP
Backend -> Frontend: Erro 401/403/500
Frontend -> AuthInterceptor: Intercepta erro
AuthInterceptor -> Frontend: Processa erro
Frontend -> ToastService: Exibe toast de erro
Frontend -> Usuario: Feedback visual do erro
```

## Considerações Técnicas

### Interceptors HTTP
- **AuthInterceptor**: Adiciona JWT token automaticamente
- **ErrorInterceptor**: Trata erros globalmente
- **LoadingInterceptor**: Gerencia estados de loading

### Guards de Rota
- **AuthGuard**: Protege rotas autenticadas
- **PublicGuard**: Redireciona usuários logados

### Gerenciamento de Estado
- **Services**: Estado compartilhado via BehaviorSubject
- **Local State**: Estado de componente via Angular signals
- **Cache**: Cache local de dados frequentes

> **Nota**: Para visualizar os diagramas completos, abra o arquivo `sequence.png` ou edite `sequence.drawio`
