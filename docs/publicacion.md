# Publicación y traslado

El alojamiento principal es [club-algoritmia-unt.pages.dev](https://club-algoritmia-unt.pages.dev/), en la cuenta de Cloudflare del usuario. Se publicó el 10 de noviembre de 2026 mediante **Pages / Direct Upload**, con el proyecto `club-algoritmia-unt`. El dominio provisorio pertenece a Pages y no usa el dominio de Sites.

La versión de aplicación publicada corresponde al commit `a83eb4836eae974cf9cb2ed4f49c07beedc03058`: 280 archivos estáticos, incluido el PDF fijo de la primera práctica. Cloudflare confirmó la publicación y se comprobaron la portada, una ficha, el carrito y tres descargas reales. El apunte fijo descargado coincide byte por byte con el original.

La publicación anterior en https://algoritmia-unt.kindloom8.chatgpt.site permanece como copia histórica. Su ID sigue en `.openai/hosting.json`, sin credenciales; ese archivo no configura el nuevo proyecto de Pages. No se configuraron un dominio comprado ni conexión automática a Git.

## Construir la misma versión

Desde el commit que se quiera publicar:

```sh
npm ci
npm run check
npm test
npm run build
```

El resultado publicable es `dist/`. Incluye páginas HTML, JavaScript, fuentes y los enunciados originales. No se requieren servicios externos en tiempo de ejecución para consultar el catálogo o generar PDFs.

## Cloudflare Pages o Vercel

Para actualizar el proyecto actual de Pages:

1. Comprobar y construir la versión elegida con los comandos anteriores.
2. Comprimir **el contenido** de `dist/` en ZIP: `index.html` debe quedar en la raíz del archivo, sin una carpeta `dist` contenedora. No incluir fuentes, `.git`, `.openai`, credenciales ni archivos de trabajo.
3. Abrir Workers & Pages, elegir `club-algoritmia-unt` y crear una nueva publicación de producción mediante carga directa.
4. Subir el ZIP, esperar la confirmación y comprobar la URL pública y las descargas.

Los commits no actualizan este alojamiento por sí solos. No se agregaron tokens ni claves al repositorio. El sitio no necesita variables secretas ni un servidor de Node en producción.

Para un futuro proyecto conectado a Git en Pages o Vercel, elegir el repositorio y la rama, usar Node 24, instalar con `npm ci`, construir con `npm run build` y publicar `dist/`.

## Servidor de la facultad

Copiar el contenido de `dist/` a la raíz del sitio. Servir las carpetas mediante sus `index.html`, los PDF con tipo `application/pdf` y los módulos JavaScript con un tipo correcto. Configurar la página `404.html` para rutas inexistentes. Para alojarlo bajo un subdirectorio, revisar primero las rutas absolutas y la configuración `base`; esta versión está preparada para la raíz de un dominio.

## Verificar después de publicar

Abrir directamente una ficha y recargarla, filtrar el catálogo, seleccionar problemas y descargar tanto el apunte como los enunciados. Comprobar que los enlaces y QR abran la dirección registrada en las fuentes. Abrir los archivos descargados sin conexión.

Para volver a una versión anterior, construir y publicar el commit anterior elegido. Conservar el historial y las fuentes editoriales permite reconstruir el contenido junto con la interfaz.
