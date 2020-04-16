import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MaskMapService } from './service/mask-map.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { AlertController, IonFab, IonInfiniteScroll, IonInput } from '@ionic/angular';
import { GoogleMap, MapInfoWindow, MapMarker } from '@angular/google-maps';
import { RemainStat } from './model/remain-stat.enum';

@Component({
  selector: 'app-mask-map',
  templateUrl: 'mask-map.page.html',
  styleUrls: ['mask-map.page.scss']
})
export class MaskMapPage implements OnInit, AfterViewInit {
  @ViewChild('searchBar') searchBar: IonInput;
  @ViewChild(GoogleMap, {static: false}) map: GoogleMap;
  @ViewChild(MapInfoWindow, {static: false}) info: MapInfoWindow;
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  zoom = 15;
  center: google.maps.LatLngLiteral;
  options: google.maps.MapOptions = {
    maxZoom: 17,
    minZoom: 7,
  };

  markers = [];
  infoContent;
  initialSearch;
  searchMode;
  remainFilter = {plenty: true, some: true, few: true, empty: true, break: true};
  isFabListOpen = true;

  constructor(
    private maskMapService: MaskMapService,
    private geolocation: Geolocation,
    private alertCtrl: AlertController
  ) {
  }

  ngOnInit(): void {
    this.initialSearch = 'mapSearch';
    this.searchMode = 'map';
    this.presentAlert();
  }

  ngAfterViewInit(): void {
    this.geolocation.getCurrentPosition().then((position) => {
      this.center = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      this.getInputElement(this.searchBar);
      this.findStore();
    });
    this.centerChangedEvent();
  }

  listChange(event: any) {
    if (event.detail.value === 'mapSearch') {
      this.searchMode = 'map';
    } else {
      this.searchMode = 'list';
    }
  }

  deg2rad(deg) {
    return deg * Math.PI / 180;
  }

  private findStore() {
    this.maskMapService.getStore(this.center.lat, this.center.lng, this.zoomToMeter()).subscribe((res) => {
      this.markers = [];
      // res.body.stores.filter();
      let stores = res.body.stores;
      stores = this.checkRemain(stores);
      stores.forEach(x => {
        const markerContent = this.setMarkerColor(x.remain_stat);

        const distance = this.checkDistance(x);

        let quantity;
        if (x.remain_stat === 'empty') {
          quantity = '매진';
        } else if (x.remain_stat === 'few') {
          quantity = '2개 이상 30개 미만';
        } else if (x.remain_stat === 'some') {
          quantity = '30개 이상 100개 미만';
        } else if (x.remain_stat === 'plenty') {
          quantity = '100개 이상';
        }

        this.markers.push({
          position: {
            lat: x.lat,
            lng: x.lng
          },
          // label: {
          //   color: markerColor,
          //   text: x.name
          // },
          title: x.name,
          addr: x.addr,
          distanceBetween: distance,
          remainStat: quantity,
          info: `${x.name}
                  <br/> 재고 : ${quantity}
                  <br/> 입고시간 : ${x.stock_at}
                  <br/> 업데이트 시간 : ${x.created_at}
                  <br/> 거리 : ${distance}`,
          stock_at: x.stock_at,
          created_at: x.created_at,
          options: {
            icon: {
              url: markerContent.color,
              scaledSize: new google.maps.Size(40, 40)
            },
          }
        });
      });
    });

    // console.log('marker', this.markers);
  }

  private checkDistance(x) {
    let distance;
    const earthRadiusKm = 6371;
    const dLat = this.deg2rad(x.lat - this.center.lat);
    const dLon = this.deg2rad(x.lng - this.center.lng);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
      + Math.sin(dLon / 2) * Math.sin(dLon / 2) *
      Math.cos(x.lat) * Math.cos(this.center.lat);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const m = earthRadiusKm * c * 1000.0; // Distance in m
    distance = m.toFixed(2);
    distance = Math.floor(distance) + 'm';

    // Calc km
    if (m >= 1000.0) {
      const km = earthRadiusKm * c;
      distance = km.toFixed(2);
      distance = distance + 'km';
    }
    return distance;
  }

