let xmlDoc = null;

// Load XML using AJAX
function loadXML() {

    let xhr = new XMLHttpRequest();

    xhr.open("GET", "employees.xml", true);

    xhr.onreadystatechange = function () {

        if (xhr.readyState === 4) {

            if (xhr.status === 200) {

                try {
                    xmlDoc = xhr.responseXML;

                    if (!xmlDoc) {
                        throw "Invalid XML";
                    }

                    displayEmployees();

                } catch (e) {
                    showMessage("XML Parsing Error", "red");
                }

            } else {
                showMessage("Cannot load XML file", "red");
            }
        }
    };

    xhr.send();
}


// Display Employees (READ)
function displayEmployees() {

    let table = document.getElementById("empTable");
    table.innerHTML = "";

    let employees = xmlDoc.getElementsByTagName("employee");

    if (employees.length === 0) {
        showMessage("No Employees Found", "orange");
        return;
    }

    for (let i = 0; i < employees.length; i++) {

        let id = employees[i].getElementsByTagName("id")[0].textContent;
        let name = employees[i].getElementsByTagName("name")[0].textContent;
        let dept = employees[i].getElementsByTagName("department")[0].textContent;
        let sal = employees[i].getElementsByTagName("salary")[0].textContent;

        let row = `
            <tr>
                <td>${id}</td>
                <td>${name}</td>
                <td>${dept}</td>
                <td>${sal}</td>
            </tr>
        `;

        table.innerHTML += row;
    }

    showMessage("Employees Loaded", "green");
}


// ADD (CREATE)
function addEmployee() {

    if (!xmlDoc) {
        showMessage("XML not loaded", "red");
        return;
    }

    let id = eid.value;
    let name = ename.value;
    let dept = document.getElementById("dept").value;
    let sal = salary.value;

    if (!id || !name || !dept || !sal) {
        showMessage("Fill all fields", "red");
        return;
    }

    let emp = xmlDoc.createElement("employee");

    let idNode = xmlDoc.createElement("id");
    idNode.textContent = id;

    let nameNode = xmlDoc.createElement("name");
    nameNode.textContent = name;

    let deptNode = xmlDoc.createElement("department");
    deptNode.textContent = dept;

    let salNode = xmlDoc.createElement("salary");
    salNode.textContent = sal;

    emp.appendChild(idNode);
    emp.appendChild(nameNode);
    emp.appendChild(deptNode);
    emp.appendChild(salNode);

    xmlDoc.getElementsByTagName("employees")[0].appendChild(emp);

    displayEmployees();

    showMessage("Employee Added", "green");
}


// UPDATE
function updateEmployee() {

    let id = eid.value;

    if (!id) {
        showMessage("Enter ID to Update", "red");
        return;
    }

    let employees = xmlDoc.getElementsByTagName("employee");

    let found = false;

    for (let i = 0; i < employees.length; i++) {

        let empId = employees[i]
            .getElementsByTagName("id")[0]
            .textContent;

        if (empId === id) {

            employees[i]
                .getElementsByTagName("department")[0]
                .textContent = dept.value;

            employees[i]
                .getElementsByTagName("salary")[0]
                .textContent = salary.value;

            found = true;
            break;
        }
    }

    if (found) {
        displayEmployees();
        showMessage("Employee Updated", "green");
    } else {
        showMessage("Employee Not Found", "red");
    }
}


// DELETE
function deleteEmployee() {

    let id = eid.value;

    if (!id) {
        showMessage("Enter ID to Delete", "red");
        return;
    }

    let employees = xmlDoc.getElementsByTagName("employee");

    let found = false;

    for (let i = 0; i < employees.length; i++) {

        let empId = employees[i]
            .getElementsByTagName("id")[0]
            .textContent;

        if (empId === id) {

            employees[i].parentNode.removeChild(employees[i]);

            found = true;
            break;
        }
    }

    if (found) {
        displayEmployees();
        showMessage("Employee Deleted", "green");
    } else {
        showMessage("Employee Not Found", "red");
    }
}


// Message Display
function showMessage(msg, color) {

    let m = document.getElementById("msg");
    m.textContent = msg;
    m.style.color = color;
}


// Load XML on Page Load
window.onload = loadXML;