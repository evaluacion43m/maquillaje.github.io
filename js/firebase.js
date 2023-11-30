// Importa las funciones de firebase.js
import { altaMaquillaje, getMaquillajes, onGetMaquillajes, eliminarMaquillaje, getMaquillajeById, editarMaquillaje } from "./firebase.js";

const maquillajeForm = document.getElementById("maquillajeForm");
const maquillajeTable = document.getElementById("maquillajeTable");

let editingIndex = -1;

window.addEventListener("DOMContentLoaded", async () => {
  // Asegúrate de llamar a actualizarTabla() al cargar la página
  actualizarTabla();

  maquillajeForm.addEventListener("submit", (e) => {
    e.preventDefault();
    altaMaquillaje();
  });

  const btnsEdit = maquillajeTable.querySelectorAll('.btn-edit');
  btnsEdit.forEach((btn) => {
    btn.addEventListener('click', async (e) => {
      const doc = await getMaquillajeById(e.target.dataset.id);
      const maquillaje = doc.data();

      // Corrige el nombre de las propiedades
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
            <button onclick="editarMaquillaje(${index})">Editar</button>
            <button onclick="eliminarMaquillaje(${index})">Eliminar</button>
        `;
    });
}

function editarMaquillaje(index) {
    const maquillaje = maquillajes[index];
    document.getElementById('nombre').value = maquillaje.nombre;
    document.getElementById('fechaLanzamiento').value = maquillaje.fechaLanzamiento.toDate().toLocaleDateString();
    document.getElementById('marca').value = maquillaje.marca;
    document.getElementById('tipo').value = maquillaje.tipo;
    document.getElementById('precio').value = maquillaje.precio;

    editingIndex = index;
    document.getElementById('submitBtn').innerText = 'Guardar Cambios';
}

function eliminarMaquillaje(index) {
    const maquillajeID = maquillajes[index].id;

    // Eliminar maquillaje de Firestore
    maquillajesCollection.doc(maquillajeID).delete()
    .then(() => {
        console.log("Maquillaje eliminado de Firestore");

        // Eliminar maquillaje de la lista local
        maquillajes.splice(index, 1);

        // Actualizar la tabla
        actualizarTabla();
    })
    .catch((error) => {
        console.error("Error al eliminar maquillaje de Firestore:", error);
        alert('Error al eliminar maquillaje de Firestore. Consulta la consola para más detalles.');
    });

    console.log('Saliendo de altaMaquillaje');
}