  private checkRemain(stores) {
    stores = stores.filter(x => x.remain_stat !== 'break');
    stores = stores.filter(x => x.remain_stat !== null);
    if (!this.remainFilter.plenty) {
      stores = stores.filter(x => x.remain_stat !== 'plenty');
    }
    if (!this.remainFilter.some) {
      stores = stores.filter(x => x.remain_stat !== 'some');
    }
    if (!this.remainFilter.few) {
      stores = stores.filter(x => x.remain_stat !== 'few');
    }
    if (!this.remainFilter.empty) {
      stores = stores.filter(x => x.remain_stat !== 'empty');
    }
    return stores;
  }

  openInfo(marker: MapMarker, info) {
    // console.log('info :', info);
    this.infoContent = info;
    this.info.open(marker);
  }

  mapMove() {
    this.center = this.map.getCenter().toJSON();
    this.findStore();
    // this.center = event.latLng.toJSON();
  }

  getInputElement(elRef: IonInput) {
    elRef.getInputElement().then((input: HTMLInputElement) => {
      const autocomplete = new google.maps.places.Autocomplete(
        input, {
          componentRestrictions: {country: 'KR'},
          types: ['establishment', 'geocode']  // 'establishment' / 'address' / 'geocode'
        });

      google.maps.event.addListener(autocomplete, 'place_changed', () => {
        // get the place result
        const place = autocomplete.getPlace();

        // verify result
        if (place.geometry === undefined || place.geometry === null) {
          return;
        }

        // set latitude, longitude and zoom
        this.center = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        };
        this.zoom = 15;
        input.value = '';
        this.findStore();
      });
    });
  }

  async presentAlert() {
    const alert = await this.alertCtrl.create(
      {
        header: '공적 마스크 검색(베타)',
        subHeader: '현장과 다를 수 있습니다. ',
        message: '1. 1주당 1인 2매 구매제한<br>' +
          '2. 요일별 구매 5부제<br>',
        /*   inputs: [
             {
               name: 'year',
               placeholder: '출생년도를 입력하세요 (ex 1980)'
             }
           ],*/

        buttons: [
          {
            text: '닫기',
            role: 'cancel',
            handler: data => {
              console.log('Cancel clicked');
            }
          },
          /* {
             text: '검증',
             handler: data => {

             }
           }*/
        ]
      });
    await alert.present();
  }

  zoomToMeter() {
    const zoomMeter = [24576000, 12288000, 6144000, 3072000, 1536000, 768000, 384000, 192000,
      96000, 48000, 24000, 12000, 6000, 3000, 1500, 750, 375, 188, 94, 47, 23];

    return zoomMeter[this.zoom - 1];
  }

  private setMarkerColor(remainStat: string) {
    if (remainStat === 'plenty') {
      return {color: './assets/icon/mask_icon_green.png', remain: '100개 이상'};
    } else if (remainStat === 'some') {
      return {color: './assets/icon/mask_icon_orange.png', remain: '30개 이상 100개미만'};
    } else if (remainStat === 'few') {
      return {color: './assets/icon/mask_icon_red.png', remain: '2개 이상 30개 미만'};
    } else {
      return {color: './assets/icon/mask_icon_gray.png', remain: '매진'};
    }
  }

  private centerChangedEvent() {
    google.maps.event.addListener(this.map, 'dragend', () => {
      console.log('event, ', this.map);
    });
  }

  changeRemain(event, state: string) {
    if (!event.target.checked) {
      this.checked(state, false);
    } else {
      this.checked(state, true);
    }
    this.findStore();
  }

  private checked(state: string, checked: boolean) {
    if (state === RemainStat.PLENTY) {
      this.remainFilter.plenty = checked;
    } else if (state === RemainStat.SOME) {
      this.remainFilter.some = checked;
    } else if (state === RemainStat.FEW) {
      this.remainFilter.few = checked;
    } else {
      this.remainFilter.empty = checked;
    }
  }

}
