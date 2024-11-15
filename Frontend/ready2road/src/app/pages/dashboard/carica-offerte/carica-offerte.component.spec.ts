import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaricaOfferteComponent } from './carica-offerte.component';

describe('CaricaOfferteComponent', () => {
  let component: CaricaOfferteComponent;
  let fixture: ComponentFixture<CaricaOfferteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaricaOfferteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CaricaOfferteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
