# Componentes y funciones del frontend

Este documento explica como esta organizado el frontend, que hace cada grupo de componentes y donde modificar el comportamiento. La aplicacion usa React, Vite, React Router y servicios HTTP centralizados.

## Estructura general

```text
src/
  app/
    App.jsx
    components/
    config/
    context/
    functions/
    hooks/
    pages/
    service/
  styles/
```

Reglas de organizacion:
- `pages`: pantallas completas por modulo.
- `components`: piezas compartidas o componentes de UI.
- `hooks`: estado, carga de datos y coordinacion de flujos.
- `functions`: transformaciones, payloads, normalizadores y helpers puros.
- `service`: llamadas HTTP al backend.
- `config`: configuracion compartida, como Axios.

## Rutas

React Router se inicializa en `src/main.jsx` y las rutas principales estan en `src/app/App.jsx` y `src/app/pages/Dashboard/DashboardPage.jsx`.

Rutas actuales:
- `/`
- `/login`
- `/register`
- `/dashboard`
- `/dashboard/mascotas`
- `/dashboard/mascotas/nuevo`
- `/dashboard/historial`
- `/dashboard/historial/nuevo`
- `/dashboard/historial/pet/:petId`
- `/dashboard/usuarios`
- `/dashboard/analisis`

Para agregar una pantalla:
1. Crear carpeta en `src/app/pages/<Modulo>`.
2. Agregar componente de pagina.
3. Registrar ruta en `DashboardPage.jsx` si es privada, o en `App.jsx` si es publica.
4. Agregar item en `DashboardNav.jsx` si debe aparecer en menu.

## Configuracion HTTP

Archivo: `src/app/config/httpClient.js`

Responsabilidad:
- Crear cliente Axios.
- Leer `VITE_PAWLYTICS_API_URL`.
- Exponer helpers `get`, `post`, `put`, `patch`, `delete`.

Para modificar:
- Cambiar base URL: `.env` con `VITE_PAWLYTICS_API_URL`.
- Agregar interceptores: `pawlyticsHttpClient`.
- Agregar headers globales: configuracion de Axios.

## Servicios API

Carpeta: `src/app/service`

Servicios:
- `user/userService.js`: login, usuarios y datos de usuario.
- `mascotas/mascotasService.js`: mascotas.
- `historial/historialService.js`: historial clinico y detalle clinico.
- `analisis/analisisService.js`: IA, logs y `detailed_analysis`.
- `dashboard/dashboardService.js`: resumen dashboard.
- `catalogos/catalogosService.js`: tipos y razas.
- `owners/ownersService.js`: datos de propietarios.
- `pawlyticsApi.js`: agrega todos los servicios en un solo objeto.

Reglas:
- Los servicios no deben manejar UI.
- Los servicios solo construyen URL, payload, params y headers.
- `analisisService.js` agrega `x-ai-api-key` usando `import.meta.env.VITE_API_KEY_IA`.

Para modificar:
- Nuevo endpoint: agregar funcion en el servicio correcto y exportarla desde `pawlyticsApi.js`.
- Cambiar paginacion: revisar helpers `listConfig` de cada servicio.

## Hooks principales

### `useMascotasList`

Archivo: `src/app/hooks/useMascotasList.js`

Responsabilidad:
- Cargar mascotas por rol.
- Aplicar filtros.
- Manejar paginacion.
- Normalizar errores.

Modificar cuando:
- Cambie el contrato de mascotas.
- Se agreguen filtros.
- Se cambie el limite por pagina.

### `useClinicalHistories`

Archivo: `src/app/hooks/useClinicalHistories.js`

Responsabilidad:
- Cargar historiales clinicos.
- Cargar mascotas disponibles.
- Manejar vista lista, creacion y detalle.
- Soportar ruta por mascota `/dashboard/historial/pet/:petId`.

Modificar cuando:
- Cambien filtros de historial.
- Cambie la regla de creacion.
- Se agreguen nuevas vistas internas del historial.

### `useClinicalDetails`

Archivo: `src/app/hooks/useClinicalDetails.js`

Responsabilidad:
- Cargar detalle clinico relacional por mascota.

