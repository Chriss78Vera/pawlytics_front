# Pawlytics Frontend

Frontend de Pawlytics construido con React, Vite, React Router y Tailwind CSS. Consume la API del backend para autenticacion, gestion de mascotas, historiales clinicos, dashboard, usuarios, catalogos y analisis IA.

## Requisitos

- Node.js
- npm
- Backend de Pawlytics ejecutandose, normalmente en `http://localhost:3000/api`

## Configuracion

Crea un archivo `.env` en la raiz de `pawlytics_front`:

```env
VITE_PAWLYTICS_API_URL=http://localhost:3000/api
VITE_API_KEY_IA=
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
npm run start
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
- `Diagnosticos de mascota`: en vista cliente, cada mascota permite consultar diagnosticos revisados desde Mongo, mostrando primero el mas reciente.
- `Historial`: listado paginado, filtros, creacion por veterinario y detalle solo lectura.
- `Analisis IA`: lista historiales actuales, solicita recomendaciones a `/ai/requests`, muestra estado de analisis y permite guardar la revision veterinaria en `detailed_analysis`.
- `Usuarios`: solo administrador; creacion de veterinarios y activacion/desactivacion de usuarios.
- `Catalogos`: tipos y razas usados por selectores con buscador.

## Rutas de la aplicacion

El frontend usa React Router para conservar la pantalla al recargar el navegador:

```text
/                 Landing
/login            Inicio de sesion
/register         Registro de cliente
/dashboard        Dashboard principal
/dashboard/mascotas
/dashboard/mascotas/nuevo
/dashboard/historial
/dashboard/historial/nuevo
/dashboard/historial/pet/:petId
/dashboard/usuarios
/dashboard/analisis
```

Las rutas bajo `/dashboard/*` requieren sesion guardada en `localStorage` mediante `pawlytics_login`; si no existe, redirigen a `/login`.

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

La logica del flujo de IA esta separada en:

```text
src/app/hooks/useAiAnalysis.js
src/app/functions/aiAnalysisUtils.js
src/app/pages/Analisis/components
```

## Componentes compartidos

Selectores reutilizables:

```text
src/app/components/selectors/SearchableSelect.jsx
src/app/components/selectors/usePetCatalogOptions.js
```

Estos se usan para tipos, razas, sexo, mascotas y otros dropdowns con buscador.

La guia de componentes, hooks, servicios y funciones esta en:

```text
documents/components-and-functions.md
```

## Notas

- Los listados de mascotas e historiales usan paginacion con headers `x-page` y `x-limit`.
- El login bloquea usuarios inactivos.
- El historial clinico creado no se edita desde el frontend.
- La revision veterinaria del analisis IA actualiza `person_response` y marca `state: true`.
- Si ya existe un diagnostico IA para una mascota, el veterinario actualiza ese registro en lugar de reenviar la solicitud a la IA.
