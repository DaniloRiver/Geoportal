import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MapComponent } from './map/map.component';
import { DatasetsComponent } from './datasets/datasets.component';
import { GeovisorComponent } from './geovisor/geovisor.component';
import { BibliotecaDocumetComponent } from './biblioteca-documet/biblioteca-documet.component';
import { GeoHistoriasComponent } from './geo-historias/geo-historias.component';
import { PanelesEstadisticaComponent } from './paneles-estadistica/paneles-estadistica.component';
import { AcercaDeComponent } from './acercaDe/acerca-de/acerca-de.component';
import { ChatComponent } from './chat/chat/chat.component';
import { WeatherComponent } from './components/weather/weather.component';
import { WeatherForecastComponent } from './components/weather-forecast/weather-forecast.component';
import { MapToolsComponent } from './components/tools/map-tools/map-tools.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'home',
    component:HomeComponent
  },
  {
    path: 'map',
    component:MapComponent
  },
  {
    path:'dataset',
    component:DatasetsComponent
  },
  {
    path:'geovisor',
    component:GeovisorComponent
  },
  {
    path:'biblioteca',
    component:BibliotecaDocumetComponent
  },
  {
    path:'geohistorias',
    component:GeoHistoriasComponent
  },
  {
    path:'paneles',
    component:PanelesEstadisticaComponent
  },
  {
    path:'acerca',
    component:AcercaDeComponent
  },
    {
    path:'chat',
    component:ChatComponent
  },
    {
    path:'weather',
    component:WeatherComponent
  },
  {
    path:'weather-forecasting',
    component:WeatherForecastComponent
  },
  {
    path:'map-tools',
    component:MapToolsComponent
  },
  {
    path: '**',
    redirectTo: 'home'
  }

];
