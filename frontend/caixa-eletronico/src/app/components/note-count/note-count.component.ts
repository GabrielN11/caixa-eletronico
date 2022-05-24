import { Component, Input, OnInit } from '@angular/core';
import { AccountService } from 'src/app/services/account.service';
import { Note } from 'src/models/classes/Note';

@Component({
  selector: 'app-note-count',
  templateUrl: './note-count.component.html',
  styleUrls: ['./note-count.component.css']
})
export class NoteCountComponent implements OnInit {

  @Input() notes: Note[] = [];
  @Input() value: number = 0;
  @Input() is_adm: boolean = false;
  @Input() return_url: string = '/';

  constructor(private accountService: AccountService) { }

  ngOnInit(): void {
  }

  logout(): void {
    this.accountService.logout();  
  }

}
