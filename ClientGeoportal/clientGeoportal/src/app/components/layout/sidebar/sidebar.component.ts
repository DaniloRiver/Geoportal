import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule,FormsModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
[x: string]: any;
  osmLayer: any;
  satelliteLayer: any;
  biodiversityLayer: any;

  setBaseLayer(layerName: string): void {
    this.osmLayer.setVisible(layerName === 'OSM');
    this.satelliteLayer.setVisible(layerName === 'Satellite');
  }

  toggleBiodiversityLayer(): void {
    this.biodiversityLayer.setVisible(this.showBiodiversityLayer);
  }
  showBiodiversityLayer(showBiodiversityLayer: any) {
    throw new Error('Method not implemented.');
  }

  activeTab: string = 'layers';

printMap(): void {
  window.print(); // Puedes mejorar esto con una vista personalizada
}

}
