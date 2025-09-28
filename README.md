# 🌤️ Weather App

A **simple and responsive weather app** that shows current weather and 5-day forecast for any city. Built with **vanilla JavaScript, HTML, and CSS**, using the **OpenWeatherMap API**.

---

## 📌 Features

* Search for any city and get **current weather**:

  * Temperature (°C)
  * Weather description (Clouds, Clear, Rain, etc.)
  * Humidity
* **5-day forecast** (daily summary, including weather emoji)
* **Loading indicator** while fetching data
* **Error handling** for invalid city names
* **Responsive design** for mobile and desktop
* **Last searched city** saved in `localStorage` for quick access

---

## 🛠️ Demo

![Weather App Demo](demo.png)
*(You can include a screenshot GIF or image here)*

---

## 💻 Installation

1. Clone this repository:

```bash
git clone https://github.com/yourusername/weather-app.git
cd weather-app
```

2. Open `index.html` in your browser.

3. Replace the OpenWeatherMap API key in `script.js`:

```js
const API_KEY = "YOUR_OPENWEATHERMAP_API_KEY";
```

4. Start searching for cities!

---

## ⚡ Usage

* Type a city name in the search bar and click **Get Weather**.
* Click the **last searched city** button to reload the last search quickly.
* Scroll through the **5-day forecast** for a quick look at upcoming weather.

---

## 📝 Technologies

* HTML5 & CSS3 (flexbox, responsive design)
* Vanilla JavaScript (ES6+, Fetch API)
* OpenWeatherMap API (Current Weather & 5-day Forecast)

---

## 🔧 Project Structure

```
weather-app/
├─ index.html       # Main HTML file
├─ style.css        # App styles
├─ script.js        # JavaScript logic
├─ README.md        # This file
└─ demo.png         # Optional demo screenshot
```

---

## 🌟 Future Enhancements

* Toggle between **°C and °F**
* Add **geolocation support** to get local weather automatically
* Improve forecast layout with **charts**
* Use **React.js** for better component structure

---

## 📜 License

This project is licensed under the MIT License.

