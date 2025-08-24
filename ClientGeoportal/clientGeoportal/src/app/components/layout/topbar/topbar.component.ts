import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { FlexLayoutModule } from '@angular/flex-layout';

@Component({
  selector: 'app-topbar',
  imports: [RouterLink, CommonModule, MatToolbarModule, MatIconModule, MatMenuModule, MatButtonModule, FlexLayoutModule],
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.css']
})
export class TopbarComponent {

   usuario: { nombre: string; fotoUrl: string } | null = null;

  constructor() {
    // Simula usuario logueado
    this.usuario = {
      nombre: 'José Danilo',
      fotoUrl: 'assets/img/avatar.jpg'
    };

    // Si no hay usuario:
    // this.usuario = null;
  }

}