Modificar cuando:
- Cambie el endpoint `/detalle-clinico/pet/:petId`.
- Se agreguen transformaciones antes de mostrar detalle.

### `useAiAnalysis`

Archivo: `src/app/hooks/useAiAnalysis.js`

Responsabilidad:
- Cargar historiales analizables.
- Antes de llamar a IA, revisar si ya existe diagnostico para la mascota.
- Crear solicitud IA si no existe diagnostico previo.
- Consultar logs si la solicitud queda en cola.
- Cargar respuesta en editor.
- Guardar revision veterinaria con `state: true`.

Reglas:
- No reenvia a IA si ya hay `detailed_analysis` para la mascota.
- La respuesta disponible se edita en un solo textarea.

Modificar cuando:
- Cambie la regla de reutilizacion de diagnosticos.
- Cambie el polling de logs.
- Cambie el texto del prompt que arma `aiAnalysisUtils.js`.

### `usePetDiagnoses`

Archivo: `src/app/hooks/usePetDiagnoses.js`

Responsabilidad:
- En vista cliente, cargar diagnosticos revisados por mascota.
- Filtrar por `petId`, `state=true` y `hasPersonResponse=true`.
- Manejar paginacion.

Modificar cuando:
- Cambien los criterios de visibilidad para cliente.
- Cambie el limite por pagina.

### `useDashboardSummary`

Archivo: `src/app/hooks/useDashboardSummary.js`

Responsabilidad:
- Cargar metricas del dashboard.
- Mezclar respuesta con defaults para evitar datos indefinidos.

Modificar cuando:
- Se agreguen nuevas metricas o graficas.

## Funciones utilitarias

Carpeta: `src/app/functions`

Archivos:
- `authUtils.js`: normaliza login y errores.
- `dashboardUtils.js`: permisos y formato de metricas.
- `mascotasUtils.js`: normalizacion, paginacion y payload de mascotas.
- `clinicalHistoryPayloads.js`: construye payload Mongo y crea detalle relacional.
- `clinicalRecordFormatters.js`: fechas, metricas y textos de detalle clinico.
- `registerPayloads.js`: payload de registro.
- `userUtils.js`: payloads y reglas visuales de usuarios.
- `aiAnalysisUtils.js`: rol numerico y texto base para solicitud IA.

Reglas:
- Las funciones deben ser puras cuando sea posible.
- Si una funcion llama API, debe recibir el servicio como dependencia o vivir en hook/servicio.

## Dashboard y navegacion

Archivos:
- `src/app/pages/Dashboard/DashboardPage.jsx`
- `src/app/components/DashboardNav.jsx`
- `src/app/components/DashboardHeader.jsx`

Responsabilidad:
- Layout privado.
- Menu lateral.
- Header con acciones principales.
- Rutas internas del dashboard.

Para modificar:
- Nueva seccion de menu: `DashboardNav.jsx`.
- Nueva ruta privada: `DashboardPage.jsx`.
- Reglas de visibilidad: `dashboardUtils.js`.

## Mascotas

Carpeta: `src/app/pages/Mascotas`

Componentes:
- `MascotasPage.jsx`: decide vista cliente o admin.
- `Administradores/AdminMascotasPage.jsx`: listado general.
- `Cliente/ClienteMascotasPage.jsx`: listado cliente, creacion y diagnosticos.
- `Cliente/DiagnosticosMascota.jsx`: diagnosticos revisados desde Mongo.
- `components/MascotaForm.jsx`: formulario de mascota.
- `shared/MascotasTable.jsx`: tabla reutilizable.
- `shared/MascotasFilters.jsx`: filtros reutilizables.

Reglas:
- Cliente ve sus mascotas.
- Cliente puede consultar diagnosticos revisados.
- Admin/veterinario pueden navegar al historial.

Para modificar:
- Campos del formulario: `MascotaForm.jsx` y `mascotasUtils.buildMascotaPayload`.
- Columnas de tabla: `MascotasTable.jsx`.
- Filtros: `MascotasFilters.jsx` y `useMascotasList.js`.

