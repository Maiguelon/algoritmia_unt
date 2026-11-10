---
id: cpp-cola
title: Cola
family: Contenedores
language: cpp
standard: C++17
status: draft
---

# Cola

## Descripción

Una cola, `queue<T>`, agrega elementos por el final y los retira por el principio. El primero en entrar es el primero en salir. Ese orden suele llamarse FIFO.

Usala para turnos, tareas pendientes o simulaciones donde se atiende por orden de llegada. Una pila atiende primero lo más reciente. Una cola conserva la prioridad del que llegó antes.

`front()` lee el primero y `pop()` lo retira. `back()` consulta el último agregado. Si además necesitás editar ambos extremos o acceder por índice, una `deque` ofrece esas operaciones.

## Funciones y operaciones

| Uso | Resultado o condición |
|---|---|
| `queue<int> q;` | Crea una cola vacía |
| `q.push(x)` | Agrega x al final |
| `q.front()` / `q.back()` | Acceso al primero / último, con elementos |
| `q.pop()` | Quita el primero, con elementos |
| `q.empty()` | Si está vacía |
| `q.size()` | Cantidad de elementos |

## Ejemplos

### Agregar, consultar y atender

```cpp
queue<int> turnos;
turnos.push(4);
turnos.push(7);
int primero = turnos.front(); // 4
int ultimo = turnos.back();   // 7
turnos.pop();
int siguiente = turnos.front(); // 7
```

### Consumir los elementos

```cpp
queue<int> turnos;
turnos.push(4);
turnos.push(7);
while (!turnos.empty()) {
    int x = turnos.front();
    turnos.pop();
    cout << x << ' ';
}
// Salida: 4 7
```

Las operaciones mostradas cuestan O(1) con el contenedor por defecto.
