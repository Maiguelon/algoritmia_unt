# Enunciados en español

Inventario de Inicial y Consolidación, 16 de noviembre de 2026. Se verificaron las secciones Entrada/Salida o Input/Output en los PDF que usa el catálogo. La disponibilidad se refiere a los cuadernillos revisados.

| Edición | Español oficial en el catálogo | Traducción del club |
| --- | --- | --- |
| TAP 2024 | D, F, G, N | |
| TAP 2025 | A, G, I, N | |
| TAP 2026 | A, B, I, K | |
| Regional 2023 | | D |
| Regional 2024 | | A, F |
| Regional 2025 | | H, J |
| Regional 2026 | | D, G, J |

## Cómo sumar una traducción

1. Usá como fuente el PDF original del catálogo. Si ya hay una versión oficial en español, usá esa edición y conservá el enlace a su fuente.
2. Creá `content/statement-translations/<id>.json` con el título del catálogo, los párrafos de `body`, `input` y `output`, y los pares `samples`. En `literals` anotá las restricciones, fórmulas y tokens que deben permanecer exactos. Si hay explicaciones de ejemplos, conservá su número en `sampleNotes`. Para un recorte del PDF original, seguí el ejemplo de Just Four Pieces. Las coordenadas `figure.crop` están en píxeles a 144 dpi y `afterParagraph` cuenta desde 1.
3. Ejecutá `node scripts/verify-statement-translations.mjs` con Poppler instalado. El extractor cubre los ejemplos numerados en dos columnas, incluidos los de varias líneas. También compara la numeración de las explicaciones y verifica los recortes. Para otra maquetación, adaptá la extracción contra el PDF original.
4. Leé la traducción junto al original. Prestá atención a cuantificadores, casos de igualdad, orden de operaciones, formato de salida y relaciones en los diagramas. La comprobación automática de literales no sustituye esa revisión.
5. Construí con `npm run build`, ejecutá `node scripts/verify-statement-translations.mjs --pdf` y mirá el PDF renderizado. En Mi selección, probá descargar un enunciado en español y un paquete con un enunciado que siga en inglés. Revisá las etiquetas de idioma y la numeración del índice.
