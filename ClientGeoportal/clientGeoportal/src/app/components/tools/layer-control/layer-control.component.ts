import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-layer-control',
  imports: [CommonModule],
  templateUrl: './layer-control.component.html',
  styleUrl: './layer-control.component.css'
})
export class LayerControlComponent {
  layers = [
    { name: 'OSM Base', visible: true },
    { name: 'Ríos', visible: false },
    { name: 'Áreas protegidas', visible: false }
  ];

  toggleLayer(layer: any) {
    layer.visible = !layer.visible;
    console.log('Capa modificada:', layer);
    // Aquí debes integrar con el mapa OpenLayers para mostrar u ocultar capas
  }
}
