export interface Location {
  mapId: String;
  lnglat: String;
  description: String;
  locationImgs: String[];
}

export interface LngLat {
  lng: String;
  lat: String
}

export interface Map {
  coverImg: String;
  title: String;
  description: String;
}

export interface Position {
  name: String,
  address: String,
  location: any,
  district?: String,
  adcode?: String,
  citycode?:String
}