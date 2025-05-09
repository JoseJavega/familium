# Familium

**Familium** es una aplicación de genealogía personal desarrollada en JavaScript puro. Permite registrar, visualizar y gestionar árboles genealógicos, con almacenamiento local a través de IndexedDB y una interfaz orientada a la claridad y facilidad de uso.

## Funcionalidades principales
- Añadir, editar y eliminar personas
- Asignar relaciones familiares padres-hijos
- Visualización y ordenamiento de la lista total de personas añadidas
- Visualización del árbol genealógico en disposición vertical y horizontal
- Persistencia de datos local usando IndexedDB
- Configuración de idioma, tema y formato de fecha

## Tecnologías utilizadas
- JavaScript 
- HTML y CSS puro
- IndexedDB para almacenamiento
- Estructura modular basada en controladores y vistas

## Estructura del proyecto

/src <br>
├── css/ <br>
├── assets/ <br>
├── js/ <br>
│ ├── db/ <br> 
│ ├── controllers/ <br> 
│ ├── models/ <br>
│ └── views/ <br>
├── config/ <br>
│ └── config.js <br>
├── app.js # Entrada principal JavaScript <br>
└── index.html <br>

## Configuración inicial
Los ajustes generales se encuentran en `src/config/config.js`, incluyendo:

- Parámetros de conexión para IndexedDB
- Opciones de visualización (tema, idioma, disposición del árbol, etc)

Una vez iniciada la aplicacion y creados los storages necesarios, la configuración de visualización permanece en indexedDB para poder modificarla según elecciones del usuario

## Estado del desarrollo
Actualmente en desarrollo activo.

## Licencia
Uso personal.
