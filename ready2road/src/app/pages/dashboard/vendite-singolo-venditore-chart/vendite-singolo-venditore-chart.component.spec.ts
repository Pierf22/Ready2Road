import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VenditeSingoloVenditoreChartComponent } from './vendite-singolo-venditore-chart.component';

describe('VenditeSingoloVenditoreChartComponent', () => {
  let component: VenditeSingoloVenditoreChartComponent;
  let fixture: ComponentFixture<VenditeSingoloVenditoreChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VenditeSingoloVenditoreChartComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VenditeSingoloVenditoreChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
