import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaricaserviziComponent } from './caricaservizi.component';

describe('CaricaserviziComponent', () => {
  let component: CaricaserviziComponent;
  let fixture: ComponentFixture<CaricaserviziComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaricaserviziComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CaricaserviziComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
