document.getElementById('barcodeInput').addEventListener('change', handleBarcodeScan);

function handleBarcodeScan(event) {
    const barcode = event.target.files[0]; // Obtenemos la imagen del código de barras

    if (barcode) {
        // Aquí agregaremos el código para leer el código de barras y buscar el producto
        scanBarcode(barcode);
    }
}

function scanBarcode(barcodeImage) {
    // Simulación: normalmente usaríamos una librería como 'jsQR' o un servicio de API de escaneo de códigos de barras
    const barcodeValue = '123456';  // Este es el valor que obtendrías de la lectura del código de barras.

    // Buscar el producto en Google Sheets
    fetchProductData(barcodeValue);
}

function fetchProductData(barcode) {
    const sheetUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSKHNIwPCopFbz6NDE-S2FM6U8NwtY696GXiqc4jv_ibp2eji-AHbXW_uIZJmGL9F5ErxCYqrZnoKgI/pub?output=csv';
    
    fetch(sheetUrl)
        .then(response => response.text())
        .then(data => {
            const rows = data.split("\n");
            const products = rows.map(row => row.split(","));
            
            // Aquí filtramos los productos para encontrar el que coincide con el código de barras
            const product = products.find(p => p[0].trim() === barcode); // El código de barras está en la primera columna

            if (product) {
                displayProductInfo(product);
            } else {
                alert('Producto no encontrado');
            }
        })
        .catch(error => console.error('Error al cargar los productos:', error));
}

function displayProductInfo(product) {
    document.getElementById('productName').textContent = `Nombre: ${product[3]}`;
    document.getElementById('productUnits').textContent = `Unidades: ${product[4]}`;
    document.getElementById('productDescription').textContent = `Descripción: ${product[5]}`;
    document.getElementById('productLocation').textContent = `Ubicación: ${product[6]}`;
}