## Historial clinico

Carpeta: `src/app/pages/Historial`

Componentes:
- `HistorialPage.jsx`: lista, creacion y detalle.
- `ClinicalHistoryForm.jsx`: formulario principal.
- `ClinicalRecordsForm.jsx`: detalle relacional.
- `HistoryTable.jsx`: tabla de historiales.
- `HistoryFilters.jsx`: filtros.
- `HistoryDetail.jsx`: vista solo lectura.
- `ClinicalRecordsDetailList.jsx`: detalle relacional en lectura.
- `FormFields.jsx`: campos reutilizables.

Reglas:
- Veterinario crea historiales.
- Cliente y admin consultan.
- El historial creado no se edita desde el frontend.

Para modificar:
- Campos de historial Mongo: `ClinicalHistoryForm.jsx` y `clinicalHistoryPayloads.js`.
- Campos relacionales: `ClinicalRecordsForm.jsx`.
- Vista de detalle: `HistoryDetail.jsx`.

## Analisis IA

Carpeta: `src/app/pages/Analisis`

Componentes:
- `AnalisisPage.jsx`: composicion principal.
- `components/AnalysisHistoryList.jsx`: historiales disponibles para analizar.
- `components/AnalysisLoading.jsx`: pantalla de carga.
- `components/AnalysisReview.jsx`: editor de diagnostico.
- `components/HistorySummary.jsx`: resumen del historial seleccionado.

Reglas:
- Si ya existe diagnostico para la mascota, se actualiza ese diagnostico.
- Si no existe, se crea solicitud a IA.
- La respuesta se carga en un textarea editable.
- Guardar actualiza `person_response` y marca `state: true`.

Para modificar:
- Texto editable y botones: `AnalysisReview.jsx`.
- Lista de historiales analizables: `AnalysisHistoryList.jsx`.
- Logica del flujo: `useAiAnalysis.js`.
- Texto enviado a IA: `aiAnalysisUtils.js`.

## Usuarios

Carpeta: `src/app/pages/Usuarios`

Componentes:
- `UsuariosPage.jsx`: pantalla principal.
- `components/VeterinarianForm.jsx`: creacion de veterinario.
- `components/UsersTable.jsx`: tabla y activacion/desactivacion.

Hook:
- `useUsersManagement.js`

Reglas:
- Solo admin ve usuarios.
- Se crean veterinarios creando primero datos de usuario y luego usuario.
- No se elimina usuario desde frontend; se activa/desactiva.

Para modificar:
- Campos de veterinario: `VeterinarianForm.jsx` y `userUtils.js`.
- Reglas de activar/desactivar: `useUsersManagement.js`.

## Componentes compartidos

Carpeta: `src/app/components`

Elementos:
- `DashboardNav.jsx`
- `DashboardHeader.jsx`
- `selectors/SearchableSelect.jsx`
- `selectors/usePetCatalogOptions.js`
- `forms/IconTextInput.jsx`
- `forms/FormControls.jsx`
- `ui/*`: componentes base tipo shadcn.

Para modificar:
- Selectores con buscador: `SearchableSelect.jsx`.
- Carga de tipos/razas: `usePetCatalogOptions.js`.
- Estilo base de UI: `src/styles/theme.css`.

## Estilos

Carpeta: `src/styles`

Archivos:
- `index.css`: imports principales.
- `tailwind.css`: Tailwind.
- `theme.css`: tokens, colores y estilos base.
- `fonts.css`: fuentes.

Reglas:
- Los colores Pawlytics estan en `theme.css`.
- Los botones activos usan cursor pointer global.
- Los botones deshabilitados usan cursor not-allowed.

Para modificar:
- Paleta: variables CSS en `:root`.
- Tipografia base: bloque `@layer base`.
- Cursor global de botones: `theme.css`.

## Variables de entorno

Archivo `.env` del frontend:

```env
VITE_PAWLYTICS_API_URL=http://localhost:3000/api
VITE_API_KEY_IA=
```

Reglas:
- Toda variable que se use en el browser debe empezar con `VITE_`.
- No usar `process.env` en componentes o servicios del frontend.
