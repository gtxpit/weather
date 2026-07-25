// @ts-ignore
import { apiKey } from '../../api/weather.js'
import { dom } from '../../app.ts' 

async function fetchCitySuggestions(q: string): Promise<void> {
    if (q.length < 2) {
        dom.suggestionsContainer.hidden = true
        return 
    }

    try {
        const res = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${q}&limit=5&appid=${apiKey}`)
        const data = await res.json()
        
        dom.suggestionsContainer.innerHTML = data.map((c: any) =>
            `<div onclick="selectCity('${c.name}')">${c.name}, ${c.country}</div>`
        ).join('')
        
        dom.suggestionsContainer.hidden = data.length === 0
    } catch {
        dom.suggestionsContainer.hidden = true
    }
}