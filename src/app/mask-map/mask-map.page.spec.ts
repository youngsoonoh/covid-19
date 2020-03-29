import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { MaskMapPage } from './mask-map.page';

describe('MaskMapPage', () => {
  let component: MaskMapPage;
  let fixture: ComponentFixture<MaskMapPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MaskMapPage],
      imports: [IonicModule.forRoot(), ExploreContainerComponentModule]
    }).compileComponents();

    fixture = TestBed.createComponent(MaskMapPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
