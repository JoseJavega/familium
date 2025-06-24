# Familium

**Familium** es una aplicación de genealogía personal desarrollada en vanilla JavaScript.<br>
Permite registrar, visualizar y gestionar árboles genealógicos, con almacenamiento local a través de IndexedDB y una interfaz orientada a la claridad y facilidad de uso.

## Funcionalidades principales
- Añadir, editar y eliminar personas
- Asignar relaciones familiares padres-hijos
- Visualización y ordenamiento de la lista total de personas añadidas
- Visualización del árbol genealógico en disposición vertical y horizontal
- Persistencia de datos local usando IndexedDB
- Configuración de idioma, tema y formato de fecha

## Tecnologías utilizadas
- vanilla JavaScript 
- CSS responsive con mediaqueries FLEX y GRID
- IndexedDB para almacenamiento
- Estructura MVC

## Estructura del proyecto

/src <br>
├── assets/ <br>
├── config/ <br>
│ └── config.js <br>
├── css/ <br>
├── js/ <br>
│ ├── controllers/ <br> 
│ ├── db/ <br> 
│ ├── models/ <br>
│ └── views/ <br>
└── index.html <br>

## Configuración inicial
Los ajustes generales se encuentran en `src/config/config.js`, incluyendo:

- Parámetros de conexión para IndexedDB, que pueden adaptarse para su futura conexión a otro medelo de BBDD
- Opciones de visualización (tema, idioma, disposición del árbol, etc)

Una vez iniciada la aplicacion y creados los storages necesarios, la configuración de visualización permanece en indexedDB para poder modificarla según elecciones del usuario

## Estado del desarrollo
Actualmente en desarrollo activo.

## Licencia
Uso personal.
