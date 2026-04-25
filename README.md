## Integrantes:
Agustin Becerra - 2023407020
Tomas Corvalan - 2023407002
Tomas Valderrama - 2023407040

## Estructura del proyecto

- frontend/: aplicacion React con Vite.
- backend/: API en Express y configuracion de Prisma.

## Levantar el proyecto en un dispositivo nuevo

### 1) Prerequisitos

- Node.js 20+ (recomendado LTS).
- npm 10+.

### 2) Instalar dependencias

Desde la carpeta proy_constr (la que contiene los workspaces frontend y backend):

'bash
cd proy_constr
npm install
'

### 3) Configurar variables de entorno (backend)

En backend/.env debes definir al menos:

'''env
DATABASE_URL="postgresql://usuario:password@host:5432/base_de_datos"
'''

### 4) Generar cliente de Prisma

'''bash
npm run prisma:generate --workspace backend
'''

Si es la primera vez con una base vacia, ejecuta migraciones:

'''bash
npm run prisma:migrate --workspace backend
'''

### 5) Ejecutar

'''bash
# frontend + backend
npm run dev

# solo frontend
npm run dev:frontend

# solo backend
npm run dev:backend
'''

## Scripts principales

Todos se ejecutan desde proy_constr:

- npm run dev: levanta frontend y backend en paralelo.
- npm run dev:frontend: levanta solo frontend.
- npm run dev:backend: levanta solo backend.
- npm run build: build del frontend.
- npm run lint: lint del frontend.
- npm run lint --workspace backend: lint del backend.

## Coverage con Codecov

Para generar cobertura localmente:

'''bash
cd proy_constr
npm run coverage
'''

Eso crea el reporte `frontend/coverage/lcov.info`, que GitHub Actions sube a Codecov desde [.github/workflows/codecov.yml](.github/workflows/codecov.yml).

