export class PersonModel {
  constructor(db) {
    this.db = db; // Conexión a la base de datos (instancia de Database)
    this.table = 'persons'; // Nombre del objectStore
  }

  async getAll() {
    return this.db.getAll(this.table);
  }

  async getById(id) {
    return this.db.getById(this.table, id);
  }

  async add(data) {
    return this.db.add(this.table, data);
  }

  async update(data) {
    return this.db.update(this.table, data);
  }

  async remove(id) {
    return this.db.remove(this.table, id);
  }

  async removeAll() {
    return this.db.removeAll(this.table);
  }
}