import { TestBed } from '@angular/core/testing';

import { BigliettiService } from './biglietti.service';

describe('BigliettiService', () => {
  let service: BigliettiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BigliettiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
