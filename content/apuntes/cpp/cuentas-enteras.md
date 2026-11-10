---
id: cpp-cuentas-enteras
title: Cuentas enteras y restos
family: Cuentas
language: cpp
standard: C++17
status: draft
---

# Cuentas enteras y restos

## Descripción

Las operaciones entre enteros producen resultados enteros. En una división, la parte fraccionaria se descarta hacia cero. `%` calcula el resto. Estas operaciones sirven para repartir en grupos completos, consultar divisibilidad y separar una cantidad en unidades más grandes.

Para redondear una división positiva hacia arriba, podés usar el cociente y sumar uno si queda resto. Para conservar un resultado entre 0 y m - 1, calculá el resto y sumá m cuando sea negativo.

El tamaño de cada operación intermedia importa. Si un producto puede superar `int`, ampliá uno de sus operandos antes de multiplicar. Aplicar `%` después del producto no corrige un desbordamiento que ya ocurrió.

## Funciones y operaciones

| Uso | Condición | Resultado |
|---|---|---|
| `a / b` | b distinto de cero y cociente representable | Cociente entero hacia cero |
| `a % b` | División válida | Resto, con el signo de a cuando no es cero |
| `a / b + (a % b != 0)` | a >= 0 y b > 0 | Techo de la división |
| `abs(x)` | El valor positivo cabe en el tipo | Valor absoluto |
| `1LL * a * b` | Producto representable en `long long` | Producto en un tipo amplio |
| `(a + b) % m` | m > 0 y suma representable | Resto de la suma |

## Ejemplos

### Cociente, resto y techo

```cpp
long long a = 11, b = 4;
long long cociente = a / b; // 2
long long resto = a % b; // 3
long long techo = a / b + (a % b != 0); // 3
```

Esta fórmula evita sumar `a + b - 1`, que también podría exceder el tipo.

### Normalizar un resto negativo

```cpp
long long x = -3, m = 5;
long long r = x % m;
if (r < 0) r += m;
// r vale 2
```

### Calcular un producto modular

```cpp
long long mod = 1000000007LL;
long long a = mod - 1, b = mod - 2;
long long producto = (a * b) % mod; // 2
```

Aquí los operandos reducidos tienen un producto que cabe en 64 bits. Con un módulo mayor hay que volver a comprobar esa cota.

### Contar pares de elementos distintos

Para elegir dos posiciones diferentes entre n, sin importar su orden, la cantidad es `n * (n - 1) / 2`. La receta divide primero uno de los factores para reducir el tamaño del producto intermedio.

```cpp
long long n = 100000;
long long a = n, b = n - 1;
if (a % 2 == 0) a /= 2;
else b /= 2;
long long pares = a * b; // 4999950000
```

El cálculo usa `n >= 1`. Dividí el factor par antes de multiplicar y comprobá que el producto final quepa. Si el resultado lleva módulo, reducí los factores después de esa división entera.
