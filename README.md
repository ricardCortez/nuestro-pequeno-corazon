# Nuestro pequeño corazón

Álbum conmemorativo estático de los primeros recuerdos, publicado con GitHub Pages y preparado para crecer con nuevas fotos, sonidos y momentos.

## Contenido

- Ecografía anonimizada (el original no forma parte del repositorio).
- Segunda ecografía de la semana 8, recortada y mejorada de forma conservadora para preservar el contenido médico original.
- Audio real de 7,06 segundos almacenado dentro del sitio.
- Onda real generada con Web Audio API y dibujada con Canvas.
- Controles accesibles para reproducir, pausar y escuchar nuevamente.
- Códigos QR en PNG y SVG que apuntan a la URL pública definitiva.

## Estructura del álbum

Cada recuerdo vive dentro de la línea de tiempo con su fecha, etapa, imagen, texto y, cuando corresponde, audio. Para ampliar el álbum se añade una nueva entrada `memory-entry` siguiendo el mismo patrón, sin modificar los recuerdos anteriores.

## Privacidad

La copia publicada elimina el nombre de la paciente, el número administrativo y la hora exacta. No se alteraron el bebé, el saco gestacional, las mediciones ni las estructuras médicas visibles.

## Uso local

Por las restricciones de carga de audio del navegador, sirve la carpeta por HTTP. Por ejemplo:

```sh
python -m http.server 8000
```

Luego abre `http://localhost:8000`.
