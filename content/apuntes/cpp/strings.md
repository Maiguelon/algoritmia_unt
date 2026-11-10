---
id: cpp-strings
title: Strings
family: Texto
language: cpp
standard: C++17
status: draft
---

# Strings

## Descripción

Un `string` guarda una secuencia de caracteres `char`. Sus posiciones empiezan en cero. En `"CASA"`, `s[0]` es `'C'` y `s[3]` es `'A'`.

Las comillas simples representan un carácter, como `'A'`. Las dobles representan texto, como `"CASA"`. Al copiar un string, podés modificar la copia sin cambiar el original.

Usalo para palabras, líneas, códigos y datos que necesitás examinar o modificar como texto. También permite conservar los dígitos de un número muy grande o los ceros iniciales de un identificador. En las entradas habituales de letras y dígitos, podés recorrerlo carácter por carácter, buscar un fragmento o construir una respuesta agregando texto.

Un string conserva el orden y las repeticiones. En `"CASA"` importan las dos apariciones de `'A'` y sus posiciones. Si querés guardar varias palabras, un `vector<string>` conserva esa lista. Un `set<string>` guarda las palabras distintas y las ordena, mientras un `map<string, int>` permite asociar un contador a cada palabra.

`size()` cuenta elementos `char`. Un carácter acentuado o un emoji codificado en UTF-8 puede ocupar varios. Los ejemplos de índices y alfabetos de esta ficha usan letras y dígitos de un solo byte, como los garantizados por muchos enunciados.

## Funciones y operaciones

En la tabla, `s` es un string, `t` es otro texto, `c` es un carácter y `n` es una cantidad. `pos` y `desde` son índices. `cant` indica cuántos caracteres usar.

| Uso | Parámetros | Resultado o efecto | Modifica `s` |
|---|---|---|---|
| `string s;` | Ninguno | Crea un string vacío | Lo crea |
| `string s(n, c);` | Cantidad y carácter | Crea `n` copias de `c` | Lo crea |
| `cin >> s` | String donde guardar | Lee una palabra, separada por espacios o saltos de línea | Sí |
| `getline(cin, s)` | Entrada y string donde guardar | Lee una línea y descarta el salto de línea | Sí |
| `s.size()` | Ninguno | Cantidad de caracteres | No |
| `s.empty()` | Ninguno | `true` si está vacío | No |
| `s[i]` | Índice `0 <= i < s.size()` | Permite leer o cambiar el carácter de esa posición | Si asignás |
| `s.front()` / `s.back()` | String con elementos | Acceso al primer / último carácter | Si asignás |
| `s == t` / `s != t` | Otro texto | Si los textos son iguales / diferentes | No |
| `s += t` / `s += c` | Texto o carácter | Lo agrega al final | Sí |
| `s.push_back(c)` | Un carácter | Lo agrega al final | Sí |
| `s.pop_back()` | String con elementos | Quita el último carácter | Sí |
| `s.find(x, desde)` | Carácter o texto, inicio inclusivo | Índice de la primera aparición desde ahí, o `string::npos`. `desde` vale 0 si se omite | No |
| `s.substr(pos, cant)` | Inicio y cantidad | Nuevo string con ese fragmento. Sin `cant`, copia hasta el final | No |
| `s.erase(pos, cant)` | Inicio y cantidad | Borra ese tramo. Sin `cant`, borra hasta el final. Devuelve el propio string | Sí |
| `s.insert(pos, t)` | Posición y texto | Inserta `t` antes de esa posición. Devuelve el propio string | Sí |
| `s.replace(pos, cant, t)` | Inicio, cantidad a quitar y texto nuevo | Reemplaza ese tramo por `t`. Devuelve el propio string | Sí |
| `s.clear()` | Ninguno | Deja el string vacío | Sí |
| `count(s.begin(), s.end(), c)` | Rango completo y carácter | Cantidad de apariciones de `c` | No |
| `stoi(s)` / `stoll(s)` | Texto que empieza con un entero representable | Devuelve ese entero como `int` / `long long` | No |
| `to_string(x)` | Un entero | Devuelve su representación como string | No |

