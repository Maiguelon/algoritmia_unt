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

Los apoyos no se agregan de forma recursiva. Una persona puede haberlos estudiado o impreso. Se ofrecen en Personalizado para sumarlos por decisión explícita.

### Selección y modos de exportación

`/seleccion/` reúne los problemas, la descarga de enunciados y la preparación del apunte. Las rutas anteriores `/enunciados/` y `/armar/` conducen a esa página; las acciones `?chunk=` de la biblioteca se conservan y abren Personalizado.

- Recomendado: descripción y funciones/operaciones de las herramientas sugeridas por los problemas.
- Completo: las mismas herramientas con las tres partes y las explicaciones de la plantilla. No incorpora toda la biblioteca.
- Solo funciones: la sección existente Funciones y operaciones de esas herramientas. Esta etapa no reestructura su contenido interno.
- Personalizado: selección por bloque y parte; conserva los cambios al probar otros modos durante la misma visita. La primera entrada copia el modo activo. Con problemas seleccionados, volver a entrar o cambiar el conjunto de problemas inicia Recomendado desde cero.

Las recomendaciones se calculan con la selección de problemas. Al entrar con problemas elegidos, las preferencias antiguas de `algoritmia:notes:v2` o del formato anterior no se restauran. Cambiar los problemas, incluso desde otra pestaña, vuelve a Recomendado. Si se usa el armador libre sin problemas, la configuración guardada se conserva y una anterior válida se migra a Personalizado. Las acciones explícitas `?chunk=` siguen abriendo Personalizado. El índice depende de la cantidad de bloques distintos, sin contar la plantilla.

La barra ofrece descargas rápidas y acceso a la selección. **Apunte recomendado** siempre genera Recomendado, sin leer ni modificar el borrador personalizado. Dentro de la selección, **Descargar apunte PDF** utiliza el modo visible: hay un botón en el resumen superior «Tu apunte lleva…» y, solo en Personalizado, otro al final de los controles. Ambos comparten contenido y estado de generación. Los datos de las descargas rápidas se cargan bajo demanda desde los archivos estáticos `/material/catalogo.json` y `/material/apuntes.json`.

La cobertura parcial y las técnicas faltantes se muestran junto a cada problema. Los problemas fuera de alcance pueden exportar sus enunciados, pero no aportan herramientas al apunte. El recuento de herramientas incluidas no afirma que se haya incorporado una solución ni toda su teoría.

## Cerrar un cambio

Ejecutar comprobaciones de datos/tipos y las pruebas pertinentes al cambio. Para cambios de exportación, descargar PDFs reales y revisar sus páginas; para navegación y controles, probar el navegador. La guía de comandos está en el README.

Revisar los archivos del diff y hacer un commit por unidad. Para incorporar un nuevo torneo, el commit debe identificar esa edición. Nunca incluir tokens, resultados de pruebas, caches o archivos personales de investigación en la publicación.

Quedan pendientes la evaluación con el usuario y un principiante del club, y el contraste de los enfoques que figuran con confianza baja. No modificar ese estado solo porque la construcción o los tests hayan pasado.
