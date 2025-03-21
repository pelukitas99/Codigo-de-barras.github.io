// Obtener el botón y el contenedor del video
const startCameraButton = document.getElementById('startCameraButton');
const cameraContainer = document.getElementById('cameraContainer');
const videoElement = document.getElementById('video');

// Escuchar el evento de clic para activar la cámara
startCameraButton.addEventListener('click', function() {
    // Verifica si el navegador soporta la cámara
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        // Solicitar acceso a la cámara trasera
        navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
            .then(function(stream) {
                // Mostrar el video en el contenedor
                videoElement.srcObject = stream;
                cameraContainer.style.display = 'block';  // Mostrar el contenedor del video
                startCameraButton.style.display = 'none'; // Ocultar el botón
            })
            .catch(function(error) {
                console.log("Error al acceder a la cámara:", error);
                alert("No se pudo acceder a la cámara.");
            });
    } else {
        alert("El navegador no soporta el acceso a la cámara.");
    }
});
