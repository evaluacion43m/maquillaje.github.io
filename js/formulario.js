// Archivo js/formulario.js

// Obtén una referencia a la colección "maquillajes" en Firestore
const maquillajesCollection = firebase.firestore().collection('maquillajes');

// Datos formulario
let maquillajes = [];
let editingIndex = -1;

// Asegúrate de llamar a actualizarTabla() al cargar la página
window.onload = actualizarTabla;

function altaMaquillaje() {
    const nombre = document.getElementById('nombre').value;
    const fechaLanzamientoString = document.getElementById('fechaLanzamiento').value;
    const fechaLanzamiento = new Date(fechaLanzamientoString);
    const marca = document.getElementById('marca').value;
    const tipo = document.getElementById('tipo').value;
    const precio = document.getElementById('precio').value;

    if (!nombre || !fechaLanzamiento || !marca || !tipo || !precio) {
        alert('Todos los campos son obligatorios');
        return;
    }

    if (editingIndex === -1) {
        // Agregar nuevo maquillaje a Firestore
        maquillajesCollection.add({
            nombre,
            fechaLanzamiento: firebase.firestore.Timestamp.fromDate(fechaLanzamiento),
            marca,
            tipo,
            precio: parseFloat(precio)
        })
        .then((docRef) => {
            console.log("Maquillaje agregado a Firestore con ID:", docRef.id);

            // Agregar el maquillaje a la lista local
            maquillajes.push({
                id: docRef.id,
                nombre,
                fechaLanzamiento,
                marca,
                tipo,
                precio: parseFloat(precio)
            });

            // Actualizar la tabla
            actualizarTabla();
        })
        .catch((error) => {
            console.error("Error al agregar maquillaje a Firestore:", error);
        });
    } else {
        // Editar maquillaje existente en Firestore
        const maquillajeID = maquillajes[editingIndex].id;
        maquillajesCollection.doc(maquillajeID).update({
            nombre,
            fechaLanzamiento,
            marca,
            tipo,
            precio
        })
        .then(() => {
            console.log("Maquillaje actualizado en Firestore");

            // Actualizar el maquillaje en la lista local
            maquillajes[editingIndex] = {
                id: maquillajeID,
                nombre,
                fechaLanzamiento,
                marca,
                tipo,
                precio
            };

            // Reinicia la variable de edición y el texto del botón
            editingIndex = -1;
            document.getElementById('submitBtn').innerText = 'Agregar';

            // Actualizar la tabla
            actualizarTabla();
        })
        .catch((error) => {
            console.error("Error al actualizar maquillaje en Firestore:", error);
        });
    }

    // Limpiar el formulario (ya no es necesario actualizar la tabla aquí)
    document.getElementById('maquillajeForm').reset();
}

function actualizarTabla() {
    const table = document.getElementById('maquillajeTable');
    table.innerHTML = '<tr><th>Nombre</th><th>Fecha de Lanzamiento</th><th>Marca</th><th>Tipo</th><th>Precio</th><th>Acciones</th></tr>';

    maquillajes.forEach((maquillaje, index) => {
        const row = table.insertRow();
        row.insertCell(0).innerHTML = maquillaje.nombre;
        row.insertCell(1).innerHTML = maquillaje.fechaLanzamiento;
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
    document.getElementById('fechaLanzamiento').value = maquillaje.fechaLanzamiento;
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
    });
}
