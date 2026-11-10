---
id: cpp-busqueda-ordenada
title: Buscar en datos ordenados
family: Algoritmos de la STL
language: cpp
standard: C++17
status: draft
---

# Buscar en datos ordenados

## Descripción

Si una secuencia ya está ordenada, `lower_bound`, `upper_bound` y `binary_search` permiten consultar valores mediante búsqueda binaria. En un vector cada consulta cuesta O(log n), después del costo inicial de ordenar cuando haga falta.

Usá `binary_search` cuando alcanza con saber si está. `lower_bound` y `upper_bound` devuelven posiciones que también permiten encontrar límites, contar copias o consultar el siguiente valor por orden.

Las llamadas suponen el mismo criterio de orden que se usó para ordenar. Los ejemplos usan orden ascendente. Sobre un set, multiset o map, usá los métodos del contenedor para aprovechar su estructura.

## Funciones y operaciones

| Uso | Resultado |
|---|---|
| `lower_bound(inicio, fin, x)` | Primer iterador con valor mayor o igual a x, o fin |
| `upper_bound(inicio, fin, x)` | Primer iterador con valor estrictamente mayor a x, o fin |
| `binary_search(inicio, fin, x)` | Si existe un valor igual a x |
| `hasta - desde` | Tamaño de un tramo de vector o string |

## Ejemplos

### Contar copias y obtener sus límites

```cpp
vector<int> v = {1, 2, 2, 2, 5};
auto desde = lower_bound(v.begin(), v.end(), 2);
auto hasta = upper_bound(v.begin(), v.end(), 2);
int cantidad = static_cast<int>(hasta - desde); // 3
int primeraPosicion = static_cast<int>(desde - v.begin()); // 1
bool existe = binary_search(v.begin(), v.end(), 5); // true
```

El tramo `[desde, hasta)` contiene exactamente las copias buscadas. Si el valor falta, los dos límites coinciden y la cantidad es cero.

### Consultar un límite que puede quedar afuera

```cpp
vector<int> v = {1, 2, 5};
auto it = lower_bound(v.begin(), v.end(), 6);
if (it != v.end()) {
    int valor = *it;
}
// En este caso it vale v.end() y el bloque no se ejecuta.
```

### Contar valores en un intervalo inclusivo

```cpp
vector<int> v = {1, 2, 2, 4, 7};
int l = 2, r = 4;
auto desde = lower_bound(v.begin(), v.end(), l);
auto hasta = upper_bound(v.begin(), v.end(), r);
int cantidad = static_cast<int>(hasta - desde); // 3
```

Este cálculo supone `l <= r`. Los límites devueltos sirven para contar aunque alguno sea `end()`. Para leer un elemento señalado, primero comprobá que exista.
