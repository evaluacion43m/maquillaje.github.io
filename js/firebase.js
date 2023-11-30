// Importa las funciones de firebase.js
import { altaMaquillaje, getMaquillajes, onGetMaquillajes, eliminarMaquillaje, getMaquillajeById, editarMaquillaje } from "./firebase.js";

const maquillajeForm = document.getElementById("maquillajeForm");
const maquillajeTable = document.getElementById("maquillajeTable");

let maquillajes = [];

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

      editingIndex = doc.id;

      maquillajeForm['submitBtn'].innerText = "Guardar Cambios";
    });
  });
});

// Agrega la función onGetMaquillajes
function onGetMaquillajes(callback) {
  return firebase.firestore().collection('maquillajes').onSnapshot(callback);
}

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
    });
  });
}

// Agrega la función editarMaquillaje
function editarMaquillaje(id, datos) {
  return firebase.firestore().collection('maquillajes').doc(id).update(datos);
}
