import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListTratteComponent } from './list-tratte.component';

describe('TratteComponent', () => {
  let component: ListTratteComponent;
  let fixture: ComponentFixture<ListTratteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListTratteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListTratteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
