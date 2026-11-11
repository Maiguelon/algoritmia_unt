# Entregas y verificación

Plan aprobado y ejecutado el 9 de noviembre de 2026. Cada entrega de implementación se comprobó y cerró con un commit. En esa entrega, el contenido del Regional 2026 quedó aplazado por indicación del usuario; se incorporó en la revisión del 10 de noviembre, documentada en `investigacion/regional-2026.md`.

| Chunk | Commit | Resultado |
|---|---|---|
| 0 | `747a2de` | 30 bloques; Contenedores; índice condicional; 122 fragmentos C++17 compilados |
| 1 | `07d9e7d` | Modelo, tres pilotos y validación de datos |
| 2 | `3036c2c` | Base Astro/React, identidad y navegación |
| 3 | `bc67f0b` | Biblioteca y fichas de los 30 apuntes |
| 4 | `4806854` | Catálogo, filtros por URL y selección persistida |
| 5 | `e119e83` | Fichas de problemas y pistas opcionales |
| 6 | `20060cd` | Armador por bloques y partes, apoyos opcionales, vista previa |
| 7 | `8421124` | PDF de apuntes y QA de paginación/código/tablas |
| 8 | `fa1fad9` | PDF de enunciados originales con QR y enlaces |
| 9 | `0c30b60` | Distribución y curva del torneo; resultados UNT y fuentes |
| 10a | `7f8c9f6` | Regional 2025 completo |
| 10b | `afac3f3` | TAP 2026 completo |
| 10c | `7b46e84` | Solo ficha pendiente del Regional 2026; su incorporación sigue aplazada |
| 10d | `b1c7f09` | Regional 2023 completo |
| 10e | `25e18cd` | Regional 2024 completo |

La validación integrada comprende 33 pruebas de datos, selección, filtros y PDF, y 12 recorridos de navegador. Los ejemplos C++17 tienen su validador independiente. Los PDFs originales se reconciliaron con sus cuadernillos y se inspeccionaron las 80 páginas. El QA de siete variantes de exportación generó y revisó 77 páginas adicionales de apuntes y paquetes.

La interfaz y las descargas se probaron en Chromium en computadora y celular. Esto no equivale a haber realizado pruebas con integrantes del club: quedan pendientes la revisión del usuario y de una persona principiante. También siguen pendientes los enfoques avanzados identificados como estimaciones de baja confianza.

La primera publicación tiene su propia configuración y verificación. El resultado estático permanece portable a Cloudflare Pages o al servidor de la facultad.

El chunk 11 se cerró en `d3c3fd7`: 33 pruebas y 12 recorridos aprobados, comprobación de tipos sin errores y construcción de 93 páginas. El chunk 12 incorpora la configuración y la guía de publicación; el estado efectivo del alojamiento se verifica al desplegar ese commit.

## Selección y apuntes automáticos — 10 de noviembre

- `01e3499`: modos de composición y migración de las preferencias anteriores; 11 pruebas pertinentes aprobadas.
- Página única `/seleccion/`, descargas rápidas en la barra, menú de descargas en celular y controles detallados en Personalizado.
- Recomendado, Completo y Solo funciones se recalculan al cambiar los problemas. El borrador personalizado conserva sus exclusiones y partes.
- Se conserva la cobertura por problema, el índice condicional y la plantilla única. No se modificó el contenido de los apuntes.
- Comprobación: 40 pruebas unitarias, tipos sin errores y 20 recorridos de navegador, incluidas descargas reales, migración, dos pestañas, reintento de conexión y pantallas de 320 y 390 px. Revisión visual de escritorio y celular.

## Ampliación TAP 2024–2025 — 10 de noviembre

Recopilación dividida entre dos agentes GPT-6 Luna con esfuerzo bajo, sin edición del catálogo. Root revisó las fuentes, reconstruyó las penalidades por celda, concilió poblaciones y asignó bandas, puntuaciones y herramientas. Se integran 28 fichas, 28 enunciados individuales y dos cuadernillos completos: 92 problemas y siete torneos en total.

Los inventarios y evidencia están en `investigacion/tap-2024.md` y `investigacion/tap-2025.md`. Los AC suman 667 y 678 respectivamente. Se conserva la discrepancia de población del Gym 2025; la identidad de La tupla del gordo silla de 2024 se resolvió con ICPC en la revisión posterior. Se distingue clasificación local desconocida de cero clasificados.

Validación de la ampliación: 42 pruebas unitarias, 22 recorridos de navegador, tipos sin errores y comparación visual de las 42 páginas de problemas exportadas. El paquete mixto TAP 2024/TAP 2025 descargado desde el navegador conserva sus cuatro páginas y los enlaces a ambos Gym.

## Revisión de promoción TAP 2024–2025 — 10 de noviembre

Se verifican en navegador real las tablas oficiales ICPC. TAP 2024: La tupla del gordo silla, 76.º, 4 AC, penalidad 339, último AC al minuto 210; se reconcilia con el alias del Gym sin cambiar los contadores globales. La regla contemporánea hallada reporta cuatro cupos por universidad y uno femenino adicional; el total nacional y las bases completas siguen sin localizar. Invitaciones y asistencia UNT no confirmadas. Se retira TuringBot de Tucumán por país PE en el tablero oficial.

