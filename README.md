# MOVIG

Sitio web corporativo de MOVIG (camaras de seguridad, videovigilancia, control
de acceso y monitoreo), construido con **Angular 20** y desplegado en
**Cloudflare Pages**.

## De sitio estatico a Angular

El sitio era un conjunto de 15 archivos HTML sueltos basados en la plantilla
[Moderna](https://bootstrapmade.com/free-bootstrap-template-corporate-moderna/)
de BootstrapMade. La migracion mantiene el diseno **identico**: se conservan el
mismo HTML, el mismo `assets/css/main.css` y los mismos plugins (Bootstrap, AOS,
Swiper, GLightbox, Isotope, PureCounter, Waypoints), que se siguen cargando como
archivos estaticos desde `src/index.html`.

Lo que si cambio:

- Cada pagina es ahora un componente con carga diferida y su propia ruta.
- La cabecera y el pie, que estaban duplicados en los 15 archivos, son un solo
  componente cada uno.
- `assets/js/main.js` y `assets/js/Whatsapp.js` se portaron a TypeScript en
  [`src/app/core/template-runtime.ts`](src/app/core/template-runtime.ts). El
  script original se ejecutaba una sola vez al cargar la pagina; en una SPA los
  plugins se tienen que volver a inicializar despues de cada navegacion.
- Las URLs pierden el `.html`: `/about.html` pasa a ser `/about`. Las direcciones
  viejas siguen funcionando gracias a las redirecciones 301 de
  [`public/_redirects`](public/_redirects).

El sitio estatico original queda archivado en [`legacy/`](legacy/) como
referencia.

## Estructura

```
src/
  index.html            head original: fuentes, CSS y JS de los vendors
  app/
    app.ts / app.html   armazon: cabecera, contenido, pie, volver arriba
    app.routes.ts       una ruta por cada pagina del sitio original
    core/               port de main.js y del validador del formulario
    layout/             cabecera y pie compartidos
    pages/              una carpeta por pagina
assets/                 CSS, JS, imagenes y vendors del template (sin tocar)
public/                 _redirects y _headers para Cloudflare Pages
legacy/                 el sitio estatico anterior, tal como estaba
```

## Desarrollo

```bash
npm install
npm start       # http://localhost:4200
npm run build   # produccion -> dist/movig/browser
```

## Despliegue

Ver [CLOUDFLARE.md](CLOUDFLARE.md). En resumen: build command `npm run build`,
output directory `dist/movig/browser`.

## Pendientes conocidos

Estos puntos ya venian del sitio anterior, no los introduce la migracion:

- El formulario de contacto apunta a `forms/contact.php` y Cloudflare Pages no
  ejecuta PHP. Hay que reemplazarlo por una Pages Function o un servicio externo.
- Las paginas `team`, `blog`, `blog-details` y `portfolio-details` conservan
  imagenes de demostracion de la plantilla que ya no estan en `assets/img/`.
  No se ven porque ninguna esta enlazada desde el menu.
