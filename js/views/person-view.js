export class PersonView {

  // Formulario inicial para añadir persona y adaptable para editar a currentPerson
  renderInitialForm(error) {
    const formContainer = document.getElementById('sect-form-person');
    formContainer.innerHTML = "";
    let errorTxt = "";
    let noDisplayErrorClass = "displayNone"; //por defecto no se muestra el párrafo del error
    if (error !== undefined && error !== null) {
      errorTxt = error;
      noDisplayErrorClass = "";
    }

    formContainer.innerHTML = `
      <div class="container">
        <h2>Alta de nueva persona</h2>
        <form id="newPerson" method="modal">
          <div class="form-row">
            <div class="form-group-horizontal">
              <input type="radio" name="newPerson-sex" value="Hombre" id="newPerson-sex-male"/> 
              <label class="newPerson-lbl" for="newPerson-sex-male">Hombre</label>               
            </div>
            <div class="form-group-horizontal">
              <input type="radio" name="newPerson-sex" value="Mujer" id="newPerson-sex-female"/>
              <label class="newPerson-lbl" for="newPerson-sex-female">Mujer</label>               
            </div>
            <div class="form-group-horizontal">
              <input type="radio" name="newPerson-sex" value="Desconocido" id="newPerson-sex-unknow"/>
              <label class="newPerson-lbl" for="newPerson-sex-unknow">Desconocido</label> 
            </div>
          </div>
          <div class="form-row">
            <div class="form-group-vertical">
              <label class="newPerson-lbl" for="newPerson-name">Nombre</label>
              <input class="newPerson-input" id="newPerson-name" type="text">
            </div>
            <div class="form-group-vertical">
              <label class="newPerson-lbl" for="newPerson-surname1">Primer apellido</label>
              <input class="newPerson-input" id="newPerson-surname1" type="text">
            </div>
            <div class="form-group-vertical">
              <label class="newPerson-lbl" for="newPerson-surname2">Segundo apellido</label>
              <input class="newPerson-input" id="newPerson-surname2" type="text">
            </div>
          </div>
          <div class="form-row">
            <div class="form-group-vertical">
              <label class="newPerson-lbl" for="newPerson-dateBirth">Fecha de nacimiento</label>
              <input class="newPerson-input" id="newPerson-dateBirth" type="date">
            </div>
            <div class="form-group-vertical">
              <label class="newPerson-lbl" for="newPerson-placeBirth">Lugar de nacimiento</label>
              <input class="newPerson-input" id="newPerson-placeBirth" type="text">
            </div>
          </div>
          <div class="form-row">
            <div class="form-group-vertical">
              <label class="newPerson-lbl" for="newPerson-dateDeath">Fecha de defunción</label>
              <input class="newPerson-input" id="newPerson-dateDeath" type="date">
            </div>
            <div class="form-group-vertical">
              <label class="newPerson-lbl" for="newPerson-placeDeath">Lugar de defunción</label>
              <input class="newPerson-input" id="newPerson-placeDeath" type="text">
            </div>
          </div>
          <div class="form-row">
            <div class="form-group-vertical">
              <label class="newPerson-lbl" for="newPerson-fatherName">Nombre del padre</label>
              <input class="newPerson-input" id="newPerson-fatherName" type="txt">
            </div>
            <div class="form-group-vertical">
              <label class="newPerson-lbl" for="newPerson-motherName">Nombre de la madre</label>
              <input class="newPerson-input" id="newPerson-motherName" type="text">
            </div>
          </div>
          <p class="form-error-txt ${noDisplayErrorClass}">${errorTxt}</p>
          <div class="form-actions">
            <button class="btn warning newPerson-btn" id="newPerson-btn-reset" type="reset">Limpiar</button>
            <button class="btn primary newPerson-btn" id="newPerson-btn-save" type="submit">Guardar</button>
          </div>
        </form>
      </div>
    `
    formContainer.showModal();
  }

  // Tabla de todas las personas, para formato escritorio
  renderPersonTable(allPersons) {
    let rows = "";
    allPersons.forEach(person => {
      rows += `
        <tr data-id="${person.id}">
          <td>${person.name}</td>
          <td>${person.surname1}</td>
          <td>${person.surname2}</td>
          <td>${person.dateBirth}</td>
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
  }

  // Lista de todas las personas, para formato mobile
  renderPersonList(allPersons){
    let listElements="";
    allPersons.forEach(person=>{
      const name=person.name?person.name:"----";
      const surname1=person.apell1?person.apell1:"----";
      const surname2=person.apell2?person.apell2:"----";
      listElements+=`
      <li data-id="${person.id}">
        <a>${name} ${surname1} ${surname2}</a>
        <spam><img src="./assets/icons/trash.svg" alt="eliminar persona"></spam>
      </li>`
    });

    const listContainer = document.getElementById('sect-allPersons');
    listContainer.innerHTML=`
      <ul class="personsList">
      ${listElements}
      </ul>`; 
  }

}