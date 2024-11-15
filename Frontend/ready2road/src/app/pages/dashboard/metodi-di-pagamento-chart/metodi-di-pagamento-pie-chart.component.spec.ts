import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { NgChartsModule } from 'ng2-charts';

import { MetodiDiPagamentoPieChart } from './metodi-di-pagamento-pie-chart.component';

describe('BigliettiPieChartComponent', () => {
  let component: MetodiDiPagamentoPieChart;
  let fixture: ComponentFixture<MetodiDiPagamentoPieChart>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MetodiDiPagamentoPieChart ],
      imports: [ NgChartsModule ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetodiDiPagamentoPieChart);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});
