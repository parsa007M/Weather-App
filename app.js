// my api key: 69ca63bb29b1fe374c8b2d8bf46143f0


/* PART 1 : SELECT ELEMENTS */

const notificationElement = document.querySelector(".notification");
const iconElement = document.querySelector(".weather-icon");
const tempElement = document.querySelector(".temperature-value p");
const descElement = document.querySelector(".temperature-description p");
const locationElement = document.querySelector(".location p");
const statusElement = document.querySelector("#wheater-video video");
const status = document.querySelector(".status p");

/* PART 2: APP DATA */

// We need to store the data in somewhere as an object
// We will get these informations from API
// That's why, just create an empty object

/* 
Example for weather data object:

const weather = {
    temperature:{
        value:18,
        unit:"celsius"
    },
    description:"few clouds",
    iconID:"01d",
    city:"Dusseldorf",
    country:"Germany"
}
*/

const weather = {};

// API is sharing data unit as a Fahrenheit. That's why, just for unit set default option
weather.temperature = {
    unit:"celsius"
}

/* PART 3: APP CONSTS AND VARS */
// Converting to Kelvin to Celsius
const KELVIN = 273; 
// API Key
const key = "69ca63bb29b1fe374c8b2d8bf46143f0";

/* PART 4: CHECK THE BROWSER IF IT SUPPORTS GEOLOCATION */

if('geolocation'in navigator){ // if the user geolocation is available in navigator(browser)

    // getCurrentPosition method has call back functions
    // 1st one is "setpPosition" : important, 2nd is showError. This is optional
    navigator.geolocation.getCurrentPosition(setPosition, showError);
}else{
    // notification is not visible to user unless, the user get the error
    // notification set "display:none" in css, so we need to change it if we get error
    notificationElement.style.display ="block";
    //if geolocation is not avaible in browser, below message will be shown
    notificationElement.innerHTML = "<p>Browser doesn't Support Geolocation</p>";
}

/* PART 5: SET USER'S POSITION */

function setPosition(position){ // setPosition is a call back function which has only one argument (position)
    // position: is an object which has below properties

    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;

    // above two arguments will be a function code for getWeather
    getWeather(latitude,longitude);
}

/* PART 6: SHOW ERROR WHEN THERE IS AN ISSUE WITH GEOLOCATION SERVICE */

function showError(error){ // error is an object as well and it has two arguments ( ID, Messgae)
    // notification set "display:none" in css, so we need to change it if we get error
    notificationElement.style.display ="block";
    // show error message
    notificationElement.innerHTML = `<p>${error.message}</p>` 
}

/* PART 7: GET WEATHER DATAS FROM API PROVIDER */

// we use getWeather function to set the position
function getWeather(latitude,longitude){
    // create API link
    let api = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}`;

    // let's fetch the api
    // fetch uses promise infrastructure
    // So Fetch api returns to promise to us (then and catch)
    // if the result is positive, it is "then"
    // if it is wrong, we use "catch"

    fetch(api)
    // after finishing fetch, we will get response

        .then(function(response){
            // so we must first parse, what we get from the api
            let data = response.json();
            return data;
        })

    // after json parse is completed, then we can use data object
        .then(function(data){
            // because of data is an object, we define path as an object

            // data.main.temp : get it and set to weather.temperature.value object
            // Before that, convert it to Celsius like ( Number - KELVIN)
            // we need to be sure it is an integer. So use Math.Floor
            // Temperature 
            weather.temperature.value = Math.floor(data.main.temp - KELVIN); 
            // description
            weather.description = data.weather[0].description;
            // icon
            weather.iconNumber = data.weather[0].icon;
            // name of the city
            weather.city = data.name;
            // name of the country
            weather.country = data.sys.country;
            // status
            weather.status=data.weather[0].main;
           
        })

        // after we set the properties of weather object, then we can display it by calling the function
        .then(function(){
            // we are changing the html with weather datas
            displayWeather();
        });

}


/* PART 8: DISPLAY WEATHER TO UI */

// whenever i call this function, it will be updated in innerHTML
function displayWeather(){

    // change the icon depends on day/night and weather in html
    iconElement.innerHTML = `<img src="icons/${weather.iconNumber}.png"/>`;
    // change the value and unit in html
    tempElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;
    // change the description in html
    descElement.innerHTML = weather.description;
    // change the location in html
    locationElement.innerHTML = `${weather.city},${weather.country}`;
    //status
    status.innerHTML = weather.status;
  document.querySelector("video").src ="./videos/" + weather.status + ".mp4";

}


/* PART 9: CONVERT C TO F / F TO C */

function celsiusToFahrenheit (temperature){
    return (temperature * 9/5)+32;
}

// When the user clicks on the temperature element
tempElement.addEventListener("click", function(){
    if(weather.temperature.value === undefined) return;

    // if the unit is celsius , we need to convert it to the fahrenheit
    if(weather.temperature.unit == "celsius"){

        let fahrenheit = celsiusToFahrenheit(weather.temperature.value);
        // to convert float to integer
        fahrenheit = Math.floor(fahrenheit);
        // write the fahrenheit in html
        tempElement.innerHTML = `${fahrenheit}°<span>F</span>`;
        // do not forget to change the weather temp unit
        weather.temperature.unit ="fahrenheit";
    }else{
        // if the unit is fahrenheit, we need to convert it to celsius
        tempElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;
        // do not forget to change the weather temp unit
        weather.temperature.unit="celsius";

    }
});

