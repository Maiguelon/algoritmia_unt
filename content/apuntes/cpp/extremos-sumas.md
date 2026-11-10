---
id: cpp-extremos-sumas
title: Mínimos, máximos y sumas
family: Algoritmos de la STL
language: cpp
standard: C++17
status: draft
---

# Mínimos, máximos y sumas

## Descripción

`min` y `max` eligen entre valores que ya tenés. `min_element` y `max_element` recorren una secuencia y señalan la primera aparición de su extremo. Elegí según si necesitás el valor, su posición o ambas cosas.

`accumulate` suma los elementos de un rango a un valor inicial. El tipo de ese valor inicial determina el tipo usado para acumular. Usá `0LL` cuando la suma pueda superar el rango de `int`.

Si ya estás recorriendo los datos, también podés mantener una variable de máximo, mínimo o suma. Eso permite combinar la actualización con otro trabajo del mismo recorrido y elegir explícitamente qué hacer ante empates.

## Funciones y operaciones

| Uso | Resultado o condición |
|---|---|
| `min(a, b)` / `max(a, b)` | Menor / mayor entre valores del mismo tipo |
| `min_element(inicio, fin)` | Iterador al primer mínimo, o fin si el rango está vacío |
| `max_element(inicio, fin)` | Iterador al primer máximo, o fin si el rango está vacío |
| `accumulate(inicio, fin, 0LL)` | Suma en `long long`, empezando en 0 |
| `numeric_limits<int>::max()` | Mayor valor representable por `int` |
| `numeric_limits<int>::lowest()` | Menor valor representable por `int` |

## Ejemplos

### Comparar dos valores

```cpp
long long a = 7, b = 12;
long long mayor = max(a, b); // 12
long long acotado = max(0LL, a - b); // 0
```

El literal `0LL` tiene el mismo tipo que `a - b` en este ejemplo.

### Valor y posición de un extremo

```cpp
vector<int> v = {5, 2, 2, 8};
auto it = min_element(v.begin(), v.end());
if (it != v.end()) {
    int valor = *it; // 2
    int posicion = static_cast<int>(it - v.begin()); // 1
}
```

### Sumar una secuencia

```cpp
vector<int> v = {2000000000, 2000000000};
long long total = accumulate(v.begin(), v.end(), 0LL);
// total vale 4000000000
```

### Conservar el índice del mejor

```cpp
vector<int> v = {5, 2, 2, 8};
int mejor = 0; // El vector tiene al menos un elemento.
for (int i = 1; i < static_cast<int>(v.size()); ++i) {
    if (v[i] < v[mejor]) mejor = i;
}
// mejor vale 1
```

La comparación estricta conserva el primer empate. Los recorridos completos mostrados cuestan O(n).
