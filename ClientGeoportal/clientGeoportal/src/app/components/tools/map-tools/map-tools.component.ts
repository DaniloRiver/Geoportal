import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-map-tools',
  imports: [],
  templateUrl: './map-tools.component.html',
  styleUrl: './map-tools.component.css'
})
export class MapToolsComponent {

  @Output() activarMedicion = new EventEmitter<'line' | 'polygon'>();
  @Output() descargar = new EventEmitter<void>();
  @Output() imprimir = new EventEmitter<void>();
  @Output() zoomInicio = new EventEmitter<void>();
  @Output() cambiarBase = new EventEmitter<void>();
  @Output() agregarMarcador = new EventEmitter<void>();
  @Output() compartir = new EventEmitter<void>();
  @Output() toggleLeyenda = new EventEmitter<void>();
  @Output() abrirCargaArchivo = new EventEmitter<void>();
  @Output() capturar = new EventEmitter<void>();

}
