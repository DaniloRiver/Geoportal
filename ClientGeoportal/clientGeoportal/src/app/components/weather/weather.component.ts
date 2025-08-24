import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { WeatherService } from '../../services/weather.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-weather',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.css'] // ← corregido aquí
})
export class WeatherComponent implements OnInit {
 @ViewChild('scrollContainer') scrollContainer!: ElementRef<HTMLDivElement>;

  cities: string[] = [
    'Tegucigalpa',
    'San Pedro Sula',
    'La Ceiba',
    'Choluteca',
    'Comayagua',
    'Puerto Cortes',
    'Gracias',
    'Santa Rosa de Copán',
    'La Esperanza',
    'Catacamas'
  ];

  weatherData: any[] = [];

  canScrollLeft = false;
  canScrollRight = false;

  constructor(private weatherService: WeatherService) {}

  ngOnInit(): void {
    this.loadWeather();

    setInterval(() => {
      this.weatherData = [];
      this.loadWeather();
    }, 600000);
  }

  ngAfterViewInit(): void {
    this.updateScrollButtons();
  }

  loadWeather(): void {
    this.cities.forEach(city => {
      this.weatherService.getWeather(city).subscribe(data => {
        // Aquí extraemos los datos para que coincida con tu template
        const iconClass = this.getWeatherIconClass(data.weather[0].main);
        this.weatherData.push({
          name: city,
          temp: Math.round(data.main.temp),
          humidity: data.main.humidity,
          smoke: data.weather[0].main, // o la propiedad correcta para "smoke"
          wind: Math.round(data.wind.speed * 3.6), // convertir m/s a km/h
          pressure: data.main.pressure,
          iconClass
        });
        this.updateScrollButtons();
      });
    });
  }

  getWeatherIconClass(weatherMain: string): string {
    if (!weatherMain) return 'wi wi-na';
    switch (weatherMain.toLowerCase()) {
      case 'clear': return 'wi wi-day-sunny';
      case 'clouds': return 'wi wi-cloudy';
      case 'rain': return 'wi wi-rain';
      case 'smoke': return 'wi wi-smoke';
      case 'thunderstorm': return 'wi wi-thunderstorm';
      case 'drizzle': return 'wi wi-sprinkle';
      case 'snow': return 'wi wi-snow';
      case 'mist': return 'wi wi-fog';
      default: return 'wi wi-day-cloudy';
    }
  }

  scrollLeft(): void {
    this.scrollContainer.nativeElement.scrollBy({ left: -200, behavior: 'smooth' });
    setTimeout(() => this.updateScrollButtons(), 300);
  }

  scrollRight(): void {
    this.scrollContainer.nativeElement.scrollBy({ left: 200, behavior: 'smooth' });
    setTimeout(() => this.updateScrollButtons(), 300);
  }

  updateScrollButtons(): void {
    const el = this.scrollContainer.nativeElement;
    this.canScrollLeft = el.scrollLeft > 0;
    this.canScrollRight = el.scrollLeft + el.clientWidth < el.scrollWidth;
  }

  @HostListener('window:resize')
  onResize() {
    this.updateScrollButtons();
  }

  onScroll() {
    this.updateScrollButtons();
  }
}
