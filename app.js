import { 
    domElements, setDomElements, 
    weatherLoad, weatherByCoords, 
    currentCityName 
} from './src/modules/weather.js'
import { 
    loadCitiesFromStorage, initFavorites 
} from './src/modules/favorites.js'
import { initTheme } from './src/modules/theme.js'
import { initClock } from './src/modules/time.ts'

// ===== НАХОДИМ ВСЕ DOM ЭЛЕМЕНТЫ =====
const dom = {
    saveCityButton: document.querySelector(".addForever"),
    inputSave: document.querySelector("input"),
    button: document.querySelector('input[type="button"]'),
    iconImg: document.querySelector('#weatherIcon'),
    weatherText: document.querySelector('#weatherText'),
    locationBtn: document.getElementById('location'),
    forecastCards: document.querySelector('#forecastCards')
}

// Передаём DOM-элементы в модуль weather
setDomElements(dom)

// ===== ОБРАБОТЧИКИ =====
dom.button.addEventListener('click', () => {
    const city = dom.inputSave.value.trim()
    if (city === '') {
        dom.weatherText.textContent = 'Напиши город '
        dom.locationBtn.style.display = 'inline-block'
        return
    }
    weatherLoad(city)
})

dom.inputSave.addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        dom.button.click()
    }
})

dom.locationBtn.addEventListener('click', () => {
    if (!navigator.geolocation) {
        dom.weatherText.textContent = 'Геолокация не поддерживается'
        return
    }
    dom.weatherText.textContent = 'Определяю...'
    navigator.geolocation.getCurrentPosition(
        pos => weatherByCoords(pos.coords.latitude, pos.coords.longitude),
        () => dom.weatherText.textContent = 'Разрешите доступ к геолокации'
    )
})

// ===== ИНИЦИАЛИЗАЦИЯ ИЗБРАННОГО =====
initFavorites(dom.saveCityButton, () => currentCityName)

// ===== ИНИЦИАЛИЗАЦИЯ ВСЕГО ОСТАЛЬНОГО =====
initTheme()
initClock()
loadCitiesFromStorage()