// URL del Google Sheets en formato CSV
const csvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSKHNIwPCopFbz6NDE-S2FM6U8NwtY696GXiqc4jv_ibp2eji-AHbXW_uIZJmGL9F5ErxCYqrZnoKgI/pub?output=csv";

// Variables de ZXing
let selectedWarehouse = 'A';
let videoElement = document.getElementById('video');
let scanner;

// Iniciar el escáner
document.getElementById('startScanner').addEventListener('click', () => {
    document.getElementById('scannerContainer').style.display = 'block';
    startScanner();
});

// Cambiar almacén
document.getElementById('warehouseSelector').addEventListener('change', (e) => {
    selectedWarehouse = e.target.value;
    showProductsForWarehouse(selectedWarehouse);
});

// Configurar ZXing para escaneo
function startScanner() {
    scanner = new ZXing.BrowserMultiFormatReader();
    scanner.decodeOnceFromVideoDevice(undefined, 'video').then(result => {
        console.log(result);
        const productCode = result.getText();
        fetchAndDisplayProductDetails(productCode);
    }).catch(err => {
        console.error("Error al escanear:", err);
    });
}

// Función para obtener y mostrar productos del almacén seleccionado
function showProductsForWarehouse(warehouse) {
    fetch(csvUrl)
        .then(response => response.text())
        .then(data => {
            const rows = data.split("\n");
            const products = rows.map(row => row.split(","));
            const productList = document.getElementById("productList");
            productList.innerHTML = '';

            products.forEach(product => {
                const almacén = product[6]?.trim().toLowerCase();
                if (almacén === warehouse.toLowerCase() || almacén === `almacén ${warehouse.toLowerCase()}`) {
                    const productElement = document.createElement("div");
                    productElement.classList.add("product");
                    productElement.innerHTML = `
                        <strong>Nombre:</strong> ${product[3]} <br>
                        <strong>Unidades:</strong> ${product[4]} <br>
                        <strong>Descripción:</strong> ${product[5]} <br>
                    `;
                    productList.appendChild(productElement);
                }
            });
        }).catch(error => console.error("Error al cargar los productos:", error));
}

// Función para buscar el producto por código de barras
function fetchAndDisplayProductDetails(productCode) {
    fetch(csvUrl)
        .then(response => response.text())
        .then(data => {
            const rows = data.split("\n");
            const products = rows.map(row => row.split(","));
            const productList = document.getElementById("productList");

            let foundProduct = false;
            products.forEach(product => {
                if (product[0].trim() === productCode) {
                    foundProduct = true;
                    const productElement = document.createElement("div");
                    productElement.classList.add("product");
                    productElement.innerHTML = `
                        <strong>Nombre:</strong> ${product[3]} <br>
                        <strong>Unidades:</strong> ${product[4]} <br>
                        <strong>Descripción:</strong> ${product[5]} <br>
                    `;
                    productList.innerHTML = ''; // Limpiar la lista antes de mostrar el producto escaneado
                    productList.appendChild(productElement);
                }
            });

            if (!foundProduct) {
                alert("Producto no encontrado.");
            }
        }).catch(error => console.error("Error al cargar los productos:", error));
}

// Iniciar con el almacén A
showProductsForWarehouse('A');

