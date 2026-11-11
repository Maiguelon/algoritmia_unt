# Revisión de los problemas Iniciales

Revisión del 11 de noviembre de 2026. Alcance: los **12 problemas que estaban marcados Inicial al comenzar**. Se leyeron sus enunciados completos, los bloques recomendados y los límites de entrada. Se conservan **8 Iniciales** y se mueven **4 a Consolidación baja**. No se revisaron en esta pasada posibles descensos de otras bandas hacia Inicial.

La [evidencia estructurada](revision-iniciales-2026-11-11-evidencia.json) registra cada ficha antes y después, fuentes, motivo y comprobaciones acotadas. No se modificaron AC, poblaciones, primeras resoluciones, PDFs originales ni enlaces al juez.

## Criterio utilizado

- **Inicial:** cuentas, condiciones y recorridos directos; puede incluir una observación pequeña o una enumeración con muy pocos estados. No significa que todo tenga la misma dificultad que A la mitad.
- **Consolidación baja:** exige justificar una reconstrucción u optimización, manejar búsquedas repetidas de subcadenas, o coordinar estados indexados. Sigue dentro de las herramientas básicas, con una carga mayor de razonamiento o implementación.
- Las dos puntuaciones 1–5 separan concepto e implementación. No determinan por sí solas una banda; tampoco lo hacen los AC ni el hecho de ser TAP o Regional.
- La cobertura completa se refiere a las operaciones de un enfoque de referencia. No promete que el apunte enseñe la observación o contenga una solución.

## Resultado por problema

| Problema | Banda final | Concepto / implementación | Herramientas del enfoque revisado |
|---|---|---|---|
| Regional 2024 A — Append and Panic! | Consolidación | 2/5 · 1/5 | Strings, set y longitudes; reconocer lo que conserva la transformación |
| Regional 2025 H — Harder Horizons | Consolidación | 2/5 · 1/5 | Recorrido, máximo acumulado y contador; justificar la elección greedy |
| Regional 2025 J — Judgmental Crowd | Consolidación | 1/5 · 2/5 | Strings, búsquedas repetidas de subcadenas y acumulación de pesos |
| Regional 2026 G — Gratitude Loop | Consolidación | 1/5 · 2/5 | Dos vectores por persona, lectura de índices, simulación y contadores |
| TAP 2024 D — Duo | Inicial | 1/5 · 1/5 | Enteros, sumas y comparaciones, incluida la igualdad |
| TAP 2024 F — Fixture | Inicial | 1/5 · 2/5 | Recorrido, contador de racha actual y acumulador |
| TAP 2024 G — Garlands | Inicial | 2/5 · 1/5 | Conteo de caracteres con Strings y comparación de cantidades con min |
| TAP 2025 A — Artifact to print | Inicial | 2/5 · 1/5 | String, recorrido o búsquedas sucesivas de caracteres, condiciones |
| TAP 2025 G — Going to the kiosk | Inicial | 1/5 · 1/5 | Resta, resto entero y condición |
| TAP 2026 A — At the midpoint | Inicial | 1/5 · 1/5 | Lectura de enteros, conversión de unidades y condiciones |
| TAP 2026 I — Is There a Winner? | Inicial | 2/5 · 1/5 | Observación por casos, paridad y condiciones |
| TAP 2026 K — Kilograms Exceeded | Inicial | 2/5 · 1/5 | Leer enteros, enumeración de nueve estados, condiciones y resto |

### Casos fronterizos

A de Regional 2024 y H de Regional 2025 podrían enseñarse como Iniciales al final de un curso que ya practicó conjuntos o máximos acumulados. Se usa Consolidación baja porque aquí Inicial también sirve como recorrido para personas que están enviando sus primeros programas; la reconstrucción de A y la optimalidad de H no son mera traducción de una cuenta indicada.

I y K del TAP 2026 quedan en el extremo superior de Inicial. I requiere interpretar el cuantificador «siempre» y separar pocos casos. K admite probar una cantidad fija y pequeña de estados por elemento: el enfoque de referencia no presupone conocer inversos modulares. Esta elección se apoya en el enfoque completo, no en que una fórmula pueda escribirse muy corta.

## Correcciones de herramientas

- **TAP 2025 A:** pide conservar el orden, no la contigüidad. Se quitó Apariciones de un patrón y se vinculó Strings, Recorridos y Condiciones. Una búsqueda de `TAP` como fragmento continuo no representa el problema. La longitud diez permite enfoques sencillos; no hace falta DP/LCS.
- **TAP 2026 K:** la entrada son N enteros separados por espacios, no un número ni una cadena. Se quitaron Strings y Caracteres y conversiones. Recorridos, Condiciones y Cuentas enteras cubren la enumeración acotada elegida.
- **Regional 2025 J:** se quitó Buscar y contar en secuencias, que puede inducir a confundir `count` de caracteres con conteo de subcadenas. El bloque Apariciones de un patrón sí cubre la búsqueda repetida necesaria.
- **Regional 2025 H:** se quitó Vectores del enfoque recomendado: puede procesarse la entrada manteniendo un máximo. Almacenarla sigue siendo válido, pero no es necesario para este enfoque. El resumen ahora dice «sin cambiar su orden», para evitar que «lista ordenada» se interprete como una entrada ya ordenada por dificultad.
- **TAP 2024 G:** Strings ya incluye `count` de caracteres. Se quitó el bloque adicional Buscar y contar, evitando repetir esa operación. No se necesita un map ni factorización.
- **TAP 2024 F:** el bloque Rachas explicaba principalmente separación en grupos. Se añadió el contador de racha actual que se actualiza mientras se lee, con tabla y ejemplo genérico; también se hizo explícito Condiciones en la ficha. El ejemplo no implementa la puntuación del problema.

