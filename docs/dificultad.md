# Dificultad y alcance de los apuntes

Bandas editoriales: Inicial, Consolidación, Salto regional, Avanzado y Top global. Esta última usa morado y marca los problemas fuera del recorrido que el club cubrirá por ahora. No se asigna por un umbral automático de AC ni representa un rating oficial mundial.

Conceptual e implementación mantienen valoraciones separadas de 1 a 5 dentro del recorrido cubierto. Un avanzado puede ser 5/5; no se comprimen las puntuaciones al agregar problemas extremos. Para Top global se deja la puntuación sin valorar, la cobertura como `fuera de alcance` y `chunkIds` vacío. Siguen disponibles el enunciado y sus estadísticas.

Una técnica pendiente de revisar no convierte por sí sola un problema en Top global. La confianza se conserva en `classificationConfidence`; las bandas son estimaciones y los AC mantienen su población y fuente.

Revisión de I del TAP 2026: se cambia de Consolidación a Inicial por requerir observación elemental y condicionales, sin estructuras ni algoritmo especializado. Se conserva conceptual 2/5 e implementación 1/5. Fuente: [enunciado oficial](https://codeforces.com/gym/106682/problem/I). No se incorpora la condición de solución a las pistas.
