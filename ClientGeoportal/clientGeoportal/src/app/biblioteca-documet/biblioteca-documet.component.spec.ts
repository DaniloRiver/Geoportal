import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BibliotecaDocumetComponent } from './biblioteca-documet.component';

describe('BibliotecaDocumetComponent', () => {
  let component: BibliotecaDocumetComponent;
  let fixture: ComponentFixture<BibliotecaDocumetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BibliotecaDocumetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BibliotecaDocumetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
