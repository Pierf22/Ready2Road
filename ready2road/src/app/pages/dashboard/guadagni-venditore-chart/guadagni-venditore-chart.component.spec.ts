import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuadagniVenditoreChartComponent } from './guadagni-venditore-chart.component';

describe('GuadagniVenditoreChartComponent', () => {
  let component: GuadagniVenditoreChartComponent;
  let fixture: ComponentFixture<GuadagniVenditoreChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GuadagniVenditoreChartComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GuadagniVenditoreChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
