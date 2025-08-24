
import { DatasetItem, MapLayerResponse } from '../models/map-layer.models';

export function mapToDatasetItem(layer: MapLayerResponse): DatasetItem {
  return {
    id: layer.id,
    title: layer.title,
    description: layer.description,
    tags: [layer.category],
    year: layer.data_year ?? new Date(layer.creation_date ?? '').getFullYear() ?? 0,
    imagen: layer.preview_image ?? 'assets/default-image.jpg',
  };
}
