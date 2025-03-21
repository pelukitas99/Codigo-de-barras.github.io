// Obtener los elementos del HTML
const startCameraButton = document.getElementById('startCameraButton');
const cameraContainer = document.getElementById('cameraContainer');
const videoElement = document.getElementById('video');
const takePhotoButton = document.getElementById('takePhotoButton');
const photoContainer = document.getElementById('photoContainer');
const photoElement = document.getElementById('photo');

// Variables para gestionar la cámara
let videoStream;

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
                takePhotoButton.disabled = false; // Habilitar el botón de tomar foto
                videoStream = stream; // Guardar la referencia del flujo de video
            })
            .catch(function(error) {
                console.log("Error al acceder a la cámara trasera:", error);
                alert("No se pudo acceder a la cámara trasera. Verifica que el dispositivo tenga una cámara trasera y que no esté en uso.");
            });
    } else {
        alert("El navegador no soporta el acceso a la cámara.");
    }
});

// Escuchar el evento de clic para tomar la foto
takePhotoButton.addEventListener('click', function() {
    // Crear un canvas para tomar la foto
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    // Configurar el tamaño del canvas igual al del video
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;

    // Dibujar el contenido del video en el canvas
    context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

    // Convertir la imagen del canvas a una URL de imagen
    const photoDataUrl = canvas.toDataURL('image/png');
    
    // Mostrar la imagen tomada
    photoElement.src = photoDataUrl;
    photoContainer.style.display = 'block'; // Hacer visible la foto

    // Detener el flujo de la cámara (desactivar la cámara)
    videoStream.getTracks().forEach(track => track.stop());

    // Ocultar el video y el botón de tomar foto
    cameraContainer.style.display = 'none';
    takePhotoButton.style.display = 'none';
});

