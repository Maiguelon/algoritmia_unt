---
id: cpp-apariciones
title: Apariciones de un patrón en texto
family: Recetas básicas
language: cpp
standard: C++17
status: draft
---

# Apariciones de un patrón en texto

## Descripción

`string::find` busca una aparición de un carácter o de una cadena más corta dentro de otra. Para recorrer todas las apariciones de un patrón, se repite la búsqueda indicando desde qué posición continuar. Un resultado válido es un índice; `string::npos` significa que no encontró otra aparición.

Hay dos recorridos distintos. Si continuás una posición después del inicio encontrado, permitís que las apariciones se superpongan. Si continuás después del patrón completo, las apariciones elegidas no se superponen. Por ejemplo, en `AAAAA`, el patrón `AA` empieza en 0, 1, 2 y 3, pero el recorrido que consume cada coincidencia toma 0 y 2.

Elegí la variante según lo que pide el enunciado. Contar un carácter con `count` es una operación distinta de contar una palabra o subcadena. Para patrones y textos pequeños, `find` repetido suele bastar; el costo de buscar depende de ambos tamaños. Esta receta no reemplaza los algoritmos especializados para textos grandes o muchas consultas.

## Funciones y operaciones

| Expresión | Resultado o uso |
|---|---|
| `s.find(patron)` | Primera aparición del patrón |
| `s.find(patron, desde)` | Primera aparición cuyo inicio es desde o después |
| `pos != string::npos` | La búsqueda encontró una posición |
| `s.find(patron, pos + 1)` | Siguiente búsqueda permitiendo superposición |
| `s.find(patron, pos + patron.size())` | Siguiente búsqueda después de consumir el patrón |
| `vector<size_t> posiciones` | Guarda índices del mismo tipo que devuelve `find` |

Los ejemplos suponen un patrón **no vacío**. Conservá el resultado como `size_t` o con `auto` y comparalo con `string::npos` antes de usarlo como posición.

## Ejemplos

### Incluir apariciones superpuestas

```cpp
string s = "ABABA";
string patron = "ABA";
vector<size_t> posiciones;
size_t pos = s.find(patron);
while (pos != string::npos) {
    posiciones.push_back(pos);
    pos = s.find(patron, pos + 1);
}
// posiciones queda {0, 2}
```

### Consumir cada coincidencia completa

```cpp
string s = "AAAAA";
string patron = "AA";
vector<size_t> posiciones;
size_t pos = s.find(patron);
while (pos != string::npos) {
    posiciones.push_back(pos);
    pos = s.find(patron, pos + patron.size());
}
// posiciones queda {0, 2}
```

### Contar sin guardar posiciones

```cpp
string s = "uno-dos-uno";
string patron = "uno";
int cantidad = 0;
size_t pos = s.find(patron);
while (pos != string::npos) {
    ++cantidad;
    pos = s.find(patron, pos + patron.size());
}
// cantidad vale 2
```
