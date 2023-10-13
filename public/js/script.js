let map;
let infoWindow;

const apiKey = "9e2859491cdf4bd08226e2e4276e6acc"; //API key for weatherbit
const API_KEY1 ="7f9c10a60e107c9fada36cefd080371c"; //API key for OpenWeatherMap API

const citySearchInput = document.getElementById("citySearch");
const searchButton = document.getElementById("searchButton");
const locationButton = document.querySelector(".location-btn")

function validatePassword() {
    const password = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const passwordError = document.getElementById('passwordError');

    if (password !== confirmPassword) {
        passwordError.textContent = "Passwords do not match!";
        return false; // Prevent the form from submitting
    } else {
        passwordError.textContent = "";
        return true; // Allow the form to submit
    }
}


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
        return 'orangered'; // Very Unhealthy
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
        backgroundColor = 'orangered'; // Set the background color for the "Very Unhealthy" category
    } else {
        category = 'Hazardous';
        backgroundColor = 'maroon'; // Set the background color for the "Hazardous" category
    }
    console.log(category);
    return { category, backgroundColor };
}

function navigateToAirPollutionPage() {
    window.location.href = 'airpollution';
    
}

// Attach click event listeners to the button containers
document.getElementById('buttonContainer1').addEventListener('click', navigateToAirPollutionPage);
document.getElementById('buttonContainer2').addEventListener('click', navigateToAirPollutionPage);
document.getElementById('buttonContainer3').addEventListener('click', navigateToAirPollutionPage);
document.getElementById('buttonContainer4').addEventListener('click', navigateToAirPollutionPage);
document.getElementById('buttonContainer5').addEventListener('click', navigateToAirPollutionPage);
document.getElementById('buttonContainer6').addEventListener('click', navigateToAirPollutionPage);

