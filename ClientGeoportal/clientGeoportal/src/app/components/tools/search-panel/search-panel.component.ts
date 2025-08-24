import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-panel',
  imports: [CommonModule, FormsModule],
  templateUrl: './search-panel.component.html',
  styleUrl: './search-panel.component.css'
})
export class SearchPanelComponent {
  query: string = '';

  search() {
    console.log('Buscando:', this.query);
    // Aquí puedes hacer la lógica con OpenLayers para centrar el mapa
  }
}
