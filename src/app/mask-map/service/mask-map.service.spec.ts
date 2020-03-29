import { TestBed } from '@angular/core/testing';

import { MaskMapService } from './mask-map.service';

describe('MaskMapService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MaskMapService = TestBed.get(MaskMapService);
    expect(service).toBeTruthy();
  });
});
