---
id: cpp-variables
title: Variables, tipos e inicialización
family: Apoyo básico
language: cpp
standard: C++17
status: draft
---

# Variables, tipos e inicialización

## Descripción

Una variable guarda un valor con un nombre y un tipo. El tipo determina qué valores puede representar y qué operaciones se hacen con él. Elegilo usando las cotas del enunciado, incluidas las sumas y los productos intermedios.

Usá `int` para índices y cantidades acotadas, `long long` para sumas o productos grandes, `double` para resultados aproximados, `char` para un carácter y `bool` para una condición. Una variable local de tipo numérico necesita recibir un valor antes de leerse. Ese valor puede venir de la entrada o de una inicialización explícita.

`auto` deduce el tipo a partir de la expresión de la derecha. Es cómodo para iteradores y resultados de búsqueda. `const` permite declarar un valor que se consulta durante el cálculo y se mantiene fijo.

## Funciones y operaciones

| Uso | Resultado o efecto |
|---|---|
| `int cantidad = 0;` | Entero, habitualmente de 32 bits y hasta aproximadamente 2 mil millones |
| `long long suma = 0;` | Entero de al menos 64 bits, hasta aproximadamente 9 trillones |
| `double promedio = 0.0;` | Valor real aproximado |
| `char letra = 'A';` | Un carácter |
| `bool posible = true;` | Valor lógico `true` o `false` |
| `const int LIMITE = 1000;` | Entero cuyo valor queda fijo |
| `auto x = expresion;` | Crea `x` con el tipo deducido de la expresión |
| `1LL * a * b` | Hace el producto desde el principio en `long long` |
| `static_cast<int>(valor)` | Convierte al tipo indicado, que debe poder representar el valor que necesitás |

Para los límites exactos de un tipo podés usar `numeric_limits<T>::max()` y `numeric_limits<T>::lowest()`.

## Ejemplos

### Dar un valor a cada variable

```cpp
int a = 0, b = 0, c = 0;
long long suma = 0;
bool encontrado = false;
```

En `int a, b, c = 0;`, solo `c` queda inicializada. También podés declarar sin inicializar una variable que vas a cargar inmediatamente con `cin`, antes de usarla.

### Ampliar antes del producto

```cpp
int ancho = 100000;
int alto = 100000;
long long area = 1LL * ancho * alto; // 10000000000
```

El tipo de la variable a la izquierda no cambia el tipo del cálculo de la derecha. La promoción se hace antes de multiplicar. El resultado final también debe caber en `long long`.

### Copiar y convertir

```cpp
int cantidad = 7;
auto copia = cantidad; // copia es int y vale 7
double promedio = 3.75;
int parteEntera = static_cast<int>(promedio); // 3
```

La conversión de un real representable a entero descarta su parte decimal hacia cero. Para redondear se usan las operaciones de la ficha de reales.
