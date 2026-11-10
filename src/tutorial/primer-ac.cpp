#include <iostream>
using namespace std;

int main() {
    int horas, minutos, segundos;
    cin >> horas >> minutos >> segundos;

    int transcurrido = horas * 3600 + minutos * 60 + segundos;
    int mitad = 5 * 3600 / 2;

    if (transcurrido < mitad) {
        cout << '-' << '\n';
    } else if (transcurrido > mitad) {
        cout << '+' << '\n';
    } else {
        cout << '=' << '\n';
    }

    return 0;
}
