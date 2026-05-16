import { getData } from "./fetchData.js";

let weatherData = null;
let selectedDayIndex = 0;
let selectedHourIndex = null;
let currentLocation = "";

export async function displayData(location) {
  try {
    currentLocation = location;
    weatherData = await getData(location);
    selectedDayIndex = 0;
    selectedHourIndex = null;
    updateUI();
  } catch (error) {
    console.error(error.message);
  }
}

function updateUI() {
  if (!weatherData) return;

  const dayData = weatherData.days[selectedDayIndex];
  const activeData =
    selectedHourIndex !== null ? dayData.hours[selectedHourIndex] : dayData;

  updateMainDisplay(activeData, dayData);
  updateStats(activeData);
  renderDays();
  renderHours(dayData.hours);
  updateBackgroundVideo(
    activeData.icon,
    weatherData.currentConditions.datetime,
  );
}

function updateMainDisplay(activeData, dayData) {
  document.querySelector(".temperature").textContent =
    `${Math.round(activeData.temp)}°`;
  document.querySelector(".condition").textContent = activeData.conditions;
  document.querySelector(".summaryText").textContent = dayData.description;

  const searchInput =
    document.querySelector("input[type='search']") ||
    document.querySelector("input[type='text']") ||
    document.querySelector("input");

  if (searchInput) {
    searchInput.value =
      weatherData.resolvedAddress || weatherData.address || currentLocation;
  }
}

function updateStats(data) {
  const statValues = document.querySelectorAll(".stat-card .stat-value");
  statValues[0].textContent = `${Math.round(data.feelslike)}°`;
  statValues[1].textContent = `${data.precip || 0}"`;
  statValues[2].textContent = `${data.visibility} mi`;
  statValues[3].textContent = `${Math.round(data.humidity)}%`;

  document.querySelector(".uv-content .stat-value").textContent =
    data.uvindex || 0;
  document.querySelector(".wind-row .stat-value").textContent = Math.round(
    data.windspeed || 0,
  );
}

function renderDays() {
  const daysContainer = document.querySelector(".forecast-scroll.days");
  daysContainer.style.display = "flex";
  daysContainer.style.overflowX = "auto";
  daysContainer.innerHTML = "";

  weatherData.days.forEach((day, index) => {
    const div = document.createElement("div");
    div.classList.add("forecast-item");

    if (index === selectedDayIndex) {
      div.classList.add("active");
    }

    const dateObj = new Date(day.datetime);
    const dayName =
      index === 0
        ? "Today"
        : dateObj.toLocaleDateString("en-US", { weekday: "short" });
    const dateStr = `${dateObj.getDate()}/${dateObj.getMonth() + 1}`;

    div.innerHTML = `
      <span>${dayName}</span>
      <span class="date">${dateStr}</span>
      ${getIconSVG(day.icon)} 
      <span>${Math.round(day.temp)}°</span>
    `;

    div.addEventListener("click", () => {
      selectedDayIndex = index;
      selectedHourIndex = null;
      updateUI();
    });

    daysContainer.appendChild(div);
  });
}

function renderHours(hours) {
  const hoursContainer = document.querySelector(".forecast-scroll.hourly");
  hoursContainer.style.display = "flex";
  hoursContainer.style.overflowX = "auto";
  hoursContainer.innerHTML = "";

  hours.forEach((hour, index) => {
    const div = document.createElement("div");
    div.classList.add("forecast-item");
    div.style.flexShrink = "0";

    if (index === selectedHourIndex) {
      div.classList.add("active");
    }

    const timeStr = hour.datetime.substring(0, 5);
    div.innerHTML = `
      <span>${timeStr}</span>
      ${getIconSVG(hour.icon)}
      <span>${Math.round(hour.temp)}°</span>
    `;

    div.addEventListener("click", () => {
      selectedHourIndex = index;
      updateUI();
    });

    hoursContainer.appendChild(div);
  });
}

function updateBackgroundVideo(icon, currentTimeString) {
  const videoElement = document.getElementById("bg-video");
  const videoPath = "./assets/vedios/";
  let videoName = "";

  const iconMap = {
    snow: "snowfall.mp4",
    rain: "rain.mp4",
    fog: "fog.mp4",
    wind: "windy.mp4",
    cloudy: "cloudy.mp4",
    "partly-cloudy-day": "partlyCloudyDay.mp4",
    "partly-cloudy-night": "partlyCloudyNight.mp4",
    thunderstorm: "thunderstorm.mp4",
    "showers-day": "rain.mp4",
    "showers-night": "rain.mp4",
  };

  if (iconMap[icon]) {
    videoName = iconMap[icon];
  } else {
    const currentHour = parseInt(currentTimeString.split(":")[0], 10);

    if (currentHour >= 6 && currentHour < 12) {
      videoName = "sunrise.mp4";
    } else if (currentHour >= 12 && currentHour < 17) {
      videoName = "sunnySky.mp4";
    } else if (currentHour >= 17 && currentHour < 20) {
      videoName = "sunset.mp4";
    } else {
      videoName = "clearNight.mp4";
    }
  }

  const sourceEl = videoElement.querySelector("source");
  if (sourceEl.getAttribute("src") !== videoPath + videoName) {
    sourceEl.setAttribute("src", videoPath + videoName);
    videoElement.load();
  }
}

function getIconSVG(icon) {
  const svgs = {
    "clear-day": `<svg class="icon-svg weather-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`,
    "clear-night": `<svg class="icon-svg weather-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`,
    cloudy: `<svg class="icon-svg weather-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/></svg>`,
    "partly-cloudy-day": `<svg class="icon-svg weather-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/></svg>`,
    "partly-cloudy-night": `<svg class="icon-svg weather-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/></svg>`,
    rain: `<svg class="icon-svg weather-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 17.58A5 5 0 0 0 18 8h-1.26A8 8 0 1 0 4 16.25"/><line x1="8" y1="16" x2="8" y2="22"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="16" y1="16" x2="16" y2="22"/></svg>`,
    "showers-day": `<svg class="icon-svg weather-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 17.58A5 5 0 0 0 18 8h-1.26A8 8 0 1 0 4 16.25"/><line x1="8" y1="16" x2="8" y2="22"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="16" y1="16" x2="16" y2="22"/></svg>`,
    "showers-night": `<svg class="icon-svg weather-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 17.58A5 5 0 0 0 18 8h-1.26A8 8 0 1 0 4 16.25"/><line x1="8" y1="16" x2="8" y2="22"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="16" y1="16" x2="16" y2="22"/></svg>`,
    snow: `<svg class="icon-svg weather-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="2" x2="12" y2="22"/><line x1="5" y1="6" x2="19" y2="18"/><line x1="5" y1="18" x2="19" y2="6"/></svg>`,
    wind: `<svg class="icon-svg weather-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"/></svg>`,
    fog: `<svg class="icon-svg weather-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="4" y1="14" x2="20" y2="14"/><line x1="4" y1="18" x2="20" y2="18"/><line x1="4" y1="22" x2="20" y2="22"/><line x1="4" y1="10" x2="20" y2="10"/></svg>`,
    thunderstorm: `<svg class="icon-svg weather-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 16.9A5 5 0 0 0 18 7h-1.26a8 8 0 1 0-11.62 9"/><polyline points="13 11 9 17 15 17 11 23"/></svg>`,
  };

  return svgs[icon] || svgs["clear-day"];
}
