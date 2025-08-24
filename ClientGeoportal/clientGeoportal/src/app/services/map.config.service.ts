import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { MapLayerCreate, MapLayerResponse, MapLayerUpdate } from '../models/map-layer.models';
import { Observable } from 'rxjs';


export interface MapItem {
  title: string;
  description: string;
  tags: string[];
  year: string;
  department: string;
  imagen: string;
  lat: number;
  lon: number;
};

@Injectable({
  providedIn: 'root',
})
export class MapConfigService {
  readonly mapboxToken = environment.mapboxToken;
  readonly googleMapsApiKey = environment.googleMapsApiKey;
  private baseUrl = 'http://localhost:8000';


  constructor(private http: HttpClient) { }

  getMapboxToken(): string {
    return this.mapboxToken;
  }

  getGoogleMapsApiKey(): string {
    return this.googleMapsApiKey;
  }

  listarCapas(): Observable<MapLayerResponse[]> {
    return this.http.get<MapLayerResponse[]>(`${this.baseUrl}/capas`);
  }

  obtenerCapaPorId(id: number): Observable<MapLayerResponse> {
    return this.http.get<MapLayerResponse>(`${this.baseUrl}/${id}`);
  }

  getLayersByDeptAndYear(departamento: string, año: number): Observable<MapLayerResponse[]> {
    let params = new HttpParams()
      .set('departamento', departamento)
      .set('año', año.toString());
    return this.http.get<MapLayerResponse[]>(`${this.baseUrl}/capas`, { params });
  }

  obtenerCapasPorCategoria(category: string): Observable<MapLayerResponse[]> {
    return this.http.get<MapLayerResponse[]>(`${this.baseUrl}/categoria/${category}`);
  }

  crearCapa(capa: MapLayerCreate): Observable<MapLayerResponse> {
    return this.http.post<MapLayerResponse>(`${this.baseUrl}/`, capa);
  }

  actualizarCapa(id: number, capa: MapLayerUpdate): Observable<MapLayerResponse> {
    return this.http.patch<MapLayerResponse>(`${this.baseUrl}/${id}`, capa);
  }

  actualizarParcialCapa(id: number, data: MapLayerUpdate): Observable<MapLayerResponse> {
    return this.http.patch<MapLayerResponse>(`${this.baseUrl}/actualizar/${id}`, data);
  }

