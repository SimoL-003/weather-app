import drizzle from "../assets/icons/weather/icon-drizzle.webp";
import storm from "../assets/icons/weather/icon-storm.webp";
import fog from "../assets/icons/weather/icon-fog.webp";
import overcast from "../assets/icons/weather/icon-overcast.webp";
import partlyCloudy from "../assets/icons/weather/icon-partly-cloudy.webp";
import rain from "../assets/icons/weather/icon-rain.webp";
import snow from "../assets/icons/weather/icon-snow.webp";
import sunny from "../assets/icons/weather/icon-sunny.webp";

// A function that takes a weather code and returns the corresponding icon
function weatherCodeToIcon(code) {
  switch (code) {
    case 0:
      return sunny;
    case 1:
    case 2:
      return partlyCloudy;
    case 3:
      return overcast;
    case 45:
    case 48:
      return fog;
    case 51:
      return drizzle;
    case 53:
    case 55:
    case 56:
    case 57:
      return drizzle;
    case 61:
    case 63:
    case 65:
    case 66:
    case 67:
    case 80:
    case 81:
    case 82:
      return rain;
    case 71:
    case 73:
    case 75:
    case 77:
    case 85:
    case 86:
      return snow;
    case 95:
    case 96:
    case 99:
      return storm;
    default:
      return sunny;
  }
}

export { weatherCodeToIcon };
