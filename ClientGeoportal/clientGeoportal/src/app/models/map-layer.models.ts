

export interface MapLayerResponse {
  id: number;
  title: string;
  description: string;
  category: string;
  department: string;
  municipality?: string;
  creation_date?: string;
  data_year?: number;
  source?: string;
  contact?: string;
  update_frequency?: string;
  geometry_type?: string;
  formats?: string;
  preview_image?: string;
  geoserverurl?: string; // URL del servicio WMS de GeoServer
  layername?: string; // Nombre de la capa en GeoServer
  workspace?: string;     // Workspace (nuevo)
  bbox?: string;          // Bounding box (nuevo)
  bboxepsg?: string;     // EPSG del bounding box (nuevo)
}

export interface MapLayerCreate {
  name: string;
  category: string;
  departamento: string;
  año: number;
  tags?: string[];
  // campos para creación
}

export interface MapLayerUpdate {
  name?: string;
  category?: string;
  departamento?: string;
  año?: number;
  tags?: string[];
  // campos opcionales para patch
}


export interface DatasetItem {
  id: number;
  title: string;
  description: string;
  tags: string[];         // <-- NO existe en el backend
  year: number;           // <-- Es data_year en el backend
  imagen: string;         // <-- Es preview_image en el backend
}
