import { AfterViewInit, Component, OnInit } from '@angular/core';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { GeoMapService } from '../services/geo-map.service';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { getLength, getArea } from 'ol/sphere';
import { unByKey } from 'ol/Observable';
import { toLonLat } from 'ol/proj';
import 'ol-ext/control/LayerSwitcher';
import 'ol-geocoder/dist/ol-geocoder.min.css';
import { GeoServerService } from '../services/geo-server.service';
import TileWMS from 'ol/source/TileWMS';
import { GroupByWorkspacePipe } from '../group-by-workspace.pipe';
import { ChangeDetectorRef } from '@angular/core';
import { WeatherForecastComponent } from '../components/weather-forecast/weather-forecast.component';
import VectorSource from 'ol/source/Vector';
import Style from 'ol/style/Style';
import Stroke from 'ol/style/Stroke';
import Fill from 'ol/style/Fill';
import VectorLayer from 'ol/layer/Vector';
import { Draw } from 'ol/interaction';
import { MapToolsComponent } from '../components/tools/map-tools/map-tools.component';
import { Subscription, timer } from 'rxjs';
import Feature from 'ol/Feature'; // Para crear una entidad vectorial (el marcador)
import Point from 'ol/geom/Point'; // Geometría del tipo punto (para la ubicación del marcador)
import Icon from 'ol/style/Icon'; // Para mostrar un ícono personalizado en el marcador
import Overlay from 'ol/Overlay';

@Component({
  selector: 'app-geovisor',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    GroupByWorkspacePipe,
    WeatherForecastComponent,
    MapToolsComponent,
    MatCardModule,
    MatExpansionModule,
  ],
  templateUrl: './geovisor.component.html',
  styleUrl: './geovisor.component.css',
})
export class GeovisorComponent implements OnInit, AfterViewInit {
  map!: Map;

  showLegend: boolean = false;
  darkMode: boolean = false;
  collapsedStates: { [workspace: string]: boolean } = {};

  popupOverlay!: Overlay;
  popupData: any = null;
  popupPosition: [number, number] | null = null;

  sidebarCollapsed: boolean = false; // <-- Nueva propiedad para controlar sidebar

  allLayers: { layer: TileLayer; title: string; workspace: string }[] = []; //guarda las capas desde service

  showBiodiversityLayer: boolean = true;
  baseLayerSelected = 'OSM';

  // Capas base
  osmLayer: TileLayer;
  esriLayer: TileLayer;
  mapboxLayer: TileLayer;

  isLoading = true;
  medicionResultado: string = '';
  mouseCoords: string = '';
  medicionTimerSub?: Subscription;

  draw!: Draw;
  vectorSource = new VectorSource();
  vectorLayer = new VectorLayer({
    source: this.vectorSource,
    style: new Style({
      stroke: new Stroke({ color: '#ffcc33', width: 2 }),
      fill: new Fill({ color: 'rgba(255, 204, 51, 0.2)' }),
    }),
  });

  constructor(
    private geoMapService: GeoMapService,
    private geoServiceServer: GeoServerService,
    private cdRef: ChangeDetectorRef
  ) {
    this.osmLayer = this.geoMapService.getOSMLayerOL();
    this.esriLayer = this.geoMapService.getEsriLayerOL();
    this.mapboxLayer = this.geoMapService.getMapboxLayerOL();
  }

  ngOnInit(): void {
    console.log('CAPAS CARGADAS:', this.allLayers);
  }

  ngAfterViewInit(): void {
    const view = new View({
      center: [-9628350, 1637028], // Coordenadas EPSG:3857
      zoom: 8,
      projection: 'EPSG:3857',
    });

    this.map = new Map({
      target: 'map',
      layers: [this.osmLayer, this.esriLayer, this.mapboxLayer],
      view: view,
    });

    const container = document.getElementById('popup')!;


    this.popupOverlay = new Overlay({
      element: container,
      autoPan: {
        animation: {
          duration: 250,
        },
      },
    });


    this.map.addLayer(this.vectorLayer);

    this.geoServiceServer.getAllLayers().subscribe((layers) => {
      layers.forEach((info) => {
        const tileLayer = new TileLayer({
          source: new TileWMS({
            url: `http://localhost:8080/geoserver/${info.workspace}/wms`,
            params: { LAYERS: info.name, TILED: true },
            serverType: 'geoserver',
            transition: 0,
          }),
          visible: false,
        });
        this.allLayers.push({
          layer: tileLayer,
          title: info.name,
          workspace: info.workspace,
        });
        if (!(info.workspace in this.collapsedStates)) {
          this.collapsedStates[info.workspace] = false; // false = expandido por defecto
        }
        this.map.addLayer(tileLayer);
      });

      this.isLoading = false;
      this.cdRef.detectChanges();
    });

    // Evento de clic en el mapa para mostrar información
    this.map.on('click', (event) => {
      const coordinate = event.coordinate;

      const view = this.map.getView();
      const viewResolution = view ? view.getResolution() : undefined;
      if (!viewResolution) {
        console.warn('No hay resolución en la vista');
        return;
      }

      const visibleLayers = this.map
        .getLayers()
        .getArray()
        .filter(
          (layer) =>
            layer.getVisible() &&
            layer instanceof TileLayer &&
            layer.getSource() instanceof TileWMS
        );

      if (visibleLayers.length === 0) {
        this.popupData = { message: 'No hay capas visibles para consultar.' };
        this.popupOverlay.setPosition(coordinate);
        this.cdRef.detectChanges();
        return;
      }

      const layer = visibleLayers[0] as TileLayer<TileWMS>;
      const source = layer.getSource();

      if (source) {
        const url = source.getFeatureInfoUrl(
          coordinate,
          viewResolution,
          'EPSG:3857',
          { INFO_FORMAT: 'application/json' }
        );

        if (url) {
          fetch(url)
            .then((res) => res.json())
            .then((data) => {
              if (
                data &&
                Array.isArray(data.features) &&
                data.features.length > 0
              ) {
                this.popupData = data.features[0].properties;
              } else {
                this.popupData = { message: 'No se encontraron datos.' };
              }
              this.popupOverlay.setPosition(coordinate);
              this.cdRef.detectChanges();
            })
            .catch((err) => {
              this.popupData = { error: 'Error consultando el servidor.' };
              this.popupOverlay.setPosition(coordinate);
              this.cdRef.detectChanges();
              console.error(err);
            });
        } else {
          this.popupOverlay.setPosition(undefined);
        }
      } else {
        this.popupOverlay.setPosition(undefined);
      }
    });

    this.map.on('pointermove', (evt) => {
      const coords = evt.coordinate;
      const lon = coords[0];
      const lat = coords[1];

      // const lonLat = ol.proj.toLonLat([lon, lat]); // si usas EPSG:3857
      const lonLat = toLonLat([lon, lat]);

      this.mouseCoords = `Lon: ${lonLat[0].toFixed(
        5
      )}, Lat: ${lonLat[1].toFixed(5)}`;
      this.cdRef.detectChanges();
    });
  }

