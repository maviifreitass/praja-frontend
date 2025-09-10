# Segurança no Angular - Abordagem Nativa

Este documento descreve como implementamos segurança usando as funcionalidades nativas do Angular, sem reinventar a roda.

## 1. Proteção CSRF - Angular Nativo

### 1.1 Configuração XSRF
```typescript
// app.config.ts
provideHttpClient(
  withXsrfConfiguration({
    cookieName: 'XSRF-TOKEN',
    headerName: 'X-XSRF-TOKEN',
  })
)
```

### 1.2 Como Funciona
- Angular automaticamente lê o cookie `XSRF-TOKEN`
- Adiciona o header `X-XSRF-TOKEN` em requisições mutáveis (POST, PUT, DELETE)
- Servidor deve definir o cookie e validar o header

## 2. Autenticação JWT - Interceptor Simples

### 2.1 AuthInterceptor
```typescript
intercept(req: HttpRequest<any>, next: HttpHandler) {
  const token = this.authService.getToken();
  
  if (token && this.isTokenValid(token)) {
    const authReq = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
    return next.handle(authReq);
  }
  
  return next.handle(req);
}
```

### 2.2 Validação Básica de Token
- Verificar estrutura JWT (3 partes)
- Verificar expiração (`exp`)
- **NÃO** validar assinatura (isso é papel do backend)

## 3. Validação de Formulários - Validators Nativos

### 3.1 Validators Padrão do Angular
```typescript
// Uso dos validators nativos
email: ['', [Validators.required, Validators.email]],
password: ['', [Validators.required, Validators.minLength(8)]]
```

### 3.2 Validators Customizados
```typescript
// CustomValidators para casos específicos
name: ['', [Validators.required, CustomValidators.fullName()]],
password: ['', [Validators.required, CustomValidators.strongPassword()]]
```

### 3.3 O Que NÃO Fazemos no Frontend
- ❌ SQL Injection (problema do backend)
- ❌ Validação criptográfica de JWT
- ❌ WAF manual para XSS (Angular já protege)

## 4. Proteção XSS - Angular Automático

### 4.1 Proteção Nativa
- Template binding `{{ }}` faz escape automático
- Propriedades como `[innerHTML]` são sanitizadas

### 4.2 Quando Usar DomSanitizer
```typescript
// Apenas quando necessário renderizar HTML dinâmico
constructor(private sanitizer: DomSanitizer) {}

sanitizeHtml(html: string) {
  return this.sanitizer.sanitize(SecurityContext.HTML, html);
}
```

## 5. Configuração de Segurança

### 5.1 Headers de Segurança (Backend)
```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Content-Security-Policy: default-src 'self'
```

### 5.2 Cookies Seguros (Backend)
```
Set-Cookie: XSRF-TOKEN=abc123; SameSite=Strict; Secure; Path=/
```

## 6. Estrutura de Arquivos

```
src/app/
├── core/
│   ├── guards/
│   │   ├── auth.guard.ts        # Proteção de rotas
│   │   └── public.guard.ts      # Rotas públicas
│   └── interceptors/
│       └── auth.interceptor.ts  # JWT automático
├── shared/
│   └── validators/
│       └── custom.validators.ts # Validadores específicos
└── pages/
    └── auth/
        └── login/               # Formulários com validators
```

## 7. Responsabilidades

### 7.1 Frontend (Angular)
- ✅ Validação de formulários
- ✅ Proteção de rotas (guards)
- ✅ JWT no header (interceptor)
- ✅ XSRF token automático

### 7.2 Backend (API)
- ✅ Validação de entrada
- ✅ Autenticação/autorização
- ✅ SQL Injection prevention
- ✅ XSRF token validation
- ✅ Headers de segurança
- ✅ Rate limiting

## 8. Exemplo Prático

### 8.1 Formulário Seguro
```typescript
// Usando validators nativos + customizados
createForm() {
  return this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, CustomValidators.strongPassword()]],
    name: ['', [Validators.required, CustomValidators.fullName()]]
  });
}
```

### 8.2 Requisição Automática
```typescript
// AuthInterceptor adiciona JWT automaticamente
// Angular adiciona XSRF-TOKEN automaticamente
this.http.post('/api/users', userData).subscribe(...)
```

## 9. O Que Removemos

- ❌ ValidationService complexo
- ❌ CsrfService manual
- ❌ SecurityInterceptor pesado
- ❌ Validação de SQL Injection no frontend
- ❌ WAF manual no Angular

## 10. Benefícios da Abordagem Nativa

- ✅ Menos código para manter
- ✅ Funcionalidades testadas pelo Google
- ✅ Atualizações automáticas de segurança
- ✅ Performance otimizada
- ✅ Compatibilidade garantida
- ✅ Documentação oficial

---

**Princípio**: Use as funcionalidades nativas do Angular sempre que possível. Crie código customizado apenas para necessidades específicas do negócio.
