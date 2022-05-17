import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from 'src/app/services/account.service';
import { OperationService } from 'src/app/services/operation.service';
import { WarningService } from 'src/app/services/warning.service';
import { Note } from 'src/models/classes/Note';

@Component({
  selector: 'app-withdraw',
  templateUrl: './withdraw.component.html',
  styleUrls: ['./withdraw.component.css']
})
export class WithdrawComponent implements OnInit {

  value: number = 0;
  finished: boolean = false;
  drawing: boolean = false;
  notes: Note[];

  constructor(private _router: Router, private warningService: WarningService,
    private operationService: OperationService, private accountService: AccountService) {
    if (!accountService.account) {
      _router.navigateByUrl('/');
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
    operationService.onWithdraw().subscribe(notes => {
      for (let note of this.notes) {
        for (let key of Object.keys(notes)) {
          if (note.name === key) {
            note.quantity = notes[key];
          }
        }
      }
      this.withdrawTimeout();
    });
  }

  ngOnInit(): void {
  }

  withdrawTimeout():void{
    this.drawing = true;
    setTimeout(() => {
      this.finished = true;
      this.drawing = false;
    }, 10000);
  }

  handleSubmit(): void {
    if (this.value > 0) {
      if (!isNaN(this.value)) {
        this.operationService.withdraw(this.value);
      } else {
        this.warningService.displayWarning('danger', 'É necessário digitar um número!', 5000);
      }
    } else {
      this.warningService.displayWarning('danger', 'É necessário digitar um valor para sacar!', 4000);
    }
  }

  logout(): void {
    this.accountService.logout();  
  }

}
