---
id: cpp-map
title: Map
family: Contenedores
language: cpp
standard: C++17
status: draft
---

# Map

## Descripción

Un `map<Clave, Valor>` asocia un valor a cada clave distinta. Por ejemplo, `map<string, int>` puede guardar la cantidad de apariciones de cada palabra y `map<string, string>` puede guardar una traducción por palabra.

Usalo cuando necesitás recuperar información por una clave, especialmente si las claves son textos o números muy dispersos. Un vector es práctico cuando las claves son índices chicos y consecutivos. Un set sirve cuando alcanza con guardar la presencia de cada valor.

El map mantiene las claves ordenadas y cada clave aparece una vez. `m[clave]` permite leer o modificar su valor asociado. Si la clave falta, esa operación crea una entrada con su valor inicial, como 0 para un `int` o un string vacío. Para consultar sin agregar entradas, usá `find`.

## Funciones y operaciones

| Uso | Parámetros | Resultado o efecto | Modifica `m` |
|---|---|---|---|
| `map<string, int> m;` | Tipos de clave y valor | Crea el map vacío | Lo crea |
| `m[clave] = valor` | Clave y valor | Crea o actualiza la asociación | Sí |
| `++m[clave]` | Clave | Incrementa el contador, que empieza en 0 si faltaba | Sí |
| `m[clave]` | Clave | Acceso al valor, agregando la clave si falta | Si faltaba |
| `m.find(clave)` | Clave | Iterador al par o `m.end()` | No |
| `m.count(clave)` | Clave | 0 o 1 según si la clave existe | No |
| `m.size()` / `m.empty()` | Ninguno | Cantidad de claves / si está vacío | No |
| `m.erase(clave)` | Clave | Quita la entrada y devuelve 0 o 1 | Si estaba |
| `m.clear()` | Ninguno | Quita todas las entradas | Sí |

## Ejemplos

### Contar por clave

```cpp
vector<string> palabras = {"casa", "mesa", "casa"};
map<string, int> frecuencia;
for (const string& palabra : palabras) {
    ++frecuencia[palabra];
}
int veces = frecuencia["casa"]; // 2
int claves = static_cast<int>(frecuencia.size()); // 2
int existe = static_cast<int>(frecuencia.count("casa")); // 1
```

El contador de apariciones es el valor asociado. `count` pregunta si existe esa clave.

### Consultar sin insertar

```cpp
map<string, int> frecuencia = {{"casa", 2}, {"mesa", 1}};
auto it = frecuencia.find("patio");
int veces = (it == frecuencia.end()) ? 0 : it->second;
// veces vale 0 y frecuencia conserva dos claves
```

`it->first` es la clave y `it->second` el valor del par señalado. Leelos cuando `it != m.end()`.

### Guardar una traducción

```cpp
map<string, string> traduccion;
traduccion["casa"] = "house";
traduccion["mesa"] = "table";
string palabra = traduccion["casa"]; // "house"
```

### Recorrer claves y valores

```cpp
map<string, int> frecuencia = {{"mesa", 1}, {"casa", 2}};
for (const auto& [palabra, cantidad] : frecuencia) {
    cout << palabra << ' ' << cantidad << '\n';
}
// Salida en orden de clave: casa 2, luego mesa 1.
```

Buscar, agregar o borrar por clave cuesta O(log n), con n claves. Si usás `m[clave]` para una consulta, contá también su posible efecto sobre el tamaño.
