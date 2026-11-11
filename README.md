# Algoritmia UNT

Sitio del Club de Algoritmia para preparar TAP y Regionales. Permite explorar problemas, consultar herramientas de C++17, armar apuntes por secciones y descargar enunciados originales para practicar.

Publicado en [club-algoritmia-unt.pages.dev](https://club-algoritmia-unt.pages.dev/), en la cuenta de Cloudflare del usuario. Las actualizaciones se cargan manualmente en Pages; ver [publicación y traslado](docs/publicacion.md).

Inventario inicial: 51 problemas (Regionales 2023–2025 y TAP 2026), 30 bloques de apuntes y análisis de cuatro torneos. El Regional 2026 tiene solamente una ficha pendiente: sus problemas se incorporarán cuando estén publicados y puedan verificarse.

## Usar en desarrollo

Requiere Node.js 24 LTS y npm.

```sh
npm ci
npm run dev
```

Abrir http://127.0.0.1:4321/. No requiere claves, base de datos ni servicios externos para funcionar. La selección y preferencias se guardan en el navegador.

## Comprobar y construir

```sh
npm run check
npm test
npx playwright install chromium
npm run test:e2e
npm run build
npm run preview
```

La construcción produce `dist/`: archivos estáticos que pueden alojarse en Cloudflare Pages, Vercel o un servidor de la facultad. Las bibliotecas de PDF se cargan al exportar, no al entrar al catálogo. La generación usa fuentes incorporadas y los enunciados preparados dentro del proyecto.

Para validar también todos los fragmentos C++:

```sh
python scripts/validate-content.py
```

Ese paso necesita Python 3 y `g++` en el PATH. Las pruebas de navegador generan capturas y descargas en carpetas `test-results*`, excluidas de Git.

## Contenido y mantenimiento

- [Procedimiento para agregar y revisar contenido](docs/mantenimiento.md).
- [Fuentes y alcance de las estadísticas](docs/fuentes-datos.md).
- [Biblioteca de bloques](content/apuntes/cpp/README.md).
- [Plan aprobado](docs/plan-implementacion.md) y [estado de las entregas](docs/avance.md).

Los AC cuentan equipos del torneo original, no envíos ni usuarios de práctica de Codeforces. Cada torneo conserva su población. Temas, dificultad y requisitos son valoraciones editoriales: las inferencias todavía no contrastadas están señaladas en las fichas.

## Revisar PDFs

```sh
node scripts/verify-pdf.mjs /ruta/absoluta/a/carpeta-de-revision
python scripts/verify-pdf.py /ruta/absoluta/a/carpeta-de-revision
```

En Windows usar una ruta absoluta de Windows. El segundo paso requiere Poppler (`pdftoppm`), `pdfplumber` y Pillow; acepta `--poppler` para indicar el ejecutable. Genera páginas y hojas de contacto para inspección visual. Ese paso complementa las pruebas automáticas; no certifica por sí solo la legibilidad.
