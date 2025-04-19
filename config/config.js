
export const dbConfig = {
  name: 'FamiliumDB',
  version: 1, // solo indexedbd
  //Datos para BBDD general
  user: null,
  password: null,
  host: 'localhost',
  port: null,
  // "tablas" para indexedBD
  objectStores: [
    { name: 'persons', keyPath: 'id', autoIncrement: true },
  ]
};