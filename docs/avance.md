# Entregas y verificación

Plan aprobado y ejecutado el 9 de noviembre de 2026. Cada entrega de implementación se comprobó y cerró con un commit. El contenido del Regional 2026 continúa aplazado por indicación del usuario.

| Chunk | Commit | Resultado |
|---|---|---|
| 0 | `747a2de` | 30 bloques; Contenedores; índice condicional; 122 fragmentos C++17 compilados |
| 1 | `07d9e7d` | Modelo, tres pilotos y validación de datos |
| 2 | `3036c2c` | Base Astro/React, identidad y navegación |
| 3 | `bc67f0b` | Biblioteca y fichas de los 30 apuntes |
| 4 | `4806854` | Catálogo, filtros por URL y selección persistida |
| 5 | `e119e83` | Fichas de problemas y pistas opcionales |
| 6 | `20060cd` | Armador por bloques y partes, apoyos opcionales, vista previa |
| 7 | `8421124` | PDF de apuntes y QA de paginación/código/tablas |
| 8 | `fa1fad9` | PDF de enunciados originales con QR y enlaces |
| 9 | `0c30b60` | Distribución y curva del torneo; resultados UNT y fuentes |
| 10a | `7f8c9f6` | Regional 2025 completo |
| 10b | `afac3f3` | TAP 2026 completo |
| 10c | `7b46e84` | Solo ficha pendiente del Regional 2026; su incorporación sigue aplazada |
| 10d | `b1c7f09` | Regional 2023 completo |
| 10e | `25e18cd` | Regional 2024 completo |

La validación integrada comprende 33 pruebas de datos, selección, filtros y PDF, y 12 recorridos de navegador. Los ejemplos C++17 tienen su validador independiente. Los PDFs originales se reconciliaron con sus cuadernillos y se inspeccionaron las 80 páginas. El QA de siete variantes de exportación generó y revisó 77 páginas adicionales de apuntes y paquetes.

La interfaz y las descargas se probaron en Chromium en computadora y celular. Esto no equivale a haber realizado pruebas con integrantes del club: quedan pendientes la revisión del usuario y de una persona principiante. También siguen pendientes los enfoques avanzados identificados como estimaciones de baja confianza.

La primera publicación tiene su propia configuración y verificación. El resultado estático permanece portable a Cloudflare Pages o al servidor de la facultad.
