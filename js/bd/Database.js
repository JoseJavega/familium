import { dbConfig } from "../../config/config.js";

export class Database {
  constructor() {
    // general
    this.name = dbConfig.name;
    this.host = dbConfig.host;
    this.port = dbConfig.port;
    this.user = dbConfig.user;
    this.password = dbConfig.password;
    // indexedBD
    this.version = dbConfig.version;
    this.objectStores = dbConfig.objectStores;
  }

  // Conexion para indexedBD
  async open() {
    this.isOponening = true // marcamos que estamos abriendo la conexion

    return new Promise((resolve, reject) => {
      this.conection = indexedDB.open(this.name, this.version);

      // Evento que se dispara si la base de datos se abre correctamente
      this.conection.onsuccess = (event) => {
        this.db = event.target.result; // Almacena la referencia a la base de datos
        this.isOpening = false;  // Ya no estamos abriendo
        resolve();  // Resolvemos la promesa cuando se abre correctamente
      };

      // Evento que se dispara si hay un error al abrir la base de datos
      this.conection.onerror = (event) => {
        console.error("Error al conectar con la base de datos", event.target.error);
        this.isOpening = false;  // Ya no estamos abriendo
        reject(event.target.error); // Rechazamos la promesa si ocurre un error
      };

      // Evento que se dispara si la base de datos necesita ser actualizada
      this.conection.onupgradeneeded = (event) => {
        this.db = event.target.result;
        const storeNames = this.db.objectStoreNames;

        // Crear los object stores si no existen
        this.objectStores.forEach(({ name, keyPath, autoIncrement }) => {
          if (!storeNames.contains(name)) {
            this.db.createObjectStore(name, { keyPath, autoIncrement });
            console.log(`Object store ${name} creado.`);
          }
        });
      };
    });
  };

  // cierre de la conexión
  async close() {
    if (this.isOpening) {
      console.log("Esperando a que la base de datos se abra...");
      await new Promise(resolve => {
        const interval = setInterval(() => {
          if (!this.isOpening) {
            clearInterval(interval);
            resolve();
          }
        }, 100);  // Comprobar cada 100 ms si la base de datos ha sido abierta
      });
    }
    // Ahora que estamos seguros de que la conexión está abierta, podemos cerrarla
    if (this.db) {
      this.db.close();
      this.db = null; // Limpiar la referencia
      this.conection = null; // Limpiar la conexión
    } else {
      console.error("No hay ninguna conexión de BBDD abierta para poder cerrarla.");
    }
  };

  // wrapper de la conexion
  _withConnection(callback) {
    if (!this.isConnected()) {
      console.error("No hay conexión a la base de datos.");
      return;
    };
    callback();
  };

  // Verificar si la conexion está abierta
  isConnected() {
    return this.db !== null;
  }

  // METODOS
  add(table, data) {
    this._withConnection(() => {
      const tx = this.db.transaction(table, "readwrite");
      const store = tx.objectStore(table);
      const request = store.add(data);

      request.onsuccess = () => console.log("Elemento añadido.");
      request.onerror = (e) => console.error("Error al añadir:", e.target.error);
    });
  };

  getAll(table) {
    return new Promise((resolve, reject) => {
      this._withConnection(() => {
        const tx = this.db.transaction(table, "readonly");
        const store = tx.objectStore(table);
        const request = store.getAll();

        request.onsuccess = (event) => {
          resolve(event.target.result); // Devolvemos los datos cuando la consulta sea exitosa
        };

        request.onerror = (e) => {
          console.error("Error al obtener los datos", e.target.error);
          reject(e.target.error); // Rechazamos la promesa si ocurre un error
        };
      });
    });
  };

  getById(table, id) {
    return new Promise((resolve, reject) => {
      this._withConnection(() => {
        const tx = this.db.transaction(table, "readonly");
        const store = tx.objectStore(table);
        const request = store.get(id);

        request.onsuccess = (event) => {
          resolve(event.target.result); // Devolvemos los datos cuando la consulta sea exitosa
        };

        request.onerror = (e) => {
          console.error("Error al obtener los datos", e.target.error);
          reject(e.target.error); // Rechazamos la promesa si ocurre un error
        };
      });
    });
  };

  update(table, data) {
    //como el metodo put() de indezed, en caso de no existir añade, controlamos que solo actualice si existe
    //const result = await this.db.getById(table, data.id);

    return new Promise((resolve, reject) => {
      this._withConnection(() => {
        const tx = this.db.transaction(table, "readwrite");
        const store = tx.objectStore(table);
        const request = store.update(data);

        request.onsuccess = (event) => {
          resolve(event.target.result); // Devolvemos los datos cuando la consulta sea exitosa
        };

        request.onerror = (e) => {
          console.error("Error al actualizar los datos", e.target.error);
          reject(e.target.error); // Rechazamos la promesa si ocurre un error
        };
      });
    });
  };

  remove(table, id) { };

};
