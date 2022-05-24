import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AtmDepositComponent } from './atm-deposit.component';

describe('AtmDepositComponent', () => {
  let component: AtmDepositComponent;
  let fixture: ComponentFixture<AtmDepositComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AtmDepositComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AtmDepositComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
