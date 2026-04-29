const apiKey = 'dec2aa587a7d5f50df886b63ac59a289'

const inputSave = document.querySelector("input")
const button = document.querySelector('input[type="button"]')
const iconImg = document.querySelector('#weatherIcon')
const weatherText = document.querySelector('#weatherText')

let weatherTemp = {}

function weatherLoad(city) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`, { mode: 'cors' })
        .then(response => response.json())
        .then(data => {
            if (data.cod !== 200) {
                weatherText.textContent = 'Город не найден, братан'
                return
            }

            weatherTemp = {
                temp: data.main.temp,
                city: data.name,
                description: data.weather[0].description,
                wind: data.wind.speed,
                icon: data.weather[0].icon
            }

            const iconUrl = `https://openweathermap.org/img/wn/${weatherTemp.icon}@2x.png`
            iconImg.src = iconUrl

            weatherText.textContent = `${weatherTemp.city}: ${weatherTemp.temp}°, ${weatherTemp.description}, ветер ${weatherTemp.wind} м/с`

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
                document.body.classList.add('cloudy')
            }
        })
        .catch(error => {
            console.error(error)
            weatherText.textContent = 'Ошибка, проверь консоль'
        })
}

button.addEventListener('click', () => {
    const city = inputSave.value.trim()
    if (city === '') {
        weatherText.textContent = 'Напиши город на английском'
        return
    }
    weatherLoad(city)
})

inputSave.addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        button.click()
    }
})