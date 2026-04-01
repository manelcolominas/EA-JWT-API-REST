# EA API REST + JWT con Express y TypeScript

Este proyecto implementa una API REST con autenticación JWT usando Express y TypeScript. Incluye manejo de tokens de acceso y refresh tokens para una mejor seguridad.

## Estructura del Proyecto

```
├── src/
│   ├── controllers/
│   │   ├── auth.controller.ts    # Controladores de autenticación
│   │   └── user.controller.ts    # Controladores de usuarios
│   ├── middlewares/
│   │   ├── joi.ts                 # Middlewares de autenticación
│   │   └── auth.middleware.ts           # Middlewares de autenticación y autorización
│   ├── models/
│   │   ├── JWTPayload.ts        # Interface para payload JWT
│   │   ├── auth.model.ts        # Interface de autenticación
│   │   ├── organitzation.model.ts # Interface de organización
│   │   └── user.model.ts        # Interface de Usuario
│   ├── routes/
│   │   ├── auth.route.ts              # Rutas de autenticación
│   │   ├── organization.route.ts      # Rutas de organización
│   │   └── user.route.ts              # Rutas de usuarios
│   ├── services/
│   │   ├── organitzation.service.ts # Servicio de organización
│   │   └── user.service.ts      # Servicio de usuarios
│   ├── config/
│   │   └── config.ts
│   ├── data/
│   │   ├── organitzation.json
│   │   └── user.json              
│   ├── utils/
│   │   └── dataSeeder.util.ts 
│   ├── app.ts                   # Configuración de Express
│   ├── server.ts                
│   ├── swagger.ts               # Configuración de Swagger
│   └── index.ts                 # Punto de entrada
├── test/
│   └── api.http                # Tests de API con REST Client
└── package.json
```

## Requisitos Previos

- Node.js (versión 14.x o superior)
- npm (incluido con Node.js)
- TypeScript instalado globalmente:


Instalar dependencias
```
npm install
```

## Uso

1. Compilar el proyecto:
```
npm run build
```

2. Iniciar el servidor:
```
npm start
```

El servidor se iniciará en http://localhost:4000

## Endpoints de la API

### Autenticación

- POST `/api/auth/signup`: Registro de nuevo usuario
- POST `/api/auth/signin`: Inicio de sesión
- POST `/api/auth/refresh`: Renovar access token

### Usuarios

- GET `/api/users`: Obtener todos los usuarios
- GET `/api/users/:id`: Obtener usuario específico
- PUT `/api/users/:id`: Actualizar usuario (requiere autenticación y ser propietario)
- DELETE `/api/users/:id`: Eliminar usuario (requiere autenticación y ser propietario)

## Testing

El proyecto incluye un archivo `api.http` para testing usando la extensión REST Client de VS Code. Este archivo contiene ejemplos de todas las peticiones posibles y guarda automáticamente los tokens JWT para su reutilización.

## Implementación de JWT

El sistema implementa un esquema de autenticación dual con:

1. Access Token:
   - Duración corta (15 minutos)
   - Usado para autenticar operaciones en la API
   - Contiene el tipo 'access' en el payload

2. Refresh Token:
   - Duración larga (7 días)
   - Usado solo para obtener nuevos access tokens
   - Contiene el tipo 'refresh' en el payload

Los tokens se validan a través de middlewares:
- `verifyToken`: Valida access tokens
- `verifyRefreshToken`: Valida refresh tokens
- `isOwner`: Verifica que el usuario sea propietario del recurso

# Diagramas de Secuencia - Flujo de Autenticación JWT

## Inicio de sesión

```mermaid
sequenceDiagram
    participant C as Cliente
    participant A as API
    participant J as JWT Service

    %% Inicio de sesión
    C->>A: POST /auth/signin {username, password}
    A->>J: Generar Access Token (15min)
    A->>J: Generar Refresh Token (7d)
    J->>A: accessToken
    J->>A: refreshToken
    A->>C: Return {accessToken, refreshToken}
    C->>C: Almacenar Tokens
```
## Llamada a API Protegida

```mermaid
sequenceDiagram
    participant C as Cliente
    participant A as API
    participant J as JWT Service

    C->>A: GET /api/users (Bearer accessToken)
    A->>J: Verificar Access Token
    alt Token válido
        J->>A: Token OK
        A->>C: 200 + Datos solicitados
    else Token expirado
        J->>A: Token expirado
        A->>C: 401 Unauthorized
    end
```
## Renovación del Access Token

```mermaid
sequenceDiagram
    participant C as Cliente
    participant A as API
    participant J as JWT Service

    %% Flujo de Refresh
    C->>A: POST /auth/refresh (Bearer refreshToken)
    A->>J: Verificar Refresh Token
    alt Refresh Token válido
        J->>A: Token OK
        A->>J: Generar nuevo Access Token
        J->>A: refreshToken
        A->>C: 200 + Nuevo Access Token
        C->>C: Almacenar nuevo Access Token
    else Refresh Token expirado
        J->>A: Token inválido
        A->>C: 401 Unauthorized
    end
```

## Referencias

- [Implementando sistema JWT con TypeScript y Node](https://nozzlegear.com/blog/implementing-a-jwt-auth-system-with-typescript-and-node)
- [Extender objeto Request de Express](https://dev.to/kwabenberko/extend-express-s-request-object-with-typescript-declaration-merging-1nn5)

