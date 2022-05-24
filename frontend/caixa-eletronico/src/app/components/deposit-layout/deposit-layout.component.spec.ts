import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepositLayoutComponent } from './deposit-layout.component';

describe('DepositLayoutComponent', () => {
  let component: DepositLayoutComponent;
  let fixture: ComponentFixture<DepositLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DepositLayoutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DepositLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
