import { TestBed } from '@angular/core/testing';

import { TracciamentoService } from './tracciamento.service';

describe('TracciamentoService', () => {
  let service: TracciamentoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TracciamentoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
