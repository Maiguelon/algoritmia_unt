---
id: cpp-pares
title: Pares
family: Contenedores
language: cpp
standard: C++17
status: draft
---

# Pares

## Descripción

Un `pair<T, U>` guarda dos datos juntos. Sus tipos pueden ser iguales o diferentes. Usalo para coordenadas, valor y posición original, o cualquier dato que deba seguir asociado a otro mientras lo guardás o lo ordenás.

Los campos se llaman `.first` y `.second`. El significado lo elegís vos, así que conviene dejarlo claro al declarar la variable. Un par guarda exactamente dos campos. Un `vector<pair<...>>` permite guardar una lista de esos pares.

El orden por defecto compara primero `.first` y, ante un empate, `.second`. Eso permite ordenar coordenadas o valores con sus posiciones sin escribir un comparador. Para otro criterio, usá la ficha de ordenación.

## Funciones y operaciones

| Uso | Parámetros | Resultado o efecto |
|---|---|---|
| `pair<int, int> p = {f, c}` | Dos valores | Guarda una fila y una columna |
| `p.first` / `p.second` | Ninguno | Acceso al primer / segundo campo |
| `p = {x, y}` | Dos valores | Cambia los dos campos |
| `auto [x, y] = p` | Un par | Copia sus campos en dos variables, desde C++17 |
| `p < q` | Otro par del mismo tipo | Compara primero el primer campo y luego el segundo |
| `p == q` | Otro par del mismo tipo | Comprueba igualdad de ambos campos |

## Ejemplos

### Coordenadas

```cpp
pair<int, int> punto = {4, -2};
int fila = punto.first;    // 4
int columna = punto.second; // -2
punto.second = 3;          // punto queda {4, 3}
```

### Conservar una posición al ordenar

```cpp
vector<pair<int, int>> datos = {{8, 0}, {3, 1}, {8, 2}};
sort(datos.begin(), datos.end());
// datos queda {{3, 1}, {8, 0}, {8, 2}}
```

Cada par guarda valor y posición original. Al ordenar, esa asociación se conserva.

### Descomponer un par en dos nombres

```cpp
pair<int, int> punto = {4, -2};
auto [fila, columna] = punto;
fila = 9;
// punto sigue siendo {4, -2}, porque se copiaron sus campos.
```

Para modificar los campos originales mediante esos nombres se puede usar `auto& [fila, columna] = punto`.
