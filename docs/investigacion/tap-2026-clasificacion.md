# TAP 2026: corte directo y rutas de preparación

Revisión del 10 de noviembre de 2026. El análisis publicado es manual y se limita a esta edición; no se trasladan sus umbrales a otros torneos.

## Resultados y reglamento

- [Reglamento, última página](https://aapc.org.ar/wp-content/uploads/2026/08/reglamento-tap-2026.pdf): 55 cupos argentinos previstos. La primera prioridad alcanza las posiciones 1–20, excepto equipos con cuatro o más de su institución por delante. Las prioridades siguientes son por institución y cupos femeninos; la organización puede ampliar o reasignar plazas.
- [Resultados nacionales](https://aapc.org.ar/resultados-tap-2026/): Testing, Universidad Nacional de Jujuy, puesto 20, 5 AC y 242 de penalidad. Fue el primero de los 14 equipos con 5 AC. Los 19 equipos con al menos 6 AC ocuparon los puestos 1–19.
- [Tablero interactivo oficial](https://storage.googleapis.com/tap-resultados-2026/index.html): se verificaron las letras desde `window.TAP.scoreboard.teams[].problems`, contando solamente `state === 'solved'`.

| Puesto | Equipo | AC | Penalidad | Letras |
|---:|---|---:|---:|---|
| 11 | Vaquita Envidiosa | 6 | 433 | A B C I K L |
| 12 | ChichuMerge | 6 | 519 | A B C I K L |
| 13 | La Venganza De Los Mendis | 6 | 599 | A B C I K L |
| 14 | Granola Gagá | 6 | 615 | A B C I K L |
| 15 | tres quintos | 6 | 655 | A B C I K L |
| 16 | El pabellón | 6 | 688 | A B C I K L |
| 17 | -WAall | 6 | 712 | A B C I K L |
| 18 | `cout<<"TLVD"<<endl;` | 6 | 735 | A B C I K L |
| 19 | Sé-- | 6 | 916 | A B C I K N |
| 20 | Testing | 5 | 242 | A B C I K |

Así, 8 de los 9 equipos con exactamente 6 AC hicieron A, B, C, I, K y L. El restante cambió L por N. Todos los primeros 20 hicieron A, B, C, I y K. Esto describe resultados, no una garantía de clasificación: por ejemplo, tres quintos era el quinto equipo de UBA y quedaba fuera de la primera prioridad por el límite institucional.

La presentación del sitio se compactó en una revisión posterior: vías directa e indirecta debajo del título, corte con contexto breve y dos grupos de preparación. Las combinaciones anteriores se conservan como respaldo en esta nota y en el JSON, sin un bloque adicional en la página. Cada grupo puede contener varias filas de problemas y temas; otras ediciones pueden usar más grupos. Para TAP 2026 se cierra con Salto regional como nivel editorial de la ruta directa.

Los 242 son el corte observado de esta edición. Una igualdad de AC y penalidad se desempata por el momento del último AC según el reglamento; no se formula una garantía universal con `penalidad <= 242`.

## Técnicas: revisión editorial

- **A, B, I y K:** base de implementación, strings, pertenencia a conjuntos y aritmética. Se mantiene la distinción editorial vigente entre Inicial y Consolidación; esta entrega no redefine las bandas.
- **[C — Confrontation of Numbers](https://codeforces.com/gym/106682/problem/C):** juego de decisiones óptimas; DP/minimax es una orientación de preparación. El estado y la recurrencia son parte del trabajo conceptual. No se afirma que una plantilla de DP resuelva el problema automáticamente.
- **[L — Luana's Album](https://codeforces.com/gym/106682/problem/L):** se revisó un enfoque greedy sobre secuencias con listas de posiciones y búsqueda binaria, contemplando ambas orientaciones. El enfoque se contrastó con enumeración completa de subsecuencias y particiones para las 21.844 secuencias de largo 1–7 sobre valores 1–4, sin discrepancias. Esa comprobación finita acompaña el argumento conceptual; no constituye una editorial oficial ni una aceptación en el juez.
- **N:** aparece como ruta alternativa observada. Su análisis técnico continúa pendiente; no se promueve su ficha a solución revisada.

No se localizó una editorial oficial de C o L en los materiales del Gym ni en el [anuncio del concurso](https://codeforces.com/blog/entry/156374). Las técnicas presentadas son análisis propios de los enunciados. El sitio conserva por separado los hechos del tablero y esta interpretación editorial, sin recurrencias ni código de solución en la página del torneo.

## Comprobaciones de esta entrega

Se reconciliaron el corte y las combinaciones del JSON editorial contra el tablero descargado. La validación exige que las letras existan, que cada combinación tenga la cantidad de AC declarada y que la suma de equipos de las combinaciones coincida con la distribución. También exige fuentes del torneo para el análisis y su reglamento.