async function fetchAirQualityData(city, state) {
const apiUrl = 
`https://api.weatherbit.io/v2.0/current/airquality?
city=${encodeURIComponent(city)}
&state=${encodeURIComponent(state)}&
country=UK&key=${apiKey}`;
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
    const moreInfoUrl = `moreinfo?city=${encodeURIComponent(data.city_name)}&state=${encodeURIComponent(data.state_code)}`;
    const infoContent = `
        <div>
            <h3>${data.city_name}, ${data.state_code}</h3>
            <p>Air Quality Index: <span style="background-color: ${backgroundColor};">${category}</span></p>
            <a href ="${moreInfoUrl}">More Info</a>

            </div>
    `;
    infoWindow.setContent(infoContent);
    infoWindow.open(map, marker);

   
    map.setZoom(10); // Adjust the zoom level as needed // Zoom in to the marker's location
    map.setCenter(marker.getPosition());
}

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 54.3781, lng: -2.2137 }, // Centered on the UK
        zoom: 6,
    });

    infoWindow = new google.maps.InfoWindow();
    
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
        { city: "London", state: "England" },
        { city: "Leicester", state: "England" },
        { city: "Coventry", state: "England" },
        { city: "Lichfield", state: "England" },
        { city: "Birmingham", state: "England" },
        { city: "Bristol", state: "England" },
        { city: "Nottingham", state: "England" },
        { city: "Cambridge", state: "England" },
        { city: "Gloucester", state: "England" },
        { city: "Exeter", state: "England" },
        { city: "Ely", state: "England" },
        { city: "Durham", state: "England" },
        { city: "Doncaster", state: "England" },
        { city: "Derby", state: "England" },
        { city: "Colchester", state: "England" },
        { city: "Chichesterm", state: "England" },
        { city: "Chester", state: "England" },
        { city: "Chelmsford", state: "England" },
        { city: "Carlisle", state: "England" },
        { city: "Canterbury", state: "England" },
        { city: "Brighton & Hove", state: "England" },
        { city: "Bradford", state: "England" },
        { city: "Bath", state: "England" },
        { city: "Hereford", state: "England" },
        { city: "Kingston-upon-Hull", state: "England" },
        { city: "Lancaster", state: "England" },
        { city: "Leeds", state: "England" },
        { city: "Lincoln", state: "England" },
        { city: "Liverpool", state: "England" },
        { city: "Manchester", state: "England" },
        { city: "Milton Keynes", state: "England" },
        { city: "Newcastle-upon-Tyne", state: "England" },
        { city: "Norwich", state: "England" },
        { city: "Oxford", state: "England" },
        { city: "Peterborough", state: "England" },
        { city: "Plymouth", state: "England" },
        { city: "Portsmouth", state: "England" },
        { city: "Preston", state: "England" },
        { city: "Ripon", state: "England" },
        { city: "Salford", state: "England" },
        { city: "Salisbury", state: "England" },
        { city: "Edinburgh", state: "Scotland" },
        { city: "Aberdeen", state: "Scotland" },
        { city: "Dundee", state: "Scotland" },
        { city: "Dunfermline", state: "Scotland" },
        { city: "Glasgow", state: "Scotland" },
        { city: "Inverness", state: "Scotland" },
        { city: "Perth", state: "Scotland" },
        { city: "Stirling", state: "Scotland" },
        { city: "Cardiff", state: "Wales" },
        { city: "Bangor", state: "Wales" },
        { city: "Newport", state: "Wales" },
        { city: "St Asaph", state: "Wales" },
        { city: "St Davids", state: "Wales" },
        { city: "Swanseaf", state: "Wales" },
        { city: "Wrexham", state: "Wales" },
        { city: "Belfast", state: "Northern Ireland" },
        { city: "Armagh", state: "Northern Ireland" },
        { city: "Bangor", state: "Northern Ireland" },
        { city: "Lisburn", state: "Northern Ireland" },
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
            })
            .catch(error => {
                console.error("Error fetching air quality data:", error);
            });
    });
}
window.initMap = initMap;

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
           // console.log(error)
           if(error.code === error.PERMISSION_DENIED){
            alert("Geolocation request denied. Please reset location permission to grant acces again.");
           }
        }
    )
}


locationButton.addEventListener("click", getUserCoordintes);

// ...

async function searchProblemsByCity(cityName) {
    try {
        const response = await fetch(`/searchProblems?cityName=${encodeURIComponent(cityName)}`);
        if (response.ok) {
            const filteredProblems = await response.json();
            //const cityName = filteredProblems[0].city
            console.log(filteredProblems)
            // Call a function to display the filtered problems on the page
            displayProblems(filteredProblems, cityName);
           // console.log(filteredProblems[0].city);
            //const moreInfoURL = `morecomments?cityName=${encodeURIComponent(cityName)}`;
        } else {
            console.error('Error searching for problems:', response.statusText);
        }
    } catch (error) {
        console.error('Error searching for problems:', error);
    }
}



// Add an event listener to the search button
searchButton.addEventListener('click', () => {
   
    const cityName = document.getElementById('citySearch').value;
    if (cityName) {
        searchProblemsByCity(cityName);
        document.getElementById('report-problem').style.display = 'block';
    } else {
        alert('Please enter a city name.');
    }
    
});

