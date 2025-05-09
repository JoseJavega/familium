export const settings = {
  dbConfig: {
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
      { name: 'settings'},
    ]
  },

  appSettings: {
    theme: 'dark',
    language: 'es',
    dateFormat:'es-ES',
    lastViewedPersonId: null,
    treeLayout: 'vertical',
    generationsToShow: 3
  }
};