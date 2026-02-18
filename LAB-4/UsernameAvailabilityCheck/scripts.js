const usernameInput = document.getElementById("username");
const statusDiv = document.getElementById("status");
const form = document.getElementById("registerForm");

let isAvailable = false;


// Listen when user types
usernameInput.addEventListener("input", checkUsername);


// Check username using Fetch (AJAX)
function checkUsername() {

    const username = usernameInput.value.trim();

    // Clear if empty
    if (username === "") {
        statusDiv.innerText = "";
        return;
    }

    // Show loading
    statusDiv.innerText = "Checking...";
    statusDiv.className = "loading";

    // Simulate AJAX request
    fetch("users.json")

        .then(response => response.json())

        .then(data => {

            // Simulate delay (optional)
            setTimeout(() => {

                const users = data.users;

                if (users.includes(username.toLowerCase())) {

                    statusDiv.innerText = "❌ Username already taken";
                    statusDiv.className = "taken";

                    isAvailable = false;

                } else {

                    statusDiv.innerText = "✅ Username available";
                    statusDiv.className = "available";

                    isAvailable = true;
                }

            }, 500); // 0.5 second delay
        })

        .catch(error => {
            statusDiv.innerText = "Error checking username";
            console.log(error);
        });
}


// Prevent submit if unavailable
form.addEventListener("submit", function (e) {

    if (!isAvailable) {

        e.preventDefault(); // Stop form

        alert("Please choose another username!");

    } else {

        alert("Registration Successful!");
    }
});