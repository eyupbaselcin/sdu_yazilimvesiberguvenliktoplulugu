const havaDurumuAciklamalari = {
    0: "Açık hava",
    1: "Çoğunlukla açık",
    2: "Parçalı bulutlu",
    3: "Bulutlu",
    45: "Sisli",
    48: "Kırağılı sis",
    51: "Hafif çisenti",
    53: "Çisenti",
    55: "Yoğun çisenti",
    61: "Hafif yağmur",
    63: "Yağmurlu",
    65: "Şiddetli yağmur",
    71: "Hafif kar",
    73: "Karlı",
    75: "Yoğun kar",
    80: "Hafif sağanak",
    81: "Sağanak yağış",
    82: "Şiddetli sağanak",
    95: "Gök gürültülü fırtına"
};

function havaDurumuTipiniAl(weatherCode) {
    if (weatherCode === 0 || weatherCode === 1) {
        return "clear";
    }

    if (weatherCode >= 71 && weatherCode <= 77) {
        return "snow";
    }

    if (weatherCode >= 95) {
        return "storm";
    }

    if (weatherCode >= 51 && weatherCode <= 82) {
        return "rain";
    }

    return "cloudy";
}

async function havaDurumunuAl() {
    // Isparta Merkez koordinatları
    const lat = 37.7648;
    const lon = 30.5566;
    
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,wind_speed_10m,weather_code&timezone=auto`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`API hatası: ${response.status}`);
        }

        const data = await response.json();

        const currentWeather = data.current;
        const temperature = document.querySelector("#sicaklik");
        const windSpeed = document.querySelector("#ruzgar");
        const weatherStatus = document.querySelector("#hava-durumu-durum");
        const lastUpdated = document.querySelector("#hava-guncelleme");
        const weatherVisual = document.querySelector("#weather-3d");

        if (temperature) {
            temperature.textContent = `${currentWeather.temperature_2m} °C`;
        }

        if (windSpeed) {
            windSpeed.textContent = `${currentWeather.wind_speed_10m} km/sa`;
        }

        if (weatherStatus) {
            weatherStatus.textContent = havaDurumuAciklamalari[currentWeather.weather_code] || "Güncel hava bilgisi";
        }

        if (weatherVisual) {
            weatherVisual.dataset.weatherCode = currentWeather.weather_code;
            weatherVisual.dataset.weatherType = havaDurumuTipiniAl(currentWeather.weather_code);
        }

        if (lastUpdated) {
            lastUpdated.textContent = new Date().toLocaleTimeString("tr-TR", {
                hour: "2-digit",
                minute: "2-digit"
            });
        }

        console.log("Sıcaklık:", currentWeather.temperature_2m, "°C");
        console.log("Rüzgar Hızı:", currentWeather.wind_speed_10m, "km/sa");
    } catch (error) {
        const weatherStatus = document.querySelector("#hava-durumu-durum");
        const lastUpdated = document.querySelector("#hava-guncelleme");

        if (weatherStatus) {
            weatherStatus.textContent = "Hava durumu alınamadı";
        }

        if (lastUpdated) {
            lastUpdated.textContent = "Tekrar deneniyor";
        }

        console.error("Hava durumu verisi alınamadı:", error);
    }
}

havaDurumunuAl();
setInterval(havaDurumunuAl, 10 * 60 * 1000);