---
id: cpp-recorridos
title: Recorridos y ciclos
family: Apoyo básico
language: cpp
standard: C++17
status: draft
---

# Recorridos y ciclos

## Descripción

Un ciclo repite instrucciones. Usá `for` cuando llevás una posición o cantidad de pasos, un recorrido por elementos cuando alcanza con el valor, y `while` cuando la repetición depende de una condición que va cambiando.

Los recorridos por posición permiten consultar vecinos o modificar un elemento concreto. Los recorridos por valor son útiles para sumar, contar o buscar extremos. Una referencia, indicada con `&`, permite modificar el elemento que se recorre.

Fijá qué posiciones incluye el recorrido y qué cambia en cada vuelta. En búsquedas y simulaciones, ese avance es lo que permite terminar el ciclo. Para retroceder hasta cero, un índice con signo facilita expresar la condición de salida.

## Funciones y operaciones

| Forma | Uso |
|---|---|
| `for (int i = 0; i < n; ++i)` | Posiciones de 0 a n - 1 |
| `for (int x : v)` | Lee una copia de cada elemento |
| `for (int& x : v)` | Accede a cada elemento para modificarlo |
| `for (const string& s : palabras)` | Lee cada string sin copiarlo |
| `while (condicion)` | Repite mientras se cumpla |
| `do { ... } while (condicion);` | Ejecuta al menos una vez y después consulta la condición |
| `break` | Termina el ciclo más interno |
| `continue` | Pasa a la próxima vuelta del ciclo más interno |

## Ejemplos

### Sumar elementos

```cpp
vector<int> v = {4, 2, 7};
long long suma = 0;
for (int x : v) {
    suma += x;
}
// suma vale 13
```

### Modificar usando una referencia

```cpp
vector<int> v = {4, 2, 7};
for (int& x : v) {
    x *= 2;
}
// v queda {8, 4, 14}
```

### Recorrer hacia atrás

```cpp
vector<int> v = {4, 2, 7};
int n = static_cast<int>(v.size());
for (int i = n - 1; i >= 0; --i) {
    cout << v[i] << ' ';
}
// Salida: 7 2 4
```

Si el vector está vacío, `n - 1` vale -1 y el ciclo no entra.

### Examinar vecinos

```cpp
string s = "AABB";
int n = static_cast<int>(s.size());
int iguales = 0;
for (int i = 0; i + 1 < n; ++i) {
    if (s[i] == s[i + 1]) ++iguales;
}
// iguales vale 2
```

### Repetir mientras cambia un valor

```cpp
int n = 120;
int ceros = 0;
while (n > 0 && n % 10 == 0) {
    n /= 10;
    ++ceros;
}
// n vale 12 y ceros vale 1
```

### Filtrar y terminar una búsqueda

```cpp
vector<int> v = {-2, 3, 8, 10};
int primeroPar = -1;
for (int x : v) {
    if (x < 0) continue;
    if (x % 2 == 0) {
        primeroPar = x;
        break;
    }
}
// primeroPar vale 8
```
