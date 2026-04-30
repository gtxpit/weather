const apiKey = 'dec2aa587a7d5f50df886b63ac59a289'
const inputSave = document.querySelector("input")
const button = document.querySelector('input[type="button"]')
const iconImg = document.querySelector('#weatherIcon')
const weatherText = document.querySelector('#weatherText')
const forecastCards = document.querySelector('#forecastCards')
function weatherLoad(city) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
        .then(response => response.json())
        .then(data => {
            if (data.cod !== 200) {
                weatherText.textContent = 'Город не найден, братан'
                return
            }
            const temp = Math.round(data.main.temp)
            const cityName = data.name
            const description = data.weather[0].description
            const wind = data.wind.speed
            const icon = data.weather[0].icon

            iconImg.src = `https://openweathermap.org/img/wn/${icon}@2x.png`
            weatherText.textContent = `${cityName}: ${temp}°, ${description}, ветер ${wind} м/с`

            const weatherType = icon.substring(0, 2)
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
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`)
        .then(response => response.json())
        .then(data => {
            if (data.cod !== "200") {
                forecastCards.innerHTML = '<p>Прогноз не найден</p>'
                return
            }
            forecastCards.innerHTML = ''
            for (let i = 8; i < data.list.length && i < 48; i += 8) {
                const item = data.list[i]
                const date = new Date(item.dt_txt)
                const dayName = date.toLocaleDateString('ru-RU', { weekday: 'short' })
                const temp = Math.round(item.main.temp)
                const icon = item.weather[0].icon
                const description = item.weather[0].description
                const card = document.createElement('div')
                card.className = 'forecast-card'
                card.innerHTML = `
                    <div>${dayName}</div>
                    <img src="https://openweathermap.org/img/wn/${icon}.png" alt="${description}">
                    <div class="temp">${temp}°</div>
                `
                forecastCards.appendChild(card)
            }
        })
        .catch(error => {
            console.error(error)
            forecastCards.innerHTML = '<p>Ошибка загрузки прогноза</p>'
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