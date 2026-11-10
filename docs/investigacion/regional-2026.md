# Regional South America/South 2026

Incorporación manual del 10 de noviembre de 2026. Año calendario 2026, temporada 2026–2027, concurso del 7 de noviembre. El set tiene 13 problemas y se usó simultáneamente en las seis regiones latinoamericanas. Se distingue de la final latinoamericana celebrada en marzo de 2026, cuyo Gym corresponde a otro set.

## Fuentes

- [Página de ICPC Latin America](https://www.icpclatam.org/regionals/lar2026/): temporada, alcance, documentos y reporte oficial.
- [Reporte final abierto de MOJ](https://scorelatam.naquadah.com.br/latam-2026/): 563 entradas, 528 equipos oficiales y 35 invitados. Para esta edición se usa la membresía regional oficial `RMEM[login]` que contiene el nodo 19, South America South, y se excluyen invitados sin puesto oficial. Resultado: **214 equipos**.
- [Envíos](https://scorelatam.naquadah.com.br/latam-2026/runs.html): se reconciliaron los AC del tablero con equipos únicos con verdict `Accepted`, por letra, y los minutos de primera resolución de South.
- [Cuadernillo](https://www.icpclatam.org/assets/docs/LAR2026%20-%20Problem%20set.pdf): 23 páginas físicas, dos preliminares y 21 páginas de enunciados. No se reescriben ni se agregan soluciones. Los PDFs individuales conservan texto, contenido gráfico y dimensiones de cada página; se comprobaron los flujos de contenido y se revisó el render del documento completo.
- [Promoción](https://www.icpclatam.org/assets/docs/2026-2027%20ICPC%20Latin%20America%20-%20Promotion%20Rules.pdf) y [clasificados](https://scorelatam.naquadah.com.br/latam-2026/classificados.html): 19 equipos de South marcados en el reporte al día de revisión; la lista es provisoria. Las reservas de otras regiones no se suman a esta cifra.

El tablero dinámico de MOJ no fue necesario para extraer los datos: el reporte estático enlazado por la organización contiene el ranking abierto y la jerarquía de filtros. La evidencia de South queda congelada en `regional-2026-evidencia.json`, con login, puesto, penalidad y segundos del primer AC de cada equipo y problema.

## AC y clasificación editorial inicial

| Letra | Problema | AC / 214 | Banda | Temas del enfoque |
|---|---|---:|---|---|
| A | Antonia's Ants | 3 | Avanzado | Interactivo, construcción, reconstrucción |
| B | Between Two Cameras | 36 | Salto regional | Orden geométrico, inversiones ponderadas, Fenwick |
| C | Clumsy Courier | 31 | Salto regional | DP de conteo, combinatoria modular |
| D | Divine Lights | 151 | Consolidación | Conteos, simulación e inversiones |
| E | Escape Plan | 16 | Avanzado | Árboles, construcción; greedy candidato |
| F | Father's Footsteps | 95 | Consolidación | Bloques, conteos y efecto de eliminar valores |
| G | Gratitude Loop | 167 | Inicial | Simulación de estados y contadores |
| H | Hazel's Harvest | 15 | Avanzado | Consultas de orden, procesamiento offline |
| I | Imprecise Location | 2 | Avanzado | Geometría, localización y árbol de contención |
| J | Just Four Pieces | 137 | Consolidación | Construcción, observación y enteros de 64 bits |
| K | Kayaking | 0 | Top global | Conteo en grilla y grafos funcionales; técnica exacta pendiente |
| L | Lookout Towers | 35 | Salto regional | DP en árboles y conteo de pares |
| M | Moving Mountains | 1 | Top global | Optimización de transformaciones de perfiles; técnica exacta pendiente |

Los temas y puntuaciones son análisis propios de los enunciados, no etiquetas oficiales. No se localizó una editorial oficial de este set en la revisión. A, E, H e I conservan puntuaciones explícitamente provisionales; para K y M se deja la escala 1–5 sin valorar y no se ofrecen bloques de apuntes. La categoría no resulta de un corte automático de AC: A e I continúan como avanzados, a pesar de sus pocos AC. La selección de técnicas de E y H, y las estrategias eficientes de los extremos, necesitan contraste con una solución de referencia.

La primera revisión de dificultad no amplía el contenido de los apuntes. La cobertura completa de D, F, G y J se refiere a operaciones del enfoque de implementación elegido. B, C y L requieren técnicas todavía ausentes de la biblioteca y tienen cobertura parcial.

## Resultados de Tucumán

| Equipo | Institución | Puesto South | Puesto Argentina | AC | Penalidad | Letras |
|---|---|---:|---:|---:|---:|---|
| Computops | UNT | 94 | 30 | 4 | 1148 | D F G J |
| Mono Pollo NP++ 18 | UNT | 105 | 31 | 3 | 332 | D G J |
| Pandas | UNSTA | 139 | 38 | 2 | 354 | D G |
| Noxus | UTN FRT | 173 | 46 | 0 | 0 | — |

Los puestos usan la regla de ranking de competición del filtro oficial: equipos con la misma clave `data-tie` comparten puesto. En particular, los equipos sin AC empatan; Noxus no se numera como si ese empate se rompiera por orden de aparición. Ninguno de estos cuatro equipos tiene una marca de promoción al Latinoamericano en la fuente revisada.

## Lectura de los cupos

El reglamento tiene 20 cupos por rendimiento latinoamericano y un máximo de dos equipos de la misma institución, además de otras vías. El corte de rendimiento del reporte fue ITA, 9 AC y 929 de penalidad. Para Argentina, Ctrl F Huevitos (UTN FRSF) es el último marcado: 7 AC, 578 de penalidad, puesto 17 de South, 9 de Argentina y 57 de Latinoamérica; el reporte lo marca por participación del país. Sus letras fueron B, C, D, F, G, J y L. Es una referencia argentina observada, no un corte directo de South ni una garantía de promoción para cualquier institución. Dos equipos de UBA con 9 AC quedaron sin marca de promoción.

La página mantiene separadas estas referencias: criterio de rendimiento latinoamericano, tarjeta del último argentino marcado y herramientas de su ruta. La valoración Salto regional del cierre se refiere a esa ruta argentina; no se presenta como nivel suficiente para los 20 cupos latinoamericanos.

## Autores y juez

El reporte acredita públicamente los autores por problema. Se conserva la fuente sin deducir handles de Codeforces: Marcelo Fornet (A), Joel Alejandro Rangel Amaro (B), Jorge Iván Bórquez Meza (C y L), Paulo Cezar Pereira Costa (D, F y G), Leonardo Valente Nascimento (E), Marcos Kolodny (H), Gabriel Pessoa (I), Luis Santiago Re (J y K) y Roberto Sales (M).

No se incorpora un Gym supuesto. `judgeUrl` permanece en `null` en las 13 fichas; el botón de lectura y el QR de los paquetes usan cada HTML oficial. Los PDFs individuales y el cuadernillo se descargan sin necesidad de Codeforces. La incorporación de un juez de práctica se realizará manualmente cuando exista un enlace verificable del mismo set.
