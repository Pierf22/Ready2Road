import { TestBed } from '@angular/core/testing';

import { AreapersonaleService } from './areapersonale.service';

describe('AreapersonaleService', () => {
  let service: AreapersonaleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AreapersonaleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
