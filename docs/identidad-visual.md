# Identidad visual del club

La interfaz parte del emblema de las tres hormigas: colores vivos, contornos oscuros y una idea de práctica compartida. El logo original se conserva.

## Paleta y tipografía

- Azul `#2e50db`: acciones, navegación y enlaces.
- Amarillo `#ffdc60`: acentos y selección de sección.
- Rojo `#e34954` y celeste `#48a9ed`: detalles del emblema y piezas gráficas.
- Tinta `#23263b`: títulos, contornos y código.
- Fondo `#f5f7ff` y superficies blancas: lectura prolongada.
- Bricolage Grotesque para títulos y Nunito Sans para texto. Fuentes variables servidas desde el sitio, con sus licencias OFL en `public/fonts/`.

La portada usa una tarjeta de la colonia, rutas punteadas y etiquetas con sombras de contorno. Las superficies de consulta reducen esos recursos: tablas y apuntes priorizan texto, contraste y densidad útil.

## Aplicación

Los estilos compartidos viven en `src/styles/club.css`. Los componentes con estilos propios usan las variables comunes. `--green` se conserva como alias compatible del azul para las referencias existentes; no es un segundo color de marca.

La mascota sigue visible en celular. Las animaciones se limitan a la respuesta de los botones y respetan la preferencia de movimiento reducido. La dificultad se distingue por texto además del color.

Este cambio corresponde a la web. Los motores PDF conservan su composición de consulta e impresión.

Verificación del cambio: comprobación de tipos; 12 recorridos de navegador existentes; revisión de inicio, catálogo, ficha de set y armador; fuentes locales cargadas; inicio sin desborde a 320, 390 y 768 píxeles.
