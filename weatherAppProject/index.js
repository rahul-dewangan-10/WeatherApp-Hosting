const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");

const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");
const changebackground = document.querySelector(".wrapper");
//initially vairables need????
      
 
let oldTab = userTab;  // olld Tab == currently visible Tab
const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";
oldTab.classList.add("current-tab");  //ye sirf Text ke beckground colour ko grey katra hai jab uspe clicked hota hai
getfromSessionStorage();

function switchTab(newTab) {   // to uhnderstand onsider oldTab as currentTab (jo currently visible hai)
                                /// and newTab as clicked Tab (jis Tab par jaane ke liye click kiya gaya hai)
    if(newTab != oldTab) {
        oldTab.classList.remove("current-tab");
        oldTab = newTab;
        oldTab.classList.add("current-tab");

        if(!searchForm.classList.contains("active")) {
            //kya search form wala container is invisible, if yes then make it visible
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }
        else {
            //main pehle search wale tab pr tha, ab your weather tab visible karna h 
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            //ab main your weather tab me aagya hu, toh weather bhi display karna poadega, so let's check local storage first
            //for coordinates, if we haved saved them there.
            getfromSessionStorage();
        }
    }
}

userTab.addEventListener("click", () => {
    //pass clicked tab as input paramter
    switchTab(userTab);
});

searchTab.addEventListener("click", () => {
    //pass clicked tab as input paramter
    switchTab(searchTab);
});

//check if cordinates are already present in session storage
function getfromSessionStorage() {
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if(!localCoordinates) {
        //agar local coordinates nahi mile
        grantAccessContainer.classList.add("active");
    }
    else {
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }

}

async function fetchUserWeatherInfo(coordinates) {
    const {lat, lon} = coordinates;
    // make grantcontainer invisible
    grantAccessContainer.classList.remove("active");
    //make loader visible
    loadingScreen.classList.add("active");

    //API CALL
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
          );
        const  data = await response.json();

        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err) {
        loadingScreen.classList.remove("active");
        //HW

    }

}

function renderWeatherInfo(weatherInfo) {
    //fistly, we have to fethc the elements 

    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");

   // console.log(weatherInfo);

    //fetch values from weatherINfo object and put it UI elements
    //API call se json file jo mili hai uske useful informations ko hamare variables me store karana hai->
    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    var olddesc = desc.innerText;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp} °C`;
    windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity}%`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;
     // console.log(desc)
    changeBackground(desc.innerText);
}


 //to change background image according to weather(descriotion from API)
function changeBackground(desc) {
   console.log(desc);
   console.log("change background funtion is being called");
//    changebackground.classList.add("active");
switch(desc){

    case 'light rain':
        changebackground.classList.remove("heavyrain");
        changebackground.classList.remove("clearsky");
        changebackground.classList.remove("haze");
        changebackground.classList.remove("default");
        changebackground.classList.remove("mist");
        changebackground.classList.add("lightRain");
        break;
    case 'moderate rain':
        changebackground.classList.remove("heavyrain");
        changebackground.classList.remove("clearsky");
        changebackground.classList.remove("haze");
        changebackground.classList.remove("default");
        changebackground.classList.remove("mist");
        changebackground.classList.add("lightRain");
        break;
    case 'haze':
        changebackground.classList.remove("heavyrain");
        changebackground.classList.remove("clearsky");
        changebackground.classList.remove("mist");
        changebackground.classList.remove("lightRain");
        changebackground.classList.remove("default");
        changebackground.classList.add("haze");
        break; 
    case 'heavy rain':
        changebackground.classList.remove("clearsky");
        changebackground.classList.remove("mist");
        changebackground.classList.remove("lightRain");
        changebackground.classList.remove("default");
        changebackground.classList.add("heavyrain");
        break;  
    case 'clear sky':
        changebackground.classList.remove("mist");
        changebackground.classList.remove("heavyrain");
        changebackground.classList.remove("lightRain");
        changebackground.classList.remove("default");
        changebackground.classList.add("clearsky");
        break;

    case 'mist':
        changebackground.classList.remove("heavyrain");
        changebackground.classList.remove("clearsky");
        changebackground.classList.remove("lightRain");
        changebackground.classList.remove("default");
        changebackground.classList.remove("haze");
        changebackground.classList.add("mist");
        break;  


    default:
        console.log("default background should be shown");
        changebackground.classList.remove("heavyrain");
        changebackground.classList.remove("clearsky");
        changebackground.classList.remove("lightRain");
        changebackground.classList.remove("mist");
        changebackground.classList.remove("haze");
        changebackground.classList.add("default");
        break;
}
 }
  



function getLocation() {
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else {
        //HW - show an alert for no gelolocation support available
    }
}

function showPosition(position) {

    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }

    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);

}

const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click", getLocation);

const searchInput = document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let cityName = searchInput.value;

    if(cityName === "")
        return;
    else 
        fetchSearchWeatherInfo(cityName);

})

async function fetchSearchWeatherInfo(city) {
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");
 
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
          );
        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);

           // console.log(desc)
        changeBackground(desc);
    }

   
    catch(err) {
        //hW
    }
     
    
}