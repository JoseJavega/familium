
export class Database {
  constructor(dbConfig) {
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
    };
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
  #withConnection(callback) {
    if (!this.isConnected()) {
      console.error("No hay conexión a la base de datos.");
      return false;
    };
    callback();
    return true;
  };

  // Verificar si la conexion está abierta
  isConnected() {
    return this.db !== null;
  }

  // METODOS
  add(table, data) {
    return new Promise((resolve, reject) => {
      this.#withConnection(() => {
        const tx = this.db.transaction(table, "readwrite");
        const store = tx.objectStore(table);
        const request = store.add(data);

        request.onsuccess = () => resolve(request.result); // Devuelve el ID asignado
        request.onerror = (e) => reject(e.target.error);
      });
    });
  };

  getAll(table) {
    return new Promise((resolve, reject) => {
      this.#withConnection(() => {
        const tx = this.db.transaction(table, "readonly");
        const store = tx.objectStore(table);
        const request = store.getAll();

        request.onsuccess = () => resolve(request.result); // Devolvemos los datos cuando la consulta sea exitosa
        request.onerror = (e) => reject(e.target.error); // Rechazamos la promesa si ocurre un error
      });
    });
  };

  getById(table, id) {
    return new Promise((resolve, reject) => {
      this.#withConnection(() => {
        const tx = this.db.transaction(table, "readonly");
        const store = tx.objectStore(table);
        const request = store.get(id);

        request.onsuccess = (e) => {
          resolve(e.target.result); // Devolvemos los datos cuando la consulta sea exitosa
        };
        request.onerror = (e) => {
          console.error("Error al obtener los datos - ", e.target.error);
          reject(e.target.error); // Rechazamos la promesa si ocurre un error
        };
      });
    });
  };

  update(table, data) {
    return new Promise((resolve, reject) => {
      this.#withConnection(() => {
        const tx = this.db.transaction(table, "readwrite");
        const store = tx.objectStore(table);
        const request = store.put(data);

        request.onsuccess = (e) => {
          resolve(e.target.result); // Devolvemos los datos cuando la consulta sea exitosa
        };
        request.onerror = (e) => {
          console.error("Error al actualizar los datos - ", e.target.error);
          reject(e.target.error); // Rechazamos la promesa si ocurre un error
        };
      });
    });
  };

  remove(table, id) {
    return new Promise((resolve, reject) => {
      const connected = this.#withConnection(() => {
        try {
          const tx = this.db.transaction(table, "readwrite");
          const store = tx.objectStore(table);
          const request = store.delete(id);

          request.onsuccess = () => resolve();
          request.onerror = (e) => reject(e.target.error);
        } catch (err) {
          reject(err);
        }
      });

      if (!connected) {
        reject(new Error("No hay conexión a la base de datos."));
      }
    });
  }

  removeAll(table) {
    return new Promise((resolve, reject) => {
      this.#withConnection(() => {
        const tx = this.db.transaction(table, "readwrite");
        const store = tx.objectStore(table);
        const request = store.clear();

        request.onsuccess = (e) => {
          resolve(e.target.result);
        };
        reject.onerror = (e) => {
          console.error(`Error al eliminar todos los datos de la tabla ${table} - `, e.target.error);
          reject(e.target.error);
        };
      });
    });
  };
};

