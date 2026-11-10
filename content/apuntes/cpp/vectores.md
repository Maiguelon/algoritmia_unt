---
id: cpp-vectores
title: Vectores
family: Contenedores
language: cpp
standard: C++17
status: draft
---

# Vectores

## Descripción

Un `vector<T>` guarda una secuencia de elementos del mismo tipo. `vector<int>` guarda enteros y `vector<long long>` guarda enteros amplios. Conserva el orden y permite valores repetidos.

Las posiciones empiezan en cero. Si hay `n` elementos, los índices válidos van de 0 a `n - 1`. Podés cambiar el tamaño agregando o quitando elementos.

Usalo cuando necesitás guardar una lista para volver a recorrerla, acceder a una posición concreta, ordenar sus elementos o construir una respuesta de tamaño variable. El tipo entre `<` y `>` indica qué guarda cada posición. Por ejemplo, `vector<string>` guarda palabras y `vector<pair<int, int>>` guarda pares de enteros.

Un vector mantiene cada aparición en su posición hasta que lo modificás. En `{7, 2, 7}` conserva ambos sietes. Un `set` conserva los valores distintos ordenados. Si lo que necesitás es contar cuántas veces aparece cada valor, podés usar una tabla de frecuencias o un `map` según el tipo y el rango de los datos.

Leer o cambiar `v[i]` cuesta tiempo constante. Agregar al final con `push_back` cuesta tiempo constante amortizado, es decir, el costo total de muchas inserciones es proporcional a cuántas hacés. Insertar o borrar en el medio puede desplazar muchos elementos. Si vas a quitar muchos valores, suele servir recorrer el original y construir otro vector con los que conservás.

## Funciones y operaciones

En la tabla, `v` es un vector de enteros. `n` es una cantidad, `x` un valor e `i` una posición. En una inserción, `i` puede llegar hasta `v.size()`. Para acceder o borrar un elemento, debe ser menor que `v.size()`.

| Uso | Parámetros | Resultado o efecto | Modifica `v` |
|---|---|---|---|
| `vector<int> v;` | Ninguno | Crea un vector vacío | Lo crea |
| `vector<int> v(n);` | Cantidad | Crea `n` enteros inicializados en 0 | Lo crea |
| `vector<int> v(n, x);` | Cantidad y valor | Crea `n` copias de `x` | Lo crea |
| `v.size()` | Ninguno | Cantidad de elementos | No |
| `v.empty()` | Ninguno | `true` si está vacío | No |
| `v[i]` | Índice válido | Acceso al elemento para leerlo o cambiarlo | Si asignás |
| `v.front()` / `v.back()` | Vector con elementos | Acceso al primer / último elemento | Si asignás |
| `v.push_back(x)` | Valor a agregar | Agrega una copia de `x` al final | Sí |
| `v.pop_back()` | Vector con elementos | Quita el último elemento | Sí |
| `v.resize(n)` | Nuevo tamaño | Recorta, o agrega ceros si es un vector de enteros | Sí |
| `v.resize(n, x)` | Nuevo tamaño y valor | Recorta, o agrega copias de `x` | Sí |
| `v.clear()` | Ninguno | Deja el vector vacío | Sí |
| `v.insert(v.begin() + i, x)` | Posición de inserción y valor | Inserta antes de `i` y devuelve un iterador al nuevo elemento | Sí |
| `v.erase(v.begin() + i)` | Posición a borrar | Borra un elemento y devuelve un iterador al siguiente, o `end()` | Sí |
| `v.erase(v.begin() + l, v.begin() + r)` | Tramo con `0 <= l <= r <= v.size()` | Borra desde `l` incluido hasta `r` excluido | Sí |
| `sort(v.begin(), v.end())` | Rango completo | Ordena de menor a mayor | Sí |
| `reverse(v.begin(), v.end())` | Rango completo | Invierte el orden actual | Sí |
| `find(v.begin(), v.end(), x)` | Rango y valor | Iterador a la primera aparición o `v.end()` | No |
| `count(v.begin(), v.end(), x)` | Rango y valor | Cantidad de apariciones de `x` | No |
| `min_element(v.begin(), v.end())` | Rango | Iterador al primer mínimo, o `end()` si está vacío | No |
| `max_element(v.begin(), v.end())` | Rango | Iterador al primer máximo, o `end()` si está vacío | No |
| `accumulate(v.begin(), v.end(), 0LL)` | Rango y valor inicial | Suma usando `long long` | No |

