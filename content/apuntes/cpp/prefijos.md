---
id: cpp-prefijos
title: Sumas prefijas
family: Recetas básicas
language: cpp
standard: C++17
status: draft
---

# Sumas prefijas

## Descripción

Una suma prefija guarda los totales acumulados de un vector. Con la convención de esta ficha, `prefijo[i]` suma los primeros i elementos: `prefijo[0]` vale cero y `prefijo[n]` suma todo el vector. Por eso la tabla tiene una posición más que los datos.

Usala para responder muchas consultas de suma sobre intervalos de datos que permanecen iguales. Construir la tabla cuesta O(n), y cada consulta posterior cuesta O(1). Para una única suma suele alcanzar con un recorrido o `accumulate`. Si cambian los datos, las sumas prefijas afectadas deben actualizarse o reconstruirse.

La misma idea puede acumular cantidades: asignar 1 a los elementos que cumplen una condición y 0 a los demás permite contar cuántos la cumplen dentro de un intervalo. Los valores originales pueden ser negativos; la resta de prefijos sigue funcionando.

## Funciones y operaciones

| Expresión | Significado | Condición |
|---|---|---|
| `vector<long long> prefijo(n + 1, 0)` | Totales de 0 a n elementos | n es la cantidad de datos |
| `prefijo[i + 1] = prefijo[i] + v[i]` | Incorpora el siguiente dato | 0 <= i < n |
| `prefijo[r] - prefijo[l]` | Suma de índices [l, r), sin incluir r | 0 <= l <= r <= n |
| `prefijo[r + 1] - prefijo[l]` | Suma de índices [l, r], incluidos ambos | 0 <= l <= r < n |
| `prefijo[r] - prefijo[l - 1]` | Suma de posiciones de 1 a n, entre l y r | 1 <= l <= r <= n |

Elegí una convención de índices y mantenela en todas las consultas. El tipo del acumulador debe soportar la suma completa, aunque cada dato individual entre en `int`.

## Ejemplos

### Construir y consultar con índices desde cero

```cpp
vector<int> v = {4, 1, 7, 2};
int n = static_cast<int>(v.size());
vector<long long> prefijo(n + 1, 0);
for (int i = 0; i < n; ++i) {
    prefijo[i + 1] = prefijo[i] + v[i];
}
// prefijo queda {0, 4, 5, 12, 14}

int l = 1, r = 3;
long long sinIncluirR = prefijo[r] - prefijo[l]; // 1 + 7 = 8
long long incluyendoR = prefijo[r + 1] - prefijo[l]; // 1 + 7 + 2 = 10
```

### Contar pares dentro de un intervalo

```cpp
vector<int> v = {4, 1, 7, 2};
int n = static_cast<int>(v.size());
vector<int> prefijo(n + 1, 0);
for (int i = 0; i < n; ++i) {
    prefijo[i + 1] = prefijo[i] + (v[i] % 2 == 0);
}

int l = 1, r = 4; // intervalo [1, 4)
int pares = prefijo[r] - prefijo[l]; // 1: solamente el 2
```

La comparación produce `true` o `false`, que al sumarse aportan 1 o 0.
