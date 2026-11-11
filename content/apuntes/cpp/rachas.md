---
id: cpp-rachas
title: Rachas y grupos consecutivos
family: Recetas básicas
language: cpp
standard: C++17
status: draft
---

# Rachas y grupos consecutivos

## Descripción

Una racha es un grupo de elementos consecutivos que cumplen la misma condición; en estos ejemplos, tienen el mismo valor. Se puede representar por su inicio y final o por el valor repetido y su cantidad.

Usá este recorrido cuando importan los bloques del orden original: letras repetidas seguidas, días consecutivos con un estado o tramos de valores iguales. Una tabla de frecuencias junta todas las apariciones de un valor, aunque estén separadas. Las rachas mantienen esa separación. Ordenar previamente los datos cambia las rachas del original.

Si solo necesitás la longitud de la racha que termina en el elemento actual, alcanza un contador: aumenta cuando se cumple la condición y vuelve a cero cuando se corta. Podés actualizarlo mientras leés, sin guardar los elementos ni formar grupos.

El recorrido con dos índices avanza hasta terminar un grupo y retoma desde el comienzo del siguiente. Aunque tenga un `while` dentro de otro, cada posición se recorre una sola vez en esta receta, por lo que el costo total es O(n).

## Funciones y operaciones

| Paso | Expresión | Significado |
|---|---|---|
| Mantener la racha actual | `if (cumple) ++racha; else racha = 0;` | Aumenta al continuar; vuelve a cero cuando se corta |
| Consultar su longitud | `racha >= k` | La racha que termina aquí alcanzó al menos k elementos |
| Comenzar un grupo | `int j = i + 1` | i apunta al primer elemento del grupo |
| Extenderlo | `j < n && s[j] == s[i]` | j avanza mientras el elemento pertenece al grupo |
| Medirlo | `j - i` | Longitud del intervalo [i, j) |
| Guardarlo | `grupos.push_back({s[i], j - i})` | Valor y cantidad |
| Pasar al siguiente | `i = j` | Retoma en la primera posición sin procesar |

Se comprueba `j < n` antes de consultar `s[j]`. Para datos vacíos no se entra en el recorrido.

## Ejemplos

### Actualizar una racha mientras leés

```cpp
int n;
cin >> n;
int consecutivos = 0;
for (int i = 0; i < n; ++i) {
    int valor;
    cin >> valor;
    if (valor > 0) ++consecutivos;
    else consecutivos = 0;
    cout << consecutivos << '\n';
}
// Para los valores 2, 5, 0, 3, -1, imprime 1, 2, 0, 1, 0 en líneas separadas.
```

El contador describe la racha que termina en cada posición. Podés usarlo dentro del mismo recorrido para acumular un puntaje o consultar si llegó a un umbral.

### Separar una cadena en grupos

```cpp
string s = "AAABBAC";
int n = static_cast<int>(s.size());
vector<pair<char, int>> grupos;
int i = 0;
while (i < n) {
    int j = i + 1;
    while (j < n && s[j] == s[i]) {
        ++j;
    }
    grupos.push_back({s[i], j - i});
    i = j;
}
// grupos queda {{'A', 3}, {'B', 2}, {'A', 1}, {'C', 1}}
```

### Conservar solamente la longitud máxima

```cpp
vector<int> v = {2, 2, 5, 5, 5, 2};
int n = static_cast<int>(v.size());
int mejor = 0;
int i = 0;
while (i < n) {
    int j = i + 1;
    while (j < n && v[j] == v[i]) {
        ++j;
    }
    mejor = max(mejor, j - i);
    i = j;
}
// mejor vale 3; si v está vacío, queda en 0
```

No hace falta guardar los grupos si la respuesta solo necesita su cantidad, su máximo o alguna suma sobre ellos.
