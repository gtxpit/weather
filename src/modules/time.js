export function initClock() {
    function updateLocalTime() {
        const now = new Date()
        const timeString = now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
        const timeElement = document.getElementById('cityTime')
        if (timeElement) {
            timeElement.textContent = timeString
        }
    }
    
    updateLocalTime()
    setInterval(updateLocalTime, 1000)
}