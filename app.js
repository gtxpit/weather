const historyBlock = document.querySelector('.history')
let savedCities = []
const apiKey = 'dec2aa587a7d5f50df886b63ac59a289'
const saveCityButton = document.querySelector(".addForever")
const inputSave = document.querySelector("input")
const button = document.querySelector('input[type="button"]')
const iconImg = document.querySelector('#weatherIcon')
const weatherText = document.querySelector('#weatherText')
const locationBtn = document.getElementById('location')
const forecastCards = document.querySelector('#forecastCards')
let currentCityName = ''
// ===== ГЕОЛОКАЦИЯ =====
function weatherByCoords(lat, lon) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)
        .then(res => res.json())
        .then(data => {
            if (data.cod !== 200) {
                weatherText.textContent = 'Город не найден'
                return
            }
            weatherText.textContent = `${data.name}: ${Math.round(data.main.temp)}°, ${data.weather[0].description}`
            iconImg.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
            saveCityButton.style.display = 'inline-block'
            currentCityName = data.name
        })
        .catch(() => weatherText.textContent = 'Ошибка геолокации')
    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)
        .then(res => res.json())
        .then(data => {
            const container = document.querySelector('#forecastCards');
            container.innerHTML = '';
            for (let i = 0; i < data.list.length && i < 40; i += 8) {
                const day = data.list[i];
                const date = new Date(day.dt_txt);
                const dayName = date.toLocaleDateString('ru-RU', { weekday: 'short' });
                const temp = Math.round(day.main.temp);
                const icon = day.weather[0].icon;
                const card = document.createElement('div');
                card.className = 'forecast-card';
                card.innerHTML = `
                <div>${dayName}</div>
                <img src="https://openweathermap.org/img/wn/${icon}.png">
                <div class="temp">${temp}°</div>
            `;
                container.appendChild(card);
            }
        })
        .catch(err => console.error('Ошибка прогноза по гео:', err));
}

locationBtn.addEventListener('click', () => {
    if (!navigator.geolocation) {
        weatherText.textContent = 'Геолокация не поддерживается'
        return
    }
    weatherText.textContent = 'Определяю...'
    navigator.geolocation.getCurrentPosition(
        pos => weatherByCoords(pos.coords.latitude, pos.coords.longitude),
        () => weatherText.textContent = 'Разрешите доступ к геолокации'
    )
})
function weatherLoad(city) {
    saveCityButton.style.display = 'none'
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
        .then(response => response.json())
        .then(data => {
            if (data.cod !== 200) {
                weatherText.textContent = 'Город не найден, братан'
                return
            }
            const temp = Math.round(data.main.temp)
            const cityName = data.name
            currentCityName = cityName
            const description = data.weather[0].description
            const wind = data.wind.speed
            const icon = data.weather[0].icon

            iconImg.src = `https://openweathermap.org/img/wn/${icon}@2x.png`
            weatherText.textContent = `${cityName}: ${temp}°, ${description}, Wind ${wind} м/с`
            saveCityButton.style.display = 'inline-block'

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
        weatherText.textContent = 'Напиши город '
        return
    }
    weatherLoad(city)
})

inputSave.addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        button.click()
    }
})

function saveCitiesToStorage() {
    localStorage.setItem('favoriteCities', JSON.stringify(savedCities))
}

function loadCitiesFromStorage() {
    const stored = localStorage.getItem('favoriteCities')
    if (stored) {
        savedCities = JSON.parse(stored)
    } else {
        savedCities = []
    }
    renderHistoryList()
    updateHistoryVisibility()
}

function renderHistoryList() {
    const historyContainer = document.querySelector('.history')
    if (!historyContainer) return

    const title = historyContainer.querySelector('h2')
    historyContainer.innerHTML = ''
    if (title) historyContainer.appendChild(title)

    const buttonsContainer = document.createElement('div')
    buttonsContainer.className = 'history-buttons'

    savedCities.forEach(city => {
        // Контейнер для кнопки города и крестика
        const wrapper = document.createElement('div')
        wrapper.className = 'history-item'

        // Кнопка с названием города (просто загружает погоду)
        const cityBtn = document.createElement('button')
        cityBtn.textContent = city
        cityBtn.classList.add('history-btn')
        cityBtn.addEventListener('click', (e) => {
            e.stopPropagation()
            inputSave.value = city
            weatherLoad(city)
        })
        // Крестик (только он вызывает удаление)
        const deleteBtn = document.createElement('button')
        deleteBtn.textContent = '✖'
        deleteBtn.classList.add('delete-btn')
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation()
            if (confirm(`Удалить ${city} из избранного?`)) {
                savedCities = savedCities.filter(c => c !== city)
                saveCitiesToStorage()
                renderHistoryList()
                updateHistoryVisibility()
            }
        })

        wrapper.appendChild(cityBtn)
        wrapper.appendChild(deleteBtn)
        buttonsContainer.appendChild(wrapper)
    })

    historyContainer.appendChild(buttonsContainer)
        // Добавляем кнопку очистки, если есть города
    if (savedCities.length > 0) {
        const clearBtn = document.createElement('button')
        clearBtn.textContent = '🗑️ Очистить все города'
        clearBtn.classList.add('clear-history-btn')
        clearBtn.addEventListener('click', () => {
            clearAllHistory()
        })
        buttonsContainer.appendChild(clearBtn)
    }
}

function updateHistoryVisibility() {
    if (savedCities.length > 0) {
        historyBlock.style.display = 'block'
    } else {
        historyBlock.style.display = 'none'
    }
}

saveCityButton.addEventListener('click', () => {
    if (currentCityName && !savedCities.includes(currentCityName)) {
        savedCities.push(currentCityName)
        saveCitiesToStorage()
        renderHistoryList()
        updateHistoryVisibility()
        console.log('Сохранено:', savedCities)
    } else if (savedCities.includes(currentCityName)) {
        console.log('Город уже в истории')
    }
})
function clearAllHistory() {
    if (confirm('🗑️ Вы уверены, что хотите удалить ВСЕ города из избранного?')) {
        savedCities = []
        saveCitiesToStorage()
        renderHistoryList()
        updateHistoryVisibility()
    }
}
loadCitiesFromStorage()