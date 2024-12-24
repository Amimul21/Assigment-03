var weatherApiKey = 'your_openweathermap_api_key';
var famousInfo = {
    "France": "Famous for the Eiffel Tower, Louvre Museum, and its exquisite cuisine.",
    "Japan": "Known for Mount Fuji, cherry blossoms, and its rich cultural heritage.",
    "India": "Home to the Taj Mahal, diverse traditions, and vibrant festivals.",
    "USA": "Famous for landmarks like the Statue of Liberty, Grand Canyon, and Silicon Valley.",
    "Italy": "Known for the Colosseum, Venice canals, and world-renowned cuisine."
};

document.getElementById('searchButton').addEventListener('click', fetchCountryData);

function fetchCountryData() {
    var searchTerm = document.getElementById('searchBox').value.trim();
    if (!searchTerm) {
        alert("Please enter a country name.");
        return;
    }

    const url = `https://restcountries.com/v3.1/name/${searchTerm}`;
    document.getElementById('searchBox').value = "";

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
            return response.json();
        })
        .then(data => displayCountries(data))
        .catch(error => {
            console.error('Error:', error);
            alert("No data found for the specified country. Please try again.");
        });
}

function displayCountries(data) {
    const displayArea = document.querySelector('#displayArea .row');
    displayArea.innerHTML = ""; 

    data.forEach(country => {
        const countryCard = document.createElement('div');
        countryCard.classList.add('col-lg-4', 'col-md-6', 'col-sm-12');

        const countryName = country.name.common;
        const capital = country.capital ? country.capital[0] : "N/A";
        const famousDetails = famousInfo[countryName] || "No famous information available.";

        countryCard.innerHTML = `
            <div class="card">
                <img src="${country.flags.png}" alt="Flag of ${countryName}" class="card-img-top">
                <div class="card-body text-center">
                    <h5 class="card-title">${countryName}</h5>
                    <p class="card-text"><strong>Region:</strong> ${country.region}</p>
                    <p class="card-text"><strong>Capital:</strong> ${capital}</p>
                    <p class="card-text"><strong>Population:</strong> ${country.population.toLocaleString()}</p>
                    <button class="btn btn-outline-primary mt-2" onclick="showMoreDetails('${countryName}', '${capital}', '${famousDetails}')">More Details</button>
                </div>
            </div>
        `;

        displayArea.appendChild(countryCard);
    });
}

function showMoreDetails(countryName, capital, famousDetails) {
    const modalBody = document.querySelector('.modal-body');
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${weatherApiKey}&units=metric`;

    fetch(weatherUrl)
        .then(response => response.json())
        .then(weatherData => {
            const temperature = weatherData.main ? weatherData.main.temp : "N/A";
            const weatherDescription = weatherData.weather ? weatherData.weather[0].description : "N/A";
            const windSpeed = weatherData.wind ? weatherData.wind.speed : "N/A";

            modalBody.innerHTML = `
                <h5>${countryName}</h5>
                <p><strong>Capital:</strong> ${capital}</p>
                <p><strong>Famous For:</strong> ${famousDetails}</p>
                <hr>
                <h6>Weather Information</h6>
                <p><strong>Temperature:</strong> ${temperature}°C</p>
                <p><strong>Weather:</strong> ${weatherDescription}</p>
                <p><strong>Wind Speed:</strong> ${windSpeed} m/s</p>
            `;
            const detailsModal = new bootstrap.Modal(document.getElementById('detailsModal'));
            detailsModal.show();
        })
        .catch(error => {
            console.error('Error:', error);
            modalBody.innerHTML = `
                <h5>${countryName}</h5>
                <p><strong>Capital:</strong> ${capital}</p>
                <p><strong>Famous For:</strong> ${famousDetails}</p>
                <hr>
                <h6>Weather Information</h6>
                <p>Unable to fetch weather data for ${capital}.</p>
            `;
            const detailsModal = new bootstrap.Modal(document.getElementById('detailsModal'));
            detailsModal.show();
        });
}
