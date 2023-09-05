let map;
let infoWindow;
const apiKey = "a62aaa5ad1d14ac985d3ef58dabd799a"; //API key for weatherbit
const API_KEY1 ="7f9c10a60e107c9fada36cefd080371c"; //API key for OpenWeatherMap API

const citySearchInput = document.getElementById("citySearch");
const searchButton = document.getElementById("searchButton");
const locationButton = document.querySelector(".location-btn")
function getMarkerColor(aqi) {
    if (aqi <= 50) {
        return 'green'; // Good
    } else if (aqi <= 100) {
        return 'yellow'; // Moderate
    } else if (aqi <= 150) {
        return 'orange'; // Unhealthy for Sensitive Groups
    } else if (aqi <= 200) {
        return 'red'; // Unhealthy
    } else if (aqi <= 300) {
        return 'purple'; // Very Unhealthy
    } else {
        return 'maroon'; // Hazardous
    }
}
function getMarkerStyle(aqi) {
    let category;
    let backgroundColor;

    if (aqi <= 50) {
        category = 'Good';
        backgroundColor = 'green'; // Set the background color for the "Good" category
    } else if (aqi <= 100) {
        category = 'Moderate';
        backgroundColor = 'yellow'; // Set the background color for the "Moderate" category
    } else if (aqi <= 150) {
        category = 'Unhealthy for Sensitive Groups';
        backgroundColor = 'orange'; // Set the background color for the "Unhealthy for Sensitive Groups" category
    } else if (aqi <= 200) {
        category = 'Unhealthy';
        backgroundColor = 'red'; // Set the background color for the "Unhealthy" category
    } else if (aqi <= 300) {
        category = 'Very Unhealthy';
        backgroundColor = 'purple'; // Set the background color for the "Very Unhealthy" category
    } else {
        category = 'Hazardous';
        backgroundColor = 'maroon'; // Set the background color for the "Hazardous" category
    }
    console.log(category);
    return { category, backgroundColor };
}

function navigateToAirPollutionPage() {
    window.location.href = 'airpollution.html';
    
}

// Attach click event listeners to the button containers
document.getElementById('buttonContainer1').addEventListener('click', navigateToAirPollutionPage);
document.getElementById('buttonContainer2').addEventListener('click', navigateToAirPollutionPage);
document.getElementById('buttonContainer3').addEventListener('click', navigateToAirPollutionPage);
document.getElementById('buttonContainer4').addEventListener('click', navigateToAirPollutionPage);
document.getElementById('buttonContainer5').addEventListener('click', navigateToAirPollutionPage);
document.getElementById('buttonContainer6').addEventListener('click', navigateToAirPollutionPage);

async function fetchAirQualityData(city, state) {
    const apiUrl = `https://api.weatherbit.io/v2.0/current/airquality?city=${encodeURIComponent(city)}&state=${encodeURIComponent(state)}&country=UK&key=${apiKey}`;

    try {
        const response = await fetch(apiUrl);
        return await response.json();
    } catch (error) {
        console.error(`Error fetching air quality data for ${city}, ${state}:`, error);
        throw error;
    }
}

function updateMarkerWithData(marker, data) {
    const airQualityIndex = data.data[0].aqi;
    const markerColor = getMarkerColor(airQualityIndex);

    // Update the marker's properties
    marker.setIcon({
        path: google.maps.SymbolPath.CIRCLE,
        fillColor: markerColor,
        fillOpacity: 1.0,
        strokeWeight: 0,
        scale: 10
    });

    // Update the marker's label and title
    marker.setLabel(airQualityIndex.toString());
    marker.setTitle(`${data.city_name}, ${data.state_code}\nAir Quality Index: ${airQualityIndex}`);
}

