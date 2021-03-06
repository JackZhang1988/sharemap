import { Injectable } from '@angular/core';

// let singleInstance = false;
const STATIC_MAP_KEY = 'c3b4477c4c2ad477141ee0358e4d1c82';

@Injectable()
export class GDMap {
    constructor() { }

    gdMap: any;
    auto: any;
    placeSearch: any;
    citySearch: any;
    city: String;
    curAddedMarker: any;
    mass: any;
    markerCluster: any;
    geocoder: any;
    pathPlan: any = {};
    pathPlanInstance: any;
    lastSearchPathType: string;
    clusterMap: any;

    getStaticMapKey() {
        return STATIC_MAP_KEY;
    }

    initMap(options?): any {
        let self = this;
        options = Object.assign({
            container: 'mapContainer',
            mapOps: {
                rotateEnable: false,
                dragEnable: true,
                zoomEnable: true,
                zooms: [3, 18],
                zoom: 15
            }
        }, options);
        self.gdMap = new AMap.Map(options.container, options.mapOps);
    }

    /**
     * 初始化带定位功能
     * @param options
     * @param options.success 定位成功callback
     * @param options.error 定位失败callback
     */
    initLocate(options: any = {}): any {
        let self = this;
        if (!self.gdMap) {
            self.initMap();
        }
        let geoOps = Object.assign({
            enableHighAccuracy: true, //是否使用高精度定位，默认:true
            timeout: 5000, //超过5秒后停止定位，默认：无穷大
            maximumAge: 0, //定位结果缓存0毫秒，默认：0
            convert: true, //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
            showButton: true, //显示定位按钮，默认：true
            buttonPosition: 'LB', //定位按钮停靠位置，默认：'LB'，左下角
            buttonOffset: new AMap.Pixel(10, 20), //定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
            showMarker: false, //定位成功后在定位到的位置显示点标记，默认：true
            markerOptions: {
                icon: '//webapi.amap.com/theme/v1.3/markers/n/mark_b.png'
            },
            showCircle: false, //定位成功后用圆圈表示定位精度范围，默认：true
            panToLocation: true, //定位成功后将定位到的位置作为地图中心点，默认：true
            zoomToAccuracy: true //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false,
        }, options.geoOps);

        AMap.plugin('AMap.Geolocation', () => {
            let geolocation = new AMap.Geolocation(geoOps);
            self.gdMap.addControl(geolocation);
            geolocation.getCurrentPosition();
            AMap.event.addListener(geolocation, 'complete', result => {
                // console.log('当前位置: ', result);
                if (!result.location) {
                    result.location = result.position;
                }
                options.success && options.success(result);
            }); //返回定位信息
            AMap.event.addListener(geolocation, 'error', err => {
                options.error && options.error(err);
            }); //返回定位出错信息
        });
    }

    /**
     * 初始化获取当前城市
     */
    initCity() {
        let self = this;
        AMap.plugin('AMap.CitySearch', () => {
            self.citySearch = new AMap.CitySearch();
            self.citySearch.getLocalCity((status, citySearchResult) => {
                if (status == 'complete') {
                    // console.log(citySearchResult);
                    self.city = citySearchResult.city;
                    self.initAutoSearch({
                        city: citySearchResult.city
                    });
                    AMap.plugin('AMap.PlaceSearch', () => {
                        self.placeSearch = new AMap.PlaceSearch({ map: self.gdMap });
                        self.placeSearch.setCity(citySearchResult.city);
                    });
                }
            });
        });
    }

    /**
     * 初始化地理位置转换功能
     */
    initGeocoder() {
        let self = this;
        AMap.plugin('AMap.Geocoder', () => {
            self.geocoder = new AMap.Geocoder();
        });
    }

