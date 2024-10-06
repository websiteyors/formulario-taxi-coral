// Selecciona todos los campos de entrada
const inputs = document.querySelectorAll('input, textarea');

// Añade la clase 'filled' cuando el campo está lleno
inputs.forEach(input => {
    input.addEventListener('input', function() {
        if (input.value.trim() !== '') {
            input.classList.add('filled');
        } else {
            input.classList.remove('filled');
        }
        checkFormCompletion();
    });
});

// Función para formatear la fecha y hora en texto plano
function formatDateTime(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Meses comienzan en 0
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
}

// Establece la fecha y hora actual en el campo de timestamp cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    const timestampField = document.getElementById('timestamp');
    const currentDateTime = new Date();
    timestampField.value = formatDateTime(currentDateTime); // Fecha y hora en formato de texto
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
                geoLocationField.classList.add('filled'); 
                alert("Geolocalización obtenida correctamente.");
                checkFormCompletion();
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

    // Resaltar campos vacíos
    formFields.forEach(field => {
        const inputElement = document.getElementById(field);
        if (inputElement.value.trim() === '') {
            inputElement.classList.add('error');
        } else {
            inputElement.classList.remove('error');
        }
    });
}

// Validación de longitud para el campo de teléfono
document.getElementById('phone').addEventListener('input', function () {
    if (this.value.length > 10) {
        this.value = this.value.substring(0, 10); 
    }
});

// Validación de longitud para otros campos
['fullname', 'location', 'destination', 'details'].forEach(id => {
    document.getElementById(id).addEventListener('input', function () {
        if (this.value.length > 100) {
            this.value = this.value.substring(0, 100); 
        }
    });
});

// Envío del formulario usando AJAX
document.getElementById('serviceForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const formData = new FormData(this);
    formData.append('timestamp', formatDateTime(new Date())); // Añadir timestamp formateado
    
    fetch(this.action, {
        method: 'POST',
        body: formData
    })
    .then(response => response.text())
    .then(result => {
        alert("Formulario enviado correctamente.");
        setTimeout(function() {
            window.location.href = 'https://sites.google.com/view/rtaxi-coral/inicio';
        }, 2000);
    })
    .catch(error => {
        console.error('Error al enviar el formulario:', error);
        alert("Hubo un problema al enviar el formulario. Intenta nuevamente.");
    });
});