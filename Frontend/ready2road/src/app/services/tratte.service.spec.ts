import { TestBed } from '@angular/core/testing';

import { TratteService } from './tratte.service';

describe('TratteServiceService', () => {
  let service: TratteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TratteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
