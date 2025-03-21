// Obtener los elementos del HTML
const startCameraButton = document.getElementById('startCameraButton');
const cameraContainer = document.getElementById('cameraContainer');
const videoElement = document.getElementById('video');

// Escuchar el evento de clic para activar la cámara
startCameraButton.addEventListener('click', function() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        // Buscar la cámara trasera explícitamente
        const constraints = {
            video: { facingMode: { exact: "environment" } } // Solo cámara trasera
        };

        navigator.mediaDevices.getUserMedia(constraints)
            .then(function(stream) {
                // Mostrar el video en el contenedor
                videoElement.srcObject = stream;
                cameraContainer.style.display = 'block'; // Hacer visible el contenedor de la cámara
                startCameraButton.style.display = 'none'; // Ocultar el botón de activar cámara
            })
            .catch(function(error) {
                console.log("Error al acceder a la cámara trasera:", error);
                alert("No se pudo acceder a la cámara trasera. Verifica que el dispositivo tenga una cámara trasera y que no esté en uso.");
            });
    } else {
        alert("El navegador no soporta el acceso a la cámara.");
    }
});
