import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';
import { AtmService } from 'src/app/services/atm.service';
import { Note } from 'src/models/classes/Note';

@Component({
  selector: 'app-atm',
  templateUrl: './atm.component.html',
  styleUrls: ['./atm.component.css']
})
export class AtmComponent implements OnInit {

  notes: Note[];
  value: number = 0;

  constructor(private atmService: AtmService, private adminService: AdminService,
    private _router: Router) {
    if(!this.adminService.admin){
      this._router.navigateByUrl('/admin');
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
    try{
      this.atmService.getAllNotes().subscribe(
        notes => {
          this.value = notes.total;
          console.log(notes);
          for (let note of this.notes) {
            for (let key of Object.keys(notes)) {
              if (note.name === key) {
                note.quantity = notes[key];
              }
            }
          }
        }
      )
    }catch(e){
      console.log(e)
    }
  }

  ngOnInit(): void {
  }

}
