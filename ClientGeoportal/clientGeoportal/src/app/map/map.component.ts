import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavigationToolsComponent } from '../components/tools/navigation-tools/navigation-tools.component';
import { MATERIAL_IMPORTS } from '../shared/material-imports';
import { MatPaginatorModule, PageEvent, MatPaginator } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { MapConfigService, MapItem } from '../services/map.config.service';
import { latLng, tileLayer } from 'leaflet';
import { CommonModule } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NavigationToolsComponent,
    MatPaginatorModule,
    MatCardModule,
    MatChipsModule,
    ...MATERIAL_IMPORTS,
  ],
})
export class MapComponent implements OnInit {
  searchTerm = '';

  items: {
    title: string;
    description: string;
    tags: string[];
    year: string;
    department: string;
  }[] = [];

  filteredItems: {
    title: string;
    description: string;
    tags: string[];
    year: string;
    department: string;
  }[] = [];

  tags = [
    'Conjunto de datos',
    'Administrativos',
    'Hidrografía',
    'Infraestructura',
    'Uso de suelo',
    'Medio ambiente',
    'Salud',
    'Gestión de riesgos',
    'Educación',
    'Agricultura',
    'Satélite',
    'Socioeconómico',
    'Geología',
    'Servicios públicos',
    'Turismo',
    'Transporte',
    'Hidrología',
    'Demografía',
  ];

  years = ['2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023'];

  departments = [
    'Francisco Morazán',
    'Colón',
    'Cortés',
    'Gracias a Dios',
    'Olancho',
    'Yoro',
    'Valle',
    'Intibucá',
    'La Paz',
    'Atlántida',
    'Choluteca',
    'El Paraíso',
    'Ocotepeque',
    'Comayagua',
    'Islas de la Bahía',
    'Lempira',
    'Santa Bárbara',
    'Copán',
  ];

  selectedYears: string[] = [];
  selectedDepartments: string[] = [];
  selectedTags: string[] = [];

  sortBy = 'title';
  pageSize = 10;
  pageIndex = 0;

  @ViewChild(MatPaginator) paginator?: MatPaginator;

  mapOptions = {
    layers: [
      tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }),
    ],
    zoom: 4,
    center: latLng(-17.0, -65.0),
  };

  constructor(private catalogService: MapConfigService) {}

  ngOnInit(): void {
    const rawItems = this.catalogService.getItems();

    this.items = rawItems.filter(
      (item): item is MapItem =>
        item &&
        typeof item.title === 'string' &&
        typeof item.description === 'string' &&
        Array.isArray(item.tags) &&
        item.tags.length > 0 &&
        typeof item.year === 'string' &&
        typeof item.department === 'string' &&
        typeof item.imagen === 'string' &&
        typeof item.lat === 'number' &&
        typeof item.lon === 'number'
    );

    this.filteredItems = [...this.items];
    this.sortItems();
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

  applyFilters(): void {
    this.filteredItems = this.items.filter(
      (item) =>
        (this.selectedYears.length === 0 || this.selectedYears.includes(item.year)) &&
        (this.selectedDepartments.length === 0 || this.selectedDepartments.includes(item.department)) &&
        (this.selectedTags.length === 0 || this.selectedTags.some((tag) => item.tags.includes(tag)))
    );
    this.pageIndex = 0;
    this.sortItems();
  }

  sortItems(): void {
    if (this.sortBy === 'title') {
      this.filteredItems.sort((a, b) => a.title.localeCompare(b.title));
    } else if (this.sortBy === 'relevance') {
      this.filteredItems.sort((a, b) => b.tags.length - a.tags.length);
    }
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  pagedItems(): {
    title: string;
    description: string;
    tags: string[];
    year: string;
    department: string;
  }[] {
    const start = this.pageIndex * this.pageSize;
    const end = start + this.pageSize;
    return this.filteredItems.slice(start, end);
  }

  toggleYearFilter(year: string, checked: boolean): void {
    if (checked && !this.selectedYears.includes(year)) {
      this.selectedYears.push(year);
    } else if (!checked) {
      this.selectedYears = this.selectedYears.filter((y) => y !== year);
    }
    this.applyFilters();
  }

  toggleDepartmentFilter(dept: string, checked: boolean): void {
    if (checked && !this.selectedDepartments.includes(dept)) {
      this.selectedDepartments.push(dept);
    } else if (!checked) {
      this.selectedDepartments = this.selectedDepartments.filter((d) => d !== dept);
    }
    this.applyFilters();
  }

  toggleTagFilter(tag: string, checked: boolean): void {
    if (checked && !this.selectedTags.includes(tag)) {
      this.selectedTags.push(tag);
    } else if (!checked) {
      this.selectedTags = this.selectedTags.filter((t) => t !== tag);
    }
    this.applyFilters();
  }
}
