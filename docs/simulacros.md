# Simulacros con inscripción compartida

La maqueta de `/simulacro/` sirve para revisar el diseño. La ruta `/simulacro/torneo/?edicion=ID` usa la inscripción compartida y el horario del servidor.

## Ensayo local

Desde el proyecto, instalá las dependencias y construí el sitio:

```sh
npm ci
npm run build
npx wrangler d1 migrations apply SIMULACROS_DB --local --config wrangler.simulacro-local.jsonc
```

Generá una edición de prueba con un ID nuevo que empiece con `ensayo`. Elegí un inicio unos minutos en el futuro y usá fechas ISO con zona horaria. Las ediciones de prueba usan problemas distintos de la selección del miércoles.

```sh
node scripts/preparar-simulacro.mjs ensayo-1 INICIO_ISO FIN_ISO .wrangler/ensayo-1.sql
npx wrangler d1 execute SIMULACROS_DB --local --config wrangler.simulacro-local.jsonc --file .wrangler/ensayo-1.sql
npx wrangler pages dev dist --d1 SIMULACROS_DB=30bf2982-45a2-4873-a10d-23d91a60cbd7 --compatibility-date 2026-11-12 --ip 127.0.0.1 --port 4322
```

Abrí `http://127.0.0.1:4322/simulacro/torneo/?edicion=ensayo-1` en dos sesiones de navegador y anotá un usuario de Codeforces distinto en cada una. Verificá que los dos aparezcan al recargar y que la inscripción cierre y los enunciados aparezcan en ambas al arrancar. Al finalizar, el PDF y los enlaces siguen disponibles para práctica. La lectura automática de envíos se probará cuando se conecte al marcador.

## Edición del miércoles

El miércoles 18 de noviembre va de 17 a 19 h de Argentina. Generá la edición con `node scripts/preparar-simulacro.mjs miercoles-2026-11-18 .wrangler/miercoles.sql`. El script carga el horario confirmado y prepara la selección acordada. Los archivos de preparación se pueden guardar bajo `.wrangler/` y no son parte de los archivos públicos. Cargá las migraciones y el SQL de la edición en la base D1 del club. Para corregir una inscripción antes del arranque, editá su fila en `simulacro_entries` filtrando por `event_id` y `handle`.

En Cloudflare Pages se necesita una base D1 con el nombre de enlace `SIMULACROS_DB`. Publicá con `npx wrangler pages deploy dist --project-name club-algoritmia-unt` desde la raíz del repo para incluir las funciones de `functions/`. La carga de un ZIP por el panel solo publica los archivos estáticos. La configuración `wrangler.simulacro-local.jsonc` corresponde únicamente al ensayo local.
