import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from 'src/app/services/account.service';
import { OperationService } from 'src/app/services/operation.service';
import { WarningService } from 'src/app/services/warning.service';
import { Note } from 'src/models/classes/Note';

@Component({
  selector: 'app-deposit',
  templateUrl: './deposit.component.html',
  styleUrls: ['./deposit.component.css']
})
export class DepositComponent implements OnInit {

  notes: Note[];
  value: number = 0;

  constructor(private operationService: OperationService, private warningService: WarningService,
    private _router: Router, private accountService: AccountService) {
    if(!accountService.account){
      _router.navigateByUrl('/')
    }
    this.notes = [
      new Note(2, 'nota_2.jpg', 'note_2', 0),
      new Note(5, 'nota_5.jpg', 'note_5', 0),
      new Note(10, 'nota_10.jpg', 'note_10', 0),
      new Note(20, 'nota_20.jpg', 'note_20', 0),
      new Note(50, 'nota_50.jpg', 'note_50', 0),
      new Note(100, 'nota_100.jpg', 'note_100', 0),
      new Note(200, 'nota_200.jpg', 'note_200', 0)
    ]
   }

  ngOnInit(): void {
  }

  addNote(note: Note):void{
    this.value += note.value;
    note.quantity += 1;
  }

  clear():void{
    this.notes = this.notes.map((note:Note) => {
      note.quantity = 0;
      return note
    })

    this.value = 0;
  }

  handleSubmit():void{
    if(this.value === 0){
      this.warningService.displayWarning('danger', 'É necessário depositar um valor.', 4000);
    }else{
      const notes = {
        'total_value': this.value,
        'note_2': this.notes[0].quantity,
        'note_5': this.notes[1].quantity,
        'note_10': this.notes[2].quantity,
        'note_20': this.notes[3].quantity,
        'note_50': this.notes[4].quantity,
        'note_100': this.notes[5].quantity,
        'note_200': this.notes[6].quantity
      }
      this.operationService.deposit(notes, this.value);
    }
  }

}
