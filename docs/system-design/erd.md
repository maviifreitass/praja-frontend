# Entity Relationship Diagram - PraJá

## Entidades Principais

### Users (Usuários)
```
- id (PK): string/uuid
- name: string
- email: string (unique)
- password: string (hashed)
- role: enum (ADMIN, USER)
- avatar: string (optional)
- created_at: timestamp
- updated_at: timestamp
```

### Categories (Categorias)
```
- id (PK): integer/uuid
- name: string
- description: text
- color: string (hex color)
- created_at: timestamp
- updated_at: timestamp
```

### Tickets
```
- id (PK): integer/uuid
- title: string
- description: text
- status: enum (OPEN, CLOSED, PAUSED)
- priority: enum (LOW, MEDIUM, HIGH)
- response: text (optional)
- due_date: timestamp (optional)
- created_by (FK): references Users.id
- category_id (FK): references Categories.id
- created_at: timestamp
- updated_at: timestamp
```

### Activities (Atividades)
```
- id (PK): integer/uuid
- ticket_id (FK): references Tickets.id
- user_id (FK): references Users.id
- action: string
- description: text
- created_at: timestamp
```

## Relacionamentos

### One-to-Many
- **Users → Tickets**: Um usuário pode criar muitos tickets
- **Categories → Tickets**: Uma categoria pode ter muitos tickets
- **Tickets → Activities**: Um ticket pode ter muitas atividades
- **Users → Activities**: Um usuário pode ter muitas atividades

### Constraints
- Email deve ser único na tabela Users
- Status e Priority são enums com valores predefinidos
- Foreign keys com cascade delete apropriado
- Índices em campos de busca frequente

## Considerações de Performance
- Índices em: email, status, priority, created_at
- Soft delete para auditoria
- Paginação para listagens grandes
- Cache de consultas frequentes

> **Nota**: Para visualizar o diagrama completo, abra o arquivo `erd.png` ou edite `erd.drawio`
