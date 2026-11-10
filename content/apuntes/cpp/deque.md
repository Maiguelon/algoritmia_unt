---
id: cpp-deque
title: Deque
family: Contenedores
language: cpp
standard: C++17
status: draft
---

# Deque

## Descripción

Una `deque<T>` es una secuencia a la que podés agregar o quitar elementos por ambos extremos. También permite consultar por índice, conservar repetidos y recorrer los datos en orden.

Usala cuando una simulación cambia el principio y el final con frecuencia. En un vector, quitar el primer elemento desplaza los restantes. En una deque, las operaciones de extremos tienen tiempo constante. Un vector sigue siendo práctico cuando el trabajo se concentra en índices y en agregar al final.

La palabra deque viene de cola de doble extremo. Una `queue` ofrece la interfaz de atender en orden de llegada y una `stack` la de atender lo más reciente. La deque expone directamente ambos extremos.

## Funciones y operaciones

| Uso | Resultado o condición |
|---|---|
| `deque<int> d;` | Crea una deque vacía |
| `d.push_front(x)` / `d.push_back(x)` | Agrega x al principio / final |
| `d.pop_front()` / `d.pop_back()` | Quita por el principio / final, con elementos |
| `d.front()` / `d.back()` | Acceso al primero / último, con elementos |
| `d[i]` | Acceso al índice válido i |
| `d.size()` / `d.empty()` | Cantidad / si está vacía |
| `d.clear()` | Quita todos los elementos |

## Ejemplos

### Editar ambos extremos

```cpp
deque<int> datos = {4, 7};
datos.push_front(2); // {2, 4, 7}
datos.push_back(9);  // {2, 4, 7, 9}
datos.pop_front();   // {4, 7, 9}
datos.pop_back();    // {4, 7}
int segundo = datos[1]; // 7
```

### Recorrer

```cpp
deque<int> datos = {4, 7, 9};
for (int x : datos) cout << x << ' ';
// Salida: 4 7 9
```

Leer por índice y operar en los extremos cuesta O(1). Al modificar la deque pueden invalidarse iteradores guardados. Volvé a obtenerlos después de una edición cuando necesites seguir recorriendo.
