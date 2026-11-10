---
id: cpp-conversiones
title: Caracteres y conversiones
family: Texto
language: cpp
standard: C++17
status: draft
---

# Caracteres y conversiones

## Descripción

Un carácter como `'7'` y el entero `7` representan cosas diferentes. Las conversiones permiten pasar del texto a un valor con el que calcular, o construir el texto que después vas a imprimir.

Usá restas de caracteres para un dígito decimal garantizado o para índices de alfabetos consecutivos como las letras inglesas de estos ejemplos. `stoi` y `stoll` convierten un texto con un entero. `to_string` produce un string a partir de un valor numérico.

Las funciones de `<cctype>` permiten consultar si un carácter es dígito o convertir mayúsculas y minúsculas. Reciben un valor representable como `unsigned char` o el fin de archivo. Para un `char` leído de texto, convertirlo a `unsigned char` antes de llamar evita valores negativos fuera de su contrato.

## Funciones y operaciones

| Uso | Parámetros o condición | Resultado |
|---|---|---|
| `c - '0'` | Dígito de `'0'` a `'9'` | Entero de 0 a 9 |
| `static_cast<char>('0' + d)` | Entero de 0 a 9 | Su carácter decimal |
| `c - 'a'` | Letra inglesa minúscula | Índice de 0 a 25 en los entornos habituales del juez |
| `stoi(s)` | Prefijo entero representable | Valor como `int` |
| `stoll(s)` | Prefijo entero representable | Valor como `long long` |
| `to_string(x)` | Entero | String con sus dígitos |
| `isdigit(c)` | Carácter válido para `<cctype>` | Valor distinto de cero si es un dígito |
| `tolower(c)` / `toupper(c)` | Carácter válido para `<cctype>` | Código convertido como `int`, según la configuración de caracteres |

## Ejemplos

### Dígitos y posiciones de letras

```cpp
char digito = '7';
int valor = digito - '0'; // 7
char nuevo = static_cast<char>('0' + 3); // '3'
int indice = 'c' - 'a'; // 2
```

### Convertir enteros

```cpp
int cantidad = stoi("125");
long long costo = stoll("123456789012");
string texto = to_string(costo); // "123456789012"
```

Si la entrada garantiza un entero válido, elegí el tipo por su rango. Una conversión con texto inválido o un valor demasiado grande da error. Un prefijo numérico válido puede bastar, como `125` en `"125abc"`.

### Saber cuánto texto se consumió

```cpp
string texto = "125abc";
size_t leidos = 0;
int valor = stoi(texto, &leidos);
bool completo = (leidos == texto.size()); // false
// valor vale 125 y leidos vale 3
```

`&leidos` pasa la dirección de la variable donde la función guarda el final de la conversión.

### Consultar y cambiar un carácter

```cpp
char letra = 'A';
unsigned char segura = static_cast<unsigned char>(letra);
char minuscula = static_cast<char>(tolower(segura)); // 'a'
bool esDigito = (isdigit(segura) != 0); // false
```

Estas operaciones trabajan sobre caracteres individuales. Para transformar un string, recorré sus caracteres y aplicá la operación a cada uno.
