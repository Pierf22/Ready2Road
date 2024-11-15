import { TestBed } from '@angular/core/testing';

import { AcquistoService } from './acquisto.service';

describe('AcquistoService', () => {
  let service: AcquistoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AcquistoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
