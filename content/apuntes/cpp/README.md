# Biblioteca básica de C++17

Primera versión de los **30 bloques** para el apunte modular del club. Las herramientas se describen por sí mismas; la selección para cada problema se hará después. Un bloque básico puede servir dentro de un problema difícil: el nivel del problema no determina qué consultas necesita su lector.

## Cómo se arma un apunte

La [plantilla de C++](plantilla.md) es un bloque independiente y ocupa el primer lugar una sola vez. Su programa inicial se conserva completo. Después va el índice solo si se eligieron al menos dos bloques de contenido, sin contar la plantilla, y luego los bloques elegidos, en el orden de este catálogo. La explicación de la plantilla no se repite en cada tema.

Cada bloque ofrece tres partes seleccionables:

| Parte | Contenido | Selección inicial propuesta |
|---|---|---|
| Descripción | Qué es, cuándo usarlo y diferencias con herramientas cercanas | Desmarcada |
| Funciones y operaciones | Tabla de uso, parámetros, resultados y condiciones | Marcada |
| Ejemplos | Fragmentos concretos con comentarios de resultado | Desmarcada |

La selección inicial es una propuesta para consultar funciones con rapidez. Quien esté aprendiendo puede activar las tres partes. Para la plantilla, el código inicial es fijo aunque se oculten sus otras partes.

Los comentarios de los ejemplos muestran resultados. Las condiciones que evitan accesos inválidos o permiten ejecutar el algoritmo forman parte del código útil. No se incluyen bloques de comprobación con `assert` ni programas de pruebas.

## Apoyo básico y conexiones

Los seis bloques de **apoyo básico** son opcionales y están disponibles para cualquier dificultad. Conviene sugerirlos al empezar; restringirlos a ejercicios Iniciales impediría usarlos a quien todavía necesita consultar ciclos o referencias al trabajar con ayuda en otro nivel.

Las conexiones del [catálogo](catalogo.json) son sugerencias de lectura, no inclusiones obligatorias. Marcar un tema no debe incorporar automáticamente toda su cadena de dependencias. Antes de generar el apunte se pueden añadir o quitar apoyos. Las dependencias se declaran por bloque completo; quien imprime solo su tabla de funciones puede necesitar menos apoyos que quien lee todos los ejemplos.

Algunas rutas de consulta:

- [Recorridos](recorridos.md) → [vectores](vectores.md) → [sumas prefijas](prefijos.md).
- [Iteradores](iteradores.md) y [pares](pares.md) → [map](map.md) → [frecuencias](frecuencias.md).
- [Strings](strings.md) → [conversiones](conversiones.md) o [apariciones](apariciones.md).
- [Funciones y lambdas](funciones-referencias.md) → [ordenación](ordenacion.md) → [búsqueda ordenada](busqueda-ordenada.md).

## Inventario

| Grupo | Bloques |
|---|---:|
| Plantilla | 1 |
| Apoyo básico | 6 |
| Texto | 2 |
| Contenedores | 9 |
| Algoritmos de la STL | 4 |
| Cuentas | 3 |
| Recetas básicas | 5 |
| **Total** | **30** |

### Plantilla

| Bloque | Qué cubre |
|---|---|
| [Plantilla de C++](plantilla.md) | Estructura del programa y convención de los fragmentos. |

### Apoyo básico

| Bloque | Qué cubre |
|---|---|
| [Variables, tipos e inicialización](variables.md) | Elegir tipos, inicializar y ampliar operaciones. |
| [Entrada y salida](entrada-salida.md) | Tokens, líneas, varias pruebas y salida ordenada. |
| [Condiciones y decisiones](condiciones.md) | Comparaciones, condiciones compuestas y ternario. |
| [Recorridos y ciclos](recorridos.md) | Índices, recorridos por valor o referencia y cortes. |
| [Funciones, referencias y lambdas](funciones-referencias.md) | Separar tareas, consultar sin copiar y expresar condiciones. |
| [Iteradores y rangos](iteradores.md) | Entender begin/end, resultados de búsquedas y posiciones. |

### Texto

| Bloque | Qué cubre |
|---|---|
| [Strings](strings.md) | Leer, consultar, buscar, comparar y modificar texto. |
| [Caracteres y conversiones](conversiones.md) | Dígitos, mayúsculas y minúsculas, stoi, stoll y to_string. |

### Contenedores

