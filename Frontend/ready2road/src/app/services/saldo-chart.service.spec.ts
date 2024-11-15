import { TestBed } from '@angular/core/testing';

import { SaldoChartService } from './saldo-chart.service';

describe('SaldoChartService', () => {
  let service: SaldoChartService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SaldoChartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
