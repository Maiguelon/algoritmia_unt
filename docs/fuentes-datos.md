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
| Regional 2026 | Pendiente de confirmar con el set | Sin enlace incorporado | — | No se publican cifras sin verificar |

El Regional 2026 queda aplazado por indicación del usuario. Se conserva únicamente una ficha de torneo pendiente, sin problemas, estadísticas ni enlace supuesto a Codeforces. No hay proceso automático que lo consulte ni que lo complete.

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

Los 51 archivos de `public/statements/` conservan páginas de los cuadernillos originales. Los regionales están en inglés y TAP 2026 en español. Los nombres de TAP en el catálogo coinciden con Codeforces y pueden diferir del título español impreso.

Cada problema guarda `statementPages` con páginas físicas inclusivas del PDF de origen, empezando en uno. El rango termina antes del inicio del siguiente problema. Las páginas en blanco intencionales de 2023 se conservan como parte del original; no son contenido perdido.

Se comprobaron cantidad de páginas, igualdad del texto extraído y dimensiones respecto del original. Además se renderizaron e inspeccionaron las 80 páginas de los 51 archivos, incluidos ejemplos, diagramas y fórmulas. No se reescribieron los enunciados ni se incorporaron soluciones en esos PDFs.

## Contenido y mantenimiento

- La banda de dificultad se asigna editorialmente; el porcentaje de AC es evidencia separada, nunca una conversión automática a rating de Codeforces.
- Una cobertura completa de apuntes se refiere a las herramientas del enfoque elegido. No significa que el apunte contenga la observación o demuestre la solución.
- Una cobertura parcial conserva herramientas útiles y enumera lo que falta. No se completa con módulos que no existen.
- `sourceUrl` identifica la fuente del enunciado. Los resultados y su población se vinculan desde el torneo.
- Los datos desconocidos se guardan como `null`, no como cero.
- La validación rechaza referencias rotas, duplicados, denominadores inválidos, AC imposibles y rangos de páginas inválidos. Las pruebas de datos también contrastan los totales de las distribuciones y la existencia de cada PDF local.
- Para revisar el contenido se ejecuta `npm exec vitest run tests/data.test.ts`. La importación de datos también ejecuta `validateDataset()` y detiene la construcción si encuentra inconsistencias.

Queda pendiente la revisión humana con integrantes del club y el contraste de los enfoques avanzados que están marcados con confianza baja o media. La incorporación del Regional 2026 requiere un nuevo chunk con sus propias fuentes, comprobaciones y commit.
