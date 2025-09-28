/* ---------- Simple Weather App (vanilla JS) ----------
   - Uses OpenWeatherMap (current weather + 5-day forecast)
   - Saves last searched city in localStorage
   - Shows loading indicator and clear errors
   --------------------------------------------------- */

/* ====== CONFIG ====== */
const API_KEY = "798e93b386b151f0b641db2f23ff7646";
const STORAGE_KEY = "weatherApp.lastCity";

/* ====== STATE ====== */
const state = {
  loading: false,
  error: null,
  current: null,
  forecast: null,
};

/* ====== DOM REFS ====== */
const searchForm = document.getElementById("searchForm");
const cityInput = document.getElementById("cityInput");
const card = document.getElementById("card");
const loadingEl = document.getElementById("loading");
const errorEl = document.getElementById("error");
const currentEl = document.getElementById("current");
const forecastEl = document.getElementById("forecast");
const forecastList = document.getElementById("forecastList");
const cityNameEl = document.getElementById("cityName");
const tempEl = document.getElementById("temp");
const descEl = document.getElementById("desc");
const humidityEl = document.getElementById("humidity");
const emojiEl = document.getElementById("emoji");
const lastCityContainer = document.getElementById("lastCityContainer");
const lastCityBtn = document.getElementById("lastCityBtn");

/* ====== UTILITIES ====== */
function setState(patch) {
  Object.assign(state, patch);
  render();
}

function saveLastCity(city) {
  try { localStorage.setItem(STORAGE_KEY, city); }
  catch(e) { /* ignore storage errors */ }
}

function loadLastCity() {
  try { return localStorage.getItem(STORAGE_KEY); }
  catch(e) { return null; }
}

function kelvinToC(k) { return (k - 273.15).toFixed(1); }

/* Map weather id to emoji (simple) */
function weatherEmoji(id) {
  if (id >= 200 && id < 600) return "⛈️";
  if (id >= 600 && id < 700) return "❄️";
  if (id >= 700 && id < 800) return "🌫️";
  if (id === 800) return "☀️";
  if (id > 800) return "☁️";
  return "❓";
}

/* Group forecast list by date and pick entry closest to 12:00 */
function extractDailyForecast(forecastData) {
  // forecastData.list contains 3-hour entries with dt_txt (YYYY-MM-DD HH:MM:SS)
  const byDate = {};
  forecastData.list.forEach(item => {
    const date = item.dt_txt.split(" ")[0];
    if (!byDate[date]) byDate[date] = [];
    byDate[date].push(item);
  });

  // take up to next 5 days (exclude today if already included as partial)
  const sortedDates = Object.keys(byDate).sort();
  const days = sortedDates.slice(0, 5).map(date => {
    const entries = byDate[date];
    // find entry with time closest to 12:00
    const pick = entries.reduce((best, cur) => {
      const targetHour = 12;
      const curHour = parseInt(cur.dt_txt.split(" ")[1].split(":")[0], 10);
      const bestHour = parseInt(best.dt_txt.split(" ")[1].split(":")[0], 10);
      return Math.abs(curHour - targetHour) < Math.abs(bestHour - targetHour) ? cur : best;
    }, entries[0]);

    return {
      date,
      temp: pick.main.temp, // already in metric if requested
      description: pick.weather[0].description,
      id: pick.weather[0].id,
    };
  });

  return days;
}

/* ====== FETCHING ====== */
async function fetchWeather(city) {
  setState({ loading: true, error: null });
  try {
    const currentResp = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`
    );
    if (!currentResp.ok) {
      throw new Error(`City not found or API error (${currentResp.status})`);
    }
    const currentData = await currentResp.json();

    const forecastResp = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`
    );
    if (!forecastResp.ok) {
      // forecast optional — but we throw to show unified error
      throw new Error(`Forecast data unavailable (${forecastResp.status})`);
    }
    const forecastData = await forecastResp.json();

    setState({ current: currentData, forecast: forecastData, loading: false, error: null });
    saveLastCity(city);
  } catch (err) {
    setState({ loading: false, error: err.message || "Unknown error" });
  }
}

/* ====== RENDER ====== */
function render() {
  card.hidden = false;

  // loading
  loadingEl.hidden = !state.loading;
  if (state.loading) {
    errorEl.hidden = true;
    currentEl.hidden = true;
    forecastEl.hidden = true;
    return;
  }

  // error
  if (state.error) {
    errorEl.hidden = false;
    errorEl.textContent = state.error;
    currentEl.hidden = true;
    forecastEl.hidden = true;
    return;
  } else {
    errorEl.hidden = true;
  }

  // current weather
  if (state.current) {
    const d = state.current;
    cityNameEl.textContent = `${d.name}, ${d.sys?.country || ""}`;
    tempEl.textContent = `${d.main.temp.toFixed(1)} °C`;
    descEl.textContent = d.weather[0].description;
    humidityEl.textContent = `Humidity: ${d.main.humidity}%`;
    emojiEl.textContent = weatherEmoji(d.weather[0].id);
    currentEl.hidden = false;
  } else {
    currentEl.hidden = true;
  }

  // forecast
  if (state.forecast) {
    const days = extractDailyForecast(state.forecast);
    forecastList.innerHTML = "";
    days.forEach(day => {
      const item = document.createElement("div");
      item.className = "forecast-item";
      const date = new Date(day.date);
      const dayName = date.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
      item.innerHTML = `
        <div class="day">${dayName}</div>
        <div class="f-temp">${day.temp.toFixed(1)}°C</div>
        <div class="f-desc">${day.description}</div>
        <div class="f-emoji">${weatherEmoji(day.id)}</div>
      `;
      forecastList.appendChild(item);
    });
    forecastEl.hidden = false;
  } else {
    forecastEl.hidden = true;
  }

  // last saved city
  const last = loadLastCity();
  if (last) {
    lastCityContainer.hidden = false;
    lastCityBtn.textContent = last;
  } else {
    lastCityContainer.hidden = true;
  }
}

/* ====== UI Handlers ====== */
searchForm.addEventListener("submit", event => {
  event.preventDefault();
  const city = cityInput.value.trim();
  if (!city) {
    setState({ error: "Please enter a city name." });
    return;
  }
  fetchWeather(city);
});

lastCityBtn.addEventListener("click", () => {
  const last = loadLastCity();
  if (last) {
    cityInput.value = last;
    fetchWeather(last);
  }
});

/* ====== INIT: try load last city on start ====== */
(function init() {
  const last = loadLastCity();
  if (last) {
    cityInput.value = last;
    // optionally auto-fetch the last city:
    // fetchWeather(last);
    // Keep app quiet until user clicks; show last city button instead
  }
  render();
})();
