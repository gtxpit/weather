const apiKey = import.meta.env.VITE_WEATHER_KEY
const inputSave = document.querySelector("input")
const resultSave = document.querySelector(".result")
const button = document.querySelector('input[type="button"]')
console.log(apiKey)


let weatherTemp = {}
function weatherLoad () {
    fetch('https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric')
        .then(response => response.json())
        .then(data => 
            weatherTemp = {
                city: data.main.temp,
                description:data.weather[0].description,
                wind: data.wind.speed,
                icon: data.weather[0].icon
            }
        )
        .catch(error => console.error(error))
}

weatherLoad()