  eliminarCapa(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
















  getItems(): MapItem[] {
    return [
      {
        title: 'Chairapata',
        description: 'Información cartográfica de Chairapata en Potosí.',
        tags: ['Conjunto de datos', 'Administrativos'],
        year: '1977',
        department: 'Colón',
        imagen: 'assets/img/mapaprueba1.png',
        lat: 15.77,
        lon: -85.98,
      },
      {
        title: 'Tumpasa',
        description: 'Mapa del municipio de Tumpasa, Beni.',
        tags: ['Conjunto de datos', 'Administrativos'],
        year: '1964',
        department: 'Colón',
        imagen: 'assets/img/mapaprueba2.png',
        lat: 15.88,
        lon: -86.01,
      },
      {
        title: 'Estancia Blanquillos',
        description: 'Mapa de Estancia Blanquillos en Beni.',
        tags: ['Conjunto de datos', 'Administrativos'],
        year: '2018',
        department: 'Colón',
        imagen: 'assets/img/mapaprueba1.png',
        lat: 15.9,
        lon: -86.05,
      },
      {
        title: 'Límites departamentales de Honduras',
        description: 'División político-administrativa de los 18 departamentos',
        tags: ['Conjunto de datos', 'Administrativos'],
        year: '2020',
        department: 'Francisco Morazán',
        imagen: 'assets/img/mapaprueba2.png',
        lat: 14.08,
        lon: -87.21,
      },
      {
        title: 'Hidrografía nacional',
        description: 'Ríos, quebradas y cuencas principales de Honduras',
        tags: ['Conjunto de datos', 'Hidrografía'],
        year: '2018',
        department: 'Colón',
        imagen: 'assets/img/mapaprueba1.png',
        lat: 15.8,
        lon: -85.92,
      },
      {
        title: 'Red vial nacional',
        description: 'Carreteras primarias y secundarias de Honduras',
        tags: ['Conjunto de datos', 'Infraestructura'],
        year: '2022',
        department: 'Cortés',
        imagen: 'assets/img/mapaprueba2.png',
        lat: 15.5,
        lon: -88.03,
      },
      {
        title: 'Mapa de cobertura forestal 2023',
        description: 'Estado actual de los bosques hondureños',
        tags: ['Conjunto de datos', 'Uso de suelo'],
        year: '2023',
        department: 'Gracias a Dios',
        imagen: 'assets/img/mapaprueba1.png',
        lat: 15.65,
        lon: -84.83,
      },
      {
        title: 'Áreas protegidas SIGAP',
        description: 'Sistema de áreas naturales protegidas de Honduras',
        tags: ['Conjunto de datos', 'Medio ambiente'],
        year: '2021',
        department: 'Olancho',
        imagen: 'assets/img/mapaprueba2.png',
        lat: 14.85,
        lon: -85.82,
      },
      {
        title: 'Centros de salud públicos',
        description: 'Ubicación geográfica de hospitales y CESAMOs',
        tags: ['Conjunto de datos', 'Salud'],
        year: '2019',
        department: 'Yoro',
        imagen: 'assets/img/mapaprueba1.png',
        lat: 15.2,
        lon: -87.15,
      },
      {
        title: 'Zonas de riesgo por inundación',
        description: 'Zonas vulnerables a inundaciones según COPECO',
        tags: ['Conjunto de datos', 'Gestión de riesgos'],
        year: '2020',
        department: 'Valle',
        imagen: 'assets/img/mapaprueba2.png',
        lat: 13.5,
        lon: -87.62,
      },
      {
        title: 'Escuelas y centros educativos',
        description: 'Distribución de instituciones educativas públicas',
        tags: ['Conjunto de datos', 'Educación'],
        year: '2017',
        department: 'Intibucá',
        imagen: 'assets/img/mapaprueba1.png',
        lat: 14.33,
        lon: -88.17,
      },
      {
        title: 'Mapa de uso agrícola',
        description: 'Áreas cultivadas con diferentes tipos de cultivos',
        tags: ['Conjunto de datos', 'Agricultura'],
        year: '2021',
        department: 'La Paz',
        imagen: 'assets/img/mapaprueba2.png',
        lat: 14.32,
        lon: -87.68,
      },
      {
        title: 'Cobertura satelital 2022',
        description: 'Imágenes satelitales recientes de alta resolución',
        tags: ['Conjunto de datos', 'Satélite'],
        year: '2022',
        department: 'Atlántida',
        imagen: 'assets/img/mapaprueba1.png',
        lat: 15.62,
        lon: -87.02,
      },
      {
        title: 'Mapa de pobreza multidimensional',
        description: 'Indicadores de pobreza por municipio',
        tags: ['Conjunto de datos', 'Socioeconómico'],
        year: '2020',
        department: 'Choluteca',
        imagen: 'assets/img/mapaprueba2.png',
        lat: 13.31,
        lon: -87.18,
      },
      {
        title: 'Ubicación de albergues temporales',
        description: 'Sitios habilitados para atención de emergencias',
        tags: ['Conjunto de datos', 'Gestión de riesgos'],
        year: '2018',
        department: 'El Paraíso',
        imagen: 'assets/img/mapaprueba1.png',
        lat: 13.99,
        lon: -86.58,
      },
      {
        title: 'Zonas sísmicas activas',
        description: 'Áreas con mayor actividad sísmica registrada',
        tags: ['Conjunto de datos', 'Geología'],
        year: '2016',
        department: 'Ocotepeque',
        imagen: 'assets/img/mapaprueba2.png',
        lat: 14.43,
        lon: -89.18,
      },
      {
        title: 'Cobertura de servicios básicos',
        description: 'Acceso a agua potable y electricidad',
        tags: ['Conjunto de datos', 'Servicios públicos'],
        year: '2019',
        department: 'Comayagua',
        imagen: 'assets/img/mapaprueba1.png',
        lat: 14.57,
        lon: -87.64,
      },
      {
        title: 'Mapa turístico nacional',
        description: 'Principales destinos y rutas turísticas',
        tags: ['Conjunto de datos', 'Turismo'],
        year: '2023',
        department: 'Islas de la Bahía',
        imagen: 'assets/img/mapaprueba2.png',
        lat: 16.33,
        lon: -86.53,
      },
      {
        title: 'Red de transporte público',
        description: 'Rutas de buses interurbanos y taxis colectivos',
        tags: ['Conjunto de datos', 'Transporte'],
        year: '2022',
        department: 'Cortés',
        imagen: 'assets/img/mapaprueba1.png',
        lat: 15.5,
        lon: -88.03,
      },
      {
        title: 'Zonas de recarga hídrica',
        description: 'Áreas clave para la infiltración de agua subterránea',
        tags: ['Conjunto de datos', 'Hidrología'],
        year: '2020',
        department: 'Lempira',
        imagen: 'assets/img/mapaprueba2.png',
        lat: 14.3,
        lon: -88.6,
      },
      {
        title: 'Mapa de incendios forestales',
        description: 'Zonas afectadas por incendios en los últimos años',
        tags: ['Conjunto de datos', 'Medio ambiente'],
        year: '2021',
        department: 'Santa Bárbara',
        imagen: 'assets/img/mapaprueba1.png',
        lat: 14.91,
        lon: -88.24,
      },
      {
        title: 'Infraestructura aeroportuaria',
        description: 'Ubicación de aeropuertos internacionales y locales',
        tags: ['Conjunto de datos', 'Infraestructura'],
        year: '2019',
        department: 'Francisco Morazán',
        imagen: 'assets/img/mapaprueba2.png',
        lat: 14.06,
        lon: -87.22,
      },
      {
        title: 'Municipios con mayor migración',
        description: 'Índices de migración interna e internacional',
        tags: ['Conjunto de datos', 'Demografía'],
        year: '2022',
        department: 'Copán',
        imagen: 'assets/img/mapaprueba1.png',
        lat: 14.85,
        lon: -89.15,
      },
      {
        title: 'Centros de salud rurales',
        description:
          'Listado de clínicas y puestos de salud en zonas rurales de Honduras',
        tags: ['Conjunto de datos', 'Salud'],
        year: '1995',
        department: 'Intibucá',
        imagen: 'assets/img/mapaprueba2.png',
        lat: 14.34,
        lon: -88.15,
      },
      {
        title: 'Red de carreteras secundarias',
        description:
          'Mapa de las vías de comunicación secundaria en el occidente del país',
        tags: ['Conjunto de datos', 'Infraestructura'],
        year: '1988',
        department: 'Lempira',
        imagen: 'assets/img/mapaprueba1.png',
        lat: 14.3,
        lon: -88.6,
      },
    ];
  }
}
