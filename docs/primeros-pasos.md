# Primera práctica guiada

Página `/empeza/`, conectada al acceso «¿Recién empezás? Arrancá acá» del inicio. La guía acompaña la lectura, el razonamiento y la implementación de A. A la mitad / At the midpoint del TAP 2026. Luego muestra pruebas, envío al juez, dificultades y problemas iniciales siguientes. No incluye una demostración con un error aritmético intencional.

La plantilla incompleta y la implementación explicada son ayudas optativas, inicialmente plegadas. El código mostrado y copiado procede directamente de `src/tutorial/primer-ac-starter.cpp` y `src/tutorial/primer-ac.cpp`, importados como texto; no hay una segunda copia manual en la página. La copia informa si no está disponible el portapapeles. También hay acceso a los bloques del apunte y al selector del problema, respetando los demás problemas ya elegidos.

## Fuentes comprobadas el 10 de noviembre de 2026

- [Enunciado y acceso público al juez](https://codeforces.com/gym/106682/problem/A): duración, entrada, caracteres de salida y tres ejemplos. La página pública muestra la inscripción a práctica, Submit Code y My Submissions. No se inició sesión ni se enviaron soluciones a Codeforces durante la validación.
- [Cuadernillo español original](https://codeforces.com/gym/106682/attachments/download/39252/TAP-2026.pdf#page=3), conservado en `/statements/tap-2026-a.pdf`. Su entrada y salida coinciden con la ficha pública del juez.
- Los dos casos adicionales, el razonamiento y el código son elaboración del club, no una editorial oficial. Las recomendaciones y bandas reutilizan el catálogo revisado; no equivalen a ratings de Codeforces.

## Verificación

La implementación publicada se compiló con GNU C++17 y se ejecutó para las **18.000 entradas válidas** (H de 0 a 4, M y S de 0 a 59). El oráculo comparó las ternas (H,M,S) con (2,30,0), independientemente de la conversión a segundos del código. Se comprobó carácter, salto de línea y retorno normal. Esto es verificación local; no se presenta como un envío Accepted observado en el juez. La plantilla incompleta pasó la comprobación de sintaxis de C++17.

El navegador comprueba el recorrido desde inicio, ayudas cerradas inicialmente, copia exitosa y alternativa si falla, selección del A y su apunte recomendado, enlaces internos, filtro Inicial y acceso a WhatsApp. Se inspeccionan pantallas de 1280, 390 y 320 px, incluyendo bloques de código abiertos.

Al actualizar el tutorial, modificar los archivos C++ y revisar el texto, los casos y las instrucciones del juez. El paso de práctica depende de Codeforces y debe revisarse si cambia su interfaz.
