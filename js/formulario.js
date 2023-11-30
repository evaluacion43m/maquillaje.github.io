// Obtén una referencia a la colección "maquillajes" en Firestore
const maquillajesCollection = firebase.firestore().collection('maquillajes');

// Datos formulario
let maquillajes = [];
let editingIndex = -1;

// Asegúrate de llamar a actualizarTabla() al cargar la página
window.onload = () => {
    actualizarTabla();

    // Evento para agregar o editar maquillaje al hacer clic en el botón "Agregar/Guardar Cambios"
    document.getElementById('submitBtn').addEventListener('click', (event) => {
        event.preventDefault();
        altaMaquillaje();
    });

    // Evento para cancelar la edición al hacer clic en el botón "Cancelar"
    document.getElementById('cancelBtn').addEventListener('click', () => {
        cancelarEdicion();
    });

    // Evento para eliminar maquillaje al hacer clic en el botón "Eliminar"
    document.getElementById('deleteBtn').addEventListener('click', () => {
        if (editingIndex !== -1) {
            eliminarMaquillaje(editingIndex);
            cancelarEdicion();
        }
    });
};

function altaMaquillaje() {
    console.log('Entrando a altaMaquillaje');
    // Obtén los valores del formulario
    // Continuación del código

    const fechaLanzamiento = new Date(fechaLanzamientoString);
    const marca = document.getElementById('marca').value;
    const tipo = document.getElementById('tipo').value;
    const precio = document.getElementById('precio').value;

    // Verifica que todos los campos estén completos
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
            alert('Error al agregar maquillaje a Firestore. Consulta la consola para más detalles.');
        });
    } else {
        // Editar maquillaje existente en Firestore
        const maquillajeID = maquillajes[editingIndex].id;
        maquillajesCollection.doc(maquillajeID).update({
            nombre,
            fechaLanzamiento,
            marca,
            tipo,
            precio: parseFloat(precio)
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
                precio: parseFloat(precio)
            };

            // Reinicia la variable de edición y el texto del botón
            editingIndex = -1;
            document.getElementById('submitBtn').innerText = 'Agregar';

            // Actualizar la tabla
            actualizarTabla();
        })
        .catch((error) => {
            console.error("Error al actualizar maquillaje en Firestore:", error);
            alert('Error al actualizar maquillaje en Firestore. Consulta la consola para más detalles.');
        });
    }

    // Limpiar el formulario (ya no es necesario actualizar la tabla aquí)
    document.getElementById('maquillajeForm').reset();
}

// Continuación del código

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

// Continuación del código
