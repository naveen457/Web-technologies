// Global Data
let studentsData = [];

// Inputs
const idInput = document.getElementById("sid");
const nameInput = document.getElementById("sname");
const courseInput = document.getElementById("course");
const marksInput = document.getElementById("marks");

const tableBody = document.getElementById("studentTable");
const msgDiv = document.getElementById("msg");


// Load JSON using Fetch API
function loadStudents() {

    fetch("students.json")

        .then(response => {

            if (!response.ok) {
                throw "File Not Found";
            }

            return response.json();
        })

        .then(data => {

            studentsData = data.students;

            displayStudents();
        })

        .catch(error => {

            showMessage("JSON Load Error", "red");
            console.log(error);
        });
}


// Display Students (READ)
function displayStudents() {

    tableBody.innerHTML = "";

    if (studentsData.length === 0) {

        showMessage("No Records Found", "orange");
        return;
    }

    studentsData.forEach(student => {

        let row = `
            <tr>
                <td>${student.id}</td>
                <td>${student.name}</td>
                <td>${student.course}</td>
                <td>${student.marks}</td>
            </tr>
        `;

        tableBody.innerHTML += row;
    });

    showMessage("Records Loaded", "green");
}


// Validation
function validateFields() {

    let id = idInput.value.trim();
    let name = nameInput.value.trim();
    let course = courseInput.value.trim();
    let marks = marksInput.value.trim();

    if (id === "" || name === "" || course === "" || marks === "") {

        showMessage("All Fields Required", "red");
        return false;
    }

    if (marks < 0 || marks > 100) {

        showMessage("Marks must be 0 to 100", "red");
        return false;
    }

    return true;
}


// Clear Fields
function clearFields() {

    idInput.value = "";
    nameInput.value = "";
    courseInput.value = "";
    marksInput.value = "";
}


// CREATE
function addStudent() {

    if (!validateFields()) return;

    let id = idInput.value.trim();

    // Check Duplicate ID
    let exists = studentsData.some(s => s.id === id);

    if (exists) {

        showMessage("Student ID Exists", "red");
        return;
    }

    let student = {

        id: id,
        name: nameInput.value.trim(),
        course: courseInput.value.trim(),
        marks: Number(marksInput.value)
    };

    studentsData.push(student);

    displayStudents();
    clearFields();

    showMessage("Student Added", "green");
}


// UPDATE
function updateStudent() {

    let id = idInput.value.trim();

    if (id === "") {

        showMessage("Enter Student ID", "red");
        return;
    }

    let index = studentsData.findIndex(s => s.id === id);

    if (index === -1) {

        showMessage("Student Not Found", "red");
        return;
    }

    let course = courseInput.value.trim();
    let marks = marksInput.value.trim();

    if (course !== "") {

        studentsData[index].course = course;
    }

    if (marks !== "") {

        if (marks < 0 || marks > 100) {

            showMessage("Invalid Marks", "red");
            return;
        }

        studentsData[index].marks = Number(marks);
    }

    displayStudents();
    clearFields();

    showMessage("Student Updated", "green");
}


// DELETE
function deleteStudent() {

    let id = idInput.value.trim();

    if (id === "") {

        showMessage("Enter Student ID", "red");
        return;
    }

    let index = studentsData.findIndex(s => s.id === id);

    if (index === -1) {

        showMessage("Student Not Found", "red");
        return;
    }

    studentsData.splice(index, 1);

    displayStudents();
    clearFields();

    showMessage("Student Deleted", "green");
}


// Message
function showMessage(msg, color) {

    msgDiv.textContent = msg;
    msgDiv.style.color = color;
}


// Load On Start
window.onload = loadStudents;