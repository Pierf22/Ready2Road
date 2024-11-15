import { TestBed } from '@angular/core/testing';

import { ConversazioneService } from './conversazione.service';

describe('ConversazioneService', () => {
  let service: ConversazioneService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConversazioneService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
