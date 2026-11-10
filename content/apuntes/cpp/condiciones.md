---
id: cpp-condiciones
title: Condiciones y decisiones
family: Apoyo básico
language: cpp
standard: C++17
status: draft
---

# Condiciones y decisiones

## Descripción

Una condición es una expresión que se interpreta como verdadera o falsa. Permite elegir qué instrucciones ejecutar según los datos. Podés guardarla en una variable `bool` cuando darle un nombre aclara qué estás preguntando.

Una cadena de `if`, `else if` y `else` elige un único camino. Varios `if` independientes permiten hacer más de una actualización. Elegí según si las acciones pueden cumplirse a la vez.

`&&` y `||` evalúan de izquierda a derecha y pueden terminar antes de evaluar lo que sigue. Ese comportamiento sirve para consultar un índice o un iterador recién después de comprobar que es válido.

## Funciones y operaciones

| Uso | Significado |
|---|---|
| `a == b` / `a != b` | Igualdad / diferencia |
| `a < b`, `a <= b`, `a > b`, `a >= b` | Comparaciones de orden |
| `a && b` | Ambas condiciones verdaderas |
| `a || b` | Al menos una condición verdadera |
| `!a` | Invierte el valor lógico |
| `if (condicion) { ... }` | Ejecuta el bloque si se cumple |
| `else if (...)` / `else` | Otros caminos de la misma decisión |
| `condicion ? valorA : valorB` | Elige una de dos expresiones |

## Ejemplos

### Elegir un camino

```cpp
int a = 7, b = 4;
string resultado;
if (a < b) {
    resultado = "MENOR";
} else if (a == b) {
    resultado = "IGUAL";
} else {
    resultado = "MAYOR";
}
// resultado queda "MAYOR"
```

### Consultar límites antes de acceder

```cpp
string s = "TAP";
int i = 1;
int n = static_cast<int>(s.size());
bool iguales = i >= 0 && i + 1 < n && s[i] == s[i + 1];
// iguales vale false
```

Si los índices quedan fuera, el último término no se evalúa. Para expresar que `x` está entre `l` y `r`, escribí `l <= x && x <= r`.

### Dos actualizaciones independientes

```cpp
int menor = 5, mayor = 5;
int x = 2;
if (x < menor) menor = x;
if (x > mayor) mayor = x;
// menor vale 2 y mayor vale 5
```

### Elegir un valor con ternario

```cpp
int n = 8;
char respuesta = (n % 2 == 0) ? 'S' : 'N'; // 'S'
```
