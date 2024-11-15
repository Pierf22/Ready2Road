import { TestBed } from '@angular/core/testing';

import { VenditoreService } from './venditore.service';

describe('VenditoreService', () => {
  let service: VenditoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VenditoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