`begin()` señala el primer elemento y `end()` el límite posterior al último. Esas posiciones se llaman iteradores. Un rango incluye su primer iterador y excluye el segundo. `*it` lee el elemento señalado por un iterador válido. Sobre un vector, `it - v.begin()` da su índice.

## Ejemplos

### Crear y cargar

```cpp
vector<int> ceros(4);       // {0, 0, 0, 0}
vector<int> marcas(4, -1);  // {-1, -1, -1, -1}
vector<int> datos = {7, 2, 7};
```

```cpp
int n;
cin >> n;
vector<int> v(n);
for (int i = 0; i < n; ++i) {
    cin >> v[i];
}
```

El tamaño debe estar creado antes de acceder con `v[i]`. Para construir el vector de a poco, empezá vacío y usá `push_back`.

### Recorrer y modificar

```cpp
vector<int> v = {4, 2, 7};
int n = static_cast<int>(v.size());
for (int i = 0; i < n; ++i) {
    v[i] += 1;
}
// v queda {5, 3, 8}
```

```cpp
vector<int> v = {4, 2, 7};
long long suma = 0;
for (int x : v) {
    suma += x;
}
// suma vale 13
```

En el segundo recorrido, `x` es una copia del elemento. Para modificar los elementos con ese estilo, escribí `for (int& x : v)`.

### Leer extremos y cambiar el tamaño

```cpp
vector<int> v = {4, 2};
int primero = v.front(); // 4
int ultimo = v.back();   // 2

v.push_back(7); // {4, 2, 7}
v.pop_back();   // {4, 2}
v.resize(4, 9); // {4, 2, 9, 9}
v.resize(1);    // {4}
v.clear();      // {}
```

`front`, `back` y `pop_back` requieren elementos. `resize(n, x)` usa `x` para los elementos que agrega. Los que ya estaban conservan su valor.

### Insertar y borrar

```cpp
vector<int> v = {10, 30, 40};
v.insert(v.begin() + 1, 20);           // {10, 20, 30, 40}
v.erase(v.begin() + 2);               // {10, 20, 40}
v.erase(v.begin() + 1, v.begin() + 3); // {10}
```

En el último borrado desaparecen las posiciones 1 y 2. Insertar o borrar en el medio desplaza elementos, así que puede costar tiempo proporcional al tamaño. Los iteradores guardados desde la posición afectada pueden dejar de ser válidos. Si el vector crece y cambia de almacenamiento, también pueden invalidarse los anteriores.

### Ordenar e invertir

```cpp
vector<int> v = {5, 2, 5, 1};
sort(v.begin(), v.end());    // {1, 2, 5, 5}
reverse(v.begin(), v.end()); // {5, 5, 2, 1}
```

`sort` cuesta O(n log n). `reverse` recorre el vector y cuesta O(n).

### Buscar, contar y recuperar una posición

```cpp
vector<int> v = {8, 3, 8, 5};
int cantidad = count(v.begin(), v.end(), 8); // 2

auto it = find(v.begin(), v.end(), 5);
if (it != v.end()) {
    int valor = *it; // 5
    int posicion = static_cast<int>(it - v.begin()); // 3
}
```

`auto` deduce el tipo del iterador. La comparación con `end()` indica si encontró el valor y permite leerlo con `*it`. La función `find` devuelve un iterador, por eso para obtener un índice se resta `begin()`. Buscar y contar con estas llamadas cuesta O(n).

### Leer el mínimo y el máximo

```cpp
vector<int> v = {5, 2, 2, 8};
auto menor = min_element(v.begin(), v.end());
auto mayor = max_element(v.begin(), v.end());

int minimo = *menor; // 2
int maximo = *mayor; // 8
int posicion = static_cast<int>(menor - v.begin()); // 1
```

El ejemplo tiene elementos, así que ambos iteradores se pueden leer. En un vector que podría estar vacío, comprobá que el iterador sea distinto de `end()`. Ante un empate se devuelve la primera aparición.

### Sumar con un tipo amplio

```cpp
vector<int> v = {2000000000, 2000000000};
long long suma = accumulate(v.begin(), v.end(), 0LL);
// suma vale 4000000000
```

El valor inicial `0LL` elige `long long` para acumular. Elegí un tipo capaz de guardar la suma total.

Referencia técnica de C++17: [vector, borrador N4659](https://timsong-cpp.github.io/cppwp/n4659/vector), [algoritmos](https://timsong-cpp.github.io/cppwp/n4659/algorithms) y [operaciones numéricas](https://timsong-cpp.github.io/cppwp/n4659/numeric.ops).
