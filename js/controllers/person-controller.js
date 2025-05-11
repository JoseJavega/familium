import { Database } from "../db/Database.js";
import { PersonView } from "../views/PersonView.js";
import { PersonModel} from "../models/PersonModel.js";
import { settings } from '../../config/config.js'; 

const formSection = document.getElementById('sect-form-person');
const tableSection = document.getElementById('sect-allPersons');
const treeSection = document.getElementById('sect-tree');
const personSection = document.getElementById('sect-currentPerson');
//-----------------------------------------------------------
// BOTON TEMPORAL PARA ABRIR EL FORMULARIO Y AÑADIR MAS GENTE
//-----------------------------------------------------------
const btnOpenForm = document.getElementById('btnOpenForm');

const currentPerson = {
  gender: "male",
  name: "Probando",
  surname1: "Nombre",
  surname2: "Falso",
  dateBirth: null,
  placeBirth: "Nueva Yol",
  dateDeath: null,
  placeDeath: "Marte",
  fatherId: 31,
  motherId: null,
  brothersId: [],
};

function validateForm() {
  const inputs = formSection.querySelectorAll('input');
  // Recorremos los inputs para ver si alguno tiene valor
  let isValid = false;
  inputs.forEach(input => {
    if (input.value.trim() !== "") {
      isValid = true; // Si encontramos un input con datos devolvemos true
    }
  });
  return isValid;
};

function getFormData() {
  currentPerson.gender= formSection.querySelector('input[name="newPerson-gender"]:checked').value || null;
  currentPerson.name = formSection.querySelector('#newPerson-name').value || null;
  currentPerson.surname1 = formSection.querySelector('#newPerson-surname1').value || null;
  currentPerson.surname2 = formSection.querySelector('#newPerson-surname2').value || null;
  currentPerson.placeBirth = formSection.querySelector('#newPerson-placeBirth').value || null;
  currentPerson.placeDeath = formSection.querySelector('#newPerson-placeDeath').value || null;
  //las fechas se pasan a formato estandar para almacenarlas
  currentPerson.dateBirth = formSection.querySelector('#newPerson-dateBirth').value?
                            new Date(formSection.querySelector('#newPerson-dateBirth').value).toISOString(): null;

  currentPerson.dateDeath = formSection.querySelector('#newPerson-dateDeath').value?
                            new Date(formSection.querySelector('#newPerson-dateDeath').value).toISOString(): null;
}

// funcion auxiliar para reutilizar el codigo de crear el personModel
async function createPersonModel() {
  const db = new Database(settings.dbConfig);
  await db.open();
  const model = new PersonModel(db);
  return { model, db };
}

async function personView(error) {
  tableSection.innerHTML = "";
  treeSection.innerHTML = "";
  personSection.innerHTML = "";

  const { model, db } = await createPersonModel();
  const allPersons = await model.getAll();
  await db.close();

  const personView = new PersonView();
  const isDesktop = window.matchMedia("(min-width: 768px)").matches;

  if (allPersons.length > 0) {
    personView.renderCurrentPerson(currentPerson, settings.appSettings.dateFormat);
    if (isDesktop) {
      personView.renderPersonTable(allPersons);
    } else {
      personView.renderPersonList(allPersons);
    }
  } else {
    personView.renderInitialForm(error);
  }
};

async function handleAddPerson() {
  let error = "";
  if (validateForm()) {
    getFormData();
    const { model, db } = await createPersonModel();
    await model.add(currentPerson);
    await db.close();
  } else {
    error = "Error al insertar persona, al menos un campo debe contener datos";
  }
  personView(error);
}

async function handleUpdatePerson() {
  if (validateForm()) {
    getFormData();
    const { model, db } = await createPersonModel();
    if (model.getById(currentPerson.id)) {
      model.update(currentPerson);
    } else console.log("La persona a actualizar, aún NO existe");
    await db.close();
  };
};

async function handleGetPersonById(id) {
  const { model, db } = await createPersonModel();
  const persona = await model.getById(id);
  console.log(persona);
  await db.close();
}

async function handleDeletePerson(id) {
  const personId = id;
  const { model, db } = await createPersonModel();
  if (!personId) {
    console.log("Ninguna persona seleccionada para eliminar");
    return
  }
  await model.remove(personId);
  await db.close();
  personView();
};

async function handleDeleteAllPerson() {
  const { model, db } = await createPersonModel();
  model.removeAll();
  await db.close();
};

function handleFormEvent(e) {
  if (e.target.id === 'newPerson-btn-save') {
    e.preventDefault();
    handleAddPerson()
    formSection.close();
  } else if (e.target.id === 'form-close-icon') {
    formSection.close();
    personView();
  }

}

async function handleAllpersonsEvent(e) {
  let selectedPersonId = Number(e.target.closest('[data-id]')?.dataset.id);
  if (selectedPersonId) {
    if (e.target.tagName === "IMG") {
      handleDeletePerson(selectedPersonId);
    } else {
      handleGetPersonById(selectedPersonId)
    }
  }
}

// LISTENERS 
formSection.addEventListener('click', handleFormEvent);
tableSection.addEventListener('click', handleAllpersonsEvent);

// temporal para boton Open form
btnOpenForm.addEventListener('click',()=>{
  const newPerson=new PersonView();
  newPerson.renderInitialForm();
} );

personView();