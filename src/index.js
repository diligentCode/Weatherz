import "./style.css";
import { getData } from "./fetchData.js";

getData();

window.addEventListener("load", () => {
  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      //displayData
    },
    (error) => {
      //Display data london
    },
  );
});

const inputSearch = document.getElementsByClassName("loacation-search");

inputSearch.addEventListener("keydown", (e) => {
  if (e.key == "Enter") {
    const location = inputSearch.value.trim();
    //Check if its not empty
    //display Data
  }
});
