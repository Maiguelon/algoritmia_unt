# Mantener el catálogo

## Agregar un torneo

1. Crear `content/tournaments/<id>.json` siguiendo `Tournament` en `src/lib/types.ts`.
2. Registrar año calendario, temporada, identidad exacta del set y enlaces a cuadernillo, resultados y reglamento cuando corresponda.
3. Definir la población: región, sede, equipos oficiales o Extra y estado definitivo/provisorio. No mezclar grupos para construir un porcentaje.
4. Contar cada equipo con AC una sola vez por problema. La distribución cuenta cuántos equipos terminaron con cada cantidad de problemas. Su suma debe coincidir con el total de la población.
5. Incorporar resultados UNT y conclusiones de clasificación únicamente si tienen respaldo en las fuentes y reglas de esa edición. Los cupos por institución no se deducen del último puesto con cierta cantidad de AC.

Un torneo puede quedar `pendiente` con total `null`, distribución vacía y sin problemas. Es el caso del Regional 2026. El sitio no lo completa automáticamente.

## Agregar un problema

1. Crear `content/problems/<torneo>-<letra>.json`, con ID estable y referencia al torneo.
2. Verificar letra, título, enlace del juez y set. `sourceUrl` apunta a la fuente del enunciado; `judgeUrl` queda `null` si todavía no existe un enlace confirmado.
3. Escribir un resumen de lo que pide el enunciado, sin desarrollar la solución. Elegir temas, dificultad y requisitos como contenido editorial. Explicar el motivo y la confianza de la clasificación.
4. Cargar AC y denominador de la misma población del torneo. Un dato desconocido es `null`; cero significa que se verificó que nadie lo resolvió.
5. Elegir un enfoque de referencia y vincular sus herramientas mediante `chunkIds`. No agregar todos los enfoques conocidos. Registrar herramientas faltantes en `missingTools` y cobertura `parcial` o `pendiente` cuando corresponda. `completa` describe la cobertura de herramientas del enfoque, no una solución del problema.
6. Mantener pistas, advertencias sobre casos borde y editorial fuera del resumen visible. Revisar que una trampa común no esté redactada como una instrucción para cometerla.
7. Preparar el PDF original por problema en `public/statements/` y registrar `statementPages`: páginas físicas inclusivas de origen, empezando en uno. Verificar texto, muestras, diagramas y cortes contra el original. Si no está disponible, `statementUrl` queda `null` y la interfaz explica esa ausencia.

La fuente del enunciado y la de resultados pueden ser distintas. En las fichas, “datos verificados” se refiere a identidad y cifras oficiales; la banda y el enfoque siguen siendo decisiones editoriales. No presentar una inferencia del enunciado como técnica oficial demostrada.

## Cambiar o agregar apuntes

Cada Markdown vive en `content/apuntes/cpp/` y tiene ID, título, familia y estándar. Conserva exactamente tres secciones de nivel dos: Descripción, Funciones y operaciones, Ejemplos. Las subsecciones internas usan nivel tres.

El catálogo `catalogo.json` define orden, grupo y apoyos sugeridos. Un nuevo bloque debe aparecer en el catálogo y en el índice de la biblioteca. Mantener su ID al mejorar el texto evita perder configuraciones guardadas.

La plantilla es un bloque independiente. Su código se incluye una vez al inicio. El índice del apunte solo aparece cuando quedan dos o más bloques distintos de contenido con alguna parte seleccionada, sin contar la plantilla. Descripción/operaciones/ejemplos de un mismo bloque no cuentan como contenidos distintos.

Los apoyos no se agregan de forma recursiva. Una persona puede haberlos estudiado o impreso. Las preferencias guardadas y los desmarcados tienen prioridad; el usuario puede añadir otra vez las sugerencias mediante una acción explícita.

## Cerrar un cambio

Ejecutar comprobaciones de datos/tipos y las pruebas pertinentes al cambio. Para cambios de exportación, descargar PDFs reales y revisar sus páginas; para navegación y controles, probar el navegador. La guía de comandos está en el README.

Revisar los archivos del diff y hacer un commit por unidad. Para incorporar un nuevo torneo, el commit debe identificar esa edición. Nunca incluir tokens, resultados de pruebas, caches o archivos personales de investigación en la publicación.

Quedan pendientes la evaluación con el usuario y un principiante del club, y el contraste de los enfoques que figuran con confianza baja. No modificar ese estado solo porque la construcción o los tests hayan pasado.
