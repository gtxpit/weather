export default async function handler(req, res) {
    const { city, lat, lon, type } = req.query;
    export const apiKey = process.env.WEATHER_API_KEY; 

    let url = "";

    if (lat && lon) {
        url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=ru`;
    } else if (city && type === 'forecast') { 
        url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric&lang=ru`;
    } else if (city) {
      
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
