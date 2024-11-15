import { TestBed } from '@angular/core/testing';

import { CaricaServiziService } from './carica-servizi.service';

describe('CaricaServiziService', () => {
  let service: CaricaServiziService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CaricaServiziService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
