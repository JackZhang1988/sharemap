export interface Location {
  mapId: string;
  lnglat: string;
  description: string;
  locationImgs: string[];
}

export interface LngLat {
  lng: string;
  lat: string
}

export interface Map {
  coverImg: string;
  title: string;
  description: string;
}
