# Context Diagram - PraJá

## Visão Geral
Este diagrama mostra o contexto do sistema PraJá e suas interações com usuários e sistemas externos.

## Elementos Principais

### Usuários
- **Administradores**: Gerenciam usuários, categorias e têm acesso completo
- **Usuários Finais**: Criam e gerenciam tickets, visualizam categorias
- **Suporte Técnico**: Respondem tickets e gerenciam status

### Sistema PraJá
- **Frontend Angular**: Interface web responsiva
- **Backend API**: API REST para gerenciamento de dados
- **Banco de Dados**: Armazenamento de tickets, usuários e categorias

### Sistemas Externos (Futuros)
- **Sistema de Email**: Notificações automáticas
- **Sistema de Autenticação**: SSO/LDAP
- **Sistema de Relatórios**: Dashboards e métricas

## Fluxos Principais
1. Usuários acessam o frontend web
2. Frontend comunica com backend via API REST
3. Backend processa e armazena dados no banco
4. Notificações são enviadas conforme necessário

> **Nota**: Para visualizar o diagrama completo, abra o arquivo `context.png` ou edite `context.drawio`
