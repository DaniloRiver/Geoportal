import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-paneles-estadistica',
  imports: [CommonModule, MatToolbarModule, MatCardModule, MatSidenavModule, MatListModule, MatIconModule, MatProgressSpinnerModule],
  standalone: true,
  templateUrl: './paneles-estadistica.component.html',
  styleUrls: ['./paneles-estadistica.component.css'],
})
export class PanelesEstadisticaComponent implements OnInit, AfterViewInit {

   isLoading = true;

  ngOnInit(): void {
    this.createChart();
     setTimeout(() => {
      this.isLoading = false;
    }, 1500);
  }

  ngAfterViewInit(): void {
    this.createLineChart();
    this.createBarChart();
    this.createPieChart();
    this.createDoughnutChart();
    this.createRadarChart();
    this.createPolarChart();
  }

  createChart() {
    const ctx = document.getElementById('myChart') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'line', // Tipo de gráfico: 'bar', 'line', etc.
      data: {
        labels: [
          'January',
          'February',
          'March',
          'April',
          'May',
          'June',
          'July',
        ],
        datasets: [
          {
            label: 'My First Dataset',
            data: [65, 59, 80, 81, 56, 55, 40],
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          tooltip: {
            backgroundColor: '#000', // Fondo de tooltip
            titleColor: '#fff',
            bodyColor: '#fff',
          },
          legend: {
            labels: {
              fontColor: 'rgb(255, 99, 132)', // Color de las etiquetas de la leyenda
            },
          },
        },
      },
    });
  }

  createLineChart() {
    new Chart('lineChart', {
      type: 'line',
      data: {
        labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
        datasets: [
          {
            label: 'Ingresos',
            data: [12000, 15000, 14000, 18000, 17000, 20000],
            borderColor: 'blue',
            fill: false,
          },
        ],
      },
    });
  }

  createBarChart() {
    new Chart('barChart', {
      type: 'bar',
      data: {
        labels: ['Producto A', 'Producto B', 'Producto C', 'Producto D'],
        datasets: [
          {
            label: 'Ventas',
            data: [120, 190, 300, 250],
            backgroundColor: ['#3f51b5', '#2196f3', '#f44336', '#ff9800'],
          },
        ],
      },
    });
  }

  createPieChart() {
    new Chart('pieChart', {
      type: 'pie',
      data: {
        labels: ['Admin', 'Clientes', 'Visitantes'],
        datasets: [
          {
            data: [10, 60, 30],
            backgroundColor: ['#673ab7', '#009688', '#ffc107'],
          },
        ],
      },
    });
  }

  createDoughnutChart() {
    new Chart('doughnutChart', {
      type: 'doughnut',
      data: {
        labels: ['Online', 'Tiendas físicas'],
        datasets: [
          {
            data: [70, 30],
            backgroundColor: ['#4caf50', '#ff5722'],
          },
        ],
      },
    });
  }

  createRadarChart() {
    new Chart('radarChart', {
      type: 'radar',
      data: {
        labels: ['Calidad', 'Velocidad', 'Soporte', 'Costo', 'Satisfacción'],
        datasets: [
          {
            label: 'Métricas 2025',
            data: [80, 90, 70, 60, 85],
            backgroundColor: 'rgba(63,81,181,0.2)',
            borderColor: '#3f51b5',
          },
        ],
      },
    });
  }

    createPolarChart() {
    new Chart('polarChart', {
      type: 'polarArea',
      data: {
        labels: ['Categoría A', 'Categoría B', 'Categoría C', 'Categoría D'],
        datasets: [{
          label: 'Popularidad',
          data: [11, 16, 7, 14],
          backgroundColor: ['#009688', '#03a9f4', '#e91e63', '#8bc34a']
        }]
      }
    });
  }
}
