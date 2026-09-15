# Despliegue en Cloudflare Pages

El sitio compila a archivos estaticos, asi que funciona en el plan gratuito de
Cloudflare Pages. No hace falta ningun Worker ni Pages Function.

## Configuracion del proyecto

En el panel de Cloudflare: **Workers & Pages → Create → Pages → Connect to Git**,
se elige el repositorio `CamachoLives/MOVIG` y se completa asi:

| Campo                       | Valor                 |
| --------------------------- | --------------------- |
| Framework preset            | `Angular`             |
| Build command               | `npm run build`       |
| Build output directory      | `dist/movig/browser`  |
| Root directory              | (vacio)               |
| Production branch           | `main`                |

> El directorio de salida es `dist/movig/**browser**`. Si se apunta a
> `dist/movig` a secas, Cloudflare no encuentra el `index.html`.

La version de Node la toma del archivo [`.node-version`](.node-version) (22). Si
se prefiere fijarla a mano, se agrega la variable de entorno `NODE_VERSION = 22`.

A partir de ahi, cada `git push` a `main` dispara un despliegue, y cada rama o
pull request genera una preview con su propia URL.

## Archivos que Cloudflare lee del build

Ambos salen de la carpeta [`public/`](public/) y se copian tal cual al build:

- **`_redirects`** — Redirige las URLs `.html` del sitio anterior a las rutas
  nuevas (301) para no perder los enlaces ya compartidos o indexados, y manda
  todo lo demas a `index.html` con un 200 para que resuelva el router de
  Angular. Sin esta ultima regla, entrar directo a `/services` daria 404.
- **`_headers`** — Cache larga para los bundles con hash y cache de un mes para
  las imagenes y los vendors del template.

## Comandos locales

```bash
npm install       # una sola vez
npm start         # servidor de desarrollo en http://localhost:4200
npm run build     # build de produccion en dist/movig/browser
```

Para probar el resultado del build exactamente como lo sirve Cloudflare:

```bash
npx wrangler pages dev dist/movig/browser
```

## Pendiente: el formulario de contacto

El formulario apunta a `forms/contact.php`. Cloudflare Pages no ejecuta PHP, asi
que ese envio falla igual que en el sitio estatico actual. Para dejarlo
funcionando hay que reemplazarlo por una Pages Function (`functions/contact.ts`)
que envie el correo con un servicio como Resend o MailChannels, o apuntar el
`action` del formulario a un servicio externo.
