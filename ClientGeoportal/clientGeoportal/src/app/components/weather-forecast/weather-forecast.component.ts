import { Component, OnInit } from '@angular/core';
import { WeatherService } from '../../services/weather.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface ForecastItem {
  dt: number;
  main: { temp: number; humidity: number; pressure: number };
  weather: { icon: string; description: string }[];
  wind: { speed: number };
  dt_txt: string;
}

interface GroupedForecast {
  date: string;
  item: ForecastItem;
}

@Component({
  selector: 'app-weather-forecast',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './weather-forecast.component.html',
  styleUrls: ['./weather-forecast.component.css'],
})
export class WeatherForecastComponent implements OnInit {
  cities = ['Tegucigalpa', 'San Pedro Sula', 'La Ceiba', 'Choluteca', 'Comayagua', 'Juticalpa'];
  selectedCity = 'Tegucigalpa';
  forecastDays: GroupedForecast[] = [];
  selectedDayIndex: number = 0;

  constructor(private weatherService: WeatherService) {}

  ngOnInit(): void {
    this.updateForecast(); // al iniciar
  }

  updateForecast() {
    this.weatherService.getForecast(this.selectedCity).subscribe((data) => {
      if (Array.isArray(data.list)) {
        const grouped = this.groupForecastByDay(data.list);
        this.forecastDays = Object.entries(grouped).map(([date, items]) => ({
          date,
          item: this.pickNoonItem(items),
        }));
        this.forecastDays = this.forecastDays.slice(0, 5);
        this.selectedDayIndex = 0; // reiniciar el día
      }
    });
  }

  private groupForecastByDay(list: ForecastItem[]): Record<string, ForecastItem[]> {
    const grouped: Record<string, ForecastItem[]> = {};
    for (const item of list) {
      const date = new Date(item.dt * 1000).toISOString().split('T')[0];
      if (!grouped[date]) grouped[date] = [];
      grouped[date].push(item);
    }
    return grouped;
  }

  private pickNoonItem(items: ForecastItem[]): ForecastItem {
    const targetHour = 12;
    let closest = items[0];
    let minDiff = Math.abs(new Date(items[0].dt * 1000).getHours() - targetHour);
    for (const item of items) {
      const hour = new Date(item.dt * 1000).getHours();
      const diff = Math.abs(hour - targetHour);
      if (diff < minDiff) {
        closest = item;
        minDiff = diff;
      }
    }
    return closest;
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'short' });
  }

  iconUrl(icon: string): string {
    return `https://openweathermap.org/img/wn/${icon}@2x.png`;
  }
}
