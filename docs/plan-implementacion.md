# Plan de implementación de Algoritmia UNT

Estado: aprobado el 9 de noviembre de 2026. Ejecución por chunks, pruebas y commit de cierre.

Cambio de alcance autorizado: el Regional 2026 queda aplazado hasta que sus problemas estén publicados y verificables. No se cargan enunciados ni enlaces de juez supuestos; las estadísticas, si se incorporan antes, se rotulan provisorias. La primera versión puede publicarse sin ese torneo completo.

## Resultado de la primera versión

Una web pública del club, en español, que permita explorar problemas de TAP y Regionales, entender sus requisitos y dificultad, consultar los apuntes y preparar dos descargas independientes: un apunte personalizado y un PDF de enunciados. También permitirá analizar cada torneo con sus datos y fuentes.

El primer recorrido completo se construye con tres problemas reales. Se elige uno de nivel Inicial, uno de Consolidación y otro que requiera herramientas fuera de la biblioteca actual. Las clasificaciones se verifican al preparar esos datos. La carga completa de torneos llega después de validar este recorrido.

Primera publicación propuesta: Cloudflare Pages. La aplicación se entrega como archivos estáticos para poder alojarla después en un servidor de la facultad o en Vercel. La publicación constituye el último chunk, una vez que estén disponibles la cuenta y el destino elegidos.

## Decisiones incorporadas

- El grupo se llama **Contenedores**. Se actualizan el nombre visible, su identificador de grupo y las familias de las fichas correspondientes. Los identificadores individuales de los chunks permanecen estables.
- La plantilla de C++ es un bloque independiente, se incluye una sola vez y va primero.
- El apunte tiene índice solamente si quedan **dos o más chunks de contenido** tras la selección y la eliminación de duplicados. La plantilla no cuenta. Seleccionar únicamente `set`, aunque incluya sus tres partes, no produce índice. Seleccionar varios problemas que finalmente usan un único chunk tampoco lo produce.
- En el PDF de enunciados, el índice depende de la cantidad de problemas: aparece a partir de dos.
- Descripción, funciones/operaciones y ejemplos siguen siendo seleccionables por bloque. La propuesta inicial activa solo funciones/operaciones; conserva siempre el código de la plantilla.
- El apoyo básico está disponible para cualquier dificultad. Sus conexiones son sugerencias, no inclusiones recursivas obligatorias.
- Los requisitos corresponden a un enfoque elegido editorialmente y explicado en la ficha. No se pretende reunir todos los enfoques conocidos de cada problema.
- Una ficha diferencia cobertura completa, parcial o pendiente de los apuntes. Un problema avanzado puede estar en el catálogo aunque todavía falten sus módulos.
- Se mantienen las dos bandas **Inicial** y **Consolidación**. Las bandas superiores y sus explicaciones se revisan con el inventario; el modelo permite ampliarlas sin rehacer las páginas.
- Los datos oficiales y las valoraciones editoriales se presentan por separado. AC significa equipos que resolvieron el problema dentro de una población explícita, no cantidad bruta de envíos aceptados.
- Las actualizaciones de contenido se hacen editando archivos del repo. El sitio no clasifica nuevos torneos automáticamente ni consulta un modelo al generar un apunte.

## Base técnica propuesta

- **Astro + TypeScript**, con páginas estáticas para problemas, torneos y apuntes.
- **React** para las partes interactivas: filtros, selección y configuración del apunte.
- **Markdown y JSON** como contenido editable, con validación al construir el sitio.
- Estilos propios y componentes compartidos, usando el logo del club y los recursos de UNT/FACET que se confirmen. Diseño para computadora y celular, con navegación por teclado.
- **pdfmake** para componer el apunte, sus tablas, código y paginación. **pdf-lib** para reunir los enunciados originales con las páginas de identificación y enlaces. Se prueban sobre documentos reales en sus chunks antes de dar esos motores por cerrados.
- PDFs y fuentes necesarios servidos desde el propio proyecto. Las bibliotecas pesadas de exportación se cargan al usarlas.
- **Vitest** para las reglas de datos, selección y composición; **Playwright** para los recorridos del navegador. Las pruebas cubren comportamiento relevante y casos límite, no cada detalle de presentación.
- Sin servidor propio, base de datos ni cuentas en esta versión. La selección y sus preferencias se pueden conservar en el navegador.

