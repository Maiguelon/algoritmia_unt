---
id: cpp-busqueda-conteo
title: Buscar y contar en secuencias
family: Algoritmos de la STL
language: cpp
standard: C++17
status: draft
---

# Buscar y contar en secuencias

## Descripción

`find` busca la primera aparición de un valor en un rango y `count` cuenta todas sus apariciones. Sirven sobre vectores, strings y otras secuencias accesibles mediante iteradores, aunque estén desordenadas.

Usá `find_if` o `count_if` cuando la consulta depende de una condición, como un número positivo o el primer campo de un par. La condición se escribe como una función o lambda que devuelve `true` para los elementos que te interesan.

El resultado de buscar es un iterador y el de contar es una cantidad. Para el texto completo de una subcadena, `string::find` recibe directamente el fragmento. En set y map, sus búsquedas por clave aprovechan la estructura y se escriben como `s.find(x)` o `m.find(clave)`.

## Funciones y operaciones

| Uso | Parámetros | Resultado |
|---|---|---|
| `find(inicio, fin, x)` | Rango y valor | Primer iterador igual a x, o fin |
| `count(inicio, fin, x)` | Rango y valor | Cantidad de elementos iguales a x |
| `find_if(inicio, fin, condicion)` | Rango y función | Primer iterador que cumple, o fin |
| `count_if(inicio, fin, condicion)` | Rango y función | Cantidad de elementos que cumplen |

El rango incluye `inicio` y excluye `fin`. Cada operación cuesta O(n) como máximo para n elementos.

## Ejemplos

### Valor y cantidad

```cpp
vector<int> datos = {4, 2, 4, 7};
int cantidad = count(datos.begin(), datos.end(), 4); // 2
auto it = find(datos.begin(), datos.end(), 7);
if (it != datos.end()) {
    int posicion = static_cast<int>(it - datos.begin()); // 3
}
```

### Contar por condición

```cpp
vector<int> datos = {-2, 3, 0, 7};
int positivos = count_if(datos.begin(), datos.end(), [](int x) {
    return x > 0;
});
// positivos vale 2
```

### Buscar por un campo de un par

```cpp
vector<pair<int, int>> puntos = {{2, 7}, {5, 9}};
int fila = 5;
auto it = find_if(puntos.begin(), puntos.end(), [fila](const auto& punto) {
    return punto.first == fila;
});
if (it != puntos.end()) {
    int columna = it->second; // 9
}
```

`[fila]` captura una copia de la fila buscada. `const auto&` permite consultar cada par sin copiarlo.
