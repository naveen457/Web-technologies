// 1. Structure to store questions and their types
const surveyQuestions = [
  {
    id: "name",
    type: "text",
    label: "What is your full name?",
    required: true,
    minLength: 2,
    maxLength: 50
  },
  {
    id: "age",
    type: "text",
    label: "What is your age?",
    required: true,
    pattern: /^[1-9][0-9]*$/,
    errorMessage: "Age must be a number"
  },
  {
    id: "experience",
    type: "radio",
    label: "How would you rate your JavaScript experience?",
    required: true,
    options: [
      { value: "beginner", text: "Beginner" },
      { value: "intermediate", text: "Intermediate" },
      { value: "advanced", text: "Advanced" },
      { value: "expert", text: "Expert" }
    ]
  },
  {
    id: "tools",
    type: "checkbox",
    label: "Which tools do you use?",
    required: true,
    minSelected: 1,
    maxSelected: 4,
    options: [
      { value: "vscode", text: "VS Code" },
      { value: "intellij", text: "IntelliJ" },
      { value: "pycharm", text: "PyCharm" },
      { value: "git", text: "Git" },
      { value: "github", text: "GitHub" }
    ]
  },
  {
    id: "comments",
    type: "text",
    label: "Any comments?",
    required: false,
    maxLength: 200
  }
];

// 2. Generate dynamic form fields
function generateSurvey() {
  const form = document.getElementById("surveyForm");
  form.innerHTML = ""; // clear old inputs

  surveyQuestions.forEach(q => {
    const questionDiv = document.createElement("div");
    questionDiv.className = "question";

    const label = document.createElement("label");
    label.textContent = q.label;
    if (q.required) {
      label.innerHTML += " <span style='color:red'>*</span>";
    }
    questionDiv.appendChild(label);

    if (q.type === "text") {
      const input = document.createElement("input");
      input.type = "text";
      input.id = q.id;
      input.name = q.id;
      input.className = "form-control";
      if (q.required) input.required = true;
      if (q.minLength) input.minLength = q.minLength;
      if (q.maxLength) input.maxLength = q.maxLength;

      if (q.placeholder) {
        input.placeholder = q.placeholder;
      }

      questionDiv.appendChild(input);
    } else if (q.type === "radio" || q.type === "checkbox") {
      const optionsList = document.createElement("div");
      optionsList.className = "options-list";

      q.options.forEach(opt => {
        const wrapper = document.createElement("div");
        wrapper.className = "option-item";

        const input = document.createElement("input");
        input.type = q.type;
        input.name = q.id;
        input.value = opt.value;

        if (q.required && q.type === "radio") {
          input.required = true;
        }

        const optionLabel = document.createElement("label");
        optionLabel.appendChild(input);
        optionLabel.appendChild(document.createTextNode(" " + opt.text));

        wrapper.appendChild(optionLabel);
        optionsList.appendChild(wrapper);
      });

      questionDiv.appendChild(optionsList);
    }

    // Add small description if needed
    if (q.description) {
      const desc = document.createElement("small");
      desc.textContent = q.description;
      questionDiv.appendChild(desc);
    }

    // Add error message placeholder
    const errorSpan = document.createElement("span");
    errorSpan.className = "error";
    errorSpan.id = `${q.id}Error`;
    errorSpan.style.display = "none";
    questionDiv.appendChild(errorSpan);

    form.appendChild(questionDiv);
  });

  // Add submit button
  const submitBtn = document.createElement("button");
  submitBtn.type = "submit";
  submitBtn.textContent = "Submit Survey";
  form.appendChild(submitBtn);

  // 3–4. Add validation on submit
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const isValid = validateSurvey();
    if (isValid) {
      showResults();
    }
  });
}

// 3–4. Validate input before submission
function validateSurvey() {
  let allValid = true;

  surveyQuestions.forEach(q => {
    const errorSpan = document.getElementById(`${q.id}Error`);
    errorSpan.style.display = "none";

    if (q.type === "text") {
      const input = document.getElementById(q.id);
      const value = (input.value || "").trim();

      if (q.required && value === "") {
        showError(q.id, "This field is required.");
        allValid = false;
      } else if (value.length > 0) {
        if (q.minLength && value.length < q.minLength) {
          showError(q.id, `Minimum ${q.minLength} characters required.`);
          allValid = false;
        }
        if (q.maxLength && value.length > q.maxLength) {
          showError(q.id, `Maximum ${q.maxLength} characters allowed.`);
          allValid = false;
        }
        if (q.pattern && value && !q.pattern.test(value)) {
          showError(q.id, q.errorMessage || "Invalid format.");
          allValid = false;
        }
      }
    } else if (q.type === "radio") {
      const inputs = document.querySelectorAll(`input[name="${q.id}"]`);
      const selected = Array.from(inputs).some(input => input.checked);

      if (q.required && !selected) {
        showError(q.id, "Please select an option.");
        allValid = false;
      }
    } else if (q.type === "checkbox") {
      const inputs = document.querySelectorAll(`input[name="${q.id}"]`);
      const selected = Array.from(inputs).filter(input => input.checked);

      if (q.required) {
        if (selected.length === 0) {
          showError(q.id, "At least one option must be selected.");
          allValid = false;
        } else if (q.minSelected && selected.length < q.minSelected) {
          showError(q.id, `At least ${q.minSelected} options must be selected.`);
          allValid = false;
        }
        if (q.maxSelected && selected.length > q.maxSelected) {
          showError(q.id, `Maximum ${q.maxSelected} options allowed.`);
          allValid = false;
        }
      }
    }
  });

  return allValid;
}

// 5. Show inline validation messages
function showError(inputId, message) {
  const errorSpan = document.getElementById(`${inputId}Error`);
  if (errorSpan) {
    errorSpan.textContent = message;
    errorSpan.style.display = "block";
  }
}

// 6. Show result (only if all valid)
function showResults() {
  const resultDiv = document.getElementById("surveyResult");
  resultDiv.innerHTML = "<h2>Survey Submitted</h2><ul>";

  surveyQuestions.forEach(q => {
    let value = "";

    if (q.type === "text") {
      const input = document.getElementById(q.id);
      value = input ? (input.value || "").trim() : "";
    } else if (q.type === "radio") {
      const selected = document.querySelector(`input[name="${q.id}"]:checked`);
      value = selected ? selected.value : "";
    } else if (q.type === "checkbox") {
      const checked = document.querySelectorAll(`input[name="${q.id}"]:checked`);
      value = Array.from(checked).map(cb => cb.value).join(", ");
    }

    if (value) {
      resultDiv.innerHTML += `<li><strong>${q.label}</strong>: ${value}</li>`;
    }
  });

  resultDiv.innerHTML += "</ul>";
  resultDiv.style.display = "block";
}

// Run on page load
document.addEventListener("DOMContentLoaded", generateSurvey);
