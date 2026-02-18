const form = document.getElementById("studentForm");
const tableBody = document.getElementById("tableBody");
const statusDiv = document.getElementById("status");

let editMode = false;
let editId = null;


// Load students when page loads
window.onload = fetchStudents;


// ================= FETCH (READ) =================
function fetchStudents() {

    fetch("students.json")

        .then(res => {

            if (res.status === 200) {
                return res.json();
            } else if (res.status === 404) {
                throw new Error("404 Not Found");
            } else {
                throw new Error("Server Error");
            }
        })

        .then(data => {
            displayStudents(data.students);
        })

        .catch(err => {
            showError(err.message);
        });
}


// ================= DISPLAY =================
function displayStudents(students) {

    tableBody.innerHTML = "";

    students.forEach(s => {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${s.id}</td>
            <td>${s.name}</td>
            <td>${s.department}</td>
            <td>${s.marks}</td>

            <td>
                <button onclick="editStudent('${s.id}')">Edit</button>
                <button onclick="deleteStudent('${s.id}')">Delete</button>
            </td>
        `;

        tableBody.appendChild(row);
    });
}


// ================= CREATE + UPDATE =================
form.addEventListener("submit", function (e) {

    e.preventDefault();

    const student = {
        id: id.value,
        name: name.value,
        department: dept.value,
        marks: Number(marks.value)
    };

    if (editMode) {
        updateStudent(student);
    } else {
        addStudent(student);
    }

    form.reset();
});


// ================= CREATE =================
function addStudent(student) {

    fetch("students.json")

        .then(res => res.json())

        .then(data => {

            data.students.push(student);

            displayStudents(data.students);

            showSuccess("Student Added Successfully");

        })

        .catch(() => {
            showError("Add Failed");
        });
}


// ================= EDIT =================
function editStudent(id) {

    fetch("students.json")

        .then(res => res.json())

        .then(data => {

            const s = data.students.find(x => x.id === id);

            id.value = s.id;
            name.value = s.name;
            dept.value = s.department;
            marks.value = s.marks;

            editMode = true;
            editId = id;

        });
}


// ================= UPDATE =================
function updateStudent(student) {

    fetch("students.json")

        .then(res => res.json())

        .then(data => {

            const index = data.students.findIndex(s => s.id === editId);

            data.students[index] = student;

            displayStudents(data.students);

            editMode = false;

            showSuccess("Student Updated");

        })

        .catch(() => {
            showError("Update Failed");
        });
}


// ================= DELETE =================
function deleteStudent(id) {

    if (!confirm("Delete this student?")) return;

    fetch("students.json")

        .then(res => res.json())

        .then(data => {

            const filtered = data.students.filter(s => s.id !== id);

            displayStudents(filtered);

            showSuccess("Student Deleted");

        })

        .catch(() => {
            showError("Delete Failed");
        });
}


// ================= MESSAGES =================
function showSuccess(msg) {

    statusDiv.innerText = msg;
    statusDiv.className = "success";

    setTimeout(() => statusDiv.innerText = "", 2000);
}

function showError(msg) {

    statusDiv.innerText = msg;
    statusDiv.className = "error";
}