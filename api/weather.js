export default async function handler(req, res) {
    // Получаем параметры, которые пришлет твой фронтенд
    const { city, lat, lon, type } = req.query;
    const apiKey = process.env.WEATHER_API_KEY; // Ключ будет лежать в панельке Vercel

    let url = "";

    // Проверяем, какой именно запрос пришел с фронтенда
    if (lat && lon) {
        // 1. Запрос по геолокации
        url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=ru`;
    } else if (city && type === 'forecast') {
        // 2. Запрос прогноза по городу
        url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric&lang=ru`;
    } else if (city) {
        // 3. Обычный запрос текущей погоды по городу
        url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric&lang=ru`;
    } else {
        return res.status(400).json({ error: "Не переданы параметры запроса" });
    }

    try {
        const apiResponse = await fetch(url);
        const data = await apiResponse.json();
        return res.status(apiResponse.status).json(data);
    } catch (error) {
        return res.status(500).json({ error: "Ошибка сервера при запросе к API" });
    }
}
