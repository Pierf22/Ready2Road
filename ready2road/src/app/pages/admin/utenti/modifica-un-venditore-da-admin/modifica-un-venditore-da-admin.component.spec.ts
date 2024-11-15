import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModificaUnVenditoreDaAdminComponent } from './modifica-un-venditore-da-admin.component';

describe('ModificaUnVenditoreDaAdminComponent', () => {
  let component: ModificaUnVenditoreDaAdminComponent;
  let fixture: ComponentFixture<ModificaUnVenditoreDaAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModificaUnVenditoreDaAdminComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModificaUnVenditoreDaAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
