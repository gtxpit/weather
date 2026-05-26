// ===== ПЕРЕМЕННЫЕ =====
export let currentCityName = ''

export const domElements = {
    saveCityButton: null,
    inputSave: null,
    button: null,
    iconImg: null,
    weatherText: null,
    locationBtn: null,
    forecastCards: null
}

export function setDomElements(elements) {
    Object.assign(domElements, elements)
}

// ===== ГЕОЛОКАЦИЯ =====
export function weatherByCoords(lat, lon) {
    fetch(`/api/weather?lat=${lat}&lon=${lon}&lang=ru`)
        .then(res => res.json())
        .then(data => {
            if (data.cod !== 200) {
                domElements.weatherText.textContent = 'Город не найден'
                domElements.locationBtn.style.display = 'inline-block'
                return
            }
            domElements.weatherText.textContent = `${data.name}: ${Math.round(data.main.temp)}°, ${data.weather[0].description}`
            domElements.iconImg.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
            domElements.saveCityButton.style.display = 'inline-block'
            currentCityName = data.name
            domElements.locationBtn.style.display = 'none'
        })
        .catch(() => {
            domElements.weatherText.textContent = 'Ошибка геолокации'
            domElements.locationBtn.style.display = 'inline-block'
        })
}

// ===== РУЧНОЙ ПОИСК (погода + прогноз) =====
export function weatherLoad(city) {
    domElements.saveCityButton.style.display = 'none'
    domElements.locationBtn.style.display = 'inline-block'

    fetch(`/api/weather?city=${city}&lang=ru`)
        .then(response => response.json())
        .then(data => {
            if (data.cod !== 200) {
                domElements.weatherText.textContent = 'Город не найден, братан'
                domElements.locationBtn.style.display = 'inline-block'
                return
            }
            const temp = Math.round(data.main.temp)
            const cityName = data.name
            currentCityName = cityName
            const description = data.weather[0].description
            const wind = data.wind.speed
            const icon = data.weather[0].icon

            domElements.iconImg.src = `https://openweathermap.org/img/wn/${icon}@2x.png`
            domElements.weatherText.textContent = `${cityName}: ${temp}°, ${description}, ветер ${wind} м/с`
            domElements.saveCityButton.style.display = 'inline-block'
            domElements.locationBtn.style.display = 'none'

            const weatherType = icon.substring(0, 2)
            const isDark = document.body.classList.contains('dark')
            document.body.classList.remove('sunny', 'cloudy', 'snowy')

            if (weatherType === '01') {
                document.body.classList.add('sunny')
            } else if (weatherType === '02' || weatherType === '03' || weatherType === '04') {
                document.body.classList.add('cloudy')
            } else if (weatherType === '13') {
                document.body.classList.add('snowy')
            } else {
                document.body.classList.add('cloudy')
            }

            if (isDark) {
                document.body.classList.add('dark')
            }
        })
        .catch(error => {
            console.error(error)
            domElements.weatherText.textContent = 'Ошибка, проверь консоль'
            domElements.locationBtn.style.display = 'inline-block'
        })

    fetch(`/api/weather?city=${city}&type=forecast&lang=ru`)
        .then(response => response.json())
        .then(data => {
            if (data.cod !== "200") {
                domElements.forecastCards.innerHTML = '<p>Прогноз не найден</p>'
                return
            }
            domElements.forecastCards.innerHTML = ''
            for (let i = 8; i < data.list.length && i < 48; i += 8) {
                const item = data.list[i]
                const date = new Date(item.dt_txt)
                const dayName = date.toLocaleDateString('ru-RU', { weekday: 'short' })
                const temp = Math.round(item.main.temp)
                const icon = item.weather[0].icon
                const description = item.weather[0].description
                
                const card = document.createElement('div')
                card.className = 'forecast-card'
                
                const iconUrl = icon ? `https://openweathermap.org/img/wn/${icon}@2x.png` : 'https://openweathermap.org/img/wn/01d@2x.png'
                
                card.innerHTML = `
                    <div>${dayName}</div>
                    <img src="${iconUrl}" alt="${description}" onerror="this.src='https://openweathermap.org/img/wn/01d@2x.png'">
                    <div class="temp">${temp}°</div>
                `
                domElements.forecastCards.appendChild(card)
            }
        })
        .catch(error => {
            console.error(error)
            domElements.forecastCards.innerHTML = '<p>Ошибка загрузки прогноза</p>'
        })
}