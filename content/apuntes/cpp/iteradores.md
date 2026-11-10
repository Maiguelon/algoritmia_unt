---
id: cpp-iteradores
title: Iteradores y rangos
family: Apoyo básico
language: cpp
standard: C++17
status: draft
---

# Iteradores y rangos

## Descripción

Un iterador señala una posición de una colección. Muchas operaciones de la STL reciben dos iteradores para elegir qué parte van a recorrer o devuelven un iterador al elemento encontrado. Un índice, en cambio, es un número de posición.

`begin()` señala el primer elemento y `end()` el límite posterior al último. El rango `[inicio, fin)` incluye el primero y excluye el segundo. Si una búsqueda devuelve `end()`, no encontró un elemento que puedas leer. En una colección vacía, `begin()` y `end()` son iguales.

`*it` permite leer el valor señalado. En un vector o string podés calcular una posición restando `begin()`. En un set o map el acceso se organiza por claves y sus iteradores permiten avanzar y retroceder, pero no esa resta. `auto` permite guardar cada resultado con su tipo correcto.

## Funciones y operaciones

| Uso | Resultado o condición |
|---|---|
| `v.begin()` / `v.end()` | Inicio / fin excluido del rango |
| `*it` | Elemento señalado por un iterador válido |
| `it->first` / `it->second` | Campos de un par señalado por el iterador |
| `++it` | Avanza una posición, cuando hay un siguiente límite válido |
| `v.begin() + i` | Posición i en vector o string, con `0 <= i <= size()` |
| `it - v.begin()` | Índice de un iterador del mismo vector o string |
| `v.rbegin()` / `v.rend()` | Inicio / fin de un recorrido inverso |

## Ejemplos

### Pasar de una búsqueda al valor y su posición

```cpp
vector<int> v = {8, 3, 5};
auto it = find(v.begin(), v.end(), 3);
if (it != v.end()) {
    int valor = *it; // 3
    int posicion = static_cast<int>(it - v.begin()); // 1
}
```

### Elegir un tramo

```cpp
vector<int> v = {8, 3, 5, 2};
int cantidad = count(v.begin() + 1, v.begin() + 3, 5); // 1
// El tramo contiene los valores 3 y 5.
```

### Comparar con la búsqueda propia de string

```cpp
string s = "CASA";
auto posicion = s.find('S'); // Índice 2
auto it = find(s.begin(), s.end(), 'S'); // Iterador al carácter
```

La primera se compara con `string::npos`. La segunda se compara con `s.end()`.

### Recorrer un set

```cpp
set<int> valores = {7, 2, 10};
for (auto it = valores.begin(); it != valores.end(); ++it) {
    cout << *it << ' ';
}
// Salida: 2 7 10
```

Al editar una colección, algunos iteradores pueden dejar de ser válidos. En un vector, insertar o borrar puede desplazar elementos. En un set, borrar invalida el iterador del elemento quitado. Usá el resultado de la operación o volvé a buscar la posición que necesitás.
