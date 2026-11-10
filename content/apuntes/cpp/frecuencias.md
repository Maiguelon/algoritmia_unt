---
id: cpp-frecuencias
title: Tablas de frecuencias
family: Recetas básicas
language: cpp
standard: C++17
status: draft
---

# Tablas de frecuencias

## Descripción

Una tabla de frecuencias guarda cuántas veces aparece cada valor. Se construye recorriendo los datos una vez y aumentando el contador correspondiente. Después permite consultar varias cantidades sin volver a recorrer la entrada completa.

Usá un vector de contadores si los valores pertenecen a un rango pequeño y conocido, como las letras de la a a la z o los enteros de 0 a 100. Usá un `map` si las claves son palabras o números dispersos. Un `set` solo conserva si un valor apareció; no conserva cuántas veces.

Para contar una única cosa una sola vez, `count` puede ser más directo. La tabla resulta útil cuando vas a consultar muchas claves, comparar sus cantidades o actualizar los contadores durante un recorrido. El rango de las claves y el máximo de cada contador determinan el tamaño y tipo de la tabla.

## Funciones y operaciones

| Operación | Para qué sirve | Condición |
|---|---|---|
| `vector<int> frecuencia(k, 0)` | Prepara k contadores en cero | Claves entre 0 y k - 1 |
| `++frecuencia[x]` | Cuenta una aparición de x | x es un índice válido |
| `frecuencia[x]` | Consulta la cantidad acumulada | La tabla ya fue construida |
| `c - 'a'` | Convierte una letra minúscula inglesa en índice | c está entre `'a'` y `'z'` |
| `map<string, int> frecuencia` | Cuenta claves de texto | Cada clave conserva su propio contador |
| `frecuencia.find(clave)` | Consulta un map sin agregar una clave ausente | Comparar el resultado con `end()` |

Con un rango de k valores y n datos, el vector usa O(k) memoria y se prepara en O(n + k). Las actualizaciones de un `map` con u claves distintas cuestan O(log u) cada una.

## Ejemplos

### Letras minúsculas inglesas

```cpp
string s = "banana";
vector<int> frecuencia(26, 0);
for (char c : s) {
    ++frecuencia[c - 'a'];
}
int aes = frecuencia['a' - 'a']; // 3
int enes = frecuencia['n' - 'a']; // 2
```

Esta tabla distingue mayúsculas y minúsculas y supone que todos los caracteres están entre `'a'` y `'z'`.

### Números en un rango conocido

```cpp
vector<int> valores = {3, 1, 3, 0, 1}; // valores entre 0 y 10
vector<int> frecuencia(11, 0);
for (int x : valores) {
    ++frecuencia[x];
}
int cantidad = frecuencia[3]; // 2
```

Reservar una posición por cada posible valor es conveniente cuando ese rango entra cómodamente en memoria. Un valor de mil millones requiere otra representación, aunque haya pocos datos.

### Palabras distintas

```cpp
vector<string> palabras = {"sol", "luna", "sol"};
map<string, int> frecuencia;
for (const string& palabra : palabras) {
    ++frecuencia[palabra];
}

auto it = frecuencia.find("sol");
int cantidad = (it == frecuencia.end() ? 0 : it->second); // 2
```

El acceso con `[]` crea una clave ausente con contador cero antes de aumentarlo. `find` permite consultar sin cambiar el mapa.
