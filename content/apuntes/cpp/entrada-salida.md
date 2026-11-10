---
id: cpp-entrada-salida
title: Entrada y salida
family: Apoyo básico
language: cpp
standard: C++17
status: draft
---

# Entrada y salida

## Descripción

`cin` lee los datos de la entrada estándar y `cout` escribe en la salida estándar. El enunciado define el orden y el tipo de cada dato. Los espacios y saltos de línea separan los datos que leés con `>>`.

Usá `cin >> texto` para una palabra y `getline` para una línea que puede tener espacios. Al pasar de una lectura con `>>` a una línea siguiente, hay que consumir el final de línea pendiente. Si la entrada termina al llegar al fin del archivo, la propia lectura puede controlar el ciclo.

La salida debe respetar el formato pedido, incluidos espacios, saltos de línea y mayúsculas. `\n` escribe un salto de línea. En la consola local puede ser necesario cerrar la entrada para indicar que llegó el fin del archivo.

## Funciones y operaciones

| Uso | Parámetros | Resultado o efecto |
|---|---|---|
| `cin >> a >> b` | Variables donde guardar | Lee los dos datos en ese orden |
| `getline(cin, linea)` | Flujo y string de destino | Lee hasta el salto de línea, lo consume y guarda el texto anterior |
| `cin.ignore(numeric_limits<streamsize>::max(), '\n')` | Máximo a descartar y separador | Descarta hasta el próximo salto de línea, incluido |
| `cout << valor` | Dato a imprimir | Escribe su representación |
| `cout << '\n'` | Carácter de salto de línea | Termina la línea actual |
| `while (cin >> x)` | Lectura que controla el ciclo | Repite mientras se puede leer otro valor |

## Ejemplos

### Leer números y una palabra

```cpp
int n;
long long costo;
string palabra;
cin >> n >> costo >> palabra;
```

### Leer una línea después de un número

```cpp
int n;
cin >> n;
cin.ignore(numeric_limits<streamsize>::max(), '\n');
string linea;
getline(cin, linea);
```

Este formato supone que la línea que buscás empieza después de la de `n`. Para leer una línea desde el inicio de la entrada, usá directamente `getline(cin, linea)`.

### Procesar una cantidad de casos

```cpp
int casos;
cin >> casos;
for (int caso = 0; caso < casos; ++caso) {
    int a, b;
    cin >> a >> b;
    cout << a + b << '\n';
}
```

### Leer hasta fin de archivo

```cpp
long long x;
long long suma = 0;
while (cin >> x) {
    suma += x;
}
cout << suma << '\n';
```

### Separar una secuencia con espacios

```cpp
vector<int> respuesta = {2, 5, 7};
for (int i = 0; i < static_cast<int>(respuesta.size()); ++i) {
    if (i > 0) cout << ' ';
    cout << respuesta[i];
}
cout << '\n';
// Salida: 2 5 7
```