Las recomendaciones automáticas conservan la regla existente del nivel mínimo: los ocho Iniciales reciben la base y plantilla; los cuatro movidos usan el perfil de Consolidación cuando no hay un Inicial seleccionado. No se amplió la lista de dependencias de forma recursiva.

## Contrastes realizados

Se contrastaron modelos sencillos con oráculos independientes en casos acotados. Son comprobaciones locales del razonamiento, no envíos Accepted al juez ni una prueba de todas las implementaciones posibles.

| Problema | Contraste |
|---|---|
| Regional 2024 A | 3279 textos originales sobre tres letras, longitud 1–7; generar una entrada válida y recuperar la longitud |
| Regional 2025 H | 9840 arreglos de longitud 1–8 con tres dificultades; comparar el enfoque con todas sus particiones consecutivas |
| Regional 2025 J | 19607 cadenas pequeñas y los cinco ejemplos originales; ventanas literales frente a búsquedas repetidas |
| Regional 2026 G | 6678 secuencias de pulsaciones con 2–4 personas; historial completo de mensajes frente a dos vectores de estado |
| TAP 2024 D | 15625 ternas de puntajes; comprobar también las igualdades |
| TAP 2024 F | 8190 secuencias binarias; ventanas de tres victorias frente a contador de racha actual |
| TAP 2024 G | 1296 combinaciones de cantidades de letras; asignaciones posibles de palabras frente a conteos y mínimo |
| TAP 2025 A | 67536 cadenas válidas de longitud diez, incluyendo caracteres ajenos; ternas de posiciones frente a cursor o búsquedas sucesivas |
| TAP 2025 G | 9900 combinaciones de vuelto y precio; cantidades posibles de caramelos frente a resto entero |
| TAP 2026 A | Las 18000 entradas permitidas; comparar la terna de tiempo frente a conversión a segundos |
| TAP 2026 I | 60 pares de parámetros y 27113 repartos de puntos; comprobar empates en el máximo. Además se revisaron los argumentos generales por casos |
| TAP 2026 K | Los nueve estados posibles de una ruedita, simulando cada giro; comprobar que cada observación tiene un único origen |

## Fuentes primarias

- [Regional 2024: enunciados](https://scorelatam.naquadah.com.br/latam-2024/contest.pdf#page=3) y [editorial oficial, A en la primera página](https://scorelatam.naquadah.com.br/latam-2024/icpcla24_solution_sketches.pdf). La prosa tiene una errata de variable en una expresión de longitudes; se contrastó con el enunciado y el código de la propia editorial, sin trasladar esa errata al catálogo.
- [Regional 2025: cuadernillo oficial](https://scorelatam.naquadah.com.br/latam-2025/contest.pdf): páginas físicas 13 (H) y 16 (J).
- [Regional 2026: G oficial](https://scorelatam.naquadah.com.br/latam-2026/statements/G.html) y [cuadernillo](https://www.icpclatam.org/assets/docs/LAR2026%20-%20Problem%20set.pdf): páginas físicas 12–13. El HTML respondió 200 y corresponde a Gratitude Loop. El lector web de esta sesión no lo procesó; se leyó también el PDF original local conservado en el proyecto.
- [TAP 2024: cuadernillo](https://codeforces.com/gym/105321/attachments/download/26905/tap_2024.pdf): páginas físicas 8, 10 y 11.
- [TAP 2025: cuadernillo oficial](https://icpc.com.ar/wp-content/uploads/2025/08/tap2025.pdf): páginas físicas 2 y 11.
- [TAP 2026: cuadernillo](https://codeforces.com/gym/106682/attachments/download/39252/TAP-2026.pdf): páginas físicas 3, 14 y 16.

No se localizaron nuevas editoriales para los otros once problemas. La confianza sobre las operaciones se apoya en la lectura directa y los contrastes descritos; no se atribuye esta clasificación a los organizadores.

## Integración

Pasaron 53 pruebas unitarias, 28 recorridos de navegador y la comprobación de tipos. Se verificó que el filtro Inicial presenta ocho problemas, que la selección de un problema movido se conserva al filtrarlo y que el apunte responde a las herramientas corregidas. El validador compiló los 123 fragmentos C++17 de la biblioteca. El PDF de revisión del bloque Rachas tiene dos páginas, inspeccionadas visualmente, sin desbordes ni caracteres sustituidos.
