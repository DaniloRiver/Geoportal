import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-statistics-panel',
  imports: [CommonModule],
  templateUrl: './statistics-panel.component.html',
  styleUrl: './statistics-panel.component.css'
})
export class StatisticsPanelComponent {
  stats = [
    { label: 'Visitantes', value: 320 },
    { label: 'Áreas protegidas', value: 42 },
    { label: 'Hoteles', value: 25 }
  ];
}
