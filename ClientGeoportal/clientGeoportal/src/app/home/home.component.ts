import { Component } from '@angular/core';
import { NavigationToolsComponent } from "../components/tools/navigation-tools/navigation-tools.component";
import { RouterLink } from '@angular/router';
import { WeatherComponent } from "../components/weather/weather.component";
import { CarouselComponent } from "../components/carousel/carousel.component";
import { CarouselImage } from '../models/carousel-image.model';


@Component({
  selector: 'app-home',
  imports: [NavigationToolsComponent, RouterLink, WeatherComponent, CarouselComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  carouselImages: CarouselImage[] = [
    {
      src: '/assets/img/banner1.jpg',
      alt: 'Mapa interactivo',
      title: '¡Novedades en GeoHonduras!',
      description: 'Explora nuestras nuevas capas de mapas y datos actualizados.'
    },
    {
      src: '/assets/img/banner2.jpg',
      alt: 'Datos abiertos',
      title: 'Datos abiertos',
      description: 'Consulta conjuntos de datos geoespaciales disponibles para todos.'
    },
    {
      src: '/assets/img/banner3.jpg',
      alt: 'Historias interactivas',
      title: 'GeoHistorias',
      description: 'Narrativas interactivas basadas en mapas reales.'
    }
  ];
}