    initGeolocation(ops: any = {}, onComplete?, onError?): void {
        let self = this;
        self.gdMap.plugin('AMap.Geolocation', function () {
            let geolocation = new AMap.Geolocation(
                Object.assign(
                    {
                        enableHighAccuracy: true, //是否使用高精度定位，默认:true
                        timeout: 5000, //超过5秒后停止定位，默认：无穷大
                        maximumAge: 0, //定位结果缓存0毫秒，默认：0
                        convert: true, //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
                        showButton: true, //显示定位按钮，默认：true
                        buttonPosition: 'LB', //定位按钮停靠位置，默认：'LB'，左下角
                        panToLocation: true, //定位成功后将定位到的位置作为地图中心点，默认：true
                        zoomToAccuracy: true //定位成功且显示精度范围时，是否把地图视野调整到正好显示精度范围，默认：false,
                    },
                    ops
                )
            );
            self.gdMap.addControl(geolocation);
            geolocation.getCurrentPosition((status, result) => {
                if (!result.location) {
                    result.location = result.position;
                }
                self.city = result.addressComponent.citycode;
                // console.log(status, result);
            });
            AMap.event.addListener(geolocation, 'complete', onComplete); //返回定位信息
            AMap.event.addListener(geolocation, 'error', onError); //返回定位出错信息
        });
    }
    initAutoSearch(autoOptions?: any): void {
        let self = this;
        autoOptions = autoOptions || {};
        self.gdMap.plugin('AMap.Autocomplete', function () {
            self.auto = new AMap.Autocomplete(autoOptions);
        });
        //构造地点查询类
        // AMap.event.addListener(self.auto, "select", selectCallback);//注册监听，当选中某条记录时会触发
        // function select(e) {
        //     self.placeSearch.setCity(e.poi.adcode);
        //     self.placeSearch.search(e.poi.name);  //关键字查询查询
        // }
    }

    /**
     * 初始化路径规划功能
     */
    initPathPlan(pannel?, ops: any = {}): void {
        let self = this;
        AMap.service('AMap.Driving', function () {
            self.pathPlan.driving = new AMap.Driving({
                map: self.gdMap,
                panel: pannel
            });
        });
        AMap.service('AMap.Transfer', function () {
            self.pathPlan.transfer = new AMap.Transfer({
                map: self.gdMap,
                city: self.city,
                panel: pannel
            });
        });
        AMap.service('AMap.Walking', function () {
            self.pathPlan.walking = new AMap.Walking({
                map: self.gdMap,
                panel: pannel
            });
        });
    }


    /**
     * 格式化地理位置信息
     * @param locationResult 高德地图返回的地理信息
     */
    formateLocationInfo(locationResult) {
        if (locationResult) {
            let building = locationResult.addressComponent.building;
            let city = locationResult.addressComponent.city;
            let province = locationResult.addressComponent.province;
            let district = locationResult.addressComponent.district;
            let township = locationResult.addressComponent.township;
            let result = {
                name:
                    building ? building : locationResult.formattedAddress
                        .replace(province, '')
                        .replace(city, '')
                        .replace(district, '')
                        .replace(township, ''),
                address: locationResult.formattedAddress,
                location: locationResult.location,
                district: locationResult.addressComponent.district,
                citycode: locationResult.addressComponent.citycode,
                adcode: locationResult.addressComponent.adcode
            };
            // console.log(locationResult.formattedAddress);
            // console.log(locationResult.addressComponent);
            // console.log(result.name);
            return result;
        }
    }

    addMassMarks(marks, ops: any = {}) {
        let self = this;
        self.mass = new AMap.MassMarks(
            marks,
            Object.assign(
                {
                    opacity: 0.8,
                    zIndex: 111,
                    cursor: 'pointer',
                    style: {
                        url: 'http://webapi.amap.com/theme/v1.3/markers/n/mark_b.png',
                        anchor: new AMap.Pixel(0, 0), // 图标显示位置偏移量，以图标的左上角为基准点（0,0）
                        size: new AMap.Size(16, 21) // 图标的尺寸
                    }
                },
                ops
            )
        );
        let marker = new AMap.Marker({ content: ' ', map: self.gdMap });
        self.mass.on('click', function (e) {
            marker.setPosition(e.data.lnglat);
            // marker.setLabel({ content: e.data.info.location });
            self.gdMap.setZoomAndCenter(15, e.data.lnglat);
            ops.markerClick && ops.markerClick(e.data);
        });
        self.mass.setMap(self.gdMap);
    }

