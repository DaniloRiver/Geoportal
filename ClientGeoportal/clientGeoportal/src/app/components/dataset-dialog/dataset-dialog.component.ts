import { Component, Inject, AfterViewInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import TileWMS from 'ol/source/TileWMS';
import { transform } from 'ol/proj';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { GeoServerService } from '../../services/geo-server.service';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import proj4 from 'proj4';
import { register } from 'ol/proj/proj4';

@Component({
  selector: 'app-dataset-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatCardModule,
    MatIconModule,
    HttpClientModule,
    CommonModule,
  ],
  templateUrl: './dataset-dialog.component.html',
  styleUrls: ['./dataset-dialog.component.css'],
})
export class DatasetDialogComponent implements AfterViewInit {
  map!: Map;
  previewUrl: string = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<DatasetDialogComponent>,
    private geoServerService: GeoServerService
  ) {}

  ngAfterViewInit(): void {
    // Registrar EPSG:32616 si es necesario
    proj4.defs(
      'EPSG:32616',
      '+proj=utm +zone=16 +datum=WGS84 +units=m +no_defs'
    );
    register(proj4);

    if (this.data.geoserverurl && this.data.geoserverurl !== 'string') {
      this.geoServerService.setBaseUrl(this.data.geoserverurl);
    }

    const baseLayer = new TileLayer({
      source: new OSM(),
    });

    let datasetLayer: TileLayer | null = null;
    if (this.data.workspace && this.data.layername) {
      datasetLayer = new TileLayer({
        source: new TileWMS({
          url: this.geoServerService.getWmsUrl(this.data.workspace),
          params: {
            LAYERS: `${this.data.workspace}:${this.data.layername}`,
            TILED: true,
            VERSION: '1.1.1',
            FORMAT: 'image/png',
            TRANSPARENT: true,
          },
          serverType: 'geoserver',
          crossOrigin: 'anonymous',
        }),
      });
    }

    // Centro por defecto (Honduras) en EPSG:3857
    let centerCoords = transform([-86.2419, 15.1999], 'EPSG:4326', 'EPSG:3857');

    // Centrado usando el bbox recibido
    if (this.data.bbox) {
      const bboxParts = this.data.bbox
        .split(',')
        .map((v: string) => parseFloat(v.trim()));
      if (bboxParts.length === 4) {
        const [minX, minY, maxX, maxY] = bboxParts;
        const centerX = (minX + maxX) / 2;
        const centerY = (minY + maxY) / 2;

        const sourceEPSG = (this.data.bboxEPSG || 'EPSG:32616').toUpperCase();

        try {
          // Transformar centro del bbox al EPSG:3857
          centerCoords = transform(
            [centerX, centerY],
            sourceEPSG,
            'EPSG:3857'
          );
        } catch (error) {
          console.warn(
            `Error al transformar coordenadas desde ${sourceEPSG}:`,
            error
          );
        }
      }
    }

    this.map = new Map({
      target: 'map-dialog',
      layers: datasetLayer ? [baseLayer, datasetLayer] : [baseLayer],
      view: new View({
        center: centerCoords,
        zoom: 6,
      }),
    });

    setTimeout(() => this.map.updateSize(), 100);
  }

  downloadDataset(format: 'shp' | 'geojson' = 'shp'): void {
    if (
      this.data.workspace &&
      this.data.layername &&
      this.geoServerService.getBaseUrl()
    ) {
      const baseUrl = this.geoServerService.getBaseUrl();
      const workspace = this.data.workspace;
      const layername = this.data.layername;

      let outputFormat = '';
      if (format === 'shp') {
        outputFormat = 'SHAPE-ZIP';
      } else if (format === 'geojson') {
        outputFormat = 'application/json';
      }

      const downloadUrl = `${baseUrl}/${workspace}/ows?service=WFS&version=1.0.0&request=GetFeature&typename=${workspace}:${layername}&outputFormat=${outputFormat}`;

      window.open(downloadUrl, '_blank');
    } else {
      alert('No se puede generar la URL de descarga.');
    }
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
