---
id: cpp-funciones-referencias
title: Funciones, referencias y lambdas
family: Apoyo básico
language: cpp
standard: C++17
status: draft
---

# Funciones, referencias y lambdas

## Descripción

Una función reúne instrucciones para una tarea y puede devolver un resultado. Sus parámetros son los datos que recibe. Usala para nombrar una operación repetida, separar una condición o conservar una implementación que después vas a adaptar.

Un parámetro por valor recibe una copia. Una referencia con `&` permite trabajar sobre el objeto original. `const T&` permite consultarlo sin copiarlo y conserva sus datos. Esta última forma es útil para vectores y strings grandes que una función solo necesita leer.

Una lambda es una función pequeña que podés escribir dentro de otra función o pasar a un algoritmo como `sort` o `find_if`. Los corchetes indican qué variables externas usa. Para las operaciones sencillas de estas fichas alcanza con capturar por valor las variables necesarias.

## Funciones y operaciones

| Forma | Significado |
|---|---|
| `long long sumar(long long a, long long b)` | Función que recibe dos enteros y devuelve uno |
| `return resultado;` | Devuelve un valor y termina esa llamada |
| `void modificar(vector<int>& v)` | Función que modifica el vector recibido |
| `long long sumar(const vector<int>& v)` | Función que consulta el vector sin copiarlo |
| `[](int x) { return x % 2 == 0; }` | Lambda que consulta si x es par |
| `[limite](int x) { return x > limite; }` | Lambda que conserva una copia de la variable externa `limite` |

## Ejemplos

### Definir una función fuera de main

```cpp
long long sumar(long long a, long long b) {
    return a + b;
}
```

La llamada siguiente va dentro de `main`.

```cpp
long long resultado = sumar(5, 8); // 13
```

### Modificar el original

Esta función se define fuera de `main`.

```cpp
void duplicar(vector<int>& valores) {
    for (int& x : valores) {
        x *= 2;
    }
}
```

```cpp
vector<int> v = {2, 5};
duplicar(v); // v queda {4, 10}
```

### Consultar sin copiar

Esta función se define fuera de `main`.

```cpp
long long sumarValores(const vector<int>& valores) {
    long long total = 0;
    for (int x : valores) total += x;
    return total;
}
```

```cpp
vector<int> v = {2, 5};
long long total = sumarValores(v); // 7
```

### Usar una lambda con una variable externa

```cpp
int limite = 5;
auto supera = [limite](int x) {
    return x > limite;
};
bool resultado = supera(7); // true
```

En un comparador de ordenación la función devuelve si el primer elemento debe ir antes que el segundo. En una búsqueda por condición devuelve si el elemento sirve.
