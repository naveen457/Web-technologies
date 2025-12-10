document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");

    // If there's no form on this page (e.g. index.html), do nothing
    if (!form) return;

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const name = document.getElementById("name").value.trim();
        const regno = document.getElementById("regno").value.trim();
        const email = document.getElementById("email").value.trim();
        const phone = document.getElementById("phone").value.trim();

        if (!name || !regno || !email || !phone) {
            alert("⚠️ Please fill out all fields!");
            return;
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            alert("❌ Invalid email format!");
            return;
        }

        const phonePattern = /^[0-9]{10}$/;
        if (!phonePattern.test(phone)) {
            alert("📞 Enter a valid 10-digit phone number!");
            return;
        }

        // Success 🎉
        form.reset();
        window.location.href = "index.html?status=success";
    });
});
