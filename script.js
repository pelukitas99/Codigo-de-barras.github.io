// Obtener los elementos del HTML
const startCameraButton = document.getElementById('startCameraButton');
const cameraContainer = document.getElementById('cameraContainer');
const videoElement = document.getElementById('video');
const takePhotoButton = document.getElementById('takePhotoButton');
const photoCanvas = document.getElementById('photoCanvas');
const photo = document.getElementById('photo');

// Escuchar el evento de clic para activar la cámara
startCameraButton.addEventListener('click', function() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        // Solicitar acceso a la cámara trasera
        navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: "environment" } // Cámara trasera
        })
        .then(function(stream) {
            // Mostrar el video en el contenedor
            videoElement.srcObject = stream;
            cameraContainer.style.display = 'block';
            takePhotoButton.style.display = 'block'; // Mostrar el botón para tomar foto
            startCameraButton.style.display = 'none'; // Ocultar el botón de activar cámara
        })
        .catch(function(error) {
            console.log("Error al acceder a la cámara:", error);
            alert("No se pudo acceder a la cámara.");
        });
    } else {
        alert("El navegador no soporta el acceso a la cámara.");
    }
});

// Escuchar el evento de clic para tomar la foto
takePhotoButton.addEventListener('click', function() {
    const context = photoCanvas.getContext('2d');
    const width = videoElement.videoWidth;
    const height = videoElement.videoHeight;

    // Establecer el tamaño del lienzo igual al tamaño del video
    photoCanvas.width = width;
    photoCanvas.height = height;

    // Dibujar el contenido del video en el lienzo
    context.drawImage(videoElement, 0, 0, width, height);

    // Convertir el lienzo a una imagen y mostrarla
    const dataUrl = photoCanvas.toDataURL('image/png');
    photo.src = dataUrl;
    photo.style.display = 'block'; // Mostrar la foto tomada
});
