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

## Carrito de cotizacion

Las camaras del portafolio y los servicios se pueden ir agregando a un carrito.
Como el sitio no maneja precios, el carrito no cobra nada: junta la seleccion y
arma un mensaje de WhatsApp con el detalle, agrupado en camaras y servicios.

- El boton flotante de abajo a la derecha abre el panel con lo seleccionado.
- El contenido se guarda en `localStorage`, asi que sobrevive a la navegacion
  entre paginas y a la recarga.
- El numero de destino es el mismo del boton "Hablar por WhatsApp" del pie.

El item se define desde la plantilla de cada pagina, no desde un catalogo
aparte, para que el texto que ve el visitante y el que viaja en el mensaje sean
el mismo. Ver [`src/app/core/cart.ts`](src/app/core/cart.ts).

## Estructura

```
src/
  index.html            head original: fuentes, CSS y JS de los vendors
  app/
    app.ts / app.html   armazon: cabecera, contenido, pie, volver arriba
    app.routes.ts       una ruta por cada pagina del sitio original
    core/               port de main.js, validador del formulario y carrito
    layout/             cabecera y pie compartidos
    pages/              una carpeta por pagina
    shared/             componentes reutilizables (boton de agregar al carrito)
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