function handleMarkerClick(marker, data) {
    const airQualityIndex = data.data[0].aqi;
    const markerStyle = getMarkerStyle(airQualityIndex);
    const category = markerStyle.category;
    const backgroundColor = markerStyle.backgroundColor;
   // console.log(data);
   const moreInfoUrl = `moreinfo.html?city=${encodeURIComponent(data.city_name)}&state=${encodeURIComponent(data.state_code)}`;

    const infoContent = `
        <div>
            <h3>${data.city_name}, ${data.state_code}</h3>
            <p>Air Quality Index: <span style="background-color: ${backgroundColor};">${category}</span></p>
            <a href ="${moreInfoUrl}">More Info</a>

            </div>
    `;

    // Set the content of the InfoWindow
    infoWindow.setContent(infoContent);

    // Open the InfoWindow
    infoWindow.open(map, marker);

    // Zoom in to the marker's location
    map.setZoom(10); // Adjust the zoom level as needed
    map.setCenter(marker.getPosition());
}

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 54.3781, lng: -2.2137 }, // Centered on the UK
        zoom: 6,
    });

    infoWindow = new google.maps.InfoWindow();
    
    // Add a click event listener to the search button
    searchButton.addEventListener("click", () => {
        const cityName = citySearchInput.value;
        if (cityName) {
            // Call a function to search for the entered city
            searchCity(cityName);
        } else {
            alert("Please enter a city name.");
        }
    });
   
    const citiesAndStates = [
        { city: "London", state: "England", country: "GB" },
        { city: "Edinburgh", state: "Scotland" },
        { city: "Cardiff", state: "Wales" },
        { city: "Belfast", state: "Northern Ireland" },
        // Add more cities and states as needed
    ];

    citiesAndStates.forEach(({ city, state, country }) => {
        fetchAirQualityData(city, state, country)
            .then(data => {
                const airQualityIndex = data.data[0].aqi;
                const markerColor = getMarkerColor(airQualityIndex);

                const marker = new google.maps.Marker({
                    position: { lat: parseFloat(data.lat), lng: parseFloat(data.lon) },
                    map: map,
                    title: `${data.city_name}, ${data.state_code}\nAir Quality Index: ${airQualityIndex}`,
                    label: airQualityIndex.toString(),
                });

                updateMarkerWithData(marker, data);

                marker.addListener('click', () => {
                    handleMarkerClick(marker, data);
                });
                initializeChart('bar', aqi, pm25Values, o3Values, coValues, no2Values, pm10Values, so2Values, timestamps, data.city_name);
            })
            .catch(error => {
                console.error("Error fetching air quality data:", error);
            });
    });
}
async function searchCity(cityName) {
    const geocodeApiUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(cityName)}&key=AIzaSyC-a-5lXv4V7Lwuql39W8qzH-VPfCywIW4`;

    try {
        const response = await fetch(geocodeApiUrl);
        const data = await response.json();
        if (data.results.length > 0) {
            const location = data.results[0].geometry.location;

            // Center the map on the searched city
            map.setCenter(location);
            const name = data.results[0].formatted_address;
            const lat = data.results[0].geometry.location.lat;
            const lon = data.results[0].geometry.location.lng;
           
           
            // Create a marker for the searched city
            const marker = new google.maps.Marker({
                position: location,
                map: map,
                title: cityName,
            });

            // Optionally, you can open an InfoWindow for the marker
            infoWindow.setContent(`<div><h3>${cityName}</h3></div>`);
            infoWindow.open(map, marker);

            // You can adjust the zoom level as needed
            map.setZoom(10);
        } else {
            alert("City not found.");
        }
    } catch (error) {
        console.error("Error searching for city:", error);
    }
}


window.initMap = initMap;

const getUserCoordintes = () =>{
    navigator.geolocation.getCurrentPosition(
        position => {
            //console.log(position);
           const {latitude,longitude} = position.coords;
           map.setCenter({ lat: latitude, lng: longitude });
           const REVERSE_GEOCODING_URL =`http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY1}`;
           fetch(REVERSE_GEOCODING_URL).then(res => res.json()).then(data =>{
            //console.log(data);
            const cityname= data[0].name;
           // console.log(cityname);
            const {name, lat, lon} = data[0];
            const marker = new google.maps.Marker({
                position: { lat: latitude, lng: longitude },
                map: map,
                title: cityname,
              });
              
            infoWindow.setContent(`<div><h3>${name}</h3></div>`);
            infoWindow.open(map, marker);
            
           
            

        }).catch(() =>{
            alert("An error occured while fetching the city!");
        });
        },
        error =>{
           // console.log(error);
           if(error.code === error.PERMISSION_DENIED){
            alert("Geolocation request denied. Please reset location permission to grant acces again.");
           }
        }
    )
}


locationButton.addEventListener("click", getUserCoordintes);