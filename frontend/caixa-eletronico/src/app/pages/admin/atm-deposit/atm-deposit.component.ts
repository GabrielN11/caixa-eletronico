import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';
import { AtmService } from 'src/app/services/atm.service';
import { WarningService } from 'src/app/services/warning.service';
import { Note } from 'src/models/classes/Note';

@Component({
  selector: 'app-atm-deposit',
  templateUrl: './atm-deposit.component.html',
  styleUrls: ['./atm-deposit.component.css']
})
export class AtmDepositComponent implements OnInit {

  notes: Note[] = [];
  value: number = 0;

  constructor(private adminService: AdminService, private _router: Router, private atmService: AtmService,
    private warningService: WarningService) {
    if(!adminService.admin){
      _router.navigateByUrl('/admin')
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

  handleSubmit():void{
    const responseObj = {
      'note_2': this.notes[0].quantity,
      'note_5': this.notes[1].quantity,
      'note_10': this.notes[2].quantity,
      'note_20': this.notes[3].quantity,
      'note_50': this.notes[4].quantity,
      'note_100': this.notes[5].quantity,
      'note_200': this.notes[6].quantity,
      'total_value': this.value
    }

    this.atmService.deposit(responseObj).subscribe(
      (response) => {
        this.warningService.displayWarning('success', response, 3500);
        this._router.navigateByUrl('/admin/panel');
      },
      (error) => {
        this.warningService.displayWarning('danger', error, 4000);
      }
    );
  }

}
