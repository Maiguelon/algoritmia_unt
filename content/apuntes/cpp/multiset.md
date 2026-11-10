---
id: cpp-multiset
title: Multiset
family: Contenedores
language: cpp
standard: C++17
status: draft
---

# Multiset

## Descripción

Un `multiset<T>` guarda elementos ordenados y permite varias copias iguales. Usalo cuando el conjunto cambia y necesitás conservar cada aparición, consultar extremos o quitar una aparición concreta de un valor.

Con las inserciones `7, 2, 7`, un set guarda `2, 7` y un multiset guarda `2, 7, 7`. Un map de frecuencias representa las cantidades asociadas a cada clave. El multiset mantiene cada copia como un elemento que podés señalar con un iterador.

Las operaciones por valor y por iterador tienen efectos diferentes. `erase(x)` quita todas las copias de x. `erase(it)` quita la copia señalada. Esa diferencia conviene tenerla a mano al simular altas y bajas.

## Funciones y operaciones

| Uso | Resultado o efecto |
|---|---|
| `multiset<int> s;` | Crea un multiset vacío |
| `s.insert(x)` | Agrega una copia y devuelve su iterador |
| `s.size()` | Cantidad total de elementos, incluidas las repeticiones |
| `s.count(x)` | Cantidad de copias de x |
| `s.find(x)` | Iterador a una copia, o `end()` |
| `s.erase(x)` | Borra todas sus copias y devuelve cuántas quitó |
| `s.erase(it)` | Borra una copia y devuelve el iterador siguiente |
| `*s.begin()` / `*s.rbegin()` | Menor / mayor, si hay elementos |
| `s.lower_bound(x)` / `s.upper_bound(x)` | Límites del rango de copias de x |
| `s.empty()` / `s.clear()` | Consulta si está vacío / lo vacía |

## Ejemplos

### Conservar copias

```cpp
multiset<int> valores = {2, 2, 7};
valores.insert(2);
int copias = static_cast<int>(valores.count(2)); // 3
int total = static_cast<int>(valores.size());   // 4
```

### Quitar una sola aparición

```cpp
multiset<int> valores = {2, 2, 7};
auto it = valores.find(2);
if (it != valores.end()) valores.erase(it);
// valores queda {2, 7}
```

### Quitar todas las apariciones

```cpp
multiset<int> valores = {2, 2, 7};
int borrados = static_cast<int>(valores.erase(2)); // 2
// valores queda {7}
```

### Consultar extremos

```cpp
multiset<int> valores = {2, 2, 7};
int menor = *valores.begin();  // 2
int mayor = *valores.rbegin(); // 7
```

Insertar y buscar cuestan O(log n). Contar o borrar por valor puede requerir también recorrer sus k apariciones, con costo O(log n + k). Borrar invalida los iteradores de los elementos quitados.
