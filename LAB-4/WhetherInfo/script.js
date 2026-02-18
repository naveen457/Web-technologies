const cityInput = document.getElementById("cityInput");
const weatherInfo = document.getElementById("weatherInfo");
const messageDiv = document.getElementById("message");
const loader = document.getElementById("loader");

let lastResult = null; // Cache last result

cityInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        getWeather(cityInput.value.trim());
    }
});

async function getWeather(city) {
    if (!city) {
        showMessage("Please enter a city name.", "error");
        return;
    }

    showLoader(true);
    showMessage("", "");

    // If same city as last fetch, use cache
    if (lastResult && lastResult.name.toLowerCase() === city.toLowerCase()) {
        showWeather(lastResult);
        showLoader(false);
        return;
    }

    const apiKey = "74aff95301cbe6f3cad847dea56e83e0";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error("City not found.");
            } else {
                throw new Error("Server error.");
            }
        }

        const data = await response.json();
        lastResult = data; // cache data
        showWeather(data);

    } catch (error) {
        showMessage(error.message, "error");
    } finally {
        showLoader(false);
    }
}

function showWeather(data) {
    weatherInfo.innerHTML = `
        <h3>Weather in ${data.name}</h3>
        🌡️ Temperature: ${data.main.temp}°C<br>
        💧 Humidity: ${data.main.humidity}%<br>
        📌 Condition: ${data.weather[0].main}
    `;
    showMessage("Weather fetched successfully!", "success");
}

function showLoader(isLoading) {
    loader.style.display = isLoading ? "block" : "none";
}

function showMessage(msg, type) {
    messageDiv.innerText = msg;
    messageDiv.style.color = type === "error" ? "red" : "green";
}