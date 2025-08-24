import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelesEstadisticaComponent } from './paneles-estadistica.component';

describe('PanelesEstadisticaComponent', () => {
  let component: PanelesEstadisticaComponent;
  let fixture: ComponentFixture<PanelesEstadisticaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PanelesEstadisticaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PanelesEstadisticaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
