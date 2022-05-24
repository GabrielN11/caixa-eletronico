import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoteCountComponent } from './note-count.component';

describe('NoteCountComponent', () => {
  let component: NoteCountComponent;
  let fixture: ComponentFixture<NoteCountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NoteCountComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NoteCountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
