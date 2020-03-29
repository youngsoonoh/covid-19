import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaskMapPage } from './mask-map.page';
import { Geolocation } from '@ionic-native/geolocation';
import { GoogleMapsModule } from '@angular/google-maps';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([{path: '', component: MaskMapPage}]),
    GoogleMapsModule
  ],
  declarations: [MaskMapPage],
  providers: []
})
export class MaskMapPageModule {
}
