import { Routes } from '@angular/router';

/**
 * Una ruta por cada pagina del sitio original. El slug es el nombre del
 * archivo .html sin extension, para que los enlaces antiguos se puedan
 * redirigir uno a uno desde Cloudflare Pages (ver public/_redirects).
 *
 * Todas las paginas se cargan de forma diferida para que el bundle inicial
 * siga siendo pequeno.
 */
export const routes: Routes = [
  {
    path: '',
    title: 'MOVIG',
    data: { bodyClass: 'index-page' },
    loadComponent: () => import('./pages/home/home').then((m) => m.Home),
  },
];
