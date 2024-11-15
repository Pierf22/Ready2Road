import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CambiaDatiUtenteComponent } from './cambia-dati-utente.component';

describe('CambiaDatiUtenteComponent', () => {
  let component: CambiaDatiUtenteComponent;
  let fixture: ComponentFixture<CambiaDatiUtenteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CambiaDatiUtenteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CambiaDatiUtenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
