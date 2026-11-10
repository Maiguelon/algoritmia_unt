---
id: cpp-reales
title: Reales, redondeo y precisión
family: Cuentas
language: cpp
standard: C++17
status: draft
---

# Reales, redondeo y precisión

## Descripción

`double` permite representar valores con parte decimal de forma aproximada. Usalo cuando el enunciado admite un margen de error o el cálculo requiere longitudes, ángulos o cocientes decimales. `long double` puede aportar más precisión según la plataforma.

`floor`, `ceil` y `round` devuelven valores de punto flotante redondeados. Para convertirlos a un entero, el resultado debe caber en el tipo de destino. Una raíz que representa un índice o un divisor exacto requiere corregir la aproximación con cuentas enteras.

Las funciones trigonométricas reciben radianes. Para imprimir decimales, `fixed` y `setprecision` permiten controlar la cantidad de cifras después del punto. Elegí esa cantidad de acuerdo con el error que admite la salida.

## Funciones y operaciones

| Uso | Condición | Resultado |
|---|---|---|
| `double(a) / b` | b distinto de cero | Cociente decimal |
| `sqrt(x)` | x >= 0 | Raíz cuadrada aproximada |
| `floor(x)` / `ceil(x)` | Valor real finito | Piso / techo como real |
| `round(x)` | Valor real finito | Entero más cercano como real, con mitades alejándose de cero |
| `abs(x)` | x real | Valor absoluto |
| `acos(-1.0)` | Constante válida | Aproximación de pi |
| `sin(r)` / `cos(r)` / `tan(r)` | Ángulo en radianes y función definida | Valor trigonométrico |
| `cout << fixed << setprecision(d)` | Cantidad de decimales | Cambia el formato de las siguientes salidas reales |

## Ejemplos

### División y redondeo

```cpp
int a = 11, b = 4;
double cociente = static_cast<double>(a) / b; // 2.75
long long piso = static_cast<long long>(floor(cociente)); // 2
long long techo = static_cast<long long>(ceil(cociente)); // 3
```

### Imprimir decimales

```cpp
double valor = 2.5;
cout << fixed << setprecision(4) << valor << '\n';
// Salida: 2.5000
```

### Obtener el piso exacto de una raíz entera

```cpp
long long n = 35;
long long r = static_cast<long long>(sqrt(static_cast<long double>(n)));
while (r + 1 <= n / (r + 1)) ++r;
while (r > 0 && r > n / r) --r;
// r vale 5
```

El ejemplo sirve para `n >= 0`. Las divisiones evitan calcular productos que podrían desbordar al corregir la raíz.

### Pasar de grados a radianes

```cpp
double grados = 45.0;
double radianes = grados * acos(-1.0) / 180.0;
double altura = 10.0;
double longitud = altura / tan(radianes); // Aproximadamente 10
```

El significado de la fórmula depende de la geometría del enunciado. La conversión de unidades se hace antes de llamar a la función trigonométrica.
