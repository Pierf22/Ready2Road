import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BigliettiChartComponent } from './biglietti-chart.component';

describe('BigliettiChartComponent', () => {
  let component: BigliettiChartComponent;
  let fixture: ComponentFixture<BigliettiChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BigliettiChartComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BigliettiChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
