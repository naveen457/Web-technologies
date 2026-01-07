const STORAGE_KEY = "users"; // localStorage key

const registrationForm = document.getElementById("registrationForm");
const usersTableBody = document.getElementById("usersTableBody");
const clearAllBtn = document.getElementById("clearAllBtn");
const messageBox = document.getElementById("message");

function showMessage(text, type = "success") {
  messageBox.textContent = text;
  messageBox.className = "message " + type;
  messageBox.style.display = "block";
  setTimeout(() => {
    messageBox.style.display = "none";
  }, 3000);
}

function getUsers() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

function saveUsers(users) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

function renderUsers() {
  const users = getUsers();
  usersTableBody.innerHTML = "";

  users.forEach((user, index) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${index + 1}</td>
      <td>${user.name}</td>
      <td>${user.email}</td>
      <td>${user.mobile}</td>
      <td><button class="btn-secondary" data-email="${user.email}">Delete</button></td>
    `;

    usersTableBody.appendChild(tr);
  });
}

function isDuplicateEmail(email) {
  const users = getUsers();
  return users.some((u) => u.email.toLowerCase() === email.toLowerCase());
}

registrationForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const mobile = document.getElementById("mobile").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!name || !email || !mobile || !password) {
    showMessage("All fields are mandatory.", "error");
    return;
  }

  if (!/^[0-9]{10}$/.test(mobile)) {
    showMessage("Mobile number must be exactly 10 digits.", "error");
    return;
  }

  if (password.length < 6) {
    showMessage("Password must be at least 6 characters.", "error");
    return;
  }

  if (isDuplicateEmail(email)) {
    showMessage("This email is already registered.", "error");
    return;
  }

  const newUser = { name, email, mobile, password };

  const users = getUsers();
  users.push(newUser);
  saveUsers(users);

  registrationForm.reset();
  renderUsers();
  showMessage("User registered successfully.", "success");
});

usersTableBody.addEventListener("click", function (e) {
  if (e.target.tagName === "BUTTON") {
    const email = e.target.getAttribute("data-email");
    let users = getUsers();
    users = users.filter((u) => u.email !== email);
    saveUsers(users);
    renderUsers();
    showMessage("User deleted successfully.", "success");
  }
});

clearAllBtn.addEventListener("click", function () {
  if (confirm("Are you sure you want to delete all users?")) {
    localStorage.removeItem(STORAGE_KEY);
    renderUsers();
    showMessage("All users cleared.", "success");
  }
});

renderUsers();
