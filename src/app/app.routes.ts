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
    loadComponent: () =>
      import('./pages/home/home').then((m) => m.Home),
  },
  {
    path: 'about',
    title: 'Sobre Nosotros - MOVIG',
    data: { bodyClass: 'about-page' },
    loadComponent: () =>
      import('./pages/about/about').then((m) => m.About),
  },
  {
    path: 'services',
    title: 'Servicios - Movig',
    data: { bodyClass: 'services-page' },
    loadComponent: () =>
      import('./pages/services/services').then((m) => m.Services),
  },
  {
    path: 'service-details',
    title: 'Nuestros Servicios - Movig',
    data: { bodyClass: 'service-details-page' },
    loadComponent: () =>
      import('./pages/service-details/service-details').then((m) => m.ServiceDetails),
  },
  {
    path: 'service-details1',
    title: 'Nuestros Servicios - Movig',
    data: { bodyClass: 'service-details-page' },
    loadComponent: () =>
      import('./pages/service-details1/service-details1').then((m) => m.ServiceDetails1),
  },
  {
    path: 'service-details2',
    title: 'Nuestros Servicios - Movig',
    data: { bodyClass: 'service-details-page' },
    loadComponent: () =>
      import('./pages/service-details2/service-details2').then((m) => m.ServiceDetails2),
  },
  {
    path: 'service-details3',
    title: 'Nuestros Servicios - Movig',
    data: { bodyClass: 'service-details-page' },
    loadComponent: () =>
      import('./pages/service-details3/service-details3').then((m) => m.ServiceDetails3),
  },
  {
    path: 'service-details4',
    title: 'Nuestros Servicios - Movig',
    data: { bodyClass: 'service-details-page' },
    loadComponent: () =>
      import('./pages/service-details4/service-details4').then((m) => m.ServiceDetails4),
  },
];
