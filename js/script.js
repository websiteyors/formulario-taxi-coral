// Selecciona todos los campos de entrada (puedes ajustar para seleccionar solo los que te interesen)
const inputs = document.querySelectorAll('input, textarea');

// Función que añade la clase 'filled' cuando el campo está lleno
inputs.forEach(input => {
    input.addEventListener('input', function() {
        if (input.value.trim() !== '') {
            input.classList.add('filled');
        } else {
            input.classList.remove('filled');
        }
        checkFormCompletion(); // Verificar si todos los campos están completos después de cada cambio
    });
});

// Establece la fecha y hora actual en el campo de timestamp cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('timestamp').value = new Date().toLocaleString();
});

// Geolocalización
function getGeolocation() {
    const geoLocationField = document.getElementById('geolocation');
    
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                const geolocationLink = `https://www.google.com/maps?q=${lat},${lon}`;
                geoLocationField.value = geolocationLink;
                geoLocationField.classList.add('filled'); // Marca como "filled" cuando se completa
                alert("Geolocalización obtenida correctamente.");
                checkFormCompletion(); // Verificar si todos los campos están completos
            },
            (error) => {
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        alert("Permiso de geolocalización denegado. Activa el acceso.");
                        break;
                    case error.POSITION_UNAVAILABLE:
                        alert("Ubicación no disponible.");
                        break;
                    case error.TIMEOUT:
                        alert("Tiempo de espera agotado.");
                        break;
                    default:
                        alert("Error desconocido.");
                        break;
                }
            }
        );
    } else {
        alert("Tu navegador no soporta geolocalización.");
    }
}

// Verificar la completitud del formulario
const formFields = ['fullname', 'phone', 'serviceDate', 'serviceTime', 'location', 'destination', 'details', 'geolocation'];

formFields.forEach(function (fieldId) {
    document.getElementById(fieldId).addEventListener('input', checkFormCompletion);
});

// Habilitar el botón de enviar solo si todos los campos están completos
function checkFormCompletion() {
    const allFilled = formFields.every(field => document.getElementById(field).value.trim() !== '');
    document.getElementById('submitButton').disabled = !allFilled;

    // Opcional: resaltar campos vacíos
    formFields.forEach(field => {
        const inputElement = document.getElementById(field);
        if (inputElement.value.trim() === '') {
            inputElement.classList.add('error');
        } else {
            inputElement.classList.remove('error');
        }
    });
}

// Validación para el campo de teléfono (máximo 10 dígitos)
document.getElementById('phone').addEventListener('input', function () {
    if (this.value.length > 10) {
        this.value = this.value.substring(0, 10); // Limita a 10 dígitos
    }
});

// Validación de longitud máxima para otros campos
document.getElementById('fullname').addEventListener('input', function () {
    if (this.value.length > 50) {
        this.value = this.value.substring(0, 50); // Limita a 50 caracteres
    }
});

document.getElementById('location').addEventListener('input', function () {
    if (this.value.length > 100) {
        this.value = this.value.substring(0, 100); // Limita a 100 caracteres
    }
});

document.getElementById('destination').addEventListener('input', function () {
    if (this.value.length > 100) {
        this.value = this.value.substring(0, 100); // Limita a 100 caracteres
    }
});

document.getElementById('details').addEventListener('input', function () {
    if (this.value.length > 100) {
        this.value = this.value.substring(0, 100); // Limita a 100 caracteres
    }
});

// Función para enviar el formulario a Google Sheets mediante AJAX
document.getElementById('serviceForm').addEventListener('submit', function (e) {
    e.preventDefault(); // Evitar la recarga de la página
    const formData = new FormData(this);
    fetch(this.action, {
        method: 'POST',
        body: formData
    })
    .then(response => response.text())
    .then(result => {
        alert("Formulario enviado correctamente.");
        // Redirigir a la página principal después de 2 segundos
        setTimeout(function() {
            window.location.href = 'https://sites.google.com/view/rtaxi-coral/inicio';
        }, 2000);
    })
    .catch(error => {
        console.error('Error al enviar el formulario:', error);
        alert("Hubo un problema al enviar el formulario. Intenta nuevamente.");
    });
});