  setBaseLayer(layerName: string): void {
    const layers = [this.osmLayer, this.esriLayer, this.mapboxLayer];
    layers.forEach((layer) => {
      layer.setVisible(layer.get('name') === layerName);
    });
  }

  toggleLayer(layer: TileLayer, event: any) {
    layer.setVisible(event.target.checked);
  }

  toggleDarkMode(): void {
    const body = document.body;
    if (this.darkMode) {
      body.classList.add('dark-mode');
    } else {
      body.classList.remove('dark-mode');
    }
  }

  toggleCollapse(workspace: string): void {
    this.collapsedStates[workspace] = !this.collapsedStates[workspace];
  }

  // Nuevo método para colapsar/expandir sidebar completo
  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  activarMedicion(tipo: 'line' | 'polygon') {
    if (this.draw) {
      this.map.removeInteraction(this.draw);
    }

    this.draw = new Draw({
      source: this.vectorSource,
      type: tipo === 'line' ? 'LineString' : 'Polygon',
    });

    this.map.addInteraction(this.draw);

    const listener = this.draw.on('drawend', (event) => {
      const geom = event.feature.getGeometry();

      let resultado = '';
      if (geom?.getType() === 'Polygon') {
        const area = getArea(geom);
        resultado =
          area > 1000000
            ? `Área: ${(area / 1000000).toFixed(2)} km²`
            : `Área: ${area.toFixed(2)} m²`;
      } else if (geom?.getType() === 'LineString') {
        const length = getLength(geom);
        resultado =
          length > 1000
            ? `Longitud: ${(length / 1000).toFixed(2)} km`
            : `Longitud: ${length.toFixed(2)} m`;
      }

      this.medicionResultado = resultado;
      this.cdRef.detectChanges();

      if (this.medicionTimerSub) {
        this.medicionTimerSub.unsubscribe();
      }
      this.medicionTimerSub = timer(10000).subscribe(() => {
        this.borrarMediciones();
      });

      unByKey(listener);
    });
  }

  descargarMapa() {
    const mapCanvas = this.map.getViewport().querySelector('canvas');
    if (!mapCanvas) return;

    const image = mapCanvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = image;
    link.download = 'mapa.png';
    link.click();
  }

  imprimirMapa() {
    window.print();
  }

  borrarMediciones() {
    this.vectorSource.clear();
    this.medicionResultado = '';
    if (this.draw) {
      this.map.removeInteraction(this.draw);
    }
    if (this.medicionTimerSub) {
      this.medicionTimerSub.unsubscribe();
    }
  }

  centrarVistaInicial() {
    this.map.getView().setCenter([-9628350, 1637028]);
    this.map.getView().setZoom(8);
  }

  agregarMarcador() {
    const coord = this.map.getView().getCenter();
    if (!coord) return;

    const marcador = new Feature({
      geometry: new Point(coord),
    });

    marcador.setStyle(
      new Style({
        image: new Icon({
          anchor: [0.5, 1],
          src: 'assets/icono-marcador.png', // Asegúrate de tener este archivo en assets
          scale: 0.1,
        }),
      })
    );

    this.vectorSource.addFeature(marcador);
  }

  getVisibleLegends(): { title: string; url: string }[] {
  return this.allLayers
    .filter(({ layer }) => layer.getVisible())
    .map(({ title, workspace }) => ({
      title,
      url: this.geoServiceServer.getLegendUrl(workspace, title),
    }));
  }

  cerrarPopup() {
    this.popupData = null;
  }
}