| Bloque | Qué cubre |
|---|---|
| [Vectores](vectores.md) | Secuencias con posiciones, repeticiones y tamaño variable. |
| [Pares](pares.md) | Agrupar dos datos, acceder a sus campos y compararlos. |
| [Matrices y grillas](matrices.md) | Filas, columnas, lectura y vecinos inmediatos. |
| [Set](set.md) | Valores distintos, pertenencia, inserción y borrado. |
| [Map](map.md) | Asociar claves con valores y consultar sin insertar. |
| [Multiset](multiset.md) | Valores ordenados con repeticiones y borrado por copia. |
| [Pila](pila.md) | Procesar primero el último elemento agregado. |
| [Cola](cola.md) | Procesar primero el primer elemento agregado. |
| [Deque](deque.md) | Agregar y quitar por ambos extremos. |

### Algoritmos de la STL

| Bloque | Qué cubre |
|---|---|
| [Buscar y contar en secuencias](busqueda-conteo.md) | find, count, find_if y count_if; valor frente a condición. |
| [Mínimos, máximos y sumas](extremos-sumas.md) | Extremos, sus posiciones y acumuladores del tipo adecuado. |
| [Ordenar, invertir y quitar duplicados](ordenacion.md) | sort, comparadores, reverse y unique con erase. |
| [Buscar en datos ordenados](busqueda-ordenada.md) | lower_bound, upper_bound y binary_search. |

### Cuentas

| Bloque | Qué cubre |
|---|---|
| [Cuentas enteras y restos](cuentas-enteras.md) | División, techo, módulo y productos sin desbordamiento. |
| [Reales, redondeo y precisión](reales.md) | Decimales, raíces, redondeo, trigonometría y salida. |
| [MCD, divisores y factores primos](divisibilidad.md) | gcd, lcm, divisores y factorización por división de prueba. |

### Recetas básicas

| Bloque | Qué cubre |
|---|---|
| [Tablas de frecuencias](frecuencias.md) | Contar muchas claves con vector o map. |
| [Sumas prefijas](prefijos.md) | Preparar sumas y conteos de intervalos estáticos. |
| [Rachas y grupos consecutivos](rachas.md) | Recorrer bloques sin mezclar apariciones separadas. |
| [Apariciones de un patrón en texto](apariciones.md) | Buscar todas las coincidencias con o sin superposición. |
| [Unión de intervalos](intervalos.md) | Ordenar y unir tramos para medir lo cubierto. |

## Límites de esta primera biblioteca

El alcance es la implementación básica de las dos bandas accesibles y las recetas cortas que suelen acompañarla. Las fichas de frecuencias, prefijos, rachas, apariciones e intervalos describen procedimientos reutilizables; conocerlos no elimina la observación que pueda requerir un problema.

Grafos, DP, flujo y estructuras o técnicas más avanzadas necesitan sus propios bloques en una ampliación. La inclusión de divisibilidad o intervalos aquí tampoco asigna automáticamente dificultad Inicial a los ejercicios que los usan. Esa clasificación se revisará problema por problema.

## Convenciones editoriales

- GNU C++17, con nombres claros y fragmentos adaptables.
- Cada archivo conserva exactamente las tres partes del catálogo. Sus identificadores son estables aunque se mejore el texto.
- La convención de ubicación de los fragmentos se explica una vez en la plantilla. Las funciones auxiliares señalan expresamente que van fuera de `main`.
- Las descripciones comparan alternativas cercanas y explican usos. Las tablas incluyen las condiciones necesarias para aplicar cada operación.
- Los ejemplos de un bloque son independientes, salvo la llamada a una función auxiliar que se presenta en el mismo bloque.
- Las fichas de un contenedor pueden mostrar una operación típica también tratada en otro bloque. El catálogo permite consultar el tratamiento general sin repetir todos los ejemplos en cada tema.
- El estado `draft` indica que el contenido puede ajustarse con la revisión del club. Esta entrega ya incluye los 30 textos; la vinculación con problemas concretos queda para la siguiente fase.

## Referencias de consulta

La biblioteca usa operaciones presentes en C++17. Para verificar contratos y requisitos se pueden consultar las secciones pertinentes del borrador público N4659:

- [Biblioteca de strings](https://timsong-cpp.github.io/cppwp/n4659/strings).
- [Contenedores](https://timsong-cpp.github.io/cppwp/n4659/containers).
- [Iteradores](https://timsong-cpp.github.io/cppwp/n4659/iterators).
- [Algoritmos](https://timsong-cpp.github.io/cppwp/n4659/algorithms).
- [Algoritmos numéricos](https://timsong-cpp.github.io/cppwp/n4659/numerics).
- [Entrada y salida](https://timsong-cpp.github.io/cppwp/n4659/input.output).
