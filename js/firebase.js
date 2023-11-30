// Importa las funciones de firebase.js
import { altaMaquillaje, getMaquillajes, onGetMaquillajes, eliminarMaquillaje, getMaquillajeById, editarMaquillaje } from "./firebase.js";

const maquillajeForm = document.getElementById("maquillajeForm");

window.addEventListener("DOMContentLoaded", async () => {
  // Asegúrate de llamar a onGetMaquillajes al cargar la página
  onGetMaquillajes((querySnapshot) => {
    maquillajes = [];
    querySnapshot.forEach((doc) => {
      const maquillaje = doc.data();
      maquillajes.push({ id: doc.id, ...maquillaje });
    });
    actualizarTabla();
  });

  maquillajeForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    await altaMaquillaje();
    // Actualiza la tabla después de agregar o editar
    actualizarTabla();
  });
});

function actualizarTabla() {
  const table = document.getElementById('maquillajeTable');
  table.innerHTML = '<tr><th>Nombre</th><th>Fecha de Lanzamiento</th><th>Marca</th><th>Tipo</th><th>Precio</th><th>Acciones</th></tr>';

  maquillajes.forEach((maquillaje, index) => {
    const row = table.insertRow();
    row.insertCell(0).innerHTML = maquillaje.nombre;
    row.insertCell(1).innerHTML = maquillaje.fechaLanzamiento.toDate().toLocaleDateString();
    row.insertCell(2).innerHTML = maquillaje.marca;
    row.insertCell(3).innerHTML = maquillaje.tipo;
    row.insertCell(4).innerHTML = maquillaje.precio;
    row.insertCell(5).innerHTML = `
        <button class="btn-edit" data-id="${maquillaje.id}">Editar</button>
        <button class="btn-delete" data-id="${maquillaje.id}">Eliminar</button>
    `;
  });

  const btnsDelete = table.querySelectorAll('.btn-delete');
  btnsDelete.forEach((btn) => {
    btn.addEventListener('click', ({ target: { dataset } }) => {
      eliminarMaquillaje(dataset.id);
      // Actualiza la tabla después de eliminar
      actualizarTabla();
    });
  });
}
