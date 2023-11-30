// Archivo js/auth.js

// Configuración de Firebase 
// const firebaseConfig = { ... }; // No se nececita inicializar Firebase aquí 

// instancia del objeto de autenticación
const auth = firebase.auth();

// Proveedor de autenticación de Google
const provider = new firebase.auth.GoogleAuthProvider();

// Función para iniciar sesión con Google
async function iniciarSesion() {
    try {
        await auth.signInWithRedirect(provider);
    } catch (error) {
        procesaError(error);
    }
}

// Función para cerrar sesión
async function terminaSesion() {
    try {
        await auth.signOut();
    } catch (error) {
        procesaError(error);
    }
}

// Función que se ejecuta cuando cambia el estado de la autenticación
auth.onAuthStateChanged((usuarioAuth) => {
    if (usuarioAuth && usuarioAuth.email) {
        // Usuario autenticado
        document.getElementById('email').value = usuarioAuth.email;
        document.getElementById('nombre').value = usuarioAuth.displayName;
        document.getElementById('avatar').src = usuarioAuth.photoURL;
    } else {
        // No autenticado, redirige al inicio de sesión
        auth.signInWithRedirect(provider);
    }
}, procesaError);

// Función para manejar errores
function procesaError(error) {
    console.error(error);
    alert(error.message);
}