En `count`, `begin()` señala el primer carácter y `end()` el límite posterior al último. La llamada recorre todo el texto.

## Ejemplos

### Crear, leer y acceder

```cpp
string palabra = "CASA";
string marcas(4, 'X'); // "XXXX"
int n = static_cast<int>(palabra.size()); // 4

char primera = palabra[0]; // 'C'
palabra[1] = 'O';          // palabra queda "COSA"
```

`size()` devuelve un tipo sin signo. Si el largo cabe en `int`, guardarlo como en el ejemplo facilita las cuentas con índices y las restas.

```cpp
string palabra;
cin >> palabra; // Lee hasta el siguiente espacio o salto de línea
```

```cpp
int cantidad;
cin >> cantidad;
cin.ignore(numeric_limits<streamsize>::max(), '\n');

string linea;
getline(cin, linea); // Lee la línea siguiente, incluidos sus espacios
```

El `ignore` descarta lo que queda de la línea de `cantidad`. Cuando empezás directamente con `getline`, podés llamar a `getline(cin, linea)` sin ese paso previo.

### Consultar extremos y comparar

```cpp
string s = "CASA";
char primera = s.front(); // 'C'
char ultima = s.back();   // 'A'

bool igual = (s == "CASA");     // true
bool diferente = (s != "casa"); // true
```

La comparación distingue mayúsculas de minúsculas. `front()` y `back()` requieren al menos un carácter.

### Agregar y quitar al final

```cpp
string s = "CA";
s += "SA";        // "CASA"
s.push_back('!'); // "CASA!"
s.pop_back();     // "CASA"
```

`pop_back()` requiere un string con elementos. Para vaciarlo por completo, usá `s.clear()`.

### Buscar texto o un carácter

```cpp
string s = "BANANA";
auto primera = s.find("ANA");      // 1
auto siguiente = s.find("ANA", 2); // 3
auto ausente = s.find('Z');        // string::npos

bool tieneAna = (primera != string::npos); // true
```

`auto` deja que el compilador deduzca el tipo. `string::npos` significa que la búsqueda no encontró una aparición. Una coincidencia en la posición 0 es válida, así que la comprobación de presencia es `pos != string::npos`.

### Extraer una parte

```cpp
string s = "ABCDE";
string parte = s.substr(1, 2); // "BC"
string sufijo = s.substr(3);   // "DE"
string corta = s.substr(3, 9); // "DE"
```

La cantidad se recorta a lo disponible. Empezar en `s.size()` devuelve un string vacío. Empezar más allá produce un error. `s` conserva su contenido.

### Borrar sobre una copia

```cpp
string original = "ABCDE";
string copia = original;
copia.erase(1, 2); // copia queda "ADE"
                  // original conserva "ABCDE"
```

El segundo argumento es una cantidad. Para borrar hasta el final, usá `copia.erase(1)`. La posición puede llegar hasta `size()`. Después de editar, las posiciones de los caracteres posteriores pueden cambiar.

### Insertar y reemplazar

```cpp
string s = "CASA";
s.insert(2, "MI");    // "CAMISA"
s.replace(2, 2, "R"); // "CARSA"
```

`replace` quita dos caracteres desde la posición 2 y pone `"R"` en su lugar. El largo del texto nuevo puede ser distinto de la cantidad borrada. En ambas operaciones, `pos` debe estar entre 0 y `size()`.

### Contar un carácter

```cpp
string s = "BANANA";
int cantidad = count(s.begin(), s.end(), 'A'); // 3
```

La llamada cuenta caracteres iguales a `'A'`. Para buscar el texto `"ANA"`, usá `find`.

### Convertir entre texto y enteros

```cpp
int chico = stoi("125");                    // 125
long long grande = stoll("123456789012");   // 123456789012
string texto = to_string(grande);           // "123456789012"
```

`stoi` y `stoll` pueden convertir un prefijo válido, como el `125` de `"125abc"`. Dan error si no encuentran un entero inicial o si el resultado excede su tipo. En una entrada que garantiza un entero válido, elegí la función según el rango del valor.

Referencia técnica de C++17: [strings, borrador N4659](https://timsong-cpp.github.io/cppwp/n4659/basic.string).
