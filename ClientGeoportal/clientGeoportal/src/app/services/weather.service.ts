import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  private apiKey = environment.weatherApiKey;
  private baseUrl = 'https://api.openweathermap.org/data/2.5';

  constructor(private http: HttpClient) {}

 getWeather(city: string): Observable<any> {
  const url = `${this.baseUrl}/weather?q=${city},hn&units=metric&lang=es&appid=${this.apiKey}`;
  return this.http.get(url);
}

getForecast(city: string = 'Tegucigalpa') {
  const url = `${this.baseUrl}/forecast?q=${city},hn&appid=${this.apiKey}&units=metric&lang=es`;
  return this.http.get<any>(url); // ya no transformamos aquí
}

  private groupByDay(list: any[]) {
    const days: { [key: string]: any[] } = {};
    list.forEach(item => {
      const date = item.dt_txt.split(' ')[0];
      if (!days[date]) days[date] = [];
      days[date].push(item);
    });
    return days;
  }

}
