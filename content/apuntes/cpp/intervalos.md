---
id: cpp-intervalos
title: Unión de intervalos
family: Recetas básicas
language: cpp
standard: C++17
status: draft
---

# Unión de intervalos

## Descripción

Un intervalo se puede guardar como un par con extremo izquierdo y derecho. Cuando varios tramos cubren una recta, sumar sus longitudes por separado cuenta varias veces las partes superpuestas. La unión combina los tramos que se tocan o superponen para contar cada parte una sola vez.

La receta ordena los intervalos por su extremo izquierdo y mantiene el tramo unido actual. Si el siguiente empieza antes de que termine el actual, se amplía el extremo derecho cuando hace falta. Si empieza después, se termina un tramo y se comienza otro. Ordenar cuesta O(n log n) y el recorrido posterior O(n).

Esta versión mide longitud continua: el tramo [2, 5] tiene longitud 3. Contar las posiciones enteras de un intervalo cerrado es otra consulta: de 2 a 5 hay cuatro enteros. Elegí la interpretación antes de adaptar la receta. Si las coordenadas son enteras, se puede conservar esa aritmética y usar `long long` para las longitudes acumuladas; para coordenadas reales se usan `double` y las comparaciones que admita el enunciado.

## Funciones y operaciones

| Operación | Para qué sirve |
|---|---|
| `pair<double, double>` | Guarda extremo izquierdo y derecho |
| `sort(tramos.begin(), tramos.end())` | Ordena por extremo izquierdo y luego derecho |
| `siguienteInicio <= fin` | El siguiente tramo se une con el actual |
| `fin = max(fin, siguienteFin)` | Extiende el tramo sin acortarlo |
| `total += fin - inicio` | Agrega la longitud continua del tramo terminado |

Cada par debe cumplir `first <= second`. La función recibe una copia del vector para poder ordenarlo sin cambiar el original. No agrega tolerancias decimales por su cuenta.

## Ejemplos

### Medir la unión

Esta función se define fuera de `main`.

```cpp
double longitudUnion(vector<pair<double, double>> tramos) {
    if (tramos.empty()) return 0;
    sort(tramos.begin(), tramos.end());

    double inicio = tramos[0].first;
    double fin = tramos[0].second;
    double total = 0;

    for (int i = 1; i < static_cast<int>(tramos.size()); ++i) {
        double siguienteInicio = tramos[i].first;
        double siguienteFin = tramos[i].second;
        if (siguienteInicio <= fin) {
            fin = max(fin, siguienteFin);
        } else {
            total += fin - inicio;
            inicio = siguienteInicio;
            fin = siguienteFin;
        }
    }
    total += fin - inicio;
    return total;
}
```

La llamada siguiente va dentro de `main` y usa la función anterior.

```cpp
vector<pair<double, double>> tramos = {{1, 4}, {2, 3}, {5, 7}};
double longitud = longitudUnion(tramos); // 5: [1, 4] y [5, 7]
```

Un intervalo contenido por completo en otro conserva el extremo derecho mayor. Si dos tramos se tocan en un solo punto, unirlos no cambia su longitud total.
