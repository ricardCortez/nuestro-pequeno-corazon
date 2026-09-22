# Nuestro pequeño corazón

Página conmemorativa estática de los primeros latidos, publicada con GitHub Pages.

## Contenido

- Ecografía anonimizada (el original no forma parte del repositorio).
- Audio real de 7,06 segundos almacenado dentro del sitio.
- Onda real generada con Web Audio API y dibujada con Canvas.
- Controles accesibles para reproducir, pausar y escuchar nuevamente.
- Códigos QR en PNG y SVG que apuntan a la URL pública definitiva.

## Privacidad

La copia publicada elimina el nombre de la paciente, el número administrativo y la hora exacta. No se alteraron el bebé, el saco gestacional, las mediciones ni las estructuras médicas visibles.

## Uso local

Por las restricciones de carga de audio del navegador, sirve la carpeta por HTTP. Por ejemplo:

```sh
python -m http.server 8000
```

Luego abre `http://localhost:8000`.
