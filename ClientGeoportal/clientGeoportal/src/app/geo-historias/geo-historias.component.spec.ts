import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeoHistoriasComponent } from './geo-historias.component';

describe('GeoHistoriasComponent', () => {
  let component: GeoHistoriasComponent;
  let fixture: ComponentFixture<GeoHistoriasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GeoHistoriasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeoHistoriasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
