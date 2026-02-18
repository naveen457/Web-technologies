const searchBox = document.getElementById("searchBox");
const resultsDiv = document.getElementById("results");
const statusDiv = document.getElementById("status");

let timer = null; // For debounce


// Debounce Input
searchBox.addEventListener("input", function () {

    clearTimeout(timer);

    timer = setTimeout(() => {

        const query = searchBox.value.trim();

        if (query !== "") {
            searchProducts(query);
        } else {
            resultsDiv.innerHTML = "";
            statusDiv.innerText = "";
        }

    }, 500); // 500ms delay
});


// AJAX Search
function searchProducts(query) {

    statusDiv.innerText = "Searching...";
    statusDiv.className = "loading";

    fetch("products.json")

        .then(response => {

            if (!response.ok) {
                throw new Error("Network Error");
            }

            return response.json();
        })

        .then(data => {

            const products = data.products;

            // Filter products
            const filtered = products.filter(product =>

                product.name.toLowerCase().includes(query.toLowerCase()) ||
                product.category.toLowerCase().includes(query.toLowerCase())
            );

            displayResults(filtered);

        })

        .catch(error => {

            statusDiv.innerText = "Failed to load products!";
            statusDiv.className = "error";

            console.log(error);
        });
}


// Display Products
function displayResults(products) {

    resultsDiv.innerHTML = "";
    statusDiv.innerText = "";

    if (products.length === 0) {

        statusDiv.innerText = "No results found";
        statusDiv.className = "error";

        return;
    }

    products.forEach(p => {

        const div = document.createElement("div");
        div.className = "product";

        div.innerHTML = `
            <strong>${p.name}</strong><br>
            Price: ₹${p.price}<br>
            Category: ${p.category}
        `;

        resultsDiv.appendChild(div);
    });
}