import {
    domElements, setDomElements,
    weatherLoad, weatherByCoords,
    currentCityName
} from './src/modules/weather'
import {
    loadCitiesFromStorage, initFavorites
} from './src/modules/favorites'
import { initTheme } from './src/modules/theme'
import { initClock } from './src/modules/time'

const dom = {
    saveCityButton: document.querySelector(".addForever") as HTMLButtonElement,
    inputSave: document.querySelector("input") as HTMLInputElement,
    button: document.querySelector('input[type="button"]') as HTMLInputElement,
    iconImg: document.querySelector('#weatherIcon') as HTMLImageElement,
    weatherText: document.querySelector('#weatherText') as HTMLDivElement,
    locationBtn: document.getElementById('location') as HTMLButtonElement,
    forecastCards: document.querySelector('#forecastCards') as HTMLDivElement
}


dom.button.addEventListener('click', () => { 
    const city = dom.inputSave.value.trim()
    if (!city) { 
        dom.weatherText.textContent = 'Напиши город'
        dom.locationBtn.style.display = 'inline-block'
        return
    }
    weatherLoad(city)
})

dom.inputSave.addEventListener('keypress', (event) => {
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

initFavorites(dom.saveCityButton, () => currentCityName)
initTheme()
initClock()
loadCitiesFromStorage()