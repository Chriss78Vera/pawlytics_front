import { analisisService } from '@/app/service/analisis/analisisService.js';
import { catalogosService } from '@/app/service/catalogos/catalogosService.js';
import { dashboardService } from '@/app/service/dashboard/dashboardService.js';
import { historialService } from '@/app/service/historial/historialService.js';
import { mascotasService } from '@/app/service/mascotas/mascotasService.js';
import { ownersService } from '@/app/service/owners/ownersService.js';
import { userService } from '@/app/service/user/userService.js';

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