document.addEventListener("DOMContentLoaded", function () {
    const contributeForm = document.getElementById('contributeForm');
    const step1 = document.getElementById('step1');
    const step2 = document.getElementById('step2');
    const continueButton = document.getElementById('continueButton');
    const backbutton =document.getElementById('backbutton');
    const validationMessage = document.getElementById('validationMessage');

    continueButton.addEventListener('click', function () {
        // Hide step 1 and show step 2
        step1.style.display = 'none';
        step2.style.display = 'block';
    });
    
    document.getElementById('issueMedia').addEventListener('change', function () {
        const mediaUrlsInput = document.getElementById('mediaUrls');
        const mediaFiles = this.files;
        const mediaUrls = [];
    
        for (const file of mediaFiles) {
            mediaUrls.push(URL.createObjectURL(file));
        }
    
        // Set the hidden input field's value with the JSON stringified media URLs
        mediaUrlsInput.value = JSON.stringify(mediaUrls);
    });

    
    contributeForm.addEventListener('submit', function (event) {
        console.log("form submitted");
        event.preventDefault();

       // Get the selected category from the form
       const category = document.getElementById('issueCategory').value;

       const summariseproblem = document.getElementById('summariseproblem').value;
       // Get the issue description from the form
       const description = document.getElementById('issueDescription').value;

       // Get the selected media files (photos/videos)
       const mediaFiles = document.getElementById('issueMedia').files;
       
       console.log(mediaFiles);
       if (!category || !description) {
           validationMessage.textContent = 'Please fill in all required fields.';
           return; // Don't proceed with form submission
       } else {
           validationMessage.textContent = ''; // Clear the validation message
       }

       console.log('Category:', category);
       console.log('Problem:', summariseproblem);
       console.log('Description:', description);
       console.log('Media Files:', mediaFiles);
       const reportModal = document.getElementById('reportModal');
    reportModal.style.display = 'none';
    fetch(contributeForm.action, {
        method: 'POST', // or 'PUT' or 'PATCH' depending on your form's method
        body: new FormData(contributeForm),
    })
    .then(response => {
        // Handle the response as needed
    })
    .catch(error => {
        // Handle errors
    });
    alert('Your form submitted successfully');
    window.history.back();
    });
    
});


async function displayProblems(problems, cityName) {
    console.log(problems);
    const problemContainer = document.querySelector('.report-problem .card-body');
    problemContainer.innerHTML = ''; // Clear existing content

    if (problems.length === 0) {
        problemContainer.innerHTML = '<p>No problems found for this city.</p>';
    } else {
        const reversedProblems = problems.slice().reverse();

        for (let index = 0; index < Math.min(4, reversedProblems.length); index++) {
            const item = reversedProblems[index];
            const card = createCard(item, index);
            problemContainer.appendChild(card);
        }

        problemContainer.addEventListener('click', function(event) {
            const clicked = event.target;
            if (clicked.matches('.commentbutton')) {
                const card = clicked.closest('.card');
                const form = card.querySelector('form');
                
                if (form.style.display === 'none' || form.style.display === '') {
                    form.style.display = 'block';
                } else {
                    form.style.display = 'none';
                }
                return; // Exit the function to avoid other if-else checks
            }
            if (clicked.matches('.postCom')) {
                const form = clicked.closest('form');
                if (form) {
                    post(event);
                }
            }else if (clicked.matches('.postComment')) {
                const form = clicked.closest('form');
                if (form) {
                    post(event);
                    // Handle the "Done" button click here
                    console.log('Done button clicked');
                    // You can call any functions or logic specific to the "Done" button here
                }
            }
            else if (clicked.matches('.postReply')) {
                const form = clicked.closest('form');
                if (form) {
                    //document.getElementById('commentText1').style.display="block";
                  // document.getElementById('commentText1').style.display = "block";
                       // post(event);
                    
                    // Handle the "Done" button click here
                    console.log('Reply button clicked');
                    // You can call any functions or logic specific to the "Done" button here
                }
            }
          
        });
        const response = await fetch(`/searchProblems?cityName=${encodeURIComponent(cityName)}`);
        //console.log(response);
        const textBeforeLink = document.createElement('span');
        textBeforeLink.textContent = 'if you want to see more problems related to the city  ';

        // Append "More Info" link to navigate to another page
        const morecommentsLink = document.createElement('a');
        morecommentsLink.href = `morecomments?cityName=${encodeURIComponent(cityName)}`;
        morecommentsLink.textContent = 'click here';
        problemContainer.appendChild(morecommentsLink);

        problemContainer.appendChild(textBeforeLink);
        problemContainer.appendChild(morecommentsLink);
      
      
    }
}

