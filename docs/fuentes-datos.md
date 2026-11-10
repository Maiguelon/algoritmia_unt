# Fuentes y revisión del inventario inicial

## Qué significa verificado

En estas fichas, `status: verificado` se refiere a la identidad del problema y a sus cifras de AC dentro de la población indicada. Las bandas de dificultad, puntajes conceptuales, carga de implementación, temas y conexiones con apuntes son decisiones editoriales. Se conservan `difficultyReason` y `classificationConfidence` para expresar la incertidumbre de cada caso.

Los datos de práctica del Gym cambian con el tiempo. Los AC publicados aquí corresponden a los equipos del torneo original, no al contador de usuarios que lo resolvieron después en Codeforces.

## Inventario disponible

| Torneo calendario | Temporada / identificación ICPC | Set de práctica | Problemas | Población de las estadísticas |
|---|---|---|---:|---|
| Regional 2023 | 2023–2024 | [Gym 104736](https://codeforces.com/gym/104736) | 13 | 152 equipos de South, sin CCL |
| Regional 2024 | 2024–2025 | [Gym 105505](https://codeforces.com/gym/105505) | 12 | 187 equipos de South, sin CCL |
| Regional 2025 | 2025–2026 | [Gym 106178](https://codeforces.com/gym/106178) | 12 | 201 equipos de South, sin CCL |
| TAP 2026 | Año 2026, inscripción ICPC TAP-2027 | [Gym 106682](https://codeforces.com/gym/106682) | 14 | 186 entradas de la tabla nacional publicada por AAPC |
| Regional 2026 | 2026–2027 | Enunciados oficiales; Gym pendiente | 13 | 214 equipos oficiales de South, sin CCL |

El Regional 2026 se incorporó el 10 de noviembre a pedido del usuario, una vez publicados el cuadernillo y el reporte oficial. El Gym continúa pendiente y no se supone ningún enlace. La investigación y la conciliación de resultados se documentan en [Regional 2026](investigacion/regional-2026.md). No hay proceso automático de actualización.

## Regionales 2023–2025

La primera importación reutiliza la investigación local del club, que ya había contrastado los equipos con AC y las primeras resoluciones entre el tablero y sus envíos. Los JSON publicados son una selección editorial de esa investigación; el sitio se construye usando los archivos del repo y no necesita la carpeta externa de trabajo.

Durante esta importación se volvieron a contar, para los 37 problemas, los equipos individuales que tienen cada letra en su lista de AC del tablero archivado. Esos recuentos y los tamaños de las poblaciones coinciden con los valores publicados.

Fuentes de resultados y cuadernillos:

- [Regional 2023: tablero](https://scorelatam.naquadah.com.br/latam-2023/), [envíos](https://scorelatam.naquadah.com.br/latam-2023/Runs.html), [cuadernillo](https://scorelatam.naquadah.com.br/latam-2023/contest.pdf) y [editorial](https://scorelatam.naquadah.com.br/latam-2023/editorial.pdf).
- [Regional 2024: tablero](https://scorelatam.naquadah.com.br/latam-2024/), [envíos](https://scorelatam.naquadah.com.br/latam-2024/Runs.html), [cuadernillo](https://scorelatam.naquadah.com.br/latam-2024/contest.pdf) y [soluciones oficiales](https://scorelatam.naquadah.com.br/latam-2024/icpcla24_solution_sketches.pdf).
- [Regional 2025: tablero](https://scorelatam.naquadah.com.br/latam-2025/), [envíos](https://scorelatam.naquadah.com.br/latam-2025/Runs.html) y [cuadernillo](https://scorelatam.naquadah.com.br/latam-2025/contest.pdf).

Se usa el filtro **South oficial**, excluyendo CCL y otras subregiones. Cada AC cuenta un equipo distinto, aunque haya enviado más de una solución aceptada. Por ejemplo, J de 2025 tiene 197 equipos con AC en esta población y no se confunde con sus 198 envíos aceptados.

La población South de 2025 es 201, no 205. H tiene **192/201** y J **197/201**. La tabla de 2025 deja 140 equipos con exactamente dos problemas, dentro de esta misma población. Cambiar de denominador altera esas comparaciones.

Los puestos UNT se toman de South y se conserva la penalidad en la nota de cada equipo. Esos puestos no se convierten automáticamente en clasificaciones a otra instancia: se requiere revisar el reglamento y los criterios por institución.

Para 2023 y 2024 se enlazan editoriales oficiales. Para 2025 no se encontró una editorial oficial en la investigación reutilizada: sus técnicas son inferencias del enunciado y sus niveles conservan la advertencia correspondiente. No se presentan como soluciones revisadas o demostradas.

## TAP 2026

La [página oficial de AAPC](https://aapc.org.ar/tap/) identifica fecha, resultados y juez. Enlaza al Gym 106682 y a los [resultados nacionales](https://aapc.org.ar/resultados-tap-2026/) y [resultados interactivos](https://storage.googleapis.com/tap-resultados-2026/index.html). El cuadernillo español enlazado desde el propio Gym es [TAP-2026.pdf](https://codeforces.com/gym/106682/attachments/download/39252/TAP-2026.pdf).

La página interactiva publica datos de BOCA en el objeto JSON `window.TAP`. Se reconstruyen los AC contando equipos cuyo problema tiene `state: solved`; la distribución se calcula desde `scoreboard.teams[].solved`. La tabla contiene 186 equipos, incluidas entradas Extra conservadas por AAPC. Esto describe la población publicada, sin afirmar que todos esos equipos sean elegibles para cupos.

| Problema | A | B | C | D | E | F | G | H | I | J | K | L | M | N |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Equipos con AC | 180 | 69 | 30 | 4 | 0 | 3 | 1 | 0 | 146 | 4 | 146 | 21 | 7 | 11 |

Los resultados publicados corrigen recuerdos informales: Computops figura 55.º con A, B, I y K; Mono Pollo NP++ 18, 99.º con A, I y K; Achilata, 101.º con A, B y K. No se reemplaza K por L ni se afirma aquí quién obtuvo un cupo indirecto sin contrastar las reglas.

Las fichas A, B, I y K tienen una selección de herramientas de base completa para un enfoque de implementación. Para C y J se reconoce que hace falta un bloque de DP/juego o intervalos. Las técnicas de los restantes problemas difíciles todavía están pendientes de contraste con una solución de referencia: sus bandas son provisionales y se indica confianza baja. Tener AC y enunciado oficiales no convierte automáticamente esa clasificación en oficial.

## PDFs de los enunciados

Los 64 archivos individuales de `public/statements/` conservan páginas de los cuadernillos originales. Los regionales están en inglés y TAP 2026 en español. Los nombres de TAP en el catálogo coinciden con Codeforces y pueden diferir del título español impreso.

Además se conservan los cinco cuadernillos completos como `*-completo.pdf`, accesibles desde la página de cada torneo mediante una descarga local. Son copias sin modificaciones de las fuentes ya archivadas: Regional 2023 tiene 30 páginas, Regional 2024 y 2025 tienen 19 cada uno y TAP 2026 tiene 20. Se contrastaron estos recuentos con los metadatos de los enunciados individuales y se comprobó igualdad binaria con los archivos fuente. `statementBooklet` relaciona cada descarga con su URL oficial en las fuentes del torneo. Regional 2026 tiene un cuadernillo de 23 páginas físicas.

Cada problema guarda `statementPages` con páginas físicas inclusivas del PDF de origen, empezando en uno. El rango termina antes del inicio del siguiente problema. Las páginas en blanco intencionales de 2023 se conservan como parte del original; no son contenido perdido.

Se comprobaron cantidad de páginas, igualdad del texto extraído y dimensiones respecto del original. Además se renderizaron e inspeccionaron las 101 páginas de los 64 archivos, incluidos ejemplos, diagramas y fórmulas. No se reescribieron los enunciados ni se incorporaron soluciones en esos PDFs.

## Contenido y mantenimiento

- La banda de dificultad se asigna editorialmente; el porcentaje de AC es evidencia separada, nunca una conversión automática a rating de Codeforces.
- Una cobertura completa de apuntes se refiere a las herramientas del enfoque elegido. No significa que el apunte contenga la observación o demuestre la solución.
- Una cobertura parcial conserva herramientas útiles y enumera lo que falta. No se completa con módulos que no existen.
- `sourceUrl` identifica la fuente del enunciado. Los resultados y su población se vinculan desde el torneo.
- Los datos desconocidos se guardan como `null`, no como cero.
- La validación rechaza referencias rotas, duplicados, denominadores inválidos, AC imposibles y rangos de páginas inválidos. Las pruebas de datos también contrastan los totales de las distribuciones y la existencia de cada PDF local.
- Para revisar el contenido se ejecuta `npm exec vitest run tests/data.test.ts`. La importación de datos también ejecuta `validateDataset()` y detiene la construcción si encuentra inconsistencias.

Queda pendiente la revisión humana con integrantes del club y el contraste de los enfoques avanzados que están marcados con confianza baja o media. La revisión de técnicas avanzadas del Regional 2026 y la incorporación de su futuro Gym requieren nuevas comprobaciones y commit.

## TAP 2024 y 2025

La ampliación del 10 de noviembre suma 28 problemas: [TAP 2024](investigacion/tap-2024.md) y [TAP 2025](investigacion/tap-2025.md). Dos recolectores entregaron fuentes en un [formato común](investigacion/recopilacion-tap.md); root revisó las cifras y decidió dificultad y herramientas.

TAP 2024 usa 155 filas nacionales de la réplica final del evento en Gym 105321, excluyendo la fila extranjera 156. Sus AC suman 667, como los problemas resueltos de esos equipos. TAP 2025 usa las 183 filas nacionales AAPC y la réplica en Gym 106054 tras reconciliar sus diferencias de participación. CCL Soarch 4 se excluye y se conserva el cero de Root: A=175 y G=181; la suma correcta es 678, no los 680 AC del pie sin filtrar.

Las primeras resoluciones se reconstruyen al minuto desde las celdas de esa población. Se verificaron también las penalidades a partir de tiempos y fallos. Las capturas completas permanecen en el trabajo del chat y el repositorio conserva los dos archivos de evidencia.

El resultado UNT de La tupla del gordo silla en TAP 2024 tiene una discrepancia entre FACET y la fila 76 del Gym. Se informa el puesto atribuido por FACET y quedan sin atribuir AC/penalidad/letras. La promoción efectiva local de ambas ediciones no está confirmada; se representa como desconocida. El reglamento de 2025 verifica 55 cupos argentinos y la vía del top 20 con límite institucional: el último elegible de esa vía fue TAPires (19.º, 5 AC, 328).

Se suman 28 PDFs individuales y dos cuadernillos completos. Texto, dimensiones y flujos de dibujo coinciden con el original; los renders de sus 42 páginas de problemas resultaron idénticos píxel a píxel. Hay 92 fichas y siete torneos. No se modificaron los textos de los apuntes ni se publicaron soluciones nuevas. Las técnicas avanzadas de estos TAP conservan valoración editorial provisional sin editorial oficial localizada.
