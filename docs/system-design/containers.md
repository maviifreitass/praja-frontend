# Container Diagram - PraJá

## Arquitetura de Containers

### Frontend Container
- **Tecnologia**: Angular 20+ com TypeScript
- **Responsabilidades**:
  - Interface de usuário responsiva
  - Validação de formulários
  - Gerenciamento de estado local
  - Comunicação com API via HTTP
- **Porta**: 4200 (desenvolvimento)

### Backend API Container  
- **Tecnologia**: [Definir baseado no backend]
- **Responsabilidades**:
  - Processamento de regras de negócio
  - Autenticação e autorização
  - Validação de dados
  - Interface com banco de dados
- **Porta**: 8000

### Database Container
- **Tecnologia**: [Definir baseado no backend]
- **Responsabilidades**:
  - Armazenamento persistente
  - Integridade referencial
  - Backup e recuperação
- **Porta**: [Definir baseada no SGBD]

## Comunicação Entre Containers

### Frontend ↔ Backend
- **Protocolo**: HTTP/HTTPS
- **Formato**: JSON
- **Autenticação**: JWT tokens
- **Interceptors**: Tratamento automático de auth e erros

### Backend ↔ Database
- **Protocolo**: [Driver específico do SGBD]
- **Connection Pool**: Gerenciamento de conexões
- **Migrations**: Versionamento de schema

## Considerações de Segurança
- HTTPS obrigatório em produção
- Validação de entrada em todas as camadas
- Rate limiting na API
- Sanitização de dados

> **Nota**: Para visualizar o diagrama completo, abra o arquivo `containers.png` ou edite `containers.drawio`
