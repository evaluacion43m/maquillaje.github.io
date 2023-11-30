// Importa las funciones de firebase.js
import { altaMaquillaje, getMaquillajes, onGetMaquillajes, eliminarMaquillaje, getMaquillajeById, editarMaquillaje } from "./firebase.js";

const maquillajeForm = document.getElementById("maquillajeForm");
const maquillajeTable = document.getElementById("maquillajeTable");

let maquillajes = [];  // Asegúrate de tener esta variable definida

window.addEventListener("DOMContentLoaded", async () => {
  // Asegúrate de llamar a actualizarTabla() al cargar la página
  await actualizarTabla();

  maquillajeForm.addEventListener("submit", (e) => {
    e.preventDefault();
    altaMaquillaje();
  });

  const btnsEdit = maquillajeTable.querySelectorAll('.btn-edit');
  btnsEdit.forEach((btn) => {
    btn.addEventListener('click', async (e) => {
      const doc = await getMaquillajeById(e.target.dataset.id);
      const maquillaje = doc.data();

      // Corrige el nombre de las propiedades según tu formulario
      maquillajeForm['nombre'].value = maquillaje.nombre;
      maquillajeForm['fechaLanzamiento'].value = maquillaje.fechaLanzamiento;
      maquillajeForm['marca'].value = maquillaje.marca;
      maquillajeForm['tipo'].value = maquillaje.tipo;
      maquillajeForm['precio'].value = maquillaje.precio;

      // Asegúrate de tener esta línea
      editingIndex = doc.id;

      // Asegúrate de tener esta línea
      maquillajeForm['submitBtn'].innerText = "Guardar Cambios";
    });
  });
});

async function actualizarTabla() {
  // Obtén los maquillajes antes de actualizar la tabla
  maquillajes = await getMaquillajes();

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
    });
  });
}
