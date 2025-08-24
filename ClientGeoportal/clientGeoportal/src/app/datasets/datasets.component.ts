import { Component, ViewChild, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavigationToolsComponent } from '../components/tools/navigation-tools/navigation-tools.component';
import { MATERIAL_IMPORTS } from '../shared/material-imports';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { MapConfigService } from '../services/map.config.service';
import { latLng, tileLayer } from 'leaflet';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { DatasetDialogComponent } from '../components/dataset-dialog/dataset-dialog.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MapLayerResponse } from '../models/map-layer.models';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatFormField } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { GeoServerService } from '../services/geo-server.service';


@Component({
  selector: 'app-datasets',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NavigationToolsComponent,
    MatPaginatorModule,
    MatCardModule,
    MatExpansionModule,
    FlexLayoutModule,
    MatFormField,
    MatIcon,
    ...MATERIAL_IMPORTS,
  ],
  templateUrl: './datasets.component.html',
  styleUrls: ['./datasets.component.css'],
})
export class DatasetsComponent implements OnInit {
  searchTerm = '';

  items: MapLayerResponse[] = [];
  filteredItems: MapLayerResponse[] = [];

  tags: string[] = [];
  years: string[] = [];
  departments: string[] = [];
  expanded: { [key: string]: boolean } = {};

  selectedYears: string[] = [];
  selectedDepartments: string[] = [];
  selectedTags: string[] = [];

  sortBy = 'title';
  pageSize = 10;
  pageIndex = 0;

  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;

  mapOptions = {
    layers: [
      tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }),
    ],
    zoom: 4,
    center: latLng(-17.0, -65.0),
  };

  constructor(
    private catalogService: MapConfigService,
    private dialog: MatDialog,
    private geoServerService: GeoServerService
  ) {}

  ngOnInit(): void {
    this.cargarCapasBackend();
  }

  cargarCapasBackend(): void {
    this.catalogService.listarCapas().subscribe({
      next: (data) => {
        if (Array.isArray(data)) {
          this.items = data;
          this.filteredItems = [...this.items];

          // Extraer años únicos desde los datos
          const uniqueYears = new Set<string>();
          this.items.forEach((item) => {
            if (item.data_year) {
              uniqueYears.add(String(item.data_year));
            }
          });
          this.years = Array.from(uniqueYears).sort(
            (a, b) => Number(a) - Number(b)
          );
        } else {
          console.error('Datos no válidos:', data);
          this.items = [];
          this.filteredItems = [];
          this.years = [];
        }
        this.pageIndex = 0;

        // Extraer departamentos únicos desde los datos
        const uniqueDepartments = new Set<string>();
        this.items.forEach((item) => {
          if (item.department) {
            uniqueDepartments.add(item.department);
          }
        });
        // Ordenar los departamentos alfabéticamente
        this.departments = Array.from(uniqueDepartments).sort();
        const uniqueTags = new Set<string>();
        this.items.forEach((item) => {
          const categories = Array.isArray(item.category)
            ? item.category
            : typeof item.category === 'string'
            ? [item.category]
            : [];

          categories.forEach((tag) => {
            if (tag && typeof tag === 'string') {
              uniqueTags.add(tag.trim());
            }
          });
        });
        this.tags = Array.from(uniqueTags).sort();
      },
      error: (err) => console.error('Error al cargar capas', err),
    });
  }

  applyFilters(): void {
    if (
      this.selectedDepartments.length === 1 &&
      this.selectedYears.length === 1
    ) {
      this.catalogService
        .getLayersByDeptAndYear(
          this.selectedDepartments[0],
          Number(this.selectedYears[0])
        )
        .subscribe({
          next: (data) => {
            this.filteredItems = data;
            this.pageIndex = 0;
            this.sortItems();
          },
          error: (err) => console.error('Error al filtrar capas', err),
        });
    } else {
      this.filteredItems = this.items.filter((item) => {
        const matchesYear =
          this.selectedYears.length === 0 ||
          this.selectedYears.includes(String(item.data_year));

        const matchesDepartment =
          this.selectedDepartments.length === 0 ||
          this.selectedDepartments.includes(item.department);

        // Si category es string, lo convierte en array. Si ya es array, lo usa como está.
        const categoryTags: string[] = Array.isArray(item.category)
          ? item.category
          : typeof item.category === 'string'
          ? item.category.split(',').map((c) => c.trim())
          : [];

        const matchesTags =
          this.selectedTags.length === 0 ||
          this.selectedTags.some((tag) => categoryTags.includes(tag));

        return matchesYear && matchesDepartment && matchesTags;
      });

      this.pageIndex = 0;
      this.sortItems();
    }
  }

  openDialog(layer: MapLayerResponse): void {
  const screenWidth = window.innerWidth;

  const dialogConfig = {
    data: layer,
    panelClass: 'custom-dialog-container',
    maxHeight: '95vh',
  };

  let width: string;
  let height: string;

  if (screenWidth < 800) {
    // Teléfonos móviles
    width = '95vw';
    height = '90vh';
  } else if (screenWidth < 1024) {
    // Tablets
    width = '95vw';
    height = '90vh';
  } else {
    // Escritorio y pantallas grandes
    width = '90vw';  // ancho máximo recomendado para escritorio
    height = '85vh';
  }

  this.dialog.open(DatasetDialogComponent, {
    ...dialogConfig,
    width,
    height,
  });
  }

  onSearch(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredItems = this.items.filter(
      (item) =>
        item.title.toLowerCase().includes(term) ||
        item.description.toLowerCase().includes(term)
    );
    this.pageIndex = 0;
    this.sortItems();
  }

  sortItems(): void {
    if (this.sortBy === 'title') {
      this.filteredItems.sort((a, b) => a.title.localeCompare(b.title));
    } else if (this.sortBy === 'relevance') {
      this.filteredItems.sort((a, b) => b.category.length - a.category.length);
    }
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  pagedItems(): MapLayerResponse[] {
    const start = this.pageIndex * this.pageSize;
    const end = start + this.pageSize;
    return this.filteredItems.slice(start, end);
  }

  toggleYearFilter(year: string, checked: boolean): void {
    if (checked) this.selectedYears.push(year);
    else this.selectedYears = this.selectedYears.filter((y) => y !== year);
    this.applyFilters();
  }

  toggleDepartmentFilter(dept: string, checked: boolean): void {
    if (checked) this.selectedDepartments.push(dept);
    else
      this.selectedDepartments = this.selectedDepartments.filter(
        (d) => d !== dept
      );
    this.applyFilters();
  }

  toggleTagFilter(tag: string, checked: boolean): void {
    if (checked) this.selectedTags.push(tag);
    else this.selectedTags = this.selectedTags.filter((t) => t !== tag);
    this.applyFilters();
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.selectedYears = [];
    this.selectedDepartments = [];
    this.selectedTags = [];
    this.applyFilters();
  }

  onResetFilters(): void {
    this.resetFilters();
  }

  toggleExpand(id: string): void {
    this.expanded[id] = !this.expanded[id];
  }

downloadDataset(item: any, event: MouseEvent): void {
  event.stopPropagation(); // Evita que se dispare el click del mat-card

  if (item.workspace && item.layername) {
    // Construye la URL WFS para descargar en formato ZIP shapefile
    const baseUrl = this.geoServerService.getBaseUrl(); // Asumiendo que tienes este método
    const url = `${baseUrl}/${item.workspace}/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=${item.workspace}:${item.layername}&outputFormat=shape-zip`;

    // Abre la descarga en una nueva pestaña
    window.open(url, '_blank');
  } else {
    alert('No es posible descargar este dataset.');
  }
}


}
