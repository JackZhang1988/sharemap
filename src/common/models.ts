export interface Location {
  mapId: string;
  lnglat: Number[];
  description: string;
  imgs: string[];
  locationInfo: any
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

export interface Position {
  name: string,
  address: string,
  location: any,
  district?: string,
  adcode?: string,
  citycode?: string
}

export interface User {
  phone: number,
  name: string,
  sex?: string,
  signature?: string,
  avatar?: string,
}