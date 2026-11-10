# Publicación y traslado

La primera versión se publica mediante Sites, con alojamiento estático sobre Cloudflare. El origen asignado es https://algoritmia-unt.kindloom8.chatgpt.site. La publicación se confirma por su resultado y pruebas del entorno, no por la mera existencia de ese nombre.

El ID de este alojamiento está en `.openai/hosting.json`; no contiene credenciales. La cuenta de Cloudflare Pages del club y un dominio propio no se configuraron en este proyecto.

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

Elegir el repo y la rama que corresponda, usar Node 24, instalar con `npm ci`, construir con `npm run build` y publicar `dist/`. El sitio no necesita variables secretas ni un servidor de Node en producción. Esta guía prepara el traslado; no representa una publicación ya efectuada en la cuenta de Pages del club.

## Servidor de la facultad

Copiar el contenido de `dist/` a la raíz del sitio. Servir las carpetas mediante sus `index.html`, los PDF con tipo `application/pdf` y los módulos JavaScript con un tipo correcto. Configurar la página `404.html` para rutas inexistentes. Para alojarlo bajo un subdirectorio, revisar primero las rutas absolutas y la configuración `base`; esta versión está preparada para la raíz de un dominio.

## Verificar después de publicar

Abrir directamente una ficha y recargarla, filtrar el catálogo, seleccionar problemas y descargar tanto el apunte como los enunciados. Comprobar que los enlaces y QR abran la dirección registrada en las fuentes. Abrir los archivos descargados sin conexión.

Para volver a una versión anterior, construir y publicar el commit anterior elegido. Conservar el historial y las fuentes editoriales permite reconstruir el contenido junto con la interfaz.
