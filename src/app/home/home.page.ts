import { Component, OnInit } from '@angular/core';
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/Mapview';
import { Geolocation } from '@capacitor/geolocation';
import Graphic from '@arcgis/core/Graphic';
import Point from '@arcgis/core/geometry/Point';
import SimpleMarkerSymcol from '@arcgis/core/symbols/SimpleMarkerSymbol';
import ImageLayer from '@arcgis/core/layers/ImageryLayer';
import SimpleMarkerSymbol from '@arcgis/core/symbols/SimpleMarkerSymbol';
import ImageryLayer from '@arcgis/core/layers/ImageryLayer';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
// export class HomePage implements OnInit {

//   constructor() {}

//   private latitude: number|any;
//   private longitude: number|any;

//   public async ngOnInit() {
//     // this.longitude = 110.37439477813425; 
//     // this.latitude = -7.774546997332128; 
    
//     const position = await Geolocation.getCurrentPosition();
//     this.latitude = position.coords.latitude;
//     this.longitude = position.coords.longitude;

//     const map = new Map({
//       basemap: "topo-vector"
//     });

//     const view = new MapView({
//       container: "container", 
//       map: map,
//       zoom: 15,
//       center: [this.longitude, this.latitude]
//     });

    
//   }
// }

export class HomePage {
  mapView: MapView | any;
  userLocationGraphic: Graphic | any;
  selectedBasemap!: string;

  constructor() {}

  async ngOnInit() {
    const map = new Map({
      basemap: "streets-navigation-vector"
    });

    this.mapView = new MapView({
      container: "container",
      map :map,
      zoom: 8
    });

  let weatherServiceFL = new ImageryLayer({ url: WeatherServiceUrl});
  map.add(weatherServiceFL);

  this.addWeatherServiceMarker();

  await this.updateUserLocationOnMap();
  this.mapView.center = this.userLocationGraphic.geometry as Point;
  setInterval(this.updateUserLocationOnMap.bind(this), 10000);
  }

  async changeBasemap() {
    this.mapView.map.basemap = this.selectedBasemap;
  }

async getLocationService(): Promise<number[]> {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition((resp) => {
      resolve([resp.coords.latitude, resp.coords.longitude]);
    });
  });
}
  async updateUserLocationOnMap() {
    let latLng = await this.getLocationService();
    let geom = new Point({ latitude: latLng[0], longitude: latLng[1]});
    if (this.userLocationGraphic) {
      this.userLocationGraphic.geometry = geom;
    }else {
      this.userLocationGraphic = new Graphic ({
        symbol: new SimpleMarkerSymbol(),
        geometry: geom,
      });
      this.mapView.graphics.add(this.userLocationGraphic);
    }
  }

  addWeatherServiceMarker() {
    const weatherServiceLocation = new Point({
      latitude: 38.912431472071475, 
      longitude: -77.08922424495874,
    });

    const weatherServiceMarker = new Graphic({
      geometry: weatherServiceLocation,
      symbol: new SimpleMarkerSymbol(),
    });

    this.mapView.graphics.add(weatherServiceMarker);
  }
  
}

const WeatherServiceUrl = 
'https://mapservices.weather.noaa.gov/eventdriven/rest/services/radar/radar_base_reflectivity_time/ImageServer'

