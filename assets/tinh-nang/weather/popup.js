const API_KEY = "077cfd6aee91c517b2428358ee114a8e"; // Thay bằng key thật
const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const resultBox = document.getElementById("weatherResult");
const body = document.body;

// Xử lý sự kiện tìm kiếm
searchBtn.addEventListener("click", handleSearch);
cityInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    handleSearch();
  }
});

function handleSearch() {
  const city = cityInput.value.trim();
  if (city) {
    localStorage.setItem("lastCity", city);
    fetchWeather(city);
  }
}

// Tải vị trí lần đầu
window.onload = () => {
  const lastCity = localStorage.getItem("lastCity");
  if (lastCity) {
    cityInput.value = lastCity;
    fetchWeather(lastCity);
  } else {
    // Nếu không có thành phố đã lưu, thử lấy vị trí địa lý
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          fetchCityFromCoords(latitude, longitude);
        },
        () => {
          // Xử lý khi người dùng từ chối hoặc có lỗi
          displayMessage("Nhập một thành phố để bắt đầu.");
          body.className = 'default-theme';
        }
      );
    } else {
      displayMessage("Trình duyệt không hỗ trợ định vị.");
      body.className = 'default-theme';
    }
  }
};

// Lấy tên thành phố từ tọa độ
function fetchCityFromCoords(lat, lon) {
  fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=vi`)
    .then(res => res.json())
    .then(data => {
      if (data.name) {
        const city = data.name;
        cityInput.value = city;
        localStorage.setItem("lastCity", city);
        fetchWeather(city);
      } else {
         displayMessage("Không thể xác định vị trí.");
      }
    });
}

// Lấy dữ liệu thời tiết
function fetchWeather(city) {
  displayMessage("Đang tải dữ liệu...");
  fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric&lang=vi`)
    .then(res => res.json())
    .then(data => {
      if (data.cod !== "200") {
        displayMessage("Không tìm thấy thành phố này!");
        body.className = 'default-theme';
        return;
      }
      renderWeather(data);
    })
    .catch(() => {
        displayMessage("Lỗi kết nối. Vui lòng thử lại.");
        body.className = 'default-theme';
    });
}

// Hiển thị dữ liệu thời tiết ra giao diện
function renderWeather(data) {
  const cityName = data.city.name;
  const current = data.list[0];
  const weatherCondition = current.weather[0].main;

  // Áp dụng theme dựa trên thời tiết hiện tại
  applyTheme(weatherCondition);

  // HTML cho thời tiết hiện tại
  let html = `
    <div class="current-weather">
      <h2>${cityName}</h2>
      <div class="icon"><i class="${getWeatherIcon(weatherCondition)}"></i></div>
      <p class="temp">${Math.round(current.main.temp)}&deg;C</p>
      <p class="description">${current.weather[0].description}</p>
    </div>
    <div class="details">
        <div>
            <p>Cảm nhận</p>
            <p class="value">${Math.round(current.main.feels_like)}&deg;C</p>
        </div>
        <div>
            <p>Độ ẩm</p>
            <p class="value">${current.main.humidity}%</p>
        </div>
        <div>
            <p>Gió</p>
            <p class="value">${current.wind.speed.toFixed(1)} m/s</p>
        </div>
    </div>
  `;

  // HTML cho dự báo các ngày tiếp theo
  const forecastDays = data.list.filter(item => item.dt_txt.includes("12:00:00")).slice(0, 3);
  
  if (forecastDays.length > 0) {
    html += `
        <div class="forecast">
          <h4>Dự báo 3 ngày tới</h4>
          <div class="forecast-days">
      `;

    forecastDays.forEach(day => {
      html += `
        <div class="day">
          <p class="date">${new Date(day.dt_txt).toLocaleDateString("vi-VN", { weekday: 'short' })}</p>
          <div class="icon"><i class="${getWeatherIcon(day.weather[0].main)}"></i></div>
          <p class="temp">${Math.round(day.main.temp)}&deg;C</p>
        </div>
      `;
    });
  
    html += `</div></div>`;
  }

  resultBox.innerHTML = html;
}

// Thay đổi theme nền
function applyTheme(condition) {
    body.className = ''; // Xóa class cũ
    const theme = getThemeClass(condition.toLowerCase());
    body.classList.add(theme);
}

// Lấy class theme dựa trên điều kiện thời tiết
function getThemeClass(condition) {
    switch (condition) {
        case 'clear':
            return 'theme-clear';
        case 'clouds':
            return 'theme-clouds';
        case 'rain':
            return 'theme-rain';
        case 'drizzle':
             return 'theme-drizzle';
        case 'snow':
            return 'theme-snow';
        case 'thunderstorm':
            return 'theme-thunderstorm';
        case 'mist':
        case 'smoke':
        case 'haze':
        case 'dust':
        case 'fog':
        case 'sand':
        case 'ash':
        case 'squall':
        case 'tornado':
            return 'theme-atmosphere';
        default:
            return 'default-theme';
    }
}

// Lấy class icon dựa trên điều kiện thời tiết
function getWeatherIcon(condition) {
    switch (condition.toLowerCase()) {
        case 'clear':
            return 'fa-solid fa-sun';
        case 'clouds':
            return 'fa-solid fa-cloud';
        case 'rain':
            return 'fa-solid fa-cloud-showers-heavy';
        case 'drizzle':
            return 'fa-solid fa-cloud-rain';
        case 'snow':
            return 'fa-solid fa-snowflake';
        case 'thunderstorm':
            return 'fa-solid fa-cloud-bolt';
        case 'mist':
        case 'fog':
            return 'fa-solid fa-smog';
        default:
            return 'fa-solid fa-question';
    }
}

// Hiển thị thông báo (lỗi, đang tải,...)
function displayMessage(message) {
    resultBox.innerHTML = `<p class="message">${message}</p>`;
}