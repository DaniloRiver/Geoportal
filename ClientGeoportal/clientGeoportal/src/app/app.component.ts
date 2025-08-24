import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http'; // Importar HttpClientModule
import { CommonModule } from '@angular/common';
import { TopbarComponent } from "./components/layout/topbar/topbar.component";
import { ChatComponent } from "./chat/chat/chat.component";
import { ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, HttpClientModule, TopbarComponent, ChatComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  encapsulation: ViewEncapsulation.None // Permite el uso de estilos globales
})
export class AppComponent {
  title = 'clientGeoportal';

  sidebarOpen = true;

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }
}
