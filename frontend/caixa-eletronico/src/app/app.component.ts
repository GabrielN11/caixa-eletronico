import { Component, OnInit } from '@angular/core';
import Client from 'src/models/classes/client';
import { ClientService } from './services/client.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  loginPage: boolean = false;
  client: Client | undefined;

  constructor(private clientService: ClientService){
    this.clientService.onChange().subscribe(client => {
      this.client = client;
    })
  }

  ngOnInit(): void {
  }
}