TAP 2025: tres UNT aceptados en el Regional según el registro oficial (Milanguchito, Chat con Grandes Problemas Tecnicos y while(so serious)). Solo Milanguchito tiene resultado regional identificado. El contador y los badges dicen aceptados, separados de asistencia. Fuentes, transcripción y límites en `investigacion/tap-promocion-2024-2025-evidencia.json`.

Validación de esta revisión: 44 pruebas unitarias, 22 recorridos de navegador y comprobación de tipos sin errores. Se comprueban la identidad conciliada, las letras y penalidad, los tres aceptados, el cupo por universidad y la eliminación de la atribución peruana, además del funcionamiento de selección y descargas.

## Comunidad y fotos en el inicio — 10 de noviembre

- `92f7c56`: fotos de camps de La Plata 2026 y Rosario 2024 con fuentes y créditos, y cuatro equipos tucumanos del Regional 2026. Copias WebP y manifiesto de procedencia en `content/media/galleries.json`; notas en `fotos-comunidad.md`.
- Carrusel manual con teclado y desplazamiento táctil, sin reproducción automática; explicación del camp plegada inicialmente. La dinámica de ediciones anteriores se distingue del anuncio de Tucumán 2027.
- WhatsApp reemplaza el sticker decorativo junto a las hormigas y usa el enlace proporcionado por el usuario, también en la invitación del camp.
- Preview de UNT, UNSTA y UTN con igual jerarquía por equipo; enlace al apartado Tucumán del Regional, que incluye las cuatro fotos ampliables.
- Página de torneos: «Analizá cada torneo», preguntas sobre problemas, temas y clasificación; sin las etiquetas redundantes de año/verificación.
- Verificación: tipos sin errores; cuatro recorridos de navegador aprobados, incluidos carrusel, teclado, plegado, enlaces e imágenes, y pantallas de 320, 390 y 1280 px. Revisión visual de la portada en escritorio y celular.

## Recomendado al entrar y descargas visibles — 10 de noviembre

Con problemas seleccionados, la entrada al apunte parte de Recomendado y no restaura un borrador anterior. Cambiar el conjunto de problemas también reinicia ese modo, incluso desde otra pestaña. Personalizado mantiene los cambios al alternar modos durante la visita. El armador libre sin problemas conserva su configuración y las entradas explícitas desde la biblioteca siguen funcionando.

El resumen «Tu apunte lleva…» aparece antes de las categorías, con herramientas y descarga. Se suma otro botón al final de los controles; ambos usan el mismo contenido y muestran el resultado o error junto al botón utilizado. Computops aparece primero en las galerías de portada y Regional.

Validación: 45 pruebas unitarias, 24 recorridos de navegador y tipos sin errores. Se descargaron PDFs reales desde los dos accesos, se probaron preferencias antiguas y cambios de problemas entre pestañas, y se revisó el resumen en escritorio y celular.

## Primera práctica guiada — 10 de noviembre

Se conecta «Arrancá acá» con `/empeza/`: seis pasos con el A del TAP 2026, razonamiento por conversión a segundos, herramientas del apunte, plantilla incompleta, implementación explicada opcional, pruebas y envío en Codeforces. El cierre explica las dificultades y ofrece otros Iniciales y la comunidad. Fuentes y verificación del código en `primeros-pasos.md`.

La implementación se comprobó localmente sobre las 18.000 entradas válidas; la plantilla pasó la comprobación de sintaxis. Tipos sin errores y revisión visual en 1280, 390 y 320 px. Los diez recorridos pertinentes de inicio, primera práctica y selección pasaron; las tres descargas de PDF también pasaron durante la validación. Se corrige además la descarga inferior: solo aparece en Personalizado, según la observación del usuario.

## Apunte por nivel y bloques separados — 10 de noviembre

Recomendado y la descarga rápida comparten el perfil del problema más accesible seleccionado. Inicial suma los cinco bloques de base, plantilla y explicaciones completas; Consolidación incluye plantilla y temas concretos completos sin base; Salto regional omite base y plantilla, usa solo funciones de los contenedores y las tres partes de los demás temas. Avanzado y Top global quedan fuera de la recomendación automática por ahora. Personalizado permite recuperar o quitar la plantilla.

Cada bloque empieza en una página nueva del PDF. La plantilla, si está incluida, va primero; el índice conserva su regla de dos o más bloques, sin contar la plantilla. Un único bloque sin plantilla comienza en la primera página y no genera una portada vacía.

Validación: 53 pruebas unitarias, 28 recorridos de navegador y comprobación de tipos sin errores. Se generaron cinco PDF reales (48 páginas), se comprobaron plantilla, destinos del índice y comienzos de bloques, y se revisaron visualmente todas las páginas sin recortes ni caracteres sustituidos. Se eliminó una hoja vacía que podía provocar el margen final de un bloque. La descarga rápida de Salto y la exclusión automática de Avanzado también se comprobaron desde el navegador.
