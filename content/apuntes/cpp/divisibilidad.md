---
id: cpp-divisibilidad
title: MCD, divisores y factores primos
family: Cuentas
language: cpp
standard: C++17
status: draft
---

# MCD, divisores y factores primos

## Descripción

Un entero positivo d divide a n cuando `n % d == 0`. El máximo común divisor, MCD, es el mayor divisor positivo compartido. El mínimo común múltiplo, MCM, es el menor múltiplo positivo compartido para entradas positivas.

Usá `gcd` para combinar restricciones de divisibilidad o reducir una fracción, y `lcm` para consultar una coincidencia de múltiplos. Enumerar divisores y factorizar son operaciones distintas. La primera lista todos los valores que dividen al número. La segunda lo representa mediante primos y sus exponentes.

Las recetas por división de prueba recorren como máximo hasta la raíz cuadrada del valor original. Esa cota es parte de la elección del método. Para valores cercanos a 10 elevado a 18, un recorrido de hasta mil millones de candidatos puede exceder ampliamente el tiempo disponible.

## Funciones y operaciones

| Uso | Condición | Resultado |
|---|---|---|
| `n % d == 0` | d > 0 | Si d divide a n |
| `gcd(a, b)` | a y b no negativos | MCD no negativo; `gcd(0, 0)` vale 0 |
| `lcm(a, b)` | a y b no negativos, MCM representable | MCM no negativo; vale 0 si alguna entrada es 0 |
| `(a / gcd(a, b)) * b` | a y b positivos, resultado representable | MCM dividiendo antes de multiplicar |
| `d <= n / d` | n > 0 y d > 0 | Corte equivalente a d * d <= n |

## Ejemplos

### MCD y MCM

```cpp
long long a = 18, b = 24;
long long divisor = gcd(a, b); // 6
long long multiplo = lcm(a, b); // 72
```

### Enumerar divisores positivos

```cpp
long long n = 36;
vector<long long> divisores;
for (long long d = 1; d <= n / d; ++d) {
    if (n % d != 0) continue;
    divisores.push_back(d);
    if (d != n / d) divisores.push_back(n / d);
}
sort(divisores.begin(), divisores.end());
// {1, 2, 3, 4, 6, 9, 12, 18, 36}
```

Cuando d coincide con su pareja n/d se agrega una sola copia.

### Factorizar en primos

```cpp
long long original = 84;
long long n = original;
vector<pair<long long, int>> factores;
for (long long d = 2; d <= n / d; ++d) {
    int exponente = 0;
    while (n % d == 0) {
        n /= d;
        ++exponente;
    }
    if (exponente > 0) factores.push_back({d, exponente});
}
if (n > 1) factores.push_back({n, 1});
// factores queda {{2, 2}, {3, 1}, {7, 1}}
```

El primer campo del par es el primo y el segundo su cantidad de apariciones en el producto. La receta supone `original >= 1`. Para 1, la lista de factores queda vacía.
