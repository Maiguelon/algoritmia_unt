---
id: cpp-pila
title: Pila
family: Contenedores
language: cpp
standard: C++17
status: draft
---

# Pila

## Descripción

Una pila, `stack<T>`, permite agregar y quitar elementos por el mismo extremo. El último en entrar es el primero que se retira. Ese orden suele llamarse LIFO.

Usala para conservar pendientes que se atienden del más reciente al más antiguo, como aperturas de paréntesis, pasos que después se deshacen o estados anidados. La interfaz permite consultar solo el elemento superior. Un vector ofrece más acceso a la secuencia cuando también necesitás índices o recorrerla.

`pop()` quita el elemento superior y `top()` permite leerlo. Son dos operaciones separadas. Al retirarlo, el valor que estaba debajo pasa a ser el nuevo superior.

## Funciones y operaciones

| Uso | Resultado o condición |
|---|---|
| `stack<int> s;` | Crea una pila vacía |
| `s.push(x)` | Agrega x arriba |
| `s.top()` | Acceso al superior, con al menos un elemento |
| `s.pop()` | Quita el superior, con al menos un elemento |
| `s.empty()` | Si está vacía |
| `s.size()` | Cantidad de elementos |

## Ejemplos

### Agregar, leer y retirar

```cpp
stack<int> pendientes;
pendientes.push(4);
pendientes.push(7);
int ultimo = pendientes.top(); // 7
pendientes.pop();
int siguiente = pendientes.top(); // 4
```

### Consumir los elementos

```cpp
stack<int> pendientes;
pendientes.push(4);
pendientes.push(7);
while (!pendientes.empty()) {
    int x = pendientes.top();
    pendientes.pop();
    cout << x << ' ';
}
// Salida: 7 4
```

Las operaciones mostradas cuestan O(1) con el contenedor por defecto.
