import { analisisService } from './analisis/analisisService.js';
import { catalogosService } from './catalogos/catalogosService.js';
import { dashboardService } from './dashboard/dashboardService.js';
import { historialService } from './historial/historialService.js';
import { mascotasService } from './mascotas/mascotasService.js';
import { ownersService } from './owners/ownersService.js';
import { userService } from './user/userService.js';

export const pawlyticsApi = {
  ...userService,
  ...mascotasService,
  ...catalogosService,
  ...dashboardService,
  ...ownersService,
  ...historialService,
  ...analisisService,
  getPets: mascotasService.getMascotas,
};
