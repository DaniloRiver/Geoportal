
import { Injectable } from '@angular/core';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import XYZ from 'ol/source/XYZ';
import TileWMS from 'ol/source/TileWMS';
import { MapConfigService } from './map.config.service';

// Leaflet
import * as L from 'leaflet';

@Injectable({
  providedIn: 'root'
})
export class GeoMapService {

  constructor(private config: MapConfigService) { }

  /////////////////////////////// --- Open layers CAPAS ---///////////////////////////////////////////////////////////////
  getOSMLayerOL(): TileLayer {
    return new TileLayer({
      source: new OSM(),
      visible: true,
      properties: { name: 'OSM' }
    });
  }

  getEsriLayerOL(): TileLayer {
    return new TileLayer({
      source: new XYZ({
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        attributions: 'Tiles © Esri',
        maxZoom: 19
      }),
      visible: false,
      properties: { name: 'Esri' }
    });
  }

  getMapboxLayerOL(): TileLayer {
    return new TileLayer({
      source: new XYZ({
        url: `https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token=${this.config.getMapboxToken()}`,
        tileSize: 512,
        attributions: '© Mapbox © OpenStreetMap',
        maxZoom: 22
      }),
      visible: false,
      properties: { name: 'Mapbox' }
    });
  }

  getBiodiversityLayer(): TileLayer {
    return new TileLayer({
      source: new TileWMS({
        url: 'http://localhost:8080/geoserver/biodiversidad/wms',
        params: { 'LAYERS': 'biodiversidad:areas_biodiversidad', 'TILED': true },
        serverType: 'geoserver',
        crossOrigin: 'anonymous',
      }),
      visible: true,
      properties: { name: 'Biodiversidad' }
    });
  }


    /////////////////////////////// --- LEAFLET CAPAS ---///////////////////////////////////////////////////////////////
    getMapboxLayerLeaflet(): L.TileLayer {
      return L.tileLayer(
        `https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token=${this.config.getMapboxToken()}`,
        {
          tileSize: 512,
          maxZoom: 22,
          attribution: '© Mapbox © OpenStreetMap'
        }
      );
    }
    getEsriLayerLeaflet(): L.TileLayer {
      return L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        {
          maxZoom: 19,
          attribution: 'Tiles © Esri'
        }
      );
    }

    getGoogleMapsLayerLeaflet(): L.TileLayer {
      return L.tileLayer(
        `https://mt1.google.com/vt/lyrs=r&x={x}&y={y}&z={z}&key=${this.config.getGoogleMapsApiKey()}`,
        {
          maxZoom: 20,
          attribution: '© Google'
        }
      );
    }


     /////////////////////// --- MÉTODO GENERAL ---////////////////////////////////////////////////////////
  getBaseMap(engine: 'ol' | 'leaflet', provider: 'mapbox' | 'esri' | 'google' | 'OSM'): any {
    if (engine === 'ol') {
      switch (provider) {
        case 'mapbox': return this.getMapboxLayerOL();
        case 'esri': return this.getEsriLayerOL();
        case 'OSM': return this.getOSMLayerOL();
      }
    } else if (engine === 'leaflet') {
      switch (provider) {
        case 'mapbox': return this.getMapboxLayerLeaflet();
        case 'esri': return this.getEsriLayerLeaflet();
        case 'google': return this.getGoogleMapsLayerLeaflet();
      }
    }
    return null;
  }
}

