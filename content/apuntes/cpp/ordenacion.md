---
id: cpp-ordenacion
title: Ordenar, invertir y quitar duplicados
family: Algoritmos de la STL
language: cpp
standard: C++17
status: draft
---

# Ordenar, invertir y quitar duplicados

## Descripción

Ordenar reúne los elementos según un criterio. Puede facilitar buscar extremos, agrupar valores iguales o recorrer datos de menor a mayor. `sort` modifica el rango recibido, así que ordená una copia si después necesitás la secuencia original.

El orden por defecto es ascendente. En pares compara primero `.first` y después `.second`. Un comparador propio permite cambiar prioridades y desempates. Debe expresar si el primer elemento va estrictamente antes que el segundo.

`reverse` invierte el orden que hay en ese momento. `unique` junta las repeticiones contiguas y devuelve un nuevo final lógico. Para eliminar todas las repeticiones por valor, primero ordená y después ajustá el tamaño con `erase`.

## Funciones y operaciones

| Uso | Parámetros | Resultado o efecto |
|---|---|---|
| `sort(inicio, fin)` | Rango | Ordena de menor a mayor |
| `sort(inicio, fin, comparador)` | Rango y función | Ordena según si a debe ir antes que b |
| `reverse(inicio, fin)` | Rango | Invierte la secuencia |
| `unique(inicio, fin)` | Rango | Compacta iguales contiguos y devuelve el nuevo fin |
| `v.erase(nuevoFin, v.end())` | Fin lógico y fin anterior | Ajusta el tamaño después de compactar |

## Ejemplos

### Ordenar una copia

```cpp
vector<int> original = {5, 2, 5, 1};
vector<int> ordenado = original;
sort(ordenado.begin(), ordenado.end());
// ordenado queda {1, 2, 5, 5}; original conserva su orden.
```

### Orden descendente

```cpp
vector<int> v = {5, 2, 5, 1};
sort(v.begin(), v.end(), [](int a, int b) {
    return a > b;
});
// v queda {5, 5, 2, 1}
```

### Comparar pares con un desempate

```cpp
vector<pair<int, int>> datos = {{2, 5}, {1, 3}, {1, 8}};
sort(datos.begin(), datos.end(), [](const auto& a, const auto& b) {
    if (a.first != b.first) return a.first < b.first;
    return a.second > b.second;
});
// datos queda {{1, 8}, {1, 3}, {2, 5}}
```

Un elemento debe compararse como falso consigo mismo. Usá comparaciones estrictas `<` o `>` y un desempate consistente.

### Invertir texto

```cpp
string s = "TAP";
reverse(s.begin(), s.end()); // "PAT"
```

### Conservar valores distintos en un vector

```cpp
vector<int> v = {3, 1, 3, 2, 1};
sort(v.begin(), v.end());
v.erase(unique(v.begin(), v.end()), v.end());
// v queda {1, 2, 3}
```

`sort` cuesta O(n log n). Invertir y compactar cuestan O(n). Esta forma de quitar repetidos deja los valores ordenados.
