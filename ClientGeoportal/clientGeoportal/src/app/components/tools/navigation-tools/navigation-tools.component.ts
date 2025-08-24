import { Component } from '@angular/core';

@Component({
  selector: 'app-navigation-tools',
  imports: [],
  templateUrl: './navigation-tools.component.html',
  styleUrl: './navigation-tools.component.css'
})
export class NavigationToolsComponent {
  zoomIn() {
    console.log('Zoom in');
    // lógica con el mapa
  }

  zoomOut() {
    console.log('Zoom out');
  }

  goToHome() {
    console.log('Volver al centro');
  }
}
