# Recopilación de TAP: contrato y revisión

El 10 de noviembre de 2026 se dividió la recopilación de TAP 2024 y 2025 entre dos agentes con `gpt-6-luna`, esfuerzo bajo, por pedido explícito del usuario. Cada agente trabajó en una carpeta independiente y entregó datos y fuentes sin modificar el catálogo ni hacer commits. Root revisó e integró las entregas, asignó dificultad y herramientas y mantuvo las decisiones editoriales separadas de la extracción.

## Formato común v1

Cada edición entrega `datos.json`, `notas.md` y originales bajo `fuentes/`.

| Campo | Contenido |
|---|---|
| `schemaVersion`, `id`, `calendarYear`, `date`, `season` | Identidad de edición y fuente de temporada |
| `booklet` | URL, archivo local, idioma y páginas físicas |
| `gym` | ID, URL y enlaces que verifican su identidad |
| `population` | Denominador, fuente, estado e inclusiones/exclusiones |
| `problems` | Letra, títulos inglés/español, páginas, AC, total, primera resolución y fuentes |
| `teams` | Nombre, institución, puesto, AC, penalidad, letras y `acceptedMinutes` |
| `distribution` | Equipos por cantidad de problemas resueltos |
| `qualification` | Reglas y hechos con su fuente; incertidumbres explícitas |
| `sources` | ID, URL, etiqueta, tipo de fuente, archivo conservado y fecha de acceso |
| `unknowns` | Datos no confirmados y discrepancias |

Un dato desconocido es `null`, no cero. Las páginas son inclusivas y comienzan en uno. Los campos editoriales de dificultad y herramientas se incorporan durante la revisión de root, fuera de la tarea de los recolectores. Los títulos se normalizan al integrar: `title` corresponde al Gym y `originalTitle` al cuadernillo español.

## Comprobaciones de root

1. Identidad y fecha del cuadernillo; correspondencia de 14 letras con el Gym enlazado por AAPC.
2. Relectura independiente de las filas crudas, sin usar los contadores de práctica ni copiar el pie del Gym.
3. Recuento por letra, cantidad de AC de cada equipo y distribución; las tres representaciones deben coincidir.
4. Recalcular la penalidad desde cada celda: minutos aceptados más 20 por fallo previo. Esta igualdad se comprobó para todas las filas extraídas.
5. Conciliar poblaciones antes de sumar: en 2025 se excluye CCL Soarch 4 y se conserva el cero de Root según AAPC; en 2024 se excluye la fila extranjera adicional 156.
6. Primeras resoluciones por el menor minuto dentro de esa población, conservando empates al minuto. No se afirma una precisión de segundos que la réplica no publica.
7. Revisión propia de los enunciados para bandas y herramientas; marcar confianza y cobertura incompleta cuando el enfoque no está contrastado.
8. Verificar todas las páginas exportadas por texto, dimensiones, dibujo y comparación visual con los originales.

Las entregas y las capturas crudas completas permanecen en la carpeta de trabajo `work/tap-recoleccion-20261110` del chat. El repositorio conserva [TAP 2024](tap-2024.md), [TAP 2025](tap-2025.md) y sus dos archivos de evidencia para reproducir los conteos sin depender de la disponibilidad futura de las páginas.
