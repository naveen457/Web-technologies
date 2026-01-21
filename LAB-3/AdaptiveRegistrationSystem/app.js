const form = document.getElementById("registrationForm");

const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirmPassword");
const ageInput = document.getElementById("age");
const roleSelect = document.getElementById("role");
const skillsInput = document.getElementById("skills");
const studentIdInput = document.getElementById("studentId");

const skillsWrapper = document.getElementById("skillsWrapper");
const studentIdWrapper = document.getElementById("studentIdWrapper");

// Utility: show / clear error
function setError(inputEl, errorId, message) {
  const errorSpan = document.getElementById(errorId);
  if (message) {
    errorSpan.textContent = message;
    inputEl.classList.add("invalid");
  } else {
    errorSpan.textContent = "";
    inputEl.classList.remove("invalid");
  }
}

// Email validation with domain check
function validateEmail() {
  const value = emailInput.value.trim();
  let valid = true;

  // Basic email regex (simplified) [web:7][web:10]
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(value)) {
    setError(emailInput, "emailError", "Enter a valid email address.");
    valid = false;
  } else {
    // Domain rule: only allow example.com, school.edu, college.edu.in etc.
    const allowedDomains = ["gmail.com", "vitap.ac.in", "vitapstudent.ac.in"];
    const domain = value.split("@")[1];
    if (!allowedDomains.includes(domain)) {
      setError(emailInput, "emailError", "Email domain not allowed.");
      valid = false;
    } else {
      setError(emailInput, "emailError", "");
    }
  }
  return valid;
}

// Password strength rules depend on role
function getPasswordRules(role) {
  // Common minimal rule
  let minLength = 6;
  let regex = /^(?=.*[a-z])(?=.*[0-9]).{6,}$/;
  let message =
    "Password must be at least 6 characters and contain a letter and a number.";

  if (role === "teacher") {
    minLength = 8;
    regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,}$/;
    message =
      "Password must be at least 8 characters and contain upper, lower case and a number.";
  }

  if (role === "admin") {
    minLength = 10;
    // strong password regex (upper, lower, digit, special, length >=10) [web:6][web:9]
    regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*]).{10,}$/;
    message =
      "Password must be at least 10 characters and include upper, lower, number, and special character.";
  }

  return { minLength, regex, message };
}

function validatePassword() {
  const role = roleSelect.value;
  const value = passwordInput.value;
  const { regex, message } = getPasswordRules(role || "student");

  if (!regex.test(value)) {
    setError(passwordInput, "passwordError", message);
    return false;
  }
  setError(passwordInput, "passwordError", "");
  return true;
}

function validateConfirmPassword() {
  if (confirmPasswordInput.value !== passwordInput.value) {
    setError(confirmPasswordInput, "confirmPasswordError", "Passwords do not match.");
    return false;
  }
  setError(confirmPasswordInput, "confirmPasswordError", "");
  return true;
}

function validateName() {
  if (nameInput.value.trim().length < 2) {
    setError(nameInput, "nameError", "Name must be at least 2 characters.");
    return false;
  }
  setError(nameInput, "nameError", "");
  return true;
}

function validateAge() {
  const age = Number(ageInput.value);
  if (!age || age < 13) {
    setError(ageInput, "ageError", "Age must be 13 or above.");
    return false;
  }
  setError(ageInput, "ageError", "");
  return true;
}

function validateRole() {
  if (!roleSelect.value) {
    setError(roleSelect, "roleError", "Please select a role.");
    return false;
  }
  setError(roleSelect, "roleError", "");
  return true;
}

function validateSkills() {
  if (!skillsWrapper.classList.contains("hidden")) {
    if (skillsInput.value.trim().length === 0) {
      setError(skillsInput, "skillsError", "Please enter at least one skill.");
      return false;
    }
    setError(skillsInput, "skillsError", "");
  }
  return true;
}

function validateStudentId() {
  if (!studentIdWrapper.classList.contains("hidden")) {
    if (studentIdInput.value.trim().length < 4) {
      setError(studentIdInput, "studentIdError", "Student ID must be at least 4 characters.");
      return false;
    }
    setError(studentIdInput, "studentIdError", "");
  }
  return true;
}

// Adjust visible fields when role changes
function updateFieldsByRole() {
  const role = roleSelect.value;

  if (role === "student") {
    studentIdWrapper.classList.remove("hidden");
    skillsWrapper.classList.add("hidden");
    skillsInput.value = "";
    setError(skillsInput, "skillsError", "");
  } else if (role === "teacher" || role === "admin") {
    skillsWrapper.classList.remove("hidden");
    studentIdWrapper.classList.add("hidden");
    studentIdInput.value = "";
    setError(studentIdInput, "studentIdError", "");
  } else {
    // No role selected
    skillsWrapper.classList.add("hidden");
    studentIdWrapper.classList.add("hidden");
  }

  // Revalidate password with new role rules
  validatePassword();
}

// Real-time validation listeners
emailInput.addEventListener("input", validateEmail);
passwordInput.addEventListener("input", () => {
  validatePassword();
  validateConfirmPassword();
});
confirmPasswordInput.addEventListener("input", validateConfirmPassword);
nameInput.addEventListener("input", validateName);
ageInput.addEventListener("input", validateAge);
roleSelect.addEventListener("change", () => {
  validateRole();
  updateFieldsByRole();
});
skillsInput.addEventListener("input", validateSkills);
studentIdInput.addEventListener("input", validateStudentId);

// On submit, prevent submission if any rule fails
form.addEventListener("submit", function (e) {
  e.preventDefault();

  const isValid =
    validateName() &&
    validateEmail() &&
    validatePassword() &&
    validateConfirmPassword() &&
    validateAge() &&
    validateRole() &&
    validateSkills() &&
    validateStudentId();

  if (isValid) {
    alert("Form submitted successfully!");
    // Here you can actually submit via AJAX or form.submit()
  } else {
    alert("Please fix the highlighted errors before submitting.");
  }
});
