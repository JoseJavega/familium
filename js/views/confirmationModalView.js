// Manejo del modal de confirmacion acciones (borrado)
export async function showConfirmationModal(message = '¿Estás seguro?', actionType = 'default') {
  return new Promise((resolve) => {
    const modal = document.getElementById('confirmationModal');
    const confirmBtn = modal.querySelector('[data-action="confirm"]');
    modal.querySelector('#confirmationModal-msg').textContent = message;

    confirmBtn.className = 'btn';
    switch (actionType) {
      case 'delete':
        confirmBtn.classList.add('warning');
        break;
      default:
        break;
    }

    modal.showModal();

    const handler = (e) => {
      const action = e.target.dataset.action;
      if (!action) return;

      modal.close();
      modal.removeEventListener('click', handler); // Limpieza del listener
      // Resuelve la promesa con true si 'confirm', false si no
      resolve(action === 'confirm');
    };

    modal.addEventListener('click', handler);
  });
}