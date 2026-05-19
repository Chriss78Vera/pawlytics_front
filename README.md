# Pawlytics Frontend

Frontend de Pawlytics construido con React, Vite y Tailwind CSS. Consume la API del backend para autenticacion, gestion de mascotas, historiales clinicos, dashboard, usuarios y catalogos.

## Requisitos

- Node.js
- npm
- Backend de Pawlytics ejecutandose, normalmente en `http://localhost:3000/api`

## Configuracion

Crea un archivo `.env` en la raiz de `pawlytics_front`:

```env
VITE_PAWLYTICS_API_URL=http://localhost:3000/api
```

La configuracion HTTP esta centralizada en:

```text
src/app/config/httpClient.js
```

## Instalacion

```bash
npm install
```

## Ejecutar en desarrollo

```bash
npm run dev
```

Por defecto Vite abre el frontend en:

```text
http://localhost:5173
```

## Compilar produccion

```bash
npm run build
```

## Roles y permisos principales

- Administrador:
  - Revisa dashboard global.
  - Gestiona mascotas.
  - Revisa historiales clinicos.
  - Gestiona usuarios desde el nav `Usuarios`.
  - Crea veterinarios.
  - Activa/desactiva clientes y veterinarios.

- Veterinario:
  - Revisa mascotas.
  - Crea historiales clinicos.
  - Consulta detalles de historiales, sin editar.

- Cliente:
  - Revisa solo sus mascotas.
  - Consulta solo historiales relacionados con sus mascotas.
  - No puede modificar historiales.

## Modulos del frontend

- `Dashboard`: metricas reales desde `/dashboard/summary`.
- `Mascotas`: listado paginado con filtros por nombre, tipo, raza y sexo.
- `Historial`: listado paginado, filtros, creacion por veterinario y detalle solo lectura.
- `Usuarios`: solo administrador; creacion de veterinarios y activacion/desactivacion de usuarios.
- `Catalogos`: tipos y razas usados por selectores con buscador.

## Servicios API

Los servicios estan en:

```text
src/app/service
```

Servicios principales:

- `userService.js`
- `mascotasService.js`
- `historialService.js`
- `dashboardService.js`
- `catalogosService.js`
- `analisisService.js`

## Componentes compartidos

Selectores reutilizables:

```text
src/app/components/selectors/SearchableSelect.jsx
src/app/components/selectors/usePetCatalogOptions.js
```

Estos se usan para tipos, razas, sexo, mascotas y otros dropdowns con buscador.

## Notas

- Los listados de mascotas e historiales usan paginacion con headers `x-page` y `x-limit`.
- El login bloquea usuarios inactivos.
- El historial clinico creado no se edita desde el frontend.
