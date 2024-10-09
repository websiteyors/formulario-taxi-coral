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

// Función para convertir la fecha a formato largo
function convertirFechaLarga(fechaISO) {
    const fecha = new Date(fechaISO);
    const opcionesFormatoLargo = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return fecha.toLocaleDateString('es-MX', opcionesFormatoLargo);
}

// Función para convertir la hora a formato de 12 horas con a.m./p.m.
function convertirHora12Horas(horaISO) {
    const partesHora = horaISO.split(':');
    let horas = parseInt(partesHora[0], 10);
    const minutos = partesHora[1];
    const periodo = horas >= 12 ? 'p.m.' : 'a.m.';

    if (horas > 12) {
        horas -= 12;
    } else if (horas === 0) {
        horas = 12; // Medianoche
    }

    return horas + ':' + minutos + ' ' + periodo;
}

// Envío del formulario usando AJAX
document.getElementById('serviceForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const formData = new FormData(this);
    
    // Obtener fecha y hora programada del formulario
    const fechaProgramada = formData.get('serviceDate');
    const horaProgramada = formData.get('serviceTime');
    
    // Convertir la fecha y la hora antes de enviarlas
    const fechaLarga = convertirFechaLarga(fechaProgramada);
    const hora12 = convertirHora12Horas(horaProgramada);
    
    // Reemplazar los valores formateados en el formData
    formData.set('serviceDate', fechaLarga);
    formData.set('serviceTime', hora12);
    
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