import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Note } from 'src/models/classes/Note';

@Component({
  selector: 'app-deposit-layout',
  templateUrl: './deposit-layout.component.html',
  styleUrls: ['./deposit-layout.component.css']
})
export class DepositLayoutComponent implements OnInit {

  @Input() notes: Note[] = [];
  @Output() notesChange = new EventEmitter<Note[]>();
  @Input() value: number = 0;
  @Output() valueChange = new EventEmitter<number>();
  @Output() handleSubmit = new EventEmitter<void>();
  @Input() return_url: string = '/';


  constructor() { }

  ngOnInit(): void {
  }

  addNote(note: Note):void{
    this.valueChange.emit(this.value += note.value);
    this.notes.map((noteObj: Note) => noteObj.name === note.name ? noteObj.quantity += 1 : noteObj);
    this.notesChange.emit(this.notes);
  }

  clear():void{
    this.notes = this.notes.map((note:Note) => {
      note.quantity = 0;
      return note
    })

    this.value = 0;
  }

  onSubmit():void{
    this.handleSubmit.emit();
  }

}
