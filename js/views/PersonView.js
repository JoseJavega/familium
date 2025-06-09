export class PersonView {

  #parseDataPerson(person, dateSetting) {
    // funcion para parsear los datos tipo texto
    // el parámetro fallback de la función flecha define un valor por defecto para ese parámetro
    const formatValue = (value, fallback = 'Desconocido') =>
      value === null || value === '' ? `<span class="unknown">${fallback}</span>` : value;

    // funcion para revisar si hay fecha válida y parsearla al formato local recibido
    const formatDate = (date) => {
      const parsedDate = new Date(date);
      if (!date || isNaN(parsedDate.getTime())) {
        return `<span class="unknown">Desconocida</span>`;
      } else return parsedDate.toLocaleDateString(dateSetting);
    };

    //devolvemos todos los valores de currentPerson parseados por la funciones anteriores
    return {
      name: formatValue(person.name),
      surname1: formatValue(person.surname1),
      surname2: formatValue(person.surname2),
      gender: formatValue(person.gender),
      dateBirth: formatDate(person.dateBirth),
      placeBirth: formatValue(person.placeBirth),
      dateDeath: formatDate(person.dateDeath),
      placeDeath: formatValue(person.placeDeath),
      fatherId: formatValue(person.fatherId),
      motherId: formatValue(person.motherId)
    }
  }

  // Formulario inicial para añadir persona y adaptable para editar a currentPerson
  renderInitialForm({ error = null, person = null } = {}) {
    let editPerson = {};
    const formContainer = document.getElementById('sect-form-person');
    formContainer.innerHTML = "";
    let errorTxt = "";
    let noDisplayErrorClass = "displayNone"; //por defecto no se muestra el párrafo del error
    if (error !== undefined && error !== null) {
      errorTxt = error;
      noDisplayErrorClass = "";
    }

    // si pasamos currentPerson igualamos campos y si no se pone todo el blanco
    editPerson.id = person?.id || '';
    editPerson.gender = person?.gender || '';
    editPerson.name = person?.name || '';
    editPerson.surname1 = person?.surname1 || '';
    editPerson.surname2 = person?.surname2 || '';
    editPerson.isDeath = person?.isDeath || false;
    editPerson.dateBirth = person?.dateBirth ? person.dateBirth.split('T')[0] : '';
    editPerson.placeBirth = person?.placeBirth || '';
    editPerson.dateDeath = person?.dateDeath ? person.dateDeath.split('T')[0] : '';
    editPerson.placeDeath = person?.placeDeath || '';
    //seteamos el genero
    let genderMaleChecked="";
    let genderFemaleChecked="";
    let genderDesconocidoChecked="";    
    switch (editPerson.gender) {
      case "male":
        genderMaleChecked="checked";
        break;
      case "female":
        genderFemaleChecked="checked";
        break;
      default:
        genderDesconocidoChecked="checked";
        break;
    };
    //seteamos isDeath
    let classCSSInactiveFieldForm="inactiveFieldForm";
    let isDeathChecked="";
    if (editPerson.isDeath){
      isDeathChecked="checked";
      classCSSInactiveFieldForm="";
    }

    formContainer.innerHTML = `
      <div class="container">
        <img id="form-close-icon" src="./assets/icons/close-circle.svg" alt="cerrar ventana">
        <h2>Alta de nueva persona</h2>
        <form id="newPerson" method="modal" data-person-id="${editPerson.id}">
          <div class="form-row">
            <div class="form-group-horizontal">
              <input type="radio" name="newPerson-gender" id="newPerson-gender-male" value="male" ${genderMaleChecked} tabindex="10"/> 
              <label class="newPerson-lbl" for="newPerson-gender-male">Hombre</label>               
            </div>
            <div class="form-group-horizontal">
              <input type="radio" name="newPerson-gender" id="newPerson-gender-female" value="female" ${genderFemaleChecked} tabindex="10"/>
              <label class="newPerson-lbl" for="newPerson-gender-female">Mujer</label>               
            </div>
            <div class="form-group-horizontal">
              <input type="radio" name="newPerson-gender" id="newPerson-gender-unknown" value="Desconocido" ${genderDesconocidoChecked} tabindex="10"/>
              <label class="newPerson-lbl" for="newPerson-gender-unknown">Desconocido</label> 
            </div>
          </div>
          <div class="form-row">
            <div class="form-group-vertical">
              <label class="newPerson-lbl" for="newPerson-name" >Nombre</label>
              <input class="newPerson-input" id="newPerson-name" type="text" autofocus value="${editPerson.name}">
            </div>
            <div class="form-group-vertical">
              <label class="newPerson-lbl" for="newPerson-surname1">Primer apellido</label>
              <input class="newPerson-input" id="newPerson-surname1" type="text" value="${editPerson.surname1}">
            </div>
            <div class="form-group-vertical">
              <label class="newPerson-lbl" for="newPerson-surname2">Segundo apellido</label>
              <input class="newPerson-input" id="newPerson-surname2" type="text" value="${editPerson.surname2}">
            </div>
          </div>
          <div class="form-row">
            <div class="form-group-vertical">
              <label class="newPerson-lbl" for="newPerson-dateBirth">Fecha de nacimiento</label>
              <input class="newPerson-input" id="newPerson-dateBirth" type="date" value="${editPerson.dateBirth}">
            </div>
            <div class="form-group-vertical">
              <label class="newPerson-lbl" for="newPerson-placeBirth">Lugar de nacimiento</label>
              <input class="newPerson-input" id="newPerson-placeBirth" type="text" value="${editPerson.placeBirth}">
            </div>
          </div>
          <div class="form-row">
            <div class="form-group-horizontal">
              <input type="checkbox" name="newPerson-isDeath" id="newPerson-isDeath" ${isDeathChecked}/>
              <label class="newPerson-lbl" for="newPerson-isDeath">Fallecido</label> 
            </div>
          </div>
          <div class="form-row ${classCSSInactiveFieldForm}" id="newPerson-deathFields">      
            <div class="form-group-vertical">
              <label class="newPerson-lbl" for="newPerson-dateDeath">Fecha de defunción</label>
              <input class="newPerson-input" id="newPerson-dateDeath" type="date" value="${editPerson.dateDeath}">
            </div>
            <div class="form-group-vertical">
              <label class="newPerson-lbl" for="newPerson-placeDeath">Lugar de defunción</label>
              <input class="newPerson-input" id="newPerson-placeDeath" type="text" value="${editPerson.placeDeath}">
            </div>
          </div>
          <p class="form-error-txt ${noDisplayErrorClass}">${errorTxt}</p>
          <div class="buttons-centered">
            <button class="btn warning" id="newPerson-btn-reset" type="reset">Limpiar</button>
            <button class="btn primary" id="newPerson-btn-save" type="submit">Guardar</button>
          </div>
        </form>
      </div>
    `

    formContainer.showModal();
  }

  // Información de currentPerson
  renderCurrentPerson(currentPerson, dateSetting) {
    const personContainer = document.getElementById("sect-currentPerson");
    //parsemos los datos de currentPerson a modo "vista"
    const parsedPerson = this.#parseDataPerson(currentPerson, dateSetting);

    let genderIcon = "";
    switch (parsedPerson.gender) {
      case "male":
        genderIcon = '"./assets/icons/male-sign.svg"'
        break;
      case "female":
        genderIcon = '"./assets/icons/female-sign.svg"'
        break;
      default:
        genderIcon = '"./assets/icons/question-sign.svg"'
        break;
    };

    // construyo si ha fallecido
    const deathInfoHTML = currentPerson.isDeath
      ? `
      <p>Fecha de Defunción: ${parsedPerson.dateDeath}</p>
      <p>Lugar de Defunción: ${parsedPerson.placeDeath}</p>`
      : '';

    // construyo el apartado de padre y madre
    let fatherHtml=`<p><button class="" type="button" id="btnAddFather">+ Añadir Padre</button></p>`;
    let motherHtml=`<p><button class="" type="button" id="btnAddMather">+ Añadir Madre</button></p>`;
    if (!isNaN(parsedPerson.fatherId)){
      fatherHtml=`<p>Nombre del padre: ${parsedPerson.fatherId}</p>`
    };
    if (!isNaN(parsedPerson.motherId)){
      motherHtml=`<p>Nombre de la madre: ${parsedPerson.motherId}</p>`
    };


    // montamos el HTML
    personContainer.innerHTML = `
      <div class="currentPerson-header">
        <img class="personHeader-gender-icon" src=${genderIcon} alt="genero"> 
        <h2>${parsedPerson.name} ${parsedPerson.surname1} ${parsedPerson.surname2}</h2>
        <button><img id="currentPerson-edit" class="personHeader-edit-icon" src="./assets/icons/edit.svg" alt="editar persona"></button>    
      </div>
      <p>Fecha de Nacimiento: ${parsedPerson.dateBirth}</p>
      <p>Lugar de Nacimiento: ${parsedPerson.placeBirth}</p>
      ${deathInfoHTML}
      ${fatherHtml}
      ${motherHtml}
      `;

  }

  // Tabla de todas las personas, para formato escritorio
  renderPersonTable(allPersons, dateSetting) {
    let rows = "";
    allPersons.forEach(person => {
      //parseamos los datos de cada persona
      const personParsed = this.#parseDataPerson(person, dateSetting);
      rows += `
        <tr data-id="${person.id}">
          <td>${personParsed.name}</td>
          <td>${personParsed.surname1}</td>
          <td>${personParsed.surname2}</td>
          <td>${personParsed.dateBirth}</td>
          <td class="table-persons_delPerson"><img src="./assets/icons/trash.svg" alt="eliminar persona"></td>
        </tr>`;
    });

    const tableContainer = document.getElementById('sect-allPersons');
    tableContainer.innerHTML = `
      <table class="table-persons">
        <thead>
          <th>Nombre</th>
          <th>Primer apellido</th>
          <th>Segundo apellido</th>
          <th>Fech. Nac.</th>
          <th></th>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>`;

    this.renderTree();
  }

  // Lista de todas las personas, para formato mobile
  renderPersonList(allPersons) {
    let listElements = "";
    allPersons.forEach(person => {
      const name = person.name ? person.name : "----";
      const surname1 = person.surname1 ? person.surname1 : "----";
      const surname2 = person.surname2 ? person.surname2 : "----";
      listElements += `
      <li data-id="${person.id}">
        <a>${name} ${surname1} ${surname2}</a>
        <spam><img src="./assets/icons/trash.svg" alt="eliminar persona"></spam>
      </li>`
    });

    const listContainer = document.getElementById('sect-allPersons');
    listContainer.innerHTML = `
      <ul class="personsList">
      ${listElements}
      </ul>`;
  }

  // Arbol genealogico gráfico
  renderTree() {
    const treeSection = document.getElementById('sect-tree');

    treeSection.innerHTML = `<div class="treeDesing">
    <p class="g2-1">Padre</p>
    <p class="g1">Persona</p>
    <p class="g2-2">Madre</p>  
    </div>`;
  }
}