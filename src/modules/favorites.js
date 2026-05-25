import { domElements, currentCityName, weatherLoad } from './weather.js'

export let savedCities = []

export function saveCitiesToStorage() {
    localStorage.setItem('favoriteCities', JSON.stringify(savedCities))
}

export function loadCitiesFromStorage() {
    const stored = localStorage.getItem('favoriteCities')
    if (stored) {
        savedCities = JSON.parse(stored)
    } else {
        savedCities = []
    }
    renderHistoryList()
    updateHistoryVisibility()
}

export function renderHistoryList() {
    const historyContainer = document.querySelector('.history')
    if (!historyContainer) return

    const title = historyContainer.querySelector('h2')
    historyContainer.innerHTML = ''
    if (title) historyContainer.appendChild(title)

    const buttonsContainer = document.createElement('div')
    buttonsContainer.className = 'history-buttons'

    savedCities.forEach(city => {
        const wrapper = document.createElement('div')
        wrapper.className = 'history-item'

        const cityBtn = document.createElement('button')
        cityBtn.textContent = city
        cityBtn.classList.add('history-btn')
        cityBtn.addEventListener('click', (e) => {
            e.stopPropagation()
            domElements.inputSave.value = city
            weatherLoad(city)
        })

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

    if (savedCities.length > 0) {
        const clearBtn = document.createElement('button')
        clearBtn.textContent = '⌫ Очистить все города'
        clearBtn.classList.add('clear-history-btn')
        clearBtn.addEventListener('click', () => {
            if (confirm('Удалить ВСЕ города из избранного?')) {
                savedCities = []
                saveCitiesToStorage()
                renderHistoryList()
                updateHistoryVisibility()
            }
        })
        historyContainer.appendChild(clearBtn)
    }
}

export function updateHistoryVisibility() {
    const historyBlock = document.querySelector('.history')
    if (historyBlock) {
        historyBlock.style.display = savedCities.length > 0 ? 'block' : 'none'
    }
}

export function initFavorites(saveCityButton, currentCityNameGetter) {
    saveCityButton.addEventListener('click', () => {
        const city = typeof currentCityNameGetter === 'function' ? currentCityNameGetter() : currentCityNameGetter
        if (city && !savedCities.includes(city)) {
            savedCities.push(city)
            saveCitiesToStorage()
            renderHistoryList()
            updateHistoryVisibility()
            console.log('Сохранено:', savedCities)
        } else if (savedCities.includes(city)) {
            console.log('Город уже в истории')
        }
    })
}