    pathSearch(pathPlanType: string, fromLngLat: Number[], toLngLat: Number[], callback?: Function) {
        if (this.pathPlan[pathPlanType]) {
            this.lastSearchPathType = pathPlanType;
            this.pathPlanInstance = this.pathPlan[pathPlanType];
            this.pathPlanInstance.clear();
            this.pathPlan[pathPlanType].search(fromLngLat, toLngLat, callback);
        }
    }

    clearPathSearch(pathPlanType: string) {
        if (this.pathPlan[pathPlanType]) {
            this.pathPlan[pathPlanType].clear();
        }
    }

    clearLastPathSearch() {
        if (this.lastSearchPathType) {
            //清空上一个导航的地图路线
            this.pathPlan[this.lastSearchPathType].clear();
        }
    }

    autoSearch(keyword: String, callback: any): void {
        let self = this;
        self.auto.search(keyword, callback);
    }

    searchPlace(keyword: String, callback: any) {
        let plSearch = new AMap.PlaceSearch({
            //构造地点查询类
            pageSize: 5,
            pageIndex: 1,
            city: this.city //城市
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
            });
            this.gdMap.setFitView();
            callback && callback();
        }
    }

    /**
     * 添加基于font-awsome图标的marker
     * 参考：https://fontawesome.com/icons?d=gallery&m=free
     * @param markerObjList 
     *  markerObj marker对象，包含icon category信息:
     *      iconClass font-awsome icon 类名 example:fas fa-circle
     *      iconContent 显示文字icon，注：为保证显示效果，通常设置文字icon时，iconClass设置为fas
     * @param ops 
     *      isFitView 添加marker后是否自动调整地图
     */
    addIconMarkers(markerObjList: any[], options?: any) {
        // debugger;
        if (markerObjList.length) {
            let markerList = [];
            options = Object.assign(
                {
                    isFitView: true,
                },
                options
            );
            let iconDefaultWidth = 22;
            markerObjList.forEach((markerObj, index) => {
                // 设置默认样式
                let locationCategory = Object.assign({
                    iconClass: 'fas fa-circle',
                    iconColor: '#ff5d00',
                }, markerObj.locationCategory)
                if (markerObj.iconContent) {
                    // 如果设置icon Content，则默认为fas类
                    markerObj.iconClass = 'fas'
                }
                let marker = new AMap.Marker({
                    map: this.gdMap,
                    content: `<div class="icon-marker" style="background-color:${locationCategory.iconColor}"><i class="${locationCategory.iconClass}">${markerObj.iconContent || ''}</i></div>`,
                    position: markerObj.lnglat,
                    offset: new AMap.Pixel(-iconDefaultWidth, -iconDefaultWidth)
                })
                marker.on('click', function (e) {
                    options.markerClick && options.markerClick(e.target, index);
                });
                markerList.push(marker);
            });
            if (options.isFitView) {
                this.gdMap.setFitView();
            }
            return markerList;
        }
    }

    addMarkers(markList: any[], isFitView = true) {
        if (markList.length) {
            let markerList = [];
            markList.forEach(pos => {
                markerList.push(
                    new AMap.Marker({
                        map: this.gdMap,
                        // icon: marker.icon,
                        position: pos
                        // offset: new AMap.Pixel(-12, -36)
                    })
                );
            });
            if (isFitView) {
                this.gdMap.setFitView();
            }
            return markerList;
        }
    }

    posToMarker(pos: any[], options?: any) {
        options = Object.assign({ iconStyle: 'blue' }, options);
        if (pos && pos.length) {
            return new Promise((resolve, reject) => {
                AMapUI.loadUI(['overlay/SimpleMarker'], SimpleMarker => {
                    let result = new SimpleMarker({
                        //前景文字
                        iconLabel: {
                            // innerHTML: index + 1,
                            style: {
                                color: '#fff' //设置文字颜色
                            }
                        },
                        iconTheme: 'fresh',
                        //背景图标样式
                        iconStyle: options.iconStyle,

                        //...其他Marker选项...，不包括content
                        map: this.gdMap,
                        position: pos
                    });
                    resolve(result);
                });
            });
        }
    }

    addSimpleMarkers(posList: any[], options?: any) {
        if (posList && posList.length) {
            options = Object.assign({ iconStyle: 'blue' }, options);
            let markerList = [];
            let curMap = this.gdMap;
            AMapUI.loadUI(['overlay/SimpleMarker'], function (SimpleMarker) {
                posList.forEach((pos, index) => {
                    //创建SimpleMarker实例
                    let tt = new SimpleMarker({
                        //前景文字
                        iconLabel: {
                            // innerHTML: index + 1,
                            style: {
                                color: '#fff' //设置文字颜色
                            }
                        },
                        iconTheme: 'numv2',
                        //背景图标样式
                        iconStyle: options.iconStyle,

                        //...其他Marker选项...，不包括content
                        map: curMap,
                        position: pos
                    });
                    markerList.push(tt);
                });

                // 取消自适应view，让视图自动适配到定位位置
                if (options.setFitView) {
                    curMap.setFitView();
                }
                //点标记自适应的视图过大，重新定义点标记自适应的缩放级别
                curMap.setZoom(curMap.getZoom() - 1);

                options.callback && options.callback(markerList);
            });
        }
    }

    // addMarkerClusterer(markers, ops: any = {}) {
    //     let self = this;

    //         self.this.clusterMap = new AMap.MarkerClusterer(self.gdMap, markers, {
    //             styles: {
    //                 url: 'http://webapi.amap.com/theme/v1.3/markers/n/mark_b.png',
    //                 anchor: new AMap.Pixel(0, 0), // 图标显示位置偏移量，以图标的左上角为基准点（0,0）
    //                 size: new AMap.Size(20, 21) // 图标的尺寸
    //             }
    //         });
    //     });
    // }

    renderCluserMarker(posList: any[], options?: any) {
        let markers = [];
        for (var i = 0; i < posList.length; i += 1) {
            let marker = new AMap.Marker({
                position: posList[i]['lnglat'],
                extData: {
                    info: posList[i]['info']
                },
                content:
                    '<div style="background-color: hsla(180, 100%, 50%, 0.7); height: 24px; width: 24px; border: 1px solid hsl(180, 100%, 40%); border-radius: 12px; box-shadow: hsl(180, 100%, 50%) 0px 0px 1px;"></div>',
                offset: new AMap.Pixel(-15, -15)
            });
            marker.on('click', function (e) {
                options.markerClick && options.markerClick(e.target);
            });
            markers.push(marker);
        }
        var count = markers.length;
        let _renderCluserMarker = function (context) {
            let factor = Math.pow(context.count / count, 1 / 18);
            let div = document.createElement('div');
            let Hue = 180 - factor * 180;
            let bgColor = 'hsla(' + Hue + ',100%,50%,0.7)';
            let fontColor = 'hsla(' + Hue + ',100%,20%,1)';
            let borderColor = 'hsla(' + Hue + ',100%,40%,1)';
            let shadowColor = 'hsla(' + Hue + ',100%,50%,1)';
            div.style.backgroundColor = bgColor;
            let size = Math.round(30 + Math.pow(context.count / count, 1 / 5) * 20);
            div.style.width = div.style.height = size + 'px';
            div.style.border = 'solid 1px ' + borderColor;
            div.style.borderRadius = size / 2 + 'px';
            div.style.boxShadow = '0 0 1px ' + shadowColor;
            div.innerHTML = context.count;
            div.style.lineHeight = size + 'px';
            div.style.color = fontColor;
            div.style.fontSize = '14px';
            div.style.textAlign = 'center';
            context.marker.setOffset(new AMap.Pixel(-size / 2, -size / 2));
            context.marker.setContent(div);
        };
        options = Object.assign({ tag: 2 }, options);
        AMap.plugin('AMap.MarkerClusterer', () => {
            if (this.clusterMap) {
                this.clusterMap.setMap(null);
            }
            if (options.tag == 2) {
                //完全自定义
                this.clusterMap = new AMap.MarkerClusterer(this.gdMap, markers, {
                    gridSize: 80,
                    renderCluserMarker: _renderCluserMarker
                });
            } else if (options.tag == 1) {
                //自定义图标
                var sts = [
                    {
                        url: 'http://a.amap.com/jsapi_demos/static/images/blue.png',
                        size: new AMap.Size(32, 32),
                        offset: new AMap.Pixel(-16, -16)
                    },
                    {
                        url: 'http://a.amap.com/jsapi_demos/static/images/green.png',
                        size: new AMap.Size(32, 32),
                        offset: new AMap.Pixel(-16, -16)
                    },
                    {
                        url: 'http://a.amap.com/jsapi_demos/static/images/orange.png',
                        size: new AMap.Size(36, 36),
                        offset: new AMap.Pixel(-18, -18)
                    },
                    {
                        url: 'http://a.amap.com/jsapi_demos/static/images/red.png',
                        size: new AMap.Size(48, 48),
                        offset: new AMap.Pixel(-24, -24)
                    },
                    {
                        url: 'http://a.amap.com/jsapi_demos/static/images/darkRed.png',
                        size: new AMap.Size(48, 48),
                        offset: new AMap.Pixel(-24, -24)
                    }
                ];
                this.clusterMap = new AMap.MarkerClusterer(this.gdMap, markers, {
                    styles: sts,
                    gridSize: 80
                });
            } else {
                //默认样式
                this.clusterMap = new AMap.MarkerClusterer(this.gdMap, markers, { gridSize: 80 });
            }
        });
        return markers;
    }

    setFitView() {
        this.gdMap.setFitView();
    }

    getStaticMapImg(paramStr) {
        return 'http://restapi.amap.com/v3/staticmap?' + paramStr + '&key=' + STATIC_MAP_KEY;
    }

    highlightMarker(marker: any) {
        if (marker) {
            marker.setIconStyle('red');
        }
    }

    unHighlightMarker(marker: any) {
        if (marker) {
            marker.setIconStyle('blue');
        }
    }

    highlightIconMarker(iconMarker: any) {
        if (iconMarker) {
            let content = iconMarker.getContent();
            iconMarker.setContent(content.replace('icon-marker', 'icon-marker cur'));
            iconMarker.setOffset(new AMap.Pixel(-34, -34));
            iconMarker.setzIndex(9999);
        }
    }

    unhighlightIconMarker(iconMarker: any) {
        if (iconMarker) {
            let content = iconMarker.getContent();
            iconMarker.setzIndex(1);
            iconMarker.setContent(content.replace(/ cur/gi, ''));
            iconMarker.setOffset(new AMap.Pixel(-22, -22));
        }
    }

    setZoomAndCenter(lnglat: Number[], zoom: number = 14) {
        if (lnglat && lnglat.length) {
            this.gdMap.setZoomAndCenter(zoom, lnglat);
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
        };
        let isDrag = false; //标示是否是drag状态
        this.gdMap.on('dragstart', () => {
            isDrag = true;
            this.curAddedMarker.hide();
            this.gdMap.addControl(customControl);
        });
        this.gdMap.on('moveend', () => {
            if (!isDrag) {
                // 非drag行为不触发moveend事件处理
                return;
            }
            this.gdMap.removeControl(customControl);
            let position = this.gdMap.getCenter();
            if (this.curAddedMarker) {
                this.curAddedMarker.setPosition(position);
                this.curAddedMarker.show();
            }
            this.geocoder.getAddress(position, (status, result) => {
                if (result) {
                    result.regeocode.location = position;
                    onSelected && onSelected(result.regeocode);
                }
            });
        });
    }
}
