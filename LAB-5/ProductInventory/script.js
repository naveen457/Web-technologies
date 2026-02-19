// Global Data
let inventoryData = [];

// Inputs
const idInput = document.getElementById("pid");
const nameInput = document.getElementById("pname");
const categoryInput = document.getElementById("category");
const priceInput = document.getElementById("price");
const stockInput = document.getElementById("stock");

const searchInput = document.getElementById("searchCat");

const tableBody = document.getElementById("productTable");
const msgDiv = document.getElementById("msg");
const totalDiv = document.getElementById("total");


// Load JSON
function loadInventory() {

    fetch("inventory.json")

        .then(response => {

            if (!response.ok) {
                throw "File Not Found";
            }

            return response.json();
        })

        .then(data => {

            inventoryData = data.products;

            displayProducts(inventoryData);
        })

        .catch(error => {

            showMessage("JSON Load Error", "red");
            console.log(error);
        });
}


// Display Products
function displayProducts(data) {

    tableBody.innerHTML = "";

    let totalValue = 0;

    if (data.length === 0) {

        showMessage("No Products Found", "orange");
        totalDiv.textContent = "";
        return;
    }

    data.forEach(product => {

        let value = product.price * product.stock;
        totalValue += value;

        let rowClass = product.stock < 5 ? "low-stock" : "";

        let row = `
            <tr class="${rowClass}">
                <td>${product.id}</td>
                <td>${product.name}</td>
                <td>${product.category}</td>
                <td>${product.price}</td>
                <td>${product.stock}</td>
            </tr>
        `;

        tableBody.innerHTML += row;
    });

    totalDiv.textContent =
        "Total Inventory Value: ₹ " + totalValue;

    showMessage("Inventory Loaded", "green");
}


// Validation
function validateFields() {

    let id = idInput.value.trim();
    let name = nameInput.value.trim();
    let cat = categoryInput.value.trim();
    let price = priceInput.value.trim();
    let stock = stockInput.value.trim();

    if (id === "" || name === "" || cat === "" ||
        price === "" || stock === "") {

        showMessage("All Fields Required", "red");
        return false;
    }

    if (price <= 0 || stock < 0) {

        showMessage("Invalid Price or Stock", "red");
        return false;
    }

    return true;
}


// Clear Inputs
function clearFields() {

    idInput.value = "";
    nameInput.value = "";
    categoryInput.value = "";
    priceInput.value = "";
    stockInput.value = "";
}


// CREATE
function addProduct() {

    if (!validateFields()) return;

    let id = idInput.value.trim();

    let exists = inventoryData.some(p => p.id === id);

    if (exists) {

        showMessage("Product ID Exists", "red");
        return;
    }

    let product = {

        id: id,
        name: nameInput.value.trim(),
        category: categoryInput.value.trim(),
        price: Number(priceInput.value),
        stock: Number(stockInput.value)
    };

    inventoryData.push(product);

    displayProducts(inventoryData);
    clearFields();

    showMessage("Product Added", "green");
}


// UPDATE
function updateProduct() {

    let id = idInput.value.trim();

    if (id === "") {

        showMessage("Enter Product ID", "red");
        return;
    }

    let index = inventoryData.findIndex(p => p.id === id);

    if (index === -1) {

        showMessage("Product Not Found", "red");
        return;
    }

    let price = priceInput.value.trim();
    let stock = stockInput.value.trim();

    if (price !== "") {

        if (price <= 0) {
            showMessage("Invalid Price", "red");
            return;
        }

        inventoryData[index].price = Number(price);
    }

    if (stock !== "") {

        if (stock < 0) {
            showMessage("Invalid Stock", "red");
            return;
        }

        inventoryData[index].stock = Number(stock);
    }

    displayProducts(inventoryData);
    clearFields();

    showMessage("Product Updated", "green");
}


// DELETE
function deleteProduct() {

    let id = idInput.value.trim();

    if (id === "") {

        showMessage("Enter Product ID", "red");
        return;
    }

    let index = inventoryData.findIndex(p => p.id === id);

    if (index === -1) {

        showMessage("Product Not Found", "red");
        return;
    }

    inventoryData.splice(index, 1);

    displayProducts(inventoryData);
    clearFields();

    showMessage("Product Deleted", "green");
}


// SEARCH
function searchByCategory() {

    let cat = searchInput.value.trim();

    if (cat === "") {

        showMessage("Enter Category", "red");
        return;
    }

    let result = inventoryData.filter(
        p => p.category.toLowerCase() === cat.toLowerCase()
    );

    displayProducts(result);

    showMessage("Search Completed", "green");
}


// RESET SEARCH
function resetSearch() {

    searchInput.value = "";

    displayProducts(inventoryData);

    showMessage("Search Reset", "green");
}


// Message
function showMessage(msg, color) {

    msgDiv.textContent = msg;
    msgDiv.style.color = color;
}


// Load on Start
window.onload = loadInventory;