Referencias de las capacidades elegidas: [React en Astro](https://docs.astro.build/en/guides/integrations-guide/react/), [salida y publicación de Astro](https://docs.astro.build/en/guides/deploy/), [pdfmake en navegador](https://pdfmake.github.io/docs/0.3/getting-started/client-side/) y [composición de PDFs con pdf-lib](https://pdf-lib.js.org/).

## Protocolo de ejecución

Cada fila es una unidad cerrable. Para cada una:

1. Partir del último commit y comprobar los cambios pendientes.
2. Implementar solo el alcance de esa unidad.
3. Ejecutar sus comprobaciones y revisar el resultado visible cuando corresponda.
4. Corregir los fallos y revisar el diff.
5. Hacer un commit con los archivos de esa unidad.
6. Informar qué quedó funcionando, qué se comprobó y el identificador del commit.

Las comprobaciones de contenido, tipos y construcción acompañan a los cambios que las afecten. Las pruebas completas del navegador se ejecutan en los hitos de integración. Una unidad con fallos relevantes sigue abierta. Si cambia el alcance, se actualiza este plan antes de mezclar trabajo de otra unidad.

Una vez aprobado el plan, la ejecución continúa de un chunk al siguiente; el commit de cierre no implica pedir una nueva confirmación en cada etapa.

## Chunks de implementación

### 0. Fijar la base de contenido

**Entrega:** incorporar al historial los 30 chunks existentes y este plan, renombrar Contenedores y corregir la regla del índice en el catálogo y la documentación. Dejar un procedimiento reproducible de validación de contenido dentro del repo.

**Comprobación:** 30 IDs únicos; enlaces y referencias válidos; secciones bien formadas; ejemplos C++17; casos de índice con cero, uno y dos chunks, sin contar plantilla. Confirmar qué archivos entran al commit.

**Commit:** `docs: establece la biblioteca base y sus reglas de exportacion`.

### 1. Definir los datos y preparar el piloto

**Entrega:** contratos para torneos, problemas, fuentes, estadísticas, dificultades, pistas y conexiones con apuntes. Importar tres problemas reales desde los materiales existentes, contrastándolos con sus fuentes. Documentar el estado de verificación de cada campo.

**Comprobación:** los datos válidos se aceptan; fallan IDs repetidos, referencias inexistentes, AC mayores al total, totales cero usados como denominador y páginas de enunciado inválidas. Un dato ausente se conserva como desconocido, no como cero. El tercer problema muestra cobertura parcial o pendiente sin fingir un apunte completo.

**Commit:** `feat: define el modelo de contenido y los problemas piloto`.

### 2. Construir la base de la web

**Entrega:** proyecto Astro, TypeScript, navegación entre Problemas, Torneos y Apuntes, estructura visual del club, estados vacíos y página de enlace inexistente. Configurar las comprobaciones y la construcción reproducible con dependencias fijadas.

**Comprobación:** instalación y construcción desde el repo, rutas directas, navegación con teclado, pantalla angosta y ausencia de errores de consola en el recorrido básico.

**Commit:** `feat: crea la base web y la navegacion del club`.

### 3. Publicar la biblioteca de apuntes dentro de la web

**Entrega:** índice de los 30 bloques por grupos, buscador y lectura de cada ficha con sus tres partes. Código legible, tablas adaptables y enlaces entre herramientas relacionadas.

**Comprobación:** se muestran todos los bloques sin perder contenido; búsqueda y navegación funcionan; código y tablas se pueden consultar en celular; no se repite la plantilla dentro de cada tema.

**Commit:** `feat: incorpora la biblioteca navegable de cpp`.

### 4. Construir la lista de problemas

**Entrega:** búsqueda y filtros combinables por torneo/año, dificultad y temas; orden por AC o porcentaje con su denominador visible; selección de varios problemas. Los filtros se reflejan en la URL para compartirlos y recuperarlos.

**Comprobación:** combinar y limpiar filtros, cero resultados, empates de orden, AC desconocidos, volver desde una ficha y abrir un enlace con filtros. La selección conserva los problemas que quedan ocultos por un filtro.

**Commit:** `feat: agrega el catalogo filtrable de problemas`.

### 5. Construir las fichas de problemas

**Entrega:** resumen sin solución, temas, requisitos, dificultad justificada, AC/total y contexto, acceso al juez, fuente del enunciado y enlace al torneo. Pistas opcionales cerradas inicialmente. Identificación del enfoque que respalda la selección de herramientas y de su cobertura disponible.

**Comprobación:** no se muestran pistas al entrar ni al exportar por defecto; datos desconocidos y estimaciones se distinguen; todos los enlaces del piloto corresponden al set y problema correctos. Revisar manualmente claridad y nivel de spoiler.

**Commit:** `feat: agrega fichas de problemas con fuentes y pistas opcionales`.

### 6. Construir el armador de apuntes

**Entrega:** convertir la selección de problemas en una lista editable de bloques; eliminar duplicados; permitir quitar bloques y elegir descripción, funciones y ejemplos. También se puede armar un apunte directamente desde la biblioteca. Mostrar apoyos sugeridos, vista previa y cobertura faltante. Guardar selección y preferencias localmente.

**Comprobación:** dos problemas que usan set lo incluyen una sola vez; plantilla única; desmarcar un bloque se respeta; apoyos desmarcados no reaparecen; uno frente a varios contenidos activa correctamente el índice; una selección vacía tiene una acción clara. Restaurar preferencias admite IDs que dejaron de existir.

**Commit:** `feat: permite componer apuntes por bloques y secciones`.

### 7. Generar el PDF del apunte

**Entrega:** descarga de un PDF A4 con la selección exacta, plantilla inicial, índice condicional, numeración y enlaces. Texto y código seleccionables, fuentes incluidas y presentación apropiada para blanco y negro y doble faz. La vista previa y el PDF usan el mismo contenido seleccionado.

**Comprobación:** generar un apunte de un bloque y otro de varios, las tres combinaciones de partes, tablas anchas, ejemplos largos y la selección de los 30 bloques. Renderizar los PDFs y revisar todas sus páginas: cortes, márgenes, acentos, código y números del índice. Abrir una descarga sin conexión.

**Commit:** `feat: exporta apuntes personalizados a pdf`.

### 8. Generar el PDF de enunciados

**Entrega:** paquete de uno o varios problemas con sus enunciados originales preparados desde fuentes verificadas, nombre, torneo, URL y QR del juez. Los PDF por problema y su procedencia se preparan editorialmente; la web los reúne. La falta de un enunciado descargable se informa antes de generar el paquete.

**Comprobación:** contenido y orden iguales a la selección; ningún problema repetido; ejemplos, fórmulas y diagramas íntegros; QR legible y URL correcta; índice solo para varios problemas. Renderizar cada página del paquete y abrirlo sin conexión. No depender de capturar Codeforces durante la descarga.

**Commit:** `feat: exporta paquetes de enunciados con enlaces y qr`.

### 9. Construir el análisis de torneos

**Entrega:** página por torneo con información de año calendario, temporada y set utilizado, población del ranking, AC por problema, distribución de equipos por cantidad de problemas resueltos, curva de dificultad y fuentes. Añadir resultados UNT y explicación de clasificación cuando estén verificados para ese torneo.

**Comprobación:** contrastar los cálculos con los datos fuente de un torneo completo; la suma de la distribución coincide con la población elegida; separar rankings o sedes diferentes. Los puestos y cortes respetan penalización y reglas de elegibilidad. Los datos no disponibles permanecen explícitos. Revisar las conclusiones editoriales, especialmente las de clasificación.

**Commit:** `feat: incorpora el analisis de torneos y resultados unt`.

### 10. Completar el contenido, un torneo por chunk

Cada una de estas filas termina con su propia comprobación y commit. El orden prioriza los torneos más relacionados con nuestra experiencia y reutiliza la investigación local de 2023–2025.

| Unidad | Torneo | Commit |
|---|---|---|
| 10a | Regional 2025 | `content: incorpora el regional 2025 verificado` |
| 10b | TAP 2026 | `content: incorpora el tap 2026 verificado` |
| 10c | Regional 2026 | `content: incorpora el regional 2026 verificado` |
| 10d | Regional 2023 | `content: incorpora el regional 2023 verificado` |
| 10e | Regional 2024 | `content: incorpora el regional 2024 verificado` |

**Entrega de cada unidad:** todos los problemas del set, estadísticas con fuente y población, clasificación editorial, requisitos, enlaces y disponibilidad de enunciados. Reutilizar la información local como punto de partida, sin asumir que cada archivo ya está listo para publicarse. Confirmar la identidad y temporada del torneo antes de importar sus estadísticas.

**Comprobación de cada unidad:** inventario completo contra el cuadernillo; letras y enlaces correctos; AC/total reproducibles; ausencia de duplicados del mismo problema en distintos jueces; revisión del resumen y de los requisitos. Todo enfoque marcado como verificado debe contrastarse con una solución confiable o una implementación revisada. Lo que falte queda identificado, sin datos inventados.

No se retrasa toda la web por un dato accesorio ausente. Sí se evita afirmar una clasificación, corte o cobertura de apuntes que todavía no esté respaldada.

### 11. Validar la versión completa y documentar su mantenimiento

**Entrega:** recorrido integrado con el inventario inicial, correcciones encontradas, guía para agregar un torneo/problema/bloque y comprobaciones automáticas antes de publicar cambios. Documento breve de las decisiones editoriales y del estado de datos pendientes.

**Comprobación:** buscar, filtrar, abrir una ficha, seleccionar varios problemas, cambiar bloques y partes, exportar los dos PDFs y consultar el torneo. Probar celular, teclado, enlaces directos y preferencias previas. Revisar el peso de carga y de exportación; correr comprobaciones de datos, tipos, construcción y recorridos principales.

La revisión con vos y con alguien que recién empieza sirve para comprobar comprensión. No se declara realizada hasta que esas personas hayan probado la versión.

**Commit:** `test: valida los recorridos completos y documenta el mantenimiento`.

### 12. Publicar la primera versión

**Entrega:** configuración del destino acordado, primera versión accesible y guía para repetir la publicación o servir el resultado estático desde otro servidor. Publicación vinculada a un commit concreto.

**Comprobación:** comprobar la URL publicada, rutas abiertas directamente, recarga, archivos de enunciados, QR y descarga de ambos PDFs en ese entorno. Diferenciar publicación comprobada de una configuración de despliegue preparada pero todavía sin cuenta o dominio disponibles.

**Commit:** `chore: configura la primera publicacion del sitio`.

## Hitos para revisar el avance

- Después del chunk 5: web navegable con biblioteca y tres fichas reales.
- Después del chunk 8: recorrido completo de selección y ambas descargas.
- Después del chunk 10e: inventario inicial y análisis de los cinco torneos, con pendientes explícitos.
- Después del chunk 12: versión publicada y mantenible.

## Ampliaciones posteriores

Cuentas y moderación, propuestas de usuarios, recomendaciones personales, más lenguajes, módulos avanzados y TAP 2023–2025 quedan para etapas posteriores. La primera versión ya permite agregar sus problemas manualmente por el mismo procedimiento; ampliar el catálogo no exige reconstruir la aplicación.
