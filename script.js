// Inicializa el escáner de códigos de barras
Quagga.init({
    inputStream: {
        type: "LiveStream",
        constraints: {
            facingMode: "environment"  // Activamos la cámara trasera
        },
        area: { 
            top: "0%",    // Top del área de escaneo
            left: "0%",   // Left del área de escaneo
            width: "100%",  // Ancho completo
            height: "100%"  // Altura completa
        }
    },
    decoder: {
        readers: ["ean_reader", "ean_8_reader", "upc_reader"]  // Definir los tipos de códigos de barras a leer
}, function(err) {
    if (err) {
        console.log("Error al inicializar Quagga:", err);
        return;
    }
    Quagga.start();
});

// Función que se llama cada vez que se detecta un código de barras
Quagga.onDetected(function(result) {
    const barcode = result.codeResult.code;
    console.log("Código escaneado:", barcode);

    // Llamamos a una función para obtener los datos de ese código
    fetchProductData(barcode);
});

// Función que consulta los datos del producto según el código
function fetchProductData(barcode) {
    fetch("https://docs.google.com/spreadsheets/d/e/2PACX-1vSKHNIwPCopFbz6NDE-S2FM6U8NwtY696GXiqc4jv_ibp2eji-AHbXW_uIZJmGL9F5ErxCYqrZnoKgI/pub?output=csv")  // Enlace correcto al archivo CSV de Google Sheets
        .then(response => response.text())
        .then(data => {
            const products = csvToArray(data);  // Convertir CSV a array
            const product = products.find(p => p['Escanear código de barras'] === barcode);

            if (product) {
                displayProductInfo(product);  // Mostrar los resultados en la interfaz
            } else {
                alert("Producto no encontrado");
            }
        })
        .catch(error => console.error("Error al obtener los datos:", error));
}

// Función para convertir el CSV en un array de objetos
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

// Función para mostrar los datos del producto en la interfaz
function displayProductInfo(product) {
    document.getElementById('productCode').textContent = product['Escanear código de barras'];
    document.getElementById('productName').textContent = product['Nombre del producto'];
    document.getElementById('productUnits').textContent = product['Unidades'];
    document.getElementById('productDescription').textContent = product['Descripción del producto'];
    document.getElementById('productWarehouse').textContent = product['Almacén del producto'];
}
