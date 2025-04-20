## Descripción 

Familium es una aplicación web para la gestión de los datos de las personas y relaciones que conforman un árbol genealógico.<br>
Está pensado para usarse de forma personal y poder alojarse en un servidor web simple ya que no utiliza backend, usando como espacio de almacenamiento la BBDD del navegador indexedDB. 

Se crea como ejercicio de estudio de desarrollo web, en vanilla Javascript y haciendo una aproximación al modelo MVC.<br>
Desde el inicio se ha tratado de manejar una lógica de diseño que pudiera facilitar la escalabilidad y la migración del proyecto al uso de una base de datos relacional y su transformacion en una aplicación con uso de backend.

Implementa la clase Database.js con el código necesario para el manejo de los principales eventos de una BBDD, en este caso enfocado en indexedDB, de forma que la lógica de los controladores quede fuera del acceso a datos y podewr así migrar a otros formatos de almacenamiento.



