declare module 'ol-geocoder' {
  import { Control } from 'ol/control';
  import { Map } from 'ol';

  interface GeocoderOptions {
    provider?: 'osm' | 'mapquest' | 'photon' | 'bing' | 'nominatim';
    key?: string;
    lang?: string;
    placeholder?: string;
    limit?: number;
    keepOpen?: boolean;
    debug?: boolean;
    autoComplete?: boolean;
    autoCompleteMinLength?: number;
    targetType?: 'text-input' | 'glass-button';
    preventDefault?: boolean;
    countrycodes?: string;
    placeName?: string;
    featureTypes?: string[];
    position?: boolean;
    collapsed?: boolean;
  }

  export default class Geocoder extends Control {
    constructor(options?: GeocoderOptions);
    getMap(): Map | undefined;
  }
}
