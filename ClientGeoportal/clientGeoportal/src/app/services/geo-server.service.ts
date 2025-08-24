import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import WMSCapabilities from 'ol/format/WMSCapabilities';
import { Observable, forkJoin, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GeoServerService {
  private workspaces = ['biodiversidad', 'catastral', 'turismo']; // Agrega workspaces según sea necesario
  private baseUrl = 'http://localhost:8080/geoserver';

  constructor(private http: HttpClient) {}

  getLegendUrl(workspace: string, layerName: string): string {
    return `${this.baseUrl}/${workspace}/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&LAYER=${layerName}`;
  }

  // Cambiar URL base si necesitas
  setBaseUrl(url: string) {
    this.baseUrl = url;
  }

  getBaseUrl(): string {
    return this.baseUrl;
  }

  // Construye la URL WMS completa para TileWMS
  getWmsUrl(workspace: string): string {
    return `${this.baseUrl}/${workspace}/wms`;
  }

  // Construye la URL para vista previa (GetMap directo)
  getPreviewUrl(workspace: string, layerName: string, bbox: string): string {
    // Construye un GetMap estático para vista previa
    // Ejemplo básico, puedes mejorar parámetros según necesites
    return (
      `${this.getWmsUrl(workspace)}?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap&` +
      `LAYERS=${workspace}:${layerName}&` +
      `STYLES=&` +
      `BBOX=${bbox}&` +
      `WIDTH=300&HEIGHT=200&` +
      `SRS=EPSG:3857&` +
      `FORMAT=image/png&TRANSPARENT=true`
    );
  }

  getAllLayers(): Observable<any[]> {
    const requests = this.workspaces.map((ws) =>
      this.http
        .get(`${this.baseUrl}/${ws}/wms?request=GetCapabilities`, {
          responseType: 'text',
        })
        .pipe(
          map((xml) => {
            const parser = new WMSCapabilities();
            const result = parser.read(xml);
            const layers = result.Capability.Layer.Layer || [];
            return layers.map((l: any) => ({
              name: l.Name,
              title: l.Title,
              workspace: ws,
              legendUrl: this.getLegendUrl(ws, l.Name),
            }));
          })
        )
    );
    return forkJoin(requests).pipe(map((results) => results.flat()));
  }
}
