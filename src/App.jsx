import { useState, useEffect } from 'react'

function App() {
  const [city, setCity] = useState('Bodhan')
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(false)
  const [suggestions, setSuggestions] = useState([])

  const fetchWeatherByCoords = async (lat, lon, name, country, admin1) => {
    setLoading(true)
    setSuggestions([])
    try {
      const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,wind_speed_10m,weather_code,is_day&daily=temperature_2m_max,temperature_2m_min&timezone=auto`)
      const data = await res.json()
      setWeather({ ...data, cityName: name, country, admin1 })
    } catch(e) {}
    setLoading(false)
  }

  const searchCities = async (q) => {
    setCity(q)
    if(q.length < 2){ setSuggestions([]); return }
    // count 10 chesa - villages kuda vastai
    const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${q}&count=10&language=en&format=json`)
    const geoData = await geoRes.json()
    setSuggestions(geoData.results || [])
  }

  useEffect(() => { fetchWeatherByCoords(18.67, 77.88, 'Bodhan', 'India', 'Telangana') }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 to-blue-600 flex items-center justify-center p-4">
      <div className="bg-white/95 p-6 rounded-3xl shadow-2xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-2">Weather App</h1>
        <p className="text-center text-gray-500 mb-6">Village • City • World</p>
        
        <div className="relative mb-6">
          <input value={city} onChange={(e)=>searchCities(e.target.value)} placeholder="Village / City - Eg: Salura, Ranjal, Hyderabad" className="w-full px-4 py-3 rounded-xl border-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none" />
          {suggestions.length > 0 && (
            <div className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-2xl z-10 max-h-72 overflow-y-auto">
              {suggestions.map((p,i)=>(
                <div key={i} onClick={()=>fetchWeatherByCoords(p.latitude, p.longitude, p.name, p.country, p.admin1)} className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b last:border-0 text-left">
                  <b className="text-base">{p.name}</b> <span className="text-xs bg-blue-100 px-2 py-0.5 rounded">{p.feature_code || 'Place'}</span>
                  <p className="text-xs text-gray-600">{p.admin2 ? p.admin2 + ', ' : ''}{p.admin1 ? p.admin1 + ', ' : ''}{p.country} {p.population ? `• ${p.population} people` : ''}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {loading ? <p className="text-center animate-pulse">Loading...</p> : weather && (
          <div className="text-center">
            <h2 className="text-2xl font-bold">{weather.cityName}</h2>
            <p className="text-sm text-gray-500">{weather.admin1}, {weather.country}</p>
            <p className="text-6xl font-bold my-4">{Math.round(weather.current.temperature_2m)}°C</p>
            <div className="grid grid-cols-2 gap-3 mt-6">
              <div className="bg-blue-50 p-3 rounded-xl"><p className="text-xs text-gray-500">Wind</p><p className="font-bold">{weather.current.wind_speed_10m} km/h</p></div>
              <div className="bg-orange-50 p-3 rounded-xl"><p className="text-xs text-gray-500">Max/Min</p><p className="font-bold">{Math.round(weather.daily.temperature_2m_max[0])}° / {Math.round(weather.daily.temperature_2m_min[0])}°</p></div>
            </div>
            <p className="mt-4 text-xs text-gray-400">Lat: {weather.latitude.toFixed(2)}, Lon: {weather.longitude.toFixed(2)}</p>
          </div>
        )}
      </div>
    </div>
  )
}
export default App