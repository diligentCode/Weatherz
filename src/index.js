// index.js
import "./style.css";
import { displayData } from "./domManagement.js";

window.addEventListener("load", () => {
  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      // Pass coordinates directly to the API
      displayData(`${latitude},${longitude}`);
    },
    (error) => {
      console.warn("Geolocation denied or failed. Defaulting to London.");
      displayData("london");
    },
  );
});

const inputSearch = document.querySelector(".location-search");

inputSearch.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    const location = inputSearch.value.trim();
    if (location !== "") {
      displayData(location);
    }
  }
});
