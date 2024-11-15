import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TratteDiUnVenditoreComponent } from './tratte-di-un-venditore.component';

describe('TratteDiUnVenditoreComponent', () => {
  let component: TratteDiUnVenditoreComponent;
  let fixture: ComponentFixture<TratteDiUnVenditoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TratteDiUnVenditoreComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TratteDiUnVenditoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
