---
id: cpp-set
title: Set
family: Contenedores
language: cpp
standard: C++17
status: draft
---

# Set

## Descripción

Un `set<T>` guarda valores distintos del mismo tipo. Si insertás un valor que ya está, no lo agrega. Los elementos se mantienen ordenados de menor a mayor con el orden por defecto.

`set<int>` guarda enteros y `set<string>` guarda textos. Para acceder a un elemento se usan recorridos o búsquedas. Los valores se conservan como claves, así que para cambiar uno hay que quitarlo e insertar el nuevo.

Usalo cuando importa qué valores diferentes aparecieron, si un valor está presente, cuál es el menor o el mayor, o cuál sigue a otro en orden. También sirve para reunir resultados distintos cuando varias operaciones pueden producir el mismo resultado. `size()` indica cuántos valores diferentes quedaron.

Con las inserciones `7, 2, 7`, un vector conserva la secuencia completa y un set queda con `2, 7`. Si necesitás conservar varias copias ordenadas, existe `multiset`. Si además querés guardar información asociada a cada clave, como su cantidad de apariciones, usá `map`.

El set conserva su propio orden, así que el recorrido sigue ese orden aunque hayas insertado de otra manera. Las consultas por valor y las inserciones cuestan O(log n), con n elementos guardados. Ese costo es útil para muchas consultas sucesivas sobre datos que también van cambiando.

## Funciones y operaciones

En la tabla, `s` es un set, `x` un valor del tipo que guarda e `it` un iterador que señala un elemento.

| Uso | Parámetros | Resultado o efecto | Modifica `s` |
|---|---|---|---|
| `set<int> s;` | Tipo de los valores | Crea un conjunto vacío de enteros | Lo crea |
| `s.insert(x)` | Valor a insertar | Guarda `x`. Devuelve un par con el iterador al elemento y un booleano que indica si se agregó | Sí, si faltaba |
| `s.size()` | Ninguno | Cantidad de valores distintos | No |
| `s.empty()` | Ninguno | `true` si está vacío | No |
| `s.count(x)` | Valor a consultar | 1 si existe, 0 si falta | No |
| `s.find(x)` | Valor a buscar | Iterador al elemento o `s.end()` | No |
| `s.erase(x)` | Valor a quitar | Lo borra si existe. Devuelve 1 si lo quitó y 0 si faltaba | Sí, si estaba |
| `s.erase(it)` | Iterador válido a un elemento | Quita ese elemento y devuelve un iterador al siguiente | Sí |
| `s.clear()` | Ninguno | Quita todos los elementos | Sí |
| `s.begin()` | Ninguno | Iterador al menor elemento, o `end()` si está vacío | No |
| `s.end()` | Ninguno | Límite posterior al último elemento | No |
| `s.rbegin()` | Ninguno | Iterador inverso al mayor elemento, si tiene elementos | No |
| `s.lower_bound(x)` | Valor de referencia | Iterador al primer valor mayor o igual a `x`, o `end()` | No |
| `s.upper_bound(x)` | Valor de referencia | Iterador al primer valor estrictamente mayor a `x`, o `end()` | No |

Un iterador señala un elemento. `*it` lee el valor señalado. `end()` sirve para comparar el resultado de una búsqueda. Para contar o acceder por índice, `set` carece de una operación `s[i]`. Tampoco se restan sus iteradores para obtener posiciones.

## Ejemplos

### Guardar distintos

```cpp
set<int> valores;
valores.insert(7);
valores.insert(2);
valores.insert(7);

int distintos = static_cast<int>(valores.size()); // 2
bool tieneSiete = (valores.count(7) == 1);         // true
bool tieneCinco = (valores.count(5) == 1);         // false
```

`size()` cuenta los valores que están guardados. `count(x)` consulta la presencia de ese valor y devuelve 0 o 1.

### Saber si una inserción agregó algo

```cpp
set<int> valores = {2, 7};
auto insercion = valores.insert(7);
bool nuevo = insercion.second; // false
```

`auto` deja que el compilador deduzca el tipo. La inserción devuelve un par. Su campo `.second` indica si el valor se agregó. El campo `.first` señala el elemento, tanto si se acaba de insertar como si ya estaba.

### Buscar y leer

```cpp
set<int> valores = {2, 7, 10};
auto it = valores.find(7);
if (it != valores.end()) {
    int encontrado = *it; // 7
}
```

La condición confirma que el iterador señala un elemento. Para una consulta de presencia, también podés usar directamente `valores.count(7) == 1`.

### Leer el menor, el mayor o el único

```cpp
set<int> valores = {7, 2, 10};
int menor = *valores.begin();  // 2
int mayor = *valores.rbegin(); // 10
```

El ejemplo tiene elementos. Si el set podría estar vacío, usá `!valores.empty()` antes de leer los extremos.

```cpp
set<string> palabras = {"CASA"};
if (palabras.size() == 1) {
    string unica = *palabras.begin(); // "CASA"
}
```

Cuando hay exactamente un elemento, `begin()` señala ese único valor. Los strings se ordenan comparando sus caracteres, así que el mínimo de un set de textos depende de ese orden.

### Recorrer en orden

```cpp
set<int> valores = {7, 2, 10};
for (int x : valores) {
    cout << x << ' ';
}
// Salida: 2 7 10
```

El recorrido completo cuesta O(n), con n elementos guardados.

### Borrar por valor o por iterador

```cpp
set<int> valores = {2, 7, 10};
int borrados = static_cast<int>(valores.erase(7)); // 1
// valores queda {2, 10}
```

```cpp
set<int> valores = {2, 7, 10};
auto it = valores.find(7);
if (it != valores.end()) {
    valores.erase(it); // valores queda {2, 10}
}
```

Después del borrado, el iterador del elemento quitado deja de ser válido. Para dejar vacío todo el conjunto, usá `valores.clear()`.

### Buscar el siguiente valor por orden

```cpp
set<int> valores = {2, 7, 10};
auto desdeSiete = valores.lower_bound(7);
auto despuesDeSiete = valores.upper_bound(7);

int igualOMayor = *desdeSiete;        // 7
int estrictamenteMayor = *despuesDeSiete; // 10
```

Ambas búsquedas pueden devolver `end()`. En una consulta general, comprobá el resultado antes de leerlo. Buscar por valor o con estos límites cuesta O(log n). Insertar por valor y borrar por valor también cuestan O(log n).

Referencia técnica de C++17: [set, borrador N4659](https://timsong-cpp.github.io/cppwp/n4659/set) y [contenedores asociativos](https://timsong-cpp.github.io/cppwp/n4659/associative.reqmts).
