import { Database } from "../db/Database.js";
import { PersonView } from "../views/PersonView.js";
import { PersonModel } from "../models/PersonModel.js";
import { settings } from '../../config/config.js';
import { showConfirmationModal } from '../views/confirmationModalView.js';

const formSection = document.getElementById('sect-form-person');
const tableSection = document.getElementById('sect-allPersons');
const treeSection = document.getElementById('sect-tree');
const personSection = document.getElementById('sect-currentPerson');
//-----------------------------------------------------------
// BOTON TEMPORAL PARA ABRIR EL FORMULARIO Y AÑADIR MAS GENTE
//-----------------------------------------------------------
const btnOpenForm = document.getElementById('btnOpenForm');

let currentPerson = {
  gender: "male",
  name: "Probando",
  surname1: "Nombre",
  surname2: "Falso",
  dateBirth: null,
  placeBirth: "Nueva Yol",
  isDeath: true,
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
  currentPerson.gender = formSection.querySelector('input[name="newPerson-gender"]:checked').value || null;
  currentPerson.name = formSection.querySelector('#newPerson-name').value || null;
  currentPerson.surname1 = formSection.querySelector('#newPerson-surname1').value || null;
  currentPerson.surname2 = formSection.querySelector('#newPerson-surname2').value || null;
  currentPerson.isDeath = formSection.querySelector('#newPerson-isDeath').checked;
  currentPerson.placeBirth = formSection.querySelector('#newPerson-placeBirth').value || null;
  currentPerson.placeDeath = formSection.querySelector('#newPerson-placeDeath').value || null;
  //las fechas se pasan a formato estandar para almacenarlas
  currentPerson.dateBirth = formSection.querySelector('#newPerson-dateBirth').value ?
    new Date(formSection.querySelector('#newPerson-dateBirth').value).toISOString() : null;

  currentPerson.dateDeath = formSection.querySelector('#newPerson-dateDeath').value ?
    new Date(formSection.querySelector('#newPerson-dateDeath').value).toISOString() : null;
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
      personView.renderPersonTable(allPersons, settings.appSettings.dateFormat);
    } else {
      personView.renderPersonList(allPersons);
    }
  } else {
    personView.renderInitialForm(error);
  }
};

// manejador de añadir persona
async function handleAddPerson() {
  if (validateForm()) {
    getFormData();
    const { model, db } = await createPersonModel();
    const addConfirm = await model.add(currentPerson);
    await db.close();
    return addConfirm;
  }
}

// manejador de actualizar persona 
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

// manejador de leer persona por ID
async function handleGetPersonById(id) {
  const { model, db } = await createPersonModel();
  const person = await model.getById(id);
  await db.close();
  return person;
}

// manejador de eliminar persona por Id
async function handleDeletePerson(id) {
  const personId = id;
  const { model, db } = await createPersonModel();
  if (!personId) {
    console.log("Ninguna persona seleccionada para eliminar");
    return
  }

  const confirmation = await showConfirmationModal('¿Estás seguro de que quieres eliminar esta persona?', 'delete');
  if (confirmation) {
    await model.remove(personId);
    await db.close();
    personView();
    console.log(`Persona con id ${id} eliminada`);
  } else {
    console.log('Eliminación cancelada');
  }
};

// manejador de eliminar TODAS las personas
async function handleDeleteAllPerson() {
  const { model, db } = await createPersonModel();
  model.removeAll();
  await db.close();
};

// activa/desactiva fecha y lugar de defuncion en el formulario
function toggleFormDeathFields(){
  const deathCheckbox = document.getElementById('newPerson-isDeath');
  const deathFields = document.getElementById('newPerson-deathFields');

  const isChecked = deathCheckbox.checked;
  deathFields.classList.toggle('inactiveFieldForm', !isChecked);

  const inputs = deathFields.querySelectorAll('input');
  inputs.forEach(input => {
    input.disabled = !isChecked;
  });
}

// manejador de eventos del formulario
function handleFormEvent(e) {
  switch (e.target.id) {
    case 'newPerson-isDeath':
      toggleFormDeathFields();
      break;
    case 'newPerson-btn-save':
      e.preventDefault();
      const addConfirm = handleAddPerson()
      formSection.close();
      if (addConfirm) personView();
      break;
    case 'form-close-icon':
      formSection.close();
      personView(); 
    default:
      break;
  }
}

// manejador de eventos de la tabla/lista de personas
async function handleAllpersonsEvent(e) {
  const selectedPersonId = Number(e.target.closest('[data-id]')?.dataset.id);
  if (selectedPersonId) {
    if (e.target.tagName === "IMG") {
      handleDeletePerson(selectedPersonId);
    } else {
      currentPerson = await handleGetPersonById(selectedPersonId)
      personView();
    }
  }
}

// LISTENERS 
formSection.addEventListener('click', handleFormEvent);
tableSection.addEventListener('click', handleAllpersonsEvent);

// temporal para boton Open form
btnOpenForm.addEventListener('click', () => {
  const newPerson = new PersonView();
  newPerson.renderInitialForm();
});

personView();