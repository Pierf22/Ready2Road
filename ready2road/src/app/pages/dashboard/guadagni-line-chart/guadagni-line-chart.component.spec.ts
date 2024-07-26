import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuadagniLineChartComponent } from './guadagni-line-chart.component';

describe('GuadagniLineChartComponent', () => {
  let component: GuadagniLineChartComponent;
  let fixture: ComponentFixture<GuadagniLineChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GuadagniLineChartComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GuadagniLineChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
