---
id: cpp-plantilla
title: Plantilla de C++
family: Plantilla
language: cpp
standard: C++17
status: draft
---

# Plantilla de C++

## Descripción

Este bloque se incluye una sola vez al principio del apunte generado. Reúne la estructura común para escribir un programa de competencia en GNU C++17. El índice del apunte se calcula a partir de los módulos y partes seleccionados.

El programa empieza a ejecutarse en `main`. Dentro de sus llaves se leen los datos, se calcula la respuesta y se imprime lo que pide el enunciado. Una función auxiliar declarada con su nombre se escribe fuera de `main`. Cada ejemplo de la biblioteca indica cuando necesita esa ubicación.

Los fragmentos breves de las demás fichas se colocan dentro de `main`. Cada bloque parte de los datos que declara, salvo cuando se indique que usa una función definida en el bloque anterior. Los comentarios muestran resultados esperados y condiciones de uso.

## Funciones y operaciones

| Parte | Para qué sirve |
|---|---|
| `#include <bits/stdc++.h>` | Reúne las cabeceras de la biblioteca estándar en GNU C++ |
| `using namespace std;` | Permite escribir `cin`, `string` o `vector` sin anteponer `std::` |
| `int main()` | Define el punto de entrada del programa |
| `ios::sync_with_stdio(false)` | Permite entrada y salida rápidas con los flujos de C++ |
| `cin.tie(nullptr)` | Evita que cada lectura vacíe automáticamente la salida |
| `return 0;` | Termina el programa normalmente |

Con esta configuración, usá `cin` y `cout` de forma consistente. La cabecera `bits/stdc++.h` pertenece a GNU C++, el compilador habitual de estas prácticas. En otros entornos se incluyen las cabeceras estándar concretas, como `<iostream>`, `<vector>` y `<string>`.

## Ejemplos

### Programa inicial

```cpp
#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    // Leer los datos.

    // Calcular la respuesta.

    // Imprimir la respuesta.

    return 0;
}
```

Si el enunciado exige varias pruebas, el ciclo que las procesa se escribe dentro de `main`. Los bloques de entrada, recorridos y funciones muestran esas variantes.
