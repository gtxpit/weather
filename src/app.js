const historyBlock = document.querySelector('.history')
let savedCities = []
const apiKey = import.meta.env.VITE_WEATHER_KEY
const saveCityButton = document.querySelector(".addForever")
const inputSave = document.querySelector("input")
const button = document.querySelector('input[type="button"]')
const iconImg = document.querySelector('#weatherIcon')
const weatherText = document.querySelector('#weatherText')
const locationBtn = document.getElementById('location')
const forecastCards = document.querySelector('#forecastCards')
let currentCityName = ''

// ===== УНИВЕРСАЛЬНАЯ ФУНКЦИЯ ЗАГРУЗКИ (Погода + Прогноз) =====
async function weatherLoad(city, lat = null, lon = null) {
    saveCityButton.style.display = 'none'
    locationBtn.style.display = 'inline-block'
    forecastCards.innerHTML = '<p>Загрузка прогноза...</p>'
    
    // ВАЖНО: Используем обратные кавычки (клавиша Ё) для подстановки переменных
    const weatherUrl = (lat && lon) 
        ? `https://openweathermap.org{lat}&lon=${lon}&appid=${apiKey}&units=metric`
        : `https://openweathermap.org{city}&appid=${apiKey}&units=metric`
    
    const forecastUrl = (lat && lon)
        ? `https://openweathermap.org{lat}&lon=${lon}&appid=${apiKey}&units=metric`
        : `https://openweathermap.org{city}&appid=${apiKey}&units=metric`

    try {
        // 1. Загружаем текущую погоду
        const weatherRes = await fetch(weatherUrl)
        const weatherData = await weatherRes.json()

        if (weatherData.cod != 200) {
            weatherText.textContent = 'Город не найден, братан'
            forecastCards.innerHTML = ''
            return
        }

        // Отрисовка текущей погоды
        const temp = Math.round(weatherData.main.temp)
        currentCityName = weatherData.name
        const description = weatherData.weather[0].description
        const wind = weatherData.wind.speed
        const icon = weatherData.weather[0].icon

        iconImg.src = `https://openweathermap.org{icon}@2x.png`
        weatherText.textContent = `${currentCityName}: ${temp}°, ${description}, Wind ${wind} м/с`
        saveCityButton.style.display = 'inline-block'
        locationBtn.style.display = 'none'

        // Меняем фон
        const weatherType = icon.substring(0, 2)
        document.body.className = ''
        const bgClasses = { '01': 'sunny', '02': 'cloudy', '03': 'cloudy', '04': 'cloudy', '13': 'snowy' }
        document.body.classList.add(bgClasses[weatherType] || 'cloudy')

        // 2. Загружаем прогноз
        const forecastRes = await fetch(forecastUrl)
        const forecastData = await forecastRes.json()

        if (forecastData.cod != 200) {
            forecastCards.innerHTML = '<p>Прогноз не найден</p>'
            return
        }

        forecastCards.innerHTML = ''
        for (let i = 8; i < forecastData.list.length && i < 48; i += 8) {
            const item = forecastData.list[i]
            const date = new Date(item.dt_txt)
            const dayName = date.toLocaleDateString('ru-RU', { weekday: 'short' })
            const forecastIcon = item.weather[0].icon
            const forecastDesc = item.weather[0].description
            
            const card = document.createElement('div')
            card.className = 'forecast-card'
            card.innerHTML = `
                <div>${dayName}</div>
                <img src="https://openweathermap.org{forecastIcon}.png" alt="${forecastDesc}">
                <div class="temp">${Math.round(item.main.temp)}°</div>
            `
            forecastCards.appendChild(card)
        }
    } catch (error) {
        console.error("Ошибка в weatherLoad:", error)
        weatherText.textContent = 'Ошибка сети или API'
        forecastCards.innerHTML = ''
    }
}

// ===== ГЕОЛОКАЦИЯ =====
locationBtn.addEventListener('click', () => {
    if (!navigator.geolocation) {
        weatherText.textContent = 'Геолокация не поддерживается'
        return
    }
    weatherText.textContent = 'Определяю...'
    navigator.geolocation.getCurrentPosition(
        pos => {
            weatherLoad(null, pos.coords.latitude, pos.coords.longitude)
        },
        () => {
            weatherText.textContent = 'Разрешите доступ к геолокации'
        }
    )
})

// ===== ОБРАБОТЧИКИ КНОПОК =====
button.addEventListener('click', () => {
    const city = inputSave.value.trim()
    if (city) {
        weatherLoad(city)
    } else {
        weatherText.textContent = 'Напиши город'
    }
})

inputSave.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') button.click()
})

// ===== ИЗБРАННОЕ (LocalStorage) =====
function saveCitiesToStorage() {
    localStorage.setItem('favoriteCities', JSON.stringify(savedCities))
}

function loadCitiesFromStorage() {
    const stored = localStorage.getItem('favoriteCities')
    savedCities = stored ? JSON.parse(stored) : []
    renderHistoryList()
    updateHistoryVisibility()
}

function renderHistoryList() {
    const historyContainer = document.querySelector('.history')
    if (!historyContainer) return
    historyContainer.innerHTML = '<h2>Favorite city</h2>'

    const buttonsContainer = document.createElement('div')
    buttonsContainer.className = 'history-buttons'

    savedCities.forEach(city => {
        const wrapper = document.createElement('div')
        wrapper.className = 'history-item'
        
        const cityBtn = document.createElement('button')
        cityBtn.className = 'history-btn'
        cityBtn.textContent = city
        cityBtn.onclick = () => {
            inputSave.value = city
            weatherLoad(city)
        }

        const deleteBtn = document.createElement('button')
        deleteBtn.className = 'delete-btn'
        deleteBtn.textContent = '✖'
        deleteBtn.onclick = (e) => {
            e.stopPropagation()
            if (confirm(`Удалить ${city}?`)) {
                savedCities = savedCities.filter(c => c !== city)
                saveCitiesToStorage()
                renderHistoryList()
                updateHistoryVisibility()
            }
        }

        wrapper.appendChild(cityBtn)
        wrapper.appendChild(deleteBtn)
        buttonsContainer.appendChild(wrapper)
    })

    if (savedCities.length > 0) {
        const clearBtn = document.createElement('button')
        clearBtn.className = 'clear-history-btn'
        clearBtn.textContent = '🗑️ Очистить всё'
        clearBtn.onclick = () => {
            if (confirm('Удалить все города из избранного?')) {
                savedCities = []
                saveCitiesToStorage()
                renderHistoryList()
                updateHistoryVisibility()
            }
        }
        buttonsContainer.appendChild(clearBtn)
    }
    historyContainer.appendChild(buttonsContainer)
}

function updateHistoryVisibility() {
    historyBlock.style.display = savedCities.length > 0 ? 'block' : 'none'
}

saveCityButton.addEventListener('click', () => {
    if (currentCityName && !savedCities.includes(currentCityName)) {
        savedCities.push(currentCityName)
        saveCitiesToStorage()
        renderHistoryList()
        updateHistoryVisibility()
    }
})

loadCitiesFromStorage()
