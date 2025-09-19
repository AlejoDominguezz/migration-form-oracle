# Decision Log

## Criterios para resolver la prueba

Analicé el schema.automotor.sql de input que fue entregado. Dado que contaba con la BD, realicé un database first utilizando el paquete de typeorm-model-generator. Generé un contenedor para levantar el schema y los seeders al levantar docker-compose. Creé manualmente la view que estaba representada en el schema (ya que no se migró automáticamente) y la utilicé para realizar filtrados y getters. Las reglas de negocio y validaciones las discriminé desde el form XML. Se crearon funciones privadas para ellos.

Lo primero en realizar fue el Backend, para servir al Cliente los endpoints necesarios y requeridos en el notion. Utilicé transacciones en cada lugar que entendí que era necesario. Luego encaré el frontend en donde el objetivo fue que sea funcional y no tan bonito, lo estilé de manera mínima, utilizando la libreria de prime ng y prime flex, solo lo necesario (no soy frontend), pero me doy maña jeje.

En ambos casos (frontend y backend) lo hice modular, entendiendo un módulo automotor y otro módulo sujeto, creando los servicios y desacoplando los módulos lo más que se pueda pero buscando cohesión en las clases.

Para dar de alta un sujeto que no existia, la estrategia que tome fue abrir un modal y crearlo. Tambien agregar un boton para buscar el cuil, si no lo encuentra entonces permite crear, y si lo encuentra autocompleta la denominacion del sujeto.
Por regla de negocio al crear o actualizar un automotor se desvincula al objeto valor y se vincula al nuevo, para el caso de eliminacion se genera la eliminacion en cascada (dada la restriccion que ya existia en las tablas del schema).