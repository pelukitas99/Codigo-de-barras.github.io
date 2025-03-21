// Espera que el usuario haga clic en el botón para activar la cámara
document.getElementById("startCameraButton").addEventListener("click", function() {
    // Verifica si el navegador tiene soporte para acceder a la cámara
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({
            video: { facingMode: "environment" } // Usar la cámara trasera
        }).then(function(stream) {
            // Si la cámara se accede correctamente, mostrarla
            const video = document.createElement("video");
            video.srcObject = stream;
            video.setAttribute("autoplay", true);
            document.getElementById("scanner-container").appendChild(video);

            // Iniciar Quagga para escanear el código de barras
            Quagga.init({
                inputStream: {
                    type: "LiveStream",
                    constraints: {
                        facingMode: "environment" // Activar cámara trasera
                    },
                    area: { 
                        top: "0%",    // Top del área de escaneo
                        left: "0%",   // Left del área de escaneo
                        width: "100%",  // Ancho completo
                        height: "100%"  // Altura completa
                    }
                },
                decoder: {
                    readers: ["ean_reader", "ean_8_reader", "upc_reader"]  // Decodificadores de código de barras
                }
            }, function(err) {
                if (err) {
                    console.log("Error al inicializar Quagga:", err);
                    return;
                }
                Quagga.start();  // Iniciar escaneo
            });

            // Detectar el código de barras cuando se escanee
            Quagga.onDetected(function(result) {
                const barcode = result.codeResult.code;
                console.log("Código escaneado:", barcode);

                // Llamar a la función para obtener datos del producto
                fetchProductData(barcode);
            });
        }).catch(function(err) {
            console.log("Error al acceder a la cámara:", err);
            alert("No se pudo acceder a la cámara.");
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

