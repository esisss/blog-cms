# Blog CMS

Sistema de gestión de contenido para blogs construido con Next.js 16, tRPC, MongoDB y better-auth.

## Stack Tecnológico

- **Framework**: Next.js 16 (App Router)
- **Backend API**: tRPC v11 con TanStack Query
- **Base de datos**: MongoDB
- **Autenticación**: better-auth
- **Validación**: Zod v4
- **Formularios**: react-hook-form
- **Estilos**: Tailwind CSS v4 + DaisyUI v5
- **Iconos**: Lucide React

## Funcionalidades

- CRUD completo de artículos
- Sistema de autores con perfiles públicos
- Feed de artículos con paginación
- Búsqueda server-side con preview en tiempo real
- Autenticación (registro/login)
- Modales controlados por query params (`?createPost=true`, `?edit=true`)

## Arquitectura y Organización

```
blog-cms/
├── app/                      # Next.js App Router
│   ├── (auth)/               # Route group: páginas de autenticación
│   │   ├── signin/
│   │   └── signup/
│   ├── (main)/               # Route group: páginas principales
│   │   ├── article/[id]/     # Detalle de artículo
│   │   ├── profile/[id]/     # Perfil de autor
│   │   ├── search/           # Resultados de búsqueda
│   │   └── page.tsx          # Home (feed)
│   └── api/                  # API routes (tRPC, auth)
│
├── components/               # Componentes presentacionales reutilizables
│   ├── ArticleCard.tsx       # Card de artículo
│   ├── AuthorProfileCard.tsx # Card de perfil
│   ├── Feed.tsx              # Grid de artículos
│   ├── FormField.tsx         # Campo de formulario genérico
│   ├── Pagination.tsx        # Paginación (callback/URL modes)
│   ├── SearchBar.tsx         # Barra de búsqueda con preview
│   └── ...
│
├── features/                 # Componentes con lógica de dominio
│   ├── articles/             # Formularios, modales, feeds de artículos
│   ├── auth/                 # Formularios de signin/signup
│   ├── authors/              # Vistas de autor, feed de autor
│   └── search/               # Resultados de búsqueda
│
├── hooks/                    # Custom hooks centralizados
│   ├── useArticleMutations.ts  # CRUD mutations con cache invalidation
│   ├── useAuthorQueries.ts     # Queries de autores
│   ├── useDebounce.ts          # Debounce para búsqueda
│   └── useDeleteArticle.ts     # Delete con confirmación
│
├── schemas/                  # Schemas Zod para validación
│   ├── articles.ts           # Schemas de artículos
│   ├── auth.ts               # Schemas de autenticación
│   ├── search.ts             # Schemas de búsqueda
│   └── primitives.ts         # Tipos primitivos reutilizables
│
├── server/                   # Código del servidor
│   ├── actions/              # Server Actions
│   ├── auth/                 # Configuración better-auth
│   ├── db/                   # Conexión MongoDB
│   ├── handlers/             # Handlers de negocio
│   └── trpc/                 # Configuración tRPC
│       ├── routers/          # Routers (articles, authors, search)
│       ├── context.ts        # Contexto de request
│       ├── trpc.ts           # Procedures (public/protected)
│       └── index.ts          # Root router + getServerCaller
│
├── lib/                      # Utilidades compartidas
│   ├── auth-client.ts        # Cliente better-auth
│   ├── errors.ts             # Manejo de errores
│   ├── trpc/                 # Cliente tRPC
│   └── response.ts           # Helpers de respuesta
│
└── types/                    # Tipos TypeScript globales
    ├── errors.ts             # Tipos de error (ActionErrors)
    └── index.ts              # Exports centralizados
```

## Enfoque y Decisiones de Diseño


### Separación de responsabilidades

- **`components/`**: Componentes puramente presentacionales que reciben datos via props
- **`features/`**: Componentes "container" con lógica de negocio y data fetching
- **`hooks/`**: Lógica reutilizable centralizada (mutations, queries)

### tRPC + TanStack Query

- Procedures protegidas para operaciones autenticadas
- `createCallerFactory` para llamar procedures desde Server Components/Actions sin overhead HTTP
- Cache invalidation automática en mutations

### Validación con Zod

- Schemas compartidos entre cliente y servidor
- Discriminated unions para tipado fuerte (ej: `ActionErrors`)

### UI Patterns

- Modales controlados por query params para URLs compartibles
- Componente `Pagination` con dos modos:
  - **Callback mode**: estado local (`onPageChange`)
  - **URL mode**: navegación server-side (`buildUrl`)

### Formularios

- `FormField` genérico que soporta react-hook-form + server action errors
- Reducción significativa de código repetitivo (~40% menos)

## Instalación

### Prerrequisitos

- Node.js 18+
- pnpm
- MongoDB (local o Atlas)

### Pasos

1. Clonar el repositorio:
```bash
git clone <repository-url>
cd blog-cms
```

2. Instalar dependencias:
```bash
pnpm install
```

3. Configurar variables de entorno:
```bash
cp .env.example .env.local
```

Editar `.env.local` con tus valores:
```env
MONGODB_URI=mongodb://
BETTER_AUTH_SECRET=secret

```

4. Ejecutar en desarrollo:
```bash
pnpm dev
```

5. Abrir [http://localhost:3000](http://localhost:3000)

### Scripts disponibles

| Comando | Descripción |
|---------|-------------|
| `pnpm dev` | Servidor de desarrollo |
| `pnpm build` | Build de producción |
| `pnpm start` | Iniciar build de producción |
| `pnpm lint` | Ejecutar ESLint |
| `pnpm typecheck` | Verificar tipos TypeScript |

---

## Uso de Inteligencia Artificial

Este proyecto fue desarrollado con asistencia de **Claude Opus 4.5** (vía OpenCode CLI) y **Codex 5.2** como herramientas de pair programming para acelerar la implementación, refactoring y debugging.
