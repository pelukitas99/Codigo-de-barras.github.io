// Obtener la instancia de ZXing
const codeReader = new ZXing.BrowserMultiFormatReader();

// Escuchar el evento de clic para activar la cámara
document.getElementById('startCameraButton').addEventListener('click', function() {
    // Verifica si el navegador soporta la cámara
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        // Solicitar acceso a la cámara trasera
        navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
            .then(function(stream) {
                console.log("Cámara activada correctamente.");

                // Mostrar el video en la página
                const video = document.createElement('video');
                video.srcObject = stream;
                video.setAttribute('autoplay', true);
                video.setAttribute('playsinline', true); // Asegura que funcione bien en dispositivos móviles
                document.getElementById('scanner-container').appendChild(video);

                // Iniciar el escaneo del código de barras
                codeReader.decodeFromVideoDevice(null, video, (result, error) => {
                    if (result) {
                        console.log("Código escaneado:", result.text);
                        fetchProductData(result.text); // Buscar los datos del producto
                    }
                    if (error) {
                        console.error("Error de escaneo:", error);
                    }
                });
            })
            .catch(function(error) {
                console.log("Error al acceder a la cámara:", error);
                alert("No se pudo acceder a la cámara. Asegúrate de que el navegador tenga permisos.");
            });
    } else {
        alert("El navegador no soporta el acceso a la cámara.");
    }
});

// Función para obtener los datos del producto basado en el código escaneado
function fetchProductData(barcode) {
    fetch("https://docs.google.com/spreadsheets/d/e/2PACX-1vSKHNIwPCopFbz6NDE-S2FM6U8NwtY696GXiqc4jv_ibp2eji-AHbXW_uIZJmGL9F5ErxCYqrZnoKgI/pub?output=csv")
        .then(response => response.text())
        .then(data => {
            const products = csvToArray(data);  // Convertir CSV a array
            const product = products.find(p => p['Escanear código de barras'] === barcode);

            if (product) {
                displayProductInfo(product);  // Mostrar datos del producto
            } else {
                alert("Producto no encontrado");
            }
        })
        .catch(error => console.error("Error al obtener los datos:", error));
}

// Función para convertir el CSV a un array de objetos
function csvToArray(str) {
    const rows = str.split("\n");
    const headers = rows[0].split(",");
    return rows.slice(1).map(row => {
        const values = row.split(",");
        let obj = {};
        headers.forEach((header, i) => {
            obj[header.trim()] = values[i].trim();
        });
        return obj;
    });
}

// Función para mostrar la información del producto en la página
function displayProductInfo(product) {
    document.getElementById('productCode').textContent = product['Escanear código de barras'];
    document.getElementById('productName').textContent = product['Nombre del producto'];
    document.getElementById('productUnits').textContent = product['Unidades'];
    document.getElementById('productDescription').textContent = product['Descripción del producto'];
    document.getElementById('productWarehouse').textContent = product['Almacén del producto'];
}