function createCard(item, index) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.classList.add('mb-3');
    card.classList.add('w-100');
    card.classList.add('h-25');
    const formId = `commentsReplies${index}`;
    console.log(item);
    let date = new Date(item.created_at);
    let day = date.getDate();
    let month = date.getMonth() + 1; // Adding 1 because getMonth() returns 0-11 for months
    let year = date.getFullYear();
    let hours = date.getHours();
    let minutes = date.getMinutes();

// Ensure leading zeros for single-digit days, months, hours, and minutes
if (day < 10) {
    day = `0${day}`;
}
if (month < 10) {
    month = `0${month}`;
}
if (hours < 10) {
    hours = `0${hours}`;
}
if (minutes < 10) {
    minutes = `0${minutes}`;
}

let formattedDateTime = `${day}:${month}:${year} , ${hours}:${minutes}`;

   card.innerHTML = `
    <div class="card  ">
    <div class="row">
        <div class="col-md-8">
            <div class="card-body">
                <p class="card-text">${item.issueCategory}</p>
                <p class="card-text"><small class="text-body-secondary">${formattedDateTime}</small></p>
            </div>
        </div>
        <div class="col-md-4">
            <div class="card-media">
                ${
                    item.mediaField.endsWith('.jpg') || item.mediaField.endsWith('.png') || item.mediaField.endsWith('.jpeg')
                        ? `<img class="img-fluid"  src="${item.mediaField}" alt="Image">`
                        : ''
                }
                ${
                    item.mediaField.endsWith('.mp4') || item.mediaField.endsWith('.webm') || item.mediaField.endsWith('.ogg')
                        ? `
                            <video  class="img-fluid" controls>
                                <source src="${item.mediaField}" type="video/mp4">
                                Your browser does not support the video tag.
                            </video>`
                        : ''
                }
            </div>
        </div>
    </div>
</div>

    `;
    card.addEventListener('click', () =>{
        openModal(item);
    })
    return card;
}

function openModal(item) {
    const modal = document.getElementById('myModal');
    const modalContent = modal.querySelector('.modal-content');

    // Populate the modal with card information
    modalContent.innerHTML = `
    <div class="modal-header custom-modal-title">
        <h1 class="modal-title fs-5 mx-auto" id="exampleModalLabel">${item.issueCategory}</h1>
        <button type="button" class="btn-close" id="close_button" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
        <h1 class="fs-6 m-2" id="exampleModalLabel">Summary:</h1>
        <p class="card-text m-2"><small class="text-body-secondary">${item.Summariseproblem}</small></p>
        <h1 class="fs-6 m-2" id="exampleModalLabel">Description</h1>
        <p class="card-text m-2"><small class="text-body-secondary">${item.issueDescription}</small></p>
        <h1 class="fs-6 m-2" id="exampleModalLabel">Related Images / Videos</h1>
        <!-- Add other information you want to display here -->
        ${
            item.mediaField.endsWith('.jpg') || item.mediaField.endsWith('.png') || item.mediaField.endsWith('.jpeg')
                ? `<img class="img-fluid1 m-2 mx-auto" src="${item.mediaField}" alt="Image">`
                : ''
        }
        ${
            item.mediaField.endsWith('.mp4') || item.mediaField.endsWith('.webm') || item.mediaField.endsWith('.ogg')
                ? `
                    <video class="img-fluid" controls>
                        <source src="${item.mediaField}" type="video/mp4">
                        Your browser does not support the video tag.
                    </video>`
                : ''
        }
    `;

    // Display the modal
    modal.style.display = 'block';

   
 const closeButton1 = document.getElementById('close_button');
    // Add a click event listener to the close button to close the modal
    closeButton1.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Close the modal if the user clicks outside of it (optional)
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}





       
        
      
