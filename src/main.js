const apiKey = import.meta.env.VITE_WEATHER_KEY
const inputSave = document.querySelector("input")
const resultSave = document.querySelector(".result")
const button = document.querySelector('input[type="button"]')
const iconImg = document.querySelector('#weatherIcon')


let weatherTemp = {}

function weatherLoad(city) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
        .then(response => response.json())
        .then(data => {
            if (data.cod !== 200) {
                resultSave.textContent = 'Город не найден, братан'
                return
            }
            weatherTemp = {
                temp: data.main.temp,
                city: data.name,
                description: data.weather[0].description,
                wind: data.wind.speed,
                icon: data.weather[0].icon
            }
            const iconCode = weatherTemp.icon
            const weatherType = iconCode.substring(0, 2)

            document.body.className = ''

            if (weatherType === '01') {
                document.body.classList.add('sunny')
            } else if (weatherType === '02' || weatherType === '03' || weatherType === '04') {
                document.body.classList.add('cloudy')
            } else if (weatherType === '13') {
                document.body.classList.add('snowy')
            } else {
                document.body.classList.add('cloudy') // дождь и всё остальное — на cloudy
            }

            const iconUrl = `https://openweathermap.org/img/wn/${weatherTemp.icon}@2x.png`
            iconImg.src = iconUrl

            resultSave.textContent = `${weatherTemp.city}: ${weatherTemp.temp}°, ${weatherTemp.description}, ветер ${weatherTemp.wind} м/с `
        })
        .catch(error => {
            console.error(error)
            resultSave.textContent = 'Ошибка, проверь консоль'
        })
}

button.addEventListener('click', () => {
    const city = inputSave.value.trim()
    if (city === '') {
        resultSave.textContent = 'Напиши город на английском'
        return
    }
    weatherLoad(city)
})



inputSave.addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        button.click()
    }
})