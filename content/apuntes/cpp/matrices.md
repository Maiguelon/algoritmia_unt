---
id: cpp-matrices
title: Matrices y grillas
family: Contenedores
language: cpp
standard: C++17
status: draft
---

# Matrices y grillas

## Descripción

Una matriz organiza datos por fila y columna. `vector<vector<int>>` permite crear tantas filas y columnas como indique la entrada. Para un tablero de caracteres también sirve `vector<string>`, donde cada string es una fila.

Usalas cuando importa la posición de cada dato en dos dimensiones, como una imagen, un tablero o una tabla de valores. En `a[fila][columna]`, el primer índice selecciona una fila y el segundo una posición dentro de esa fila.

Las filas de un vector de vectores pueden tener tamaños diferentes. Los ejemplos crean una grilla rectangular de n filas y m columnas. Antes de consultar vecinos, comprobá los dos índices. Usá tipos con signo para poder representar desplazamientos como -1.

## Funciones y operaciones

| Uso | Resultado o efecto |
|---|---|
| `vector<vector<int>> a(n, vector<int>(m, 0))` | Crea n filas de m ceros |
| `a[f][c]` | Acceso al dato de fila f y columna c |
| `a.size()` | Cantidad de filas |
| `a[f].size()` | Cantidad de columnas de esa fila |
| `vector<string> g(n)` | Crea n strings para cargar las filas de un tablero |
| `0 <= f && f < n && 0 <= c && c < m` | Comprueba que una casilla rectangular exista |

## Ejemplos

### Crear y cargar números

```cpp
int n, m;
cin >> n >> m;
vector<vector<int>> a(n, vector<int>(m, 0));
for (int f = 0; f < n; ++f) {
    for (int c = 0; c < m; ++c) {
        cin >> a[f][c];
    }
}
```

### Cargar filas de caracteres

```cpp
int n, m;
cin >> n >> m;
vector<string> grilla(n);
for (int f = 0; f < n; ++f) cin >> grilla[f];
// El enunciado debe garantizar m caracteres por fila.
```

### Consultar los cuatro vecinos

```cpp
vector<string> grilla = {"...", ".#.", "..."};
int n = 3, m = 3;
int fila = 1, columna = 1;
int df[] = {-1, 1, 0, 0};
int dc[] = {0, 0, -1, 1};
int libres = 0;
for (int d = 0; d < 4; ++d) {
    int f = fila + df[d];
    int c = columna + dc[d];
    if (f >= 0 && f < n && c >= 0 && c < m && grilla[f][c] == '.') {
        ++libres;
    }
}
// libres vale 4
```

Una matriz de enteros de 32 bits usa aproximadamente `4 * n * m` bytes para sus datos. Calculá el producto con un tipo amplio antes de decidir el tamaño.
