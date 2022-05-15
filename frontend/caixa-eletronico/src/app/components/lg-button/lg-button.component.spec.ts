import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LgButtonComponent } from './lg-button.component';

describe('LgButtonComponent', () => {
  let component: LgButtonComponent;
  let fixture: ComponentFixture<LgButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LgButtonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LgButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
