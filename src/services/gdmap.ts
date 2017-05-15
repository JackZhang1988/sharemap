import { Injectable } from '@angular/core';

import { LngLat } from '../common/models';

// let singleInstance = false;

@Injectable()
export class GDMap {

  constructor() {}

  gdMap: any;
  auto: any;
  placeSearch: any;
  citySearch: any;
  city: String;
  curAddedMarker: any;
  geocoder: any;

  initMap(pos?: LngLat, container: string = 'mapContainer'): any {
    let self = this;
    self.gdMap = new AMap.Map(container, {
      rotateEnable: true,
      dragEnable: true,
      zoomEnable: true,
      zooms: [3, 18],
      zoom: 15,
    });
  }
  initLocateMap(options: any = {}): any {
    let self = this;
    options = Object.assign(options, { container: 'mapContainer' });
    self.gdMap = new AMap.Map(options.container, {
      rotateEnable: true,
      dragEnable: true,
      zoomEnable: true,
      zooms: [3, 18],
      zoom: 15,
    });
    self.gdMap.plugin(['AMap.Geolocation', 'AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.CitySearch', 'AMap.Marker', 'AMap.Geocoder'], function () {
      let geolocation = new AMap.Geolocation({
        enableHighAccuracy: true, //是否使用高精度定位，默认:true
        timeout: 5000, //超过5秒后停止定位，默认：无穷大
        maximumAge: 0, //定位结果缓存0毫秒，默认：0
        convert: true, //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
        showButton: true, //显示定位按钮，默认：true
        buttonPosition: 'RB', //定位按钮停靠位置，默认：'LB'，左下角
        buttonOffset: new AMap.Pixel(10, 20), //定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
        showMarker: true, //定位成功后在定位到的位置显示点标记，默认：true
        showCircle: true, //定位成功后用圆圈表示定位精度范围，默认：true
        panToLocation: true, //定位成功后将定位到的位置作为地图中心点，默认：true
        zoomToAccuracy: true //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
      });
      self.gdMap.addControl(geolocation);
      geolocation.getCurrentPosition();

      AMap.event.addListener(geolocation, 'complete', (result) => {
      }); //返回定位信息
      AMap.event.addListener(geolocation, 'error', options.onError); //返回定位出错信息

      self.citySearch = new AMap.CitySearch();
      self.citySearch.getLocalCity((status, citySearchResult) => {
        if (status == 'complete') {
          console.log(citySearchResult);
          self.city = citySearchResult.city;
          self.initAutoSearch({
            city: citySearchResult.city
          });
          self.placeSearch = new AMap.PlaceSearch({ map: self.gdMap });
          self.placeSearch.setCity(citySearchResult.city);
        }
      })
      self.geocoder = new AMap.Geocoder();
    })
  }
  initGeolocation(onComplete?, onError?): void {
    let self = this;
    self.gdMap.plugin('AMap.Geolocation', function () {
      let geolocation = new AMap.Geolocation({
        enableHighAccuracy: true, //是否使用高精度定位，默认:true
        timeout: 5000, //超过5秒后停止定位，默认：无穷大
        maximumAge: 0, //定位结果缓存0毫秒，默认：0
        convert: true, //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
        showButton: true, //显示定位按钮，默认：true
        buttonPosition: 'RB', //定位按钮停靠位置，默认：'LB'，左下角
        buttonOffset: new AMap.Pixel(10, 20), //定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
        showMarker: true, //定位成功后在定位到的位置显示点标记，默认：true
        showCircle: true, //定位成功后用圆圈表示定位精度范围，默认：true
        panToLocation: true, //定位成功后将定位到的位置作为地图中心点，默认：true
        zoomToAccuracy: true //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
      });
      self.gdMap.addControl(geolocation);
      geolocation.getCurrentPosition();
      AMap.event.addListener(geolocation, 'complete', onComplete); //返回定位信息
      AMap.event.addListener(geolocation, 'error', onError); //返回定位出错信息
    });
  }
  initAutoSearch(autoOptions?: any): void {
    let self = this;
    autoOptions = autoOptions || {};
    self.gdMap.plugin('AMap.Autocomplete', function () {
      self.auto = new AMap.Autocomplete(autoOptions);
    })
    //构造地点查询类
    // AMap.event.addListener(self.auto, "select", selectCallback);//注册监听，当选中某条记录时会触发
    // function select(e) {
    //     self.placeSearch.setCity(e.poi.adcode);
    //     self.placeSearch.search(e.poi.name);  //关键字查询查询
    // }
  }

  autoSearch(keyword: String, callback: any): void {
    let self = this;
    self.auto.search(keyword, callback);
  }

  searchPlace(keyword: String, callback: any) {
    let plSearch = new AMap.PlaceSearch({ //构造地点查询类
      pageSize: 5,
      pageIndex: 1,
      city: this.city//城市
    });
    plSearch.search(keyword, callback);
  }

  addMarker(position: Number[], callback?: any) {
    if (position.length) {
      // let marker = new AMap.Marker({
      //   icon: "http://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
      //   position: position
      // });
      // marker.setMap(this.gdMap);
      this.curAddedMarker = new AMap.Marker({
        map: this.gdMap,
        position: position
      })
      this.gdMap.setFitView();
      callback && callback();
    }
  }

  addMarkers(markList: any[]) {
    if (markList.length) {
      markList.forEach(pos => {
        new AMap.Marker({
          map: this.gdMap,
          // icon: marker.icon,
          position: pos,
          // offset: new AMap.Pixel(-12, -36)
        });
      })
      this.gdMap.setFitView();
      return this.gdMap;
    }
  }

  clearMap() {
    this.gdMap.clearMap();
  }

  initDragLocate(onSelected?: any) {
    let content = document.createElement('div');
    content.innerHTML = "<img src='http://webapi.amap.com/theme/v1.3/markers/n/mark_b.png'>";
    content.className = 'customControl';
    let customControl = {
      dom: content,
      addTo: () => {
        let curCtn = this.gdMap.getContainer();
        curCtn.appendChild(customControl.dom);
      },
      removeFrom: () => {
        let curCtn = this.gdMap.getContainer();
        if (customControl.dom.parentNode == curCtn) {
          curCtn.removeChild(customControl.dom);
        }
      }
    }
    this.gdMap.on('dragstart', () => {
      this.curAddedMarker.hide();
      this.gdMap.addControl(customControl);
    })
    this.gdMap.on('moveend', () => {
      this.gdMap.removeControl(customControl);
      let position = this.gdMap.getCenter();
      this.curAddedMarker.setPosition(position);
      this.curAddedMarker.show();
      this.geocoder.getAddress(position, (status, result) => {
        result.regeocode.location = position;
        onSelected && onSelected(result.regeocode);
      })

    })
  }

}
