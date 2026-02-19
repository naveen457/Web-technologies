// Global XML Document
let xmlDoc = null;

// Get Input Elements (Once)
const bidInput = document.getElementById("bid");
const titleInput = document.getElementById("title");
const authorInput = document.getElementById("author");
const statusInput = document.getElementById("status");
const msgDiv = document.getElementById("msg");
const tableBody = document.getElementById("bookTable");


// Load XML using AJAX
function loadXML() {

    let xhr = new XMLHttpRequest();

    xhr.open("GET", "books.xml", true);

    xhr.onreadystatechange = function () {

        if (xhr.readyState === 4) {

            if (xhr.status === 200) {

                try {

                    xmlDoc = xhr.responseXML;

                    if (!xmlDoc) {
                        throw "Invalid XML";
                    }

                    displayBooks();

                } catch (e) {
                    showMessage("XML Parsing Error", "red");
                }

            } else {
                showMessage("Failed to Load XML File", "red");
            }
        }
    };

    xhr.send();
}


// Display Books (READ)
function displayBooks() {

    tableBody.innerHTML = "";

    let books = xmlDoc.getElementsByTagName("book");

    if (books.length === 0) {
        showMessage("No Books Available", "orange");
        return;
    }

    for (let i = 0; i < books.length; i++) {

        let id = books[i].getElementsByTagName("id")[0].textContent;
        let title = books[i].getElementsByTagName("title")[0].textContent;
        let author = books[i].getElementsByTagName("author")[0].textContent;
        let status = books[i].getElementsByTagName("status")[0].textContent;

        let row = `
            <tr>
                <td>${id}</td>
                <td>${title}</td>
                <td>${author}</td>
                <td>${status}</td>
            </tr>
        `;

        tableBody.innerHTML += row;
    }

    showMessage("Books Loaded Successfully", "green");
}


// Validate Input
function validateAllFields() {

    let id = bidInput.value.trim();
    let title = titleInput.value.trim();
    let author = authorInput.value.trim();
    let status = statusInput.value.trim();

    if (id === "" || title === "" || author === "" || status === "") {
        showMessage("All Fields Are Required", "red");
        return false;
    }

    if (status !== "Available" && status !== "Issued") {
        showMessage("Status Must Be: Available or Issued", "red");
        return false;
    }

    return true;
}


// Clear Input Fields
function clearFields() {

    bidInput.value = "";
    titleInput.value = "";
    authorInput.value = "";
    statusInput.value = "";
}


// CREATE - Add Book
function addBook() {

    if (!validateAllFields()) return;

    let id = bidInput.value.trim();
    let title = titleInput.value.trim();
    let author = authorInput.value.trim();
    let status = statusInput.value.trim();

    let books = xmlDoc.getElementsByTagName("book");

    // Check Duplicate ID
    for (let i = 0; i < books.length; i++) {

        let bookId = books[i]
            .getElementsByTagName("id")[0]
            .textContent;

        if (bookId === id) {
            showMessage("Book ID Already Exists", "red");
            return;
        }
    }

    let book = xmlDoc.createElement("book");

    let idNode = xmlDoc.createElement("id");
    idNode.textContent = id;

    let titleNode = xmlDoc.createElement("title");
    titleNode.textContent = title;

    let authorNode = xmlDoc.createElement("author");
    authorNode.textContent = author;

    let statusNode = xmlDoc.createElement("status");
    statusNode.textContent = status;

    book.appendChild(idNode);
    book.appendChild(titleNode);
    book.appendChild(authorNode);
    book.appendChild(statusNode);

    xmlDoc
        .getElementsByTagName("library")[0]
        .appendChild(book);

    displayBooks();
    clearFields();

    showMessage("Book Added Successfully", "green");
}


// UPDATE - Change Status
function updateBook() {

    let id = bidInput.value.trim();
    let newStatus = statusInput.value;

    if (id === "") {
        showMessage("Enter Book ID", "red");
        return;
    }

    if (newStatus === "") {
        showMessage("Select Status", "red");
        return;
    }

    let books = xmlDoc.getElementsByTagName("book");

    let found = false;

    for (let i = 0; i < books.length; i++) {

        let bookId = books[i]
            .getElementsByTagName("id")[0]
            .textContent;

        if (bookId === id) {

            books[i]
                .getElementsByTagName("status")[0]
                .textContent = newStatus;

            found = true;
            break;
        }
    }

    if (found) {

        displayBooks();
        clearFields();

        showMessage("Status Updated Successfully", "green");

    } else {
        showMessage("Book ID Not Found", "red");
    }
}


// DELETE - Remove Book
function deleteBook() {

    let id = bidInput.value.trim();

    if (id === "") {
        showMessage("Enter Book ID", "red");
        return;
    }

    let books = xmlDoc.getElementsByTagName("book");

    let found = false;

    for (let i = 0; i < books.length; i++) {

        let bookId = books[i]
            .getElementsByTagName("id")[0]
            .textContent;

        if (bookId === id) {

            books[i].parentNode.removeChild(books[i]);

            found = true;
            break;
        }
    }

    if (found) {

        displayBooks();
        clearFields();

        showMessage("Book Deleted Successfully", "green");

    } else {
        showMessage("Book Not Found", "red");
    }
}


// Show Message
function showMessage(msg, color) {

    msgDiv.textContent = msg;
    msgDiv.style.color = color;
}


// Load on Page Start
window.onload = loadXML;